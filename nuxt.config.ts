import { defineNuxtConfig } from 'nuxt';

// https://v3.nuxtjs.org/api/configuration/nuxt.config
export default defineNuxtConfig({
  modules: [
    '@nuxt/content',
    '@nuxt/image-edge',
  ],
  content: {
    // content setting https://content.nuxtjs.org/api/configuration/

  },
  image: {
    // image config https://v1.image.nuxtjs.org/configuration

  }
});
