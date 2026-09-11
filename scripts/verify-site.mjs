import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import { sha256 } from '../src/lib/assets.mjs';
const origin=process.env.VERIFY_ORIGIN;
if(!origin?.startsWith('https://'))throw new Error('Set VERIFY_ORIGIN to HTTPS preview origin');
const paths=[...String(await fs.readFile('maintenance/baseline/sitemap.xml')).matchAll(/<loc>https:\/\/a9z.dev([^<]*)<\/loc>/g)].map(m=>m[1]||'/');
const results=[];
for(const path of [...paths,'/blog?page=2','/not-a-page','/_media/originals/missing.webp','/ads.txt','/boot.js','/blog/']) {
 const response=await fetch(origin+path,{redirect:'manual'});
 const result={path,status:response.status,location:response.headers.get('location')};results.push(result);
 if(path==='/blog/')assert.equal(response.status,307);
 else assert.equal(response.status,paths.includes(path)||path==='/blog?page=2'?200:404,JSON.stringify(result));
}
const {assets}=JSON.parse(await fs.readFile('.generated/assets.json','utf8'));
const [source,asset]=Object.entries(assets)[0];
for(const path of [asset.url,asset.legacyUrl]){
 const response=await fetch(origin+path);const bytes=Buffer.from(await response.arrayBuffer());assert.equal(response.status,200);assert.equal(sha256(bytes),asset.hash);
 results.push({path,status:response.status,sha256:sha256(bytes),cache:response.headers.get('cache-control')});
}
await fs.mkdir('maintenance/verification',{recursive:true});await fs.writeFile('maintenance/verification/remote-site.json',JSON.stringify({origin,source,results},null,2));console.log(`Verified ${results.length} deployed routes/assets`);
