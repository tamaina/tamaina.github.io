# a9z.dev

Astroで`docs/`の既存Markdownを静的生成し、Cloudflare Workers Static Assetsへ配信します。

```sh
pnpm install --frozen-lockfile
pnpm dev
```

Node.js **24.18.0** / pnpm **12.3.4**を使用します。

```sh
pnpm check
pnpm test
pnpm build
pnpm exec playwright install chromium
pnpm test:ui
pnpm preview
```

ローカルは原本表示です。画像変換を使用する成果物は `IMAGE_MODE=cloudflare IMAGE_ORIGIN=https://検証ホスト pnpm build` で生成します。設定はビルド時に埋め込まれます。

[移行レポート](https://github.com/tamaina/tamaina.github.io/tree/bcef095a1724c3f60926a38499a1e9bf27e5876a/maintenance/astro-migration.md) / [デプロイ・切り替え手順](https://github.com/tamaina/tamaina.github.io/tree/bcef095a1724c3f60926a38499a1e9bf27e5876a/maintenance/deployment.md)

プレビューは https://astro-preview.a9z.dev です。GitHub Actions の `Astro checks and preview deployment` を `main` / `deploy_preview: true` で手動実行すると、チェック・UIテスト後に画像変換を有効にした成果物を作り、`cloudflare-preview` Environment のシークレットでデプロイします。

```sh
gh workflow run astro.yml --ref main -f deploy_preview=true
```

デプロイ後は公開56ページ、404・リダイレクト、原本のハッシュ、変換画像の形式・寸法を検証します。結果は Actions の `preview-verification` artifact に保存します。ローカル検証の出力先は `.generated/verification/`、旧サイトとの互換性比較用データは `tests/fixtures/` です。

この設定はプレビュー専用です。本番 `a9z.dev` のDNS・配信先の切り替えは、上記の切り替え手順に従う別作業です。
