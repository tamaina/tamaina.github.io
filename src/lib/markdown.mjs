import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkMdc from 'remark-mdc';
import remarkGfm from 'remark-gfm';
import remarkRehype from 'remark-rehype';
import rehypeRaw from 'rehype-raw';
import rehypeStringify from 'rehype-stringify';
import { visit, SKIP } from 'unist-util-visit';
import { toString } from 'hast-util-to-string';
import GithubSlugger from 'github-slugger';
import { parse as parseYaml } from 'yaml';
import { missingImages } from './legacy-exceptions.mjs';
import { imageUrl } from './images.mjs';
import { isExternal, sourceReference, resolveLink, encodePath } from './paths.mjs';
const element = (tagName, properties = {}, children = []) => ({ type: 'element', tagName, properties, children });
const text = value => ({ type: 'text', value });
export function readMarkdown(raw) {
  const lines = raw.split('\n');
  let data = {}, body = raw;
  if (lines[0].trim() === '---') {
    const end = lines.findIndex((line, i) => i > 0 && line.trim() === '---');
    if (end < 0) throw new Error('Unclosed frontmatter');
    data = parseYaml(lines.slice(1,end).join('\n')) || {};
    body = lines.slice(end+1).join('\n');
  }
  const tree = unified().use(remarkParse).use(remarkMdc).use(remarkGfm).parse(body);
  const hast = unified().use(remarkRehype,{allowDangerousHtml:true}).use(rehypeRaw).runSync(tree);
  const children = hast.children.filter(n=>n.type==='element' && n.tagName!=='hr');
  const heading = children[0]?.tagName==='h1' ? children.shift() : undefined;
  const paragraph = children[0]?.tagName==='p' ? children[0] : undefined;
  const contentText = n => !n ? '' : n.type==='text' ? (/^\n+$/.test(n.value) ? '' : n.value) : n.tagName==='br' ? '' : (n.children||[]).map(contentText).join('');
  return { ...data, title: data.title || contentText(heading), description: data.description ?? contentText(paragraph), body };
}
export async function renderMarkdown(page, context) {
  const { articles, assets, settings, missing, transforms } = context;
  const headings = [], slugger = new GithubSlugger();
  function transform() {
    return tree => {
      visit(tree, 'element', (node, index, parent) => {
        if (/^h[1-6]$/.test(node.tagName)) {
          const id = String(node.properties.id || slugger.slug(toString(node))).replace(/-+/g,'-').replace(/^-|-$/g,'').replace(/^(\d)/,'_$1');
          node.properties.id = id; headings.push(id);
          if (['h2','h3','h4'].includes(node.tagName)) node.children = [element('a',{ href:'#'+id, className:['text-reset','text-decoration-none'] },node.children)];
        }
        if (node.tagName === 'a' && node.properties.href) {
          const href = String(node.properties.href);
          node.properties.href = resolveLink(page.source, href, articles, assets, issue => missing.push(issue));
          if (/^https?:/i.test(href)) { node.properties.target = '_blank'; node.properties.rel = ['noopener','noreferrer']; }
        }
        if (node.tagName === 'li') {
          let seen=false;
          node.children=node.children.flatMap(child=>{ if(child.type!=='element' || child.tagName!=='p')return [child]; const result=seen?[element('br'),...child.children]:child.children;seen=true;return result; });
        }
        if (node.tagName === 'blockquote') node.properties.className = ['blockquote'];
        if (node.tagName === 'embed-youtube') {
          const id = String(node.properties['video-id'] || node.properties.videoId || '');
          if (!/^[\w-]{11}$/.test(id)) throw new Error(`Invalid YouTube ID in ${page.source}: ${id}`);
          node.tagName = 'div'; node.properties = {className:['embed-youtube']};
          node.children = [element('iframe',{src:`https://www.youtube.com/embed/${id}`,title:'YouTube video',frameBorder:'0',allow:'accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture',allowFullScreen:true})];
        } else if (node.tagName.includes('-')) throw new Error(`Unknown custom element: ${node.tagName} in ${page.source}`);
        if (node.tagName === 'img') {
          const src = String(node.properties.src || '');
          let original = src, preview = src, asset;
          if (!isExternal(src)) {
            const [file] = sourceReference(page.source, src);
            asset = assets.get(file);
            if (!asset && !missingImages.has(page.source+'\n'+src)) throw new Error(`Missing image: ${page.source}: ${src} -> ${file}`);
            if (!asset) { original = preview = '/'+encodePath(file); missing.push({source:page.source,reference:src,resolved:original,kind:'existing-missing-image'}); }
            else {
            original = asset.url; preview = imageUrl(asset,'preview',settings);
            transforms.preview.add(imageUrl(asset,'preview',{mode:'cloudflare',origin:settings.origin || 'https://a9z.dev'}));
            }
          }
          node.properties = {...node.properties,src:preview,loading:'lazy',decoding:'async',className:['img-fluid','prose-img'],'data-original':original,...(asset ? {width:asset.width,height:asset.height,style:`width:min(100%,var(--prose-image-width),${asset.width}px,calc(min(30rem,50vh) * ${asset.width/asset.height}));aspect-ratio:${asset.width}/${asset.height}`} : {})};
          const caption = String(node.properties.title || '');
          const link = element('a',{href:original,'data-viewer':'',className:['original-link']},[node]);
          // Keep paragraph content valid; block display is assigned in CSS.
          parent.children[index] = element('span',{className:['prose-image']},[link,element('span',{className:['text-center','image-caption']},[text(caption)])]);
          return [SKIP, index + 1];
        }
      });
      visit(tree, 'element', (node,index,parent) => {
        if(node.tagName === 'table') {
          node.properties.className=['table','table-light','border-dark','mb-0'];
          parent.children[index]=element('div',{className:['table-responsive','mb-3']},[node]);
          return [SKIP,index+1];
        }
      });
    };
  }
  const html = String(await unified().use(remarkParse).use(remarkMdc).use(remarkGfm).use(remarkRehype,{allowDangerousHtml:true}).use(rehypeRaw).use(transform).use(rehypeStringify).process(page.body));
  return { html, headings };
}
