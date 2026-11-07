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
if (!ok || !ok2 || !ok3 || !ok5 || leftEarly) { console.log('ROOM TEST FAILED'); process.exit(1); } console.log('ROOM TEST PASSED');
