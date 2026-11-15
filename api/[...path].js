// Vercel's catch-all Node function delegates every /api/* request to the
// existing Express app. Local development continues to use backend/server.js.
const { app } = require('../backend/server');

module.exports = function vercelExpressHandler(req, res) {
  // Vercel routes the legacy video URL through this function. Restore the
  // path expected by Express without changing the URL stored in MySQL.
  const requestUrl = req.url || '/';
  const parsedUrl = new URL(requestUrl, 'http://vercel.local');
  if (parsedUrl.pathname.startsWith('/api/media/')) {
    parsedUrl.pathname = parsedUrl.pathname.replace(/^\/api\/media(?=\/)/, '/media');
    req.url = `${parsedUrl.pathname}${parsedUrl.search}`;
  }

  return app(req, res);
};
