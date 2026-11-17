// POST /api/player {"g": "sa"|"sao"|"pa"|"pao"|"hs"|"hso"|"er"} -> {"n": N}
// Adds one to today's anonymous count of games started for that game and says which number this player is
// ("You're player #N today!"). Only that one number per game per day is kept; it starts over at midnight Pacific time.
const GAMES = ['sa', 'sao', 'pa', 'pao', 'hs', 'hso', 'er'];
export async function onRequest({ request, env }) {
  if (request.method !== 'POST') return new Response('Method not allowed', { status: 405 });
  const text = await request.text();
  if (text.length > 100) return new Response('Too big', { status: 413 });
  let b = {}; try { b = JSON.parse(text); } catch (e) {}
  if (!GAMES.includes(b.g)) return new Response('Bad', { status: 400 });
  let n = 0;
  try { n = (await (await env.STATS.get(env.STATS.idFromName('global')).fetch('https://stats/tick', { method: 'POST', body: JSON.stringify({ g: b.g }) })).json()).n | 0; } catch (e) {}
  return new Response(JSON.stringify({ n }), { headers: { 'content-type': 'application/json', 'cache-control': 'no-store' } });
}
