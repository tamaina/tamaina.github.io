import glob from 'glob';
import async from 'async';
import sharp from 'sharp';
import fs from 'node:fs/promises';
import util from 'node:util';
import childProcess from 'node:child_process';
import { WebPInfo } from "webpinfo";
import { contentDir, homeDir } from '../nublog/constants.mjs';

const exec = util.promisify(childProcess.exec);

const q = async.queue(async ([filePath, i, length], cb) => {
    console.log(`start converting ${filePath}`);

    const start = Date.now();
    const statBefore = await fs.stat(filePath);

    const splited = filePath.split('.');
    const ext = splited.pop().toLowerCase();
    const lossless = ext === 'png' || ext === 'gif' ? true
        : ext === 'webp' ? await WebPInfo.from(filePath).then(info => info.lossless)
        : false;
    const avifPath = splited.join('.') + '.avif';

    await sharp(filePath, { animated: true }).toFormat('avif', {
        quality: 65,
        effort: 4,
        lossless,
    }).toFile(avifPath);
    await fs.rm(filePath);

    const statAfter = await fs.stat(avifPath);

    console.log(`finish converting ${filePath} (${i+1}/${length})`);
    console.log(`time: ${Date.now() - start}ms, before: ${statBefore.size / 1024} KiB, after: ${statAfter.size / 1024} KiB`);
    cb(null, avifPath);
}, 1);

export const imageGlob = `docs/**/*.+(jpg|jpeg|png|gif|webp|JPG|JPEG|PNG|GIF|WEBP)`;

const filesPaths = glob.sync(imageGlob, { nodir: true, cwd: homeDir });

await Promise.all(filesPaths.map((path, i, arr) => q.push([path, i, arr.length])));

await exec(`git filter-branch --force --index-filter 'git rm --cached --ignore-unmatch ${filesPaths.map(x => `"${x.replace(homeDir, '')}"`).join(' ')}' --prune-empty --tag-name-filter cat -- --all`)
