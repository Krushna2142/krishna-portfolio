module.exports = function debugCors(allowedOrigins = []) {
  // allowedOrigins should be an array of origin strings, e.g. ['https://krishna-portfolio-peach-one.vercel.app']
  const allowed = Array.isArray(allowedOrigins) ? allowedOrigins : [];
  return (req, res, next) => {
    console.log('CORS DEBUG -->', new Date().toISOString(), req.method, req.originalUrl, 'Origin:', req.headers.origin);
    // handle preflight here so we can observe what the server would respond
    if (req.method === 'OPTIONS') {
      const origin = req.headers.origin;
      if (origin && allowed.includes(origin)) {
        res.setHeader('Access-Control-Allow-Origin', origin);
      } else if (allowed.length === 0) {
        // permissive fallback (for debugging only)
        res.setHeader('Access-Control-Allow-Origin', '*');
      } else {
        // not allowed origin: set nothing or an explicit header
        // Do not send Access-Control-Allow-Origin to simulate rejection
      }
      res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
      res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With, Accept');
      res.setHeader('Access-Control-Allow-Credentials', 'true');
      console.log('CORS DEBUG RESPONSE HEADERS SENT for OPTIONS');
      return res.status(204).end();
    }
    next();
  };
};