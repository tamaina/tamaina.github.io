// Confirmed against the original Nuxt parser and Git tree at 25c890d.
// Keep the pre-existing broken reference; do not silently excuse new missing images.
export const missingImages = new Set(['2.blog/2023/03-08 14m1prombp-2/index.md\n2.webp']);
export const missingLinks = new Set([
  '2.blog/2022/10-28 14m1prombp-1/index.md\n./05-20-m1mba-1',
  '2.blog/2023/03-07 pixel-7-2/index.md\n../02-01-pixel-7-1',
]);
