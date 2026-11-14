// Two fake players connect to the real room relay and check messages pass both ways.
const base = process.argv[2].replace(/^http/, 'ws');
const code = 'T' + 'ABCDEFGHJKMNPQRSTUVWXYZ'[Math.floor(Math.random() * 23)] + 'ZQ';
const open = () => new Promise((res, rej) => { const ws = new WebSocket(`${base}/api/room/${code}`); const got = []; ws.onmessage = e => got.push(JSON.parse(e.data)); ws.onopen = () => res({ ws, got }); ws.onerror = e => rej(new Error('ws error ' + (e.message || ''))); });
const wait = ms => new Promise(r => setTimeout(r, ms));
const a = await open(); await wait(800);
const b = await open(); await wait(1200);
a.ws.send(JSON.stringify({ t: 'start', th: 3 })); b.ws.send(JSON.stringify({ t: 'act', a: 'd', k: 'bug' })); await wait(1200);
const count = async () => (await (await fetch(process.argv[2] + '/api/online', { cache: 'no-store' })).json()).players;
const during = await count(); console.log('players online during test:', during);
const c = await open(); await wait(1000);
console.log('A got', JSON.stringify(a.got)); console.log('B got', JSON.stringify(b.got)); console.log('C got', JSON.stringify(c.got));
const ok = a.got.some(m => m.t === 'hello' && m.role === 'p1') && b.got.some(m => m.t === 'hello' && m.role === 'p2') &&
  a.got.some(m => m.t === 'ready') && b.got.some(m => m.t === 'start') && a.got.some(m => m.t === 'act') && c.got.some(m => m.t === 'full');
const leftEarly = a.got.some(m => m.t === 'left') || b.got.some(m => m.t === 'left');
console.log('left before anyone quit?', leftEarly);
b.ws.close(); await wait(1200); console.log('A after B left', JSON.stringify(a.got.slice(-1)));
const ok2 = a.got.some(m => m.t === 'left');
await wait(800); const after = await count(); console.log('players online after B left:', after);
const ok3 = during >= 2 && after < during;
a.ws.close(); c.ws.close();
// single-player "still playing" signal: count goes up, then down after "bye"
const sid = Array.from(crypto.getRandomValues(new Uint8Array(8)), x => x.toString(16).padStart(2, '0')).join('');
const soloNow = async () => (await (await fetch(process.argv[2] + '/api/online', { cache: 'no-store' })).json()).solo | 0;
const beat = bye => fetch(process.argv[2] + '/api/playing', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ id: sid, bye }) });
const s0 = await soloNow(); await beat(0); await wait(500); const s1 = await soloNow(); await beat(1); await wait(500); const s2 = await soloNow();
console.log('single-player count: before', s0, 'signal', s1, 'after bye', s2);
const ok5 = s1 === s0 + 1 && s2 === s0;
// Hide & Seek Online servers: make a public one, see it in the list, join, pass a message, kick, empty.
const scode = 'T' + 'ABCDEFGHJKMNPQRSTUVWXYZ'[Math.floor(Math.random() * 23)] + 'ZS';
const sopen = q => new Promise((res, rej) => { const ws = new WebSocket(`${base}/api/server/${scode}${q}`); const got = []; ws.onmessage = e => got.push(JSON.parse(e.data)); ws.onopen = () => res({ ws, got }); ws.onerror = e => rej(new Error('ws error ' + (e.message || ''))); });
const list = async () => (await (await fetch(process.argv[2] + '/api/servers', { cache: 'no-store' })).json());
const h1 = await sopen('?make=1&pub=1'); await wait(800);
h1.ws.send(JSON.stringify({ t: 'list', m: 'castle', h: [1, 2], ph: 'lobby' })); await wait(1000);
const listed = (await list()).find(x => x.c === scode); console.log('listed:', JSON.stringify(listed));
const h2 = await sopen(''); await wait(1000);
h1.ws.send(JSON.stringify({ t: 'g', x: 1 })); await wait(800);
h1.ws.send(JSON.stringify({ t: 'kick', id: 2 })); await wait(1200);
console.log('H1 got', JSON.stringify(h1.got)); console.log('H2 got', JSON.stringify(h2.got));
const okS = listed && listed.n === 1 && listed.m === 'castle' && h1.got.some(m => m.t === 'hello' && m.id === 1 && m.pub) && h2.got.some(m => m.t === 'hello' && m.id === 2) &&
  h2.got.some(m => m.t === 'g' && m.f === 1) && h2.got.some(m => m.t === 'kicked') && h1.got.some(m => m.t === 'leave' && m.id === 2);
h1.ws.close(); await wait(1500);
const gone = !(await list()).some(x => x.c === scode); console.log('removed from list after empty:', gone);
if (!okS || !gone) { console.log('SERVER TEST FAILED'); process.exit(1); }
if (!ok || !ok2 || !ok3 || !ok5 || leftEarly) { console.log('ROOM TEST FAILED'); process.exit(1); } console.log('ROOM TEST PASSED');
