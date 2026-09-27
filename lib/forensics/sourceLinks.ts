export function isSpecificHttpsSourceUrl(value: unknown): value is string {
  if (typeof value !== 'string') return false;

  try {
    const url = new URL(value);
    if (url.protocol !== 'https:' || !url.hostname || url.username || url.password) return false;
    return url.pathname.split('/').filter(Boolean).length > 0;
  } catch {
    return false;
  }
}
