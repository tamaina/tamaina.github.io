---
publishedAt: 2022-09-18
updatedAt: 2022-09-22
thumbnail: "kuroneko xiaomi.webp"
layout: default
---
# Xiaomi 11T Pro [#2] いろいろ深掘り

Xiaomi 11T Proの写真・動画撮影、テザリング、ルート化について。

[→前回の記事](../09-05%20Xiaomi%2011T%20Pro)

## テザリング（モバイルホットスポット）

- **WPA3-Personal**に**対応**
- **中継**に**対応**（上流のWi-Fiに接続したままホットスポットとして機能する）
- **Wi-Fi 6** (IEEE802.11ax)に対応 （周波数帯は2.4GHzのみ）

iPhoneからMIUIのホットスポットを見ると、iOSのインターネット共有と同じ🔗アイコンで表示されました。  
Androidのテザリングが🔗アイコンになるのはかなり新鮮に感じました。

![](portable-hotspot-setting.webp "MIUIで「デバイス識別」を「モバイルホットスポット」に設定する")

![](portable-hotspot-iphone.webp "iPhoneで🔗アイコンが表示される（TONE e22は通常の扇形アイコン）")

## 動画撮影
Xiaomi 11T ProはOIS（光学式手ぶれ補正）は搭載されていませんが、EIS（電子式手ぶれ補正）のみでiPhone並の手ぶれ補正効果が得られています。安い端末と比べると、動画手ぶれ補正だけでも相当な価値があると思います。  
8K撮影もできますが、8Kでは手ぶれ補正は使えません。

色々な画質設定はあるのですが、撮影モードが制限されます。以下にまとめます。

- **広角レンズ** 1080p30、720p30のみ。
- **HDR10+/HDR10**  
  8K=HDR10、4K30p/4K60p=HDR10+、それ未満は設定なし。H.265エンコード不可。
- **HDR** 8K及び60fps不可。広角不可。
- **スーパー手ぶれ補正** 1080p30のみ。広角不可。
- **ムービーフィルター**  
  1080p30、720p30のみ。フィルターによっては720p30のみ。
- **フィルター**（ビューティー・ボケ） 720p30のみ。
- **AIカメラ** 1080p30、720p30のみ。

各種機能をオンにすると利用可能な最高設定が適用されますが、オフにしても戻らないのはやや不便なところです。

## 暗所静止画撮影比較
まずはLUMIX G 20mm/F1.7とフルサイズ換算40mmの画角で暗所撮影を比較してみます。

![](denchu%20mft.webp "LUMIX GX7MK2 + LUMIX G 20mm/F1.7, ISO1600, 1/4s")

![](denchu%20xiaomi.webp "Xiaomi 11T Pro (クロップ)")

**これは少し意地悪過ぎましたね。**

今度はもう少し明るい場面をiPhone 13 miniと比較してみます。

![](kuroneko%20iphone13.webp "iPhone 13 mini")

![](kuroneko%20xiaomi.webp "Xiaomi 11T Pro")

両機種とも、手ぶれ補正の打率はまあまあ良好です。

品質は正直、どっちもどっちといった感じです。  
ただiPhone 13はやっぱりゴーストがとんでもないことになっています。  
Xiaomi 11T Proはゴーストが目立ちません。筐体のカメラ部が平面になっているので、iPhoneのようにカバーする必要もあまりなさそうです。  
品質が同じなら、私はXiaomi 11T Proを推します。

文化的な最低限度の生活を営むためには、やはりMFTや1インチでもいいので明るく撮れるカメラを持ち歩きたいところです。

## ROM焼き
結論を言うと、安定性が損なわれるのを恐れてROMは変えていません。

~~ところで、Fastboot ROMでsuperパーティションイメージを焼くときに`failed to check sparse crc`エラーが出て先に進めないのに困りました。~~  
~~`fastboot erase super`をしましたがダメ。~~

![](super%20fail.webp "FAILED (remote: 'failed to check sparse crc')")

~~CRC云々とのことでCRCまわりのコマンドを削除しましたが、起動してくれません（ブートローダーしか表示されない）。~~

fastboot (platform-tools)が古かったためでした。最新のfastbootにするとすんなり焼けました。

TWRPでブートしてRecovery ROMをADBサイドロードすれば復旧はできます。

## ルート化
Magiskによるルート化はしました。

とりあえず[notocjkモジュール](https://github.com/simonsmh/notocjk)を入れて使っています。  
Android標準で日本語バリアブルフォントが導入される日はいつ来るのでしょうか。バリアブルフォントを使っていて、特段不具合は感じないのですけれどね。

さて、ルート化したのがGoogle Payにバレてしまいました。

![](google%20pay%20root.webp "ルート化したのがGoogle Payにバレた")

この端末でGoogle Payを使うつもりはないので、MagiskHideなどを導入するつもりはありません。

## 5G SA
今回も5G SAを掴もうと試みます。  
MIUIの場合はルート化不要だそうです。

![](726633.webp "電話アプリのダイヤルパッドに *#*#726633#*#*と入力します。")

![](show-5g-network-mode-selection.webp "Show 5G network mode selectionと表示されます。")

![](sa-toggle.webp "スタンドアローンモードトグル")

設定アプリ - SIMカードとモバイルネットワーク - 高度な設定 の中にスタンドアローンモードトグルが追加されているので、これを有効にします。

Softbankの5G SA対応SIM（ZTWHT1）を挿入しNR Onlyに設定したところ、moto g50 5Gと同じく通信はできませんでした。

「Network Signal Guru」を見るとgNBが取得できているように見えましたが、CellmapperではgNBが取得できませんでした。

（正直どうせなら、電測はn257を掴める端末で通信できる状態でやりたいところではありますが、そのような機会はなかなかないでしょうね……。）
