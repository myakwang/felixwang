// Same-origin entry point for Hide & Seek Online servers: /api/server/ABCD (WebSocket), up to 6 players.
// ?make=1&pub=1 makes a new server (pub=1: shown in the public server list). Forwards to that server's Durable Object.
export async function onRequest({ request, env, params }) {
  const code = String(params.code || '').toUpperCase().replace(/[^A-Z]/g, '');
  if (code.length !== 4) return new Response('Bad server code', { status: 400 });
  if (request.headers.get('Upgrade') !== 'websocket') return new Response('Expected WebSocket', { status: 426 });
  const url = new URL(request.url); const q = new URLSearchParams({ code });
  if (url.searchParams.get('make') === '1') { q.set('make', '1'); q.set('pub', url.searchParams.get('pub') === '1' ? '1' : '0'); }
  const stub = env.SERVERS.get(env.SERVERS.idFromName(code));
  return stub.fetch(new Request('https://server/?' + q.toString(), request));
}
