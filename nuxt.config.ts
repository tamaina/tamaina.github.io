// https://v3.nuxtjs.org/api/configuration/nuxt.config
export default defineNuxtConfig({
  ssr: true,
  app: {
    head: {
      link: [
        { rel: 'stylesheet', href: 'https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css' },
        { rel: 'stylesheet', href: 'https://cdn.jsdelivr.net/gh/tamaina/The-Japanese-Web-Fonts@v7.2.0/dist/GenEiUniverSans/GenEiUniverSans.css' },
        { rel: 'stylesheet', href: 'https://cdn.jsdelivr.net/npm/yakuhanjp@3.3.0/dist/css/yakuhanjp.min.css' },
        { rel: 'stylesheet', href: 'https://cdn.jsdelivr.net/gh/tamaina/The-Japanese-Web-Fonts@v7.2.0/dist/SourceHanSans/SourceHanSans.css' },
        { rel: 'stylesheet', href: 'https://cdn.jsdelivr.net/gh/tamaina/The-Japanese-Web-Fonts@v7.2.0/dist/NasuM/NasuM.css' },
      ],
      script: [
        { src: '/boot.js', async: true },
        { src: 'https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js' },
      ]
    }
  },
  css: [
    '~/assets/style.scss',
  ],
  dir: {
    public: 'docs',
  },
  modules: [
    '@nuxt/image',
    '@nuxt/content',
  ],
  router: {

  },
  content: {
    // content config https://content.nuxtjs.org/api/configuration/
    documentDriven: {
      layoutFallbacks: ['default'],
    },
    locales: ['ja'],
    defaultLocale: 'ja',
  },
  nitro: {
    // nitro config
    prerender: {
      routes: [
        '/sitemap.xml', // https://content.nuxtjs.org/guide/recipes/sitemap
      ]
    }
  },
  image: {
    // image config https://image.nuxtjs.org/configuration
    //provider: 'netlify',
    screens: { xs: 320, sm: 640, md: 768, lg: 1024, xl: 1280, xxl: 1536, '2xl': 1536, max: 8192 },
  },
  plugins: [
    { src: '~/plugins/vercel.ts', mode: 'client' },
  ],
});
