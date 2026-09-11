# Astro移行レポート

## 実装と公開状態

2026-09-11に実施。開始HEADは `25c890dc23daa38a279da7f7ec2174a8ede1b556`。旧ソースを `/tmp/a9z-nuxt-baseline` のdetached worktreeに保存。Gitの開始コミットからも復元可能です。

NuxtからAstroの静的生成へ移行しました。公開56ページ、ブログ10件/通常一覧30件、年別一覧、クエリ式ページ送り、パンくず・日付、YouTube、Viewer、Bootstrap 5.3.0と既存フォントを引き継ぎました。独自Worker、Astro Cloudflareアダプター、DBや新ストレージは使いません。

プレビュー: **https://a9z-astro-migration-preview.aqz.workers.dev**

Worker: `a9z-astro-migration-preview`、version: `6ffe6cd2-7dec-4d7c-8235-2fc95e08b2b1`。事前に存在しない名前と確認したうえで独立して配置しました。原本モードです。本番DNS・Custom Domain・Netlify本番サイト・課金プランは変更していません。作業リポジトリのコミット・pushも実施していません。

**実装・ローカル検査・Static Assets実配信の検査は実施済みですが、Cloudflare Images実変換の成功確認は未完了です。** workers.devではthumbnail/preview/OGがすべて404で、原本だけが200です。有効な検証ゾーン/ホストを用意して、[デプロイ手順](deployment.md)の実変換検査を実施する必要があります。画像が見えることを変換成功とは扱っていません。

## バージョンと構成

| 項目 | 採用値 |
| --- | --- |
| Node.js | 24.18.0 |
| pnpm | 12.3.4 |
| Astro | 7.3.2 |
| Wrangler | 4.131.0 |
| TypeScript | 6.0.3 |
| Bootstrap / Viewer.js | 5.3.0 / 1.11.7（維持） |
| pnpm lockfile | frozen install検証済み |
| Astro出力 | static / file / trailingSlash never |
| Workers routing | drop-trailing-slash / 404-page |

実装開始時にnpm registryのstableとenginesを取得しました（[記録](baseline/versions.json)）。AstroはNode >=22.12、Wranglerは>=22に対応。TypeScript最新7.0.2はAstro checkが必要とするprogrammatic APIを提供せず、実際に検査が失敗したため6.0.3を採用しています。

`src/content.config.ts`のカスタムContent Loaderが`docs`を直接読みます。Markdownはremark/rehypeとremark-mdcの構文木で処理し、記事ファイル・記事URL・原本URLを別々の対応表にしています。変換済み画像を生成する処理はありません。sharpはメタデータ読取だけに使います。

## 原本・アセット・変換数

[機械可読レポート](verification/build-report.json)の原本モード結果:

| 項目 | 結果 |
| --- | --- |
| Markdown入力 / 公開ページ | 57 / 56 |
| Web表示用原本入力 | 562 WebP |
| その他の原本 | HEIC 1点、未参照添付としてバイトコピー |
| ハッシュ原本の実出力数 | 555（554 WebP + 1 HEIC、同一内容を共有） |
| 旧URL互換コピー | 563 |
| Static Asset総数 | 1,190 |
| 総容量 | 1,845,456,243 bytes（約1.72GiB） |
| 最大アップロードファイル | 7,363,140 bytes、`2.blog/2022/05-24 m1mba-5/1.webp` |
| 除外DNG | `2.blog/2022/10-04 Leitz Phone 1 2/DSC_0069.dng`、40,544,120 bytes |
| 想定thumbnailユニークURL | 35 |
| 想定previewユニークURL | 545 |
| 想定OGユニークURL | 35 |
| サイトが生成する月次ユニークURL上限 | 合計615（各URLがその月にすべて取得された場合） |

すべてのWebPとHEICはハッシュ付き原本および旧URLの双方で入力バイトと一致します。旧URL互換にコピーを選び、リダイレクト件数制限を回避しました。その分、総容量には同じ画像が二重に含まれます。ハッシュURLだけimmutableを設定し、HTML・旧原本には適用しません。DNGはファイル単位で除外し、既存GitHub RAWリンクとGit内ファイルを保持しました。

CloudflareモードのクリーンcloneビルドではURL文字列が長くなるため総容量は1,845,518,817 bytesです。元画像のバイト数・URL・件数は同じです。全原本に各プリセットを機械的に適用していません。615は自サイトの出力上限であって、第三者が任意パラメータを指定する要求まで制限する値ではありません。

## 互換性と意図した差分

- 公開サイトの実sitemap56 URLと旧Nuxt Content 2.13.4 / MDC 0.9.5パーサー出力57記事を保存しました。全公開URL、全記事のタイトル・description・見出しIDを一致検査しています。draft `/memo/kig-scoring` は非公開のままです。
- 元Markdown・元画像・DNG・既存サムネイル入力は変更していません。`git diff HEAD -- docs` は空です。
- 旧広告コンポーネント、動的スクリプト、見出し・画像の広告分岐、広告用CSSを除去しました。`docs/boot.js`と`docs/ads.txt`は入力のまま残り、出力しません。
- Nuxt/Vercel専用Analytics・Speed Insightsは、移行先にNuxt/Vercelランタイムがないため削除しました。代替解析サービスは追加していません。
- Nuxt用シンボリックリンク生成と旧import/webp変換スクリプトを廃止しました。Astroのビルドは原本コピーのみです。旧ツールを必要とする場合は開始コミットを参照してください。
- 本文画像の自然比率を事前に指定し、旧実装の遅延画像ロードで生じていた大きな配置ずれを抑えました。旧sizes設定に合わせ350/550/650pxのCSS表示上限も維持しています。固定1600pxの変換プリセット自体は増やしていません。
- 日付はAsia/Tokyoに固定し、CIのタイムゾーンに依存しません。クエリ不正値を1〜最終ページへ補正します。
- 旧サイトの存在しないURLは500でした。移行後は404ページにし、画像欠落も404です。
- 旧実装で明示されていなかったcanonicalを本番URLで設定しました。OGP/Twitter/description/lang/viewport/title suffix/sitemap/robotsを維持しています。

## 既存の欠落・本文に残した事項

以下は移行で作った欠落ではありません。新規欠落と区別して明示的な例外にし、新たな内部リンク・画像欠落はビルドを失敗させます。

| 種別 | 既存参照 |
| --- | --- |
| 本文画像 | `2.blog/2023/03-08 14m1prombp-2/index.md` → `2.webp` がGitに存在しない。旧URLの欠落として保持 |
| サムネイル | `4.memo/audio-visual/obs-udp.md` → `scnsht.webp` が存在しない。壊れたOG画像出力は省略 |
| 記事リンク | `2.blog/2022/10-28 14m1prombp-1/index.md` → `./05-20-m1mba-1` |
| 記事リンク | `2.blog/2023/03-07 pixel-7-2/index.md` → `../02-01-pixel-7-1` |

`upatedAt`という既存綴り誤りが1件あり、本文を変更せず旧挙動どおり更新日として扱っていません。`where`と`plain`の実利用は今回の公開入力にはありませんが、実装では対応しています。独自タグは既存のembed-youtubeを検証し、未知タグはエラーにします。

プライバシーポリシーにあるAdSense/広告/Cookieの説明は内容を改稿していません。広告削除に合わせた文面見直しは別の編集作業です。

## 実行した検証

| 検査 | 結果・証跡 |
| --- | --- |
| 型検査 | 0 errors / 0 warnings / 0 hints、[記録](verification/typecheck.txt) |
| 単体テスト | 11/11成功。URL、メタデータ、全見出し、MD単体・index、空白/日本語/大小文字/query/hash、衝突、プリセット、一覧境界、追加・差し替え・改名・削除、本文更新、サイズ制限・LFS、[記録](verification/unit-tests.txt) |
| ビルド・原本検査 | 全公開ページ生成、25MiB/20,000件以内、原本バイト一致、新派生画像なし、広告コード/ソース漏れなし、[結果](verification/build-report.json) |
| クリーンclone | 一時スナップショットコミットを別cloneへ複製し、frozen install・型検査・単体テスト・Cloudflareモードビルド・原本検査成功。docs差分なし。[ビルド](verification/clean-clone-build.txt) / [アセット](verification/clean-clone-assets.txt)。最初の/tmp容量超過はディスク上へ移して解消 |
| ブラウザ操作 | 13/13成功。390/575/576/768/991/992/1440px、ナビ開閉、light固定、ページ番号・履歴・直接読込・再読込・補正、Viewer/Escape/タッチ/原本URL、JSなし、原本fallback、未表示ページ画像の未取得、自サイトAdSense通信なし、[記録](verification/browser-tests.txt) |
| Static Assets実配信 | 64ルート/画像検査。全56ページ、クエリ、404、末尾slash307、旧原本/新原本SHA-256、[結果](verification/remote-site.json) |
| Images実変換 | 未成功。workers.devのthumbnail/preview/OGが404、原本200のSHA-256は一致。[実測](verification/remote-images.json) |
| Images/Polish設定 | OAuthの設定API読取権限不足。設定値は確認できず、変更もしていない |
| CI | workflowを追加。GitHubへのpushとホスト上でのActions実行は未実施 |

## 視覚比較

初回公開スクリーンショットは[baseline](baseline/README.md)に保存。広告ありの記録です。追加比較は広告の`ins.adsbygoogle`とそれだけを含む`my-4`ラッパーだけを除去し、ページ全体のマスクは使っていません。Chromium、DPR=1、light、390/768/1440×900、フォント完了後。画像記事は画像decode完了後にも比較しました。

ホーム・ブログ・2ページ目・年別・コード/表・products・memoについて、本文/見出し/カード/ナビの主要な計測値は一致しました。画像記事は元画像と旧Netlify変換の整数丸めによる約1pxの寸法差があり、17枚を含むスマートフォン全体の高さは旧6,792px/新6,802px、PCは双方9,912pxでした。完全なピクセル同一とは報告しません。404は旧500画面からの意図した変更です。

| 画面例 | 旧（広告のみ除去） | 新 |
| --- | --- | --- |
| ホーム390px | [旧](comparison-before/home-390.png) | [新](comparison-after/home-390.png) |
| ブログ1440px | [旧](comparison-before/blog-1440.png) | [新](comparison-after/blog-1440.png) |
| 2ページ目390px | [旧](comparison-before/page2-390.png) | [新](comparison-after/page2-390.png) |
| 画像記事390px・全画像読込後 | [旧](comparison-before/image-full-390.png) | [新](comparison-after/image-full-390.png) |
| コード記事1440px | [旧](comparison-before/code-1440.png) | [新](comparison-after/code-1440.png) |

各比較ディレクトリに全9種×3幅の画像とmetrics.jsonを保存。[寸法差分一覧](verification/layout-differences.json)も参照できます。再取得は `node scripts/capture-ui.mjs https://a9z.dev maintenance/comparison-before` と `node scripts/capture-ui.mjs http://127.0.0.1:4321 maintenance/comparison-after`。本番が切り替わった後は開始HEADの旧worktreeを比較元に使用してください。

## 残る作業

Transformationsを有効にした検証ホスト、Source origins制限、Polish除外、アカウント全体のImages使用量を確認し、実変換の寸法・形式・Accept別応答を成功させる必要があります。有効ホストでのfallback/UI再確認、本番切り替え承認、DNS/Custom Domain切り替え、ロールバック準備は[deployment.md](deployment.md)を参照してください。
