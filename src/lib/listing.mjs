export function normalizePage(value, totalPages) {
  const n = Number(value);
  return Number.isInteger(n) && n >= 1 ? Math.min(n, Math.max(1,totalPages)) : 1;
}
export function matchesWhere(page, where = {}) {
  return Object.entries(where).every(([key,value]) => {
    const actual = key === '_path' ? page.url : page[key];
    if (value && typeof value === 'object') return Object.entries(value).every(([operator,operand]) => {
      if (operator === '$eq') return actual === operand;
      if (operator === '$ne') return actual !== operand;
      if (operator === '$gt') return actual > operand;
      if (operator === '$gte') return actual >= operand;
      if (operator === '$lt') return actual < operand;
      if (operator === '$lte') return actual <= operand;
      if (operator === '$in') return operand.includes(actual);
      if (operator === '$contains') return actual?.includes(operand);
      throw new Error(`Unsupported where operator: ${operator}`);
    });
    return actual === value;
  });
}
export function listingPages(page, pages) {
  if (!['blog-index','default-index'].includes(page.layout)) return [];
  const prefix = page.url === '/' ? '/' : page.url + '/';
  let result = pages.filter(p => p.url !== page.url && p.url.startsWith(prefix) && matchesWhere(p,page.where));
  if (page.layout === 'blog-index') return result.filter(p => p.publishedAt).sort((a,b) => new Date(b.publishedAt)-new Date(a.publishedAt) || a.source.localeCompare(b.source,'en'));
  return result.filter(p=> p.url.slice(prefix.length).split('/').length === 1);
}
export function formatDates(page) {
  const fmt = new Intl.DateTimeFormat('ja-JP',{dateStyle:'long',timeZone:'Asia/Tokyo'});
  const format = value => fmt.format(new Date(value));
  return [page.publishedAt ? format(page.publishedAt) : '',page.updatedAt ? format(page.updatedAt)+'更新' : ''].filter(Boolean).join(' / ');
}
