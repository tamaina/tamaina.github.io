import fs from 'node:fs/promises';
import { articleMap, sourceReference } from './paths.mjs';
import { prepareAssets } from './assets.mjs';
import { imageSettings, imageUrl } from './images.mjs';
import { readMarkdown, renderMarkdown } from './markdown.mjs';
import { listingPages, formatDates } from './listing.mjs';
export async function buildSite() {
  const { assets, excluded, files } = await prepareAssets();
  const settings = imageSettings();
  const articles = articleMap(files.filter(f=>f.endsWith('.md')));
  const transforms = { thumbnail:new Set(), preview:new Set() }, missing = [];
  const pages=[];
  for (const source of articles.bySource.keys()) {
    const data = readMarkdown(await fs.readFile('docs/'+source,'utf8'));
    if (data.draft || source.split('/').some(p=>p.startsWith('_') || p.includes('.draft'))) continue;
    const layout = data.layout || 'default';
    if (!['default','default-index','blog-index','plain'].includes(layout)) throw new Error(`Unknown layout ${layout}: ${source}`);
    const page = {...data,source,url:articles.bySource.get(source),layout};
    for (const field of ['publishedAt','updatedAt']) if (page[field] && Number.isNaN(new Date(page[field]).getTime())) throw new Error(`Invalid ${field}: ${source}`);
    page.dates = formatDates(page);
    if (page.thumbnail) {
      const [file] = sourceReference(source,page.thumbnail);
      const asset = assets.get(file);
      if (!asset && !(source === '4.memo/audio-visual/obs-udp.md' && page.thumbnail === 'scnsht.webp')) throw new Error(`Missing thumbnail: ${source}: ${file}`);
      if (!asset) missing.push({source,reference:page.thumbnail,kind:'existing-missing-thumbnail'});
      else {
      page.image = {original:asset.url,thumbnail:imageUrl(asset,'thumbnail',settings),og:imageUrl(asset,'og',settings),width:asset.width,height:asset.height};
      transforms.preview.add(imageUrl(asset,'og',{mode:'cloudflare',origin:settings.origin || 'https://a9z.dev'}));
      }
    }
    Object.assign(page,await renderMarkdown(page,{articles,assets,settings,missing,transforms}));
    delete page.body;
    pages.push(page);
  }
  for (const page of pages) {
    const items = listingPages(page,pages);
    page.perPage = page.layout === 'blog-index' ? 10 : 30;
    page.items = items.map(p=>({url:p.url,title:p.title,description:p.description,dates:p.dates,image:p.image}));
    if (page.layout === 'blog-index') for(const p of items) if(p.image) {
      const [file] = sourceReference(p.source,p.thumbnail);
      transforms.thumbnail.add(imageUrl(assets.get(file),'thumbnail',{mode:'cloudflare',origin:settings.origin || 'https://a9z.dev'}));
    }
    page.breadcrumbs = page.url === '/' ? [] : pages.filter(p=>p.url === '/' || page.url.startsWith(p.url+'/')).sort((a,b)=>a.url.length-b.url.length).map(p=>({url:p.url,title:p.navigation?.title || p.title}));
  }
  const newMissing = missing.filter(issue => !issue.kind);
  if (newMissing.length) throw new Error('New broken internal links: '+JSON.stringify(newMissing));
  await fs.mkdir('.generated',{recursive:true});
  await fs.writeFile('.generated/assets.json',JSON.stringify({assets:Object.fromEntries(assets),excluded},null,2));
  await fs.writeFile('.generated/report.json',JSON.stringify({pages:pages.length,sourceImages:[...assets.values()].filter(a=>a.transformable).length,originals:new Set([...assets.values()].map(a=>a.url)).size,transformations:Object.fromEntries(Object.entries(transforms).map(([key,urls])=>[key,urls.size])),missing,excluded},null,2));
  return pages;
}
