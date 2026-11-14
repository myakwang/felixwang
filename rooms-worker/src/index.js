// Felix's Games — room relay for two-device play.
// One Durable Object per 4-letter room code. It only passes game messages
// between the two players in the room. Nothing is stored; a room disappears
// when both players leave.
const MAX_MSG = 64 * 1024;

// Live count of players currently connected to online rooms. Each room reports
// only how many players it has (a number); no names or other details are kept,
// and a room's entry is removed when it empties.
const STALE_MS = 6 * 3600 * 1000;
// Single-player Star Army and Paper Adventure each send an anonymous "still playing" signal (a random id that changes
// every time the game is opened) every 60 s while it is on screen. Each id is kept only until
// it goes quiet (150 s), then deleted; it is never linked to anything else.
const SOLO_MS = 150 * 1000;
export class Stats {
  constructor(ctx, env) { this.ctx = ctx; }
  async soloCount(prefix = 's:') {
    const now = Date.now(); let n = 0; const stale = [];
    for (const [k, ts] of await this.ctx.storage.list({ prefix })) { if (now - ts > SOLO_MS) stale.push(k); else n++; }
    for (let i = 0; i < stale.length; i += 128) await this.ctx.storage.delete(stale.slice(i, i + 128));
    return n;
  }
  async fetch(request) {
    const url = new URL(request.url);
    if (url.pathname === '/report' && request.method === 'POST') {
      const { room, n } = await request.json();
      if (typeof room !== 'string' || room.length > 100) return new Response('bad', { status: 400 });
      const players = Math.max(0, Math.min(6, n | 0));
      if (players > 0) await this.ctx.storage.put('r:' + room, { n: players, ts: Date.now() });
      else await this.ctx.storage.delete('r:' + room);
      return new Response('ok');
    }
    if (url.pathname === '/beat' && request.method === 'POST') {
      let b = {}; try { b = await request.json(); } catch (e) {}
      if (typeof b.id !== 'string' || !/^[0-9a-f]{16}$/.test(b.id)) return new Response('bad', { status: 400 });
      const pre = b.g === 'pa' ? 'p:' : 's:';
      if (b.bye) await this.ctx.storage.delete(pre + b.id); else await this.ctx.storage.put(pre + b.id, Date.now());
      return new Response('ok');
    }
    if (url.pathname === '/count') {
      const now = Date.now(); let players = 0, rooms = 0; const stale = [];
      for (const [k, v] of await this.ctx.storage.list({ prefix: 'r:' })) {
        if (!v || now - v.ts > STALE_MS) { stale.push(k); continue; }
        players += v.n; rooms++;
      }
      if (stale.length) await this.ctx.storage.delete(stale);
      return Response.json({ players, rooms, solo: await this.soloCount('s:'), paper: await this.soloCount('p:') });
    }
    return new Response('not found', { status: 404 });
  }
}

export class Room {
  constructor(ctx, env) { this.ctx = ctx; this.env = env; }

  async report(exclude) {
    try {
      const n = this.players().filter(s => s !== exclude).length;
      const stub = this.env.STATS.get(this.env.STATS.idFromName('global'));
      await stub.fetch('https://stats/report', { method: 'POST', body: JSON.stringify({ room: this.ctx.id.toString(), n }) });
    } catch (e) {}
  }

  players() { return this.ctx.getWebSockets().filter(s => { const t = this.ctx.getTags(s); return t[0] === 'p1' || t[0] === 'p2'; }); }

  async fetch(request) {
    if (request.headers.get('Upgrade') !== 'websocket') return new Response('Expected WebSocket', { status: 426 });
    const pair = new WebSocketPair();
    const [client, server] = Object.values(pair);
    const players = this.players();
    if (players.length >= 2) {
      this.ctx.acceptWebSocket(server, ['full']);
      server.send(JSON.stringify({ t: 'full' }));
      server.close(4001, 'room full');
      return new Response(null, { status: 101, webSocket: client });
    }
    const taken = players.map(s => this.ctx.getTags(s)[0]);
    const role = taken.includes('p1') ? 'p2' : 'p1';
    this.ctx.acceptWebSocket(server, [role]);
    server.send(JSON.stringify({ t: 'hello', role }));
    if (players.length === 1) for (const s of [...players, server]) { try { s.send(JSON.stringify({ t: 'ready' })); } catch (e) {} }
    this.ctx.waitUntil(this.report());
    return new Response(null, { status: 101, webSocket: client });
  }

  webSocketMessage(ws, msg) {
    const len = typeof msg === 'string' ? msg.length : msg.byteLength;
    if (len > MAX_MSG) return;
    for (const s of this.players()) if (s !== ws) { try { s.send(msg); } catch (e) {} }
  }

  async webSocketClose(ws) {
    const tag = this.ctx.getTags(ws)[0];
    if (tag !== 'p1' && tag !== 'p2') { try { ws.close(1000, 'bye'); } catch (e) {} return; } // a turned-away 3rd visitor
    for (const s of this.players()) if (s !== ws) { try { s.send(JSON.stringify({ t: 'left' })); } catch (e) {} }
    try { ws.close(1000, 'bye'); } catch (e) {}
    await this.report(ws);
  }

  async webSocketError(ws) { await this.webSocketClose(ws); }
}

// ---------------------------------------------------------------------------
// Hide & Seek Online "servers": one Durable Object per 4-letter code, up to 6
// players. Like the two-player rooms it only passes game messages between the
// players and stores nothing about them. It adds the sender's seat number (f) to
// each message, lets the host (the player who has been there longest) kick a
// player, and, for servers made "public", keeps a tiny entry in the public server
// list: the code, the host's nickname as two list positions, the place, how many
// players and whether a round is being played. The entry is removed when the
// server empties. No free text is ever accepted.
const MAXP = 6;
export class Server {
  constructor(ctx, env) { this.ctx = ctx; this.env = env; }
  socks() { return this.ctx.getWebSockets().filter(s => { const t = this.ctx.getTags(s)[0]; return t && t[0] === 's'; }); }
  idOf(s) { return +this.ctx.getTags(s)[0].slice(1); }
  joinT(s) { return +(this.ctx.getTags(s)[1] || 'j0').slice(1); }
  hostOf(list) { let h = null; for (const s of list) if (!h || this.joinT(s) < this.joinT(h)) h = s; return h ? this.idOf(h) : 0; }
  async info() { return (await this.ctx.storage.get('info')) || null; }
  async publish(exclude) {
    const n = this.socks().filter(s => s !== exclude).length; const info = await this.info();
    try { await this.env.STATS.get(this.env.STATS.idFromName('global')).fetch('https://stats/report', { method: 'POST', body: JSON.stringify({ room: 'hs:' + this.ctx.id.toString(), n }) }); } catch (e) {}
    try { if (info) await this.env.LISTING.get(this.env.LISTING.idFromName('global')).fetch('https://list/set', { method: 'POST', body: JSON.stringify({ code: info.code, pub: !!info.pub && n > 0, n, m: info.m, h: info.h, ph: info.ph }) }); } catch (e) {}
    if (n === 0) await this.ctx.storage.deleteAll();
  }
  async fetch(request) {
    if (request.headers.get('Upgrade') !== 'websocket') return new Response('Expected WebSocket', { status: 426 });
    const url = new URL(request.url);
    const make = url.searchParams.get('make') === '1', pub = url.searchParams.get('pub') === '1';
    const code = (url.searchParams.get('code') || '').toUpperCase().replace(/[^A-Z]/g, '').slice(0, 4);
    const pair = new WebSocketPair(); const [client, server] = Object.values(pair);
    const list = this.socks();
    const turn = t => { this.ctx.acceptWebSocket(server, ['x']); server.send(JSON.stringify({ t })); server.close(4001, t); return new Response(null, { status: 101, webSocket: client }); };
    if (make && list.length > 0) return turn('taken');
    if (!make && list.length === 0) return turn('nosuch');
    if (list.length >= MAXP) return turn('full');
    if (make) await this.ctx.storage.put('info', { code, pub, m: 'house', h: [0, 0], ph: 'lobby' });
    const used = list.map(s => this.idOf(s)); let id = 1; while (used.includes(id)) id++;
    this.ctx.acceptWebSocket(server, ['s' + id, 'j' + Date.now()]);
    const info = await this.info(); const host = this.hostOf([...list, server]);
    server.send(JSON.stringify({ t: 'hello', id, host, ids: used, pub: !!(info && info.pub), code: info ? info.code : code }));
    for (const s of list) { try { s.send(JSON.stringify({ t: 'join', id, host })); } catch (e) {} }
    this.ctx.waitUntil(this.publish());
    return new Response(null, { status: 101, webSocket: client });
  }
  async webSocketMessage(ws, msg) {
    const tag = this.ctx.getTags(ws)[0]; if (!tag || tag[0] !== 's') return;
    if (typeof msg !== 'string' || msg.length > MAX_MSG) return;
    let m; try { m = JSON.parse(msg); } catch (e) { return; }
    if (!m || typeof m !== 'object' || Array.isArray(m)) return;
    const id = this.idOf(ws), list = this.socks(), host = this.hostOf(list);
    if (m.t === 'kick') {
      if (id !== host) return;
      const tgt = list.find(s => this.idOf(s) === (m.id | 0));
      if (tgt && tgt !== ws) { try { tgt.send(JSON.stringify({ t: 'kicked' })); } catch (e) {} try { tgt.close(4003, 'kicked'); } catch (e) {} }
      return;
    }
    if (m.t === 'list') {
      if (id !== host) return; const info = await this.info(); if (!info) return;
      info.m = typeof m.m === 'string' && /^[a-z]{1,16}$/.test(m.m) ? m.m : 'house';
      info.h = Array.isArray(m.h) ? [(m.h[0] | 0) & 15, (m.h[1] | 0) & 15] : [0, 0];
      info.ph = m.ph === 'play' ? 'play' : 'lobby';
      await this.ctx.storage.put('info', info); await this.publish(); return;
    }
    m.f = id; const to = m.to | 0; delete m.to; const out = JSON.stringify(m);
    for (const s of list) { if (s === ws || (to && this.idOf(s) !== to)) continue; try { s.send(out); } catch (e) {} }
  }
  async webSocketClose(ws) {
    const tag = this.ctx.getTags(ws)[0]; try { ws.close(1000, 'bye'); } catch (e) {}
    if (!tag || tag[0] !== 's') return;
    const id = this.idOf(ws), list = this.socks().filter(s => s !== ws), host = this.hostOf(list);
    for (const s of list) { try { s.send(JSON.stringify({ t: 'leave', id, host })); } catch (e) {} }
    await this.publish(ws);
  }
  async webSocketError(ws) { await this.webSocketClose(ws); }
}

// The public server list for Hide & Seek Online. Entries are written only by the
// servers themselves and expire 5 minutes after their last update.
const LIST_TTL = 5 * 60 * 1000;
export class Listing {
  constructor(ctx) { this.ctx = ctx; }
  async fetch(request) {
    const url = new URL(request.url);
    if (url.pathname === '/set' && request.method === 'POST') {
      let b = {}; try { b = await request.json(); } catch (e) {}
      if (typeof b.code !== 'string' || !/^[A-Z]{4}$/.test(b.code)) return new Response('bad', { status: 400 });
      const n = b.n | 0;
      if (b.pub && n > 0 && n <= MAXP) await this.ctx.storage.put('l:' + b.code, { n, m: typeof b.m === 'string' && /^[a-z]{1,16}$/.test(b.m) ? b.m : 'house', h: Array.isArray(b.h) ? [(b.h[0] | 0) & 15, (b.h[1] | 0) & 15] : [0, 0], ph: b.ph === 'play' ? 'play' : 'lobby', ts: Date.now() });
      else await this.ctx.storage.delete('l:' + b.code);
      return new Response('ok');
    }
    if (url.pathname === '/list') {
      const now = Date.now(), out = [], stale = [];
      for (const [k, v] of await this.ctx.storage.list({ prefix: 'l:' })) { if (!v || now - v.ts > LIST_TTL) { stale.push(k); continue; } out.push({ c: k.slice(2), n: v.n, m: v.m, h: v.h, ph: v.ph }); }
      if (stale.length) await this.ctx.storage.delete(stale.slice(0, 128));
      out.sort((a, b) => (a.ph === b.ph ? 0 : a.ph === 'lobby' ? -1 : 1) || b.n - a.n);
      return Response.json(out.filter(x => x.n < MAXP).slice(0, 30));
    }
    return new Response('not found', { status: 404 });
  }
}

export default { fetch() { return new Response('Felix game rooms', { status: 200 }); } };
