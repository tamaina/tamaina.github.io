import path from 'node:path';
import fs from 'node:fs';
import fsp from 'node:fs/promises';
import remarkStringify from 'remark-stringify';
import async from 'async';
import { homeDir } from '../nublog/constants.mjs';

//#region parsing argument
const arg = process.argv[2];

if (!arg || !arg.endsWith('.md')) Error('The argument is invalid or the file does not ends with `.md`.');

const argPath = path.parse(path.isAbsolute(arg) ? arg : path.resolve(homeDir, arg));

if (argPath.name === 'index') Error('You should name the source file other than `index.md`.');
//#endregion

function getFileNameFromUrl(urlStr) {
    const url = new URL(urlStr);
    const path = url.pathname.split('/')[url.pathname.split('/').length - 1];
}

const file = await fsp.readFile(path.format(argPath), { encoding: 'utf8' });
const outPath = Object.assign({}, argPath, { base: 'index.md' });

const q = async.queue(async (fileUrl, cb) => {
    const fetched = await fetch(fileUrl);
    const filePath = path.format(Object.assign({}, argPath, { base: getFileNameFromUrl(fileUrl) }));
    return fsp.writeFile(filePath, fetched.arrayBuffer()).then(() => {
        cb(null, filePath);
    }).catch(cb);
}, 3);


