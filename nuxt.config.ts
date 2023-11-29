// https://v3.nuxtjs.org/api/configuration/nuxt.config
export default defineNuxtConfig({
  ssr: true,
  app: {
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
    contentHead: false,
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
