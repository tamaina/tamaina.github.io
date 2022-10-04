// https://v3.nuxtjs.org/api/configuration/nuxt.config
export default defineNuxtConfig({
  app: {
    head: {
      link: [
        { rel: 'stylesheet', href: 'https://cdn.jsdelivr.net/npm/bootstrap@5.2.0/dist/css/bootstrap.min.css' },
        { rel: 'stylesheet', href: 'https://cdn.jsdelivr.net/gh/tamaina/The-Japanese-Web-Fonts@v7.2.0/dist/GenEiUniverSans/GenEiUniverSans.css' },
        { rel: 'stylesheet', href: 'https://cdn.jsdelivr.net/npm/yakuhanjp@3.3.0/dist/css/yakuhanjp.min.css' },
        { rel: 'stylesheet', href: 'https://cdn.jsdelivr.net/gh/tamaina/The-Japanese-Web-Fonts@v7.2.0/dist/SourceHanSans/SourceHanSans.css' },
        { rel: 'stylesheet', href: 'https://cdn.jsdelivr.net/gh/tamaina/The-Japanese-Web-Fonts@v7.2.0/dist/NasuM/NasuM.css' },
      ],
      script: [
        { src: '/boot.js', async: true },
        { src: 'https://cdn.jsdelivr.net/npm/bootstrap@5.2.0/dist/js/bootstrap.bundle.min.js' },
      ]
    }
  },
  css: [
  ],
  dir: {
    public: 'docs',
  },
  modules: [
    '@nuxt/image-edge',
    '@nuxt/content',
  ],
  router: {
    // router config https://nuxtjs.org/docs/configuration-glossary/configuration-router/
    trailingSlash: false,
  },
  content: {
    // content config https://content.nuxtjs.org/api/configuration/
    documentDriven: {
      layoutFallbacks: ['default'],
    },
    locales: ['ja'],
    defaultLocale: 'ja',
    ignores: [
      '\\.', '-',
      '.(jpg|jpeg|png|webp|heif|gif|dng|JPG|JPEG|PNG|WEBP|HEIF|GIF|DNG)$',
    ],
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
    // image config https://v1.image.nuxtjs.org/configuration
    provider: 'netlify',
    screens: { xs: 320, sm: 640, md: 768, lg: 1024, xl: 1280, xxl: 1536, '2xl': 1536, max: 8192 },
  },
});
