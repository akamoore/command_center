const https = require('https');

// Serverless proxy for the operations Public Studies feed.
// Mirrors api/recruiting.js: keeps the API key server-side and avoids CORS.
// The upstream endpoint takes no query params — it returns every public
// challenge plus a `summary` for the headline cards.
module.exports = (req, res) => {
  try {
    // Trim env values — a stray space/newline in API_KEY otherwise produces an
    // invalid HTTP header and crashes the function with FUNCTION_INVOCATION_FAILED.
    const API_HOST = (process.env.API_HOST || 'operations.reputablehealth.net').trim();
    const API_KEY = (process.env.API_KEY || '').trim();

    if (!API_KEY) {
      return res.status(500).json({ error: 'API_KEY not configured on proxy server' });
    }

    const options = {
      hostname: API_HOST,
      path: '/api/public-studies',
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
    // Never surface an opaque FUNCTION_INVOCATION_FAILED — return the real reason.
    res.status(500).json({ error: 'Proxy error', detail: String((err && err.message) || err) });
  }
};
