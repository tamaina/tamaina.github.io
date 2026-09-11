# デプロイと本番切り替え

## ローカル・検証

Node 24.18.0、pnpm 12.3.4。`pnpm install --frozen-lockfile` → `pnpm check` → `pnpm test` → `pnpm build` → `pnpm exec playwright install chromium` → `pnpm test:ui`。
`pnpm dev` はdocsを直接読み込みます。新規・変更・削除で再読み込みし、画像ステージングも再生成します。`docs`には生成物を書きません。

`pnpm build` の既定は `IMAGE_MODE=original`。アカウントなしでCSS、本文、原本Viewerを検証できます。`pnpm preview` は既存distを配信するだけなので、Cloudflareモードのdistを原本モードへ変更しません。Astro 7のpreviewはバックグラウンドで動作し、停止は `pnpm exec astro preview stop`。

Cloudflareモードは次のようにビルドします（ホストは実際の検証ホストへ置換）。

```sh
IMAGE_MODE=cloudflare IMAGE_ORIGIN=https://images-test.example.com pnpm build
```

モードと画像originは成果物に固定されます。canonical/sitemapは常に`https://a9z.dev`。検証ドメインをSEOへ混ぜません。APIキーはブラウザに不要です。

## Workers Static Assets

`wrangler.jsonc` は独立した `a9z-astro-migration-preview` Workerを対象とします。既存Worker名を使用する前に、必ず `pnpm exec wrangler deployments list --name <name>` で対象を照合してください。今回の初回作業では名前の未使用を確認しています。

```sh
pnpm exec wrangler deploy --dry-run
pnpm exec wrangler deploy
```

`main`、独自fetch、ASSETSバインディング、KV、Cloudflare Pages設定はありません。HTMLは`build.format=file`・末尾スラッシュなし、配信は`drop-trailing-slash`・`404-page`。存在しない画像と記事は404で、ホームへ200フォールバックしません。

プレビューはworkers.devで利用できますが、workers.devはTransformations有効ゾーンではありません。原本モードのプレビューで画像が出ても、変換成功とは扱いません。

## Images設定（実環境での確認が必要）

1. Cloudflare Dashboardの対象ゾーンで Images → Transformations を有効化。画像保存サービスへアップロードしないでください。
2. 検証用ホストのCustom DomainをプレビューWorkerへ割り当てます。本番`a9z.dev`のDNS・Custom Domain変更は切り替え承認後です。
3. Source originsを自分の原本配信ホストだけに制限します。any originは選択しません。同一ホストの`/_media/originals/*`がHTTPSで到達できるようにします。
4. `/cdn-cgi/image/*`を404、SPAルート、Access認証、独自Worker変換へ転送しないでください。変換サブリクエストが原本のStatic Assetへ到達できる必要があります。
5. Polishやゾーンの画像一括最適化を原本パスに適用しないでください。Dashboardで設定を確認し、GETした原本のSHA-256も照合します。今回のOAuth権限ではimage_resizing/polish設定APIが認証エラーでした。
6. DashboardのImages使用量でアカウント全体の当月使用量と無料プランを確認。公式料金資料確認時、無料枠は月5,000ユニーク変換。同一原本＋同一オプションのformat=auto出し分けは1組です。課金プランは今回変更しません。
7. 固定プリセットはサイトが出すURLの種類を限定するだけです。第三者の任意オプション要求を拒否する機能ではありません。Source origins制限も任意サイズ要求は制限しません。

設定後、Cloudflareモードでビルド・検査・プレビューWorkerへ再配置し、代表1枚を次で確認します（全画像のウォームアップはしません）。

```sh
VERIFY_ORIGIN=https://images-test.example.com pnpm verify:remote
```

スクリプトは原本SHA-256、変換のステータス・リダイレクト・Content-Type・実寸・形式・原本との差、Accept別の結果を検査します。thumbnail=1120px、preview=1600px、OG=1200×630 JPEG。失敗は非ゼロで終了します。原本fallbackの200を成功にしません。別途、DevToolsで変換だけをブロックし、原本へ一度だけfallbackすることを確認してください（ローカル自動テストあり）。

## CIと秘密情報

`.github/workflows/astro.yml` はPRとmain pushでインストール、型検査、単体テスト、静的ビルド、原本・アセット検査、Playwrightを実行します。PRにデプロイ秘密情報を渡しません。`pull_request_target`は使用しません。

プレビューへの配置はmainの手動workflow_dispatchで`deploy_preview=true`を指定した場合だけです。検査済みdistをartifactとして受け渡し、デプロイ前の再ビルドはしません。Environment `cloudflare-preview` に次を登録し、必要な承認者・ブランチ保護を設定してください。

- `CLOUDFLARE_API_TOKEN`: 対象アカウントのWorkers Scripts編集に限定したトークン。
- `CLOUDFLARE_ACCOUNT_ID`: 対象アカウント。

OAuthトークンや`.dev.vars`をGitへ保存しないでください。原本コピー込みdistは約1.85GBのため、Actions artifactは7日で削除します。無料Static Assets上限20,000ファイル/各25MiBを毎ビルドで検査します。

## 本番切り替え（今回未実施）

1. 上記Images実変換試験と原本同一性、検証ホストでのUI・404・URLを確認。
2. 現在のDNS、Netlifyドメイン紐付け、Cloudflareルール、旧デプロイIDを保存。開始HEAD `25c890dc23daa38a279da7f7ec2174a8ede1b556`のNuxt版を復元可能にします。
3. 本番専用Worker名と保護Environmentを決め、明示的な本番切り替え承認を受けます。現時点のCIには自動本番デプロイを設けていません。
4. `IMAGE_MODE=cloudflare IMAGE_ORIGIN=https://a9z.dev pnpm build`、全検査、承認済み本番Workerへの配置を実行。
5. Dashboardで`a9z.dev`を当該WorkerのCustom Domainへ設定。既存のNetlify DNSとの競合を調整します。`www`等の既存転送があるなら別途維持。
6. `/`、`/blog?page=2`、年別、代表記事、元画像の旧URL/ハッシュURL、404、sitemap、robots、OGPと画像変換を実配信で再検査。

ロールバックは、保存したDNS/ドメイン設定を旧Netlifyサイトへ戻し、旧サイトの到達を確認します。新Worker内だけの不具合なら `pnpm exec wrangler rollback <version-id> --name <production-worker>` で直前の既知良好版へ戻せます。Cloudflareのversion rollbackだけではDNSやImages設定は戻りません。確認完了まで旧NetlifyサイトとGit入力を削除しません。

## 公式資料

2026-09-11に確認: [Astro Cloudflare](https://docs.astro.build/en/guides/deploy/cloudflare/)、[Content Loader](https://docs.astro.build/en/reference/content-loader-reference/)、[Static Assets設定](https://developers.cloudflare.com/workers/static-assets/binding/)、[HTML handling](https://developers.cloudflare.com/workers/static-assets/routing/advanced/html-handling/)、[上限](https://developers.cloudflare.com/workers/platform/limits/)、[Imagesオプション](https://developers.cloudflare.com/images/optimization/features/)、[料金](https://developers.cloudflare.com/images/pricing/)、[変換元制限](https://developers.cloudflare.com/images/optimization/transformations/sources/)、[形式](https://developers.cloudflare.com/images/get-started/limits/)。
