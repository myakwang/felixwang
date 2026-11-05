// Felix's Games — room relay for two-device play.
// One Durable Object per 4-letter room code. It only passes game messages
// between the two players in the room. Nothing is stored; a room disappears
// when both players leave.
const MAX_MSG = 64 * 1024;

export class Room {
  constructor(ctx, env) { this.ctx = ctx; }

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
    return new Response(null, { status: 101, webSocket: client });
  }

  webSocketMessage(ws, msg) {
    const len = typeof msg === 'string' ? msg.length : msg.byteLength;
    if (len > MAX_MSG) return;
    for (const s of this.players()) if (s !== ws) { try { s.send(msg); } catch (e) {} }
  }

  webSocketClose(ws) {
    for (const s of this.players()) if (s !== ws) { try { s.send(JSON.stringify({ t: 'left' })); } catch (e) {} }
    try { ws.close(1000, 'bye'); } catch (e) {}
  }

  webSocketError(ws) { this.webSocketClose(ws); }
}

export default { fetch() { return new Response('Felix game rooms', { status: 200 }); } };
