import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { prepareAssets, dngException } from '../src/lib/assets.mjs';
import { articleMap } from '../src/lib/paths.mjs';
import { imageUrl } from '../src/lib/images.mjs';
test('add, replace, rename, delete images and text-only edits preserve byte identity',async()=>{
 const root=await fs.mkdtemp(path.join(os.tmpdir(),'a9z-assets-'));const docs=root+'/docs',out=root+'/out';await fs.mkdir(docs);
 try {
  const a=await fs.readFile('docs/2.blog/2022/05-20 m1mba-1/0.webp');const b=await fs.readFile('docs/2.blog/2022/05-20 m1mba-1/1.webp');
  await fs.writeFile(docs+'/A.webp',a);await fs.writeFile(docs+'/index.md','# Test');
  const first=await prepareAssets(docs,out),original=first.assets.get('A.webp');
  assert.deepEqual(await fs.readFile(out+original.url),a);
  await fs.writeFile(docs+'/index.md','# Edited');await fs.writeFile(docs+'/B.webp',b);
  const second=await prepareAssets(docs,out);assert.equal(second.assets.get('A.webp').url,original.url);
  const settings={mode:'cloudflare',origin:'https://a9z.dev'};
  assert.equal(imageUrl(second.assets.get('A.webp'),'preview',settings),imageUrl(original,'preview',settings));
  await fs.writeFile(docs+'/A.webp',b);const replaced=await prepareAssets(docs,out);
  assert.notEqual(replaced.assets.get('A.webp').url,original.url);assert.equal(replaced.assets.get('B.webp').url,second.assets.get('B.webp').url);
  await fs.rename(docs+'/B.webp',docs+'/Case 日本語.webp');await fs.unlink(docs+'/A.webp');
  const renamed=await prepareAssets(docs,out);assert.equal(renamed.assets.size,1);assert.equal(renamed.assets.get('Case 日本語.webp').url,second.assets.get('B.webp').url);
  await assert.rejects(fs.access(out+'/B.webp'));
  assert.equal(articleMap(['index.md','new/index.md']).byUrl.size,2);assert.equal(articleMap(['index.md','renamed.md']).bySource.get('renamed.md'),'/renamed');
 } finally {await fs.rm(root,{recursive:true,force:true})}
});
test('oversize only permits the specific existing DNG; pointers and unclassified files fail',async()=>{
 const root=await fs.mkdtemp(path.join(os.tmpdir(),'a9z-limits-'));const docs=root+'/docs',out=root+'/out';await fs.mkdir(docs);
 try {
  await fs.writeFile(docs+'/large.pdf',Buffer.alloc(25*1024*1024+1));await fs.writeFile(docs+'/index.md','[download](large.pdf)');
  await assert.rejects(()=>prepareAssets(docs,out),/large.pdf.*index.md/);await fs.unlink(docs+'/large.pdf');
  await fs.mkdir(path.dirname(docs+'/'+dngException),{recursive:true});await fs.writeFile(docs+'/'+dngException,Buffer.alloc(25*1024*1024+1));
  assert.equal((await prepareAssets(docs,out)).excluded[0].file,dngException);
  await fs.writeFile(docs+'/pointer.webp','version https://git-lfs.github.com/spec/v1\noid sha256:abcd\n');await assert.rejects(()=>prepareAssets(docs,out),/LFS pointer/);await fs.unlink(docs+'/pointer.webp');
  await fs.writeFile(docs+'/unknown.bin','test');await assert.rejects(()=>prepareAssets(docs,out),/Unclassified/);
 } finally {await fs.rm(root,{recursive:true,force:true})}
});
