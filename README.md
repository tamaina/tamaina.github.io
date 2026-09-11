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

`main` への push は、チェック・UIテスト後に本番用の画像変換URLでビルドし、`a9z-production` Workerへ自動デプロイします。`a9z.dev/*` の Worker Route を使用し、既存DNSとNetlifyサイト、`www` の転送を維持します。手動の本番再デプロイも可能です。

```sh
gh workflow run astro.yml --ref main
```

プレビューは https://astro-preview.a9z.dev です。手動実行で `deploy_preview=true` を指定すると、独立したプレビューWorkerだけを更新します。

```sh
gh workflow run astro.yml --ref main -f deploy_preview=true
```

両方とも、設定済みの GitHub Environment `cloudflare-preview` の `CLOUDFLARE_API_TOKEN` / `CLOUDFLARE_ACCOUNT_ID` を使用します（Environment名は既存のまま、Workerとビルド時の画像originを分離）。トークンには対象アカウントのWorkers Scripts編集と、`a9z.dev` のWorkers Routes編集が必要です。PRは検証のみでデプロイしません。同じ配信先のデプロイは直列化します。

デプロイ後は公開56ページ、404・リダイレクト、原本のハッシュ、変換画像の形式・寸法を検証します。結果は Actions の `deployment-verification` artifact に保存します。ローカル検証の出力先は `.generated/verification/`、旧サイトとの互換性比較用データは `tests/fixtures/` です。

旧Netlify配信へ戻す場合は、まずActionsの本ワークフローを無効化し、Cloudflareの `a9z-production` に割り当てた `a9z.dev/*` Routeを削除します。DNSは変更していないため旧配信へ戻ります。Worker内の変更だけを戻す場合は `pnpm exec wrangler rollback <version-id> --env production` を使います。旧サイトとDNSはロールバック手段として残してください。
