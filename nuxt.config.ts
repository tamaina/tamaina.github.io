import { defineNuxtConfig } from 'nuxt';

// https://v3.nuxtjs.org/api/configuration/nuxt.config
export default defineNuxtConfig({
  app: {
    head: {
      link: [
        { rel: 'stylesheet', href: 'https://cdn.jsdelivr.net/npm/bootstrap@5.2.0/dist/css/bootstrap.min.css' },
      ],
      script: [
        { src: 'https://cdn.jsdelivr.net/npm/bootstrap@5.2.0/dist/js/bootstrap.bundle.min.js' },
      ]
    }
  },
  css: [
  ],
  dir: {
    public: 'content',
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
    documentDriven: true,
  },
  nitro: {
    // nitro config

  },
  image: {
    // image config https://v1.image.nuxtjs.org/configuration
    provider: 'netlify',
  },
});
