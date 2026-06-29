const https = require('https');

// Serverless proxy for the operations Demographics feed.
// Mirrors api/public-studies.js: keeps the API key server-side and avoids CORS.
// Forwards the query string (type, groupBy, experimentId, minCount) through, so
// the dashboard can request ecosystem marginals or cross-tabs.
module.exports = (req, res) => {
  try {
    // Trim env values — a stray space/newline in API_KEY otherwise produces an
    // invalid HTTP header and crashes the function with FUNCTION_INVOCATION_FAILED.
    const API_HOST = (process.env.API_HOST || 'operations.reputablehealth.net').trim();
    const API_KEY = (process.env.API_KEY || '').trim();

    if (!API_KEY) {
      return res.status(500).json({ error: 'API_KEY not configured on proxy server' });
    }

    const qs = (req.url && req.url.includes('?')) ? req.url.slice(req.url.indexOf('?')) : '';

    const options = {
      hostname: API_HOST,
      path: '/api/demographics' + qs,
      method: 'GET',
      headers: {
        'x-api-key': API_KEY,
        'Accept': 'application/json'
      }
    };

    const upstream = https.request(options, (upstreamRes) => {
      let body = '';
      upstreamRes.on('data', chunk => { body += chunk; });
      upstreamRes.on('end', () => {
        res.setHeader('Content-Type', 'application/json');
        res.setHeader('Cache-Control', 'no-cache');
        res.status(upstreamRes.statusCode).send(body);
      });
    });

    upstream.on('error', (err) => {
      res.status(502).json({ error: 'Failed to reach upstream API', detail: err.message });
    });

    upstream.setTimeout(15000, () => {
      upstream.destroy();
      res.status(504).json({ error: 'Upstream API timed out' });
    });

    upstream.end();
  } catch (err) {
    res.status(500).json({ error: 'Proxy error', detail: String((err && err.message) || err) });
  }
};
