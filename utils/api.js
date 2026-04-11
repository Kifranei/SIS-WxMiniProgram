const API_BASE = 'http://localhost:53798/api/miniprogram';

function buildApiUrl(path) {
  if (!path) {
    return API_BASE;
  }

  return `${API_BASE}${path.startsWith('/') ? path : `/${path}`}`;
}

module.exports = {
  API_BASE,
  buildApiUrl
};
