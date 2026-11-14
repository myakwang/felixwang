/* Felix's Hide & Seek — shared 3D engine (Three.js r128) */
(function(){
'use strict';
const HS=window.HS={};
const rnd=HS.rnd=(a,b)=>a+Math.random()*(b-a);
const clamp=HS.clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
HS.EYE=1.55;

/* ================= audio ================= */
let AC=null;HS.sound=true;
HS.ac=function(){if(!AC){try{AC=new(window.AudioContext||window.webkitAudioContext)();}catch(e){}}if(AC&&AC.state==='suspended')AC.resume();return AC;};
function tone(f,d,type,v,delay,f2){const a=HS.ac();if(!a||!HS.sound)return;const t=a.currentTime+(delay||0);const o=a.createOscillator(),g=a.createGain();o.type=type||'sine';o.frequency.setValueAtTime(f,t);if(f2)o.frequency.exponentialRampToValueAtTime(f2,t+d);g.gain.setValueAtTime(0.0001,t);g.gain.exponentialRampToValueAtTime(v||0.15,t+0.01);g.gain.exponentialRampToValueAtTime(0.0001,t+d);o.connect(g);g.connect(a.destination);o.start(t);o.stop(t+d+0.05);}
HS.sfx={
  found(){[523,659,784,1047].forEach((f,i)=>tone(f,0.2,'triangle',0.18,i*0.08));},
  giggle(){for(let i=0;i<6;i++)tone(1300-i*70+rnd(-50,50),0.07,'sine',0.13,i*0.09,850-i*50);},
  tick(){tone(660,0.07,'square',0.04);},
  go(){tone(300,0.45,'sawtooth',0.07,0,900);},
  lose(){[523,440,349,262].forEach((f,i)=>tone(f,0.28,'triangle',0.15,i*0.16));},
  win(){[523,659,784,659,784,1047].forEach((f,i)=>tone(f,0.17,'triangle',0.16,i*0.1));},
  miss(){tone(220,0.12,'triangle',0.08,0,160);},
  bark(){tone(420,0.11,'sawtooth',0.12,0,200);tone(460,0.13,'sawtooth',0.12,0.2,210);},
  paint(){tone(500,0.15,'sine',0.1,0,900);},
  jump(){tone(260,0.18,'sine',0.08,0,520);},
  brush(){tone(rnd(700,900),0.07,'triangle',0.06,0,rnd(350,450));}
};
// speech uses only voices that run on the device itself (nothing is sent anywhere)
let VOICE=undefined;function pickVoice(){try{const vs=speechSynthesis.getVoices().filter(v=>v.localService&&/^en/i.test(v.lang));VOICE=vs[0]||null;}catch(e){VOICE=null;}}
try{speechSynthesis.onvoiceschanged=pickVoice;}catch(e){}
HS.say=function(t,pitch){if(!HS.sound)return;try{if(VOICE===undefined)pickVoice();if(!VOICE)return;const u=new SpeechSynthesisUtterance(t);u.voice=VOICE;u.rate=1.05;u.pitch=pitch||1.4;speechSynthesis.cancel();speechSynthesis.speak(u);}catch(e){}};

/* ================= textures ================= */
function cv(w,h){const c=document.createElement('canvas');c.width=w;c.height=h;return [c,c.getContext('2d')];}
function T(c,rx,ry){const t=new THREE.CanvasTexture(c);t.wrapS=t.wrapT=THREE.RepeatWrapping;t.repeat.set(rx||1,ry||1);t.anisotropy=4;return t;}
function shade(hex,k){const c=new THREE.Color(hex);c.multiplyScalar(k);return '#'+c.getHexString();}
HS.shade=shade;
const TX=HS.tex={
  wood(base,rx,ry){const [c,g]=cv(256,256);base=base||'#c99a63';for(let r=0;r<8;r++){let x=-rnd(0,120);while(x<256){const l=rnd(90,170);g.fillStyle=shade(base,rnd(0.85,1.1));g.fillRect(x,r*32,l,32);g.strokeStyle='rgba(60,35,15,0.18)';g.lineWidth=1;for(let k=0;k<4;k++){g.beginPath();g.moveTo(x,r*32+rnd(4,28));g.bezierCurveTo(x+l*0.3,r*32+rnd(4,28),x+l*0.6,r*32+rnd(4,28),x+l,r*32+rnd(4,28));g.stroke();}g.strokeStyle='rgba(50,30,10,0.45)';g.lineWidth=2;g.strokeRect(x,r*32,l,32);x+=l;}}return T(c,rx,ry);},
  grass(rx,ry){const [c,g]=cv(256,256);g.fillStyle='#69b84a';g.fillRect(0,0,256,256);for(let i=0;i<2600;i++){g.strokeStyle=['#5aa83c','#7cc95a','#4f9a35','#86d264'][i%4];g.lineWidth=1.5;const x=rnd(0,256),y=rnd(0,256);g.beginPath();g.moveTo(x,y);g.lineTo(x+rnd(-2,2),y-rnd(3,7));g.stroke();}return T(c,rx,ry);},
  stone(base,rx,ry){const [c,g]=cv(256,256);base=base||'#a7a29a';g.fillStyle='#6f6a63';g.fillRect(0,0,256,256);for(let r=0;r<8;r++)for(let k=-1;k<5;k++){const x=k*64+(r%2?32:0),y=r*32;g.fillStyle=shade(base,rnd(0.88,1.1));g.fillRect(x+2,y+2,60,28);g.fillStyle='rgba(255,255,255,0.08)';g.fillRect(x+2,y+2,60,5);}return T(c,rx,ry);},
  wallpaper(rx,ry){const [c,g]=cv(128,128);g.fillStyle='#ffffff';g.fillRect(0,0,128,128);g.fillStyle='rgba(255,255,255,1)';for(let x=0;x<128;x+=32){g.fillStyle='rgba(0,0,0,0.045)';g.fillRect(x,0,12,128);}g.fillStyle='rgba(0,0,0,0.06)';for(let y=16;y<128;y+=32)for(let x=22;x<128;x+=32){g.beginPath();g.arc(x,y,2.5,0,7);g.fill();}return T(c,rx,ry);},
  sand(rx,ry){const [c,g]=cv(128,128);g.fillStyle='#ecd59b';g.fillRect(0,0,128,128);for(let i=0;i<900;i++){g.fillStyle=['#dcc282','#f6e3b0','#d2b571'][i%3];g.fillRect(rnd(0,128),rnd(0,128),2,2);}return T(c,rx,ry);},
  hay(){const [c,g]=cv(128,128);g.fillStyle='#e6c35c';g.fillRect(0,0,128,128);for(let i=0;i<400;i++){g.strokeStyle=['#c9a23c','#f3d77d','#b8902e'][i%3];g.lineWidth=1.3;const x=rnd(0,128),y=rnd(0,128),a=rnd(-0.6,0.6);g.beginPath();g.moveTo(x,y);g.lineTo(x+Math.cos(a)*14,y+Math.sin(a)*14);g.stroke();}return T(c,2,2);},
  sky(){const [c,g]=cv(64,512);const gr=g.createLinearGradient(0,0,0,512);gr.addColorStop(0,'#4fa3e8');gr.addColorStop(0.45,'#9fd3ff');gr.addColorStop(0.5,'#e8f6ff');gr.addColorStop(1,'#e8f6ff');g.fillStyle=gr;g.fillRect(0,0,64,512);const t=new THREE.CanvasTexture(c);return t;},
  clouds(){const [c,g]=cv(512,128);g.fillStyle='rgba(255,255,255,0.95)';for(let i=0;i<14;i++){const x=rnd(0,512),y=rnd(30,100);for(let k=0;k<5;k++){g.beginPath();g.arc(x+k*14,y+rnd(-6,6),rnd(10,20),0,7);g.fill();}}const t=new THREE.CanvasTexture(c);t.wrapS=THREE.RepeatWrapping;return t;},
  globe(){const [c,g]=cv(256,128);g.fillStyle='#3d8fe0';g.fillRect(0,0,256,128);g.fillStyle='#4caf50';for(let i=0;i<9;i++){const x=rnd(0,256),y=rnd(20,108);g.beginPath();for(let k=0;k<6;k++)g.arc(x+rnd(-18,18),y+rnd(-12,12),rnd(8,18),0,7);g.fill();}return T(c);},
  windowSky(){const [c,g]=cv(128,128);const gr=g.createLinearGradient(0,0,0,128);gr.addColorStop(0,'#6fb8f5');gr.addColorStop(1,'#d9f0ff');g.fillStyle=gr;g.fillRect(0,0,128,128);g.fillStyle='#fff';[[30,40],[90,70]].forEach(p=>{for(let k=0;k<4;k++){g.beginPath();g.arc(p[0]+k*9,p[1]+rnd(-3,3),9,0,7);g.fill();}});g.fillStyle='#7cc95a';g.fillRect(0,108,128,20);return T(c);},
  rug(){const [c,g]=cv(256,256);g.fillStyle='#d9534f';g.fillRect(0,0,256,256);g.fillStyle='#f6e7c8';for(let i=0;i<256;i+=32)g.fillRect(0,i,256,12);g.strokeStyle='#f6e7c8';g.lineWidth=10;g.strokeRect(10,10,236,236);return T(c);},
  carpet(){const [c,g]=cv(64,256);g.fillStyle='#b3262e';g.fillRect(0,0,64,256);g.fillStyle='#e8b923';g.fillRect(0,0,6,256);g.fillRect(58,0,6,256);return T(c,1,6);},
  hatch(n,alpha){const [c,g]=cv(256,256);g.lineCap='round';for(let i=0;i<n;i++){g.strokeStyle='rgba(30,25,40,'+(alpha*rnd(.5,1))+')';const x=rnd(-30,280),y=rnd(-10,300),l=rnd(30,90);g.lineWidth=rnd(1,2.8);g.beginPath();g.moveTo(x,y);g.lineTo(x+l*0.8+rnd(-5,5),y-l*0.6+rnd(-5,5));g.stroke();}return T(c);},
  tv(){const [c,g]=cv(512,300);g.fillStyle='#fdfcf7';g.fillRect(0,0,512,300);g.strokeStyle='#2b2b2b';g.lineWidth=5;g.lineCap='round';g.lineJoin='round';g.strokeRect(16,16,330,268);
    const stick=(x,col)=>{g.strokeStyle='#2b2b2b';g.beginPath();g.arc(x,80,22,0,7);g.stroke();g.beginPath();g.moveTo(x,102);g.lineTo(x,190);g.moveTo(x,125);g.lineTo(x-38,95);g.moveTo(x,125);g.lineTo(x+38,150);g.moveTo(x,190);g.lineTo(x-30,260);g.moveTo(x,190);g.lineTo(x+30,260);g.stroke();g.fillStyle=col;g.beginPath();g.arc(x,66,22,Math.PI,0);g.fill();g.fillStyle='#2b2b2b';g.beginPath();g.arc(x-8,80,3,0,7);g.arc(x+8,80,3,0,7);g.fill();};
    stick(115,'#e74c3c');stick(245,'#3498db');
    const cols=['#2ecc71','#e74c3c','#f1c40f','#95a5a6'];for(let i=0;i<4;i++){const y=34+i*62;g.fillStyle=cols[i];g.beginPath();if(g.roundRect)g.roundRect(372,y,48,44,12);else g.rect(372,y,48,44);g.fill();g.stroke();}
    g.font='26px "Patrick Hand",cursive';g.fillStyle='#2b2b2b';['PLAY','STOP','MENU','OFF'].forEach((w,i)=>g.fillText(w,430,62+i*62));return T(c);},
  sign(text,sub){const [c,g]=cv(512,170);g.fillStyle='#fff6d6';g.fillRect(0,0,512,170);g.strokeStyle='#7a4a24';g.lineWidth=12;g.strokeRect(6,6,500,158);g.fillStyle='#2b2b2b';g.font='72px "Patrick Hand",cursive';g.textAlign='center';g.fillText(text,256,104);g.font='30px "Patrick Hand",cursive';g.fillText(sub||'',256,148);return T(c);},
  flag(col1,col2){const [c,g]=cv(64,128);g.fillStyle=col1;g.fillRect(0,0,64,128);g.fillStyle=col2;g.beginPath();g.moveTo(32,30);g.lineTo(46,64);g.lineTo(32,98);g.lineTo(18,64);g.fill();return T(c);}
};

// remember the main color of each texture (used for camouflage)
{const baseOf={wood:a=>a[0]||'#c99a63',grass:()=>'#69b84a',stone:a=>a[0]||'#a7a29a',sand:()=>'#ecd59b',hay:()=>'#e6c35c',globe:()=>'#3d8fe0',rug:()=>'#d9534f',carpet:()=>'#b3262e'};
 for(const k in baseOf){const f=TX[k];TX[k]=function(...a){const t=f.apply(null,a);t.userData=t.userData||{};t.userData.base=baseOf[k](a);return t;};}}
/* ================= materials ================= */
const GM=(()=>{const d=new Uint8Array([150,150,150,255,205,205,205,255,255,255,255,255]);const t=new THREE.DataTexture(d,3,1,THREE.RGBAFormat);t.minFilter=t.magFilter=THREE.NearestFilter;t.generateMipmaps=false;t.needsUpdate=true;return t;})();
const matCache={};
HS.mat=function(color,o){o=o||{};const k=color+'|'+(o.map?o.map.uuid:'')+'|'+(o.emissive||'')+'|'+(o.opacity==null?1:o.opacity);if(!o.unique&&matCache[k])return matCache[k];
  const m=new THREE.MeshToonMaterial({color,gradientMap:GM,map:o.map||null,emissive:o.emissive||'#000000',transparent:o.opacity!=null&&o.opacity<1,opacity:o.opacity==null?1:o.opacity});m.userData.camo=(o.map&&o.map.userData&&o.map.userData.base&&new THREE.Color(color).getHex()===0xffffff)?o.map.userData.base.toLowerCase():'#'+new THREE.Color(color).getHexString();
  if(!o.unique)matCache[k]=m;return m;};
const LINEM=new THREE.LineBasicMaterial({color:0x1d1a17,transparent:true,opacity:0.55});
const OUTM=HS.OUTM=new THREE.MeshBasicMaterial({color:0x1d1a17,side:THREE.BackSide});

/* ================= renderer / scene ================= */
let renderer,scene,camera,sun,hemi,amb,skyDome,cloudDome;
HS.init=function(canvas){
  try{renderer=new THREE.WebGLRenderer({canvas,antialias:true});}catch(e){return false;}
  const mobile=Math.min(innerWidth,innerHeight)<700;
  renderer.setPixelRatio(Math.min(window.devicePixelRatio||1,mobile?1.75:2));
  renderer.shadowMap.enabled=true;renderer.shadowMap.type=THREE.PCFSoftShadowMap;
  scene=HS.scene=new THREE.Scene();
  camera=HS.camera=new THREE.PerspectiveCamera(72,1,0.05,200);camera.rotation.order='YXZ';
  hemi=new THREE.HemisphereLight(0xffffff,0x8a7a66,0.55);scene.add(hemi);
  amb=new THREE.AmbientLight(0xffffff,0.22);scene.add(amb);
  sun=new THREE.DirectionalLight(0xfff3dd,0.75);sun.castShadow=true;const s=mobile?1024:2048;sun.shadow.mapSize.set(s,s);sun.shadow.bias=-0.0006;sun.shadow.normalBias=0.02;scene.add(sun);scene.add(sun.target);
  skyDome=new THREE.Mesh(new THREE.SphereGeometry(120,24,16),new THREE.MeshBasicMaterial({map:TX.sky(),side:THREE.BackSide,fog:false,depthWrite:false}));scene.add(skyDome);
  cloudDome=new THREE.Mesh(new THREE.CylinderGeometry(100,100,40,32,1,true),new THREE.MeshBasicMaterial({map:TX.clouds(),side:THREE.BackSide,transparent:true,fog:false,depthWrite:false}));cloudDome.position.y=30;cloudDome.material.map.repeat.set(3,1);scene.add(cloudDome);
  const rs=()=>{renderer.setSize(innerWidth,innerHeight,false);camera.aspect=innerWidth/innerHeight;camera.updateProjectionMatrix();};addEventListener('resize',rs);rs();
  HS.renderer=renderer;return true;
};
HS.render=function(dt){if(cloudDome)cloudDome.rotation.y+=(dt||0)*0.004;renderer.render(scene,camera);};

/* ================= maps ================= */
HS.maps={};HS.mapList=[];
HS.defineMap=function(def){HS.maps[def.id]=def;HS.mapList.push(def);};
let W=null;
function disposeGroup(g){g.traverse(o=>{if(o.geometry)o.geometry.dispose();});}
function builder(W){
  const B={W};
  const add=(m,o)=>{((o&&o.parent)||W.group).add(m);return m;};
  B.col=(x0,x1,z0,z1,top,bot)=>W.cols.push({x0,x1,z0,z1,top,bot:bot||0});
  B.edges=(m,thr)=>{m.add(new THREE.LineSegments(new THREE.EdgesGeometry(m.geometry,thr||30),LINEM));return m;};
  const matOf=(c,o)=>Array.isArray(c)?c.map(x=>typeof x==='string'?HS.mat(x):x):(c&&c.isMaterial?c:HS.mat(c||'#ffffff',{map:o&&o.map,emissive:o&&o.emissive}));
  B.box=(w,h,d,x,y,z,color,o)=>{o=o||{};const m=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),matOf(color,o));m.position.set(x,y,z);if(o.ry)m.rotation.y=o.ry;if(o.rz)m.rotation.z=o.rz;if(o.rx)m.rotation.x=o.rx;
    m.castShadow=o.cast!==false;m.receiveShadow=true;if(o.edges!==false)B.edges(m);add(m,o);if(o.solid!==false)W.solids.push(m);
    if(o.col!==false&&!o.parent&&!o.ry&&!o.rz&&!o.rx){const top=(typeof o.col==='number')?o.col:y+h/2;B.col(x-w/2,x+w/2,z-d/2,z+d/2,top,o.float?y-h/2:0);}return m;};
  B.cyl=(rt,rb,h,x,y,z,color,o)=>{o=o||{};const m=new THREE.Mesh(new THREE.CylinderGeometry(rt,rb,h,o.seg||18,1,!!o.open),matOf(color,o));m.position.set(x,y,z);if(o.rx)m.rotation.x=o.rx;if(o.rz)m.rotation.z=o.rz;if(o.ry)m.rotation.y=o.ry;
    m.castShadow=o.cast!==false;m.receiveShadow=true;if(o.edges!==false)B.edges(m,40);add(m,o);if(o.solid!==false)W.solids.push(m);
    if(o.col){const r=Math.max(rt,rb);const top=(typeof o.col==='number')?o.col:y+h/2;B.col(x-r,x+r,z-r,z+r,top);}return m;};
  B.ball=(r,x,y,z,color,o)=>{o=o||{};const m=new THREE.Mesh(new THREE.SphereGeometry(r,o.seg||20,o.seg?Math.max(6,(o.seg*0.7)|0):14),matOf(color,o));m.position.set(x,y,z);if(o.sy)m.scale.y=o.sy;if(o.sx)m.scale.x=o.sx;if(o.sz)m.scale.z=o.sz;
    m.castShadow=o.cast!==false;m.receiveShadow=true;if(o.outline!==false){const ol=new THREE.Mesh(m.geometry,OUTM);ol.scale.setScalar(1.045);m.add(ol);}add(m,o);if(o.solid!==false)W.solids.push(m);
    if(o.col){const top=(typeof o.col==='number')?o.col:y+r*(o.sy||1);B.col(x-r,x+r,z-r,z+r,top);}return m;};
  B.plane=(w,h,x,y,z,mat,o)=>{o=o||{};const m=new THREE.Mesh(new THREE.PlaneGeometry(w,h),mat.isMaterial?mat:HS.mat(mat,{map:o.map}));m.position.set(x,y,z);m.rotation.order='YXZ';m.rotation.y=o.ry||0;m.rotation.x=o.rx||0;m.receiveShadow=o.receive!==false;if(o.cast)m.castShadow=true;if(o.edges)B.edges(m);add(m,o);if(o.solid)W.solids.push(m);return m;};
  B.basic=(w,h,x,y,z,map,o)=>{o=o||{};const mat=new THREE.MeshBasicMaterial({map,transparent:!!o.transparent,opacity:o.opacity==null?1:o.opacity,depthWrite:!o.transparent});return B.plane(w,h,x,y,z,mat,o);};
  // stairs rising along +x (dir 1) or -x (dir -1); z0..z1 width
  B.steps=(o)=>{const n=o.n,run=o.run,rise=o.rise,dir=o.dir||1;for(let i=0;i<n;i++){const top=(o.base||0)+(i+1)*rise;const xa=dir>0?o.x0+i*run:o.x0-(i+1)*run;
    B.box(run,top,o.z1-o.z0,xa+run/2,top/2,(o.z0+o.z1)/2,[o.side,o.side,o.top,o.side,o.side,o.side],{edges:true});}};
  B.light=(color,int,dist,x,y,z)=>{const l=new THREE.PointLight(color,int,dist);l.position.set(x,y,z);W.group.add(l);return l;};
  B.figure=(o,spot)=>{const f=HS.makeFigure(o);HS.placeFigure(f,spot);W.group.add(f);return f;};
  return B;
}
HS.loadMap=function(id){
  if(W){scene.remove(W.group);disposeGroup(W.group);}
  const def=HS.maps[id];const g=new THREE.Group();scene.add(g);
  W=HS.world={def,group:g,cols:[],solids:[]};
  const BB=builder(W);def.build(BB);if(def.sky)def.sky(BB);
  const e=def.env;
  scene.background=new THREE.Color(e.bg||'#cfe8ff');
  scene.fog=e.fog?new THREE.Fog(e.fog[0],e.fog[1],e.fog[2]):null;
  skyDome.visible=cloudDome.visible=!!e.sky;
  hemi.intensity=e.hemi==null?0.55:e.hemi;amb.intensity=e.amb==null?0.22:e.amb;
  sun.intensity=e.sun==null?0.75:e.sun;sun.position.set(...(e.sunPos||[8,16,10]));sun.target.position.set(0,0,0);
  const sc=sun.shadow.camera,ext=e.shadowExt||18;sc.left=-ext;sc.right=ext;sc.top=ext;sc.bottom=-ext;sc.near=1;sc.far=80;sc.updateProjectionMatrix();
  buildGrid();
  W.spots=def.spots.map((s,i)=>{const sp=Object.assign({},s,{i});const f=HS.makeFigure({});HS.placeFigure(f,sp);f.updateMatrixWorld(true);const v=new THREE.Vector3();f.userData.inner.userData.head.getWorldPosition(v);sp.eye=v.add(new THREE.Vector3(0,0.05,0));sp.lookY=HS.floorAt(s.look[0],s.look[1]);sp.top=v.y+0.45;return sp;});
  return W;
};
// ground-level view (seeker, dog, paths): floating things high overhead don't count
HS.floorAt=function(x,z,r){if(r===undefined)r=0.3;let h=0;for(const c of W.cols){if(c.bot>=1.75)continue;if(x>c.x0-r&&x<c.x1+r&&z>c.z0-r&&z<c.z1+r&&c.top>h)h=c.top;}return h;};
// for a player whose feet are at 'feet': what can I stand on, what blocks me, what is over my head?
HS.standAt=function(x,z,r,feet){let h=0;for(const c of W.cols){if(x>c.x0-r&&x<c.x1+r&&z>c.z0-r&&z<c.z1+r&&c.top<=feet+0.62&&c.top>h)h=c.top;}return h;};
HS.blockAt=function(x,z,r,feet){for(const c of W.cols){if(x>c.x0-r&&x<c.x1+r&&z>c.z0-r&&z<c.z1+r&&c.top>feet+0.62&&c.bot<feet+1.75)return true;}return false;};
HS.ceilAt=function(x,z,r,feet){let m=null;for(const c of W.cols){if(c.bot>feet+0.05&&x>c.x0-r&&x<c.x1+r&&z>c.z0-r&&z<c.z1+r&&(m===null||c.bot<m))m=c.bot;}return m;};
HS.clampXZ=function(x,z,m){const b=W.def.bounds;m=m==null?0.3:m;return [clamp(x,b.x0+m,b.x1-m),clamp(z,b.z0+m,b.z1-m)];};

/* ================= pathfinding grid ================= */
function buildGrid(){const b=W.def.bounds,GS=0.5;const NX=Math.round((b.x1-b.x0)/GS),NZ=Math.round((b.z1-b.z0)/GS);const H=new Float32Array(NX*NZ);
  for(let j=0;j<NZ;j++)for(let i=0;i<NX;i++){const x=b.x0+GS/2+i*GS,z=b.z0+GS/2+j*GS;H[i+j*NX]=(x<b.x0+0.29||x>b.x1-0.29||z<b.z0+0.29||z>b.z1-0.29)?99:HS.floorAt(x,z);}
  W.grid={GS,NX,NZ,H,x0:b.x0,z0:b.z0};
  const s=W.def.spawn.seeker;const start=cellOf(s[0],s[1]);const seen=new Uint8Array(NX*NZ);seen[start]=1;const q=[start];W.reach=[];
  while(q.length){const c=q.shift();W.reach.push(c);nbrs(c,n=>{if(!seen[n]){seen[n]=1;q.push(n);}});}
}
function cellOf(x,z){const G=W.grid;return clamp(Math.floor((x-G.x0)/G.GS),0,G.NX-1)+clamp(Math.floor((z-G.z0)/G.GS),0,G.NZ-1)*G.NX;}
function cx(c){const G=W.grid;return G.x0+G.GS/2+(c%G.NX)*G.GS;}function cz(c){const G=W.grid;return G.z0+G.GS/2+((c/G.NX)|0)*G.GS;}
function pass(a,b){const H=W.grid.H;return H[b]<20&&Math.abs(H[a]-H[b])<=0.62;}
function nbrs(c,fn){const G=W.grid;const ci=c%G.NX,cj=(c/G.NX)|0;for(let di=-1;di<=1;di++)for(let dj=-1;dj<=1;dj++){if(!di&&!dj)continue;const ni=ci+di,nj=cj+dj;if(ni<0||nj<0||ni>=G.NX||nj>=G.NZ)continue;const n=ni+nj*G.NX;if(!pass(c,n))continue;if(di&&dj&&(!pass(c,ci+di+cj*G.NX)||!pass(c,ci+(cj+dj)*G.NX)))continue;fn(n);}}
HS.findPath=function(sx,sz,tx,tz){const G=W.grid;const s=cellOf(sx,sz);const par=new Int32Array(G.NX*G.NZ).fill(-2);par[s]=-1;const q=[s];let best=s,bd=1e9,qi=0;
  while(qi<q.length){const c=q[qi++];const d=Math.hypot(cx(c)-tx,cz(c)-tz);if(d<bd){bd=d;best=c;}nbrs(c,n=>{if(par[n]===-2){par[n]=c;q.push(n);}});}
  const path=[];let c=best;while(c>=0){path.unshift([cx(c),cz(c)]);c=par[c];}if(bd<0.7)path.push([tx,tz]);return path;};
HS.randomSpot=function(nearX,nearZ,maxD){for(let k=0;k<40;k++){const c=W.reach[(Math.random()*W.reach.length)|0];if(nearX==null||Math.hypot(cx(c)-nearX,cz(c)-nearZ)<maxD)return [cx(c),cz(c)];}const c=W.reach[(Math.random()*W.reach.length)|0];return [cx(c),cz(c)];};

/* ================= stick figures ================= */
const cylG=new THREE.CylinderGeometry(1,1,1,10);
const torsoG=new THREE.CylinderGeometry(0.15,0.17,0.56,14);
const headG=new THREE.SphereGeometry(0.22,20,14);
const eyeG=new THREE.SphereGeometry(0.032,8,6);
const handG=new THREE.SphereGeometry(0.065,10,8);
const shoeG=new THREE.SphereGeometry(0.08,10,8);
const capG=new THREE.SphereGeometry(0.228,16,8,0,Math.PI*2,0,Math.PI/2);
const BLACK=HS.mat('#1d1a17');
function tm(c){return new THREE.MeshToonMaterial({color:c,gradientMap:GM});}
HS.PARTS=['cap','head','body','armL','armR','legL','legR'];
HS.makeFigure=function(o){
  o=o||{};const cols={skin:o.skin||'#ffdcbc',shirt:o.shirt||o.cap||'#ffffff',pants:o.pants||'#3f5b8a',cap:o.cap||'#e74c3c',shoe:o.shoe||'#2e2e2e'};
  const parts={};const pm=(part,color)=>{const m=tm(color);(parts[part]=parts[part]||[]).push({m,o:new THREE.Color(color),t:new THREE.Color(color)});m.userData.part=part;return m;};
  const inner=new THREE.Group();const hips=new THREE.Group();inner.add(hips);
  const limb=(parent,len,r,mat)=>{const m=new THREE.Mesh(cylG,mat);m.scale.set(r,len,r);m.position.y=-len/2;m.castShadow=true;parent.add(m);const ol=new THREE.Mesh(cylG,OUTM);ol.scale.set(r+0.016,len+0.01,r+0.016);ol.position.y=-len/2;parent.add(ol);return m;};
  const leg=(s,part)=>{const th=new THREE.Group();th.position.x=s*0.085;hips.add(th);limb(th,0.42,0.068,pm(part,cols.pants));const kn=new THREE.Group();kn.position.y=-0.42;th.add(kn);limb(kn,0.4,0.06,pm(part,cols.pants));const sh=new THREE.Mesh(shoeG,pm(part,cols.shoe));sh.scale.set(1,0.7,1.5);sh.position.set(0,-0.42,0.04);sh.castShadow=true;kn.add(sh);return {th,kn};};
  const L=leg(-1,'legL'),R=leg(1,'legR');
  const spine=new THREE.Group();hips.add(spine);
  const torso=new THREE.Mesh(torsoG,pm('body',cols.shirt));torso.position.y=0.28;torso.castShadow=true;spine.add(torso);const tol=new THREE.Mesh(torsoG,OUTM);tol.position.y=0.28;tol.scale.set(1.1,1.03,1.1);spine.add(tol);
  const arm=(s,part)=>{const a=new THREE.Group();a.position.set(s*0.19,0.5,0);spine.add(a);const sl=new THREE.Mesh(cylG,pm(part,cols.shirt));sl.scale.set(0.07,0.16,0.07);sl.position.y=-0.06;a.add(sl);limb(a,0.48,0.048,pm(part,cols.skin));const h=new THREE.Mesh(handG,pm(part,cols.skin));h.position.y=-0.5;a.add(h);return a;};
  const aL=arm(-1,'armL'),aR=arm(1,'armR');
  const head=new THREE.Group();head.position.y=0.8;spine.add(head);
  const hm=new THREE.Mesh(headG,pm('head',cols.skin));hm.castShadow=true;head.add(hm);const ho=new THREE.Mesh(headG,OUTM);ho.scale.setScalar(1.08);head.add(ho);
  const e1=new THREE.Mesh(eyeG,BLACK);e1.position.set(-0.075,0.03,0.2);head.add(e1);const e2=e1.clone();e2.position.x=0.075;head.add(e2);
  const sm=new THREE.Mesh(new THREE.TorusGeometry(0.065,0.014,4,10,Math.PI),BLACK);sm.position.set(0,-0.06,0.2);sm.rotation.z=Math.PI;head.add(sm);
  if(o.seeker){const band=new THREE.Mesh(new THREE.TorusGeometry(0.225,0.04,6,22),pm('cap',cols.cap));band.rotation.x=Math.PI/2;band.position.y=0.07;head.add(band);}
  else if(o.helmet){const cm=pm('cap',cols.cap);const hel=new THREE.Mesh(new THREE.CylinderGeometry(0.2,0.25,0.34,14),cm);hel.position.y=0.09;head.add(hel);const pl=new THREE.Mesh(new THREE.ConeGeometry(0.06,0.25,8),cm);pl.position.y=0.36;head.add(pl);}
  else{const cm=pm('cap',cols.cap);const cap=new THREE.Mesh(capG,cm);cap.position.y=0.03;head.add(cap);const brim=new THREE.Mesh(new THREE.CylinderGeometry(0.15,0.15,0.03,14),cm);brim.position.set(0,0.04,0.19);brim.scale.z=0.75;head.add(brim);}
  inner.traverse(m=>{if(m.isMesh&&m.material.userData&&m.material.userData.part)m.userData.part=m.material.userData.part;});
  inner.userData={hips,L,R,spine,aL,aR,head,parts,cols};
  const outer=new THREE.Group();outer.add(inner);outer.userData.inner=inner;outer.userData.paintState={};
  if(o.scale)outer.scale.setScalar(o.scale);
  pose(inner,'stand',0);
  return outer;
};
// paint one body part (fades in) or the whole figure (instant)
HS.paintPart=function(fig,part,color,instant){const u=fig.userData.inner.userData;const list=u.parts[part];if(!list)return;
  list.forEach(e=>{e.t.set(color||e.o);if(instant)e.m.color.copy(e.t);});fig.userData.paintState[part]=color||null;fig.userData.painting=1;};
HS.paint=function(fig,color){HS.PARTS.forEach(p=>HS.paintPart(fig,p,color,true));};
HS.tickPaint=function(fig,dt){if(!fig.userData.painting)return;let busy=false;const u=fig.userData.inner.userData;const k=Math.min(1,dt*3.2);
  for(const p in u.parts)u.parts[p].forEach(e=>{e.m.color.lerp(e.t,k);if(Math.abs(e.m.color.r-e.t.r)+Math.abs(e.m.color.g-e.t.g)+Math.abs(e.m.color.b-e.t.b)>0.01)busy=true;else e.m.color.copy(e.t);});
  fig.userData.painting=busy?1:0;};
HS.getPaint=function(fig){const s=fig.userData.paintState;return HS.PARTS.map(p=>s[p]||'');};
HS.setPaintArr=function(fig,arr){if(!Array.isArray(arr))return;HS.PARTS.forEach((p,i)=>{const c=typeof arr[i]==='string'&&/^#[0-9a-f]{6}$/i.test(arr[i])?arr[i].toLowerCase():null;if((fig.userData.paintState[p]||null)!==c)HS.paintPart(fig,p,c);});};
function pose(inner,name,t){
  const u=inner.userData;t=t||0;
  u.hips.position.set(0,0.86,0);u.spine.rotation.set(0,0,0);u.head.rotation.set(0,0,0);
  const S=(g,x,y,z)=>g.rotation.set(x||0,y||0,z||0);
  S(u.L.th,0,0,-0.08);S(u.R.th,0,0,0.08);S(u.L.kn);S(u.R.kn);S(u.aL,0,0,-0.32);S(u.aR,0,0,0.32);
  if(name==='walk'){const k=Math.sin(t*10);S(u.L.th,k*0.7,0,-0.05);S(u.R.th,-k*0.7,0,0.05);S(u.L.kn,Math.max(0,k)*0.9);S(u.R.kn,Math.max(0,-k)*0.9);S(u.aL,-k*0.6,0,-0.15);S(u.aR,k*0.6,0,0.15);u.hips.position.y=0.86+Math.abs(Math.cos(t*10))*0.03;}
  else if(name==='crouch'){u.hips.position.y=0.34+Math.sin(t*2)*0.01;S(u.L.th,-1.3,0,-0.15);S(u.R.th,-1.3,0,0.15);S(u.L.kn,2.4);S(u.R.kn,2.4);S(u.spine,0.45);S(u.aL,-1.1,0,0.25);S(u.aR,-1.1,0,-0.25);}
  else if(name==='sit'){u.hips.position.y=0.07;S(u.L.th,-1.5,0,-0.12);S(u.R.th,-1.5,0,0.12);S(u.L.kn,1.5+Math.sin(t*2.2)*0.3);S(u.R.kn,1.5+Math.sin(t*2.2+2)*0.3);S(u.aL,0,0,-0.3);S(u.aR,0,0,0.3);}
  else if(name==='lie'){S(u.aL,0,0,-1.0);S(u.aR,0,0,1.0);S(u.head,-0.3+Math.sin(t*1.5)*0.1);}
  else if(name==='flat'){S(u.L.th,0,0,-0.02);S(u.R.th,0,0,0.02);S(u.aL,0,0,-0.12);S(u.aR,0,0,0.12);}
  else if(name==='wave'){S(u.aR,0,0,2.5+Math.sin(t*12)*0.35);}
  else if(name==='cheer'){S(u.aR,0,0,2.6+Math.sin(t*12)*0.2);S(u.aL,0,0,-2.6-Math.sin(t*12)*0.2);u.hips.position.y=0.86+Math.abs(Math.sin(t*6))*0.15;}
  else if(name==='cover'){S(u.aL,-2.55,0,0.35);S(u.aR,-2.55,0,-0.35);S(u.head,0.25);}
  else if(name==='look'){S(u.aL,0,0,-0.3);S(u.aR,-1.6,0,0);}
}
HS.pose=pose;
HS.placeFigure=function(fig,spot){
  const inner=fig.userData.inner;inner.rotation.set(0,0,0);inner.position.set(0,0,0);
  if(spot.pose==='lie'){inner.rotation.x=-Math.PI/2;inner.position.y=0.24;}
  fig.position.set(spot.pos[0],spot.pos[1],spot.pos[2]);
  fig.rotation.set(0,spot.yaw!=null?spot.yaw:Math.atan2(-spot.pos[0],-spot.pos[2]),0);
  pose(inner,spot.pose,0);
};
HS.setLie=function(fig,lie){const inner=fig.userData.inner;if(lie){inner.rotation.x=-Math.PI/2;inner.position.y=0.24;}else{inner.rotation.x=0;inner.position.y=0;}};
// invisible tap target that follows the figure
const HIT={stand:[0.85,1.95,0.75,0,0.97,0],flat:[0.85,1.95,0.75,0,0.97,0],walk:[0.85,1.95,0.75,0,0.97,0],crouch:[0.95,1.35,1.0,0,0.65,0.1],sit:[0.85,1.4,1.1,0,0.6,0.2],lie:[0.95,0.75,2.1,0,0.35,-0.85]};
const hitMat=new THREE.MeshBasicMaterial({visible:false});
HS.setHit=function(fig,p){const d=HIT[p]||HIT.stand;let h=fig.userData.hit;if(!h){h=new THREE.Mesh(new THREE.BoxGeometry(1,1,1),hitMat);fig.add(h);fig.userData.hit=h;}h.scale.set(d[0],d[1],d[2]);h.position.set(d[3],d[4],d[5]);h.userData.fig=fig;return h;};

/* ================= the dog ================= */
HS.makeDog=function(){
  const g=new THREE.Group();const fur=tm('#c58b4e'),dark=tm('#7a4a24'),white=tm('#fff7ec');
  const body=new THREE.Group();body.position.y=0.5;g.add(body);
  const add=(geo,mat,x,y,z,p,sc)=>{const m=new THREE.Mesh(geo,mat);m.position.set(x,y,z);if(sc)m.scale.set(...sc);m.castShadow=true;(p||body).add(m);const o=new THREE.Mesh(geo,OUTM);o.scale.setScalar(1.07);m.add(o);return m;};
  add(new THREE.SphereGeometry(0.26,16,12),fur,0,0,0,null,[1,0.9,1.7]);
  add(new THREE.SphereGeometry(0.2,12,10),white,0,-0.06,0.22,null,[1,0.8,1.2]);
  const head=new THREE.Group();head.position.set(0,0.22,0.46);body.add(head);
  add(new THREE.SphereGeometry(0.2,16,12),fur,0,0,0,head);
  add(new THREE.SphereGeometry(0.11,12,10),white,0,-0.06,0.17,head,[1,0.8,1.3]);
  add(new THREE.SphereGeometry(0.045,8,6),BLACK,0,-0.02,0.31,head);
  const eg=new THREE.SphereGeometry(0.03,8,6);[-1,1].forEach(s=>{const e=new THREE.Mesh(eg,BLACK);e.position.set(s*0.08,0.06,0.16);head.add(e);});
  const ears=[-1,1].map(s=>{const e=new THREE.Group();e.position.set(s*0.15,0.1,-0.02);head.add(e);add(new THREE.SphereGeometry(0.1,10,8),dark,0,-0.1,0,e,[0.45,1.2,0.8]);return e;});
  const tongue=new THREE.Mesh(new THREE.BoxGeometry(0.06,0.015,0.09),tm('#ff7f9e'));tongue.position.set(0,-0.12,0.24);head.add(tongue);
  const legs=[[-0.13,0.28],[0.13,0.28],[-0.13,-0.28],[0.13,-0.28]].map(p=>{const l=new THREE.Group();l.position.set(p[0],-0.08,p[1]);body.add(l);const m=new THREE.Mesh(cylG,fur);m.scale.set(0.055,0.42,0.055);m.position.y=-0.2;m.castShadow=true;l.add(m);const pw=new THREE.Mesh(new THREE.SphereGeometry(0.065,8,6),white);pw.position.y=-0.41;l.add(pw);return l;});
  const tail=new THREE.Group();tail.position.set(0,0.12,-0.42);body.add(tail);const tm2=new THREE.Mesh(cylG,fur);tm2.scale.set(0.04,0.3,0.04);tm2.position.y=0.15;tail.add(tm2);tail.rotation.x=-0.7;
  const collar=new THREE.Mesh(new THREE.TorusGeometry(0.15,0.03,6,14),tm('#e74c3c'));collar.position.set(0,0.12,0.36);collar.rotation.x=1.2;body.add(collar);
  g.userData={body,head,legs,tail,ears};
  return g;
};
HS.animDog=function(dog,mode,t){const u=dog.userData;const S=Math.sin;
  u.tail.rotation.z=S(t*(mode==='bark'?22:12))*0.6;
  if(mode==='walk'){u.legs.forEach((l,i)=>l.rotation.x=S(t*12+(i%2?0:Math.PI)+(i>1?Math.PI:0))*0.6);u.body.position.y=0.5+Math.abs(S(t*12))*0.03;u.body.rotation.x=0;u.head.rotation.x=0;}
  else if(mode==='sit'){u.legs[0].rotation.x=0;u.legs[1].rotation.x=0;u.legs[2].rotation.x=-1.3;u.legs[3].rotation.x=-1.3;u.body.rotation.x=-0.45;u.body.position.y=0.42;u.head.rotation.x=0.35;}
  else if(mode==='bark'){u.legs.forEach(l=>l.rotation.x=0);u.body.rotation.x=0;u.body.position.y=0.5+Math.abs(S(t*16))*0.06;u.head.rotation.x=-0.2+S(t*16)*0.2;}
  else {u.legs.forEach(l=>l.rotation.x=0);u.body.rotation.x=0;u.body.position.y=0.5;u.head.rotation.x=S(t*1.5)*0.1;u.head.rotation.y=S(t*0.7)*0.4;}
};
// simple dog brain: wander / go somewhere / bark
HS.makeDogAgent=function(){const fig=HS.makeDog();scene.add(fig);const bub=HS.sprite('Woof!',{bg:'#fff6d6',w:1.3,h:0.55});bub.visible=false;scene.add(bub);
  return {fig,bub,x:0,z:0,y:0,yaw:0,path:[],idle:1,t:0,mode:'idle',bark:0,cb:null,hold:0,speed:3};};
HS.dogReset=function(a,x,z){a.x=x;a.z=z;a.y=HS.floorAt(x,z,0.2);a.path=[];a.cb=null;a.idle=1;a.bark=0;a.hold=0;a.fig.visible=true;};
HS.dogGoTo=function(a,x,z,cb,speed){a.path=HS.findPath(a.x,a.z,x,z);a.cb=cb||null;a.speed=speed||3;a.hold=0;};
HS.dogBark=function(a,dur){a.bark=dur||1.5;HS.sfx.bark();};
HS.dogUpdate=function(a,dt,faceX,faceZ){a.t+=dt;let mode='idle';
  if(a.path.length){const p=a.path[0];const dx=p[0]-a.x,dz=p[1]-a.z,d=Math.hypot(dx,dz),sp=a.speed*dt;if(d<=sp){a.x=p[0];a.z=p[1];a.path.shift();if(!a.path.length&&a.cb){const c=a.cb;a.cb=null;c();}}else{a.x+=dx/d*sp;a.z+=dz/d*sp;let dy=Math.atan2(dx,dz)-a.yaw;dy=Math.atan2(Math.sin(dy),Math.cos(dy));a.yaw+=dy*Math.min(1,dt*10);}mode='walk';}
  else{if(a.hold>0){a.hold-=dt;mode='sit';if(faceX!=null)a.yaw=Math.atan2(faceX-a.x,faceZ-a.z);}else{a.idle-=dt;if(a.idle<=0){const p=HS.randomSpot(a.x,a.z,9);HS.dogGoTo(a,p[0],p[1],null,1.8);a.idle=rnd(2,5);}}}
  if(a.bark>0){a.bark-=dt;mode='bark';}
  a.y+=(HS.floorAt(a.x,a.z,0.2)-a.y)*Math.min(1,dt*12);
  a.fig.position.set(a.x,a.y,a.z);a.fig.rotation.y=a.yaw;HS.animDog(a.fig,mode,a.t);
  a.bub.visible=a.bark>0;a.bub.position.set(a.x,a.y+1.45,a.z);};

/* ================= sprites ================= */
HS.sprite=function(text,o){o=o||{};const [c,g]=cv(256,110);const tex=new THREE.CanvasTexture(c);const m=new THREE.SpriteMaterial({map:tex,depthTest:!!o.depth,transparent:true});const s=new THREE.Sprite(m);s.scale.set(o.w||1.2,o.h||0.52,1);s.renderOrder=10;s.userData={c,g,tex,o};HS.spriteText(s,text);return s;};
HS.spriteText=function(s,text,bg){const {c,g,tex,o}=s.userData;g.clearRect(0,0,256,110);g.fillStyle=bg||o.bg||'#fffdf6';g.strokeStyle='#2b2b2b';g.lineWidth=6;g.beginPath();if(g.roundRect)g.roundRect(6,6,244,98,30);else g.rect(6,6,244,98);g.fill();g.stroke();g.fillStyle=o.fg||'#2b2b2b';g.font='bold '+(o.font||52)+'px "Patrick Hand",cursive';g.textAlign='center';g.textBaseline='middle';g.fillText(text,128,58);tex.needsUpdate=true;};

/* ================= player ================= */
const P=HS.P={x:0,z:0,feet:0,vy:0,camY:1.55,yaw:0,pitch:0,ground:true};
HS.resetPlayer=function(x,z,fx,fz){P.x=x;P.z=z;P.feet=HS.floorAt(x,z);P.vy=0;P.camY=P.feet+HS.EYE;P.yaw=Math.atan2(-(fx-x),-(fz-z));P.pitch=0;P.ground=true;};
HS.movePlayer=function(mx,mz,dt){
  const b=W.def.bounds;
  const tryPos=(nx,nz)=>{nx=clamp(nx,b.x0+0.3,b.x1-0.3);nz=clamp(nz,b.z0+0.3,b.z1-0.3);if(HS.blockAt(nx,nz,0.3,P.feet))return false;P.x=nx;P.z=nz;return true;};
  if(mx||mz){if(!tryPos(P.x+mx,P.z+mz)){if(!tryPos(P.x+mx,P.z))tryPos(P.x,P.z+mz);}}
  const h=HS.standAt(P.x,P.z,0.3,P.feet);
  if(P.vy>0||P.feet>h+0.001){P.vy-=22*dt;let nf=P.feet+P.vy*dt;if(P.vy>0){const c=HS.ceilAt(P.x,P.z,0.25,P.feet);if(c!==null&&nf+1.75>c){nf=Math.max(P.feet,c-1.75);P.vy=0;}}P.feet=nf;
    const h2=HS.standAt(P.x,P.z,0.3,P.feet);if(P.feet<=h2){P.feet=h2;P.vy=0;P.ground=true;}else P.ground=false;}
  else{P.feet=h;P.vy=0;P.ground=true;}
  const bo=W.def.bounce;if(bo&&P.ground&&Math.hypot(P.x-bo[0],P.z-bo[1])<bo[2]&&P.feet>bo[3]-0.05){P.vy=11.5;P.ground=false;HS.sfx.jump();}
  P.camY+=(P.feet+HS.EYE-P.camY)*Math.min(1,dt*14);
};
HS.jump=function(){if(P.ground){P.vy=7.6;P.ground=false;HS.sfx.jump();return true;}return false;};
HS.firstPerson=function(pos){camera.position.copy(pos||new THREE.Vector3(P.x,P.camY,P.z));camera.rotation.set(P.pitch,P.yaw,0);};
const tv=new THREE.Vector3();
// keep the camera on our side of walls (big maps have lots of rooms)
function inCol(c,x,y,z,r){return x>c.x0-r&&x<c.x1+r&&z>c.z0-r&&z<c.z1+r&&y<c.top+0.05&&y>(c.bot||0)-0.05;}
function camFree(t,p){const dx=p.x-t.x,dy=p.y-t.y,dz=p.z-t.z,L=Math.hypot(dx,dy,dz);if(L<0.2)return;const cs=W.cols.filter(c=>!inCol(c,t.x,t.y,t.z,0.12)&&c.top>Math.min(t.y,p.y)-0.1);
  const n=Math.ceil(L/0.1);let last=0;for(let i=1;i<=n;i++){const k=i/n,x=t.x+dx*k,y=t.y+dy*k,z=t.z+dz*k;if(cs.some(c=>inCol(c,x,y,z,0.12)))break;last=k;}
  if(last<1){const k=Math.max(0,last-0.02);p.set(t.x+dx*k,t.y+dy*k,t.z+dz*k);}}
HS.thirdPerson=function(target,dist){dist=dist||3.4;const cp=Math.cos(P.pitch),sp=Math.sin(P.pitch);tv.set(-Math.sin(P.yaw)*cp,sp,-Math.cos(P.yaw)*cp);
  const p=target.clone().addScaledVector(tv,-dist);p.y+=0.35;const c=HS.clampXZ(p.x,p.z,0.15);p.x=c[0];p.z=c[1];const f=HS.floorAt(p.x,p.z,0);if(p.y<f+0.3)p.y=f+0.3;{const cl=W.def.env.ceilAt?W.def.env.ceilAt(p.x,p.z):W.def.env.ceil;if(cl&&p.y>cl-0.2)p.y=cl-0.2;}camFree(target,p);camera.position.copy(p);camera.lookAt(target);};

// camera that circles a target (used by the paintbrush so you can see yourself)
HS.orbitCamera=function(target,yaw,pitch,dist){const cp=Math.cos(pitch),sp=Math.sin(pitch);const p=new THREE.Vector3(target.x+Math.sin(yaw)*cp*dist,target.y-sp*dist,target.z+Math.cos(yaw)*cp*dist);
  const c=HS.clampXZ(p.x,p.z,0.15);p.x=c[0];p.z=c[1];const f=HS.floorAt(p.x,p.z,0);if(p.y<f+0.3)p.y=f+0.3;{const cl=W.def.env.ceilAt?W.def.env.ceilAt(p.x,p.z):W.def.env.ceil;if(cl&&p.y>cl-0.2)p.y=cl-0.2;}camFree(target,p);camera.position.copy(p);camera.lookAt(target);};
/* ================= input ================= */
const keys=HS.keys={};const J=HS.joy={x:0,y:0};
HS.isTouch=('ontouchstart' in window);
HS.bindInput=function(canvas,cb){
  addEventListener('keydown',e=>{keys[e.code]=true;if(e.code==='Space'){e.preventDefault();cb.onJump&&cb.onJump();}cb.onKey&&cb.onKey(e.code);});
  addEventListener('keyup',e=>{keys[e.code]=false;});
  let joyId=null,jo={x:0,y:0};const looks=new Map();const LOOK=0.0055;
  const joy=document.getElementById('joy'),knob=document.getElementById('knob');
  const look=(dx,dy)=>{P.yaw-=dx*LOOK;P.pitch=clamp(P.pitch-dy*LOOK,-1.35,1.35);};
  const brushIds=new Set();
  canvas.addEventListener('touchstart',e=>{e.preventDefault();HS.ac();HS.isTouch=true;
    for(const t of e.changedTouches){if(cb.brushing&&cb.brushing()){brushIds.add(t.identifier);cb.onBrush(t.clientX,t.clientY,true);continue;}
      if(joyId===null&&cb.canMove()&&t.clientX<innerWidth*0.45&&t.clientY>innerHeight*0.3){joyId=t.identifier;jo={x:t.clientX,y:t.clientY};if(joy){joy.style.left=jo.x+'px';joy.style.top=jo.y+'px';joy.style.display='block';knob.style.transform='';}}
      else looks.set(t.identifier,{x:t.clientX,y:t.clientY,m:0,t:performance.now()});}},{passive:false});
  canvas.addEventListener('touchmove',e=>{e.preventDefault();
    for(const t of e.changedTouches){if(brushIds.has(t.identifier)){cb.onBrush(t.clientX,t.clientY,false);continue;}
      if(t.identifier===joyId){let dx=t.clientX-jo.x,dy=t.clientY-jo.y;const d=Math.hypot(dx,dy),mx=50;if(d>mx){dx*=mx/d;dy*=mx/d;}J.x=dx/mx;J.y=dy/mx;if(knob)knob.style.transform='translate('+dx+'px,'+dy+'px)';}
      else{const l=looks.get(t.identifier);if(l){const dx=t.clientX-l.x,dy=t.clientY-l.y;l.m+=Math.abs(dx)+Math.abs(dy);l.x=t.clientX;l.y=t.clientY;look(dx*1.15,dy*1.15);}}}},{passive:false});
  const tend=e=>{e.preventDefault();for(const t of e.changedTouches){if(brushIds.delete(t.identifier))continue;if(t.identifier===joyId){joyId=null;J.x=J.y=0;if(joy)joy.style.display='none';}else{const l=looks.get(t.identifier);if(l){if(l.m<12&&performance.now()-l.t<400)cb.onTap(t.clientX,t.clientY);looks.delete(t.identifier);}}}};
  canvas.addEventListener('touchend',tend,{passive:false});canvas.addEventListener('touchcancel',tend,{passive:false});
  let drag=null;
  let brushDrag=false;
  canvas.addEventListener('mousedown',e=>{HS.ac();if(cb.brushing&&cb.brushing()){brushDrag=true;cb.onBrush(e.clientX,e.clientY,true);return;}drag={x:e.clientX,y:e.clientY,m:0};});
  addEventListener('mousemove',e=>{if(brushDrag){cb.onBrush(e.clientX,e.clientY,false);return;}if(!drag)return;const dx=e.clientX-drag.x,dy=e.clientY-drag.y;drag.m+=Math.abs(dx)+Math.abs(dy);drag.x=e.clientX;drag.y=e.clientY;look(dx,dy);});
  addEventListener('mouseup',e=>{brushDrag=false;if(drag&&drag.m<6&&e.target===canvas)cb.onTap(e.clientX,e.clientY);drag=null;});
};
HS.releaseJoy=function(){J.x=J.y=0;const j=document.getElementById('joy');if(j)j.style.display='none';};
HS.moveVec=function(dt,speed){let f=-J.y,r=J.x;if(keys.KeyW||keys.ArrowUp)f+=1;if(keys.KeyS||keys.ArrowDown)f-=1;if(keys.KeyD)r+=1;if(keys.KeyA)r-=1;if(keys.ArrowLeft)P.yaw+=2.2*dt;if(keys.ArrowRight)P.yaw-=2.2*dt;
  const l=Math.hypot(f,r);if(l>1){f/=l;r/=l;}const sp=(speed||4.3)*dt,sy=Math.sin(P.yaw),cy=Math.cos(P.yaw);return [(-sy*f+cy*r)*sp,(-cy*f-sy*r)*sp,l>0.05];};

/* ================= picking ================= */
const ray=new THREE.Raycaster();
HS.pick=function(cx_,cy_,targets){ray.setFromCamera(new THREE.Vector2(cx_/innerWidth*2-1,-(cy_/innerHeight)*2+1),camera);ray.far=24;
  const hits=ray.intersectObjects(targets,false);if(!hits.length)return {obj:null};const occ=ray.intersectObjects(W.solids,false);
  if(occ.length&&occ[0].distance<hits[0].distance-0.6)return {obj:null,blocked:true};return {obj:hits[0].object,dist:hits[0].distance};};

/* ================= paintbrush: splats on the world ================= */
const splatGeos=[0,1,2].map(()=>{const sh=new THREE.Shape();const n=18;for(let i=0;i<=n;i++){const a=i/n*Math.PI*2,r=1+(i%n===0?0:rnd(-0.22,0.18));const x=Math.cos(a)*r,y=Math.sin(a)*r;if(i===0)sh.moveTo(x,y);else sh.lineTo(x,y);}return new THREE.ShapeGeometry(sh);});
const splatMats={};
function splatMat(c){if(!splatMats[c]){const m=new THREE.MeshToonMaterial({color:c,gradientMap:GM,polygonOffset:true,polygonOffsetFactor:-2,polygonOffsetUnits:-2});splatMats[c]=m;}return splatMats[c];}
HS.splat=function(p,n,color,r){if(!W||!/^#[0-9a-f]{6}$/i.test(color))return null;W.splats=W.splats||[];color=color.toLowerCase();
  const m=new THREE.Mesh(splatGeos[(Math.random()*3)|0],splatMat(color));m.scale.setScalar(clamp(r||0.28,0.1,0.5));
  m.position.set(p[0]+n[0]*0.012,p[1]+n[1]*0.012,p[2]+n[2]*0.012);m.lookAt(p[0]+n[0],p[1]+n[1],p[2]+n[2]);m.rotateZ(Math.random()*6.28);m.receiveShadow=true;m.userData.color=color;
  W.group.add(m);W.splats.push(m);if(W.splats.length>600){const o=W.splats.shift();W.group.remove(o);}return m;};
HS.eraseSplats=function(p,rad){if(!W||!W.splats)return 0;const v=new THREE.Vector3(p[0],p[1],p[2]);let n=0;W.splats=W.splats.filter(m=>{if(m.position.distanceTo(v)<(rad||0.45)){W.group.remove(m);n++;return false;}return true;});return n;};
HS.clearSplats=function(){if(!W)return;if(W.splats){W.splats.forEach(m=>W.group.remove(m));W.splats=[];}if(W.dotMesh){W.dotMesh.count=0;W.dotN=0;W.dotColors=[];W.dotPos=[];}};
// where on the world did the brush touch? (only things within reach)
HS.pickWorld=function(cx_,cy_,reach){ray.setFromCamera(new THREE.Vector2(cx_/innerWidth*2-1,-(cy_/innerHeight)*2+1),camera);ray.far=reach||7;
  const hits=ray.intersectObjects(W.solids.concat(W.splats||[]),false);if(!hits.length||!hits[0].face)return null;const h=hits[0];const n=h.face.normal.clone().transformDirection(h.object.matrixWorld);
  if(n.dot(ray.ray.direction)>0)n.negate();return {p:[h.point.x,h.point.y,h.point.z],n:[n.x,n.y,n.z],dist:h.distance,hit:h};};
// which body part of a figure did the brush touch?
HS.pickPart=function(cx_,cy_,fig){ray.setFromCamera(new THREE.Vector2(cx_/innerWidth*2-1,-(cy_/innerHeight)*2+1),camera);ray.far=12;
  const hits=ray.intersectObject(fig.userData.inner,true);for(const h of hits)if(h.object.userData.part)return {part:h.object.userData.part,dist:h.distance,hit:h};return null;};
// the color of whatever a ray hit
HS.surfaceColor=function(h){const o=h.object;if(W&&o===W.dotMesh)return W.dotColors[h.instanceId]||null;if(o.userData.color)return o.userData.color;let m=o.material;if(Array.isArray(m))m=m[h.face?h.face.materialIndex:0]||m[0];if(!m)return null;return m.userData.camo||('#'+m.color.getHexString());};
const cA=new THREE.Color(),cB=new THREE.Color();
HS.colorNear=function(a,b){if(!a||!b)return false;cA.set(a);cB.set(b);return Math.hypot(cA.r-cB.r,cA.g-cB.g,cA.b-cB.b)<0.2;};
HS.figPoints=function(fig){const u=fig.userData.inner.userData;const h=new THREE.Vector3(),b=new THREE.Vector3();u.head.getWorldPosition(h);u.spine.getWorldPosition(b);b.y+=0.12;return [h,b];};
const rv=new THREE.Vector3();
// how many of the figure's body points can be seen from eye (0..2)
HS.canSee=function(eye,fig){let n=0;for(const p of HS.figPoints(fig)){rv.copy(p).sub(eye);const d=rv.length();rv.normalize();ray.set(eye,rv);ray.far=d;const hit=ray.intersectObjects(W.solids,false);if(!hit.length||hit[0].distance>d-0.3)n++;}return n;};
// how well does the figure blend in with what is behind it, seen from eye? (painted parts that match)
HS.camoFrom=function(eye,fig){const c=HS.figPoints(fig)[1];rv.copy(c).sub(eye);const d=rv.length();rv.normalize();ray.set(eye,rv);ray.far=d+8;
  const hits=ray.intersectObjects(W.solids.concat(W.splats||[],W.dotMesh&&W.dotMesh.count?[W.dotMesh]:[]),false);let bg=null;for(const h of hits){if(h.distance>d-0.35){bg=HS.surfaceColor(h);break;}}
  const st=fig.userData.paintState||{};let k=0;HS.PARTS.forEach(p=>{if(HS.colorNear(st[p],bg))k++;});return {bg,score:k/HS.PARTS.length,matched:k,total:HS.PARTS.length};};
// the main colors of the place (for the paint palette)
HS.surfacePalette=function(n){const cnt={};W.solids.forEach(o=>{(Array.isArray(o.material)?o.material:[o.material]).forEach(m=>{const c=m&&m.userData&&m.userData.camo;if(c)cnt[c]=(cnt[c]||0)+1;});});
  const out=[];Object.keys(cnt).sort((a,b)=>cnt[b]-cnt[a]).forEach(c=>{if(out.length<(n||14)&&!out.some(x=>HS.colorNear(x,c)))out.push(c);});return out;};
/* ---------- ✏️ line mode: thin lines made of little dots ---------- */
HS.dotCap=5000;const dotGeo=new THREE.CircleGeometry(1,8),dObj=new THREE.Object3D(),dCol=new THREE.Color(),ZV=new THREE.Vector3(0,0,1),tq=new THREE.Quaternion();
function dotMeshOf(){if(W.dotMesh)return W.dotMesh;const mat=new THREE.MeshToonMaterial({color:0xffffff,gradientMap:GM,polygonOffset:true,polygonOffsetFactor:-3,polygonOffsetUnits:-3});
  const m=new THREE.InstancedMesh(dotGeo,mat,HS.dotCap);m.setColorAt(0,dCol.set('#ffffff'));m.count=0;m.frustumCulled=false;m.receiveShadow=true;W.group.add(m);W.dotMesh=m;W.dotN=0;W.dotColors=[];W.dotPos=[];return m;}
const okC=c=>typeof c==='string'&&/^#[0-9a-f]{6}$/i.test(c);
HS.dot=function(p,n,color,r){if(!W||!okC(color))return;const m=dotMeshOf();const i=W.dotN%HS.dotCap;W.dotN++;const nv=new THREE.Vector3(n[0],n[1],n[2]).normalize();
  dObj.position.set(p[0]+nv.x*0.006,p[1]+nv.y*0.006,p[2]+nv.z*0.006);dObj.quaternion.setFromUnitVectors(ZV,nv);dObj.scale.setScalar(r||0.035);dObj.updateMatrix();
  m.setMatrixAt(i,dObj.matrix);m.setColorAt(i,dCol.set(color));m.count=Math.min(W.dotN,HS.dotCap);m.instanceMatrix.needsUpdate=true;m.instanceColor.needsUpdate=true;W.dotColors[i]=color.toLowerCase();W.dotPos[i]=[p[0],p[1],p[2]];};
HS.dotLine=function(a,b,n,color){const d=Math.hypot(b[0]-a[0],b[1]-a[1],b[2]-a[2]);if(d>1.2)return;const k=Math.max(1,Math.ceil(d/0.025));for(let i=1;i<=k;i++){const t=i/k;HS.dot([a[0]+(b[0]-a[0])*t,a[1]+(b[1]-a[1])*t,a[2]+(b[2]-a[2])*t],n,color);}if(d===0)HS.dot(a,n,color);};
HS.eraseDots=function(p,rad){if(!W||!W.dotMesh)return 0;const m=W.dotMesh;let n=0;dObj.position.set(0,-1000,0);dObj.scale.setScalar(0.0001);dObj.updateMatrix();
  for(let i=0;i<m.count;i++){const q=W.dotPos[i];if(q&&Math.hypot(q[0]-p[0],q[1]-p[1],q[2]-p[2])<rad){m.setMatrixAt(i,dObj.matrix);W.dotPos[i]=null;W.dotColors[i]=null;n++;}}if(n)m.instanceMatrix.needsUpdate=true;return n;};
// lines drawn on a body stick to that body part (they move with you)
HS.bones=function(fig){if(!fig.userData.bones){const a=[];fig.userData.inner.traverse(o=>{if(o.isGroup)a.push(o);});fig.userData.bones=a;}return fig.userData.bones;};
HS.bodyHit=function(fig,h){const bone=h.object.parent;const b=HS.bones(fig).indexOf(bone);if(b<0)return null;const lp=bone.worldToLocal(h.point.clone());
  const n=h.face.normal.clone().transformDirection(h.object.matrixWorld);bone.getWorldQuaternion(tq);n.applyQuaternion(tq.invert()).normalize();return {b,lp,ln:n,part:h.object.userData.part};};
HS.bodyDot=function(fig,b,lp,ln,color,part){const bone=HS.bones(fig)[b];if(!bone||!okC(color))return;const d=new THREE.Mesh(dotGeo,splatMat(color.toLowerCase()));const nv=new THREE.Vector3(ln[0]!=null?ln[0]:ln.x,ln[1]!=null?ln[1]:ln.y,ln[2]!=null?ln[2]:ln.z).normalize();
  d.position.set((lp.x!=null?lp.x:lp[0])+nv.x*0.004,(lp.y!=null?lp.y:lp[1])+nv.y*0.004,(lp.z!=null?lp.z:lp[2])+nv.z*0.004);d.quaternion.setFromUnitVectors(ZV,nv);d.scale.setScalar(0.026);d.userData.part=null;d.userData.dotPart=part||null;
  bone.add(d);const L=fig.userData.dots=fig.userData.dots||[];L.push(d);if(L.length>500){const o=L.shift();o.parent&&o.parent.remove(o);}};
HS.bodyLine=function(fig,b,a,z,ln,color,part){const A=new THREE.Vector3(...a),Z=new THREE.Vector3(...z);const d=A.distanceTo(Z);if(d>0.4)return;const k=Math.max(1,Math.ceil(d/0.02));for(let i=1;i<=k;i++)HS.bodyDot(fig,b,A.clone().lerp(Z,i/k),ln,color,part);if(d===0)HS.bodyDot(fig,b,A,ln,color,part);};
HS.eraseBodyDots=function(fig,b,lp,rad){const L=fig.userData.dots||[];const bone=HS.bones(fig)[b];let n=0;fig.userData.dots=L.filter(d=>{if(d.parent===bone&&d.position.distanceTo(lp)<rad){bone.remove(d);n++;return false;}return true;});return n;};
HS.clearBodyDots=function(fig,part){const L=fig.userData.dots||[];fig.userData.dots=L.filter(d=>{if(!part||d.userData.dotPart===part){d.parent&&d.parent.remove(d);return false;}return true;});};
// the paintbrush color strip
HS.makeBrushUI=function(el,o){
  let color=null,mode='splash';const api={get color(){return color;},get mode(){return mode;}};
  api.build=function(cols){color=cols[0];
    el.innerHTML='<div class="bwrap"><button class="btn bmode" data-m="line" title="Line: thin lines">✏️</button><button class="btn bmode" data-m="splash" title="Splash: color a whole part">💦</button><button class="btn brot" data-r="1">↺</button><div class="bcols">'+cols.map(c=>'<span class="sw" data-c="'+c+'" style="background:'+c+'"></span>').join('')+
      '<span class="sw er" data-c="pick" title="Copy a color">💧</span><span class="sw er" data-c="" title="Wash off">🧽</span></div><button class="btn brot" data-r="-1">↻</button><button class="btn yellow bdone">✋ Done</button></div><p class="btip"></p>';
    el.querySelectorAll('.sw').forEach(s=>s.onclick=e=>{e.stopPropagation();color=s.dataset.c||null;mark();HS.sfx.paint();});
    el.querySelectorAll('.brot').forEach(b=>{const r=+b.dataset.r;let iv=null;const go=e=>{e.preventDefault();e.stopPropagation();o.onRotate(r*0.25);clearInterval(iv);iv=setInterval(()=>o.onRotate(r*0.12),90);};const stop=()=>clearInterval(iv);
      b.addEventListener('touchstart',go,{passive:false});b.addEventListener('touchend',stop);b.addEventListener('mousedown',go);b.addEventListener('mouseup',stop);b.addEventListener('mouseleave',stop);b.onclick=e=>e.stopPropagation();});
    el.querySelectorAll('.bmode').forEach(b=>b.onclick=e=>{e.stopPropagation();mode=b.dataset.m;mark();HS.sfx.paint();});
    el.querySelector('.bdone').onclick=e=>{e.stopPropagation();o.onDone();};mark();};
  function mark(){el.querySelectorAll('.sw').forEach(s=>s.classList.toggle('sel',(s.dataset.c||null)===color));el.querySelectorAll('.bmode').forEach(b=>b.classList.toggle('sel',b.dataset.m===mode));
    const t=el.querySelector('.btip');if(t)t.innerHTML=mode==='line'?'✏️ <b>Line</b>: drag to draw thin lines on yourself or the walls (try drawing bricks!)':'💦 <b>Splash</b>: tap a body part to color all of it, or splash the walls/ground. 💧 copies a color.';}
  api.setColor=function(c){if(!el.querySelector('.sw[data-c="'+c+'"]')){const sp=document.createElement('span');sp.className='sw';sp.dataset.c=c;sp.style.background=c;sp.onclick=e=>{e.stopPropagation();color=c;mark();HS.sfx.paint();};el.querySelector('.bcols').prepend(sp);}color=c;mark();};
  return api;};
let lastB={t:0,x:0,y:0},lastL=null,lastSnd=0;
const snd=()=>{const n=performance.now();if(n-lastSnd>110){lastSnd=n;HS.sfx.brush();}};
HS.brushAt=function(x,y,start,fig,color,cb,mode){cb=cb||{};const now=performance.now();
  if(color==='pick'){if(!start)return;const w=HS.pickWorld(x,y,12);if(w){const c=HS.surfaceColor(w.hit);if(c){HS.sfx.paint();cb.picked&&cb.picked(c);}}return;}
  if(mode==='line'){if(start)lastL=null;
    const part=fig&&fig.visible?HS.pickPart(x,y,fig):null;const w=HS.pickWorld(x,y,7);
    if(part&&(!w||part.dist<=w.dist+0.05)){const bh=HS.bodyHit(fig,part.hit);if(!bh){lastL=null;return;}
      if(!color){if(HS.eraseBodyDots(fig,bh.b,bh.lp,0.08)){snd();cb.bodyErase&&cb.bodyErase(bh.b,bh.lp);}lastL=null;return;}
      const from=(lastL&&lastL.kind==='b'&&lastL.b===bh.b&&lastL.lp.distanceTo(bh.lp)<0.4)?lastL.lp:bh.lp;
      HS.bodyLine(fig,bh.b,from.toArray(),bh.lp.toArray(),bh.ln,color,bh.part);cb.bodyLine&&cb.bodyLine(bh.b,from.toArray(),bh.lp.toArray(),bh.ln.toArray(),color,bh.part);
      lastL={kind:'b',b:bh.b,lp:bh.lp};snd();return;}
    if(!w){lastL=null;if(start)HS.sfx.miss();return;}
    if(!color){if(HS.eraseDots(w.p,0.18)){snd();cb.lineErase&&cb.lineErase(w.p);}lastL=null;return;}
    const p=new THREE.Vector3(...w.p),n=new THREE.Vector3(...w.n);
    const join=lastL&&lastL.kind==='w'&&lastL.obj===w.hit.object&&lastL.p.distanceTo(p)<1.0&&lastL.n.dot(n)>0.9;
    const a=join?lastL.p.toArray():w.p;HS.dotLine(a,w.p,w.n,color);cb.line&&cb.line(a,w.p,w.n,color);
    lastL={kind:'w',obj:w.hit.object,p,n};snd();return;}
  // 💦 splash mode
  if(!start&&(now-lastB.t<55||Math.hypot(x-lastB.x,y-lastB.y)<12))return;lastB={t:now,x,y};
  const part=fig&&fig.visible?HS.pickPart(x,y,fig):null;const w=HS.pickWorld(x,y,7);
  if(part&&(!w||part.dist<=w.dist+0.05)){if((fig.userData.paintState[part.part]||null)!==(color||null)||(fig.userData.dots||[]).some(d=>d.userData.dotPart===part.part)){HS.paintPart(fig,part.part,color);HS.clearBodyDots(fig,part.part);HS.sfx.brush();cb.part&&cb.part(part.part,color);}return;}
  if(!w){if(start)HS.sfx.miss();return;}
  if(color){const r=rnd(0.22,0.32);HS.splat(w.p,w.n,color,r);if(start||Math.random()<0.4)HS.sfx.brush();cb.splat&&cb.splat(w.p,w.n,color,r);}
  else{const k=HS.eraseSplats(w.p,0.5)+HS.eraseDots(w.p,0.5);if(k){HS.sfx.brush();cb.erase&&cb.erase(w.p);}}};
HS.fmt=function(s){s=Math.max(0,Math.ceil(s));return Math.floor(s/60)+':'+String(s%60).padStart(2,'0');};
})();
