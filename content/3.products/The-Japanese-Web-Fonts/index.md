---
description: The Japanese Web Fontsは、フリーフォントを集めたWebフォントセットです。
layout: index
---
# The Japanese Web Fonts

The Japanese Web Fontsは、日本語フリーフォントを集めたWebフォントセットです。  
日本語用にサブセットしています。

[GitHub tamaina/The-Japanese-Web-Fonts](https://github.com/tamaina/The-Japanese-Web-Fonts)

## 概要
日本語に適したサブセットにしています。

- 細かいサブセット（ラテン、ラテン拡張、記号、ひらがな、カタカナ、小学校で習う漢字、常用漢字、表外漢字、etc.）
- unicode-rangeを記載
- M+ Fontは1,2,c,p,m,mn,S（記号）で別のフォントに分割
- CDN（jsdelivr使用）

## 使い方

[フォントリスト](./fonts)の「CSS」に書かれているURLをHTMLの`<link>`タグで読み込みます。

```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/tamaina/The-Japanese-Web-Fonts@v7.2.0/dist/SourceHanSans/SourceHanSans.css">
```

[フォントリスト](fonts)の「font-family」に書かれているフォント名をfont-familyとして指定します。

```css
body, html {
  font-family: SourceHanSans-w, sans-serif;
}
```
