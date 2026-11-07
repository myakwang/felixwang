// GET /api/online -> {"players": N}: how many players are connected to online rooms right now.
export async function onRequest({ env }) {
  let players = 0;
  try {
    const r = await env.STATS.get(env.STATS.idFromName('global')).fetch('https://stats/count');
    players = (await r.json()).players | 0;
  } catch (e) {}
  return new Response(JSON.stringify({ players }), { headers: { 'content-type': 'application/json', 'cache-control': 'no-store' } });
}
