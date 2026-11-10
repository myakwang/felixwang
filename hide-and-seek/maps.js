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
    [[7.5,-6.7],[9.5,-6.7],[7.5,-3.7],[9.5,-3.7]].forEach(p=>B.box(0.12,0.5,0.12,p[0],3.85,p[1],'#9a6a3f',{edges:false}));
    B.box(2.2,0.2,3.2,8.5,4.2,-5.2,'#9a6a3f');B.box(2.2,0.25,3.1,8.5,4.42,-5.2,'#ffffff');B.box(2.26,0.07,2.0,8.5,4.58,-4.6,'#5b8fd6');
    B.box(1.2,0.22,0.6,8.5,4.64,-6.35,'#ffffff');B.box(2.2,1.3,0.1,8.5,4.25,-6.85,'#9a6a3f');
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
    {label:'under the bed',pos:[8.5,3.6,-3.3],pose:'lie',yaw:0,look:[8.4,-2.7],bg:'#9a6a3f'},
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
      if(z!==1){const f=HS.makeFigure({helmet:true});HS.paint(f,'#9a9a9a');HS.placeFigure(f,{pos:[12.4,0.5,z],pose:'flat',yaw:-PI/2});f.traverse(o=>{if(o.isMesh)o.castShadow=true;});B.W.group.add(f);
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

// paint palette for each map = the colors you can blend into + fun colors
HS.mapList.forEach(m=>{const s=new Set(m.spots.map(x=>x.bg));m.palette=[...s];});
HS.funColors=['#e74c3c','#3498db','#f1c40f','#e84393','#9b59b6','#2ecc71','#ffffff','#222222'];
})();
