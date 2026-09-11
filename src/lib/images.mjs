const preview = 'width=1200,quality=85,fit=scale-down,format=auto';
export const presets = Object.freeze({
  thumbnail: 'width=480,quality=80,fit=scale-down,format=auto',
  preview,
  og: preview,
});
export const thumbnailSizes = '(min-width: 960px) 312px, (min-width: 576px) calc(33.333vw - 9px), calc(100vw - 26px)';
export function thumbnailSrcset(image) {
  if (image.thumbnail === image.og) return undefined;
  if (image.width <= 480) return image.thumbnail;
  return `${image.thumbnail} 480w, ${image.og} ${Math.min(1200, image.width)}w`;
}
export function imageSettings(env = process.env) {
  const mode = env.IMAGE_MODE || 'original';
  if (!['original', 'cloudflare'].includes(mode)) throw new Error('IMAGE_MODE must be original or cloudflare');
  const origin = env.IMAGE_ORIGIN || '';
  if (mode === 'cloudflare') {
    const url = new URL(origin);
    if (url.protocol !== 'https:' || url.origin !== origin || url.username || url.password) throw new Error('IMAGE_ORIGIN must be a bare HTTPS origin');
  }
  return { mode, origin };
}
export function imageUrl(asset, preset, settings) {
  if (!presets[preset]) throw new Error(`Unknown image preset: ${preset}`);
  if (!asset.transformable) throw new Error(`Not a transformation input: ${asset.url}`);
  if (settings.mode === 'original') return asset.url;
  return `${settings.origin}/cdn-cgi/image/${presets[preset]}${asset.url}`;
}
