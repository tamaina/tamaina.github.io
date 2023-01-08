---
publishedAt: 2023-01-09
---

# cloudflaredでMisskeyサーバーを立ち上げるメモ
cloudflared (Cloudflare Zero Trust, Cloudflare Tunnels)でMisskeyサーバーを立ち上げます。Misskeyのインストールはbash-installで行います。

作業中にメモするのではなく作業後に記事を書いたため、抜けや間違いがある気がします。

## Cloudflare Tunnels 特徴

### 利点
- ポート解放しなくて良い（クラウドサービスのエグレスルール以外のルールは弄らなくて良さそう）
- IPアドレスが変わっても平気

### 欠点？
- 手順数は減らない、むしろ特殊な作業なので面倒なまである
- Cloudflareにドメインを登録する必要がある、つまり結局ドメインを買う必要はある

## Cloudflareのセットアップ
Cloudflareにサインアップしていない場合はまずサインアップする。  
そして、ドメインをClouflareに登録しよう。

## Cloudflare Zero Trustのセットアップ

Cloudflare Zero Trustのダッシュボード https://one.dash.cloudflare.com/ にアクセスする。

### アクセスグループの作成
Access > Access Groupsでアクセスグループを作成する。

名前は適当で良い。

Group configurationのIncludeで、Selector = Emails / Value = 自分が受信可能なメールアドレス を設定する。

### ログインメソッドの設定
Settings > Authentication > Login methodsでAdd newを選択したのち、One-time PINを選択。  
選択するだけでログインメソッドにOne-time PINが追加される。

## トンネルの作成とマシンへのセットアップ
Cloudflare Tunnelsをセットアップする。

最新の情報を以下のURLで確認すること。  
https://developers.cloudflare.com/cloudflare-one/connections/connect-apps/install-and-setup/tunnel-guide/remote/

## バッファサイズを拡張する
ネットワーク接続のバッファサイズを拡張するため、サーバーで次のコマンドを実行する。

```bash
sudo sysctl -w net.core.rmem_max=2500000
```

もしこれを忘れるか後回しにした場合は、cloudflaredのデーモンを再起動する。  
（順番通りに読んでいる場合は実行しなくて良い）

```bash
sudo systemctl restart cloudflared
```

## トンネルを作成しコマンド実行
Zero TrustダッシュボードでAccess > Tunnelsを開き、Create a tunnelを選択。名前は適当で良い。

Choose your environmentでOSとアーキテクチャを選択する。Ubuntuの場合はDebianを選択する。`If you don’t have cloudflared installed on your machine:`の内容をコピーし実行する。  
これを、**サーバー上および手元のパソコンのターミナル上の両方**で行う。  
（手元のパソコン上でターミナルが動かなければ、サーバーのみで問題ない）

下部のConnectorsでサーバーとパソコンからの接続が確認できたら、Nextを選択。

## 公開するホスト名を編集
`Edit public hostname for`でホスト名を編集する。

- Subdomain（ルートドメインで公開する場合は未設定）とDomainをMisskeyを公開したいホスト名に設定する。
- Serviceは`HTTP`://`localhost:80`に設定する。

DNS Recordがなんとかかんとかと警告表示があるが、自動で設定されるので無視して良い。

Save tunnelを選択。

## SSH設定
SSH接続の設定も行なう。

トンネルリストに戻るので、作成したトンネルのConfigureを選択し、Public Hostnameタブを表示。Add a public hostnameを選択。

- Subdomain（例: ssh）とDomain (例: example.com)を設定する。
- Serviceは`SSH`://`localhost:22`に設定する。

Save hostnameを選択。

### アプリケーションの作成
Access > Applicationsを開き、Add an applicationを選択、Self-hostedをSelect。

- Application name: 適当に
- Session Duration: No duration
- SubdomainとDomainは先ほど設定したもの

中段は飛ばして、

- Accept all available identity providersをオフ
- Instant Authをオン

上に戻ってNext

- Policy name: 適当に
- Action: Allow
- Session duration: Same as application...

Next

- Enable automatic cloudflared authenticationをオン
- Browser renderingはとりあえずSSHに

Add Application

### SSH接続する
クライアントマシン（手元のパソコン）で操作する。

`~/.ssh/config`を編集し、次のように追記する。  
ProxyCommandの`/path/to/cloudflared`は、Windowsなら`where.exe cloudflared`、それ以外なら`which cloudflared`の結果に置き換えること。

```bash
Host ssh.example.com
  HostName ssh.example.com
  ProxyCommand /path/to/cloudflared access ssh --hostname %h
```

ssh接続してみよう。userは適宜適切なユーザー名に置き換えてほしい。  
（もしsshがインストールサーバーにインストールされていない場合はsshdをセットアップしよう。）

```bash
ssh user@ssh.example.com
```

ブラウザが開いて認証を行う必要があるが、認証が終われば通常のログインができる。

### 公開鍵認証の設定
sshへのログインが公開鍵認証ではなくパスワード認証の場合は、公開鍵認証を設定しよう。  
（ただし、この方法で設定するとなぜかブラウザレンダリングでSSHにログインできなくなってしまう）

```bash
ssh-keygen -t rsa -f ~/.ssh/my_ssh_key -C user # my_ssh_keyは好きな鍵名に、userは適切なユーザー名にする
# パスワードは設定しなくても良い
ssh-copy-id -i ~/.ssh/my_ssh_key user@ssh.example.com
```

リモートにssh接続する。

```bash
ssh user@ssh.example.com
```

`/etc/ssh/sshd_config`を次のように編集する。

- PubkeyAuthentication yes
- PasswordAuthentication no

sshdを再起動し、サーバーから切断する。

```bash
sudo systemctl restart sshd
exit
```

IdentityFileでssh秘密鍵を設定しよう。

```bash
Host ssh.example.com
  HostName ssh.example.com
  ProxyCommand /path/to/cloudflared access ssh --hostname %h
  IdentityFile /Users/your_local_user/.ssh/my_ssh_key
```

パスワードなしでログインするかどうか確かめてみる。

```bash
ssh user@ssh.example.com
exit
```

## bash-installでMisskeyをインストール
[**Misskey install shell script (bash-install) v2**](https://github.com/joinmisskey/bash-install)を使用して、Misskeyを適当にインストールしていく。  

cloudflaredを使うにあたり、bash-installの設定は次のように行う。  
そのほかの設定はお任せする（というかEnterだけ押していればなんとかなる）。

- nginxは使用する(y)
- setup ufw or iptablesは`n`（ファイヤウォールのセットアップなし）
- certbotは使用しない(n)
- Cloudflareは使用しない(n)

## いかがでしたか？
ssh接続にやたら時間をかけた以外は、そこそこ簡単にサーバーを公開できましたね。  
（実はsshはCloudflare Tunnelsだけあればパスワードすらいらないかもしれませんが、とりあえず厳重にロックするようにしてみました。）

自宅サーバーであれば`sudo ufw enable`だけして全てのポートを閉じてしまって問題ないかと思います。
