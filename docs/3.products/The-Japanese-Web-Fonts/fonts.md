# フォント一覧

The Japanese Web Fonts v7.2.0現在のフォント一覧。

## ベースフォント

### Source Han Sans （源ノ角ゴシック）

フリーフォントで恐らく最も重宝されているゴシック体フリーフォント。AdobeとGoogleが共同で開発し、Adobeからは「源ノ角ゴシック（日本語名）・Source Han Sans（英語名）」、Googleからは「Noto Sans JP」という名前でリリースされている。

|||
|:----:|:-----|
| font-family | `SourceHanSans-w` |
| 利用可能なfont-feature-settings指定 | palt |
| URL | https://github.com/adobe-fonts/source-han-sans/ |
| Liscense | SIL Open Font License 1.1 |
| CSS | `https://cdn.jsdelivr.net/gh/tamaina/The-Japanese-Web-Fonts@v7.2.0/dist/SourceHanSans/SourceHanSans.css` |

#### ウェイト

|||
|:----:|:-----|
| ExtraLight | 100 |
| Light | 200 |
| Normal | 300 |
| Regular | 400 |
| Medium | 500 |
| Bold | 700 |
| Heavy | 800 |

### Source Han Sans HW

Source Han Sansと同じく、AdobeとGoogleが共同で開発し、Adobeからは「源ノ明朝（日本語名）・Source Han Serif（英語名）」、Googleからは「Noto Serif JP」という名前でリリースされている。

|||
|:----:|:-----|
| font-family | `SourceHanSerif-w` |
| 利用可能なfont-feature-settings指定 | palt |
| URL | https://github.com/adobe-fonts/source-han-serif/ |
| Liscense | SIL Open Font License 1.1 |
| CSS | `https://cdn.jsdelivr.net/gh/tamaina/The-Japanese-Web-Fonts@v7.2.0/dist/SourceHanSerif/SourceHanSerif.css` |

#### ウェイト

|||
|:----:|:-----|
| ExtraLight | 100 |
| Light | 200 |
| Regular | 400 |
| Medium | 500 |
| SemiBold | 600 |
| Bold | 700 |
| Heavy | 800 |

### M+ Fonts


有名な日本語角ゴシックフリーフォント。

このセットでは、欧文4書体と日本語2書体、共通する記号をそれぞれ別の書体とすることで効率化を図っている。
ここの指定では、`mplus-c-w, mplus-1-w, mplus-S-w`を指定して「M+ 1C」で表示している。  
[それぞれの書体についてはこちらを参照。](https://mplus-fonts.osdn.jp/design.html)

|||
|:----:|:-----|
| font-family | `mplus-c-w`<br>`mplus-p-w`<br>`mplus-m-w`<br>`mplus-mn-w`<br><br>`mplus-1-w`(日本語1<br>`mplus-2-w`(日本語2)<br><br>`mplus-S-w`(記号) |
| URL | https://mplus-fonts.osdn.jp/ |
| Liscense | M+ Fonts License |
| CSS | `https://cdn.jsdelivr.net/gh/tamaina/The-Japanese-Web-Fonts@v7.2.0/dist/mplus-*/mplus-*.css`<br>*をc,p,mmn,1,2,Sに置き換えてください。 |

#### ウェイト

MおよびMNにはheavyとblackがない。

|||
|:----:|:-----|
| thin | 100 |
| light | 200 |
| regular | 400 |
| medium | 500 |
| bold | 700 |
| heavy | 800 |
| black | 900 |

## アドオンフォント

アドオンフォントはベースフォントと違う部分だけ収録しているため、ベースフォントを別途追加で指定する必要があります。（NasuとNasuMは例外）

### いろは角クラシック

和風な角ゴシックフォント。

|||
|:----:|:-----|
| font-family | `irohakakuC-w, SourceHanSans-w` |
| URL | http://modi.jpn.org/font_irohakakuc.php |
| Liscense | SIL Open Font License 1.1 |
| CSS | `https://cdn.jsdelivr.net/gh/tamaina/The-Japanese-Web-Fonts@v7.2.0/dist/irohakakuC/irohakakuC.css` |

#### ウェイト

|||
|:----:|:-----|
| ExtraLight | 100 |
| Light | 200 |
| Regular | 400 |
| Medium | 500 |
| Bold | 700 |

### コーポレート・ロゴ

最近街中でよく見かけがちな（？）ロゴフォント。

|||
|:----:|:-----|
| font-family | `corporateLogo-w, SourceHanSans-w` |
| URL | http://logotype.jp/corporate-logo-font-dl.html|
| Liscense | SIL Open Font License 1.1 |
| CSS | `https://cdn.jsdelivr.net/gh/tamaina/The-Japanese-Web-Fonts@v7.2.0/dist/corporateLogo/corporateLogo.css` |

#### ウェイト

|||
|:----:|:-----|
| medium | 500 |
| bold | 700 |

### ラノベPOP

ポップ体（ウェイトは800を指定）

|||
|:----:|:-----|
| font-family | `LiNovePOP-w, SourceHanSans-w` |
| URL | http://www.fontna.com/blog/1706/ |
| Liscense | M+ Fonts License |
| CSS | `https://cdn.jsdelivr.net/gh/tamaina/The-Japanese-Web-Fonts@v7.2.0/dist/LiNovePOP/LiNovePOP.css` |

### けいふぉんと

ポップ体（ウェイトは800を指定）

|||
|:----:|:-----|
| font-family | `KeiFont-w, SourceHanSans-w` |
| URL | http://font.sumomo.ne.jp/font_1.html |
| Liscense | Apache License 2.0 |
| CSS | `https://cdn.jsdelivr.net/gh/tamaina/The-Japanese-Web-Fonts@v7.2.0/dist/KeiFont/KeiFont.css` |

### ぼくたちのゴシック2

子どもっぽいゴシック仮名

|||
|:----:|:-----|
| font-family | `Boku2Gothic-w, SourceHanSans-w` |
| URL | https://fontopo.com/?p=94, https://fontopo.com/?p=98 |
| Liscense | Apache License 2.0 |
| CSS | `https://cdn.jsdelivr.net/gh/tamaina/The-Japanese-Web-Fonts@v7.2.0/dist/Boku2Gothic/Boku2Gothic.css` |

#### ウェイト

|||
|:----:|:-----|
| Regular | 400 |
| Bold | 700 |

### ぼくたちのゴシック

子どもっぽいゴシック仮名

|||
|:----:|:-----|
| font-family | `BokuGothic-w, SourceHanSans-w` |
| URL | https://fontopo.com/?p=164 |
| Liscense | IPAフォントライセンスv1.0 |
| CSS | `https://cdn.jsdelivr.net/gh/tamaina/The-Japanese-Web-Fonts@v7.2.0/dist/BokuGothic/BokuGothic.css` |

### 源瑛アンチック

漫画の本文で使われるアンチゴチ体（ウェイトは500を指定）

|||
|:----:|:-----|
| font-family | `GenEiAntique-w`(共通)<br>`GenEiAntique-N-w`(かな)<br>`GenEiAntique-P-w`(かなプロポーショナル) |
| URL | http://okoneya.jp/font/genei-antique.html |
| Liscense | SIL Open Font License 1.1 |
| CSS | `https://cdn.jsdelivr.net/gh/tamaina/The-Japanese-Web-Fonts@v7.2.0/dist/GenEiAntique/GenEiAntique.css`<br>`https://cdn.jsdelivr.net/gh/tamaina/The-Japanese-Web-Fonts@v7.2.0/dist/GenEiAntique-*/GenEiAntique-*.css`<br>*はP,Nに置き換えてください。 |

### 源瑛ラテゴ

|||
|:----:|:-----|
| font-family | `GenEiLateGo-w`(共通)<br>`GenEiLateGo-N-w`(かな)<br>`GenEiLateGo-P-w`(かなプロポーショナル) |
| URL | http://okoneya.jp/font/genei-latin.html|
| Liscense | SIL Open Font License 1.1 |
| CSS | `https://cdn.jsdelivr.net/gh/tamaina/The-Japanese-Web-Fonts@v7.2.0/dist/GenEiLateGo/GenEiLateGo.css`<br>`https://cdn.jsdelivr.net/gh/tamaina/The-Japanese-Web-Fonts@v7.2.0/dist/GenEiLateGo-*/GenEiLateGo-*.css`<br>*はP,Nに置き換えてください。 |

### 源瑛Nuゴシック

仮名を大振りにするなどした、漫画向けの太ゴシック（ウェイトは800を指定）

|||
|:----:|:-----|
| font-family | `GenEiNuGothic-w, SourceHanSans-w` |
| URL | https://okoneya.jp/font/genei-nu-gothic.html|
| Liscense | SIL Open Font License 1.1 |
| CSS | `https://cdn.jsdelivr.net/gh/tamaina/The-Japanese-Web-Fonts@v7.2.0/dist/GenEiNuGothic/GenEiNuGothic.css` |

### GenEi Univer Sans

日本語フォントと混植しても違和感がないようにしたHindベースの英数ゴシックフォント

|||
|:----:|:-----|
| font-family | `GenEiUniverSans-w, SourceHanSans-w` |
| URL | https://okoneya.jp/font/download.html |
| Liscense | SIL Open Font License 1.1 |
| CSS | `https://cdn.jsdelivr.net/gh/tamaina/The-Japanese-Web-Fonts@v7.2.0/dist/GenEiUniverSans/GenEiUniverSans.css` |

#### ウェイト

|||
|:----:|:-----|
| L | 200 |
| SL | 300 |
| R | 400 |
| SB | 600 |
| B | 700 |
| H | 800 |
| Bk | 900 |

### 源瑛ロマンのーと

「えれがんと」と一緒に使える欧文フォント（`font-face`で指定されているウェイトは900だが、ここでは700を指定）

|||
|:----:|:-----|
| font-family | `GenEiRomanNotes-w` |
| URL | https://okoneya.jp/font/genei-romanotes.html|
| Liscense | SIL Open Font License 1.1 |
| CSS | `https://cdn.jsdelivr.net/gh/tamaina/The-Japanese-Web-Fonts@v7.2.0/dist/GenEiRomanNotes/GenEiRomanNotes.css` |

### Nasu

ディスプレイ向けのフォント

|||
|:----:|:-----|
| font-family | `Nasu-w` |
| URL | http://itouhiro.hatenablog.com/entry/20140917/font |
| Liscense | SIL Open Font License 1.1 |
| CSS | `https://cdn.jsdelivr.net/gh/tamaina/The-Japanese-Web-Fonts@v7.2.0/dist/Nasu/Nasu.css` |

#### ウェイト

|||
|:----:|:-----|
| Regular | 400 |
| Bold | 700 |

### NasuM

ディスプレイ向けの等幅フォント

|||
|:----:|:-----|
| font-family | `NasuM-w` |
| URL | http://itouhiro.hatenablog.com/entry/20140917/font|
| Liscense | SIL Open Font License 1.1 |
| CSS | `https://cdn.jsdelivr.net/gh/tamaina/The-Japanese-Web-Fonts@v7.2.0/dist/NasuM/NasuM.css` |

#### ウェイト

|||
|:----:|:-----|
| Regular | 400 |
| Bold | 700 |
