---
publishedAt: 2022-09-25
---

# Netlify Large Mediaのリポジトリをクローンする

私は他のマシンでNetlify Large Mediaを使用したリポジトリを何も考えずVS Codeでクローンしようとしてしまいました。

ところが次のようなダイアログが表示され、<kbd>Esc</kbd>を押しても無限に出続けます。

![](vscode.png "Escを押してもUsernameとPasswordを延々と聞かれ続ける")

クローンしてしまったディレクトリはいちど削除して、順番通りにクローンしましょう。

まずはターミナルやコマンドラインを開きます（SSH接続の場合はシェル経由でSSH接続します）。

## 1. Git LFSをインストールする
まずはGit LFSをインストールします。  
aptの場合…

```
sudo apt install git-lfs
git lfs install
```

## 2. netlify lm:install
Netlify CLIをインストールします。

```
npm install netlify-cli -g
```

netlify loginでNetlify CLIを操作できるようにします。コマンドを入力した後に指示に従ってください。

```
netlify login
```

`netlify lm:install`を実行します。  
Netlifyの認証ヘルパー(Netlify's Git Credential Helper)が導入されます。

```
netlify lm:install
```

![](lm%20install.png)

枠の中の`source /home/...`をコピーして実行してください。

## 3. git clone
通常通りgit cloneします。

```
git clone https://github.com/hoge/fuga.git
```

これで普通にgit cloneができたと思います！

## 4. netlify link
一応`netlify link`をしておきましょう。  
VS Codeでワークスペースを開くか、そのまま`cd fuga`するかし、`netlify link`を実行します。

```
netlify link
```
