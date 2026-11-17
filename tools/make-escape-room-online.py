#!/usr/bin/env python3
"""Builds escape-room-online/ from escape-room/ (run from the repo root: python3 tools/make-escape-room-online.py).
Copies the single-player game and adds the two-device layer from tools/escape-room-online.js.
Re-run it after changing escape-room/ so the online game gets the same rooms and fixes."""
import os, re, shutil, json
SRC, DST = 'escape-room', 'escape-room-online'
if os.path.isdir(DST): shutil.rmtree(DST)
shutil.copytree(SRC, DST)
s = open(f'{DST}/index.html').read()
def rep(a, b):
    global s
    assert s.count(a) == 1, (s.count(a), a[:70]); s = s.replace(a, b)
rep("<title>Felix's Escape Rooms</title>", "<title>Felix's Escape Rooms Online</title>")
rep('content="Escape Rooms">', 'content="Escape Online">')
rep("const KEY='escapeRoomSave';", "const KEY='escapeRoomOnlineSave';")
# no live counter in the online copy
i = s.index("if(ON_SITE){ playBeat(); setTimeout(readLive,900);"); j = s.index("\n", s.index("addEventListener('pagehide',()=>playBeat(true)); }", i)); s = s[:i] + s[j+1:]
# hooks
rep("const last=S.lvl===LV.length-1; if(!last)", "const last=S.lvl===LV.length-1&&!OLON(); if(!last)")
rep("function win(){ if(done||!doorPivot) return; done=true; closeSheet(); walk=null;", "const OLON=()=>!!(window.OL&&OL.on);\nfunction goLevel(n){ if(window.OL) OL.sendGo(n); start(n); }\nfunction win(){ if(done||!doorPivot) return; done=true; closeSheet(); walk=null; if(window.OL) OL.onWin();")
rep("    } else sheet('Door open',", "    } else if(OLON()) OL.afterWin(); else sheet('Door open',")
rep("el.querySelector('#again').onclick=()=>start(S.lvl)); }\nfunction start(n)", "el.querySelector('#again').onclick=()=>goLevel(S.lvl)); }\nfunction start(n)") if "el.querySelector('#again').onclick=()=>start(S.lvl)); }\nfunction start(n)" in s else None
rep("F.fake=planFakes(n); cut=null;", "F.fake=planFakes(n); if(window.OL) OL.onStart(n); cut=null;")
rep("SPIN.forEach(w=>w.rotation.y+=dt*1.6);", "if(window.OL) OL.tick(dt);\n    SPIN.forEach(w=>w.rotation.y+=dt*1.6);")
rep("delete st.drop;\n  if(p.dropW)", "st.got=n; delete st.drop;\n  if(p.dropW)")
rep("function runAltar(p){", "function runAltar(p,remote){")
rep("at(5100,()=>give('key',p)); }", "at(5100,()=>{ if(!remote) give('key',p); }); }")
rep("const toggle=()=>{ if(d.open){", "d.piv=piv; const toggle=()=>{ if(d.open){")
rep("function planFakes(n){ const L=F.plan,", "function planFakes(n){ const R=rng((S.sd||1)+n*31+17), L=F.plan,")
rep("const j=Math.floor(Math.random()*(i+1)); [pool[i],pool[j]]=[pool[j],pool[i]];", "const j=Math.floor(R()*(i+1)); [pool[i],pool[j]]=[pool[j],pool[i]];")
# the timeUp retry button
m = re.search(r"closeSheet\(\); walk=null; AU\.buzz\(\);.*?\n.*?onclick=\(\)=>start\(S\.lvl\)\); \}", s, re.S)
assert m, 'timeUp'
s = s[:m.start()] + m.group(0).replace("onclick=()=>start(S.lvl)","onclick=()=>goLevel(S.lvl)") + s[m.end():]
# the Rooms button becomes the online Menu button
ol = open('tools/escape-room-online.js').read()
k = s.index("if(ON_SITE){const h=$('#bhome');")
s = s[:k] + "<<OLSCRIPT>>" + s[k:]
# keep everything in one script: put OL code before main script end? Insert as separate script instead
s = s.replace("<<OLSCRIPT>>", "")
rep("<script>\nif('serviceWorker'", "<script>\n" + ol + "\n$('#brooms').textContent='Menu'; $('#brooms').onclick=()=>OL.menu(); setTimeout(()=>OL.open(),500);\n</script>\n<script>\nif('serviceWorker'")
open(f'{DST}/index.html', 'w').write(s)
# manifest + service worker
m = open(f'{DST}/manifest.webmanifest').read()
m = m.replace("Felix's Escape Rooms", "Felix's Escape Rooms Online").replace('"Escape Rooms"', '"Escape Online"')
m = re.sub(r'"description": "[^"]*"', '"description": "Escape the rooms together with a friend, or race them on another device. 45 rooms, music and secret doors."', m)
open(f'{DST}/manifest.webmanifest', 'w').write(m)
w = open(f'{DST}/sw.js').read().replace("escape-room-__BUILD__", "escape-room-online-__BUILD__").replace("Felix's Escape Rooms offline", "Felix's Escape Rooms Online offline")
open(f'{DST}/sw.js', 'w').write(w)
print('built', DST)
