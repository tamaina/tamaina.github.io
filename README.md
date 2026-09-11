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

認証情報は既存の GitHub Environment `cloudflare-preview` の `CLOUDFLARE_API_TOKEN` / `CLOUDFLARE_ACCOUNT_ID` を使用します。名前にpreviewが残っていますが、本番の認証情報の保管先です。プレビュー用Worker・ドメイン・デプロイ機能は削除済みです。本番の継続デプロイは `wrangler versions upload` / `versions deploy` で行い、対象アカウントのWorkers Scripts編集権限を使用します。ルートは初回設定済みで、CIでは更新しません。ルートの新設・変更時だけ、別途 `a9z.dev` のWorkers Routes編集権限で `pnpm exec wrangler deploy` を実行してください。PRは検証のみでデプロイしません。同じ配信先のデプロイは直列化します。

Actions はチェック・ビルド・デプロイまでを実行し、公開後の内容検証は行いません。必要な場合は `VERIFY_ORIGIN=https://a9z.dev pnpm verify:remote` などで手動検証できます。出力先は `.generated/verification/`、旧サイトとの互換性比較用データは `tests/fixtures/` です。

旧Netlify配信へ戻す場合は、まずActionsの本ワークフローを無効化し、Cloudflareの `a9z-production` に割り当てた `a9z.dev/*` Routeを削除します。DNSは変更していないため旧配信へ戻ります。Worker内の変更だけを戻す場合は `pnpm exec wrangler rollback <version-id>` を使います。旧サイトとDNSはロールバック手段として残してください。
