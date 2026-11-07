// Quick match: /api/match (WebSocket) -> the single Matchmaker Durable Object, which pairs two searching players.
export async function onRequest({ request, env }) {
  if (request.headers.get('Upgrade') !== 'websocket') return new Response('Expected WebSocket', { status: 426 });
  return env.MATCH.get(env.MATCH.idFromName('lobby')).fetch(request);
}
