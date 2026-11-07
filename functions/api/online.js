// GET /api/online -> {"players": N, "rooms": R, "solo": S}: players in online rooms, open rooms, and
// single-player Star Army players right now.
// Readable from other pages (CORS) so the owner's counter in Claude can show it. Only these two numbers.
export async function onRequest({ request, env }) {
  const cors = { 'access-control-allow-origin': '*', 'access-control-allow-methods': 'GET, OPTIONS' };
  if (request.method === 'OPTIONS') return new Response(null, { status: 204, headers: cors });
  let players = 0, rooms = 0, solo = 0;
  try {
    const r = await env.STATS.get(env.STATS.idFromName('global')).fetch('https://stats/count');
    const j = await r.json(); players = j.players | 0; rooms = j.rooms | 0; solo = j.solo | 0;
  } catch (e) {}
  return new Response(JSON.stringify({ players, rooms, solo }), { headers: { 'content-type': 'application/json', 'cache-control': 'no-store', ...cors } });
}
