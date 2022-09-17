// https://content.nuxtjs.org/guide/recipes/sitemap

import { serverQueryContent } from '#content/server'
import { SitemapStream, streamToPromise } from 'sitemap'

export default defineEventHandler(async (event) => {
  // Fetch all documents
  const docs = await serverQueryContent(event).find()
  const sitemap = new SitemapStream({
    hostname: 'https://a9z.dev'
  })

  for (const doc of docs) {
    if (!doc._path) continue;

    sitemap.write({
      url: doc._path,
      lastmod: doc.updatedAt || doc.publishedAt
    })
  }
  sitemap.end()

  return streamToPromise(sitemap)
})
