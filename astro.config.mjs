import { defineConfig } from 'astro/config';
export default defineConfig({
  site: 'https://a9z.dev',
  output: 'static',
  trailingSlash: 'never',
  publicDir: './.generated/public',
  build: { format: 'file' },
  devToolbar: { enabled: false },
});
