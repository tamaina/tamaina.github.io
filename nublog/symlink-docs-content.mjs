import fs from 'node:fs/promises';
import path from 'node:path';
import { homeDir } from './constants.mjs';

export const symlinkDocsToContent = async file => { // file is starts with docs/
  console.log(file)
  // create symlink under content
  const target = file.replace(/^docs/, 'content');
  // create directory if it doesn't exist
  await fs.mkdir(path.resolve(homeDir, target.replace(/\/[^/]+$/, '')), { recursive: true }).catch(() => {});
  await fs.symlink(path.resolve(homeDir, file), path.resolve(homeDir, target), 'file');
};
