// worker.js
addEventListener('fetch', event => {
    event.respondWith(handleRequest(event.request));
  });
  
  async function handleRequest(request) {
    const isMobile = request.headers.get('sec-ch-ua-mobile') === '?1';
    const headers = new Headers({
      'Access-Control-Allow-Origin': '*',
      'X-Device-Type': isMobile ? 'mobile' : 'desktop'
    });
  
    try {
      const response = await fetch(request);
      const modified = new Response(response.body, response);
      headers.forEach((value, key) => modified.headers.set(key, value));
      return modified;
    } catch (err) {
      return new Response(JSON.stringify({
        error: isMobile ? 'mobile_connection_error' : 'server_error'
      }), { status: 503, headers });
    }
  }