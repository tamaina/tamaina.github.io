# 比較基準

開始HEAD: `25c890dc23daa38a279da7f7ec2174a8ede1b556`。
公開サイト確認: 2026-09-11 (Asia/Tokyo)。旧worktree: `/tmp/a9z-nuxt-baseline`。
`content.json` は `@nuxt/content@2.13.4` の markdown/path-meta transformer を既存57ファイルへ実行した結果。実装の入力には使わない。
`sitemap.xml` は公開サイトから取得した56 URL。draftの `/memo/kig-scoring` は非公開。
`pages.json` と PNG は公開サイトをChromiumで390/1440×900、DPR=1、light、document.fonts.ready後に取得。広告はこの初回画像では除去していない。
存在しない `/migration-missing-page` は公開サイトが500を返した。
