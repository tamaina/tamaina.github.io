import { defineCollection } from 'astro:content';
import { z } from 'astro/zod';
import { buildSite } from './lib/site.mjs';
export const collections = {
  pages: defineCollection({
    loader: {
      name: 'existing-docs',
      async load({ store, watcher, logger, parseData }) {
        async function refresh() {
          const pages = await buildSite();
          store.clear();
          for (const page of pages) store.set({ id: page.url, data: await parseData({ id: page.url, data: page }) });
          logger.info(`Loaded ${pages.length} published pages directly from docs`);
        }
        await refresh();
        if (watcher) {
          // Serialize refreshes so copying assets never races another refresh.
          let pending = Promise.resolve();
          watcher.add('docs');
          const changed = (file: string) => {
            if (!/(?:^|\/)docs\//.test(file.replaceAll('\\', '/'))) return;
            pending = pending.then(refresh).catch(error => logger.error(String(error)));
          };
          watcher.on('add', changed); watcher.on('change', changed); watcher.on('unlink', changed);
        }
      },
    },
    schema: z.object({
      url:z.string(),title:z.string(),description:z.string(),html:z.string(),layout:z.string(),dates:z.string(),perPage:z.number(),
      publishedAt:z.string().optional(),updatedAt:z.string().optional(),
      image:z.object({original:z.string(),thumbnail:z.string(),og:z.string(),width:z.number(),height:z.number()}).optional(),
      breadcrumbs:z.array(z.object({url:z.string(),title:z.string()})),
      items:z.array(z.object({url:z.string(),title:z.string(),description:z.string(),dates:z.string(),image:z.object({original:z.string(),thumbnail:z.string(),og:z.string(),width:z.number(),height:z.number()}).optional()})),
    }),
  }),
};
