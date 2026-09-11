import { getCollection } from 'astro:content';
import type { APIRoute } from 'astro';
export async function getStaticPaths() {
  return (await getCollection('pages')).filter(p=>['blog-index','default-index'].includes(p.data.layout)).map(p=>({params:{slug:p.data.url==='/'?'home':p.data.url.slice(1)},props:{items:p.data.items,perPage:p.data.perPage}}));
}
export const GET: APIRoute = ({ props }) => new Response(JSON.stringify(props),{headers:{'Content-Type':'application/json'}});
