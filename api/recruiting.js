const https = require('https');

module.exports = (req, res) => {
  try {
    // Trim env values — a stray space/newline in API_KEY otherwise produces an
    // invalid HTTP header and crashes the function with FUNCTION_INVOCATION_FAILED.
    const API_HOST = (process.env.API_HOST || 'operations.reputablehealth.net').trim();
    const API_KEY = (process.env.API_KEY || '').trim();

    // Read query params defensively: req.query isn't guaranteed across runtimes,
    // so fall back to parsing req.url rather than throwing on `undefined.days`.
    let days = 30;
    let scope = '';
    const q = req.query || {};
    if (q.days != null || q.scope != null) {
      days = parseInt(q.days, 10) || 30;
      scope = typeof q.scope === 'string' ? q.scope : '';
    } else {
      try {
        const host = (req.headers && req.headers.host) || API_HOST;
        const parsed = new URL(req.url, `https://${host}`);
        days = parseInt(parsed.searchParams.get('days'), 10) || 30;
        scope = parsed.searchParams.get('scope') || '';
      } catch (_) { /* keep defaults */ }
    }

    if (!API_KEY) {
      return res.status(500).json({ error: 'API_KEY not configured on proxy server' });
    }

    const params = new URLSearchParams({ days: String(days) });
    if (scope) params.set('scope', scope);

    const options = {
      hostname: API_HOST,
      path: `/api/recruiting?${params.toString()}`,
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
