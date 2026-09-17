const LOOPBACK_HOSTS = new Set(['localhost', '127.0.0.1', '::1', '[::1]']);

function hasUnsafeWhitespace(value) {
  return typeof value !== 'string' || value.length === 0 || value !== value.trim() || /\s/u.test(value);
}

function isTrustedProtocolAndHost(url) {
  if (url.protocol === 'https:') return true;
  return url.protocol === 'http:' && LOOPBACK_HOSTS.has(url.hostname);
}

function parseTrustedEmbedUrl(value) {
  if (hasUnsafeWhitespace(value)) return null;
  try {
    const url = new URL(value);
    if (!isTrustedProtocolAndHost(url)) return null;
    if (url.username || url.password || url.search || url.hash) return null;
    return url;
  } catch {
    return null;
  }
}

function parseTrustedExactOrigin(value) {
  if (hasUnsafeWhitespace(value) || value === '*') return null;
  try {
    const url = new URL(value);
    if (!isTrustedProtocolAndHost(url)) return null;
    if (url.username || url.password || url.search || url.hash) return null;
    if (url.pathname !== '/' || value !== url.origin) return null;
    return url.origin;
  } catch {
    return null;
  }
}

export function getAssistantEmbedConfig(env = import.meta.env) {
  const embedUrl = parseTrustedEmbedUrl(env?.VITE_ASSISTANT_EMBED_URL);
  const allowedOrigin = parseTrustedExactOrigin(env?.VITE_ASSISTANT_ALLOWED_ORIGIN);
  const valid = Boolean(embedUrl && allowedOrigin && embedUrl.origin === allowedOrigin);

  return {
    embedUrl: valid ? embedUrl.toString() : null,
    allowedOrigin: valid ? allowedOrigin : null,
    valid
  };
}

export function isAllowedAssistantOrigin(origin, config = getAssistantEmbedConfig()) {
  return Boolean(config.valid && origin === config.allowedOrigin);
}
