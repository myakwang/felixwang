// POST /api/playing: anonymous "still playing" signal from single-player Star Army or Paper Adventure,
// {"id": <16 hex chars, new every time the game opens>, "bye": 0|1, "g": "pa" for Paper Adventure}. Used only for the live count.
export async function onRequest({ request, env }) {
  if (request.method !== 'POST') return new Response('Method not allowed', { status: 405 });
  const text = await request.text();
  if (text.length > 200) return new Response('Too big', { status: 413 });
  let b = {}; try { b = JSON.parse(text); } catch (e) {}
  if (typeof b.id !== 'string' || !/^[0-9a-f]{16}$/.test(b.id)) return new Response('Bad', { status: 400 });
  await env.STATS.get(env.STATS.idFromName('global')).fetch('https://stats/beat', { method: 'POST', body: JSON.stringify({ id: b.id, bye: b.bye ? 1 : 0, g: b.g === 'pa' ? 'pa' : 'sa' }) });
  return new Response(null, { status: 204, headers: { 'cache-control': 'no-store' } });
}
