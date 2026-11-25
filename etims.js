/* ETIMS 2027 — interactions + 3D */
(function(){
const $ = s => document.querySelector(s);
const TRACKS = [
  ['Computer Science and Artificial Intelligence','AI, machine learning and deep learning; data science; cloud and high-performance computing; cybersecurity and blockchain; computer vision and NLP; software engineering','assets/g1.jpg'],
  ['Civil Engineering and Infrastructure','Structural, geotechnical, transportation and railway engineering; pavements; water resources and environmental engineering; construction management; advanced construction materials; geospatial technologies','assets/g2.jpg'],
  ['Electrical Engineering','Renewable energy; power systems and smart grids; power electronics and drives; electrical machines; energy storage; electric vehicles; energy management','assets/g3.jpg'],
  ['Mechanical and Manufacturing Engineering','Advanced and additive manufacturing; Industry 4.0 and smart manufacturing; robotics and automation; thermal and fluid engineering; automobile engineering; mechanical design and computational mechanics','assets/g4.jpg'],
  ['Electronics and Communication Engineering','Wireless and 5G/6G communication; IoT and embedded systems; VLSI; signal and image processing; antennas and microwave engineering; sensors; optical communication','assets/g5.jpg'],
  ['Applied Science','Applied and condensed-matter physics; photonics and thin films; nanomaterials and functional materials; electrochemistry and energy-storage materials; catalysis, polymers and green chemistry; environmental and analytical chemistry; mathematical modelling and numerical methods; optimization, statistics and cryptography','assets/g6.jpg'],
  ['Management','Technology and innovation management; operations and supply-chain management; project and construction management; entrepreneurship and start-up ecosystems; business analytics and decision sciences; HR and organisational management; financial management and FinTech; sustainable business and ESG practices','assets/g7.jpg'],
  ['Humanities and Library Science','English language, literature and linguistics; professional and technical communication; ethics, society and culture; digital humanities; library and information science; digital libraries and knowledge management; scholarly communication and research metrics; information literacy','assets/g8.jpg'],
];
const ADVISORS = [
  ['Dr. Kailash Chandra Ray','Associate Professor, Electrical Engineering','IIT Patna','p10'],
  ['Dr. Raju Halder','Associate Professor, Computer Science and Engineering','IIT Patna','p11'],
  ['Dr. Akhilendra Singh','Associate Professor, Mechanical Engineering','IIT Patna','p12'],
  ['Dr. Debashisha Jena','Professor, Electrical and Electronics Engineering','NIT Surathkal','p13'],
  ['Dr. Yatendra Kumar Singh','Associate Professor, Electrical Engineering','IIT Patna','p14'],
  ['Mr. Gopal Krishna','Assistant Professor, CSE (AI & Data Science)','GEC Munger','p15'],
  ['Mr. Chandan Kumar Sharma','Assistant Professor, Civil Engineering','GEC Bhojpur','p16'],
];

/* marquee */
const mqWords = ['Explore','Innovate','Collaborate','Build a Better Future','Science','Engineering','Management','Humanities','23–24 July 2027','NSIT Bihta'];
$('#mq').innerHTML = [...mqWords,...mqWords].map(w=>`<span>${w}</span>`).join('');

/* advisors */
$('#advGrid').innerHTML = ADVISORS.map((a,i)=>`<div class="adv rv d${i%4}"><img src="assets/${a[3]}.png" alt=""><div><h5>${a[0]}</h5><p>${a[1]}</p><span class="inst">${a[2]}</span></div></div>`).join('');

/* nav */
const nav=$('#nav'), prog=$('#progress');
$('#burger').onclick=()=>$('#menu').classList.toggle('open');
document.querySelectorAll('#menu a').forEach(a=>a.onclick=()=>$('#menu').classList.remove('open'));

/* countdown */
const target = new Date('2027-07-23T09:00:00+05:30').getTime();
function tick(){const d=Math.max(0,target-Date.now());$('#cd-d').textContent=Math.floor(d/864e5);$('#cd-h').textContent=Math.floor(d/36e5)%24;$('#cd-m').textContent=Math.floor(d/6e4)%60;}
tick(); setInterval(tick,30000);

/* reveal */
const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target);if(e.target.querySelector('[data-count]'))countUp(e.target);}}),{threshold:.15,rootMargin:'0px 0px -40px 0px'});
document.querySelectorAll('.rv,.tl').forEach((el,i)=>{ if(el.classList.contains('tl')) el.querySelector('.box').style.transitionDelay=(i%7)*0.09+'s'; io.observe(el);});
function countUp(root){root.querySelectorAll('[data-count]').forEach(el=>{const to=parseFloat(el.dataset.count),dec=+el.dataset.dec||0,from=to>1000?to-60:0,t0=performance.now();
  (function f(t){const p=Math.min(1,(t-t0)/1600),e=1-Math.pow(1-p,3);el.textContent=(from+(to-from)*e).toFixed(dec);if(p<1)requestAnimationFrame(f);})(t0);});}

/* tap-to-flip on touch */
document.querySelectorAll('.flip').forEach(f=>f.addEventListener('click',()=>f.classList.toggle('on')));

/* ---------- 3D track ring ---------- */
const ring=$('#ring'), N=TRACKS.length, step=360/N; let radius=Math.max(360, Math.min(520, innerWidth*0.36));
ring.innerHTML=TRACKS.map((t,i)=>`<div class="tcard" data-i="${i}"><img src="${t[2]}" alt=""><div class="tb"><div class="num">TRACK ${String(i+1).padStart(2,'0')}</div><h4>${t[0]}</h4></div></div>`).join('');
$('#dots').innerHTML=TRACKS.map((_,i)=>`<button aria-label="Track ${i+1}"></button>`).join('');
const cards=[...ring.children], dots=[...$('#dots').children];
let rot=0, targetRot=0, cur=0;
function layout(){radius=Math.max(innerWidth<620?250:340, Math.min(520, innerWidth*0.36));cards.forEach((c,i)=>c.style.transform=`rotateY(${i*step}deg) translateZ(${radius}px)`);}
layout(); addEventListener('resize',layout);
function setActive(i){cur=((i%N)+N)%N;const t=TRACKS[cur];$('#td-n').textContent='T'+(cur+1);$('#td-t').textContent=t[0];$('#td-d').textContent=t[1];
  cards.forEach((c,k)=>c.classList.toggle('active',k===cur));dots.forEach((d,k)=>d.classList.toggle('on',k===cur));}
function goTo(i){const diff=((i-cur)%N+N+N/2)%N-N/2;targetRot-=diff*step;setActive(i);}
$('#next').onclick=()=>goTo(cur+1); $('#prev').onclick=()=>goTo(cur-1);
dots.forEach((d,i)=>d.onclick=()=>goTo(i));
cards.forEach((c,i)=>c.onclick=()=>{if(!moved)goTo(i);});
setActive(0);
let drag=false,sx=0,sr=0,moved=false; const stage=$('#stage');
stage.addEventListener('pointerdown',e=>{drag=true;moved=false;sx=e.clientX;sr=targetRot;});
addEventListener('pointermove',e=>{if(!drag)return;const dx=e.clientX-sx;if(Math.abs(dx)>4)moved=true;targetRot=sr+dx*0.35;});
addEventListener('pointerup',()=>{if(!drag)return;drag=false;const idx=Math.round(-targetRot/step);targetRot=-idx*step;setActive(idx);});
let autoT=setInterval(()=>{if(!drag&&!stage.matches(':hover'))goTo(cur+1);},4200);
function ringLoop(){rot+=(targetRot-rot)*0.08;ring.style.transform=`translateZ(${-radius}px) rotateX(-6deg) rotateY(${rot}deg)`;
  cards.forEach((c,i)=>{let a=((i*step+rot)%360+360)%360;if(a>180)a-=360;const f=Math.abs(a)/180;c.style.filter=`brightness(${1-f*0.4}),opacity:Math.max(0.3,1-f)`;});
  requestAnimationFrame(ringLoop);}
ringLoop();

/* scroll effects */
const venueImg=$('#venueImg');
function onScroll(){const y=scrollY,h=document.documentElement.scrollHeight-innerHeight;prog.style.width=(y/h*100)+'%';nav.classList.add('solid');
  const r=venueImg.parentElement.getBoundingClientRect();if(r.top<innerHeight&&r.bottom>0){venueImg.style.transform=`translateY(${(r.top/innerHeight)*-80}px) scale(1.05)`;}}
addEventListener('scroll',onScroll,{passive:true}); onScroll();

/* ---------- THREE.JS HERO ---------- */
if(!window.THREE) return;
const canvas=$('#hero3d'), hero=$('.hero');
const renderer=new THREE.WebGLRenderer({canvas,antialias:true,alpha:true});
renderer.setPixelRatio(Math.min(devicePixelRatio,2));
const scene=new THREE.Scene(); scene.fog=new THREE.Fog(0x1a060c,14,34);
const camera=new THREE.PerspectiveCamera(42,1,0.1,100); camera.position.set(0,0,14);
const loader=new THREE.TextureLoader();
const group=new THREE.Group(); scene.add(group);

scene.add(new THREE.AmbientLight(0xffffff,0.55));
const key=new THREE.DirectionalLight(0xffe7b8,1.1); key.position.set(4,5,8); scene.add(key);
const rim=new THREE.PointLight(0xc9a24a,2.2,30); rim.position.set(-6,-2,4); scene.add(rim);

/* emblem medallion */
const medal=new THREE.Group(); group.add(medal);
const emTex=loader.load('assets/emblem.png'); emTex.anisotropy=8; if(THREE.sRGBEncoding) emTex.encoding=THREE.sRGBEncoding;
const R=2.6;
const goldMat=new THREE.MeshStandardMaterial({color:0xc9a24a,metalness:.9,roughness:.28});
const disc=new THREE.Mesh(new THREE.CylinderGeometry(R*1.05,R*1.05,0.32,96),[goldMat,new THREE.MeshStandardMaterial({color:0xfbf5f0,roughness:.6}),new THREE.MeshStandardMaterial({color:0x6e1a2e,roughness:.5})]);
disc.rotation.x=Math.PI/2; medal.add(disc);
const face=new THREE.Mesh(new THREE.CircleGeometry(R,96),new THREE.MeshBasicMaterial({map:emTex,transparent:true}));
face.position.z=0.17; medal.add(face);
const backLogo=loader.load('assets/logo.png'); if(THREE.sRGBEncoding) backLogo.encoding=THREE.sRGBEncoding;
const back=new THREE.Mesh(new THREE.PlaneGeometry(R*1.2,R*1.2),new THREE.MeshBasicMaterial({map:backLogo,transparent:true}));
back.position.z=-0.17; back.rotation.y=Math.PI; medal.add(back);
const torus=new THREE.Mesh(new THREE.TorusGeometry(R*1.05,0.07,16,128),goldMat); medal.add(torus);
const halo1=new THREE.Mesh(new THREE.TorusGeometry(R*1.45,0.012,8,180),new THREE.MeshBasicMaterial({color:0xe8cf8e,transparent:true,opacity:.55}));
const halo2=halo1.clone(); halo2.scale.setScalar(1.25); halo2.material=halo1.material.clone(); halo2.material.opacity=.25;
group.add(halo1,halo2);

/* orbiting track photo tiles */
const orbit=new THREE.Group(); group.add(orbit);
const tiles=[];
TRACKS.forEach((t,i)=>{const tx=loader.load(t[2]); if(THREE.sRGBEncoding) tx.encoding=THREE.sRGBEncoding;
  const m=new THREE.Mesh(new THREE.PlaneGeometry(1.7,1.05),new THREE.MeshBasicMaterial({map:tx,side:THREE.DoubleSide,transparent:true,opacity:.95}));
  const fr=new THREE.Mesh(new THREE.PlaneGeometry(1.8,1.15),new THREE.MeshBasicMaterial({color:0xc9a24a,side:THREE.DoubleSide})); fr.position.z=-0.01; m.add(fr);
  const a=i/TRACKS.length*Math.PI*2; m.userData={a,r:5.2,y:Math.sin(a*2)*0.8}; orbit.add(m); tiles.push(m);});
orbit.rotation.x=0.32;

/* particles */
const P=900, pos=new Float32Array(P*3);
for(let i=0;i<P;i++){const r=6+Math.random()*16,th=Math.random()*Math.PI*2,ph=Math.acos(2*Math.random()-1);pos[i*3]=r*Math.sin(ph)*Math.cos(th);pos[i*3+1]=r*Math.sin(ph)*Math.sin(th)*.6;pos[i*3+2]=r*Math.cos(ph)-6;}
const pg=new THREE.BufferGeometry(); pg.setAttribute('position',new THREE.BufferAttribute(pos,3));
const dotC=document.createElement('canvas');dotC.width=dotC.height=64;const dx=dotC.getContext('2d');const gr=dx.createRadialGradient(32,32,0,32,32,32);gr.addColorStop(0,'rgba(255,240,200,1)');gr.addColorStop(.4,'rgba(232,207,142,.5)');gr.addColorStop(1,'rgba(232,207,142,0)');dx.fillStyle=gr;dx.fillRect(0,0,64,64);
const pts=new THREE.Points(pg,new THREE.PointsMaterial({size:.16,map:new THREE.CanvasTexture(dotC),transparent:true,depthWrite:false,blending:THREE.AdditiveBlending}));
scene.add(pts);

let mx=0,my=0,tmx=0,tmy=0;
addEventListener('mousemove',e=>{tmx=e.clientX/innerWidth-.5;tmy=e.clientY/innerHeight-.5;});
function size(){const w=hero.clientWidth,h=hero.clientHeight;renderer.setSize(w,h,false);camera.aspect=w/h;camera.updateProjectionMatrix();
  const mobile=w<900; group.position.set(mobile?0:4.6,mobile?2.6:0,0); group.scale.setScalar(mobile?.62:1);}
size(); addEventListener('resize',size);

let visible=true; new IntersectionObserver(e=>visible=e[0].isIntersecting).observe(hero);
const clock=new THREE.Clock();
(function loop(){requestAnimationFrame(loop); if(!visible) return;
  const t=clock.getElapsedTime(); mx+=(tmx-mx)*.05; my+=(tmy-my)*.05;
  const sp=Math.min(1,scrollY/innerHeight);
  medal.rotation.y=Math.sin(t*.5)*.45+mx*.9 + sp*Math.PI;
  medal.rotation.x=my*.5+Math.sin(t*.7)*.08;
  medal.position.y=Math.sin(t*1.1)*.15;
  halo1.rotation.set(1.2+Math.sin(t*.3)*.2,t*.2,0); halo2.rotation.set(1.4,-t*.12,.3);
  tiles.forEach(m=>{const a=m.userData.a+t*.18;m.position.set(Math.cos(a)*m.userData.r,m.userData.y+Math.sin(t+a)*.2,Math.sin(a)*m.userData.r);m.lookAt(camera.position);});
  pts.rotation.y=t*.02+mx*.2; pts.rotation.x=my*.1;
  camera.position.x=mx*1.2; camera.position.y=-my*0.8; camera.position.z=14+sp*4; camera.lookAt(0,0,0);
  renderer.render(scene,camera);
})();
})();

/* ---------- SCROLL ANIMATIONS (GSAP ScrollTrigger) ---------- */
(function(){
  if(!window.gsap||!window.ScrollTrigger) return;
  gsap.registerPlugin(ScrollTrigger);
  const st=(t,end)=>({trigger:t,start:'top bottom',end:end||'top 60%'});

  /* sections: small-to-big + fade on scroll */
  document.querySelectorAll('.sec').forEach(sec=>{
    gsap.fromTo(sec,{autoAlpha:0,y:32,scale:.97,transformOrigin:'center 22vh'},
                   {autoAlpha:1,y:0,scale:1,scrollTrigger:st(sec,'top top')});
  });

  /* people: background shading + photos small-to-big on scroll */
  document.querySelectorAll('.person,.co,.adv').forEach(c=>{
    const shade=document.createElement('div'); shade.className='shade'; c.appendChild(shade);
    gsap.fromTo(shade,{autoAlpha:0},{autoAlpha:.4,scrollTrigger:st(c)});
    const img=c.querySelector('img'); if(img) gsap.fromTo(img,{scale:.88},{scale:1,scrollTrigger:st(c)});
  });

  /* about photo: small-to-big + zoom out on scroll */
  const aboutCard=document.querySelector('#aboutCard');
  if(aboutCard){
    gsap.fromTo(aboutCard.querySelector('img'),{autoAlpha:.92,scale:1},{autoAlpha:1,scale:1.1,scrollTrigger:st(aboutCard.parentElement)});
    gsap.to(aboutCard,{scale:0.4,scrollTrigger:{trigger:aboutCard.parentElement,start:'top bottom',end:'bottom top',scrub:true}});
  }

  /* track cards: photos small-to-big */
  document.querySelectorAll('.tcard').forEach(c=>{
    gsap.fromTo(c.querySelector('img'),{scale:.96},{scale:1,scrollTrigger:st(c)});
  });

  /* recalc triggers when ring images settle */
  document.querySelectorAll('.tcard img').forEach(i=>i.addEventListener('load',()=>ScrollTrigger.refresh(),{once:true}));
})();

/* shining animated background (GSAP) */
(function(){if(!window.gsap)return;
const glow=document.getElementById('bgGlow'); if(!glow)return;
gsap.fromTo(glow,{'--g1':'rgba(140,42,64,.42)','--g2':'rgba(232,207,142,.15)'},
               {repeat:-1,yoyo:true,repeatDelay:2,duration:9,ease:'sine.inOut',
                '--g1':'rgba(201,162,74,.68)','--g2':'rgba(140,42,64,.5)'});})();
