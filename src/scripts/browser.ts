import Viewer from 'viewerjs';
import { thumbnailSizes, thumbnailSrcset } from '../lib/images.mjs';
import 'viewerjs/dist/viewer.css';
import { normalizePage } from '../lib/listing.mjs';

// Create a viewer only on demand; its source always bypasses Transformations.
document.querySelectorAll<HTMLAnchorElement>('a[data-viewer]').forEach(link => {
  link.addEventListener('click', event => {
    if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    const img = link.querySelector('img')!;
    const viewer = new Viewer(img, {
      navbar: false,
      title: () => img.title || img.alt,
      url: () => link.href,
      hidden() { viewer.destroy(); },
    });
    viewer.show();
  });
});

type Item = {url:string;title:string;description:string;dates:string;image?:{thumbnail:string;og:string;original:string;width:number;height:number}};
function el<K extends keyof HTMLElementTagNameMap>(tag:K, className='', text='') {
  const node = document.createElement(tag); node.className=className; node.textContent=text; return node;
}
function card(item:Item, blog:boolean) {
  const outer=el('div',blog?'card mb-3 border-primary blog-index-item-outer':'mb-3 index-item-outer');
  const anchor=el('a',blog?'row g-0 text-reset text-decoration-none blog-index-item-inner':'text-decoration-none');anchor.href=item.url;outer.append(anchor);
  if (!blog) {
    anchor.append(el('div','index-item-title'+(item.description?'':' mb-0'),item.title),el('div','index-item-description',item.description));
    return outer;
  }
  const imageOuter=el('div','col-sm-4 blog-index-item-img-outer');
  if(item.image) {
    const picture=el('picture'), source=el('source');
    const srcset=thumbnailSrcset(item.image);if(srcset){source.srcset=srcset;source.sizes=thumbnailSizes;picture.append(source)}
    const img=el('img','w-100 rounded blog-index-item-img');img.dataset.original=item.image.original;img.width=item.image.width;img.height=item.image.height;img.alt='';img.loading='eager';picture.append(img);img.src=item.image.thumbnail;imageOuter.append(picture);
  }
  const content=el('div','col-sm-8'), body=el('div','card-body'), date=el('div','card-text');
  date.append(el('small','text-body-secondary',item.dates));
  body.append(date,el('h5','card-title fw-bold blog-index-item-title'+(item.description?'':' mb-0'),item.title),el('div','card-text blog-index-item-description',item.description));
  content.append(body);anchor.append(imageOuter,content);return outer;
}
for(const root of document.querySelectorAll<HTMLElement>('[data-list]')) {
  const blog=root.dataset.blog==='true', total=Number(root.dataset.total);
  const container=root.querySelector<HTMLElement>('[data-items]')!;
  const inputs=root.querySelectorAll<HTMLInputElement>('input');
  const prev=root.querySelectorAll<HTMLButtonElement>('[data-prev]'), next=root.querySelectorAll<HTMLButtonElement>('[data-next]');
  let current=1, sequence=0;
  let data:Promise<{items:Item[];perPage:number}>|undefined;
  const firstPage=container.innerHTML;
  function controls(page:number) {
    inputs.forEach(input=>input.value=String(page));
    prev.forEach(button=>{button.disabled=page===1;button.hidden=!blog && page===1});
    next.forEach(button=>{button.disabled=page===total;button.hidden=!blog && page===total});
  }
  async function display(raw:unknown, action:'push'|'replace'|'pop', scroll=false) {
    const id=++sequence;
    const page=normalizePage(raw,total);
    const url=new URL(location.href);
    if(total<=1 || (page===1 && !url.searchParams.has('page'))) url.searchParams.delete('page');
    else url.searchParams.set('page',String(page));
    if(action!=='pop' && url.href!==location.href) history[action==='push'?'pushState':'replaceState']({},'',url);
    else if(action==='pop' && url.href!==location.href) history.replaceState({},'',url);
    controls(page);
    try {
      if(page===1) container.innerHTML=firstPage;
      else {
        data ||= fetch(root.dataset.list!).then(response=>{if(!response.ok)throw new Error('list fetch failed');return response.json()}).catch(error=>{data=undefined;throw error});
        const list=await data;
        if(id!==sequence) return;
        container.replaceChildren(...list.items.slice((page-1)*list.perPage,page*list.perPage).map(item=>card(item,blog)));
      }
      current=page;
      root.querySelector<HTMLElement>('[data-list-error]')!.hidden=true;
      if(scroll) window.scrollTo(0,0);
    } catch {
      if(id!==sequence) return;
      container.replaceChildren();
      root.querySelector<HTMLElement>('[data-list-error]')!.hidden=false;
    } finally { if(id===sequence)document.documentElement.classList.remove('paging-pending'); }
  }
  prev.forEach(button=>button.addEventListener('click',()=>void display(current-1,'push',true)));
  next.forEach(button=>button.addEventListener('click',()=>void display(current+1,'push',true)));
  inputs.forEach(input=>input.addEventListener('change',()=>void display(input.value,'push',true)));
  window.addEventListener('popstate',()=>void display(new URLSearchParams(location.search).get('page'),'pop',true));
  void display(new URLSearchParams(location.search).get('page'),'replace');
}
if(!document.querySelector('[data-list]'))document.documentElement.classList.remove('paging-pending');
