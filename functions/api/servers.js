// GET /api/servers -> the public Hide & Seek Online servers: [{c: code, n: players, m: place, h: [host nickname list positions], ph: "lobby"|"play"}]
export async function onRequest({ env }) {
  let list = [];
  try { list = await (await env.LISTING.get(env.LISTING.idFromName('global')).fetch('https://list/list')).json(); } catch (e) {}
  return new Response(JSON.stringify(list), { headers: { 'content-type': 'application/json', 'cache-control': 'no-store', 'access-control-allow-origin': '*' } });
}
