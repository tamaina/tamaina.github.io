import glob from 'glob';
import fs from 'node:fs/promises';

await fs.rmdir('content', { recursive: true }).catch(() => {});
await fs.mkdir('content');
await fs.rmdir('public', { recursive: true }).catch(() => {});
await fs.mkdir('public');

const documentExts = 'md|yml|yaml|json|csv';

glob.sync(`docs/**/*.+(${documentExts})`, { nodir: true }).forEach((file) => {
  // create symlink under content
  const target = file.replace(/^docs/, 'content');
  fs.symlink(file, target, 'file');
});

glob.sync(`docs/**/*.!(${documentExts})`, { nodir: true }).forEach((file) => {
  // create symlink under public
  const target = file.replace(/^docs/, 'public');
  fs.symlink(file, target, 'file');
});
