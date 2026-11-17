/* Escape Rooms Online: the two-device layer. Two players talk through this site's own room relay at /api/room/<CODE>.
   Nicknames come from a fixed list and are sent as list positions only. Nothing is typed, stored or chatted.
   Messages: game moves (which things were opened or picked up), where each player stands, and race progress. */
window.OL=(function(){
const NICK_A=['Captain','Super','Mega','Turbo','Sneaky','Brave','Lucky','Speedy','Mighty','Cosmic','Silly','Ninja','Rocket','Thunder','Pixel','Sparkle'];
const NICK_B=['Comet','Star','Pencil','Giant','Dragon','Tiger','Shark','Wizard','Robot','Panda','Falcon','Knight','Bug Smasher','Taco','Volcano','Penguin'];
let myNick=[(Math.random()*NICK_A.length)|0,(Math.random()*NICK_B.length)|0];
try{ const v=JSON.parse(localStorage.getItem('escapeRoomOnlineName')||'null'); if(Array.isArray(v)&&NICK_A[v[0]]&&NICK_B[v[1]]) myNick=v; }catch(e){}
const nickText=n=>n&&NICK_A[n[0]]&&NICK_B[n[1]]?NICK_A[n[0]]+' '+NICK_B[n[1]]:null;
const CODE_ABC='ABCDEFGHJKMNPQRSTUVWXYZ';
const NET={ws:null,role:null,code:null,state:'idle',want:null,timer:0,friend:null};
const O={on:false,kind:null,goal:5,cleared:0,fc:0,fl:0,over:false,sent:{},silent:false,acc:0,acc2:0,fp:null,av:null,cfg:{k:'co',d:'easy',g:5}};
const fname=()=>nickText(NET.friend)||'Your friend';
const randCode=()=>{ let c=''; for(let i=0;i<4;i++) c+=CODE_ABC[(Math.random()*CODE_ABC.length)|0]; return c; };
function serverBase(){ let q=null; try{ q=new URLSearchParams(location.search).get('server'); }catch(e){} return (q||(/^https?:$/.test(location.protocol)?location.origin:'https://felixwang.pages.dev')).replace(/\/$/,''); }
function send(o){ if(NET.ws&&NET.ws.readyState===1){ try{ NET.ws.send(JSON.stringify(o)); }catch(e){} } }
function netClose(){ clearTimeout(NET.timer); NET.friend=null; const w=NET.ws; NET.ws=null; NET.state='idle'; O.on=false; hud(); if(O.av){ O.av.visible=false; } if(w){ try{ w.close(); }catch(e){} } }
const optStyle=document.createElement('style'); optStyle.textContent='.opt{margin:3px 4px 3px 0}.opt.cur{outline:3px solid var(--brass)}#olhud{position:fixed;z-index:4;left:50%;top:50px;transform:translateX(-50%);font-size:14px;color:#fff;background:rgba(20,40,60,.8);border:1px solid #6aa;border-radius:10px;padding:2px 12px;display:none;white-space:nowrap}#brooms{display:inline-block}#bmode{display:none!important}.nickrow select{font-size:16px;padding:6px;border-radius:8px;margin:2px}.codebig{font-family:var(--display);font-size:46px;letter-spacing:8px;color:var(--brass);text-align:center}'; document.head.appendChild(optStyle);
const hudEl=document.createElement('div'); hudEl.id='olhud'; document.body.appendChild(hudEl);
function hud(){ if(!O.on){ hudEl.style.display='none'; return; } hudEl.style.display='block';
  hudEl.textContent=O.kind==='co'?'👥 Together with '+fname():'🏁 Race to '+O.goal+' rooms · You '+O.cleared+' · '+fname()+' '+O.fc+(O.fl?' (room '+(O.fl)+')':''); }
function nickHtml(){ let a='<select id="nA" aria-label="Nickname, first word">',b='<select id="nB" aria-label="Nickname, second word">'; NICK_A.forEach((w,i)=>a+=`<option value="${i}"${i===myNick[0]?' selected':''}>${w}</option>`); NICK_B.forEach((w,i)=>b+=`<option value="${i}"${i===myNick[1]?' selected':''}>${w}</option>`); return '<div class="nickrow">'+a+'</select> '+b+'</select> <button class="chip" id="dice" aria-label="Random nickname">🎲</button></div>'; }
function readNick(el){ const a=el.querySelector('#nA'),b=el.querySelector('#nB'); if(a&&b){ myNick=[+a.value,+b.value]; try{ localStorage.setItem('escapeRoomOnlineName',JSON.stringify(myNick)); }catch(e){} } }
function entry(note){ netClose(); sheet('Escape Rooms Online',(note?`<p><b>${note}</b></p>`:'')+'<p>Escape together, or race a friend on another device. Pick a fun nickname:</p>'+nickHtml()+'<p><button class="btn go" id="mk">Make a room</button></p><p>Or join your friend’s room. Type their 4 letters:</p><p><input class="word" id="jc" maxlength="4" autocomplete="off" autocapitalize="characters" spellcheck="false" placeholder="ABCD" aria-label="Room code"> <button class="btn go" id="jn">Join</button></p>',el=>{
  el.querySelector('#dice').onclick=()=>{ myNick=[(Math.random()*NICK_A.length)|0,(Math.random()*NICK_B.length)|0]; el.querySelector('#nA').value=myNick[0]; el.querySelector('#nB').value=myNick[1]; };
  el.querySelector('#mk').onclick=()=>{ readNick(el); open(randCode(),'p1'); };
  const join=()=>{ readNick(el); const c=el.querySelector('#jc').value.toUpperCase().replace(/[^A-Z]/g,''); if(c.length!==4) return toast('Type the 4 letters of the code.'); open(c,'p2'); };
  el.querySelector('#jn').onclick=join; el.querySelector('#jc').onkeydown=e=>{ if(e.key==='Enter') join(); }; }); }
function open(code,want){ netClose(); NET.code=code; NET.want=want; NET.state='connecting'; sheet('Connecting…','<p>Connecting to the game server…</p>');
  let ws; try{ ws=new WebSocket(serverBase().replace(/^http/,'ws')+'/api/room/'+code); }catch(e){ return entry('Could not connect. Check the internet and try again.'); }
  NET.ws=ws; ws.onmessage=e=>{ if(NET.ws!==ws) return; let m; try{ m=JSON.parse(e.data); }catch(_){ return; } onMsg(m); };
  ws.onclose=()=>{ if(NET.ws!==ws) return; NET.ws=null; lost(); }; ws.onerror=()=>{};
  NET.timer=setTimeout(()=>{ if(NET.state==='connecting'){ netClose(); entry('Could not reach the game server. Check the internet and try again.'); } },9000); }
function onMsg(m){ switch(m.t){
  case 'hello': clearTimeout(NET.timer); NET.role=m.role;
    if(NET.want==='p1'&&m.role!=='p1'){ open(randCode(),'p1'); return; }
    if(NET.want==='p2'&&m.role!=='p2'){ netClose(); entry('There is no room with the code '+NET.code+'. Check the code and try again.'); return; }
    NET.state='waiting'; if(m.role==='p1') sheet('Your room code','<div class="codebig">'+NET.code+'</div><p>Tell your friend this code. They tap <b>Join</b> and type it. Waiting for them…</p><button class="btn" id="cx">Cancel</button>',el=>el.querySelector('#cx').onclick=()=>entry());
    else sheet('Joining…','<p>Joined room '+NET.code+'! Saying hi…</p>'); break;
  case 'full': netClose(); entry('That room already has two players.'); break;
  case 'ready': NET.state='ready'; send({t:'name',a:myNick[0],b:myNick[1]}); if(NET.role==='p1') hostPick(); else guestWait(); break;
  case 'name': { const a=m.a|0,b=m.b|0; if(NICK_A[a]&&NICK_B[b]){ NET.friend=[a,b]; if(!O.on){ if(NET.role==='p1') hostPick(); else guestWait(); } else hud(); } } break;
  case 'cfg': if(NET.role==='p2') begin({k:m.k==='race'?'race':'co',d:['easy','medium','hard'].includes(m.d)?m.d:'easy',g:Math.max(1,Math.min(20,m.g|0)),sd:m.sd|0}); break;
  case 'p': if(m.l===S.lvl||true){ O.fp={x:+m.x||0,z:+m.z||0,y:+m.y||0,r:m.r|0,l:m.l|0}; } break;
  case 'st': if(O.on&&O.kind==='co') recvSt(m); break;
  case 'dr': if(O.on&&O.kind==='co'&&m.l===S.lvl){ const d=DOORS.find(x=>x.key===m.k); F[m.k]=m.v?1:0; O.sent[m.k]=F[m.k]; if(d&&d.open!==(m.v?1:0)){ d.open=m.v?1:0; tw(d.piv.rotation,'y',m.v?-1.9:0,550); } } break;
  case 'win': if(O.on&&O.kind==='co'&&m.l===S.lvl&&!done){ if(room!==0) enterNow(0); O.silent=true; win(); } break;
  case 'go': if(O.on&&O.kind==='co'&&(m.n|0)!==S.lvl&&(m.n|0)>=0&&(m.n|0)<LV.length) start(m.n|0); break;
  case 'at': if(O.on&&O.kind==='race'){ O.fl=(m.l|0)+1; O.fc=m.c|0; hud(); } break;
  case 'won': if(O.on&&O.kind==='race'&&!O.over){ O.over=true; done=true; closeSheet(); raceEnd(false); } break;
  case 'again': if(NET.role==='p1') hostPick(); else guestWait(); break;
  case 'left': lost(); break; } }
function lost(){ const was=NET.state==='ready'; const fn=fname(); netClose(); if(!was) return entry('The connection was closed. Try again.'); entry(fn+' left, or lost the internet. Start a new room to play again.'); }
function guestWait(){ sheet('Waiting…',`<p>${fname()} joined! 🎉</p><p>The host is choosing how to play. Hang on…</p>`); }
function hostPick(){ const C=O.cfg; sheet('Choose how to play',`<p>${fname()} joined! 🎉</p>
  <p><b>Game</b></p><div id="gk"><button class="btn opt${C.k==='co'?' cur':''}" data-v="co">👥 Together<br><small>Same room, shared items. Easier.</small></button><button class="btn opt${C.k==='race'?' cur':''}" data-v="race">🏁 Race<br><small>First to clear the rooms wins.</small></button></div>
  <p><b>Difficulty</b></p><div id="gd">${['easy','medium','hard'].map(m=>`<button class="btn opt${C.d===m?' cur':''}" data-v="${m}">${MODES[m].name}</button>`).join('')}</div>
  <div id="gg"${C.k==='race'?'':' style="display:none"'}><p><b>Race to how many rooms?</b></p>${[3,5,10,15,20].map(g=>`<button class="btn opt${C.g===g?' cur':''}" data-v="${g}">${g}</button>`).join('')}</div>
  <p><button class="btn go" id="gs">Start!</button></p>`,el=>{
  const pick=(id,fn)=>el.querySelector(id).onclick=e=>{ const b=e.target.closest('button'); if(!b) return; el.querySelectorAll(id+' .opt').forEach(x=>x.classList.remove('cur')); b.classList.add('cur'); fn(b.dataset.v); };
  pick('#gk',v=>{ C.k=v; el.querySelector('#gg').style.display=v==='race'?'':'none'; }); pick('#gd',v=>C.d=v); pick('#gg',v=>C.g=+v);
  el.querySelector('#gs').onclick=()=>{ const cfg={k:C.k,d:C.d,g:C.g,sd:1+Math.floor(Math.random()*1e9)}; send(Object.assign({t:'cfg'},cfg)); begin(cfg); }; }); }
function begin(c){ O.on=true; O.kind=c.k; O.goal=c.g; O.cleared=0; O.fc=0; O.fl=0; O.over=false; O.sent={}; S.mode=c.d; S.sd=c.sd||1; S.hints=0; S.ms=0; closeSheet(); start(0); hud();
  toast(c.k==='co'?'Together! Everything you open, you both open.':'Race! First to clear '+c.g+' rooms wins.'); }
function raceEnd(won){ done=true; sheet(won?'🏆 You won the race!':'🏁 '+fname()+' won the race!',`<p>${won?'You cleared '+O.goal+' rooms first. Amazing!':fname()+' cleared '+O.goal+' rooms first. You cleared '+O.cleared+'. Good try!'}</p><button class="btn go" id="pa">Play again</button>`,el=>el.querySelector('#pa').onclick=()=>{ O.on=false; hud(); send({t:'again'}); if(NET.role==='p1') hostPick(); else guestWait(); }); }
/* ---- together: shared state ---- */
const cOf=st=>({o:st.open?1:0,u:st.unlocked?1:0,s:st.smashed?1:0,g:st.got||0,d:st.drop||0,p:st.placed||[]});
function syncOut(){ for(const k in F){ const v=F[k]; if(k.indexOf(':')<0) continue;
    if(k.startsWith('d:')){ if(O.sent[k]!==v){ O.sent[k]=v; send({t:'dr',l:S.lvl,k,v}); } continue; }
    if(v&&typeof v==='object'&&!Array.isArray(v)){ const c=cOf(v), j=JSON.stringify(c); if(O.sent[k]!==j){ O.sent[k]=j; send({t:'st',l:S.lvl,k,c}); } } } }
function rebuildInv(){ const placed=new Set(), got=[]; for(const k in F){ const v=F[k]; if(k.indexOf(':')<0||k.startsWith('d:')||!v||typeof v!=='object'||Array.isArray(v)) continue; (v.placed||[]).forEach(x=>placed.add(x)); if(v.got) got.push(v.got); }
  const ni=got.filter(n=>!placed.has(n)); if(ni.join()!==inv.join()){ inv=ni; drawInv(); } }
function recvSt(m){ if(m.l!==S.lvl||typeof m.k!=='string'||m.k.length>12) return; const c=m.c||{}, k=m.k, st=F[k]||(F[k]={});
  const was={o:st.open,d:st.drop,g:st.got,pl:(st.placed||[]).length};
  if(c.o) st.open=1; if(c.u) st.unlocked=1; if(c.s) st.smashed=1; if(typeof c.g==='string'&&ICON[c.g]) st.got=c.g;
  if(Array.isArray(c.p)){ const set=new Set(st.placed||[]); c.p.forEach(x=>{ if(typeof x==='string'&&ICON[x]) set.add(x); }); st.placed=[...set]; }
  if(st.got) delete st.drop; else if(typeof c.d==='string'&&ICON[c.d]) st.drop=c.d;
  const p=PROPS.find(q=>q.id===k); if(p){
    if(st.open&&!was.o){ if(p.sockets) runAltar(p,true); else if(hamP(p)) smash(p,()=>{}); else { moveProp(p,650); if(p.o.secret){ AU.rumble(); shake=.09; dust(p); } else AU.tick(); } }
    if(p.sockets&&(st.placed||[]).length>was.pl) paintSockets(p);
    if(st.drop&&!was.d&&!p.dropW) spawnDrop(p,true);
    if(st.got&&!was.g&&p.dropW){ p.dropW.parent.remove(p.dropW); const i=SPIN.indexOf(p.dropW); if(i>=0) SPIN.splice(i,1); p.dropW=null; if(p.dropH){ const j=HIT.indexOf(p.dropH); if(j>=0) HIT.splice(j,1); p.dropH=null; } } }
  rebuildInv(); O.sent[k]=JSON.stringify(cOf(st)); if(st.got&&!was.g) toast(fname()+' picked up '+INAME[st.got]+'.'); }
/* ---- the friend's little explorer ---- */
function mkAvatar(){ const g=new T.Group(), col=NET.role==='p1'?'#3b82c4':'#d9534f';
  g.add(M(CY(.28,.34,.95,10),col,0,.5,0)); g.add(M(new T.SphereGeometry(.26,12,10),'#f2d3a8',0,1.25,0)); g.add(M(new T.ConeGeometry(.3,.3,10),col,0,1.6,0));
  const cv=document.createElement('canvas'); cv.width=256; cv.height=64; const x=cv.getContext('2d'); x.font='bold 28px sans-serif'; x.textAlign='center'; x.fillStyle='rgba(0,0,0,.6)'; x.fillRect(0,8,256,48); x.fillStyle='#fff'; x.fillText(fname(),128,44);
  const sp=new T.Sprite(new T.SpriteMaterial({map:new T.CanvasTexture(cv),depthTest:false})); sp.scale.set(1.2,.3,1); sp.position.y=2.05; g.add(sp); scene.add(g); return g; }
function tick(dt){ if(!O.on||NET.state!=='ready') return;
  O.acc+=dt; if(O.acc>.12){ O.acc=0; send({t:'p',x:+px.toFixed(2),z:+pz.toFixed(2),y:+yaw.toFixed(2),r:room,l:S.lvl}); }
  if(O.kind==='co'){ O.acc2+=dt; if(O.acc2>.25){ O.acc2=0; syncOut(); } }
  const f=O.fp; if(f&&f.l===S.lvl&&f.r===room){ if(!O.av) O.av=mkAvatar(); O.av.visible=true; const k=Math.min(1,dt*9); O.av.position.x+=(f.x-O.av.position.x)*k; O.av.position.z+=(f.z-O.av.position.z)*k; O.av.rotation.y=f.y; } else if(O.av) O.av.visible=false; }
/* ---- hooks the game calls ---- */
return {get on(){ return O.on; },
  menu(){ if(O.on||NET.state==='ready'){ sheet('Online',`<p>${O.on?(O.kind==='co'?'Together with ':'Racing '):'Connected to '}${fname()}.</p><button class="btn" id="lv">Leave the room</button>`,el=>el.querySelector('#lv').onclick=()=>entry()); } else if(NET.state==='waiting'||NET.state==='connecting') sheet('Waiting…','<p>Waiting for a friend to join…</p><button class="btn" id="cx">Cancel</button>',el=>el.querySelector('#cx').onclick=()=>entry()); else entry(); },
  onStart(n){ O.sent={}; O.fp=O.fp; if(O.kind==='race'&&O.on) send({t:'at',l:n,c:O.cleared}); hud(); },
  onWin(){ if(O.silent){ O.silent=false; return; } if(O.on&&O.kind==='co') send({t:'win',l:S.lvl}); },
  afterWin(){ if(O.kind==='co'){ sheet('Door open',`<p>${LV[S.lvl].n} cleared. Nice teamwork!</p><button class="btn go" id="next">Go to room ${S.lvl+2}</button>`,el=>el.querySelector('#next').onclick=()=>goLevel(S.lvl+1)); return; }
    O.cleared++; send({t:'at',l:S.lvl+1,c:O.cleared}); hud();
    if(O.cleared>=O.goal){ if(!O.over){ O.over=true; send({t:'won'}); raceEnd(true); } return; }
    sheet('Room cleared!',`<p>You have cleared ${O.cleared} of ${O.goal}. ${fname()} has cleared ${O.fc}.</p><button class="btn go" id="next">Next room</button>`,el=>el.querySelector('#next').onclick=()=>start(S.lvl+1)); },
  sendGo(n){ if(O.on&&O.kind==='co') send({t:'go',n}); },
  tick, open:entry };
})();
