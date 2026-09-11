import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import { articleUrl, articleMap, resolveLink, sourceReference } from '../src/lib/paths.mjs';
import { imageUrl, imageSettings, presets } from '../src/lib/images.mjs';
import { sha256 } from '../src/lib/assets.mjs';
import { readMarkdown, renderMarkdown } from '../src/lib/markdown.mjs';
import { normalizePage, formatDates, listingPages } from '../src/lib/listing.mjs';
const baseline = JSON.parse(await fs.readFile('maintenance/baseline/content.json','utf8'));
test('all legacy URLs match original Nuxt parser and captured production sitemap',async()=>{
  const actual=baseline.filter(p=>!p.draft).map(p=>articleUrl(p._file)).sort();
  assert.deepEqual(actual,baseline.filter(p=>!p.draft).map(p=>p._path).sort());
  const sitemap=await fs.readFile('maintenance/baseline/sitemap.xml','utf8');
  assert.deepEqual(actual,[...sitemap.matchAll(/<loc>https:\/\/a9z.dev([^<]*)<\/loc>/g)].map(m=>m[1]||'/').sort());
});
test('URL case, numeric order prefixes, versions, spaces, index and collisions',()=>{
  assert.equal(articleUrl('3.products/The-Japanese-Web-Fonts/index.md'),'/products/the-japanese-web-fonts');
  assert.equal(articleUrl('2.blog/2022/05-20 m1mba-1/index.md'),'/blog/2022/05-20-m1mba-1');
  assert.equal(articleUrl('1.index.md'),'/');
  assert.equal(articleUrl('api/1.2/index.md'),'/api/1.2');
  assert.throws(()=>articleMap(['foo.md','foo/index.md']),/collision/);
});
test('file and public relative links preserve image case and query/hash case',()=>{
  const map=articleMap(['1.index.md','2.blog/2022/Foo Bar/index.md','2.blog/2022/Baz.md','3.products/venc.md']);
  const assets=new Map([['2.blog/2022/Foo Bar/A 日本語.webp',{url:'/_media/originals/abc.webp'}]]);
  const source='2.blog/2022/Foo Bar/index.md';
  assert.equal(resolveLink(source,'../Baz.md?Q=Case#日本語',map,assets),'/blog/2022/baz?Q=Case#日本語');
  assert.equal(resolveLink(source,'../baz?Q=Case#Heading',map,assets),'/blog/2022/baz?Q=Case#Heading');
  assert.equal(resolveLink(source,'A%20日本語.webp?Q=Case#A',map,assets),'/_media/originals/abc.webp?Q=Case#A');
  assert.deepEqual(sourceReference(source,'./A%20日本語.webp'),['2.blog/2022/Foo Bar/A 日本語.webp','']);
  for(const url of ['https://example.com/A?B=C#D','mailto:Some@One.Example','tel:+123','#日本語'])assert.equal(resolveLink(source,url,map,assets),url);
  assert.deepEqual(sourceReference('3.products/venc.md','./a.webp'),['3.products/a.webp','']);
});
test('fixed presets and immutable content identity',()=>{
  const original={url:`/_media/originals/${sha256(Buffer.from('original'))}.webp`,transformable:true};
  const settings=imageSettings({IMAGE_MODE:'cloudflare',IMAGE_ORIGIN:'https://images.example.com'});
  assert.equal(imageUrl(original,'preview',settings),`https://images.example.com/cdn-cgi/image/${presets.preview}${original.url}`);
  assert.equal(imageUrl(original,'thumbnail',{mode:'original'}),original.url);
  assert.equal(sha256(Buffer.from('original')),sha256(Buffer.from('original')));
  assert.notEqual(sha256(Buffer.from('original')),sha256(Buffer.from('replacement')));
  assert.throws(()=>imageUrl(original,'arbitrary',settings));
  assert.throws(()=>imageSettings({IMAGE_MODE:'cloudflare',IMAGE_ORIGIN:'http://localhost'}));
});
test('pagination boundaries and explicit JST dates',()=>{
  for(const value of [null,'',0,-1,'abc',1.5,'Infinity'])assert.equal(normalizePage(value,5),1);
  assert.equal(normalizePage(999,5),5);assert.equal(normalizePage(2,5),2);assert.equal(normalizePage(99,0),1);
  assert.equal(formatDates({publishedAt:'2024-05-02T05:00:00+0900'}),'2024年5月2日');
  assert.equal(formatDates({publishedAt:'2022-05-20',updatedAt:'2022-05-21'}),'2022年5月20日 / 2022年5月21日更新');
});
test('frontmatter, H1 and descriptions retain legacy values across all articles',async()=>{
  for(const old of baseline){const page=readMarkdown(await fs.readFile('docs/'+old._file,'utf8'));assert.equal(page.title,old.title,old._file);assert.equal(page.description,old.description,old._file)}
});
test('headings across existing articles match Nuxt IDs',async()=>{
  const files=await fs.readdir('docs',{recursive:true});
  const assets=new Map(files.filter(f=>/\.webp$/.test(f)).map(f=>[f,{url:'/_media/originals/test.webp',transformable:true,width:1,height:1}]));
  const context={articles:articleMap(baseline.map(p=>p._file)),assets,settings:{mode:'original'},missing:[],transforms:{preview:new Set()}};
  for(const old of baseline){
    const data=readMarkdown(await fs.readFile('docs/'+old._file,'utf8'));
    const {headings}=await renderMarkdown({...data,source:old._file},context);
    const expected=[];function walk(n){if(/^h[1-6]$/.test(n.tag))expected.push(n.props.id);for(const child of n.children||[])walk(child)}walk(old.body);
    assert.deepEqual(headings,expected,old._file);
  }
});
test('HTML images, custom tags, tables and duplicate heading IDs use AST processing',async()=>{
  const source='test/index.md';const assets=new Map([['test/A.webp',{url:'/_media/originals/a.webp',transformable:true,width:100,height:50}]]);
  const context={articles:articleMap([source]),assets,settings:{mode:'original'},missing:[],transforms:{preview:new Set()}};
  const data=readMarkdown('# 日本語\n\n## A!\n\n## A!\n\n<img src="A.webp" alt="a" title="Caption">\n\n<embed-youtube video-id="Afk-P9sLUYo"></embed-youtube>\n\n|A|B|\n|-|-|\n|1|2|');
  const result=await renderMarkdown({...data,source},context);
  assert.deepEqual(result.headings,['日本語','a','a-1']);
  assert.match(result.html,/data-viewer/);assert.match(result.html,/Caption/);assert.match(result.html,/youtube.com\/embed\/Afk-P9sLUYo/);assert.match(result.html,/table-responsive/);
  await assert.rejects(()=>renderMarkdown({source,body:'<embed-youtube video-id="bad"></embed-youtube>'},context),/Invalid YouTube/);
  await assert.rejects(()=>renderMarkdown({source,body:'<unknown-widget>text</unknown-widget>'},context),/Unknown custom/);
});
test('list scope: direct descendants, year descendants, stable date ties and where',()=>{
 const pages=[{url:'/blog/2024/a',source:'a',publishedAt:'2024-01-01'},{url:'/blog/2024/b',source:'b',publishedAt:'2024-01-01'},{url:'/blog/2023/c',source:'c',publishedAt:'2023-01-01'},{url:'/blog/2024',source:'year'}];
 assert.deepEqual(listingPages({url:'/blog/2024',layout:'blog-index'},pages).map(p=>p.source),['a','b']);
 assert.deepEqual(listingPages({url:'/blog',layout:'default-index'},pages).map(p=>p.source),['year']);
 assert.deepEqual(listingPages({url:'/blog/2024',layout:'blog-index',where:{source:{$eq:'a'}}},pages).map(p=>p.source),['a']);
});
