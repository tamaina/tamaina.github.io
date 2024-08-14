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
    screens: { smp: 399.99, sm: 575.99, md: 767.99, lg: 991.99, xl: 1199.99, xxl: 1399.99, '2xl': 1399.99, '4k': 4096, max: 8192 },
    densities: [1, 2],
    format: ['avif', 'webp'],
  },

  plugins: [
    { src: '~/plugins/vercel.ts', mode: 'client' },
  ],

  compatibilityDate: '2024-08-14',
});