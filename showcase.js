/* ==========================================================
   LOADER
========================================================== */
(function(){
  const fill = document.getElementById('loadFill');
  const pct  = document.getElementById('loadPct');
  const loader = document.getElementById('loader');
  let p = 0;
  const iv = setInterval(()=>{
    p += Math.random()*14 + 6;
    if(p >= 100){ p = 100; clearInterval(iv); setTimeout(()=>loader.classList.add('done'), 400); }
    fill.style.width = p + '%';
    pct.textContent = 'INITIALIZING ' + Math.floor(p) + '%';
  }, 110);
})();

/* ==========================================================
   CURSOR
========================================================== */
(function(){
  const dot = document.getElementById('cDot');
  const ring = document.getElementById('cRing');
  if(!window.matchMedia('(pointer:fine)').matches) return;
  const dx = gsap.quickTo(dot,'x',{duration:0.12,ease:'power3'});
  const dy = gsap.quickTo(dot,'y',{duration:0.12,ease:'power3'});
  const rx = gsap.quickTo(ring,'x',{duration:0.42,ease:'power3'});
  const ry = gsap.quickTo(ring,'y',{duration:0.42,ease:'power3'});
  window.addEventListener('mousemove', e=>{ dx(e.clientX); dy(e.clientY); rx(e.clientX); ry(e.clientY); });
  document.querySelectorAll('.spec-cell, .features-row li, .section-head .right, .hstat, .bay-dot').forEach(el=>{
    el.addEventListener('mouseenter', ()=>ring.classList.add('active'));
    el.addEventListener('mouseleave', ()=>ring.classList.remove('active'));
  });
})();

/* ==========================================================
   THREE.JS — GARAGE + 3 VEHICLE HOLOGRAM DISPLAYS
========================================================== */
const scene = new THREE.Scene();
scene.fog = new THREE.FogExp2(0x060607, 0.021);

const camera = new THREE.PerspectiveCamera(62, innerWidth/innerHeight, 0.1, 300);
camera.position.set(0, 6.2, 24);
camera.lookAt(0, 3, -12);

const renderer = new THREE.WebGLRenderer({antialias:true, powerPreference:'high-performance'});
renderer.setSize(innerWidth, innerHeight);
renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
renderer.setClearColor(0x050506, 1);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
document.getElementById('canvas-container').appendChild(renderer.domElement);

const ROOM = { w: 32, h: 12, d: 54, backZ: -26, frontZ: 24 };

/* ---------- TEXTURES ---------- */
function makeFloorTexture(){
  const c = document.createElement('canvas'); c.width = c.height = 1024;
  const ctx = c.getContext('2d');
  ctx.fillStyle = '#232328'; ctx.fillRect(0,0,1024,1024);
  const img = ctx.getImageData(0,0,1024,1024); const d = img.data;
  for(let i = 0; i < d.length; i += 4){ const n = (Math.random()-0.5)*42; d[i]=Math.max(0,Math.min(255,d[i]+n)); d[i+1]=Math.max(0,Math.min(255,d[i+1]+n)); d[i+2]=Math.max(0,Math.min(255,d[i+2]+n)); }
  ctx.putImageData(img,0,0);
  ctx.strokeStyle='rgba(0,0,0,0.55)'; ctx.lineWidth=2;
  for(let i=0;i<=4;i++){ const y=i*256; ctx.beginPath(); ctx.moveTo(0,y); ctx.lineTo(1024,y); ctx.stroke(); }
  for(let i=0;i<=4;i++){ const x=i*256; ctx.beginPath(); ctx.moveTo(x,0); ctx.lineTo(x,1024); ctx.stroke(); }
  ctx.strokeStyle='rgba(0,0,0,0.6)'; ctx.lineWidth=1.2;
  for(let i=0;i<16;i++){ ctx.beginPath(); let x=Math.random()*1024,y=Math.random()*1024; ctx.moveTo(x,y); for(let j=0;j<7;j++){ x+=(Math.random()-0.5)*130; y+=(Math.random()-0.5)*130; ctx.lineTo(x,y);} ctx.stroke(); }
  for(let i=0;i<14;i++){ const x=Math.random()*1024,y=Math.random()*1024,r=40+Math.random()*110;
    const g=ctx.createRadialGradient(x,y,0,x,y,r); g.addColorStop(0,'rgba(0,0,0,0.5)'); g.addColorStop(0.5,'rgba(15,10,5,0.3)'); g.addColorStop(1,'rgba(0,0,0,0)');
    ctx.fillStyle=g; ctx.beginPath(); ctx.arc(x,y,r,0,Math.PI*2); ctx.fill(); }
  const t = new THREE.CanvasTexture(c); t.wrapS=t.wrapT=THREE.RepeatWrapping; t.repeat.set(3,4); t.anisotropy=8; return t;
}
function makeCorrugatedTexture(){
  const c = document.createElement('canvas'); c.width=256; c.height=256;
  const ctx = c.getContext('2d'); ctx.fillStyle='#2a2d32'; ctx.fillRect(0,0,256,256);
  for(let x=0;x<256;x+=10){ const g=ctx.createLinearGradient(x,0,x+10,0);
    g.addColorStop(0,'rgba(0,0,0,0.55)'); g.addColorStop(0.45,'rgba(120,130,140,0.15)'); g.addColorStop(0.55,'rgba(200,210,220,0.12)'); g.addColorStop(1,'rgba(0,0,0,0.55)');
    ctx.fillStyle=g; ctx.fillRect(x,0,10,256); }
  ctx.fillStyle='rgba(0,0,0,0.6)'; ctx.fillRect(0,126,256,3);
  ctx.fillStyle='rgba(80,80,90,0.7)';
  for(let x=10;x<256;x+=24){ ctx.beginPath(); ctx.arc(x,127,2.5,0,Math.PI*2); ctx.fill(); }
  const t = new THREE.CanvasTexture(c); t.wrapS=t.wrapT=THREE.RepeatWrapping; return t;
}
function makeBrickTexture(){
  const c = document.createElement('canvas'); c.width=c.height=512;
  const ctx = c.getContext('2d'); ctx.fillStyle='#0e0a08'; ctx.fillRect(0,0,512,512);
  const bh=32, bw=68;
  for(let y=0;y<512;y+=bh){ const off=(Math.floor(y/bh)%2)*(bw/2);
    for(let x=-bw;x<512;x+=bw){ const base=55+Math.random()*35;
      ctx.fillStyle=`rgb(${(base+15)|0},${(base*0.55)|0},${(base*0.42)|0})`;
      ctx.fillRect(x+off+2,y+2,bw-4,bh-4);
      ctx.fillStyle='rgba(255,180,120,0.06)'; ctx.fillRect(x+off+2,y+2,bw-4,3); } }
  const t = new THREE.CanvasTexture(c); t.wrapS=t.wrapT=THREE.RepeatWrapping; t.repeat.set(3,3); return t;
}
function makePegboardTexture(){
  const c=document.createElement('canvas'); c.width=c.height=256;
  const ctx=c.getContext('2d'); ctx.fillStyle='#2a2018'; ctx.fillRect(0,0,256,256); ctx.fillStyle='#0a0806';
  for(let y=10;y<256;y+=16){ for(let x=10;x<256;x+=16){ ctx.beginPath(); ctx.arc(x,y,2,0,Math.PI*2); ctx.fill(); } }
  const t=new THREE.CanvasTexture(c); t.wrapS=t.wrapT=THREE.RepeatWrapping; t.repeat.set(4,2); return t;
}

const MAT = {
  floor: new THREE.MeshStandardMaterial({ map: makeFloorTexture(), color: 0x35353a, roughness: 0.72, metalness: 0.28 }),
  corrugated: new THREE.MeshStandardMaterial({ map: makeCorrugatedTexture(), color: 0x5a5e64, roughness: 0.55, metalness: 0.72 }),
  corrugatedDark: new THREE.MeshStandardMaterial({ map: makeCorrugatedTexture(), color: 0x3a3d42, roughness: 0.6, metalness: 0.7 }),
  brick: new THREE.MeshStandardMaterial({ map: makeBrickTexture(), roughness: 0.95, metalness: 0.02 }),
  ceiling: new THREE.MeshStandardMaterial({ color: 0x0c0c0e, roughness: 0.95, metalness: 0.05 }),
  steel: new THREE.MeshStandardMaterial({ color: 0x555a60, roughness: 0.35, metalness: 0.9 }),
  steelDark: new THREE.MeshStandardMaterial({ color: 0x24262a, roughness: 0.5, metalness: 0.85 }),
  steelRust: new THREE.MeshStandardMaterial({ color: 0x5a3a24, roughness: 0.75, metalness: 0.5 }),
  rubber: new THREE.MeshStandardMaterial({ color: 0x0d0d0f, roughness: 0.95, metalness: 0.05 }),
  wood: new THREE.MeshStandardMaterial({ color: 0x3a2418, roughness: 0.88, metalness: 0.05 }),
  pegboard: new THREE.MeshStandardMaterial({ map: makePegboardTexture(), roughness: 0.9, metalness: 0.05 }),
  lampShade: new THREE.MeshStandardMaterial({ color: 0x1a1a1c, roughness: 0.5, metalness: 0.85, side: THREE.DoubleSide }),
  lampBulb: new THREE.MeshBasicMaterial({ color: 0xffb347 }),
  fluorescent: new THREE.MeshBasicMaterial({ color: 0xd8f0ff }),
  glassGlow: new THREE.MeshBasicMaterial({ color: 0xffb347, transparent: true, opacity: 0.3, blending: THREE.AdditiveBlending, side: THREE.DoubleSide, depthWrite: false }),
  yellowPaint: new THREE.MeshStandardMaterial({ color: 0xd0a020, roughness: 0.85, metalness: 0.15, emissive: 0x3a2800, emissiveIntensity: 0.15 }),
  redPaint: new THREE.MeshStandardMaterial({ color: 0xb03028, roughness: 0.5, metalness: 0.4 }),
  bluePaint: new THREE.MeshStandardMaterial({ color: 0x2a5a9a, roughness: 0.55, metalness: 0.4 }),
  orangePaint: new THREE.MeshStandardMaterial({ color: 0xd06030, roughness: 0.55, metalness: 0.4 })
};

/* ---------- FLOOR + BAYS ---------- */
const floor = new THREE.Mesh(new THREE.PlaneGeometry(ROOM.w * 1.7, ROOM.d * 1.4), MAT.floor);
floor.rotation.x = -Math.PI / 2; floor.receiveShadow = true; scene.add(floor);

function bayLine(x1, z1, x2, z2){
  const dx=x2-x1, dz=z2-z1; const len=Math.sqrt(dx*dx+dz*dz);
  const line = new THREE.Mesh(new THREE.PlaneGeometry(len, 0.16), MAT.yellowPaint);
  line.rotation.x = -Math.PI/2; line.rotation.z = -Math.atan2(dz,dx);
  line.position.set((x1+x2)/2, 0.02, (z1+z2)/2); scene.add(line);
}
const BAYS = [
  { id:'meteor', x: -9, z: -10 },
  { id:'access', x:  0, z: -10 },
  { id:'alto',   x:  9, z: -10 }
];
BAYS.forEach(b => {
  bayLine(b.x - 4.4, b.z - 5, b.x - 4.4, b.z + 5);
  bayLine(b.x + 4.4, b.z - 5, b.x + 4.4, b.z + 5);
  bayLine(b.x - 4.4, b.z + 5, b.x + 4.4, b.z + 5);
});
const backStripe = new THREE.Mesh(new THREE.PlaneGeometry(ROOM.w-4, 0.4), MAT.yellowPaint);
backStripe.rotation.x = -Math.PI/2; backStripe.position.set(0, 0.02, ROOM.backZ + 1.2); scene.add(backStripe);

/* ---------- WALLS ---------- */
const backWall = new THREE.Mesh(new THREE.PlaneGeometry(ROOM.w, ROOM.h), MAT.corrugated);
backWall.position.set(0, ROOM.h/2, ROOM.backZ); backWall.receiveShadow = true; scene.add(backWall);

function buildSideWall(sign){
  const x = sign * ROOM.w / 2;
  const brick = new THREE.Mesh(new THREE.PlaneGeometry(ROOM.d, 4.5), MAT.brick);
  brick.rotation.y = -sign * Math.PI / 2; brick.position.set(x, 2.25, (ROOM.backZ + ROOM.frontZ)/2); brick.receiveShadow = true; scene.add(brick);
  const upper = new THREE.Mesh(new THREE.PlaneGeometry(ROOM.d, ROOM.h - 4.5), MAT.corrugatedDark);
  upper.rotation.y = -sign * Math.PI / 2; upper.position.set(x, 4.5 + (ROOM.h - 4.5)/2, (ROOM.backZ + ROOM.frontZ)/2); scene.add(upper);
  const band = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.35, ROOM.d), MAT.steelDark);
  band.position.set(x - sign * 0.05, 4.5, (ROOM.backZ + ROOM.frontZ)/2); scene.add(band);
}
buildSideWall(-1); buildSideWall(1);

/* ---------- CEILING ---------- */
const ceiling = new THREE.Mesh(new THREE.PlaneGeometry(ROOM.w, ROOM.d), MAT.ceiling);
ceiling.rotation.x = Math.PI/2; ceiling.position.set(0, ROOM.h, (ROOM.backZ + ROOM.frontZ)/2); scene.add(ceiling);

for(let i=0;i<8;i++){ const z=ROOM.backZ+3+i*7;
  const top=new THREE.Mesh(new THREE.BoxGeometry(ROOM.w,0.15,0.5),MAT.steelDark); top.position.set(0,ROOM.h-0.075,z); scene.add(top);
  const bot=new THREE.Mesh(new THREE.BoxGeometry(ROOM.w,0.15,0.5),MAT.steelDark); bot.position.set(0,ROOM.h-0.65,z); scene.add(bot);
  const web=new THREE.Mesh(new THREE.BoxGeometry(ROOM.w,0.42,0.1),MAT.steelDark); web.position.set(0,ROOM.h-0.35,z); scene.add(web);
}
[-10,-4,4,10].forEach((x,i)=>{
  const pipe=new THREE.Mesh(new THREE.CylinderGeometry(0.15-i*0.02,0.15-i*0.02,ROOM.d,12), i%2===0?MAT.steelDark:MAT.steelRust);
  pipe.rotation.x=Math.PI/2; pipe.position.set(x,ROOM.h-1.3,(ROOM.backZ+ROOM.frontZ)/2); scene.add(pipe);
});
const duct=new THREE.Mesh(new THREE.BoxGeometry(2.4,1.0,ROOM.d-4),MAT.steelDark);
duct.position.set(-11.5,ROOM.h-1.7,(ROOM.backZ+ROOM.frontZ)/2); scene.add(duct);
for(let i=0;i<11;i++){ const band=new THREE.Mesh(new THREE.BoxGeometry(2.55,1.1,0.12),MAT.steel); band.position.set(-11.5,ROOM.h-1.7,ROOM.backZ+2+i*4.6); scene.add(band); }

/* ---------- FLUORESCENTS ---------- */
const fluorescents=[];
function addFluorescent(x,z,color=0xd8f0ff,intensity=1.3){
  const g=new THREE.Group();
  const housing=new THREE.Mesh(new THREE.BoxGeometry(3.2,0.22,0.32),MAT.steelDark); g.add(housing);
  const tube=new THREE.Mesh(new THREE.CylinderGeometry(0.1,0.1,3.0,12),MAT.fluorescent); tube.rotation.z=Math.PI/2; tube.position.y=-0.15; g.add(tube);
  const glow=new THREE.Mesh(new THREE.PlaneGeometry(3.4,1.4),new THREE.MeshBasicMaterial({color,transparent:true,opacity:0.08,blending:THREE.AdditiveBlending,depthWrite:false}));
  glow.rotation.x=Math.PI/2; glow.position.y=-0.25; g.add(glow);
  const light=new THREE.PointLight(color,intensity,13,2); light.position.y=-0.3; g.add(light);
  g.position.set(x,ROOM.h-1.9,z); scene.add(g);
  fluorescents.push({light,baseIntensity:intensity,tube,offset:Math.random()*10});
}
for(let i=0;i<6;i++){ addFluorescent(-7,ROOM.backZ+4+i*8.5,0xd8f0ff,1.15); addFluorescent(7,ROOM.backZ+4+i*8.5,0xd8f0ff,1.15); }

/* ---------- PENDANT LAMPS ---------- */
const lamps=[];
function makeLamp(x,z,color=0xffb347,intensity=1.6){
  const g=new THREE.Group();
  g.add(new THREE.Mesh(new THREE.CylinderGeometry(0.12,0.12,0.2,10),MAT.steelDark));
  const cord=new THREE.Mesh(new THREE.CylinderGeometry(0.025,0.025,1.6,6),MAT.steelDark); cord.position.y=-0.8; g.add(cord);
  const shade=new THREE.Mesh(new THREE.ConeGeometry(0.58,0.72,24,1,true),MAT.lampShade); shade.position.y=-1.85; shade.rotation.x=Math.PI; g.add(shade);
  const bulb=new THREE.Mesh(new THREE.SphereGeometry(0.17,12,12),MAT.lampBulb); bulb.position.y=-2.0; g.add(bulb);
  const glow=new THREE.Mesh(new THREE.CircleGeometry(0.52,24),MAT.glassGlow); glow.rotation.x=Math.PI/2; glow.position.y=-2.15; g.add(glow);
  const coneGeo=new THREE.ConeGeometry(2.4,5.5,24,1,true);
  const coneMat=new THREE.MeshBasicMaterial({color,transparent:true,opacity:0.05,blending:THREE.AdditiveBlending,side:THREE.DoubleSide,depthWrite:false});
  const ray=new THREE.Mesh(coneGeo,coneMat); ray.position.y=-4.9; ray.rotation.x=Math.PI; g.add(ray);
  const light=new THREE.PointLight(color,intensity,24,1.8); light.position.y=-2.0; light.castShadow=true;
  light.shadow.mapSize.set(512,512); light.shadow.bias=-0.001; g.add(light);
  g.position.set(x,ROOM.h-0.9,z); scene.add(g);
  lamps.push({light,baseIntensity:intensity,color});
}
makeLamp(-10,8,0xffb347,1.6); makeLamp(10,8,0xffb347,1.6);
makeLamp(-10,-4,0xffc470,1.4); makeLamp(10,-4,0xffc470,1.4);
makeLamp(-10,-18,0x88ddff,1.2); makeLamp(10,-18,0x88ddff,1.2);

/* ---------- ROLLER DOOR ---------- */
const doorGroup=new THREE.Group();
const doorW=15,doorH=8.5;
for(let i=0;i<18;i++){ const slat=new THREE.Mesh(new THREE.BoxGeometry(doorW,doorH/18-0.02,0.18),MAT.corrugatedDark); slat.position.y=-doorH/2+doorH/36+i*(doorH/18); doorGroup.add(slat); }
const dFrameTop=new THREE.Mesh(new THREE.BoxGeometry(doorW+0.5,0.35,0.45),MAT.steel); dFrameTop.position.y=doorH/2+0.18; doorGroup.add(dFrameTop);
const dFrameL=new THREE.Mesh(new THREE.BoxGeometry(0.35,doorH+0.35,0.45),MAT.steel); dFrameL.position.set(-doorW/2-0.18,0,0); doorGroup.add(dFrameL);
const dFrameR=dFrameL.clone(); dFrameR.position.x=doorW/2+0.18; doorGroup.add(dFrameR);
for(let i=0;i<4;i++){ const win=new THREE.Mesh(new THREE.PlaneGeometry(2,0.7),new THREE.MeshBasicMaterial({color:0x0a1418,transparent:true,opacity:0.92})); win.position.set(-doorW/2+2.3+i*3.4,-0.5,0.1); doorGroup.add(win); }
const drum=new THREE.Mesh(new THREE.CylinderGeometry(0.4,0.4,doorW,16),MAT.steelDark); drum.rotation.z=Math.PI/2; drum.position.set(0,doorH/2+0.6,-0.2); doorGroup.add(drum);
doorGroup.position.set(0,doorH/2,ROOM.backZ+0.35); scene.add(doorGroup);

/* ---------- PEGBOARDS + TOOLS ---------- */
function addPegboard(x,y,z,w,h){
  const board=new THREE.Mesh(new THREE.BoxGeometry(w,h,0.15),MAT.pegboard); board.position.set(x,y,z); scene.add(board);
  const border=new THREE.Mesh(new THREE.BoxGeometry(w+0.2,h+0.2,0.1),MAT.steelDark); border.position.set(x,y,z-0.02); scene.add(border);
  for(let i=0;i<w*2;i++){ const tw=0.12+Math.random()*0.22; const th=0.8+Math.random()*1.8;
    const tool=new THREE.Mesh(new THREE.BoxGeometry(tw,th,0.05),MAT.steelDark);
    tool.position.set(x-w/2+0.5+Math.random()*(w-1),y-h/2+0.4+Math.random()*(h-0.8),z+0.12);
    tool.rotation.z=(Math.random()-0.5)*0.05; scene.add(tool); }
  for(let i=0;i<3;i++){ const wrench=new THREE.Mesh(new THREE.BoxGeometry(0.08,1.5,0.06),MAT.steelDark); wrench.position.set(x-w/3+i*(w/3),y+0.1,z+0.14); scene.add(wrench); }
}
addPegboard(-11,6.2,ROOM.backZ+0.2,6,3); addPegboard(11,6.2,ROOM.backZ+0.2,6,3);

/* ---------- WORKBENCH ---------- */
function addWorkbench(x,z,rotY=0){
  const g=new THREE.Group();
  const top=new THREE.Mesh(new THREE.BoxGeometry(5,0.18,1.7),MAT.steel); top.position.y=1.65; top.castShadow=true; top.receiveShadow=true; g.add(top);
  const legGeo=new THREE.BoxGeometry(0.14,1.65,0.14);
  [[-2.35,-0.75],[-2.35,0.75],[2.35,-0.75],[2.35,0.75]].forEach(([lx,lz])=>{ const leg=new THREE.Mesh(legGeo,MAT.steelDark); leg.position.set(lx,0.825,lz); g.add(leg); });
  const shelf=new THREE.Mesh(new THREE.BoxGeometry(4.8,0.08,1.5),MAT.steelDark); shelf.position.y=0.5; g.add(shelf);
  const toolbox=new THREE.Mesh(new THREE.BoxGeometry(1.3,0.55,0.75),MAT.redPaint); toolbox.position.set(-1.4,2.0,0); g.add(toolbox);
  const viseJaw=new THREE.Mesh(new THREE.BoxGeometry(0.6,0.2,0.5),MAT.steel); viseJaw.position.set(1.6,2.1,0); g.add(viseJaw);
  g.position.set(x,0,z); g.rotation.y=rotY; scene.add(g);
}
addWorkbench(-14,8,Math.PI/2); addWorkbench(-14,0,Math.PI/2); addWorkbench(-14,-8,Math.PI/2); addWorkbench(-14,-16,Math.PI/2);

/* ---------- TOOL CABINETS ---------- */
function addToolCabinet(x,z,rotY=0,color=0xb03020){
  const g=new THREE.Group();
  const bodyMat=new THREE.MeshStandardMaterial({color,roughness:0.55,metalness:0.4});
  const body=new THREE.Mesh(new THREE.BoxGeometry(3.2,2.5,1.3),bodyMat); body.position.y=1.25; body.castShadow=true; g.add(body);
  for(let i=0;i<5;i++){ const drawer=new THREE.Mesh(new THREE.BoxGeometry(3.05,0.42,0.05),new THREE.MeshStandardMaterial({color:color*0.75,roughness:0.5,metalness:0.5})); drawer.position.set(0,0.3+i*0.48,0.68); g.add(drawer);
    const handle=new THREE.Mesh(new THREE.BoxGeometry(1.7,0.05,0.08),MAT.steel); handle.position.set(0,0.3+i*0.48,0.73); g.add(handle); }
  const wheelGeo=new THREE.CylinderGeometry(0.15,0.15,0.1,12);
  [[-1.3,0.55],[1.3,0.55],[-1.3,-0.55],[1.3,-0.55]].forEach(([wx,wz])=>{ const w=new THREE.Mesh(wheelGeo,MAT.rubber); w.rotation.z=Math.PI/2; w.position.set(wx,0.15,wz); g.add(w); });
  g.position.set(x,0,z); g.rotation.y=rotY; scene.add(g);
}
addToolCabinet(14,6,-Math.PI/2,0xb03020); addToolCabinet(14,-2,-Math.PI/2,0xb03020); addToolCabinet(14,-10,-Math.PI/2,0x2a4a7a);

/* ---------- TIRE STACKS ---------- */
function addTireStack(x,z,count=4){
  const g=new THREE.Group();
  for(let i=0;i<count;i++){ const tire=new THREE.Mesh(new THREE.TorusGeometry(0.65,0.26,12,26),MAT.rubber); tire.rotation.x=Math.PI/2; tire.position.y=0.26+i*0.52; tire.castShadow=true; g.add(tire);
    const rim=new THREE.Mesh(new THREE.CylinderGeometry(0.44,0.44,0.22,18),MAT.steel); rim.position.y=0.26+i*0.52; g.add(rim); }
  g.position.set(x,0,z); scene.add(g);
}
addTireStack(-13,-22,4); addTireStack(-12,-23.5,3); addTireStack(13,13,4); addTireStack(12,14.5,3);

/* ---------- OIL DRUMS ---------- */
function addDrum(x,z,color=0x8a3020){
  const mat=new THREE.MeshStandardMaterial({color,roughness:0.7,metalness:0.5});
  const drum=new THREE.Mesh(new THREE.CylinderGeometry(0.52,0.52,1.25,20),mat); drum.position.set(x,0.625,z); drum.castShadow=true; scene.add(drum);
  for(let i=-1;i<=1;i++){ const rib=new THREE.Mesh(new THREE.TorusGeometry(0.53,0.03,6,20),MAT.steelDark); rib.rotation.x=Math.PI/2; rib.position.set(x,0.625+i*0.38,z); scene.add(rib); }
}
addDrum(14,-22,0x8a3020); addDrum(12.8,-23,0x2a4a6a); addDrum(-14,16,0x8a3020);

/* ---------- SHELVES ---------- */
function addShelfWithCans(x,y,z,w){
  const shelf=new THREE.Mesh(new THREE.BoxGeometry(w,0.08,0.75),MAT.steelDark); shelf.position.set(x,y,z); scene.add(shelf);
  for(let i=0;i<5;i++){ const can=new THREE.Mesh(new THREE.BoxGeometry(0.5,0.72,0.32),new THREE.MeshStandardMaterial({color:0x7a4a1a,roughness:0.6,metalness:0.4})); can.position.set(x-w/2+0.4+i*(w/5),y+0.4,z); scene.add(can); }
}
addShelfWithCans(-15,3.5,12,6); addShelfWithCans(-15,5,12,6); addShelfWithCans(15,3.5,14,6);

/* ---------- WORK LIGHTS ---------- */
function addWorkLight(x,z){
  const g=new THREE.Group();
  const pole=new THREE.Mesh(new THREE.CylinderGeometry(0.06,0.06,3.2,10),MAT.steelDark); pole.position.y=1.6; g.add(pole);
  const base=new THREE.Mesh(new THREE.CylinderGeometry(0.42,0.42,0.12,12),MAT.steelDark); base.position.y=0.06; g.add(base);
  const shade=new THREE.Mesh(new THREE.ConeGeometry(0.5,0.6,16,1,true),MAT.lampShade); shade.position.set(0.4,3.2,0); shade.rotation.z=-Math.PI/3; g.add(shade);
  const bulb=new THREE.Mesh(new THREE.SphereGeometry(0.15,10,10),MAT.lampBulb); bulb.position.set(0.62,3.15,0); g.add(bulb);
  const light=new THREE.PointLight(0xffb347,1.1,14,2); light.position.set(0.62,3.15,0); g.add(light);
  g.position.set(x,0,z); scene.add(g);
}
addWorkLight(-12,3); addWorkLight(12,-3);

/* ==========================================================
   VEHICLE HOLOGRAM DISPLAYS — THE MAIN EVENT
========================================================== */
const vehicleDisplays = {};
const VEHICLES = [
  { id:'meteor', image:'https://imgd.aeplcdn.com/1056x594/n/equ9hhb_1871307.jpg?q=80&wm=3', x:-9, z:-10, w:7.5, h:4.2, accent:0xffb347, rim:0xff6b35 },
  { id:'access', image:'https://imgd.aeplcdn.com/1056x594/n/f6etjfb_1820555.jpeg?q=80&wm=3', x: 0, z:-10, w:7.0, h:4.0, accent:0x00f0ff, rim:0x2a5a9a },
  { id:'alto',   image:'https://imgd.aeplcdn.com/370x208/n/cw/ec/127563/alto-k10-exterior-right-front-three-quarter-69.jpeg?isig=0&q=80', x: 9, z:-10, w:7.5, h:4.2, accent:0xff2d95, rim:0xb03028 }
];

// Shader to key out light studio backgrounds
function makeVehicleMaterial(texture){
  return new THREE.ShaderMaterial({
    uniforms: { map: { value: texture } },
    vertexShader: `
      varying vec2 vUv;
      void main(){
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: `
      uniform sampler2D map;
      varying vec2 vUv;
      void main(){
        vec4 c = texture2D(map, vUv);
        float brightness = (c.r + c.g + c.b) / 3.0;
        float sat = max(c.r, max(c.g, c.b)) - min(c.r, min(c.g, c.b));
        float alpha = 1.0;
        if (sat < 0.20) {
          alpha = 1.0 - smoothstep(0.72, 0.88, brightness);
        }
        gl_FragColor = vec4(c.rgb, alpha);
      }
    `,
    transparent: true,
    depthWrite: false,
    side: THREE.DoubleSide
  });
}

const loader = new THREE.TextureLoader();
loader.crossOrigin = 'anonymous';

VEHICLES.forEach(v => {
  const g = new THREE.Group();

  // Load texture
  const texture = loader.load(v.image, (t) => {
    t.minFilter = THREE.LinearFilter;
    t.magFilter = THREE.LinearFilter;
  });

  // Main vehicle plane
  const planeMat = makeVehicleMaterial(texture);
  const plane = new THREE.Mesh(new THREE.PlaneGeometry(v.w, v.h), planeMat);
  plane.position.y = v.h/2 + 0.35;
  g.add(plane);

  // Solid backing plane (for glow effect behind)
  const backingMat = new THREE.MeshBasicMaterial({ color: v.accent, transparent: true, opacity: 0.06, blending: THREE.AdditiveBlending, depthWrite: false });
  const backing = new THREE.Mesh(new THREE.PlaneGeometry(v.w + 0.5, v.h + 0.5), backingMat);
  backing.position.set(0, v.h/2 + 0.35, -0.15);
  g.add(backing);

  // Ground glow disc
  const discGeo = new THREE.CircleGeometry(v.w * 0.9, 48);
  const discMat = new THREE.MeshBasicMaterial({ color: v.accent, transparent: true, opacity: 0.10, blending: THREE.AdditiveBlending, depthWrite: false, side: THREE.DoubleSide });
  const disc = new THREE.Mesh(discGeo, discMat);
  disc.rotation.x = -Math.PI / 2;
  disc.position.y = 0.03;
  g.add(disc);

  // Base ring (rotating)
  const ringGeo = new THREE.RingGeometry(v.w * 0.55, v.w * 0.62, 64);
  const ringMat = new THREE.MeshBasicMaterial({ color: v.accent, transparent: true, opacity: 0.85, side: THREE.DoubleSide, blending: THREE.AdditiveBlending, depthWrite: false });
  const ring = new THREE.Mesh(ringGeo, ringMat);
  ring.rotation.x = -Math.PI / 2;
  ring.position.y = 0.04;
  g.add(ring);

  // Inner ring (counter-rotating)
  const ring2Geo = new THREE.RingGeometry(v.w * 0.42, v.w * 0.46, 64);
  const ring2 = new THREE.Mesh(ring2Geo, new THREE.MeshBasicMaterial({ color: v.accent, transparent: true, opacity: 0.6, side: THREE.DoubleSide, blending: THREE.AdditiveBlending, depthWrite: false }));
  ring2.rotation.x = -Math.PI / 2;
  ring2.position.y = 0.045;
  g.add(ring2);

  // Pedestal base
  const ped = new THREE.Mesh(new THREE.CylinderGeometry(v.w * 0.55, v.w * 0.62, 0.2, 32), MAT.steelDark);
  ped.position.y = 0.1;
  ped.receiveShadow = true;
  g.add(ped);

  // Vertical light beam (subtle)
  const beamMat = new THREE.MeshBasicMaterial({ color: v.accent, transparent: true, opacity: 0.05, blending: THREE.AdditiveBlending, side: THREE.DoubleSide, depthWrite: false });
  const beam = new THREE.Mesh(new THREE.CylinderGeometry(v.w * 0.5, v.w * 0.5, v.h + 2, 24, 1, true), beamMat);
  beam.position.y = v.h/2 + 0.4;
  g.add(beam);

  // Overhead spot
  const spot = new THREE.SpotLight(v.accent, 1.3, 22, Math.PI / 4.5, 0.5, 2);
  spot.position.set(0, ROOM.h - 1.5, 0);
  spot.target.position.set(0, 1, 0);
  spot.castShadow = true;
  spot.shadow.mapSize.set(512, 512);
  spot.shadow.bias = -0.001;
  g.add(spot);
  g.add(spot.target);

  // Rim point light behind vehicle for edge glow
  const rimLight = new THREE.PointLight(v.rim, 0.9, 14);
  rimLight.position.set(0, v.h/2 + 0.4, -2);
  g.add(rimLight);

  // Base point light
  const baseLight = new THREE.PointLight(v.accent, 0.6, 8);
  baseLight.position.set(0, 0.5, 0);
  g.add(baseLight);

  g.position.set(v.x, 0, v.z);
  scene.add(g);

  vehicleDisplays[v.id] = { group: g, plane, ring, ring2, beam, backing, accent: v.accent, w: v.w, h: v.h };
});

/* ---------- DUST PARTICLES ---------- */
const DUST = 1600;
const dustGeo = new THREE.BufferGeometry();
const dustPos = new Float32Array(DUST * 3);
for(let i = 0; i < DUST * 3; i += 3){
  dustPos[i]     = (Math.random() - 0.5) * ROOM.w;
  dustPos[i + 1] = Math.random() * ROOM.h;
  dustPos[i + 2] = (Math.random() - 0.5) * ROOM.d;
}
dustGeo.setAttribute('position', new THREE.BufferAttribute(dustPos, 3));
const dust = new THREE.Points(dustGeo, new THREE.PointsMaterial({
  color: 0xffcf8a, size: 0.055, transparent: true, opacity: 0.5,
  blending: THREE.AdditiveBlending, depthWrite: false
}));
scene.add(dust);

/* ---------- AMBIENT ---------- */
scene.add(new THREE.AmbientLight(0x2a2418, 0.5));
scene.add(new THREE.HemisphereLight(0x30261c, 0x050505, 0.35));

/* ---------- MOUSE ---------- */
const mouse = { x: 0, y: 0 };
window.addEventListener('mousemove', e=>{
  mouse.x = (e.clientX / innerWidth  - 0.5) * 2;
  mouse.y = (e.clientY / innerHeight - 0.5) * 2;
});

/* ---------- CAMERA TARGET (animated by GSAP) ---------- */
const camTarget = { x: 0, y: 3.2, z: -10 };

/* ---------- ANIMATION LOOP ---------- */
let t = 0;
function animate(){
  requestAnimationFrame(animate);
  t += 0.016;

  // Dust drift
  const dPos = dust.geometry.attributes.position.array;
  for(let i = 0; i < dPos.length; i += 3){
    dPos[i + 1] += 0.005;
    dPos[i]     += Math.sin(t * 0.3 + i) * 0.0015;
    if(dPos[i + 1] > ROOM.h) dPos[i + 1] = 0;
  }
  dust.geometry.attributes.position.needsUpdate = true;

  // Lamp flicker
  lamps.forEach((l, i)=>{
    if(i === 4 || i === 5){
      const f = Math.random() > 0.98 ? 0.35 : 1;
      l.light.intensity = l.baseIntensity * f * (0.94 + Math.sin(t * 7 + i) * 0.06);
    } else {
      l.light.intensity = l.baseIntensity * (0.95 + Math.sin(t * 2 + i * 1.3) * 0.05);
    }
  });
  fluorescents.forEach((f) => {
    f.light.intensity = f.baseIntensity * (0.94 + Math.sin(t * 4 + f.offset) * 0.06);
  });

  // Rotate vehicle display rings + subtle bob
  Object.values(vehicleDisplays).forEach((v, i) => {
    v.ring.rotation.z  += 0.008;
    v.ring2.rotation.z -= 0.012;
    v.plane.position.y = v.h/2 + 0.35 + Math.sin(t * 0.8 + i * 2) * 0.05;
    v.backing.position.y = v.plane.position.y;
    // Pulse the backing glow
    v.backing.material.opacity = 0.06 + Math.sin(t * 1.2 + i) * 0.02;
  });

  // Camera mouse parallax (subtle) + fixed lookAt on animated target
  const targetCamX = camera.position.x; // GSAP controls position
  camera.lookAt(camTarget.x, camTarget.y, camTarget.z);

  // Very subtle mouse offset on top of GSAP position
  camera.rotation.x += mouse.y * 0.005;
  camera.rotation.y += -mouse.x * 0.005;

  renderer.render(scene, camera);
}
animate();

window.addEventListener('resize', ()=>{
  camera.aspect = innerWidth / innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(innerWidth, innerHeight);
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
});

/* ==========================================================
   GSAP SCROLLTRIGGER — CAMERA CHOREOGRAPHY
========================================================== */
gsap.registerPlugin(ScrollTrigger);

/* ---------- Hero entrance ---------- */
const heroTl = gsap.timeline({delay: 1.4});
heroTl
  .from('.kicker',     {opacity:0, y:20, duration:.7, ease:'power3.out'})
  .from('.hero h1',    {opacity:0, y:50, duration:1,  ease:'power4.out'}, '-=0.35')
  .from('.hero-sub',   {opacity:0, y:30, duration:.8, ease:'power3.out'}, '-=0.6')
  .from('.hstat',      {opacity:0, y:26, duration:.6, stagger:.1, ease:'power3.out'}, '-=0.5')
  .from('.scroll-cue', {opacity:0, duration:.6}, '-=0.3');

/* ---------- Hero fade on scroll ---------- */
gsap.to('.hero > *:not(.scroll-cue)', {
  scrollTrigger:{trigger:'.hero', start:'top top', end:'bottom top', scrub:1},
  opacity:0, y:-70, ease:'none'
});

/* ---------- Camera fly-through — the main event ---------- */
const cameraTL = gsap.timeline({
  scrollTrigger: {
    trigger: '#scroll-content',
    start: 'top top',
    end: 'bottom bottom',
    scrub: 1.5
  }
});

// Hero hold (camera stays wide)
cameraTL.to({}, { duration: 0.6 });

// Move to Meteor (bay 1, left)
cameraTL.to(camTarget, { x: -9, y: 3.0, z: -10, duration: 1.2, ease: 'power2.inOut' });
cameraTL.to(camera.position, { x: -9, y: 3.4, z: 3.5, duration: 1.2, ease: 'power2.inOut' }, '<');

// Hold at Meteor
cameraTL.to({}, { duration: 0.5 });

// Move to Access (bay 2, center)
cameraTL.to(camTarget, { x: 0, y: 3.0, z: -10, duration: 1.2, ease: 'power2.inOut' });
cameraTL.to(camera.position, { x: 0, y: 3.4, z: 3.5, duration: 1.2, ease: 'power2.inOut' }, '<');

// Hold at Access
cameraTL.to({}, { duration: 0.5 });

// Move to Alto (bay 3, right)
cameraTL.to(camTarget, { x: 9, y: 3.0, z: -10, duration: 1.2, ease: 'power2.inOut' });
cameraTL.to(camera.position, { x: 9, y: 3.4, z: 3.5, duration: 1.2, ease: 'power2.inOut' }, '<');

/* ---------- Section entrance animations ---------- */
document.querySelectorAll('.section-head').forEach(head=>{
  gsap.from(head.children, {
    opacity:0, y:40, duration:.9, stagger:.12, ease:'power3.out',
    scrollTrigger:{trigger:head, start:'top 88%', once:true}
  });
});

document.querySelectorAll('.bottom-bar').forEach(bar=>{
  const children = bar.children;
  gsap.from(children, {
    opacity:0, y:50, duration:.8, stagger:.15, ease:'power3.out',
    scrollTrigger:{trigger:bar, start:'top 90%', once:true}
  });
});

document.querySelectorAll('.specs-strip').forEach(strip=>{
  gsap.fromTo(strip.querySelectorAll('.spec-cell'),
    {opacity:0, y:40, scale:0.96},
    {opacity:1, y:0, scale:1, duration:.8, stagger:.08, ease:'power3.out',
      scrollTrigger:{trigger:strip, start:'top 92%', once:true}}
  );
});

/* ---------- Animated spec numbers ---------- */
document.querySelectorAll('.spec-cell .value').forEach(el=>{
  const target = parseFloat(el.dataset.target);
  const decimals = parseInt(el.dataset.decimals || '0');
  const unitEl = el.querySelector('.unit');
  const unitHTML = unitEl ? unitEl.outerHTML : '';
  const state = {v: 0};
  ScrollTrigger.create({
    trigger: el, start: 'top 92%', once: true,
    onEnter(){
      gsap.to(state, {
        v: target, duration: 1.8, ease:'power2.out',
        onUpdate(){ el.innerHTML = state.v.toFixed(decimals) + unitHTML; }
      });
    }
  });
});

/* ---------- Feature tags ---------- */
document.querySelectorAll('.features-row').forEach(row=>{
  gsap.fromTo(row.querySelectorAll('li'),
    {opacity:0, y:20, scale:0.9},
    {opacity:1, y:0, scale:1, duration:.55, stagger:.05, ease:'back.out(1.6)',
      scrollTrigger:{trigger:row, start:'top 94%', once:true}}
  );
});

/* ---------- Progress bar ---------- */
const progressBar = document.getElementById('progress');
gsap.to(progressBar, {
  scrollTrigger:{
    trigger:'#scroll-content',
    start:'top top', end:'bottom bottom', scrub:0.3,
    onUpdate:self=>{ progressBar.style.width = (self.progress * 100) + '%'; }
  }
});

/* ---------- Bay dots active state ---------- */
const bayDots = document.querySelectorAll('.bay-dot');
const baySections = [
  { id: 'hero',   el: '#hero' },
  { id: 'meteor', el: '#meteor' },
  { id: 'access', el: '#access' },
  { id: 'alto',   el: '#alto' }
];
baySections.forEach(section => {
  ScrollTrigger.create({
    trigger: section.el,
    start: 'top 50%',
    end: 'bottom 50%',
    onEnter: () => activateBayDot(section.id),
    onEnterBack: () => activateBayDot(section.id)
  });
});
function activateBayDot(id){
  bayDots.forEach(d => d.classList.toggle('active', d.dataset.bay === id));
}

/* ---------- Outro ---------- */
gsap.from('.outro h3, .outro p', {
  scrollTrigger:{trigger:'.outro', start:'top 88%', once:true},
  opacity:0, y:34, duration:.9, stagger:.15, ease:'power3.out'
});

/* ---------- Refresh on load ---------- */
window.addEventListener('load', ()=>ScrollTrigger.refresh());
