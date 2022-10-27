/*
 * Process markdown files and download images
 *
 * Execute with path to markdown file as argument on node.js
 * e.g. `node import-markdown.mjs '~/docs/2022/05-20 AWESOME ARTICLE NAME/_source.md'`
 * 
 * and following files will generate in the same directory (e.g. ~/docs/2022/05-20 AWESOME ARTICLE NAME/):
 * - index.md (urls in image syntax will be replaced with local paths)
 * - 1.png
 * - 2.jpg
 * - 3.gif...
 */

import path from 'node:path';
import fs from 'node:fs';
import fsp from 'node:fs/promises';
import async from 'async';
import { homeDir } from '../nublog/constants.mjs';
import { selectAll } from 'unist-util-select';
import { stream } from 'unified-stream';
import { remark } from 'remark';
//import type { Image } from '@types/mdast';

//#region parsing argument
const arg = process.argv[2];

if (!arg || !arg.endsWith('.md')) Error('The argument is invalid or the file does not ends with `.md`.');

const argPath = path.parse(path.isAbsolute(arg) ? arg : path.resolve(homeDir, arg));

if (argPath.name === 'index') Error('You should name the source file other than `index.md`.');
//#endregion

//#region getFileNameFromUrl
const files = new Map();
let fileNumber = 0;

function getFileNameFromUrl(urlStr) {
    if (files.has(urlStr)) return files.get(urlStr);

    const url = new URL(urlStr);
    const ext = url.pathname.split('.').pop();
    const name = `${fileNumber}.${ext}`;
    fileNumber++;
    files.set(urlStr, name);
    return name;
}
//#endregion

//#region queueing file download
const q = async.queue(async (fileUrl, cb) => {
    const filePath = path.format(Object.assign({}, argPath, { base: getFileNameFromUrl(fileUrl) }));
    console.log(`start fetching ${fileUrl} as ${filePath}`);
    const fetched = await fetch(fileUrl);
    const ab = await fetched.arrayBuffer();
    return fsp.writeFile(filePath, Buffer.from(ab))
        .then(() => {
            console.log(`finish fetching ${fileUrl}`);
            cb(null, filePath);
        }, reason => {
            console.log(`failed to fetch ${fileUrl}`);
            console.log(JSON.stringify(reason));
            cb(reason);
        });
}, 3);

const qs = [];
//#endregion

const processor = remark()
    .use(function() {
        return function(tree) {
            selectAll('image', tree).forEach((node/*: Image*/) => {
                if (!node.url) return;
                if (node.url.startsWith('http') || node.url.startsWith('//')) {
                    qs.push(q.push(node.url));
                    node.url = getFileNameFromUrl(node.url);
                } else {
                    console.log(`SKIPPED ${node.url}`);
                }
            });
        }
    });

const inputPath = path.format(argPath);
const outPath = path.format(Object.assign({}, argPath, { base: 'index.md' }));

fs.createReadStream(inputPath).pipe(stream(processor)).pipe(fs.createWriteStream(outPath));

await Promise.allSettled(qs).then(() => {
    console.log(`Finished!`)
});
