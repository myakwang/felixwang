/* Felix's Hide & Seek — maps */
(function(){
'use strict';
const PI=Math.PI;
function inst(B,list,w,h,d,mat){const geo=new THREE.BoxGeometry(w,h,d);const m=new THREE.InstancedMesh(geo,mat.isMaterial?mat:HS.mat(mat),list.length);const o=new THREE.Object3D();
  list.forEach((p,i)=>{o.position.set(p[0],p[1],p[2]);o.rotation.set(0,p[3]||0,0);o.updateMatrix();m.setMatrixAt(i,o.matrix);});m.castShadow=true;m.receiveShadow=true;B.W.group.add(m);return m;}
function windowZ(B,x,y,z,w,h){const s=z>0?-1:1;B.basic(w,h,x,y,z+0.01*s,HS.tex.windowSky(),{ry:z>0?PI:0});const c='#ffffff',o={col:false};
  B.box(w+0.24,0.12,0.12,x,y+h/2,z,c,o);B.box(w+0.24,0.12,0.12,x,y-h/2,z,c,o);B.box(0.12,h,0.12,x-w/2,y,z,c,o);B.box(0.12,h,0.12,x+w/2,y,z,c,o);B.box(0.06,h,0.08,x,y,z,c,o);B.box(w,0.06,0.08,x,y,z,c,o);B.box(w+0.4,0.08,0.3,x,y-h/2-0.05,z+0.12*s,c,o);}
function windowX(B,x,y,z,w,h){const s=x>0?-1:1;B.basic(w,h,x+0.01*s,y,z,HS.tex.windowSky(),{ry:x>0?-PI/2:PI/2});const c='#ffffff',o={col:false};
  B.box(0.12,0.12,w+0.24,x,y+h/2,z,c,o);B.box(0.12,0.12,w+0.24,x,y-h/2,z,c,o);B.box(0.12,h,0.12,x,y,z-w/2,c,o);B.box(0.12,h,0.12,x,y,z+w/2,c,o);B.box(0.08,h,0.06,x,y,z,c,o);B.box(0.08,0.06,w,x,y,z,c,o);}

/* =============== 1. FELIX'S HOUSE (from the drawings) =============== */
HS.defineMap({
  id:'house',name:"Felix's House",emoji:'🏠',desc:'Made from Felix\'s drawings',
  bounds:{x0:-10,x1:10,z0:-8,z1:8},
  env:{bg:'#f3e9d8',sky:false,sun:0.38,sunPos:[6,14,14],hemi:0.42,amb:0.16,shadowExt:14,ceil:7},
  spawn:{seek:[-6.5,-5.2,0,0],hide:[-3,-3,0,4],seeker:[1.45,1.35,2.5,2],home:[-9,-7.2,0.9,0],dog:[-5,1]},
  build(B){
    const WL='#cfe6f2',WP='#f8dcc0';
    B.plane(20,16,0,0,0,HS.mat('#ffffff',{map:HS.tex.wood('#c99a63',5,4)}),{rx:-PI/2,solid:true});
    const wp=HS.tex.wallpaper(6,2);
    B.plane(20,7,0,3.5,-8,HS.mat(WP,{map:wp}),{solid:true});B.plane(20,7,0,3.5,8,HS.mat(WP,{map:wp}),{ry:PI,solid:true});
    B.plane(16,7,-10,3.5,0,HS.mat(WL,{map:wp}),{ry:PI/2,solid:true});B.plane(16,7,10,3.5,0,HS.mat(WL,{map:wp}),{ry:-PI/2,solid:true});
    B.plane(20,16,0,7,0,'#fbf8f1',{rx:PI/2,solid:true});
    const bb={col:false,cast:false};B.box(20,0.25,0.06,0,0.125,-7.97,'#ffffff',bb);B.box(20,0.25,0.06,0,0.125,7.97,'#ffffff',bb);B.box(0.06,0.25,16,-9.97,0.125,0,'#ffffff',bb);B.box(0.06,0.25,16,9.97,0.125,0,'#ffffff',bb);
    windowZ(B,3.5,2.6,7.97,2.6,2.0);windowZ(B,-8.2,3.4,-7.97,1.8,1.8);windowX(B,9.97,5.4,-2,2.4,1.4);
    B.basic(3.2,1.06,-4.6,3.4,-7.96,HS.tex.sign("Felix's House",'✏️ drawn by Felix'));
    // picture on left wall
    B.box(0.06,1.0,1.4,-9.95,2.7,-4.5,'#d4a017',{col:false});B.basic(1.2,0.8,-9.91,2.7,-4.5,HS.tex.tv(),{ry:PI/2});
    // tall door (drawing 1)
    B.plane(1.5,3.4,-9.97,1.7,0.55,'#2c2c35',{ry:PI/2});
    B.box(0.12,0.15,1.8,-9.94,3.47,0.55,'#ffffff',{col:false});B.box(0.12,3.4,0.12,-9.94,1.7,-0.25,'#ffffff',{col:false});B.box(0.12,3.4,0.12,-9.94,1.7,1.35,'#ffffff',{col:false});
    const ang=65*PI/180,dx=Math.sin(ang),dz=Math.cos(ang),hx=-10,hz=-0.2;
    const slab=B.box(1.5,3.4,0.1,hx+dx*0.75,1.7,hz+dz*0.75,'#a8683a',{ry:-(PI/2-ang)});
    B.box(1.1,1.2,0.13,0,0.8,0,'#b97a4a',{parent:slab,solid:false});B.box(1.1,1.2,0.13,0,-0.75,0,'#b97a4a',{parent:slab,solid:false});
    B.ball(0.06,0.6,-0.1,0.1,'#f1c40f',{parent:slab,solid:false});B.ball(0.06,0.6,-0.1,-0.1,'#f1c40f',{parent:slab,solid:false});
    [0.25,0.6,0.95,1.3].forEach(t=>{const x=hx+dx*t,z=hz+dz*t;B.col(x-0.17,x+0.17,z-0.17,z+0.17,3.4);});
    // globe pedestal (drawing 1)
    B.box(1.2,1.3,1.2,-8.6,0.65,6.0,'#f2efe8');B.box(1.4,0.1,1.4,-8.6,1.35,6,'#e3ddd0',{col:false});
    B.cyl(0.06,0.14,0.3,-8.6,1.55,6,'#d4a017',{col:false});B.ball(0.42,-8.6,2.05,6.0,HS.mat('#ffffff',{map:HS.tex.globe()}),{});
    // chandelier (both drawings)
    B.cyl(0.03,0.03,1.4,0,6.3,0,'#d4a017',{col:false,edges:false});B.cyl(0.4,0.3,0.12,0,6.95,0,'#d4a017',{col:false});
    B.box(3.4,0.08,0.08,0,5.6,0,'#d4a017',{col:false});
    const bulb=HS.mat('#fff4c4',{emissive:'#ffdf80'});
    for(let i=0;i<6;i++){const x=-1.5+i*0.6;B.cyl(0.012,0.012,0.52,x,5.34,0,'#333333',{col:false,edges:false,cast:false});B.ball(0.12,x,4.97,0,bulb,{sy:1.35,cast:false,col:false});}
    B.light(0xffe6b0,0.55,18,0,4.6,0);
    // zigzag stairs (drawing 2) + banister
    const run=6.5/12;B.steps({x0:0,z0:-8,z1:-6.2,n:12,run,rise:0.3,top:'#c8925a',side:'#f3ede2'});
    for(let i=0;i<12;i++){const x=i*run+run/2,top=(i+1)*0.3;B.box(0.05,1.0,0.05,x,top+0.5,-6.25,'#ffffff',{col:false});B.col(i*run,(i+1)*run,-6.32,-6.2,top+1.0);}
    B.box(7.32,0.09,0.09,3.25,1.45+1.5,-6.25,'#8a5a32',{rz:Math.atan2(3.3,6.5),col:false});
    // loft at top of the stairs
    const lw=HS.mat('#ffffff',{map:HS.tex.wood('#c99a63',2,4)});
    B.box(3.5,3.6,10,8.25,1.8,-3,['#f3ede2','#f3ede2',lw,'#f3ede2','#f3ede2','#f3ede2']);
    B.box(0.09,0.09,8.2,6.55,4.6,-2.1,'#8a5a32',{col:false});B.box(3.5,0.09,0.09,8.25,4.6,1.96,'#8a5a32',{col:false});
    for(let z=-6.2;z<=2.01;z+=0.82)B.box(0.06,1,0.06,6.55,4.1,z,'#ffffff',{col:false,solid:false});
    for(let x=7.2;x<10;x+=0.82)B.box(0.06,1,0.06,x,4.1,1.96,'#ffffff',{col:false,solid:false});
    B.col(6.45,6.65,-6.2,2.1,4.6);B.col(6.5,10,1.9,2.1,4.6);
    // bed
    [[7.9,-6.7],[9.85,-6.7],[7.9,-3.7],[9.85,-3.7]].forEach(p=>B.box(0.12,0.5,0.12,p[0],3.85,p[1],'#9a6a3f',{edges:false}));
    B.box(2.2,0.2,3.2,8.9,4.2,-5.2,'#9a6a3f');B.box(2.2,0.25,3.1,8.9,4.42,-5.2,'#ffffff');B.box(2.26,0.07,2.0,8.9,4.58,-4.6,'#5b8fd6');
    B.box(1.2,0.22,0.6,8.9,4.64,-6.35,'#ffffff');B.box(2.2,1.3,0.1,8.9,4.25,-6.85,'#9a6a3f');
    // toy box
    B.box(1.2,0.7,1.2,8.0,3.95,-1.0,'#d9473b');B.box(1.26,0.12,1.26,8.0,4.36,-1.0,'#f1c40f');B.ball(0.18,8.0,4.6,-1.0,'#3498db',{col:false});
    // the big pole (drawing 2)
    B.cyl(0.45,0.45,7,2.5,3.5,2,'#f7f4ee',{col:true});B.cyl(0.55,0.55,0.25,2.5,0.12,2,'#d4a017',{col:false});B.cyl(0.55,0.55,0.25,2.5,6.85,2,'#d4a017',{col:false});
    // TV on cabinet (drawing 2)
    B.box(4,0.9,1.2,-3,0.45,7.4,'#9a6a3f');B.box(1.8,0.6,0.05,-4,0.45,6.79,'#b07d4f',{col:false,solid:false});B.box(1.8,0.6,0.05,-2,0.45,6.79,'#b07d4f',{col:false,solid:false});
    B.ball(0.05,-3.2,0.45,6.76,'#f1c40f',{col:false,solid:false});B.ball(0.05,-2.8,0.45,6.76,'#f1c40f',{col:false,solid:false});
    B.box(2.6,1.6,0.15,-2.4,1.7,7.45,'#2b2b2b');B.basic(2.4,1.4,-2.4,1.7,7.37,HS.tex.tv(),{ry:PI});
    B.box(0.3,0.25,0.25,-1.3,2.62,7.5,'#e74c3c');
    // couch + rug
    B.plane(5,3.6,-3,0.012,5.2,HS.mat('#ffffff',{map:HS.tex.rug()}),{rx:-PI/2});
    const cc='#3fa7a0';B.box(3.6,0.45,1.1,-3,0.225,3.85,cc);B.box(3.6,0.75,0.28,-3,0.82,3.39,cc);
    B.box(0.28,0.4,1.1,-4.66,0.65,3.85,cc);B.box(0.28,0.4,1.1,-1.34,0.65,3.85,cc);
    [-4.0,-3.0,-2.0].forEach(x=>B.box(0.95,0.16,0.85,x,0.53,3.95,'#57c1b9'));
    B.box(0.5,0.5,0.15,-4.2,0.85,3.6,'#f1c40f',{rx:-0.2,col:false});
    // potted plant
    B.cyl(0.38,0.3,0.7,1.4,0.35,7.2,'#c8643b',{col:1.8});
    B.ball(0.6,1.4,1.2,7.2,'#4caf50',{col:false});B.ball(0.45,1.8,1.55,7.35,'#5cbf60',{col:false});B.ball(0.45,1.0,1.6,7.1,'#43a047',{col:false});B.ball(0.4,1.45,1.95,7.3,'#66bb6a',{col:false});
    // dark scribbled corner (drawing 1)
    const hm=t=>new THREE.MeshBasicMaterial({map:t,transparent:true,depthWrite:false});
    const h1=HS.tex.hatch(260,0.7);h1.repeat.set(3,2);const h2=HS.tex.hatch(260,0.7);h2.repeat.set(2,2);const h3=HS.tex.hatch(220,0.6);h3.repeat.set(2,3);
    B.plane(6,4.5,9.96,2.25,5,hm(h1),{ry:-PI/2,receive:false});B.plane(3.5,4.5,8.25,2.25,7.96,hm(h2),{ry:PI,receive:false});
    B.plane(3.5,6,8.25,0.014,5,hm(h3),{rx:-PI/2,receive:false});B.plane(3.5,3.6,8.25,1.8,2.012,hm(HS.tex.hatch(200,0.55)),{receive:false});
    const db=HS.tex.hatch(400,0.85);B.box(1.4,1.0,1.2,8.9,0.5,6.8,HS.mat('#5a5360',{map:db}));
  },
  spots:[
    {label:'on top of the door',pos:[-9.32,3.4,0.12],pose:'sit',yaw:2.71,look:[-7.6,-1.0],bg:'#a8683a'},
    {label:'behind the door',pos:[-9.55,0,0.65],pose:'stand',look:[-8.6,2.1],bg:'#a8683a'},
    {label:'behind the globe table',pos:[-9.45,0,7.3],pose:'crouch',look:[-7.5,7.2],bg:'#f2efe8'},
    {label:'on the chandelier',pos:[0.9,5.64,0],pose:'sit',yaw:0.3,look:[0.8,1.5],bg:'#d4a017'},
    {label:'lying on the stairs',pos:[4.06,2.4,-6.3],pose:'lie',yaw:0,look:[4.0,-5.0],bg:'#c8925a'},
    {label:'behind the big pole',pos:[3.35,0,2.7],pose:'stand',look:[4.6,3.8],bg:'#f7f4ee'},
    {label:'on top of the TV',pos:[-2.4,2.5,7.45],pose:'sit',yaw:PI,look:[-2.4,5.6],bg:'#2b2b2b'},
    {label:'next to the TV',pos:[-5.45,0,7.55],pose:'crouch',look:[-6.2,5.8],bg:'#9a6a3f'},
    {label:'behind the couch',pos:[-1.4,0,2.9],pose:'lie',yaw:PI/2,look:[-2.2,1.5],bg:'#3fa7a0'},
    {label:'in the dark corner',pos:[9.1,0,7.8],pose:'crouch',yaw:PI,look:[7.5,6.6],bg:'#3a3340'},
    {label:'under the bed',pos:[8.9,3.6,-3.3],pose:'lie',yaw:0,look:[8.6,-2.7],bg:'#9a6a3f'},
    {label:'behind the toy box',pos:[9.35,3.6,-1.0],pose:'crouch',look:[9.3,0.9],bg:'#d9473b'},
    {label:'behind the plant',pos:[2.15,0,7.55],pose:'crouch',yaw:PI,look:[2.4,5.8],bg:'#4caf50'},
    {label:'flat on the blue wall',pos:[-9.72,0,-4.5],pose:'flat',yaw:PI/2,look:[-7.6,-4.5],bg:'#cfe6f2',camo:true,camoSay:'Hmm… just a wall.'},
    {label:'flat on the peach wall',pos:[-1.5,0,-7.72],pose:'flat',yaw:0,look:[-1.5,-5.6],bg:'#f8dcc0',camo:true,camoSay:'Hmm… just a wall.'}
  ]
});

/* =============== 2. BACKYARD =============== */
HS.defineMap({
  id:'yard',name:'Backyard',emoji:'🌳',desc:'Trees, a slide, a shed and the dog house',
  bounds:{x0:-15,x1:15,z0:-12,z1:12},
  env:{bg:'#bfe3ff',sky:true,sun:0.85,sunPos:[10,20,8],hemi:0.55,amb:0.25,shadowExt:22,fog:['#d6eeff',40,110]},
  spawn:{seek:[-1,-6.5,0,0],hide:[0,0,0,5],seeker:[-1,-7,-1,-12],home:[-8.6,-8.9,0.85,0],dog:[10,6.8]},
  bounce:[-8,-2,1.55,0.78],
  build(B){
    B.plane(30,24,0,0,0,HS.mat('#ffffff',{map:HS.tex.grass(10,8)}),{rx:-PI/2,solid:true});
    B.plane(240,240,0,-0.03,0,'#6fbf4f',{rx:-PI/2});
    // house wall
    B.box(30,6.5,0.6,0,3.25,-12.3,'#f1d3a8');B.box(31,0.4,2.2,0,6.6,-11.7,'#a8423a',{col:false});B.box(31,1.2,1.4,0,7.2,-12.4,'#b54b42',{col:false,rx:-0.35});
    [-11,4,9,13].forEach(x=>{windowZ(B,x,3.3,-11.98,1.8,1.5);B.box(0.4,1.6,0.08,x-1.2,3.3,-11.95,'#2e8b57',{col:false});B.box(0.4,1.6,0.08,x+1.2,3.3,-11.95,'#2e8b57',{col:false});});
    B.box(1.4,2.6,0.1,-3,1.6,-11.95,'#3f7cc7',{col:false});B.ball(0.07,-2.5,1.5,-11.88,'#f1c40f',{col:false});
    // deck + table + umbrella + chairs
    B.box(8,0.3,3.5,-5,0.15,-10.25,HS.mat('#ffffff',{map:HS.tex.wood('#b98552',2,1)}));
    B.cyl(1,1,0.08,-5,1.1,-10.3,'#ffffff',{col:false});B.cyl(0.06,0.06,0.8,-5,0.7,-10.3,'#ffffff',{col:false});B.col(-6,-4,-11.3,-9.3,1.14);
    B.cyl(0.04,0.04,2.4,-5,1.5,-10.3,'#dddddd',{col:false,edges:false});B.cyl(0.06,1.7,0.6,-5,2.75,-10.3,'#e74c3c',{col:false,seg:8});
    B.box(0.6,0.5,0.6,-6.6,0.55,-10.3,'#ffffff');B.box(0.08,0.7,0.6,-6.9,1.15,-10.3,'#ffffff',{col:false});
    B.box(0.6,0.5,0.6,-3.4,0.55,-10.3,'#ffffff');B.box(0.08,0.7,0.6,-3.1,1.15,-10.3,'#ffffff',{col:false});
    // flower bed
    B.box(10,0.3,1,6.5,0.15,-11.4,'#8d6e63');
    const fl=[];for(let i=0;i<26;i++)fl.push([2+i*0.36,0.45+Math.random()*0.15,-11.4+(i%2?0.2:-0.2)]);
    ['#e74c3c','#f1c40f','#e84393','#9b59b6'].forEach((c,k)=>inst(B,fl.filter((_,i)=>i%4===k),0.22,0.22,0.22,c));
    // picket fence
    const pk=[];for(let x=-14.8;x<15;x+=0.5)pk.push([x,0.6,11.95]);for(let z=-11.8;z<12;z+=0.5){pk.push([-14.95,0.6,z]);pk.push([14.95,0.6,z]);}
    inst(B,pk,0.14,1.2,0.14,'#f4f1ea');
    B.box(30,0.1,0.06,0,0.45,11.95,'#f4f1ea',{col:false,edges:false});B.box(30,0.1,0.06,0,0.95,11.95,'#f4f1ea',{col:false,edges:false});
    B.box(0.06,0.1,24,-14.95,0.45,0,'#f4f1ea',{col:false,edges:false});B.box(0.06,0.1,24,-14.95,0.95,0,'#f4f1ea',{col:false,edges:false});
    B.box(0.06,0.1,24,14.95,0.45,0,'#f4f1ea',{col:false,edges:false});B.box(0.06,0.1,24,14.95,0.95,0,'#f4f1ea',{col:false,edges:false});
    // trees
    const tree=(x,z,s)=>{B.cyl(0.45*s,0.6*s,4.5*s,x,2.25*s,z,'#7a5230',{col:true});B.ball(2.0*s,x,5.4*s,z,'#4caf50',{col:false});B.ball(1.5*s,x+1.4*s,4.7*s,z+0.5*s,'#5cbf60',{col:false});B.ball(1.5*s,x-1.3*s,4.9*s,z-0.4*s,'#43a047',{col:false});B.ball(1.3*s,x+0.2*s,6.6*s,z-0.2*s,'#66bb6a',{col:false});};
    tree(8,-5,1);B.box(1.7,0.25,0.25,6.7,2.7,-5,'#7a5230',{col:false});tree(-11,7,0.85);
    // bushes
    [-4.2,-2.6,-1.0,0.6].forEach((x,i)=>{B.ball(0.95,x,0.7,10.3,['#3e8e41','#469c49'][i%2],{sy:0.9,col:1.55});});
    // shed
    const sw='#b5651d';
    B.box(4.2,3,0.15,-12.5,1.5,-6.5,sw);B.box(4.2,3,0.15,-12.5,1.5,-2.5,sw);B.box(0.15,3,4.0,-14.6,1.5,-4.5,sw);
    B.box(0.15,3,1.3,-10.4,1.5,-5.85,sw);B.box(0.15,3,1.3,-10.4,1.5,-3.15,sw);B.box(0.15,0.6,1.4,-10.4,2.7,-4.5,sw,{col:false});
    B.box(4.9,0.25,4.9,-12.5,3.12,-4.5,'#a8423a',{col:false});
    B.box(0.08,2.4,1.3,-9.85,1.2,-5.55,'#c97a35',{ry:0.9,col:false});
    B.plane(4,4,-12.5,0.012,-4.5,HS.mat('#ffffff',{map:HS.tex.wood('#a77a4a',1,1)}),{rx:-PI/2});
    B.box(0.9,0.9,0.9,-13.9,0.45,-5.8,'#c89b5a');B.box(0.7,0.7,0.7,-13.9,1.25,-5.8,'#d8ab6a');B.box(0.8,0.6,0.8,-12.9,0.3,-6.0,'#c89b5a');
    B.light(0xffe0a0,0.35,6,-12.5,2.6,-4.5);
    // playground
    B.steps({x0:1,z0:3.5,z1:4.5,n:6,run:0.333,rise:0.3,top:'#f1c40f',side:'#f39c12'});
    B.box(2,0.15,2,4,1.725,4,'#e74c3c',{col:1.8});
    [[3.08,3.08],[4.92,3.08],[3.08,4.92],[4.92,4.92]].forEach(p=>B.box(0.15,3.6,0.15,p[0],1.8,p[1],'#f1c40f',{col:false}));
    B.box(2.3,0.15,2.3,4,3.65,4,'#3498db',{col:false});B.cyl(0.05,1.5,0.7,4,4.05,4,'#3498db',{col:false,seg:4,ry:PI/4});
    B.box(2,0.08,0.08,4,2.5,3.05,'#f1c40f',{col:false});B.box(2,0.08,0.08,4,2.5,4.95,'#f1c40f',{col:false});B.col(3,5,2.9,3.05,2.8);B.col(3,5,4.95,5.1,2.8);
    B.box(4.3,0.1,0.8,7,1.0,4,'#3498db',{rz:-0.38,col:false});B.box(4.3,0.25,0.06,7,1.1,3.6,'#2c80b9',{rz:-0.38,col:false});B.box(4.3,0.25,0.06,7,1.1,4.4,'#2c80b9',{rz:-0.38,col:false});
    for(let k=0;k<8;k++){const a=5+k*0.5;B.col(a,a+0.5,3.6,4.4,1.8-(k+1)*0.2);}
    // dog house
    B.box(1.6,1.2,1.4,11.5,0.6,8.5,'#c0392b');B.box(1.05,0.1,1.6,11.1,1.48,8.5,'#7f8c8d',{rz:0.6,col:false});B.box(1.05,0.1,1.6,11.9,1.48,8.5,'#7f8c8d',{rz:-0.6,col:false});
    B.plane(0.6,0.7,11.5,0.4,7.78,'#2b1d14',{ry:PI});B.cyl(0.18,0.14,0.1,10.6,0.05,7.3,'#3498db',{col:false});
    // sandbox
    const bw='#b98552';B.box(4,0.25,0.2,-4,0.125,2.5,bw);B.box(4,0.25,0.2,-4,0.125,5.5,bw);B.box(0.2,0.25,3,-6,0.125,4,bw);B.box(0.2,0.25,3,-2,0.125,4,bw);
    B.plane(3.8,2.8,-4,0.1,4,HS.mat('#ffffff',{map:HS.tex.sand(2,2)}),{rx:-PI/2});
    B.cyl(0.18,0.14,0.3,-3,0.25,3.2,'#e74c3c',{col:false});B.cyl(0.16,0.16,0.08,-4.8,0.14,3.3,'#3498db',{col:false});
    // trampoline
    B.cyl(1.55,1.55,0.06,-8,0.76,-2,'#2b2b2b',{col:false,edges:false});
    const ring=new THREE.Mesh(new THREE.TorusGeometry(1.65,0.09,8,40),HS.mat('#3498db'));ring.rotation.x=PI/2;ring.position.set(-8,0.78,-2);ring.castShadow=true;B.W.group.add(ring);
    [[1,1],[1,-1],[-1,1],[-1,-1]].forEach(p=>B.cyl(0.05,0.05,0.78,-8+p[0]*1.1,0.39,-2+p[1]*1.1,'#7f8c8d',{col:false,edges:false}));
    B.col(-9.6,-6.4,-3.6,-0.4,0.78);
  },
  spots:[
    {label:'under the patio table',pos:[-5,0.3,-10.3],pose:'crouch',look:[-5,-7.8],bg:'#ffffff'},
    {label:'behind the big tree',pos:[8.9,0,-4.9],pose:'stand',look:[10.3,-3.6],bg:'#7a5230'},
    {label:'up on the tree branch',pos:[6.4,2.83,-5],pose:'sit',yaw:0,look:[6.4,-3.2],bg:'#4caf50'},
    {label:'behind the little tree',pos:[-11.75,0,7.5],pose:'stand',look:[-12.6,9.4],bg:'#7a5230'},
    {label:'behind the bushes',pos:[-1.8,0,11.6],pose:'crouch',yaw:PI,look:[2.4,11.4],bg:'#3e8e41'},
    {label:'inside the shed',pos:[-13.9,0,-3.1],pose:'crouch',look:[-12.0,-4.5],bg:'#b5651d'},
    {label:'on top of the slide',pos:[4.3,1.8,4.3],pose:'crouch',look:[2.2,5.8],bg:'#e74c3c'},
    {label:'under the slide tower',pos:[4,0,4],pose:'crouch',yaw:-PI/2,look:[4,6.4],bg:'#f1c40f'},
    {label:'behind the dog house',pos:[11.5,0,9.75],pose:'crouch',look:[9.5,9.8],bg:'#c0392b'},
    {label:'buried in the sandbox',pos:[-2.6,0.1,4.6],pose:'lie',yaw:PI/2,look:[-4,1.6],bg:'#ecd59b',camo:true,camoSay:'Just sand…'},
    {label:'flat on the fence',pos:[-14.72,0,4],pose:'flat',yaw:PI/2,look:[-12.6,4],bg:'#f4f1ea',camo:true,camoSay:'Just a fence.'},
    {label:'lying in the grass',pos:[5,0.02,-0.3],pose:'lie',yaw:PI/2,look:[4,-2.2],bg:'#69b84a',camo:true,camoSay:'Just grass…'},
    {label:'under the trampoline',pos:[-7.2,0,-2],pose:'lie',yaw:PI/2,look:[-8,0.6],bg:'#2b2b2b'}
  ]
});

/* =============== 3. CASTLE =============== */
HS.defineMap({
  id:'castle',name:'Castle',emoji:'🏰',desc:'Throne, statues, cannon and castle walls',
  bounds:{x0:-14,x1:14,z0:-12,z1:12},
  env:{bg:'#bfe3ff',sky:true,sun:0.85,sunPos:[-8,20,10],hemi:0.5,amb:0.25,shadowExt:22,fog:['#d6eeff',45,120]},
  spawn:{seek:[0,-6,0,4],hide:[0,2,0,6],seeker:[0,-6.3,0,-9],home:[-7,-6.6,0.9,0],dog:[-8,0]},
  build(B){
    const stoneT=HS.tex.stone('#b3aca2',8,7);
    B.plane(28,24,0,0,0,HS.mat('#ffffff',{map:stoneT}),{rx:-PI/2,solid:true});
    B.plane(240,240,0,-0.03,0,'#6fbf4f',{rx:-PI/2});
    const wallM=HS.mat('#ffffff',{map:HS.tex.stone('#9f988e',6,2)});
    B.box(30,6,1,0,3,-12.5,wallM);B.box(30,6,1,0,3,12.5,wallM);B.box(1,6,26,-14.5,3,0,wallM);B.box(1,6,26,14.5,3,0,wallM);
    const mer=[];for(let x=-14;x<=14;x+=1.6){mer.push([x,6.4,-12.6]);mer.push([x,6.4,12.6]);}for(let z=-12;z<=12;z+=1.6){mer.push([-14.6,6.4,z]);mer.push([14.6,6.4,z]);}
    inst(B,mer,0.8,0.8,0.8,wallM);
    [[-14,-12],[14,-12],[-14,12],[14,12]].forEach(p=>{B.cyl(2,2,9,p[0],4.5,p[1],wallM,{col:false});B.cyl(0.05,2.5,2.6,p[0],10.3,p[1],'#3a5fa8',{col:false,seg:16});B.cyl(0.03,0.03,1.4,p[0],12.2,p[1],'#555',{col:false,edges:false});B.box(0.05,0.5,0.8,p[0],12.6,p[1]+0.4,'#e74c3c',{col:false});});
    // walkway along the back wall
    const topM=HS.mat('#ffffff',{map:HS.tex.stone('#b3aca2',8,1)});
    B.box(28,3,2.5,0,1.5,-10.75,[wallM,wallM,topM,wallM,wallM,wallM]);
    for(let x=-13.2;x<=13.3;x+=1.6){if(x>-7.5&&x<-5.1)continue;B.box(0.8,0.8,0.3,x,3.4,-9.65,wallM);}
    B.steps({x0:-12,z0:-9.5,z1:-8.0,n:10,run:0.6,rise:0.3,top:'#b3aca2',side:'#9f988e'});
    // throne
    B.plane(2.2,16,0,0.016,1,HS.mat('#ffffff',{map:HS.tex.carpet()}),{rx:-PI/2});
    B.box(4,0.4,2.5,0,0.2,-8.25,'#8b1e2b');
    B.box(1.2,0.8,1.0,0,0.8,-8.8,'#d4a017');B.box(1.2,2.2,0.25,0,1.5,-9.35,'#d4a017');B.box(1.0,0.12,0.8,0,1.26,-8.75,'#c0392b',{col:false});
    B.box(0.15,0.4,0.9,-0.62,1.4,-8.8,'#d4a017',{col:false});B.box(0.15,0.4,0.9,0.62,1.4,-8.8,'#d4a017',{col:false});
    B.ball(0.12,-0.5,2.7,-9.35,'#e74c3c',{col:false});B.ball(0.12,0.5,2.7,-9.35,'#3498db',{col:false});B.ball(0.15,0,2.8,-9.35,'#2ecc71',{col:false});
    const fm=HS.mat('#ffffff',{map:HS.tex.flag('#3a5fa8','#f1c40f')});
    [-6,6].forEach(x=>B.box(1.6,2.4,0.05,x,4.7,-11.97,fm,{col:false}));
    // statues
    [-5,-2,1,4,7].forEach(z=>{B.box(1.1,0.5,1.1,12.4,0.25,z,'#8f8a82',{col:2.4});
      if(z!==1){const f=HS.makeFigure({helmet:true});HS.paint(f,'#9a9a9a');HS.placeFigure(f,{pos:[12.4,0.5,z],pose:'flat',yaw:-PI/2});f.traverse(o=>{if(o.isMesh)o.castShadow=true;});B.addFx(f);
        const sw=new THREE.Mesh(new THREE.BoxGeometry(0.06,1.1,0.12),HS.mat('#bdc3c7'));sw.position.set(0,-0.6,0.05);f.userData.inner.userData.aR.add(sw);}});
    // barrels
    [[-12.2,2.4],[-11.3,2.6],[-11.8,3.4],[-10.9,3.5],[-12.3,4.25]].forEach(p=>{B.cyl(0.45,0.42,1.1,p[0],0.55,p[1],'#8b5a2b',{col:true});B.cyl(0.47,0.47,0.07,p[0],0.25,p[1],'#555555',{col:false,edges:false});B.cyl(0.47,0.47,0.07,p[0],0.85,p[1],'#555555',{col:false,edges:false});});
    // banner
    B.cyl(0.03,0.03,1.9,-13.45,4.0,-3,'#d4a017',{rx:PI/2,col:false,edges:false});
    B.box(0.05,3.4,1.6,-13.45,2.25,-3,HS.mat('#ffffff',{map:HS.tex.flag('#b22222','#f1c40f')}));
    // treasure chest
    B.box(2,1.0,1.3,8.5,0.5,8.5,'#8b5a2b');B.box(2.05,0.35,1.35,8.5,1.15,8.5,'#7a4a24');
    [7.8,9.2].forEach(x=>B.box(0.12,1.36,1.38,x,0.68,8.5,'#d4a017',{col:false}));B.box(0.25,0.3,0.06,8.5,0.95,7.82,'#d4a017',{col:false});
    // well
    for(let k=0;k<8;k++){const a=k*PI/4;B.box(0.95,1.0,0.3,4+Math.cos(a)*1.05,0.5,3+Math.sin(a)*1.05,wallM,{ry:-a+PI/2,col:false});}
    B.col(2.8,5.2,1.8,4.2,1.0);B.cyl(0.9,0.9,0.05,4,0.35,3,'#3b7dd8',{col:false,edges:false});
    B.box(0.15,2.5,0.15,2.85,1.25,3,'#7a4a24',{col:false});B.box(0.15,2.5,0.15,5.15,1.25,3,'#7a4a24',{col:false});
    B.box(1.5,0.1,1.7,3.35,2.75,3,'#a8423a',{rz:0.45,col:false});B.box(1.5,0.1,1.7,4.65,2.75,3,'#a8423a',{rz:-0.45,col:false});
    B.cyl(0.03,0.03,2.4,4,2.3,3,'#555',{rz:PI/2,col:false,edges:false});
    // haystack
    const hayM=HS.mat('#ffffff',{map:HS.tex.hay()});
    B.ball(1.5,-6,0.9,8,hayM,{sy:0.75,col:1.9});B.box(1,0.6,0.7,-3.8,0.3,9.6,hayM);B.box(1,0.6,0.7,-3.6,0.9,9.7,hayM,{col:false});
    // cannon
    B.cyl(0.22,0.3,1.8,9.5,0.85,-6,'#333333',{rx:PI/2-0.2,col:false});B.box(0.8,0.35,1.2,9.5,0.4,-6.2,'#7a4a24',{col:false});
    B.cyl(0.45,0.45,0.12,8.95,0.45,-6.3,'#7a4a24',{rz:PI/2,col:false});B.cyl(0.45,0.45,0.12,10.05,0.45,-6.3,'#7a4a24',{rz:PI/2,col:false});
    B.col(8.6,10.4,-7,-5,1.2);[[11,-7.2],[11.3,-7.2],[11.15,-6.95]].forEach(p=>B.ball(0.15,p[0],0.15,p[1],'#222222',{col:false}));
    // gate
    B.box(4,4.5,0.3,0,2.25,11.85,'#5a3b22',{col:false});B.box(0.08,4.5,0.32,0,2.25,11.84,'#3e2716',{col:false});
    B.box(0.9,5,1.2,-2.5,2.5,11.4,wallM);B.box(0.9,5,1.2,2.5,2.5,11.4,wallM);B.box(5.9,0.8,1.2,0,5.0,11.4,wallM,{col:false});
    // torches
    const flame=HS.mat('#ffb347',{emissive:'#ff8c1a'});
    [[-13.85,-6],[-13.85,6],[13.85,-8],[13.85,9.5]].forEach(p=>{const s=p[0]<0?1:-1;B.box(0.3,0.1,0.1,p[0]+0.15*s,3.0,p[1],'#555',{col:false,edges:false});B.cyl(0.07,0.04,0.45,p[0]+0.3*s,3.2,p[1],'#7a4a24',{col:false,edges:false});B.ball(0.12,p[0]+0.3*s,3.5,p[1],flame,{sy:1.6,outline:false,col:false,cast:false});});
    B.light(0xffa040,0.5,10,-13,3.6,0);B.light(0xffa040,0.5,10,13,3.6,1);
  },
  spots:[
    {label:'on the throne',pos:[0,1.32,-8.55],pose:'sit',yaw:0,look:[0,-5.8],bg:'#d4a017'},
    {label:'beside the throne',pos:[1.3,0.4,-9.1],pose:'crouch',yaw:-PI/2,look:[2.8,-6.4],bg:'#d4a017'},
    {label:'pretending to be a statue',pos:[12.4,0.5,1],pose:'flat',yaw:-PI/2,look:[10.6,1],bg:'#9a9a9a',camo:true,helmet:true,camoSay:'Just a statue…'},
    {label:'behind the barrels',pos:[-13.4,0,3.3],pose:'crouch',yaw:PI/2,look:[-12.0,5.6],bg:'#8b5a2b'},
    {label:'behind the banner',pos:[-13.75,0,-3],pose:'stand',yaw:PI/2,look:[-11.8,-3],bg:'#b22222'},
    {label:'behind the treasure chest',pos:[8.5,0,9.85],pose:'crouch',look:[10.6,10.2],bg:'#8b5a2b'},
    {label:'inside the well',pos:[4,0,3],pose:'crouch',yaw:PI,look:[4,5.5],bg:'#9f988e'},
    {label:'in the haystack',pos:[-6,0,10.15],pose:'crouch',yaw:PI,look:[-8.4,10.4],bg:'#e6c35c',camo:true,camoSay:'Just hay…'},
    {label:'behind the cannon',pos:[9.5,0,-7.75],pose:'crouch',yaw:0,look:[11.4,-7.6],bg:'#333333'},
    {label:'lying on the castle wall',pos:[8,3.0,-11],pose:'lie',yaw:PI/2,look:[5.8,-10.6],bg:'#9f988e'},
    {label:'in the wall corner',pos:[-13.3,3.0,-11.4],pose:'crouch',look:[-11.4,-10.6],bg:'#9f988e'},
    {label:'flat on the stone wall',pos:[6,0,11.72],pose:'flat',yaw:PI,look:[6,9.6],bg:'#9f988e',camo:true,camoSay:'Just a wall…'}
  ]
});


/* =============== extra textures for the new places =============== */
function cvs(w,h){const c=document.createElement('canvas');c.width=w;c.height=h;return [c,c.getContext('2d')];}
function tx(c,rx,ry,base){const t=new THREE.CanvasTexture(c);t.userData=t.userData||{};if(base)t.userData.base=base;t.wrapS=t.wrapT=THREE.RepeatWrapping;t.repeat.set(rx||1,ry||1);t.anisotropy=4;return t;}
function snowTex(rx,ry){const [c,g]=cvs(128,128);g.fillStyle='#ffffff';g.fillRect(0,0,128,128);for(let i=0;i<500;i++){g.fillStyle=['#e6f1ff','#dbe9f7','#f4f9ff'][i%3];g.beginPath();g.arc(Math.random()*128,Math.random()*128,Math.random()*2.5+0.5,0,7);g.fill();}return tx(c,rx,ry,'#ffffff');}
function iceBlockTex(){const [c,g]=cvs(128,128);g.fillStyle='#f6faff';g.fillRect(0,0,128,128);g.strokeStyle='#c9dcef';g.lineWidth=3;for(let r=0;r<4;r++){g.beginPath();g.moveTo(0,r*32);g.lineTo(128,r*32);g.stroke();for(let k=0;k<3;k++){const x=k*48+(r%2?24:0);g.beginPath();g.moveTo(x,r*32);g.lineTo(x,r*32+32);g.stroke();}}return tx(c,4,2,'#f6faff');}
function waterTex(){const [c,g]=cvs(128,128);g.fillStyle='#2f86c9';g.fillRect(0,0,128,128);g.strokeStyle='rgba(255,255,255,0.35)';g.lineWidth=2;for(let i=0;i<14;i++){const x=Math.random()*128,y=Math.random()*128;g.beginPath();g.arc(x,y,8,Math.PI*1.1,Math.PI*1.9);g.stroke();}return tx(c,60,60,'#2f86c9');}
function skullFlag(){const [c,g]=cvs(128,96);g.fillStyle='#1d1d1d';g.fillRect(0,0,128,96);g.fillStyle='#fff';g.beginPath();g.arc(64,40,18,0,7);g.fill();g.fillRect(55,52,18,10);g.fillStyle='#1d1d1d';g.beginPath();g.arc(57,38,5,0,7);g.arc(71,38,5,0,7);g.fill();
  g.strokeStyle='#fff';g.lineWidth=7;g.lineCap='round';g.beginPath();g.moveTo(34,66);g.lineTo(94,86);g.moveTo(94,66);g.lineTo(34,86);g.stroke();return tx(c);}
function tileTex(rx,ry){const [c,g]=cvs(128,128);for(let i=0;i<4;i++)for(let j=0;j<4;j++){g.fillStyle=(i+j)%2?'#f4efe2':'#dfe9f5';g.fillRect(i*32,j*32,32,32);}g.strokeStyle='rgba(0,0,0,0.08)';for(let i=0;i<=4;i++){g.beginPath();g.moveTo(i*32,0);g.lineTo(i*32,128);g.moveTo(0,i*32);g.lineTo(128,i*32);g.stroke();}return tx(c,rx,ry,'#f4efe2');}
function chalkTex(){const [c,g]=cvs(512,190);g.fillStyle='#2f5d50';g.fillRect(0,0,512,190);g.strokeStyle='rgba(255,255,255,0.85)';g.fillStyle='rgba(255,255,255,0.9)';g.lineWidth=4;g.lineCap='round';
  g.font='44px "Patrick Hand",cursive';g.fillText('Hide & Seek!',24,58);g.font='30px "Patrick Hand",cursive';g.fillText('1 + 1 = 2',30,120);g.fillText('A B C',30,165);
  const st=(x)=>{g.beginPath();g.arc(x,70,14,0,7);g.moveTo(x,84);g.lineTo(x,130);g.moveTo(x,98);g.lineTo(x-22,82);g.moveTo(x,98);g.lineTo(x+22,112);g.moveTo(x,130);g.lineTo(x-16,168);g.moveTo(x,130);g.lineTo(x+16,168);g.stroke();};
  st(330);st(400);g.beginPath();g.arc(460,60,22,0,7);g.stroke();return tx(c,1,1,'#2f5d50');}
function rugTex(){const [c,g]=cvs(256,256);const cols=['#e74c3c','#f1c40f','#2ecc71','#3498db'];for(let i=0;i<4;i++)for(let j=0;j<4;j++){g.fillStyle=cols[(i+j)%4];g.fillRect(i*64,j*64,64,64);g.fillStyle='#fff';g.font='bold 36px sans-serif';g.textAlign='center';g.fillText(String.fromCharCode(65+i+j*4),i*64+32,j*64+46);}return tx(c,1,1,'#3498db');}

/* =============== 4. SNOW VILLAGE =============== */
HS.defineMap({
  id:'snow',name:'Snow Village',emoji:'❄️',desc:'Igloo, snowmen, a frozen pond and a log cabin',
  bounds:{x0:-15,x1:15,z0:-12,z1:12},
  env:{bg:'#dbefff',sky:true,sun:0.8,sunPos:[8,18,10],hemi:0.6,amb:0.28,shadowExt:22,fog:['#e6f3ff',35,110]},
  spawn:{seek:[0,-1.5,0,6],hide:[2,0,2,6],seeker:[0,-1.5,-1,-6],home:[-10,-4.5,0.8,0],dog:[3,2]},
  build(B){
    const W_='#ffffff';
    B.plane(30,24,0,0,0,HS.mat('#ffffff',{map:snowTex(10,8)}),{rx:-Math.PI/2,solid:true});
    B.plane(240,240,0,-0.03,0,'#f3f8ff',{rx:-Math.PI/2});
    [[-24,-20,9],[22,-18,10],[-28,14,11],[26,16,9],[0,-30,12],[4,30,12]].forEach(h=>B.ball(h[2],h[0],-h[2]*0.5,h[1],'#ffffff',{col:false,solid:false,outline:false}));
    // log cabin
    const logM=HS.mat('#ffffff',{map:HS.tex.wood('#8b5a2b',2,3)});
    B.box(7,3.4,5,-9.5,1.7,-9,logM);
    B.box(7.6,0.3,3.2,-9.5,4.15,-10.25,W_,{rx:0.55,col:false});B.box(7.6,0.3,3.2,-9.5,4.15,-7.75,W_,{rx:-0.55,col:false});
    B.box(0.7,1.6,0.7,-7.6,4.7,-10.6,'#7f6a5a',{col:false});
    B.box(1.2,2.2,0.08,-9.5,1.1,-6.46,'#5a3b22',{col:false});B.ball(0.06,-9.05,1.1,-6.4,'#f1c40f',{col:false});
    [-11.6,-7.4].forEach(x=>{B.box(1.1,0.9,0.06,x,2.0,-6.46,HS.mat('#ffd27a',{emissive:'#d9861a'}),{col:false});B.box(1.25,0.1,0.12,x,1.52,-6.42,W_,{col:false});});
    // woodpile
    for(let r=0;r<3;r++)for(let k=0;k<4-r;k++)B.cyl(0.2,0.2,1.6,-4.8,0.2+r*0.36,-9.95+k*0.42+r*0.21,'#9a6a3f',{rz:Math.PI/2,col:false});
    B.col(-5.6,-4.0,-10.3,-8.4,1.2);
    // igloo
    const ig=new THREE.Mesh(new THREE.SphereGeometry(2.2,28,14,0,Math.PI*2,0,Math.PI/2),HS.mat('#ffffff',{map:iceBlockTex()}));ig.position.set(6,0,-7);ig.castShadow=ig.receiveShadow=true;B.W.group.add(ig);B.W.solids.push(ig);
    B.col(3.9,8.1,-9.1,-4.9,2.2);B.box(1.3,1.3,1.4,6,0.65,-4.4,'#f4f8ff');B.plane(0.9,0.9,6,0.5,-3.69,'#2a3550');
    // snowmen
    [-4,-1.5,3.5].forEach(x=>{const z=6;B.ball(0.62,x,0.6,z,W_,{col:2.5});B.ball(0.45,x,1.45,z,W_);B.ball(0.3,x,2.05,z,W_);
      B.cyl(0.0,0.06,0.35,x,2.05,z-0.42,'#ff8c1a',{rx:-Math.PI/2,col:false,edges:false});B.ball(0.04,x-0.1,2.12,z-0.27,'#222',{col:false,outline:false});B.ball(0.04,x+0.1,2.12,z-0.27,'#222',{col:false,outline:false});
      B.cyl(0.24,0.24,0.04,x,2.32,z,'#222',{col:false});B.cyl(0.17,0.17,0.32,x,2.5,z,'#222',{col:false});
      B.box(0.9,0.05,0.05,x-0.6,1.55,z,'#6b4226',{rz:0.4,col:false,edges:false});B.box(0.9,0.05,0.05,x+0.6,1.55,z,'#6b4226',{rz:-0.4,col:false,edges:false});
      B.cyl(0.32,0.32,0.12,x,1.75,z,['#e74c3c','#3498db','#2ecc71'][Math.abs(x|0)%3],{col:false});});
    // pine trees
    const pine=(x,z,s)=>{B.cyl(0.25,0.3,1.2,x,0.6,z,'#6b4226',{col:false});B.col(x-0.9,x+0.9,z-0.9,z+0.9,6);
      [[1.8,2.4,2.2,'#2e7d4f'],[1.4,2.0,3.6,'#358f5a'],[1.0,1.6,4.8,'#3fa267']].forEach(c=>B.cyl(0.05,c[0]*s,c[1]*s,x,c[2]*s,z,c[3],{col:false}));B.cyl(0.02,0.45*s,0.6*s,x,5.6*s,z,W_,{col:false});};
    pine(11.5,4,1);pine(12.5,9,0.9);pine(-12.5,1,1);pine(-12,8,0.9);pine(9,10.6,0.8);pine(-7.5,10.6,0.85);pine(0.5,10.9,0.8);
    // frozen pond
    B.cyl(3,3,0.06,-6,0.03,3,HS.mat('#bfe6ff'),{col:false,seg:36});B.cyl(3.15,3.15,0.04,-6,0.02,3,'#e6f4ff',{col:false,seg:36,edges:false});
    // snow pile + sled
    B.ball(1.6,11.5,0,-9,W_,{sy:0.8,col:1.3});
    B.box(0.7,0.12,1.4,9.4,0.3,-6.4,'#e74c3c',{col:0.6});B.box(0.05,0.18,1.5,9.12,0.12,-6.4,'#555',{col:false,edges:false});B.box(0.05,0.18,1.5,9.68,0.12,-6.4,'#555',{col:false,edges:false});
    // snow fort
    B.box(4,1.2,0.5,-1,0.6,-6.0,'#f4f8ff');B.box(0.5,1.2,2,-2.75,0.6,-4.75,'#f4f8ff');B.box(0.5,1.2,2,0.75,0.6,-4.75,'#f4f8ff');
    [[-2,-5.5],[-1.8,-5.3],[-2.2,-5.25]].forEach(p=>B.ball(0.14,p[0],0.14,p[1],W_,{col:false}));
    // hot cocoa stand
    B.box(0.8,1.1,2.4,11,0.55,-2,'#c0392b');B.box(0.85,0.08,2.5,11,1.14,-2,'#ffffff',{col:false});
    [[11.9,-3.1],[11.9,-0.9]].forEach(p=>B.box(0.12,2.6,0.12,p[0],1.3,p[1],'#ffffff',{col:false}));
    for(let k=0;k<5;k++)B.box(1.4,0.08,0.5,11.4,2.65,-3+k*0.5,k%2?'#ffffff':'#e74c3c',{col:false,rz:-0.25});
    B.cyl(0.08,0.07,0.16,10.9,1.26,-2.4,'#ffffff',{col:false});B.cyl(0.08,0.07,0.16,10.9,1.26,-1.7,'#3498db',{col:false});
    // lamp posts
    [[-2.5,0.5],[7.5,2]].forEach(p=>{B.cyl(0.07,0.09,3,p[0],1.5,p[1],'#333',{col:true});B.ball(0.22,p[0],3.1,p[1],HS.mat('#fff2c4',{emissive:'#ffcf66'}),{col:false,cast:false});});
    B.light(0xffd9a0,0.35,9,-2.5,3,0.5);
  },
  spots:[
    {label:'on the cabin roof',pos:[-11,3.42,-6.6],pose:'sit',yaw:0,look:[-11,-5.0],bg:'#ffffff'},
    {label:'behind the woodpile',pos:[-4.8,0,-11.15],pose:'crouch',yaw:0,look:[-3.0,-10.6],bg:'#9a6a3f'},
    {label:'in the igloo door',pos:[6,0,-3.35],pose:'crouch',yaw:0,look:[6,-1.6],bg:'#ffffff'},
    {label:'behind the igloo',pos:[6,0,-9.6],pose:'stand',look:[8.7,-10.6],bg:'#ffffff'},
    {label:'pretending to be a snowman',pos:[1,0,6],pose:'flat',yaw:Math.PI,look:[1,4.2],bg:'#ffffff',camo:true,camoSay:'Just a snowman…'},
    {label:'behind the big pine tree',pos:[12.65,0,4.5],pose:'stand',look:[13.6,6.4],bg:'#2e7d4f'},
    {label:'behind the other pine tree',pos:[-13.75,0,1.2],pose:'stand',look:[-13.6,3.2],bg:'#2e7d4f'},
    {label:'lying on the frozen pond',pos:[-5,0.06,2.6],pose:'lie',yaw:Math.PI/2,look:[-3.2,1.0],bg:'#bfe6ff',camo:true,camoSay:'Just ice…'},
    {label:'behind the snow pile',pos:[14.6,0,-10.4],pose:'lie',yaw:Math.PI/2,look:[14.2,-6.8],bg:'#ffffff'},
    {label:'inside the snow fort',pos:[-1,0,-5.2],pose:'crouch',yaw:0,look:[-1,-2.4],bg:'#f4f8ff'},
    {label:'behind the cocoa stand',pos:[11.85,0,-2],pose:'crouch',yaw:-Math.PI/2,look:[13.4,-0.3],bg:'#c0392b'},
    {label:'flat on the cabin wall',pos:[-12.3,0,-6.28],pose:'flat',yaw:0,look:[-12.3,-4.2],bg:'#8b5a2b',camo:true,camoSay:'Just logs…'}
  ]
});

/* =============== 5. PIRATE SHIP =============== */
HS.defineMap({
  id:'ship',name:'Pirate Ship',emoji:'🏴‍☠️',desc:'Crow\'s nest, cannons, barrels and treasure',
  bounds:{x0:-5.5,x1:5.5,z0:-15,z1:15},
  env:{bg:'#bfe3ff',sky:true,sun:0.85,sunPos:[10,20,6],hemi:0.55,amb:0.25,shadowExt:20,fog:['#d6eeff',60,160]},
  spawn:{seek:[0,-13.5,0,0],hide:[0,-2,0,6],seeker:[0,-13,0,-15],home:[-3,-14.3,0.85,0],dog:[1.5,-3]},
  build(B){
    const deckM=HS.mat('#ffffff',{map:HS.tex.wood('#b07a45',3,8)});
    B.plane(11,30,0,0,0,deckM,{rx:-Math.PI/2,solid:true});
    B.plane(400,400,0,-1.6,0,HS.mat('#ffffff',{map:waterTex()}),{rx:-Math.PI/2});
    [[-60,-40,14],[70,30,18],[-50,70,12]].forEach(h=>{B.ball(h[2],h[0],-h[2]*0.6,h[1],'#e8d39a',{col:false,solid:false,outline:false});B.ball(h[2]*0.7,h[0],h[2]*0.1,h[1],'#4caf50',{col:false,solid:false,outline:false});});
    const hull='#7a4a24',dark='#5a3b22';
    B.box(0.5,3.2,30,-6.0,-0.4,0,hull,{col:false});B.box(0.5,3.2,30,6.0,-0.4,0,hull,{col:false});
    B.box(12.5,3.2,0.5,0,-0.4,15.25,hull,{col:false});
    B.box(0.25,0.25,30,-5.85,1.1,0,dark,{col:false});B.box(0.25,0.25,30,5.85,1.1,0,dark,{col:false});
    B.box(7.2,3.2,0.5,-2.9,-0.4,-17,hull,{ry:-0.55,col:false});B.box(7.2,3.2,0.5,2.9,-0.4,-17,hull,{ry:0.55,col:false});
    B.plane(11,4.5,0,0.0,-15.6,deckM,{rx:-Math.PI/2});
    B.cyl(0.15,0.25,6,0,1.6,-20.5,dark,{rx:Math.PI/2-0.3,col:false});
    const bal=[];for(let z=-14.5;z<15;z+=0.8){bal.push([-5.85,0.6,z]);bal.push([5.85,0.6,z]);}const im=new THREE.InstancedMesh(new THREE.BoxGeometry(0.1,0.9,0.1),HS.mat(dark),bal.length);const o=new THREE.Object3D();bal.forEach((p,i)=>{o.position.set(...p);o.updateMatrix();im.setMatrixAt(i,o.matrix);});B.W.group.add(im);
    // quarterdeck + stairs + cabin door
    B.box(11,2.0,6,0,1.0,12,[hull,hull,deckM,hull,hull,hull]);
    B.box(1.2,1.8,0.06,1.8,0.9,8.97,'#4a2f18',{col:false});B.ball(0.06,1.35,0.9,8.92,'#f1c40f',{col:false});
    [-1.5,4].forEach(x=>{const w=new THREE.Mesh(new THREE.TorusGeometry(0.3,0.06,6,16),HS.mat('#d4a017'));w.position.set(x,1.2,8.97);B.W.group.add(w);B.plane(0.55,0.55,x,1.2,8.98,HS.mat('#9fd3ff',{emissive:'#3a6a8a'}),{ry:Math.PI});});
    for(let i=0;i<7;i++){const top=(i+1)*(2/7),z=5.5+i*0.5+0.25;B.box(1.4,top,0.5,-4.3,top/2,z,[dark,dark,'#c08a55',dark,dark,dark]);}
    B.box(9.1,0.12,0.12,0.95,3.0,9.0,dark,{col:false});for(let x=-3.4;x<=5.5;x+=0.8)B.box(0.08,1.0,0.08,x,2.5,9.0,dark,{col:false,solid:false});B.col(-3.6,5.5,8.95,9.1,3.0);
    // wheel
    B.box(0.25,1.1,0.25,0,2.55,12.5,dark);
    const wh=new THREE.Mesh(new THREE.TorusGeometry(0.6,0.06,8,24),HS.mat('#a0642c'));wh.position.set(0,3.2,12.35);wh.castShadow=true;B.W.group.add(wh);B.W.solids.push(wh);
    for(let k=0;k<4;k++)B.box(1.5,0.06,0.06,0,3.2,12.35,'#a0642c',{rz:k*Math.PI/4,col:false});
    B.col(-0.4,0.4,12.2,12.8,3.6);
    // treasure chest on the quarterdeck
    B.box(1.4,0.8,0.9,3.8,2.4,13.8,'#8b5a2b');B.box(1.45,0.3,0.95,3.8,2.95,13.8,'#7a4a24');[3.3,4.3].forEach(x=>B.box(0.1,1.12,0.97,x,2.55,13.8,'#d4a017',{col:false}));
    for(let k=0;k<5;k++)B.ball(0.08,3.4+k*0.18,3.15,13.6,'#f1c40f',{col:false,outline:false});
    // masts, sails, crow's nest, flag
    const mast='#8b5a2b',sail='#f5efe0';
    B.cyl(0.32,0.38,13,0,6.5,1,mast,{col:true});B.box(8,0.2,0.2,0,5,1,dark,{col:false});B.box(6.5,0.2,0.2,0,9,1,dark,{col:false});
    B.box(7.4,3.6,0.06,0,7,1.3,sail,{col:false,cast:true});B.box(6,2.4,0.06,0,10.3,1.3,sail,{col:false});
    B.cyl(1.0,1.0,0.12,0,12,1,dark,{col:false});B.cyl(1.0,1.0,0.7,0,12.4,1,mast,{col:false,open:true});
    B.cyl(0.05,0.05,2.2,0,14,1,'#333',{col:false,edges:false});B.basic(1.3,0.95,0.7,14.6,1,skullFlag(),{});
    B.cyl(0.26,0.32,10,0,5,-8,mast,{col:true});B.box(6.5,0.2,0.2,0,4.6,-8,dark,{col:false});B.box(6,3.2,0.06,0,6.4,-7.7,sail,{col:false});
    for(let y=0.6;y<11.5;y+=0.6)B.box(0.5,0.05,0.05,0,y,1.42,'#c8a165',{col:false,edges:false});
    // cannons
    [[4.7,-11],[4.7,-4.5],[-4.7,-4.5],[4.7,3.5],[-4.7,3.5]].forEach(p=>{const s=p[0]>0?1:-1;B.box(1.0,0.5,1.4,p[0],0.25,p[1],'#6b4226',{col:1.0});B.cyl(0.18,0.24,1.6,p[0]+0.3*s,0.75,p[1],'#2b2b2b',{rz:Math.PI/2,col:false});
      [-0.45,0.45].forEach(dz=>B.cyl(0.22,0.22,0.1,p[0],0.22,p[1]+dz,'#4a2f18',{rz:Math.PI/2,col:false}));});
    // barrels + the open barrel
    [[-4.0,-2.4],[-4.2,-1.4],[-3.3,-1.9]].forEach(p=>{B.cyl(0.45,0.42,1.1,p[0],0.55,p[1],'#8b5a2b',{col:true});B.cyl(0.47,0.47,0.07,p[0],0.85,p[1],'#555',{col:false,edges:false});});
    B.cyl(0.55,0.5,1.0,3.2,0.5,-1,'#8b5a2b',{col:true,open:true});B.cyl(0.57,0.57,0.07,3.2,0.95,-1,'#555',{col:false,edges:false});B.cyl(0.5,0.5,0.04,3.2,0.1,-1,'#4a2f18',{col:false});
    // crates
    [[3.6,0.5,6.0],[3.6,0.5,7.1],[3.6,1.5,6.5]].forEach(p=>B.box(1,1,1,p[0],p[1],p[2],'#c89b5a',{col:p[1]<1?2.0:false}));
    // lifeboat
    B.box(1.4,0.6,3,-4.2,0.3,-11.5,'#3a7bd5',{col:0.9});B.box(1.1,0.1,2.6,-4.2,0.55,-11.5,'#f5efe0',{col:false});B.box(1.0,0.06,0.25,-4.2,0.62,-11.0,'#a0642c',{col:false});
    // rope coil + plank + lanterns
    for(let k=0;k<4;k++){const r=new THREE.Mesh(new THREE.TorusGeometry(0.35-k*0.02,0.06,6,18),HS.mat('#c8a165'));r.rotation.x=Math.PI/2;r.position.set(2.4,0.06+k*0.1,-9.5);B.W.group.add(r);}
    B.box(3,0.1,0.6,7.2,0.9,0,'#a0642c',{col:false});
    [[-5,14.5],[5,14.5]].forEach(p=>{B.cyl(0.05,0.05,1.2,p[0],2.6,p[1],'#333',{col:false,edges:false});B.ball(0.18,p[0],3.3,p[1],HS.mat('#ffd27a',{emissive:'#ff9f1a'}),{col:false,cast:false});});
  },
  spots:[
    {label:'up in the crow\'s nest',pos:[0.35,12.06,1.3],pose:'crouch',yaw:Math.PI,look:[0,-0.6],bg:'#8b5a2b'},
    {label:'flat on the mast',pos:[0,0,1.55],pose:'flat',yaw:0,look:[0,3.4],bg:'#8b5a2b',camo:true,camoSay:'Just the mast…'},
    {label:'lying on the deck',pos:[-2.0,0.02,-9.5],pose:'lie',yaw:Math.PI/2,look:[-2,-7.6],bg:'#b07a45',camo:true,camoSay:'Just the deck…'},
    {label:'behind a cannon',pos:[4.7,0,-5.75],pose:'crouch',yaw:0,look:[3.0,-6.6],bg:'#2b2b2b'},
    {label:'behind the barrels',pos:[-5.0,0,-0.9],pose:'crouch',yaw:Math.PI/2,look:[-3.6,0.5],bg:'#8b5a2b'},
    {label:'inside a barrel',pos:[3.2,0,-1],pose:'crouch',yaw:Math.PI,look:[3.2,0.8],bg:'#8b5a2b'},
    {label:'behind the crates',pos:[4.9,0,6.55],pose:'crouch',yaw:-Math.PI/2,look:[2.6,7.9],bg:'#c89b5a'},
    {label:'in the lifeboat',pos:[-4.2,0.25,-10.2],pose:'lie',yaw:0,look:[-2.4,-11.5],bg:'#3a7bd5'},
    {label:'behind the ship\'s wheel',pos:[0,2,13.3],pose:'crouch',yaw:Math.PI,look:[-1.6,11.4],bg:'#7a4a24'},
    {label:'behind the treasure chest',pos:[3.8,2,14.68],pose:'crouch',yaw:Math.PI,look:[2.0,13.6],bg:'#8b5a2b'},
    {label:'behind the front mast',pos:[0,0,-7.25],pose:'stand',look:[1.6,-6.2],bg:'#8b5a2b'}
  ]
});

/* =============== 6. SCHOOL =============== */
HS.defineMap({
  id:'school',name:'School',emoji:'🏫',desc:'Desks, lockers, a chalkboard and the reading corner',
  bounds:{x0:-12,x1:12,z0:-9,z1:9},
  env:{bg:'#f3e9d8',sky:false,sun:0.36,sunPos:[-10,14,8],hemi:0.44,amb:0.18,shadowExt:15,ceil:6},
  spawn:{seek:[6,-6,0,0],hide:[6,0,-6,0],seeker:[6.5,-6.5,12,-6.5],home:[2.6,8.3,0.7,0],dog:[4,-2]},
  build(B){
    B.plane(24,18,0,0,0,HS.mat('#ffffff',{map:tileTex(12,9)}),{rx:-Math.PI/2,solid:true});
    const wp=HS.tex.wallpaper(6,1);const MINT='#d7ecd9',CREAM='#fdf1c7';
    B.plane(24,6,0,3,-9,HS.mat(CREAM,{map:wp}),{solid:true});B.plane(24,6,0,3,9,HS.mat(MINT,{map:wp}),{ry:Math.PI,solid:true});
    B.plane(18,6,-12,3,0,HS.mat(MINT,{map:wp}),{ry:Math.PI/2,solid:true});B.plane(18,6,12,3,0,HS.mat(CREAM,{map:wp}),{ry:-Math.PI/2,solid:true});
    B.plane(24,18,0,6,0,'#fbf8f1',{rx:Math.PI/2,solid:true});
    for(let x=-8;x<=8;x+=8)for(let z=-5;z<=5;z+=5)B.box(2.2,0.06,0.8,x,5.97,z,HS.mat('#ffffff',{emissive:'#fff4d6'}),{col:false,cast:false});
    B.light(0xfff2d6,0.4,20,-5,5.4,0);B.light(0xfff2d6,0.4,20,6,5.4,0);
    const bb={col:false,cast:false};B.box(24,0.2,0.06,0,0.1,-8.97,'#9a6a3f',bb);B.box(24,0.2,0.06,0,0.1,8.97,'#9a6a3f',bb);B.box(0.06,0.2,18,-11.97,0.1,0,'#9a6a3f',bb);B.box(0.06,0.2,18,11.97,0.1,0,'#9a6a3f',bb);
    [-5,0,5].forEach(z=>windowX(B,-11.97,2.1,z,2.4,1.6));
    // chalkboard
    B.box(6.3,2.4,0.1,-4,2.1,-8.95,'#9a6a3f',{col:false});B.basic(6,2.2,-4,2.1,-8.89,chalkTex());B.box(6,0.08,0.18,-4,0.95,-8.85,'#9a6a3f',{col:false});
    // teacher's desk
    B.box(2.6,0.8,1.2,-4,0.4,-6.5,'#9a6a3f');B.ball(0.12,-3.3,0.92,-6.4,'#e74c3c',{col:false});B.ball(0.25,-4.7,1.15,-6.6,HS.mat('#ffffff',{map:HS.tex.globe()}),{col:false});
    B.box(0.6,0.5,0.6,-2.6,0.25,-7.6,'#555');B.box(0.6,0.7,0.08,-2.6,0.85,-7.9,'#555',{col:false});
    // student desks
    const chairs=['#e74c3c','#3498db','#2ecc71','#f1c40f'];
    [-3,0,3].forEach((z,r)=>[-8,-5.5,-3,-0.5].forEach((x,c)=>{B.box(1.1,0.06,0.75,x,0.75,z,'#e8c27a',{col:0.78});
      [[-0.48,-0.3],[0.48,-0.3],[-0.48,0.3],[0.48,0.3]].forEach(l=>B.box(0.05,0.72,0.05,x+l[0],0.36,z+l[1],'#7f8c8d',{col:false,edges:false}));
      const ch=chairs[(r+c)%4];B.box(0.5,0.06,0.5,x,0.45,z+0.6,ch,{col:0.9});B.box(0.5,0.5,0.06,x,0.7,z+0.85,ch,{col:false});}));
    // lockers
    for(let k=0;k<7;k++){const z=-8+k;B.box(0.6,2.2,0.98,11.7,1.1,z,'#4a90d9');for(let v=0;v<3;v++)B.box(0.02,0.04,0.5,11.39,1.9-v*0.1,z,'#2c5f99',{col:false,edges:false});B.box(0.03,0.2,0.05,11.39,1.1,z+0.3,'#cfd8dc',{col:false,edges:false});}
    // bookshelves
    const bk=[];[4.5,6.5].forEach(z=>{B.box(4,2.0,0.5,7,1.0,z,'#9a6a3f');for(let sh=0;sh<3;sh++)for(let i=0;i<14;i++){const h=0.3+Math.random()*0.12;[-1,1].forEach(s=>bk.push([5.2+i*0.26,0.2+sh*0.62+h/2,z+s*0.27,h]));}});
    ['#e74c3c','#3498db','#2ecc71','#f1c40f','#9b59b6'].forEach((col,k)=>{const L=bk.filter((_,i)=>i%5===k);const im=new THREE.InstancedMesh(new THREE.BoxGeometry(0.2,1,0.06),HS.mat(col),L.length);const o=new THREE.Object3D();L.forEach((p,i)=>{o.position.set(p[0],p[1],p[2]);o.scale.set(1,p[3],1);o.updateMatrix();im.setMatrixAt(i,o.matrix);});B.W.group.add(im);});
    // reading corner
    B.ball(0.7,8.6,0.42,8.1,'#e74c3c',{sy:0.6,col:0.9});B.ball(0.7,10.6,0.42,8.1,'#f1c40f',{sy:0.6,col:0.9});
    B.plane(4,3,6,0.012,-3,HS.mat('#ffffff',{map:rugTex()}),{rx:-Math.PI/2});
    // piano
    B.box(2,1.4,0.7,-9,0.7,8.65,'#222222');B.box(1.9,0.06,0.3,-9,0.85,8.15,'#ffffff',{col:false});B.box(1.2,0.5,0.4,-9,0.25,7.5,'#222222');
    // cubbies + coats
    for(let i=0;i<6;i++)for(let j=0;j<2;j++)B.box(0.95,0.55,0.55,-3.5+i,0.3+j*0.6,8.7,'#efe6cf',{col:j?false:1.2});
    for(let i=0;i<6;i++)B.box(0.5,0.8,0.15,-3.5+i,2.2,8.85,chairs[i%4],{col:false});
    // hamster cage
    B.box(1.2,0.75,0.8,3,0.375,-7.5,'#e8c27a');const cage=B.box(0.9,0.5,0.55,3,1.0,-7.5,HS.mat('#ffffff',{opacity:0.25}),{col:false,solid:false});
    B.ball(0.12,3.1,0.85,-7.45,'#f0b27a',{sx:1.3,col:false});
    // plant + trash can
    B.cyl(0.3,0.25,0.6,-11.2,0.3,-8.2,'#c8643b',{col:1.6});B.ball(0.5,-11.2,1.1,-8.2,'#4caf50',{col:false});
    B.cyl(0.25,0.22,0.6,-0.6,0.3,-8.5,'#7f8c8d',{col:true});
  },
  spots:[
    {label:'behind the teacher\'s desk',pos:[-4.4,0,-7.45],pose:'crouch',yaw:0,look:[-6.2,-7.6],bg:'#9a6a3f'},
    {label:'under a desk',pos:[-4.7,0,0],pose:'lie',yaw:Math.PI/2,look:[-6.75,1.4],bg:'#e8c27a'},
    {label:'under another desk',pos:[0.3,0,3],pose:'lie',yaw:Math.PI/2,look:[1.4,4.6],bg:'#e8c27a'},
    {label:'flat on the lockers',pos:[11.15,0,-4.5],pose:'flat',yaw:-Math.PI/2,look:[9.2,-4.5],bg:'#4a90d9',camo:true,camoSay:'Just lockers…'},
    {label:'on top of the lockers',pos:[11.7,2.2,-2.5],pose:'lie',yaw:0,look:[10.0,-3.3],bg:'#4a90d9'},
    {label:'between the bookshelves',pos:[8.5,0,5.5],pose:'crouch',yaw:-Math.PI/2,look:[4.0,5.5],bg:'#9a6a3f'},
    {label:'between the beanbags',pos:[9.6,0,8.35],pose:'crouch',yaw:Math.PI,look:[9.6,6.9],bg:'#e74c3c'},
    {label:'next to the piano',pos:[-10.6,0,8.45],pose:'crouch',yaw:Math.PI/2,look:[-10.8,6.6],bg:'#222222'},
    {label:'flat on the chalkboard',pos:[-4,0,-8.72],pose:'flat',yaw:0,look:[-4,-5.0],bg:'#2f5d50',camo:true,camoSay:'Just the chalkboard…'},
    {label:'behind the hamster table',pos:[3,0,-8.5],pose:'crouch',yaw:0,look:[4.8,-7.4],bg:'#e8c27a'}
  ]
});


/* =============== textures for the dream places =============== */
function carpetTex(base,rx,ry){const [c,g]=cvs(128,128);g.fillStyle=base;g.fillRect(0,0,128,128);for(let i=0;i<1800;i++){g.fillStyle='rgba(0,0,0,'+(Math.random()*0.08)+')';g.fillRect(Math.random()*128,Math.random()*128,2,2);}return tx(c,rx,ry);}
function bwallTex(){const [c,g]=cvs(128,128);g.fillStyle='#ffffff';g.fillRect(0,0,128,128);g.strokeStyle='rgba(120,100,20,0.18)';g.lineWidth=2;for(let x=0;x<128;x+=16){g.beginPath();g.moveTo(x,0);g.lineTo(x,128);g.stroke();}
  g.fillStyle='rgba(120,100,20,0.14)';for(let y=8;y<128;y+=32)for(let x=8;x<128;x+=16){g.beginPath();g.moveTo(x,y-5);g.lineTo(x+4,y);g.lineTo(x,y+5);g.lineTo(x-4,y);g.fill();}return tx(c,10,1);}
function frostingTex(rx,ry){const [c,g]=cvs(256,256);g.fillStyle='#ffd1e8';g.fillRect(0,0,256,256);const cols=['#e74c3c','#3498db','#f1c40f','#2ecc71','#9b59b6','#ffffff'];
  for(let i=0;i<260;i++){g.save();g.translate(Math.random()*256,Math.random()*256);g.rotate(Math.random()*6.3);g.fillStyle=cols[i%6];g.fillRect(-5,-1.5,10,3);g.restore();}return tx(c,rx,ry);}
function swirlTex(a,b){const [c,g]=cvs(128,128);g.fillStyle=a;g.fillRect(0,0,128,128);g.strokeStyle=b;g.lineWidth=10;g.beginPath();for(let t=0;t<30;t+=0.1){const r=t*2.1;g.lineTo(64+Math.cos(t)*r,64+Math.sin(t)*r);}g.stroke();return tx(c);}
function stripeTex(a,b){const [c,g]=cvs(64,64);g.fillStyle=a;g.fillRect(0,0,64,64);g.fillStyle=b;for(let k=-64;k<64;k+=16){g.beginPath();g.moveTo(k,64);g.lineTo(k+8,64);g.lineTo(k+72,0);g.lineTo(k+64,0);g.fill();}return tx(c,1,4);}
function keysTex(){const [c,g]=cvs(256,96);g.fillStyle='#d5d8dc';g.fillRect(0,0,256,96);g.fillStyle='#f4f6f7';for(let r=0;r<4;r++)for(let k=0;k<14;k++)g.fillRect(4+k*18,4+r*23,15,19);return tx(c);}
function rng(seed){return function(){seed|=0;seed=seed+0x6D2B79F5|0;let t=Math.imul(seed^seed>>>15,1|seed);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296;};}

/* =============== 7. THE BACKROOMS =============== */
HS.defineMap({
  id:'backrooms',name:'The Backrooms',emoji:'🟨',desc:'Endless yellow rooms… is anyone there?',
  bounds:{x0:-16,x1:16,z0:-16,z1:16},
  env:{bg:'#cbbd73',sky:false,sun:0.25,sunPos:[4,20,6],hemi:0.6,amb:0.3,shadowExt:20,ceil:3.2,fog:['#cfc27e',8,30],
       ceilAt:(x,z)=>(Math.abs(x)<4&&Math.abs(z)<4)?9:3.2},
  spawn:{seek:[-10,-10,0,0],hide:[0,-0.5,0,4],seeker:[10,10,10,14],home:[-3,3.4,0.8,0],dog:[-2,2]},
  build(B){
    const Y='#e3cf74',wm=HS.mat(Y,{map:bwallTex()});
    B.plane(32,32,0,0,0,HS.mat('#ffffff',{map:carpetTex('#b9a76a',10,10)}),{rx:-Math.PI/2,solid:true});
    B.plane(32,3.2,0,1.6,-16,wm,{solid:true});B.plane(32,3.2,0,1.6,16,wm,{ry:Math.PI,solid:true});B.plane(32,3.2,-16,1.6,0,wm,{ry:Math.PI/2,solid:true});B.plane(32,3.2,16,1.6,0,wm,{ry:-Math.PI/2,solid:true});
    const ceilM=HS.mat('#efe9d2');
    [[0,10,32,12],[0,-10,32,12],[-10,0,12,8],[10,0,12,8]].forEach(c=>B.plane(c[2],c[3],c[0],3.2,c[1],ceilM,{rx:Math.PI/2,solid:true}));
    B.plane(8,8,0,9,0,ceilM,{rx:Math.PI/2,solid:true});
    [[0,-4,0],[0,4,Math.PI],[-4,0,Math.PI/2],[4,0,-Math.PI/2]].forEach(w=>B.plane(8,5.8,w[0],6.1,w[1],wm,{ry:w[2]}));
    // humming ceiling lights
    const lamp=HS.mat('#ffffff',{emissive:'#fff6cf'});
    for(let x=-14;x<=14;x+=4)for(let z=-14;z<=14;z+=4){if(Math.abs(x)<4&&Math.abs(z)<4)continue;B.box(1.2,0.04,0.6,x,3.18,z,lamp,{col:false,cast:false,edges:false});}
    for(let x=-2;x<=2;x+=4)for(let z=-2;z<=2;z+=4)B.box(1.2,0.04,0.6,x,8.98,z,lamp,{col:false,cast:false,edges:false});
    B.light(0xfff2c0,0.35,14,-8,3,-8);B.light(0xfff2c0,0.35,14,8,3,8);B.light(0xfff2c0,0.35,14,8,3,-8);B.light(0xfff2c0,0.35,14,-8,3,8);B.light(0xfff2c0,0.4,16,0,7,0);
    // the maze of walls (same on every device: seeded)
    const R=rng(7),seg=(x0,z0,x1,z1)=>{const vert=x0===x1;const len=4,th=0.2;
      const piece=(a,b)=>{if(vert)B.box(th,3.2,b-a,x0,1.6,(a+b)/2,wm);else B.box(b-a,3.2,th,(a+b)/2,1.6,z0,wm);};
      const s0=vert?z0:x0;if(R()<0.35)return;piece(s0,s0+1.3);piece(s0+2.7,s0+len);};
    for(let gx=-12;gx<=12;gx+=4)for(let gz=-16;gz<16;gz+=4){if(Math.abs(gx)<=4&&gz>=-4&&gz<4){R();R();continue;}seg(gx,gz,gx,gz+4);}
    for(let gz=-12;gz<=12;gz+=4)for(let gx=-16;gx<16;gx+=4){if(Math.abs(gz)<=4&&gx>=-4&&gx<4){R();R();continue;}seg(gx,gz,gx+4,gz);}
    // pillars, a vending machine, boxes, a lonely chair, damp spots and an EXIT sign
    [[-10,-6],[10,6],[6,-10],[-6,10]].forEach(p=>B.box(1,3.2,1,p[0],1.6,p[1],wm));
    B.box(0.9,2,1.2,15.5,1,-10,'#c0392b');B.box(0.05,1.2,0.8,15.04,1.2,-10,HS.mat('#9fd3ff',{emissive:'#335577'}),{col:false});
    [[-14.4,-14.4,1.2],[-13.2,-14.6,0.9],[-14.5,-13.2,0.8],[-14.3,-14.3,0.7]].forEach((b,i)=>B.box(b[2],b[2],b[2],b[0],i===3?1.55:b[2]/2,b[1],'#c89b5a',{col:i===3?false:undefined}));
    B.box(0.6,0.08,0.6,9,0.5,-5,'#333',{col:0.9});B.box(0.6,0.6,0.08,9,0.85,-5.3,'#333',{col:false});B.cyl(0.04,0.04,0.45,9,0.25,-5,'#555',{col:false,edges:false});
    const damp=HS.mat('#8f7f45',{opacity:0.55});[[-5,6],[7,-3],[12,12],[-11,-2]].forEach(p=>B.plane(2.2,1.6,p[0],0.013,p[1],damp,{rx:-Math.PI/2}));
    B.box(1.0,0.35,0.08,0,2.7,-15.95,HS.mat('#ff4d4d',{emissive:'#cc0000'}),{col:false,edges:false});
    B.box(1.2,2.2,0.06,0,1.1,-15.96,'#a8956a',{col:false});
  },
  spots:[
    {label:'flat on the yellow wall',pos:[-10,0,15.72],pose:'flat',yaw:Math.PI,look:[-10,14],bg:'#e3cf74',camo:true,camoSay:'Just a yellow wall…'},
    {label:'flat on another yellow wall',pos:[-15.72,0,6],pose:'flat',yaw:Math.PI/2,look:[-14,6],bg:'#e3cf74',camo:true,camoSay:'Just a yellow wall…'},
    {label:'under the EXIT sign',pos:[1.4,0,-15.72],pose:'flat',yaw:0,look:[2,-14],bg:'#e3cf74',camo:true,camoSay:'Just a wall…'},
    {label:'beside the vending machine',pos:[15.55,0,-11.2],pose:'crouch',yaw:-Math.PI/2,look:[13.6,-11.5],bg:'#c0392b'},
    {label:'behind the boxes',pos:[-15.45,0,-15.45],pose:'crouch',look:[-13,-13],bg:'#c89b5a'},
    {label:'in a corner',pos:[8.6,0,8.6],pose:'crouch',look:[10,10],bg:'#e3cf74'},
    {label:'in another corner',pos:[-7.4,0,-8.6],pose:'crouch',look:[-6,-10],bg:'#e3cf74'},
    {label:'lying on the carpet',pos:[-6,0.02,10.6],pose:'lie',yaw:Math.PI/2,look:[-6,13],bg:'#b9a76a',camo:true,camoSay:'Just old carpet…'},
    {label:'behind the office chair',pos:[9,0,-5.8],pose:'crouch',yaw:0,look:[10,-7],bg:'#333333'},
    {label:'behind a pillar',pos:[-10,0,-7.05],pose:'stand',look:[-10,-9],bg:'#e3cf74'},
    {label:'up on the high ledge',pos:[3.4,5.4,3.4],pose:'crouch',look:[2,-2],bg:'#efe9d2',sky:true},
    {label:'lying on the high ledge',pos:[0.8,5.4,1.2],pose:'lie',yaw:-Math.PI/2,look:[-1,1],bg:'#efe9d2',sky:true}
  ],
  sky(B){
    [[-2.6,-2.6,0.9],[-1.2,-3.0,1.8],[0.3,-3.0,2.7],[1.7,-2.4,3.6],[2.6,-1.2,4.5]].forEach(p=>stone(B,p[0],p[1],p[2],'#efe9d2',1.1,0.15));
    island(B,0.5,3.9,0.0,3.9,5.4,'#efe9d2',null,0.3);
    B.box(0.12,2.2,0.12,1.2,6.5,3.6,'#a8956a',{col:false});B.box(0.12,2.2,0.12,2.4,6.5,3.6,'#a8956a',{col:false});B.box(1.32,0.12,0.12,1.8,7.6,3.6,'#a8956a',{col:false});
    B.plane(1.1,2.1,1.8,6.45,3.62,HS.mat('#1d1a17'),{ry:Math.PI});
  }
});

/* =============== 8. CANDY LAND =============== */
HS.defineMap({
  id:'candy',name:'Candy Land',emoji:'🍭',desc:'Lollipops, gumdrops, cupcake houses and a chocolate river',
  bounds:{x0:-15,x1:15,z0:-12,z1:12},
  env:{bg:'#ffe3f1',sky:true,sun:0.8,sunPos:[8,18,10],hemi:0.6,amb:0.28,shadowExt:22,fog:['#ffe3f1',35,110]},
  spawn:{seek:[0,-3,0,4],hide:[0,2,0,6],seeker:[0,-3.5,0,-8],home:[-6,-10.6,0.9,0],dog:[3,0.5]},
  build(B){
    B.plane(30,24,0,0,0,HS.mat('#ffffff',{map:frostingTex(8,6)}),{rx:-Math.PI/2,solid:true});
    B.plane(240,240,0,-0.03,0,'#ffc6e2',{rx:-Math.PI/2});
    [[-30,-25,10,'#c9f2c7'],[28,-22,11,'#cfe6ff'],[-26,20,9,'#ffe98a'],[30,22,12,'#ffd1e8']].forEach(h=>B.ball(h[2],h[0],-h[2]*0.5,h[1],h[3],{col:false,solid:false,outline:false}));
    // chocolate river + candy cane bridge
    B.plane(30,1.8,0,0.02,-0.3,HS.mat('#6b3a1f'),{rx:-Math.PI/2});
    for(let k=0;k<5;k++)B.box(0.25,0.12,2.4,-6+k*0.3,0.08,-0.3,k%2?'#ffffff':'#e74c3c',{col:false});
    // lollipops
    [[-9,-6,'#e74c3c'],[-11,7,'#9b59b6'],[4,-8,'#2ecc71']].forEach(l=>{B.cyl(0.12,0.12,3.5,l[0],1.75,l[1],'#ffffff',{col:false});B.col(l[0]-0.25,l[0]+0.25,l[1]-0.25,l[1]+0.25,3.5);
      B.cyl(1.3,1.3,0.3,l[0],4.6,l[1],HS.mat('#ffffff',{map:swirlTex('#ffffff',l[2])}),{rx:Math.PI/2,col:false});});
    // cupcake houses
    const cup=(x,z,f)=>{B.cyl(1.6,1.3,1.6,x,0.8,z,HS.mat('#ffffff',{map:stripeTex('#ff9ec7','#ffffff')}),{col:2.8});B.ball(1.7,x,1.6,z,f,{sy:0.7});B.ball(0.3,x,2.95,z,'#c0392b');B.plane(0.7,1.0,x,0.5,z+1.47,'#5a3b22');};
    cup(-8,4,'#fff3c4');cup(2,-6,'#bde0fe');
    // ice cream cone tower
    B.cyl(1.4,0.15,3,-3,1.5,-8,'#e0a95e',{col:3.2});B.ball(1.2,-3,3.3,-8,'#ffd1e8');B.ball(1.0,-3,4.3,-8,'#a8e6cf');B.ball(0.8,-3,5.1,-8,'#fff3c4');
    // candy canes
    [[12,-5],[-13,-2],[0,9]].forEach(p=>{B.cyl(0.18,0.18,3,p[0],1.5,p[1],HS.mat('#ffffff',{map:stripeTex('#ffffff','#e74c3c')}),{col:3});
      const h=new THREE.Mesh(new THREE.TorusGeometry(0.5,0.18,8,16,Math.PI),HS.mat('#ffffff',{map:stripeTex('#ffffff','#e74c3c')}));h.position.set(p[0]+0.5,3,p[1]);B.W.group.add(h);});
    // gumdrops
    [[-5,7,0.9,'#e74c3c'],[7,-2,0.8,'#f1c40f'],[-12,-9,1.0,'#2ecc71'],[13,9.5,0.9,'#3498db'],[-1,6.5,0.7,'#9b59b6']].forEach(g=>B.ball(g[2],g[0],0,g[1],g[3],{sy:0.8,col:g[2]*0.8}));
    // donut you can hide inside
    const dn=new THREE.Mesh(new THREE.TorusGeometry(1.15,0.45,12,28),HS.mat('#d9a066'));dn.rotation.x=Math.PI/2;dn.position.set(3,0.45,4);dn.castShadow=true;B.W.group.add(dn);B.W.solids.push(dn);
    const ic=new THREE.Mesh(new THREE.TorusGeometry(1.15,0.36,12,28,Math.PI*2),HS.mat('#ff9ec7'));ic.rotation.x=Math.PI/2;ic.position.set(3,0.62,4);ic.scale.z=0.6;B.W.group.add(ic);
    B.col(1.4,4.6,2.4,3.1,0.9);B.col(1.4,4.6,4.9,5.6,0.9);B.col(1.4,2.1,3.1,4.9,0.9);B.col(3.9,4.6,3.1,4.9,0.9);
    // gingerbread house
    B.box(3,2.5,3,-12,1.25,-8.5,'#a0612e');B.box(3.4,0.25,2.2,-12,2.95,-9.3,'#ffffff',{rx:0.6,col:false});B.box(3.4,0.25,2.2,-12,2.95,-7.7,'#ffffff',{rx:-0.6,col:false});
    B.plane(0.8,1.3,-12,0.65,-6.99,'#5a3b22');[[-12.9,-6.98],[-11.1,-6.98]].forEach(p=>B.plane(0.6,0.6,p[0],1.7,p[1],HS.mat('#fff3c4',{emissive:'#d9a066'})));
    // marshmallow steps up to the cotton candy clouds
    [[6,2,0.6],[7.2,2.6,1.2]].forEach(p=>B.box(1.1,p[2],1.1,p[0],p[2]/2,p[1],'#fff7fb'));
  },
  spots:[
    {label:'behind a cupcake house',pos:[-10.0,0,5.0],pose:'crouch',look:[-11.5,3.0],bg:'#ff9ec7'},
    {label:'behind the blue cupcake',pos:[2.9,0,-8.0],pose:'crouch',look:[4.2,-6.2],bg:'#ff9ec7'},
    {label:'inside the donut',pos:[3,0,4],pose:'crouch',yaw:Math.PI,look:[3,6.6],bg:'#d9a066'},
    {label:'behind the ice cream tower',pos:[-3,0,-9.9],pose:'crouch',yaw:Math.PI,look:[-5,-10.4],bg:'#e0a95e'},
    {label:'behind a candy cane',pos:[12.3,0,-5.5],pose:'stand',look:[13.5,-3.6],bg:'#ffffff'},
    {label:'lying on the pink frosting',pos:[-6,0.02,-3.5],pose:'lie',yaw:Math.PI/2,look:[-7.5,-2.4],bg:'#ffd1e8',camo:true,camoSay:'Just frosting…'},
    {label:'lying in the chocolate river',pos:[10,0.03,-0.3],pose:'lie',yaw:Math.PI/2,look:[9,1.6],bg:'#6b3a1f',camo:true,camoSay:'Just chocolate…'},
    {label:'flat on the gingerbread house',pos:[-10.28,0,-8.5],pose:'flat',yaw:Math.PI/2,look:[-8.4,-8.5],bg:'#a0612e',camo:true,camoSay:'Just gingerbread…'},
    {label:'behind a gumdrop',pos:[-5,0,8.3],pose:'crouch',yaw:Math.PI,look:[-6.8,9.6],bg:'#e74c3c'},
    {label:'behind the marshmallows',pos:[7.4,0,1.2],pose:'crouch',look:[8.8,0.9],bg:'#fff7fb'},
    {label:'on the cotton candy cloud',pos:[11.8,5.6,10.8],pose:'crouch',look:[10,6.4],bg:'#ffc6e2',sky:true},
    {label:'lying on the cotton candy cloud',pos:[8.3,5.6,9.2],pose:'lie',yaw:-Math.PI/2,look:[8.4,6.4],bg:'#ffc6e2',sky:true}
  ],
  sky(B){
    [[8.6,3.6,2.1,'#bde0fe'],[9.9,4.4,3.0,'#ffc6e2'],[11.0,5.6,3.9,'#bde0fe'],[10.6,7.0,4.8,'#ffc6e2']].forEach(p=>{stone(B,p[0],p[1],p[2],p[3],1.2,0.45);B.ball(0.5,p[0]+0.3,p[2]-0.15,p[1]+0.3,p[3],{col:false,outline:false,cast:false});});
    island(B,8,12.5,8,11.5,5.6,'#ffc6e2','#ffe3f1');rainbow(B,10.2,5.6,11.3,0,2.0);
    B.box(0.9,0.7,0.7,11.6,5.95,9.0,'#ff9ec7',{col:false});B.ball(0.25,11.6,6.45,9.0,'#e74c3c',{col:false});
  }
});

/* =============== 9. TINY WORLD (you are tiny in a giant bedroom) =============== */
HS.defineMap({
  id:'tiny',name:'Tiny World',emoji:'🔍',desc:'You are tiny! A giant bed, a giant desk and giant toys',
  bounds:{x0:-14,x1:14,z0:-12,z1:12},
  env:{bg:'#dfeffa',sky:false,sun:0.42,sunPos:[10,30,16],hemi:0.5,amb:0.2,shadowExt:20,ceil:13.5},
  spawn:{seek:[2,6,0,0],hide:[0,0,0,-4],seeker:[2,8,2,12],home:[-2,10.5,0.9,0],dog:[3,3]},
  build(B){
    B.plane(28,24,0,0,0,HS.mat('#ffffff',{map:HS.tex.wood('#d6a96b',2,2)}),{rx:-Math.PI/2,solid:true});
    const wm=HS.mat('#cfe3f5',{map:HS.tex.wallpaper(2,1)});
    B.plane(28,14,0,7,-12,wm,{solid:true});B.plane(28,14,0,7,12,wm,{ry:Math.PI,solid:true});B.plane(24,14,-14,7,0,wm,{ry:Math.PI/2,solid:true});B.plane(24,14,14,7,0,wm,{ry:-Math.PI/2,solid:true});
    B.plane(28,24,0,14,0,'#fbf8f1',{rx:Math.PI/2,solid:true});
    B.box(28,0.9,0.15,0,0.45,-11.93,'#ffffff');B.box(28,0.9,0.15,0,0.45,11.93,'#ffffff');B.box(0.15,0.9,24,-13.93,0.45,0,'#ffffff');B.box(0.15,0.9,24,13.93,0.45,0,'#ffffff');
    B.basic(9,7,-2,8.5,-11.97,HS.tex.windowSky(),{});B.box(9.4,0.4,0.3,-2,4.9,-11.85,'#ffffff',{col:false});
    // giant bed: walk under it, or climb the toy blocks to the top
    const bx0=-14,bx1=-5,bz0=-3,bz1=11;
    [[bx0+0.5,bz0+0.5],[bx1-0.5,bz0+0.5],[bx0+0.5,bz1-0.5],[bx1-0.5,bz1-0.5]].forEach(p=>B.box(0.8,2.6,0.8,p[0],1.3,p[1],'#9a6a3f'));
    B.box(bx1-bx0,1.4,bz1-bz0,(bx0+bx1)/2,3.3,(bz0+bz1)/2,['#6aa9e8','#6aa9e8','#6aa9e8','#4a7fc0','#6aa9e8','#6aa9e8'],{float:true});
    B.box(bx1-bx0+0.1,1.6,0.1,(bx0+bx1)/2,1.9,bz0-0.02,'#6aa9e8',{col:false});
    B.box(4,1.2,2.6,-11.5,4.6,9.2,'#ffffff',{col:false});B.box(8,4,0.4,-9.5,6,11.6,'#9a6a3f',{col:false});
    teddy(B,-8.2,4.0,8.6,'#c58b4e');B.W.cols.push({x0:-8.7,x1:-7.7,z0:8.1,z1:9.1,top:5.4,bot:4.0});
    const ABC=['#e74c3c','#3498db','#2ecc71','#f1c40f'];
    [[-3.6,2.0,1.0],[-3.6,3.4,2.0],[-4.4,4.8,3.0]].forEach((b,i)=>{for(let k=0;k<b[2];k++)B.box(1.2,1.0,1.2,b[0],k+0.5,b[1],ABC[(i+k)%4],{col:k===b[2]-1?b[2]:false});});
    // giant shoe, LEGO brick, trash can
    B.box(2.2,1.3,5,7,0.65,7,'#e74c3c');B.box(2.2,1.6,1.8,7,1.4,5.4,'#e74c3c',{col:false});B.box(2.3,0.35,5.1,7,0.18,7,'#ffffff',{col:false});
    B.box(3,1.2,1.6,-1,0.6,8.5,'#3498db');for(let i=0;i<4;i++)for(let j=0;j<2;j++)B.cyl(0.25,0.25,0.25,-2.1+i*0.75,1.32,8.1+j*0.8,'#3498db',{col:false});
    B.cyl(1.4,1.2,3.4,12,1.7,10,'#7f8c8d',{col:true});
    // giant desk (you can walk under it) and a book staircase up to the top
    const dx0=4,dx1=14,dz0=-12,dz1=-3.5;
    [[dx0+0.4,dz1-0.4],[dx1-0.4,dz1-0.4],[dx0+0.4,dz0+0.4],[dx1-0.4,dz0+0.4]].forEach(p=>B.box(0.8,5.5,0.8,p[0],2.75,p[1],'#b07d4f'));
    B.box(dx1-dx0,0.5,dz1-dz0,(dx0+dx1)/2,5.75,(dz0+dz1)/2,'#c99a63',{float:true});
    const bc=['#e74c3c','#3498db','#2ecc71','#f1c40f','#9b59b6','#e67e22'];
    for(let k=0;k<11;k++){const top=0.55*(k+1),x=-4.4+k*0.75;B.box(0.75,0.55,1.6,x,top-0.275,-4.8,bc[k%6],{col:top});if(k>0)B.box(0.75,top-0.55,1.6,x,(top-0.55)/2,-4.8,bc[(k+3)%6],{col:false});B.box(0.04,0.45,1.5,x+0.38,top-0.275,-4.8,'#ffffff',{col:false,edges:false});}
    // under the desk: the giant chair (walk under its seat)
    [[2.2,-9.5],[3.8,-9.5],[2.2,-7.9],[3.8,-7.9]].forEach(p=>B.box(0.3,3.4,0.3,p[0],1.7,p[1],'#555'));
    B.box(2.0,0.3,2.0,3,3.55,-8.7,'#e74c3c',{float:true});B.box(2.0,2.2,0.3,3,4.8,-9.55,'#e74c3c',{float:true});
  },
  spots:[
    {label:'under the giant bed',pos:[-9,0,4],pose:'lie',yaw:Math.PI/2,look:[-3.8,0],bg:'#3a3340'},
    {label:'behind the giant shoe',pos:[7,0,10.2],pose:'crouch',yaw:Math.PI,look:[9.5,10.5],bg:'#e74c3c'},
    {label:'behind the LEGO brick',pos:[-1,0,9.75],pose:'crouch',yaw:Math.PI,look:[1.4,10.4],bg:'#3498db'},
    {label:'behind the trash can',pos:[13.3,0,11.6],pose:'crouch',look:[9.8,11.3],bg:'#7f8c8d'},
    {label:'flat on the blue wall',pos:[13.72,0,3],pose:'flat',yaw:-Math.PI/2,look:[11.6,3],bg:'#cfe3f5',camo:true,camoSay:'Just a wall…'},
    {label:'under the desk',pos:[9,0,-10.8],pose:'crouch',look:[9,-7],bg:'#b07d4f'},
    {label:'behind the toy blocks',pos:[-2.6,0,1.0],pose:'crouch',look:[-1.0,2.4],bg:'#e74c3c'},
    {label:'on top of the bed, behind the pillow',pos:[-12.2,4.0,10.6],pose:'crouch',look:[-3.8,6.0],bg:'#ffffff',sky:true},
    {label:'lying on the blanket',pos:[-7,4.0,0.5],pose:'lie',yaw:-Math.PI/2,look:[-3.8,-1.0],bg:'#6aa9e8',camo:true,camoSay:'Just a blanket…',sky:true},
    {label:'on the desk, behind the mug',pos:[9.6,6.0,-9.3],pose:'crouch',yaw:Math.PI,look:[8,-1.8],bg:'#f5efe0',sky:true},
    {label:'lying on the sticky note',pos:[12.7,6.03,-5.0],pose:'lie',yaw:Math.PI/2,look:[11.6,-1.8],bg:'#ffe066',camo:true,camoSay:'Just a sticky note…',sky:true},
    {label:'behind the desk lamp',pos:[12.8,6.0,-10.9],pose:'crouch',look:[11,-1.8],bg:'#3498db',sky:true}
  ],
  sky(B){
    // things on top of the desk
    B.box(5,0.25,1.8,8,6.12,-6.0,HS.mat('#ffffff',{map:keysTex()}),{col:false});
    B.cyl(0.9,0.85,1.8,9.6,6.9,-8.0,'#f5efe0',{col:false});B.col(8.7,10.5,-8.9,-7.1,7.8,6.0);const hd=new THREE.Mesh(new THREE.TorusGeometry(0.45,0.12,8,16),HS.mat('#f5efe0'));hd.position.set(10.55,6.9,-8.0);B.W.group.add(hd);
    B.box(1.6,0.02,1.6,12.0,6.01,-5.0,'#ffe066',{col:false,edges:false});
    B.cyl(0.08,0.08,6,6.5,6.25,-10.2,'#f1c40f',{rz:Math.PI/2,col:false});B.cyl(0.0,0.08,0.4,9.7,6.25,-10.2,'#f5cba7',{rz:-Math.PI/2,col:false});
    B.cyl(0.7,0.8,0.3,12.8,6.15,-9.6,'#3498db',{col:false});B.col(12.0,13.6,-10.4,-8.8,6.3,6.0);B.cyl(0.08,0.08,3,12.8,7.6,-9.6,'#3498db',{col:false});B.cyl(0.2,0.9,0.9,12.4,9.1,-9.2,'#3498db',{rz:0.5,col:false});
    B.light(0xfff2c0,0.5,10,12.2,8.6,-9.0);
    B.box(1.6,1.0,2.2,5.2,6.5,-10.6,'#9b59b6',{float:true});
  }
});

/* =============== SKY PLACES: floating stepping stones up to a hiding place in the sky =============== */
// a floating stone/cloud you can walk under and jump onto
function stone(B,x,z,top,col,s,th){s=s||1.1;th=th||0.35;if(top-th<1.75)return B.box(s,top,s,x,top/2,z,col);return B.box(s,th,s,x,top-th/2,z,col,{float:true});}
function puffs(B,x0,x1,z0,z1,y,col){const add=(x,z)=>B.ball(0.42+Math.random()*0.12,x,y,z,col,{col:false,cast:false,outline:false});
  for(let x=x0;x<=x1+0.01;x+=0.8){add(x,z0);add(x,z1);}for(let z=z0+0.8;z<z1-0.01;z+=0.8){add(x0,z);add(x1,z);}}
function island(B,x0,x1,z0,z1,top,col,cloud,th){th=th||0.45;B.box(x1-x0,th,z1-z0,(x0+x1)/2,top-th/2,(z0+z1)/2,col,{float:true});if(cloud)puffs(B,x0,x1,z0,z1,top-0.18,cloud);}
function rainbow(B,x,y,z,ry,r){const cols=['#e74c3c','#f39c12','#f1c40f','#2ecc71','#3498db','#9b59b6'];cols.forEach((c,i)=>{const t=new THREE.Mesh(new THREE.TorusGeometry(r-i*0.18,0.09,6,32,Math.PI),HS.mat(c));t.position.set(x,y,z);t.rotation.y=ry||0;B.W.group.add(t);});}
function teddy(B,x,y,z,col){col=col||'#b07a45';B.ball(0.42,x,y+0.42,z,col,{col:false});B.ball(0.3,x,y+1.05,z,col,{col:false});B.ball(0.11,x-0.2,y+1.3,z,col,{col:false});B.ball(0.11,x+0.2,y+1.3,z,col,{col:false});B.ball(0.08,x,y+1.0,z+0.27,'#3b2a1a',{col:false,outline:false});}
const HOUSE=HS.maps.house,YARD=HS.maps.yard,CASTLE=HS.maps.castle,SNOW=HS.maps.snow,SHIP=HS.maps.ship,SCHOOL=HS.maps.school;
const BLK=['#e74c3c','#f1c40f','#3498db','#2ecc71','#9b59b6'];
HOUSE.sky=function(B){
  [[-7,-2.5,0.9],[-5.8,-3.4,1.8],[-4.4,-4.1,2.7],[-2.9,-4.6,3.6],[-1.4,-4.6,4.0]].forEach((p,i)=>stone(B,p[0],p[1],p[2],BLK[i]));
  island(B,-0.6,3.5,-5.4,-3.4,4.8,'#ffffff','#f4f8ff');teddy(B,3.0,4.8,-3.9);
  B.cyl(0.08,0.12,0.6,0.5,5.1,-5.0,'#d4a017',{col:false});B.ball(0.18,0.5,5.5,-5.0,HS.mat('#fff4c4',{emissive:'#ffdf80'}),{col:false,cast:false});
};
HOUSE.spots.push({label:'up on the cloud shelf',pos:[2.8,4.8,-4.95],pose:'crouch',look:[2,-2.4],bg:'#ffffff',sky:true},
                 {label:'lying on the cloud shelf',pos:[0.5,4.8,-4.4],pose:'lie',yaw:-Math.PI/2,look:[1.2,-2.4],bg:'#ffffff',sky:true});
YARD.sky=function(B){
  [[-8,-4.3,3.0],[-6.6,-5.0,3.9],[-5.2,-5.7,4.8]].forEach(p=>stone(B,p[0],p[1],p[2],'#ffffff',1.2,0.45));
  island(B,-4.3,-0.3,-7.6,-4.6,5.6,'#ffffff','#f4f8ff');rainbow(B,-2.3,5.6,-7.4,0,1.8);
  B.cyl(0.04,0.04,1.6,-0.8,6.4,-7.2,'#555',{col:false,edges:false});B.box(0.6,0.4,0.03,-0.5,7.0,-7.2,'#e74c3c',{col:false});
};
YARD.spots.push({label:'on the cloud (bounce up from the trampoline!)',pos:[-1.0,5.6,-5.2],pose:'crouch',look:[-2.3,-3.6],bg:'#ffffff',sky:true},
                {label:'lying on the cloud',pos:[-3.9,5.6,-6.9],pose:'lie',yaw:-Math.PI/2,look:[-3.0,-3.6],bg:'#ffffff',sky:true});
CASTLE.sky=function(B){
  [[2.0,-8.6,3.8],[3.4,-7.4,4.6],[4.8,-6.2,5.4]].forEach(p=>stone(B,p[0],p[1],p[2],'#9f988e',1.15,0.5));
  island(B,5.6,9.6,-5.4,-2.2,6.0,'#9f988e',null,0.7);
  B.cyl(0.7,0.8,1.6,9.0,6.8,-4.6,'#9f988e',{col:false});B.cyl(0.05,0.9,1.0,9.0,8.1,-4.6,'#3a5fa8',{col:false,seg:12});
  B.cyl(0.03,0.03,1.2,9.0,9.1,-4.6,'#555',{col:false,edges:false});B.box(0.05,0.4,0.7,9.0,9.5,-4.25,'#e74c3c',{col:false});
  for(let k=0;k<4;k++)B.box(0.5,0.4,0.25,5.9+k*1.1,6.2,-2.3,'#8f8a82',{col:false});
};
CASTLE.spots.push({label:'on the floating sky tower',pos:[8.1,6.0,-2.8],pose:'crouch',look:[7.5,-0.5],bg:'#9f988e',sky:true},
                  {label:'lying on the sky island',pos:[5.9,6.0,-4.6],pose:'lie',yaw:-Math.PI/2,look:[6.5,-0.5],bg:'#9f988e',sky:true});
SNOW.sky=function(B){
  [[-1,-7.3,2.1],[0.3,-8.5,3.0],[0.9,-9.9,3.9]].forEach(p=>stone(B,p[0],p[1],p[2],'#dff3ff',1.15,0.45));
  island(B,1.8,4.8,-11.6,-9.3,4.8,'#dff3ff','#ffffff');
  B.cyl(0.35,0.4,1.2,4.2,5.4,-10.9,'#cfe9ff',{col:false});B.cyl(0.02,0.45,0.7,4.2,6.35,-10.9,'#9fd3ff',{col:false});
  B.cyl(0.25,0.3,0.8,3.4,5.2,-11.1,'#cfe9ff',{col:false});B.cyl(0.02,0.32,0.5,3.4,5.85,-11.1,'#9fd3ff',{col:false});
};
SNOW.spots.push({label:'on the floating ice cloud',pos:[4.2,4.8,-10.1],pose:'crouch',look:[2.6,-8.0],bg:'#dff3ff',sky:true},
                {label:'lying on the ice cloud',pos:[2.0,4.8,-9.8],pose:'lie',yaw:-Math.PI/2,look:[1.5,-11.0],bg:'#dff3ff',sky:true});
SHIP.sky=function(B){
  [[-2.6,8.2,2.9],[-2.6,6.6,3.8],[-2.6,5.0,4.7]].forEach(p=>stone(B,p[0],p[1],p[2],'#ffffff',1.1,0.4));
  island(B,-5.0,-1.4,1.9,4.1,5.6,'#ffffff','#f4f8ff');
  B.cyl(0.02,0.02,4.2,-1.3,7.6,2.9,'#c8a165',{col:false,edges:false,rz:0.35});
  B.box(1.0,0.7,0.7,-4.3,5.95,2.6,'#8b5a2b',{col:false});B.box(1.05,0.2,0.75,-4.3,6.4,2.6,'#d4a017',{col:false});
};
SHIP.spots.push({label:'on the cloud tied to the mast',pos:[-4.3,5.6,3.6],pose:'crouch',look:[-2.6,2.5],bg:'#ffffff',sky:true},
                {label:'lying on the cloud',pos:[-4.8,5.6,2.4],pose:'lie',yaw:-Math.PI/2,look:[-2.0,1.0],bg:'#ffffff',sky:true});
SCHOOL.sky=function(B){
  const bk=['#e74c3c','#3498db','#2ecc71','#f1c40f','#9b59b6','#e67e22'];
  for(let k=0;k<6;k++){const top=0.5*(k+1),z0=-2.2-0.9*k;B.box(1.2,top,0.9,8.2,top/2,z0-0.45,bk[k]);B.box(1.22,0.06,0.92,8.2,top-0.25,z0-0.45,'#ffffff',{col:false,edges:false});}
  B.box(10.4,0.3,1.4,6.7,2.85,-8.3,HS.mat('#ffffff',{map:HS.tex.wood('#c99a63',3,1)}),{float:true});
  B.box(6.1,0.08,0.08,4.55,4.0,-7.6,'#9a6a3f',{col:false});B.col(1.5,7.6,-7.65,-7.55,4.0,3.0);
  B.box(3.1,0.08,0.08,10.35,4.0,-7.6,'#9a6a3f',{col:false});B.col(8.8,11.9,-7.65,-7.55,4.0,3.0);
  for(let x=1.6;x<11.9;x+=0.7)if(x<7.6||x>8.8)B.box(0.05,1.0,0.05,x,3.5,-7.6,'#9a6a3f',{col:false,solid:false});
  B.ball(0.45,10.8,3.55,-8.4,HS.mat('#ffffff',{map:HS.tex.globe()}),{col:false});B.ball(0.6,3.0,3.35,-8.5,'#f1c40f',{sy:0.6,col:false});
  [[3,4.6,-3],[-3,4.8,2],[6,5.0,4]].forEach(p=>{B.box(0.7,0.04,0.5,p[0],p[1],p[2],'#ffffff',{col:false,ry:0.6});B.cyl(0.005,0.005,1,p[0],p[1]+0.5,p[2],'#999',{col:false,edges:false});});
};
SCHOOL.spots.push({label:'up on the balcony',pos:[2.2,3.0,-8.6],pose:'crouch',look:[2.6,-6.2],bg:'#fdf1c7',sky:true},
                  {label:'behind the globe on the balcony',pos:[11.3,3.0,-8.5],pose:'crouch',yaw:-Math.PI/2,look:[10.4,-6.4],bg:'#fdf1c7',sky:true});
/* =============== 10. FELIX'S MANSION (very big: 9 rooms, go all the way around) =============== */
const PI2=PI/2;
function checker(c1,c2,rx,ry){const c=document.createElement('canvas');c.width=c.height=64;const g=c.getContext('2d');g.fillStyle=c1;g.fillRect(0,0,64,64);g.fillStyle=c2;g.fillRect(0,0,32,32);g.fillRect(32,32,32,32);
  g.strokeStyle='rgba(0,0,0,0.08)';g.lineWidth=2;g.strokeRect(0,0,64,64);g.strokeRect(0,0,32,32);g.strokeRect(32,32,32,32);
  const t=new THREE.CanvasTexture(c);t.wrapS=t.wrapT=THREE.RepeatWrapping;t.repeat.set(rx,ry);t.anisotropy=4;t.userData={base:c1};return t;}
function booksTex(){const c=document.createElement('canvas');c.width=256;c.height=256;const g=c.getContext('2d');g.fillStyle='#6b4226';g.fillRect(0,0,256,256);
  const cols=['#e74c3c','#3498db','#2ecc71','#f1c40f','#9b59b6','#e67e22','#1abc9c','#c0392b','#2c3e50'];
  for(let r=0;r<4;r++){let x=4;const y0=r*64+8;while(x<250){const w=6+Math.random()*10,h=40+Math.random()*14;g.fillStyle=cols[(Math.random()*cols.length)|0];g.fillRect(x,y0+52-h,w,h);g.fillStyle='rgba(255,255,255,0.35)';g.fillRect(x+2,y0+52-h+6,w-4,3);x+=w+1.5;}
    g.fillStyle='#4e2f1a';g.fillRect(0,r*64+60,256,6);}
  const t=new THREE.CanvasTexture(c);t.wrapS=t.wrapT=THREE.RepeatWrapping;t.anisotropy=4;t.userData={base:'#6b4226'};return t;}
HS.defineMap({
  id:'mansion',name:"Felix's Mansion",emoji:'🏰',desc:'Very big! 9 rooms: pool, library, toy room…',time:2,
  bounds:{x0:-30,x1:30,z0:-24,z1:24},
  env:{bg:'#f3e9d8',sky:false,sun:0.42,sunPos:[10,22,16],hemi:0.5,amb:0.22,shadowExt:34,ceil:5.5},
  spawn:{seek:[0,21,0,8],hide:[0,18,0,6],seeker:[0,4.6,0,2],home:[-5,21,0.9,0],dog:[5,13]},
  build(B){
    const H=5.5,wp=HS.tex.wallpaper(8,2);
    const R={kit:'#fff1b8',lib:'#c9a27a',bed:'#cfe0ff',din:'#f6c9c9',hall:'#f5ecd7',game:'#cdeccd',pool:'#bfefff',foy:'#f8dcc0',toy:'#ffd6a5'};
    const wm=c=>HS.mat(c,{map:wp});
    // floors (each room its own)
    const fl=(x,z,w,d,map)=>B.plane(w,d,x,0,z,HS.mat('#ffffff',{map}),{rx:-PI2,solid:true});
    fl(-20,-16,20,16,checker('#ffffff','#9fc6e8',10,8));        // kitchen
    fl(0,-16,20,16,HS.tex.wood('#8a5a32',5,4));                  // library
    fl(20,-16,20,16,HS.tex.wood('#d8b07a',5,4));                 // bedroom
    fl(-20,0,20,16,HS.tex.wood('#a8683a',5,4));                  // dining
    fl(0,0,20,16,checker('#f2efe8','#d9cdb8',10,8));             // grand hall
    fl(20,0,20,16,HS.tex.wood('#c99a63',5,4));                   // game room
    fl(-20,16,20,16,checker('#ffffff','#bfe6f5',12,10));         // pool room
    fl(0,16,20,16,checker('#f2efe8','#c9b79a',10,8));            // foyer
    fl(20,16,20,16,checker('#ffe08a','#ffb3c7',10,8));           // toy room
    B.plane(60,48,0,H,0,'#fbf8f1',{rx:PI2,solid:true});          // ceiling
    // outside walls
    const ow=(len,x,z,ry,c)=>B.plane(len,H,x,H/2,z,wm(c),{ry,solid:true});
    ow(20,-20,-24,0,R.kit);ow(20,0,-24,0,R.lib);ow(20,20,-24,0,R.bed);
    ow(20,-20,24,PI,R.pool);ow(20,0,24,PI,R.foy);ow(20,20,24,PI,R.toy);
    ow(16,-30,-16,PI2,R.kit);ow(16,-30,0,PI2,R.din);ow(16,-30,16,PI2,R.pool);
    ow(16,30,-16,-PI2,R.bed);ow(16,30,0,-PI2,R.game);ow(16,30,16,-PI2,R.toy);
    // inside walls with doorways; a = color on the -x / -z side, b = on the +x / +z side
    const T=0.3;
    const wallX=(x,z0,z1,a,b,gaps)=>{let z=z0;const segs=[];gaps.forEach(g=>{segs.push([z,g[0]]);z=g[1];
        B.box(T,H-3.2,g[1]-g[0],x,3.2+(H-3.2)/2,(g[0]+g[1])/2,[wm(b),wm(a),'#ffffff','#ffffff','#ffffff','#ffffff'],{col:false});});segs.push([z,z1]);
      segs.forEach(s=>{if(s[1]-s[0]>0.01)B.box(T,H,s[1]-s[0],x,H/2,(s[0]+s[1])/2,[wm(b),wm(a),'#ffffff','#ffffff','#ffffff','#ffffff']);});};
    const wallZ=(z,x0,x1,a,b,gaps)=>{let x=x0;const segs=[];gaps.forEach(g=>{segs.push([x,g[0]]);x=g[1];
        B.box(g[1]-g[0],H-3.2,T,(g[0]+g[1])/2,3.2+(H-3.2)/2,z,['#ffffff','#ffffff','#ffffff','#ffffff',wm(b),wm(a)],{col:false});});segs.push([x,x1]);
      segs.forEach(s=>{if(s[1]-s[0]>0.01)B.box(s[1]-s[0],H,T,(s[0]+s[1])/2,H/2,z,['#ffffff','#ffffff','#ffffff','#ffffff',wm(b),wm(a)]);});};
    wallX(-10,-24,-8,R.kit,R.lib,[[-17,-14.5]]);wallX(-10,-8,8,R.din,R.hall,[[2,5]]);wallX(-10,8,24,R.pool,R.foy,[[14.5,17]]);
    wallX(10,-24,-8,R.lib,R.bed,[[-17,-14.5]]);wallX(10,-8,8,R.hall,R.game,[[2,5]]);wallX(10,8,24,R.foy,R.toy,[[14.5,17]]);
    wallZ(-8,-30,-10,R.kit,R.din,[[-21,-18.5]]);wallZ(-8,-10,10,R.lib,R.hall,[[-1.5,1.5]]);wallZ(-8,10,30,R.bed,R.game,[[18.5,21]]);
    wallZ(8,-30,-10,R.din,R.pool,[[-21,-18.5]]);wallZ(8,-10,10,R.hall,R.foy,[[-2,2]]);wallZ(8,10,30,R.game,R.toy,[[18.5,21]]);
    // windows
    windowZ(B,-24,2.8,-23.97,2.4,1.8);windowZ(B,24,2.8,-23.97,2.4,1.8);windowZ(B,-6,2.8,23.97,2.2,1.8);windowZ(B,6,2.8,23.97,2.2,1.8);
    windowZ(B,-20,2.8,23.97,3,1.8);windowZ(B,20,2.8,23.97,3,1.8);
    windowX(B,-29.97,2.8,0,3,1.8);windowX(B,29.97,2.8,0,3,1.8);windowX(B,-29.97,2.8,16,3,1.8);windowX(B,29.97,2.8,-16,3,1.8);
    const no={col:false};
    const plant=(x,z)=>{B.cyl(0.38,0.3,0.7,x,0.35,z,'#c8643b',{col:1.6});B.ball(0.6,x,1.2,z,'#4caf50',no);B.ball(0.45,x+0.35,1.55,z+0.1,'#5cbf60',no);B.ball(0.45,x-0.35,1.6,z-0.1,'#43a047',no);B.ball(0.4,x,1.95,z,'#66bb6a',no);};

    /* ---- GRAND HALL (middle) ---- */
    B.plane(3,16,0,0.012,0,HS.mat('#ffffff',{map:HS.tex.carpet()}),{rx:-PI2});
    B.cyl(1.7,1.8,0.6,0,0.3,2,'#e3ddd0',{col:true});B.cyl(1.45,1.45,0.05,0,0.58,2,HS.mat('#7fd0f0',{emissive:'#1f5f7a'}),no);
    B.cyl(0.25,0.3,1.6,0,1.3,2,'#e3ddd0',{col:2.2});B.cyl(0.8,0.5,0.2,0,2.2,2,'#e3ddd0',no);B.ball(0.25,0,2.5,2,'#7fd0f0',no);
    // two grand staircases up to the balcony
    const stepsZ=(x0,x1,zs)=>{for(let i=0;i<10;i++){const top=0.3*(i+1),za=zs-0.55*(i+1);B.box(x1-x0,top,0.55,(x0+x1)/2,top/2,za+0.275,['#f3ede2','#f3ede2','#b3262e','#f3ede2','#f3ede2','#f3ede2']);}};
    stepsZ(-9.85,-8.0,-0.1);stepsZ(8.0,9.85,-0.1);
    const bw=HS.mat('#ffffff',{map:HS.tex.wood('#a8683a',6,1)});
    B.box(19.7,0.3,2.25,0,2.85,-6.725,bw,{float:true});
    B.box(16,0.09,0.09,0,4.0,-5.6,'#d4a017',no);B.col(-8,8,-5.66,-5.54,4.0,3.0);
    for(let x=-7.8;x<8;x+=0.7)B.box(0.06,1.0,0.06,x,3.5,-5.6,'#ffffff',{col:false,solid:false});
    B.box(2.2,0.45,0.6,5,3.225,-7.45,'#b3262e',{float:true});B.box(2.2,0.5,0.15,5,3.7,-7.75,'#8f1d24',{col:false});
    B.cyl(0.35,0.25,0.9,-5,3.45,-7.3,'#3498db',{col:3.9});
    B.basic(4,1.33,0,4.6,-7.83,HS.tex.sign("Felix's Mansion",'🏰 welcome!'));
    // chandelier
    B.cyl(0.03,0.03,0.7,0,5.15,1,'#d4a017',{col:false,edges:false});B.cyl(1.4,1.0,0.15,0,4.75,1,'#d4a017',no);
    const bulb=HS.mat('#fff4c4',{emissive:'#ffdf80'});for(let i=0;i<8;i++){const a=i*PI/4;B.ball(0.13,Math.cos(a)*1.3,4.5,1+Math.sin(a)*1.3,bulb,{cast:false,col:false});}
    B.light(0xffe6b0,0.55,30,0,4.2,1);
    // armor statues by the hall doors
    [[-8.6,6.6],[8.6,6.6]].forEach(p=>{B.box(1,0.5,1,p[0],0.25,p[1],'#8f8a82',{col:2.3});const f=HS.makeFigure({helmet:true});HS.paint(f,'#a7aab0');HS.placeFigure(f,{pos:[p[0],0.5,p[1]],pose:'flat',yaw:PI});f.traverse(o=>{if(o.isMesh)o.castShadow=true;});B.addFx(f);});
    plant(-2.6,-7.2);plant(2.6,-7.2);
    B.box(2.4,0.5,0.8,-4,0.25,6.9,'#9a6a3f');B.box(2.4,0.5,0.8,4,0.25,6.9,'#9a6a3f');

    /* ---- FOYER (front, south middle) ---- */
    B.plane(2.4,3.6,0,1.8,23.96,'#7a4a24',{ry:PI});B.box(3,0.2,0.2,0,3.7,23.9,'#d4a017',no);B.ball(0.08,0.8,1.6,23.9,'#f1c40f',no);
    B.plane(6,4,0,0.012,18,HS.mat('#ffffff',{map:HS.tex.rug()}),{rx:-PI2});
    B.box(0.6,2.6,0.6,-8.9,1.3,22.9,'#7a4a24');B.cyl(0.25,0.25,0.06,-8.9,2.2,22.58,'#f5efe0',no);   // grandfather clock
    B.box(3,1,0.8,8,0.5,23.4,'#9a6a3f');B.box(0.9,0.5,0.9,8.6,1.25,23.3,'#e67e22');                // shoe cabinet + box
    B.cyl(0.05,0.05,2,-6,1,22.8,'#7a4a24',{col:1.9});B.ball(0.35,-6,1.6,22.8,'#e74c3c',{sy:1.4,col:false});B.ball(0.35,-6,1.2,23.0,'#2e86de',{sy:1.4,col:false});  // coat rack
    plant(-3,23);plant(3,23);
    B.box(1.4,0.9,1.4,-7.5,0.45,11,'#d9473b');B.box(1.0,0.7,1.0,-7.5,1.25,11,'#f1c40f');B.box(0.6,0.5,0.6,-7.5,1.85,11,'#3498db');  // stack of presents
    B.box(4,0.45,1,6.5,0.225,10.2,'#3fa7a0');B.box(4,0.7,0.25,6.5,0.8,9.8,'#3fa7a0');                 // bench

    /* ---- LIBRARY (north middle) ---- */
    const bt=booksTex();const sm=HS.mat('#ffffff',{map:bt}),br='#6b4226';
    const shelf=(x0,x1,z)=>{bt.repeat.set(1,1);B.box(x1-x0,3,0.7,(x0+x1)/2,1.5,z,[br,br,br,br,sm,sm]);};
    shelf(-8.6,-2.4,-11.8);shelf(2.4,8.6,-11.8);shelf(-6,6,-15.8);shelf(-8.6,-1.6,-19.8);shelf(1.6,8.6,-19.8);
    B.box(0.7,3,6,-9.5,1.5,-20.5,[br,sm,br,br,br,br]);
    B.plane(5,3.5,0,0.012,-22,HS.mat('#ffffff',{map:HS.tex.rug()}),{rx:-PI2});
    const ch=(x,z,ry,c)=>{B.box(1.2,0.5,1.1,x,0.25,z,c);B.box(1.2,0.8,0.25,x,0.9,z+ (ry?0.45:-0.45),c);};
    ch(-2,-22.6,0,'#8f1d24');ch(2,-22.6,0,'#8f1d24');
    B.box(2.6,0.9,1.3,6.5,0.45,-22.6,'#7a4a24');B.ball(0.5,6.5,1.5,-22.6,HS.mat('#ffffff',{map:HS.tex.globe()}),no);
    B.box(0.9,0.6,0.9,-6,0.3,-22.8,'#9b59b6');B.box(0.7,0.5,0.7,-6,0.85,-22.8,'#f1c40f');

    /* ---- KITCHEN (north west) ---- */
    const ctr=HS.mat('#ffffff',{map:HS.tex.wood('#e9e4dc',2,1)});
    B.box(13,1,1.1,-20.5,0.5,-23.4,['#ffffff','#ffffff','#9aa3ad','#ffffff','#ffffff','#ffffff']);
    for(let x=-26.5;x<-14;x+=1.3)B.box(1.1,0.75,0.04,x,0.5,-22.83,'#e9edf1',{col:false,solid:false});
    B.box(1.5,2.6,1.2,-28.9,1.3,-23.3,'#dfe6ec');B.box(0.06,0.9,0.06,-28.3,1.6,-22.68,'#9aa3ad',no);   // fridge
    B.box(1.4,0.06,0.9,-17,1.03,-23.4,'#333333',no);[-17.35,-16.65].forEach(x=>B.cyl(0.2,0.2,0.03,x,1.07,-23.4,'#e74c3c',no));
    B.box(4.5,1,2,-20,0.5,-15.5,['#5b8fd6','#5b8fd6','#9aa3ad','#5b8fd6','#5b8fd6','#5b8fd6']);  // island
    B.ball(0.35,-21,1.3,-15.5,'#f39c12',{sy:0.8,col:false});B.ball(0.18,-19.6,1.15,-15.3,'#e74c3c',no);B.ball(0.18,-19.3,1.15,-15.7,'#2ecc71',no);
    B.box(3,0.12,1.6,-25,0.85,-11.5,'#c99a63');[[-26.3,-12.1],[-23.7,-12.1],[-26.3,-10.9],[-23.7,-10.9]].forEach(p=>B.box(0.12,0.8,0.12,p[0],0.4,p[1],'#a8683a',{edges:false,col:false}));B.col(-26.5,-23.5,-12.3,-10.7,0.91);
    B.box(1.8,2.4,0.9,-29.4,1.2,-12,'#e9a23b');   // pantry cupboard
    B.box(0.8,0.9,0.8,-12,0.45,-23.2,'#2e86de');  // bin

    /* ---- BEDROOM (north east) ---- */
    B.plane(6,4.5,20,0.012,-15,HS.mat('#ffffff',{map:HS.tex.rug()}),{rx:-PI2});
    B.box(3,0.6,3.6,26.5,0.3,-21.6,'#9a6a3f');B.box(3,0.3,3.5,26.5,0.75,-21.6,'#ffffff');B.box(3.05,0.08,2.2,26.5,0.93,-21,'#e74c3c');
    B.box(3,1.6,0.15,26.5,0.8,-23.5,'#9a6a3f');B.box(1.4,0.25,0.6,26.5,1.0,-23,'#ffffff',no);
    B.box(2.4,3.2,0.9,13.5,1.6,-23.4,'#c58b4e');B.box(0.04,3.0,0.04,13.5,1.6,-22.93,'#7a4a24',no);    // wardrobe
    B.box(2.4,0.9,1,20,0.45,-23.3,'#f3ede2');B.box(1.4,0.9,0.08,20,1.4,-23.6,'#2b2b2b');B.basic(1.3,0.8,20,1.4,-23.55,HS.tex.tv());  // desk+screen
    B.box(1.2,0.7,1.2,28.9,0.35,-9.2,'#d9473b');B.box(1.26,0.12,1.26,28.9,0.76,-9.2,'#f1c40f');      // toy box
    B.cyl(0.05,1.5,2.6,15,1.3,-12,'#f39c12',{col:false,seg:6});B.cyl(0.05,0.06,0.3,15,2.7,-12,'#7a4a24',no);   // tent (you can walk in)
    teddy(B,28.6,0,-15.5,'#c58b4e');B.col(28.1,29.1,-16,-15,1.4);
    for(let i=0;i<5;i++)B.box(0.8,0.6,0.8,23+((i%2)*0.2),0.3+i*0.6,-10,['#e74c3c','#3498db','#2ecc71','#f1c40f','#9b59b6'][i]);  // block tower

    /* ---- DINING ROOM (west middle) ---- */
    const tw=HS.mat('#ffffff',{map:HS.tex.wood('#7a4a24',4,1)});
    B.box(11,0.14,2.4,-20,0.85,0,tw,{col:false});[[-25.2,-1],[-14.8,-1],[-25.2,1],[-14.8,1],[-20,-1],[-20,1]].forEach(p=>B.box(0.16,0.8,0.16,p[0],0.4,p[1],'#5a3a1f',{col:false,edges:false}));
    B.col(-25.5,-14.5,-1.2,1.2,0.92);
    for(let x=-24;x<=-16;x+=2){[-1.75,1.75].forEach(z=>{B.box(0.7,0.5,0.7,x,0.25,z,'#b3262e');B.box(0.7,1.0,0.12,x,1.0,z+(z>0?0.3:-0.3),'#7a4a24');});}
    B.box(0.12,0.9,0.12,-20,1.4,0,'#d4a017',no);B.ball(0.15,-20,1.95,0,bulb,{col:false,cast:false});
    B.box(1,1.6,3.6,-29.4,0.8,-4,'#e3ddd0');B.box(0.1,0.9,1.8,-28.9,0.6,-4,'#2b2b2b',no);B.ball(0.3,-29,0.4,-4,HS.mat('#ff9f43',{emissive:'#ff6b00'}),{col:false,cast:false});  // fireplace
    B.box(3.2,2.2,0.8,-26,1.1,7.4,'#9a6a3f');for(let i=0;i<4;i++)B.ball(0.18,-27.2+i*0.8,2.4,7.4,['#ffffff','#9fc6e8','#ffffff','#9fc6e8'][i],no);  // cabinet with plates
    B.box(0.8,2.8,0.6,-11,1.4,-7.3,'#5a3a1f');B.cyl(0.25,0.25,0.05,-11,2.3,-6.97,'#f5efe0',{col:false,rx:PI2});

    /* ---- GAME ROOM (east middle) ---- */
    B.box(4.4,0.9,2.4,19,0.45,-1.5,['#5a3a1f','#5a3a1f','#2e8b57','#5a3a1f','#5a3a1f','#5a3a1f']);
    [['#e74c3c',18,-1.8],['#f1c40f',18.4,-1.2],['#3498db',19.9,-1.4],['#ffffff',20.5,-1.9]].forEach(b=>B.ball(0.09,b[1],0.99,b[2],b[0],no));
    B.box(2.4,1.1,1.6,27.5,0.55,-6.6,'#1d1a17');B.box(2.4,0.06,0.5,27.5,0.95,-5.7,'#ffffff',no);B.box(0.1,1.4,1.6,28.7,1.8,-6.6,'#1d1a17',no);  // piano
    B.box(4,0.45,1.1,25,0.225,5.6,'#6c5ce7');B.box(4,0.75,0.28,25,0.82,6.1,'#6c5ce7');B.box(0.28,0.4,1.1,23.1,0.65,5.6,'#6c5ce7');B.box(0.28,0.4,1.1,26.9,0.65,5.6,'#6c5ce7');
    B.box(3,1.7,0.15,25,1.8,7.7,'#2b2b2b');B.basic(2.8,1.5,25,1.8,7.62,HS.tex.tv(),{ry:PI});
    [[13,6.9,'#e84393'],[14.6,7.0,'#00b894']].forEach(b=>{B.box(1.1,2.2,0.9,b[0],1.1,b[1],b[2]);B.box(0.8,0.6,0.05,b[0],1.6,b[1]-0.46,'#2b2b2b',no);});   // arcade machines
    B.ball(0.6,15,0.35,-5.5,'#f1c40f',{sy:0.6,col:0.7});B.ball(0.6,16.4,0.35,-6.4,'#e74c3c',{sy:0.6,col:0.7});   // bean bags
    plant(28.6,2);

    /* ---- POOL ROOM (south west): raised deck around a sunken pool ---- */
    const deck=HS.mat('#ffffff',{map:HS.tex.wood('#e9dcc0',4,2)}),pw='#7fd0f0';
    const dk=(x0,x1,z0,z1)=>B.box(x1-x0,0.5,z1-z0,(x0+x1)/2,0.25,(z0+z1)/2,[pw,pw,deck,pw,pw,pw],{edges:false});
    dk(-30,-10.15,8.15,12);dk(-30,-10.15,20,24);dk(-30,-26,12,20);dk(-14,-10.15,12,20);
    B.plane(12,8,-20,0.02,16,HS.mat('#ffffff',{map:checker('#5cc6ee','#4ab8e3',6,4)}),{rx:-PI2});
    B.plane(12,8,-20,0.38,16,HS.mat('#7fd8ff',{opacity:0.55}),{rx:-PI2,receive:false});
    B.box(0.5,0.08,3,-15,1.1,13.5,'#ffffff',no);B.box(0.6,0.6,0.6,-15,0.8,11.7,'#d9d2c3');      // diving board
    [[-27.5,22.5],[-24.5,22.5]].forEach(p=>{B.box(1,0.35,2,p[0],0.675,p[1],'#ff7675');B.box(1,0.6,0.15,p[0],1.0,p[1]+1,'#ff7675',no);});   // sun loungers
    B.ball(0.7,-22,0.75,14,'#f1c40f',{sy:0.7,col:false});B.ball(0.35,-21.4,1.3,14,'#f1c40f',{col:false});B.ball(0.12,-21.1,1.3,14,'#e67e22',no);  // rubber duck
    B.ball(0.4,-17,0.6,18.5,'#e74c3c',{col:false});
    B.box(1.4,1.6,1.4,-12,1.3,22.9,'#ffffff');B.box(1.42,0.3,1.42,-12,2.1,22.9,'#3498db',no);   // towel cupboard

    /* ---- TOY ROOM (south east) ---- */
    const pit=HS.mat('#ffffff');
    B.box(7,0.7,0.3,23.5,0.35,15.15,'#2e86de');B.box(7,0.7,0.3,23.5,0.35,22.85,'#2e86de');B.box(0.3,0.7,7.4,20.15,0.35,19,'#2e86de');B.box(0.3,0.7,7.4,26.85,0.35,19,'#2e86de');
    B.col(20.3,26.7,15.3,22.7,0.45);
    {const cols=['#e74c3c','#f1c40f','#2ecc71','#3498db','#e84393'];cols.forEach((c,k)=>{const L=[];for(let i=0;i<60;i++)L.push([20.5+Math.random()*6,0.3+Math.random()*0.25,15.5+Math.random()*7]);
      const g=new THREE.SphereGeometry(0.16,10,8);const im=new THREE.InstancedMesh(g,HS.mat(c),L.length);const o=new THREE.Object3D();L.forEach((p,i)=>{o.position.set(p[0],p[1],p[2]);o.updateMatrix();im.setMatrixAt(i,o.matrix);});im.receiveShadow=true;B.W.group.add(im);});}
    // slide tower
    B.steps({x0:12,z0:21.6,z1:23.6,n:6,run:0.55,rise:0.36,top:'#f1c40f',side:'#e67e22'});
    B.box(2.4,2.16,2.6,16.5,1.08,22.3,['#e74c3c','#e74c3c','#f1c40f','#e74c3c','#e74c3c','#e74c3c']);
        B.box(1.2,0.1,4.2,16.5,1.15,19.3,'#2ecc71',{rx:-0.5,col:false});
    // castle of blocks
    B.box(3,1.6,3,26.5,0.8,10.8,'#bdc3c7');for(let i=0;i<4;i++)B.box(0.6,0.5,0.6,25.4+(i%2)*2.2,1.85,9.7+((i/2)|0)*2.2,'#95a5a6');B.plane(1,1.2,26.5,0.6,12.31,'#2b2b2b',{});
    teddy(B,12.4,0,9.4,'#e17055');B.col(11.9,12.9,8.9,9.9,1.4);
    [[29,13,'#e84393'],[29,15.5,'#00b894']].forEach(b=>{B.box(0.9,2.2,1.1,b[0],1.1,b[1],b[2]);B.box(0.05,0.6,0.8,b[0]-0.46,1.6,b[1],'#2b2b2b',no);});
    B.box(4,0.06,0.3,15,0.03,10.5,'#7a4a24',no);B.box(1.2,0.7,0.8,14,0.35,10.5,'#e74c3c');B.box(1,0.6,0.8,15.4,0.3,10.5,'#3498db');   // toy train
  },
  spots:[
    // grand hall
    {label:'behind the fountain',pos:[0,0,0.05],pose:'crouch',yaw:PI,look:[-2.6,-0.6],bg:'#e3ddd0'},
    {label:'on the balcony bench',pos:[5,3.45,-7.45],pose:'sit',yaw:0,look:[4,-3.5],bg:'#b3262e',sky:true},
    {label:'behind the blue vase',pos:[-5.6,3.0,-7.6],pose:'crouch',look:[-5,-3.5],bg:'#3498db',sky:true},
    {label:'lying on the balcony',pos:[0.5,3.0,-7.4],pose:'lie',yaw:-PI2,look:[0.6,-3.6],bg:'#a8683a',sky:true},
    {label:'beside the stairs',pos:[7.6,0,-4.6],pose:'crouch',yaw:-PI2,look:[5.5,-3.2],bg:'#f3ede2'},
    {label:'flat on the hall wall',pos:[-9.62,0,0.9],pose:'flat',yaw:PI2,look:[-7,0.9],bg:'#f5ecd7',camo:true,camoSay:'Hmm… just a wall.'},
    // foyer
    {label:'next to the grandfather clock',pos:[-9.55,0,22.0],pose:'stand',look:[-7.5,20],bg:'#7a4a24'},
    {label:'behind the presents',pos:[-8.7,0,11.4],pose:'crouch',look:[-6.4,12.8],bg:'#d9473b'},
    {label:'behind the plant by the door',pos:[3.6,0,23.5],pose:'crouch',yaw:PI,look:[3.5,20.5],bg:'#4caf50'},
    {label:'flat on the peach wall',pos:[9.62,0,20],pose:'flat',yaw:-PI2,look:[7,20],bg:'#f8dcc0',camo:true,camoSay:'Hmm… just a wall.'},
    // library
    {label:'between the bookshelves',pos:[-5,0,-13.8],pose:'crouch',look:[-5,-14],bg:'#6b4226'},
    {label:'at the end of a shelf',pos:[7.5,0,-17.8],pose:'crouch',yaw:PI2,look:[7.5,-17.6],bg:'#6b4226'},
    {label:'behind the reading chair',pos:[-2,0,-23.6],pose:'crouch',look:[-0.2,-21.5],bg:'#8f1d24'},
    {label:'by the globe desk',pos:[8.9,0,-22.4],pose:'crouch',yaw:-PI2,look:[8.5,-20.8],bg:'#7a4a24'},
    // kitchen
    {label:'next to the fridge',pos:[-27.75,0,-23.5],pose:'stand',look:[-26,-20],bg:'#dfe6ec'},
    {label:'behind the kitchen island',pos:[-20,0,-13.9],pose:'crouch',yaw:PI,look:[-20,-12.8],bg:'#5b8fd6'},
    {label:'under the kitchen table',pos:[-25,0,-10.8],pose:'lie',yaw:PI2,look:[-25,-9.6],bg:'#c99a63'},
    {label:'beside the pantry',pos:[-29.5,0,-10.3],pose:'crouch',look:[-27.5,-9.5],bg:'#e9a23b'},
    // bedroom
    {label:'behind the wardrobe',pos:[11.9,0,-23.5],pose:'stand',look:[12.5,-20.5],bg:'#c58b4e'},
    {label:'inside the tent',pos:[15,0,-12],pose:'crouch',yaw:PI,look:[15,-9.6],bg:'#f39c12'},
    {label:'on the big bed',pos:[26.8,1.05,-21.6],pose:'lie',yaw:PI2,look:[24,-18.5],bg:'#e74c3c'},
    {label:'next to the teddy',pos:[29.4,0,-14.2],pose:'crouch',yaw:-PI2,look:[27,-13.5],bg:'#c58b4e'},
    // dining
    {label:'under the dining table',pos:[-21,0,0.75],pose:'lie',yaw:PI2,look:[-21,2.8],bg:'#7a4a24'},
    {label:'beside the fireplace',pos:[-29.4,0,-1.6],pose:'crouch',yaw:PI2,look:[-27,-1],bg:'#e3ddd0'},
    {label:'behind the tall clock',pos:[-11.9,0,-7.5],pose:'stand',look:[-12.5,-5],bg:'#5a3a1f'},
    // game room
    {label:'behind the pool table',pos:[19,0,0.15],pose:'crouch',yaw:PI,look:[19,1.8],bg:'#2e8b57'},
    {label:'behind the piano',pos:[29.3,0,-4.9],pose:'crouch',yaw:-PI2,look:[27,-4.2],bg:'#1d1a17'},
    {label:'behind the couch',pos:[25,0,7.1],pose:'lie',yaw:PI2,look:[25,3.6],bg:'#6c5ce7'},
    {label:'between the arcade machines',pos:[13.8,0,7.3],pose:'stand',yaw:PI,look:[13.8,5],bg:'#00b894'},
    // pool room
    {label:'in the pool',pos:[-25,0,19.3],pose:'crouch',yaw:PI2,look:[-23,18],bg:'#5cc6ee'},
    {label:'behind the rubber duck',pos:[-22.9,0,14.6],pose:'crouch',yaw:-PI2,look:[-24,15.5],bg:'#f1c40f'},
    {label:'on a sun lounger',pos:[-27.5,0.85,22.4],pose:'lie',yaw:0,look:[-26,20.8],bg:'#ff7675'},
    {label:'behind the towel cupboard',pos:[-10.6,0.5,22.4],pose:'crouch',yaw:-PI2,look:[-12,20.8],bg:'#ffffff'},
    // toy room
    {label:'lying in the ball pit',pos:[23.5,0.45,20],pose:'lie',yaw:PI2,look:[19,19],bg:'#f1c40f',camo:true,camoSay:'Just a lot of balls…'},
    {label:'on top of the slide tower',pos:[16.5,2.16,22.6],pose:'crouch',yaw:PI,look:[15,19.5],bg:'#f1c40f',sky:true},
    {label:'behind the block castle',pos:[29.2,0,10.8],pose:'crouch',yaw:-PI2,look:[27,8.7],bg:'#bdc3c7'},
    {label:'behind the big teddy',pos:[11.2,0,9.0],pose:'crouch',look:[13,11],bg:'#e17055'},
    {label:'next to the toy train',pos:[14.5,0,11.6],pose:'lie',yaw:PI2,look:[14.5,13],bg:'#e74c3c'}
  ]
});
// every place is about as big as Felix's Mansion (60 × 48 m): spread out sideways
{const SC={house:2.5,yard:2,castle:2,snow:2,ship:2,school:2.4,backrooms:1.8,candy:2,tiny:2};HS.mapList.forEach(m=>{if(SC[m.id])m.scale=SC[m.id];});}
// paint palette for each map = the colors you can blend into + fun colors
HS.mapList.forEach(m=>{const s=new Set(m.spots.map(x=>x.bg));m.palette=[...s];});// (games use HS.surfacePalette() after loading a place)
HS.funColors=['#e74c3c','#3498db','#f1c40f','#e84393','#9b59b6','#2ecc71','#ffffff','#222222'];
})();
