import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { documentExts } from './nublog-constants.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function fileExists(filepath) {
  try {
    return !!(await fs.lstat(filepath))
  } catch (e) {
    return false
  }
}

const watcher = fs.watch('docs', { recursive: true });

for await (const event of watcher) {
  console.log(event)
  try {
    if (event.eventType === 'rename' && event.filename.match(new RegExp(`\.(${documentExts})$`))) {
      // 作成・削除時にrenameが呼ばれる
      // symlinkなので作成・削除だけを見ていればよい
  
      const target = path.join('content', event.filename);
  
      const exists = await fileExists(path.resolve(__dirname, './docs', event.filename));
  
      if (exists) {
        console.log(`${event.filename} created`)
        // create directory if it doesn't exist
        await fs.mkdir(target.replace(/\/[^/]+$/, ''), { recursive: true }).catch(() => {});
        await fs.symlink(path.resolve(__dirname, event.filename), target, 'file');
      } else {
        console.log(`${event.filename} removed`)
        await fs.unlink(target);
      }
    }
  } catch(e) {
    console.error(e);
  }
};
