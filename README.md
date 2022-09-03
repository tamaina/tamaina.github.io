# NuBlog Boilerplate v1
Build Git-based ~~static~~ blog with Nuxt 3!

Based on [Nuxt Content](https://content.nuxtjs.org/) and [Nuxt Image](https://v1.image.nuxtjs.org/)

## Installation
1. Install Node.js
2. Fork this repository
3. `npm install`

## ~~Publish~~
~~I recommend to use the static site hosting service like Netlify or Cloudflare Pages.~~

~~Build Command: `npm run generate`~~ 　
~~Public Path: `.output/public`~~

The static site currently do not work because Nuxt Image does not yet support `nuxt generate`.  
https://v1.image.nuxtjs.org/advanced/static-images

## Server
1. `npm run build` to build
2. `PORT=3000 node .output/server/index.mjs` to run server

## Development and Preview
Development: `npm run dev`  
Static Site Preview: `npm run generate && npm run preview`  
Server Preview: `npm run build && npm run preview`
