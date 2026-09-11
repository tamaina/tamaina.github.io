import path from 'node:path';
import slugify from 'slugify';

// Nuxt Content v2 path-meta rules; apply only to article source paths.
export function articleUrl(source) {
  return '/' + source.replace(/\.md$/i, '').split('/').map(part => {
    if (!/^(\d+)(\.\d+)*(\.x)?$/.test(part)) {
      part = part.replace(/(\d+\.)?(.*)/, '$2').replace(/^index(\.draft)?$/, '').replace(/\.draft$/, '');
    }
    return slugify(part, { lower: true });
  }).join('/').replace(/\/+$/, '');
}
export function articleMap(sources) {
  const bySource = new Map(), byUrl = new Map();
  for (const source of sources) {
    const url = articleUrl(source);
    if (byUrl.has(url)) throw new Error(`URL collision: ${url}: ${byUrl.get(url)} / ${source}`);
    bySource.set(source, url); byUrl.set(url, source);
  }
  return { bySource, byUrl };
}
export const encodePath = value => value.split('/').map(encodeURIComponent).join('/');
export function splitReference(value) {
  const offset = value.search(/[?#]/);
  return offset < 0 ? [value, ''] : [value.slice(0, offset), value.slice(offset)];
}
export const isExternal = value => /^(?:[a-z][a-z\d+.-]*:|\/\/|#)/i.test(value);
export function decodePath(value) {
  return value.split('/').map(part => {
    try { const decoded = decodeURIComponent(part); return /[/\\]/.test(decoded) ? part : decoded; }
    catch { return part; }
  }).join('/');
}
export function sourceReference(source, reference) {
  const [pathname, suffix] = splitReference(reference);
  const decoded = decodePath(pathname);
  const file = path.posix.normalize(decoded.startsWith('/') ? decoded.slice(1) : path.posix.join(path.posix.dirname(source), decoded));
  if (file === '..' || file.startsWith('../')) throw new Error(`Reference outside docs: ${source}: ${reference}`);
  return [file, suffix];
}
export function resolveLink(source, reference, articles, assets, onMissing = () => {}) {
  if (!reference || isExternal(reference)) return reference;
  const [file, suffix] = sourceReference(source, reference);
  if (assets.has(file)) return assets.get(file).url + suffix;
  for (const candidate of [file, `${file}.md`, `${file}/index.md`]) {
    if (articles.bySource.has(candidate)) return articles.bySource.get(candidate) + suffix;
  }
  const [pathname] = splitReference(reference);
  // Public relative links in directory articles are relative to the article URL.
  const current = articles.bySource.get(source);
  const base = /(?:^|\/)index\.md$/.test(source) ? current + '/' : current.slice(0, current.lastIndexOf('/') + 1);
  const publicPath = decodePath(new URL(pathname, 'https://a9z.dev' + base).pathname).replace(/\/$/, '') || '/';
  if (articles.byUrl.has(publicPath)) return publicPath + suffix;
  const converted = articleUrl(publicPath.slice(1));
  if (articles.byUrl.has(converted)) return converted + suffix;
  onMissing({ source, reference, resolved: publicPath + suffix });
  return publicPath + suffix;
}
