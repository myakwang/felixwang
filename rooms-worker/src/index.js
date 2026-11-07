// Felix's Games — room relay for two-device play.
// One Durable Object per 4-letter room code. It only passes game messages
// between the two players in the room. Nothing is stored; a room disappears
// when both players leave.
const MAX_MSG = 64 * 1024;

// Live count of players currently connected to online rooms. Each room reports
// only how many players it has (a number); no names or other details are kept,
// and a room's entry is removed when it empties.
const STALE_MS = 6 * 3600 * 1000;
export class Stats {
  constructor(ctx, env) { this.ctx = ctx; }
  async fetch(request) {
    const url = new URL(request.url);
    if (url.pathname === '/report' && request.method === 'POST') {
      const { room, n } = await request.json();
      if (typeof room !== 'string' || room.length > 100) return new Response('bad', { status: 400 });
      const players = Math.max(0, Math.min(2, n | 0));
      if (players > 0) await this.ctx.storage.put('r:' + room, { n: players, ts: Date.now() });
      else await this.ctx.storage.delete('r:' + room);
      return new Response('ok');
    }
    if (url.pathname === '/count') {
      const now = Date.now(); let players = 0, rooms = 0; const stale = [];
      for (const [k, v] of await this.ctx.storage.list({ prefix: 'r:' })) {
        if (!v || now - v.ts > STALE_MS) { stale.push(k); continue; }
        players += v.n; rooms++;
      }
      if (stale.length) await this.ctx.storage.delete(stale);
      return Response.json({ players, rooms });
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
    const want = new URL(request.url).searchParams.get('role'); // quick match asks for its role
    const role = (want === 'p1' || want === 'p2') && !taken.includes(want) ? want : (taken.includes('p1') ? 'p2' : 'p1');
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

// Quick match ("Find a player"): players who are searching at the same moment are paired
// and sent the same new room code. Nothing is stored; a searcher who gives up just disconnects.
const CODE_ABC = 'ABCDEFGHJKMNPQRSTUVWXYZ';
function randCode() { let c = ''; for (let i = 0; i < 4; i++) c += CODE_ABC[Math.floor(Math.random() * CODE_ABC.length)]; return c; }
export class Matchmaker {
  constructor(ctx, env) { this.ctx = ctx; }
  async fetch(request) {
    if (request.headers.get('Upgrade') !== 'websocket') return new Response('Expected WebSocket', { status: 426 });
    const [client, server] = Object.values(new WebSocketPair());
    const waiting = this.ctx.getWebSockets('wait').filter(s => s.readyState === WebSocket.OPEN);
    if (waiting.length) {
      const other = waiting[0], code = randCode();
      this.ctx.acceptWebSocket(server, ['paired']);
      try { other.send(JSON.stringify({ t: 'match', code, role: 'p1' })); other.close(1000, 'matched'); } catch (e) {}
      server.send(JSON.stringify({ t: 'match', code, role: 'p2' }));
      server.close(1000, 'matched');
    } else {
      this.ctx.acceptWebSocket(server, ['wait']);
      server.send(JSON.stringify({ t: 'searching' }));
    }
    return new Response(null, { status: 101, webSocket: client });
  }
  webSocketMessage() {}
  webSocketClose(ws) { try { ws.close(1000, 'bye'); } catch (e) {} }
  webSocketError(ws) { this.webSocketClose(ws); }
}

export default { fetch() { return new Response('Felix game rooms', { status: 200 }); } };
