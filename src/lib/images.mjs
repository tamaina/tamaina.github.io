export const presets = Object.freeze({
  thumbnail: 'width=1120,quality=80,fit=scale-down,format=auto',
  preview: 'width=1600,quality=85,fit=scale-down,format=auto',
  og: 'width=1200,height=630,quality=80,fit=cover,format=jpeg',
});
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
