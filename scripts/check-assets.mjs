import fs from 'node:fs/promises';
import assert from 'node:assert/strict';
import { walk, sha256 } from '../src/lib/assets.mjs';
const { assets, excluded } = JSON.parse(await fs.readFile('.generated/assets.json','utf8'));
const files = await walk('dist');
assert(files.length <= 20000, `Asset count ${files.length} exceeds free plan 20000`);
let total=0, largest={file:'',bytes:0};
const allowedImages=new Set();
for(const [source,asset] of Object.entries(assets)) {
  const input=await fs.readFile('docs/'+source);
  const bytes=await fs.readFile('dist/'+source);
  assert.equal(sha256(bytes),sha256(input),`Original changed: ${source}`);
  assert.equal(asset.url,'/'+source.split('/').map(encodeURIComponent).join('/'));
  allowedImages.add(source);
}
for(const file of files) {
  const bytes=await fs.readFile('dist/'+file);
  assert(bytes.length<=25*1024*1024,`Oversized upload: ${file}`);
  total+=bytes.length;if(bytes.length>largest.bytes)largest={file,bytes:bytes.length};
  assert(!/\.(md|dng)$|(?:^|\/)(?:ads\.txt|boot\.js)$/.test(file),`Excluded source published: ${file}`);
  if(/\.(?:webp|png|jpe?g|gif|avif|heic)$/i.test(file)) assert(allowedImages.has(file),`Unexpected derived image: ${file}`);
  if(/\.(html|js|json)$/.test(file)) {
    const text=bytes.toString();
    assert(!/adsbygoogle|ca-pub-|data-ad-|googlesyndication\.com|fundingchoicesmessages\.google\.com/.test(text),`AdSense output: ${file}`);
    assert(!text.includes(process.cwd()) && !text.includes('/home/aqz/'),`Local path leaked: ${file}`);
  }
}
const report=JSON.parse(await fs.readFile('.generated/report.json','utf8'));
Object.assign(report,{assetCount:files.length,totalBytes:total,largest,excluded});
await fs.writeFile('.generated/report.json',JSON.stringify(report,null,2));
console.log(JSON.stringify({...report,missing:report.missing.length},null,2));
