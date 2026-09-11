import { getCollection } from 'astro:content';
import type { APIRoute } from 'astro';
const xml = (s:string) => s.replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('"','&quot;');
export const GET: APIRoute = async () => new Response('<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">'+(await getCollection('pages')).map(({data:p})=>`<url><loc>${xml(new URL(p.url,'https://a9z.dev').href)}</loc>${p.updatedAt||p.publishedAt?`<lastmod>${new Date(p.updatedAt||p.publishedAt!).toISOString()}</lastmod>`:''}</url>`).join('')+'</urlset>',{headers:{'Content-Type':'application/xml'}});
