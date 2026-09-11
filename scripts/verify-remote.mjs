import fs from 'node:fs/promises';
import assert from 'node:assert/strict';
import sharp from 'sharp';
import { sha256 } from '../src/lib/assets.mjs';
import { imageUrl } from '../src/lib/images.mjs';
const origin=process.env.VERIFY_ORIGIN;
if(!origin || !origin.startsWith('https://'))throw new Error('Set VERIFY_ORIGIN to the Transformations-enabled HTTPS test host');
const {assets}=JSON.parse(await fs.readFile('.generated/assets.json','utf8'));
const [source,asset]=Object.entries(assets).find(([,a])=>a.transformable && a.width>1200);
assert.equal(imageUrl(asset,'og',{mode:'cloudflare',origin}),imageUrl(asset,'preview',{mode:'cloudflare',origin}));
const results=[], failures=[];
for(const preset of ['original','thumbnail','preview']) {
 for(const accept of preset==='original'?['image/jpeg']:['image/avif,image/webp,image/*','image/jpeg,image/*']) {
  const url=preset==='original'?origin+asset.url:imageUrl(asset,preset,{mode:'cloudflare',origin});
  const response=await fetch(url,{headers:{Accept:accept},redirect:'manual'});
  const bytes=Buffer.from(await response.arrayBuffer());
  const metadata=await sharp(bytes).metadata().catch(()=>({}));
  const result={preset,accept,status:response.status,type:response.headers.get('content-type'),location:response.headers.get('location'),width:metadata.width,height:metadata.height,format:metadata.format,bytes:bytes.length};
  results.push(result);
  await fs.mkdir('.generated/verification',{recursive:true});
  await fs.writeFile('.generated/verification/remote-images.json',JSON.stringify({origin,source,results},null,2));
  try {
  assert.equal(response.status,200,JSON.stringify(result));
  assert.equal(result.location,null,'Redirect/fallback is not transformation success');
  assert.match(result.type,/^image\//);
  if(preset==='original')assert.equal(sha256(bytes),sha256(await fs.readFile('docs/'+source)));
  else {
   assert.notEqual(sha256(bytes),asset.hash,'Original fallback returned instead of transformation');
   assert.equal(metadata.width,preset==='thumbnail'?480:1200);assert(Math.abs(metadata.height-metadata.width*asset.height/asset.width)<=1)
  }
  } catch(error) { result.error=error.message; failures.push(error); }
 }
}
await fs.mkdir('.generated/verification',{recursive:true});
await fs.writeFile('.generated/verification/remote-images.json',JSON.stringify({origin,source,results},null,2));
console.log(results);
if(failures.length) throw new AggregateError(failures, 'Real transformations did not pass; original fallback is not success');
