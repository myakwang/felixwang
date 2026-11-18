// GET /api/servers -> the public Hide & Seek Online servers: [{c: code, n: players, m: place, h: [host nickname list positions], ph: "lobby"|"play"}]
// GET /api/servers?g=sm -> the public Soccer Manager rooms (same fields, m is always "soccer").
export async function onRequest({ request, env }) {
  let list = [];
  const g = new URL(request.url).searchParams.get('g') === 'sm' ? 'sm' : 'hs';
  try { list = await (await env.LISTING.get(env.LISTING.idFromName('global')).fetch('https://list/list?g=' + g)).json(); } catch (e) {}
  return new Response(JSON.stringify(list), { headers: { 'content-type': 'application/json', 'cache-control': 'no-store', 'access-control-allow-origin': '*' } });
}
