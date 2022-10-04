import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
export const __dirname = path.dirname(__filename);
export const homeDir = path.resolve(__dirname, '../');

export const documentExts = 'md|yml|yaml|json|csv';
export const documentGlob = `docs/**/*.+(${documentExts})`;
export const contentDir = path.resolve(homeDir, 'content');
