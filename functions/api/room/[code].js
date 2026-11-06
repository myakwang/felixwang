// Same-origin entry point for two-device play: /api/room/ABCD (WebSocket).
// Forwards the connection to that room's Durable Object in the felixwang-rooms worker.
export async function onRequest({ request, env, params }) {
  const code = String(params.code || '').toUpperCase().replace(/[^A-Z]/g, '');
  if (code.length !== 4) return new Response('Bad room code', { status: 400 });
  if (request.headers.get('Upgrade') !== 'websocket') return new Response('Expected WebSocket', { status: 426 });
  const stub = env.ROOMS.get(env.ROOMS.idFromName(code));
  return stub.fetch(request);
}
