const NS='http://www.w3.org/2000/svg',S=1.6,C={x:142.5,y:146.5},RN=410,RC=830;
const IMG={t:'assets/foto-territorios.jpg',c:'assets/foto-pessoas.jpg'};
const NODES=[
{id:'t',piece:16,short:'Territórios',title:'Territórios e Comunidades',desc:'Onde a atividade acontece e com quem se relaciona.',kids:['Bailes e encontros','Espaços parceiros','Comunidades locais','Aprender em roda']},
{id:'e',piece:12,short:'Estruturas',title:'Estruturas e Conhecimento',desc:'O modelo, as ferramentas e os saberes que sustentam o trabalho.',kids:['Gestão cooperativa','Formação','Documentação','Recursos partilhados']},
{id:'p',piece:9,short:'Projetos',title:'Projetos e Iniciativas',desc:'Iniciativas com identidade própria, como Rodopio e Toada.',kids:['Rodopio','Toada','Novas ideias']},
{id:'c',piece:6,short:'Pessoas',title:'Pessoas e Cooperadores',desc:'O coração da cooperativa e o elemento mais importante para a atividade.',kids:['Cooperadores','Equipa','Artistas','Voluntários']},
{id:'r',piece:3,short:'Parceiros',title:'Parceiros e Redes',desc:'Quem faz parte da cooperativa e mobiliza competências.',kids:['Entidades locais','Redes culturais','Apoios','Colaborações']}
];
const $=s=>document.querySelector(s),stage=$('#stage'),world=$('#world'),edges=$('#edges'),pulses=$('#pulses'),amb=$('#amb');
const reduce=matchMedia('(prefers-reduced-motion:reduce)').matches;
const lam=s=>s.toUpperCase().replace(/A/g,'Λ');
const el=(t,a,p)=>{const e=document.createElementNS(NS,t);for(const k in a)e.setAttribute(k,a[k]);p&&p.appendChild(e);return e};
const curve=(a,b,bend)=>{const mx=(a.x+b.x)/2,my=(a.y+b.y)/2,dx=b.x-a.x,dy=b.y-a.y,l=Math.hypot(dx,dy)||1;return`M${a.x} ${a.y}Q${mx-dy/l*bend} ${my+dx/l*bend} ${b.x} ${b.y}`};
const pieces=[...document.querySelectorAll('#logo path')];
const bb=pieces.map(p=>{const b=p.getBBox();const x=b.x+b.width/2,y=b.y+b.height/2;return{x,y,a:Math.atan2(y-C.y,x-C.x)}});
const used=new Set(NODES.map(n=>n.piece));

// peças do logo: 5 chevrons viram marcadores, as restantes afastam-se
function breakLogo(on){
  pieces.forEach((p,i)=>{
    p.style.transitionDelay=on?(i*0.05)+'s':'0s';
    if(!on){p.style.transform='';return}
    const n=NODES.find(n=>n.piece===i);
    if(n){p.style.transform=`translate(${n.N.x/S-(bb[i].x-C.x)}px,${n.N.y/S-(bb[i].y-C.y)}px)`}
    else{const a=bb[i].a;p.style.transform=`translate(${Math.cos(a)*16}px,${Math.sin(a)*16}px) rotate(${i%2?5:-5}deg)`}
  });
  stage.classList.toggle('broken',on);
}

// construir rede
NODES.forEach((n,i)=>{
  const a=bb[n.piece].a,u={x:Math.cos(a),y:Math.sin(a)};n.a=a;n.u=u;
  n.N={x:RN*u.x,y:RN*u.y};n.s=u.x<0?'l':'r';
  const e=el('path',{d:curve({x:u.x*236,y:u.y*236},{x:n.N.x-u.x*42,y:n.N.y-u.y*42},28),class:'e p',pathLength:1},edges);e.style.setProperty('--d',(1.2+i*.12)+'s');n.edge=e;
  if(!reduce){const c=el('circle',{r:3.5,class:'pulse'},pulses);const m=el('animateMotion',{dur:(5+i*1.3)+'s',begin:(i*1.1)+'s',repeatCount:'indefinite',path:e.getAttribute('d')},c)}
  const b=document.createElement('button');b.className='n p';b.dataset.s=n.s;b.style.cssText=`left:${n.N.x}px;top:${n.N.y}px;--d:${1.6+i*.12}s`;b.setAttribute('aria-label',n.title);
  b.innerHTML=`<span class="lab"><span class="t" aria-hidden="true">${lam(n.title)}</span><span class="d">${n.desc}</span>${IMG[n.id]?`<img class="ph" alt="" src="${IMG[n.id]}">`:''}</span>`;
  b.onclick=()=>focus(i);world.appendChild(b);n.btn=b;
  const m=n.kids.length;n.K=n.kids.map((t,j)=>{
    const aa=a+(j-(m-1)/2)*.3,r=RC+[0,60,-30,45][j%4],P={x:r*Math.cos(aa),y:r*Math.sin(aa)};
    const k=document.createElement('div');k.className='k n';k.dataset.s=Math.cos(aa)<0?'l':'r';k.style.cssText=`left:${P.x}px;top:${P.y}px;--d:${2.2+i*.1}s`;
    k.innerHTML=`<i></i><span>${t}</span>`;world.appendChild(k);
    const ke=el('path',{d:curve({x:n.N.x+u.x*44,y:n.N.y+u.y*44},P,(j%2?-1:1)*34),class:'e',pathLength:1},edges);ke.style.setProperty('--d',(2+i*.1+j*.08)+'s');
    return{P,k,ke}});
});
// ligações entre vizinhos (anel exterior) e pontos de fundo
NODES.forEach((n,i)=>{const o=NODES[(i+1)%NODES.length],A=n.K[n.K.length-1].P,B=o.K[0].P;
  const e=el('path',{d:curve(A,B,-120),class:'e x'},edges);e.style.setProperty('--d','3s')});
let sd=7;const rnd=()=>{sd=(sd*16807)%2147483647;return sd/2147483647};
const pts=NODES.flatMap(n=>n.K.map(k=>k.P));
for(let i=0;i<30;i++){const a=rnd()*6.283,r=640+rnd()*820,P={x:r*Math.cos(a),y:r*Math.sin(a)*.78};
  if(pts.some(q=>Math.hypot(q.x-P.x,q.y-P.y)<110))continue;
  el('circle',{cx:P.x,cy:P.y,r:2.2+rnd()*2,class:'amb'},amb);
  pts.filter(q=>q!==P).map(q=>[Math.hypot(q.x-P.x,q.y-P.y),q]).sort((x,y)=>x[0]-y[0]).slice(0,2).forEach(([d,q])=>{if(d<420)el('line',{x1:P.x,y1:P.y,x2:q.x,y2:q.y,stroke:'var(--hair)','stroke-width':1,'vector-effect':'non-scaling-stroke'},amb)});
  pts.push(P)}

// navegação
const bar=$('#bar');
const mk=(t,f)=>{const b=document.createElement('button');b.textContent=t;b.onclick=f;bar.appendChild(b);return b};
const bAll=mk('Visão geral',()=>focus(null)),bN=NODES.map((n,i)=>mk(n.short,()=>focus(i)));
$('#back').onclick=()=>focus(null);

// câmara
let W,H,cam={x:0,y:0,k:1},raf,cur=null;
const clamp=(v,a,b)=>Math.min(b,Math.max(a,v));
const apply=()=>world.style.transform=`translate(${W/2-cam.x*cam.k}px,${H/2-cam.y*cam.k}px) scale(${cam.k})`;
function fly(t,ms=1300){cancelAnimationFrame(raf);if(reduce)ms=1;const s={...cam},t0=performance.now();
  const step=now=>{let u=Math.min(1,(now-t0)/ms);u=u<.5?4*u*u*u:1-Math.pow(-2*u+2,3)/2;
    cam.x=s.x+(t.x-s.x)*u;cam.y=s.y+(t.y-s.y)*u;cam.k=s.k*Math.pow(t.k/s.k,u);apply();if(u<1)raf=requestAnimationFrame(step)};raf=requestAnimationFrame(step)}
function view(rects,max){let x0=1e9,y0=1e9,x1=-1e9,y1=-1e9;rects.forEach(r=>{x0=Math.min(x0,r[0]);y0=Math.min(y0,r[1]);x1=Math.max(x1,r[2]);y1=Math.max(y1,r[3])});
  return{x:(x0+x1)/2,y:(y0+y1)/2,k:clamp(Math.min(W/(x1-x0),(H-90)/(y1-y0)),.25,max)}}
const lab=(P,s,w)=>[P.x-(s==='l'?w:30),P.y-60,P.x+(s==='l'?30:w),P.y+(P.h||70)];
const target=i=>{const sm=W<700;
  if(i===null)return view(NODES.map(n=>lab({...n.N,h:IMG[n.id]?200:90},n.s,sm?230:350)),1.1);
  const n=NODES[i];return view([lab({...n.N,h:IMG[n.id]?210:100},n.s,sm?230:350),...n.K.map(k=>lab(k.P,Math.cos(Math.atan2(k.P.y,k.P.x))<0?'l':'r',sm?170:220))],1.35)};
function focus(i,ms){cur=i;
  if(i===null)delete stage.dataset.focus;else stage.dataset.focus=i;
  NODES.forEach((n,j)=>{n.btn.classList.toggle('act',j===i);n.edge.classList.toggle('act',j===i);n.K.forEach(k=>{k.k.classList.toggle('on',j===i);k.ke.classList.toggle('act',j===i)});bN[j].classList.toggle('on',j===i)});
  bAll.classList.toggle('on',i===null);fly(target(i),ms)}

// interação: arrastar, roda e pinça
const ptr=new Map();let moved=0,pd=0;
stage.addEventListener('pointerdown',e=>{if(e.target.closest('.p,.hud'))return;ptr.set(e.pointerId,{x:e.clientX,y:e.clientY});stage.setPointerCapture(e.pointerId);cancelAnimationFrame(raf);moved=0;pd=ptr.size===2?dist():0;stage.classList.add('drag')});
const dist=()=>{const [a,b]=[...ptr.values()];return Math.hypot(a.x-b.x,a.y-b.y)};
stage.addEventListener('pointermove',e=>{const p=ptr.get(e.pointerId);if(!p)return;
  const dx=e.clientX-p.x,dy=e.clientY-p.y;p.x=e.clientX;p.y=e.clientY;moved+=Math.abs(dx)+Math.abs(dy);
  if(ptr.size===2){const d=dist();if(pd)zoomAt(e.clientX,e.clientY,d/pd);pd=d}else{cam.x-=dx/cam.k;cam.y-=dy/cam.k;apply()}});
const up=e=>{if(!ptr.delete(e.pointerId))return;pd=0;if(!ptr.size){stage.classList.remove('drag');if(moved<5&&cur!==null&&!e.target.closest('#logo'))focus(null)}};
stage.addEventListener('pointerup',up);stage.addEventListener('pointercancel',up);
function zoomAt(px,py,f){const nk=clamp(cam.k*f,.25,2.4),wx=cam.x+(px-W/2)/cam.k,wy=cam.y+(py-H/2)/cam.k;cam.k=nk;cam.x=wx-(px-W/2)/nk;cam.y=wy-(py-H/2)/nk;apply()}
stage.addEventListener('wheel',e=>{e.preventDefault();cancelAnimationFrame(raf);zoomAt(e.clientX,e.clientY,Math.exp(-e.deltaY*(e.ctrlKey?.01:.0015)))},{passive:false});
$('#logo').addEventListener('click',()=>{if(moved<5)breakLogo(!stage.classList.contains('broken'))});
addEventListener('keydown',e=>{const n=NODES.length;
  if(e.key==='Escape')focus(null);
  else if(e.key==='ArrowRight'||e.key==='ArrowDown')focus(cur===null?0:(cur+1)%n);
  else if(e.key==='ArrowLeft'||e.key==='ArrowUp')focus(cur===null?n-1:(cur+n-1)%n)});
addEventListener('resize',()=>{W=stage.clientWidth;H=stage.clientHeight;fly(target(cur),1)});

// abertura: o logo inteiro, depois parte-se e a câmara afasta
W=stage.clientWidth;H=stage.clientHeight;
const ov=target(null);cam={x:0,y:0,k:Math.min(Math.min(W,H)/520,1.6)};apply();bAll.classList.add('on');
setTimeout(()=>{breakLogo(true);fly(ov,2600)},reduce?0:900);
