import fs from 'node:fs/promises';
import * as chokidar from 'chokidar';
import { documentGlob, contentDir, homeDir } from './constants.mjs';
import { symlinkDocsToContent } from './symlink-docs-content.mjs';

await fs.rm(contentDir, { recursive: true }).catch(() => {});
await fs.mkdir(contentDir);

const watcher = chokidar.watch(documentGlob, { persistent: true, ignoreInitial: false, cwd: homeDir });

watcher
  .on('add', symlinkDocsToContent)
  .on('unlink', async file => {
    console.log(`${file} removed`)
    const target = path.resolve(homeDir, file.replace(/^docs/, 'content'));
    await fs.unlink(target);
  });
