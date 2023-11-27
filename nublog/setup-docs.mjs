import { glob } from 'glob';
import fs from 'node:fs/promises';
import { documentGlob, contentDir, homeDir } from './constants.mjs';
import { symlinkDocsToContent } from './symlink-docs-content.mjs';

await fs.rm(contentDir, { recursive: true }).catch(() => {});
await fs.mkdir(contentDir);

glob.sync(documentGlob, { nodir: true, cwd: homeDir }).forEach(symlinkDocsToContent);
