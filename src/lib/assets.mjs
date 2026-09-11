import fs from 'node:fs/promises';
import path from 'node:path';
import { createHash } from 'node:crypto';
import sharp from 'sharp';
import { encodePath } from './paths.mjs';
export const dngException = '2.blog/2022/10-04 Leitz Phone 1 2/DSC_0069.dng';
export const sha256 = bytes => createHash('sha256').update(bytes).digest('hex');
export async function walk(root) {
  return (await fs.readdir(root, { recursive: true, withFileTypes: true })).filter(e => e.isFile()).map(e => path.relative(root, path.join(e.parentPath, e.name)).split(path.sep).join('/')).sort();
}
export async function prepareAssets(root = 'docs', output = '.generated/public') {
  const files = await walk(root), assets = new Map(), excluded = [];
  await fs.rm(output, { recursive: true, force: true });
  await fs.mkdir(output, { recursive: true });
  async function stage(file) {
    const target = path.join(output, file);
    await fs.mkdir(path.dirname(target), { recursive: true });
    await fs.symlink(path.relative(path.dirname(path.resolve(target)), path.resolve(root, file)), target);
  }
  for (const file of files) {
    if (file.endsWith('.md')) continue;
    if (['ads.txt', 'boot.js'].includes(file)) { excluded.push({ file, reason: 'AdSense input, not published' }); continue; }
    const bytes = await fs.readFile(path.join(root, file));
    if (bytes.subarray(0, 150).toString().startsWith('version https://git-lfs.github.com/spec/')) throw new Error(`Git LFS pointer, fetch original: ${file}`);
    if (file === dngException) { excluded.push({ file, bytes: bytes.length, reason: 'Existing GitHub RAW download; exceeds Static Assets limit' }); continue; }
    if (bytes.length > 25 * 1024 * 1024) {
      const references=[];
      for (const md of files.filter(f=>f.endsWith('.md'))) if ((await fs.readFile(path.join(root,md),'utf8')).includes(path.basename(file))) references.push(md);
      throw new Error(`Asset exceeds 25MiB: ${file} (${bytes.length} bytes), references: ${references.join(', ') || '(unreferenced)'}`);
    }
    const ext = path.extname(file).toLowerCase();
    if (file === 'robots.txt') { await stage(file); continue; }
    if (!['.webp', '.png', '.jpg', '.jpeg', '.gif', '.avif', '.svg', '.heic', '.pdf', '.zip', '.txt'].includes(ext)) throw new Error(`Unclassified attachment: ${file}`);
    const hash = sha256(bytes), url = '/' + encodePath(file);
    const transformable = ['.webp', '.png', '.jpg', '.jpeg', '.gif', '.avif'].includes(ext);
    const metadata = transformable ? await sharp(bytes).metadata() : {};
    const asset = { url, hash, bytes: bytes.length, transformable, width: metadata.width, height: metadata.height, format: metadata.format || ext.slice(1) };
    assets.set(file, asset);
    await stage(file);
  }
  return { assets, excluded, files };
}
