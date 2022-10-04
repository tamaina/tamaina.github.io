import glob from 'glob';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { documentExts } from './nublog-constants.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

await fs.rm('content', { recursive: true }).catch(() => {});
await fs.mkdir('content');

glob.sync(`docs/**/*.+(${documentExts})`, { nodir: true }).forEach(async (file) => {
  // create symlink under content
  const target = file.replace(/^docs/, 'content');
  // create directory if it doesn't exist
  await fs.mkdir(target.replace(/\/[^/]+$/, ''), { recursive: true }).catch(() => {});
  await fs.symlink(path.resolve(__dirname, file), target, 'file');
});
