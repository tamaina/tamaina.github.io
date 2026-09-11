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
