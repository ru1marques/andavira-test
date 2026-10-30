const NS='http://www.w3.org/2000/svg',S=1.6,C={x:142.5,y:146.5},RN=410,RC=950;
const NODES=[
{id:'t',piece:16,short:'Territórios',title:'Territórios e Comunidades',desc:'Onde a atividade acontece e com quem se relaciona.',kids:[
{title:'Porto',desc:'Localização institucional identificada no documento.'},
{title:'Viseu',desc:'Filial que reforça a proximidade com profissionais e parceiros da região.'},
{title:'Angra do Heroísmo',desc:'Filial que amplia a presença territorial da cooperativa nos Açores.'},
{title:'Descentralização Cultural',desc:'Desenvolvimento e circulação de iniciativas em diferentes regiões.'},
{title:'Comunidades Locais',desc:'Projetos e relações construídos com pessoas e organizações dos territórios.'},
{title:'Património e Identidade',desc:'Valorização de contextos, patrimónios e expressões culturais.'},
{title:'Turismo Cultural',desc:'Experiências que relacionam cultura, música, património e descoberta.'},
{title:'Mobilidade Cultural',desc:'Aproximação de projetos a novos lugares e públicos.'}
]},
{id:'e',piece:12,short:'Estruturas',title:'Estruturas e Marcas',desc:'NETWORK 03 — Diferentes identidades, uma estrutura comum.',body:'A Andavira acolhe iniciativas especializadas com identidade e campos de atuação próprios, proporcionando uma base cooperativa de recursos, competências e ferramentas para o seu desenvolvimento.',kids:[
{title:'Rodopio — Agência',number:'01',desc:'Desenvolvimento, produção, representação e circulação de projetos artísticos, estabelecendo relações entre artistas, programadores, organizações e territórios.'},
{title:'Toada — Editora',number:'02',desc:'Criação, edição e valorização de projetos musicais e editoriais, com atenção à pedagogia e à transmissão de conhecimento.'},
{title:'World Music Bus — Turismo Cultural',number:'03',desc:'Experiências que aproximam música, património e território, criando propostas de descoberta e circulação cultural.'},
{title:'Identidade Própria',desc:'Cada estrutura desenvolve uma linguagem e um posicionamento específicos.'},
{title:'Recursos Partilhados',desc:'Aproveitamento das competências e dos meios comuns da cooperativa.'},
{title:'Gestão e Organização',desc:'Apoio administrativo, operacional e de desenvolvimento de atividade.'},
{title:'Complementaridade',desc:'Articulação de diferentes especializações culturais.'},
{title:'Desenvolvimento e Crescimento',desc:'Condições para consolidar e fazer evoluir iniciativas especializadas.'}
]},
{id:'p',piece:9,short:'Projetos',title:'Projetos e Iniciativas',desc:'Iniciativas criadas, promovidas ou acompanhadas pela Andavira.',kids:[
{title:'Projetos Próprios',desc:'Iniciativas criadas ou promovidas diretamente pela Andavira.'},
{title:'Projetos Acompanhados',desc:'Iniciativas que recebem apoio de produção, circulação ou desenvolvimento.'},
{title:'Criação Artística',desc:'Desenvolvimento de novas propostas, obras, conteúdos e experiências culturais.'},
{title:'Desenvolvimento de Projetos',desc:'Conceção, planeamento, orçamentação e estruturação.'},
{title:'Produção Cultural',desc:'Produção executiva, contratação, equipas, logística e acompanhamento de atividades.'},
{title:'Circulação Artística',desc:'Representação, programação, mobilidade e digressões.'},
{title:'Edição e Distribuição',desc:'Projetos musicais, produção fonográfica, publicações e conteúdos editoriais.'},
{title:'Financiamento e Sustentabilidade',desc:'Identificação de oportunidades, candidaturas e modelos de continuidade.'}
]},
{id:'c',piece:6,short:'Pessoas',title:'Pessoas e Cooperadores',desc:'O coração da cooperativa e o elemento mais importante para a atividade.',kids:[
{title:'Artistas e Criadores',desc:'Profissionais responsáveis pela criação e desenvolvimento artístico.'},
{title:'Produtores e Técnicos',desc:'Competências de produção, operação, logística e acompanhamento técnico.'},
{title:'Formadores e Investigadores',desc:'Profissionais ligados à formação, pedagogia e produção de conhecimento.'},
{title:'Profissionais Multidisciplinares',desc:'Pessoas de diferentes áreas que contribuem para o desenvolvimento dos projetos.'},
{title:'Partilha de Recursos',desc:'Acesso a competências, ferramentas e meios comuns.'},
{title:'Colaboração entre Cooperadores',desc:'Desenvolvimento conjunto de projetos e iniciativas.'},
{title:'Participação Cooperativa',desc:'Envolvimento nas decisões e na construção da estrutura comum.'},
{title:'Desenvolvimento Profissional',desc:'Formação, oportunidades e condições para fortalecer percursos profissionais.'}
]},
{id:'r',piece:3,short:'Parceiros',title:'Parceiros e Redes',desc:'Quem faz parte da cooperativa e mobiliza competências.',kids:[
{title:'Municípios e Entidades Públicas',desc:'Relações para programação, projetos e desenvolvimento cultural.'},
{title:'Festivais e Equipamentos Culturais',desc:'Articulação para apresentação, produção e circulação artística.'},
{title:'Associações e Cooperativas',desc:'Intercooperação e desenvolvimento de iniciativas conjuntas.'},
{title:'Escolas e Instituições de Ensino',desc:'Colaboração em formação, pedagogia e transmissão de conhecimento.'},
{title:'Empresas e Organizações',desc:'Parcerias para desenvolvimento e concretização de projetos.'},
{title:'Redes de Programação',desc:'Contactos e articulação com agentes de programação cultural.'},
{title:'Recursos e Competências Partilhadas',desc:'Colaboração entre diferentes entidades e profissionais.'},
{title:'Novas Oportunidades',desc:'Desenvolvimento de projetos, parcerias e iniciativas colaborativas.'}
]}
];
const $=s=>document.querySelector(s),stage=$('#stage'),world=$('#world'),edges=$('#edges'),amb=$('#amb');
const reduce=matchMedia('(prefers-reduced-motion:reduce)').matches;
const embedded=new URLSearchParams(location.search).get('embedded')==='1'&&window.parent!==window;
const preview=new URLSearchParams(location.search).get('preview')==='1';
const scrollPage=(x,y)=>window.parent.postMessage({type:'andavira:ecosystem-scroll',x,y},'*');
if(embedded){document.documentElement.dataset.theme='light';stage.classList.add('embedded');$('.hint').textContent='Arrasta para explorar.';}
const lam=s=>s.toUpperCase().replace(/A/g,'Λ');
const el=(t,a,p)=>{const e=document.createElementNS(NS,t);for(const k in a)e.setAttribute(k,a[k]);p&&p.appendChild(e);return e};
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
  const e=el('path',{d:`M${u.x*236} ${u.y*236}L${n.N.x-u.x*42} ${n.N.y-u.y*42}`,class:'e p',pathLength:1},edges);e.style.setProperty('--d',(1.2+i*.12)+'s');n.edge=e;
  const b=document.createElement(preview?'div':'button');b.className='n p';b.dataset.s=n.s;b.style.cssText=`left:${n.N.x}px;top:${n.N.y}px;--d:${1.6+i*.12}s`;b.setAttribute('aria-label',n.title);
  b.innerHTML=`<span class="lab"><span class="t" aria-hidden="true">${lam(n.title)}</span><span class="d">${n.desc}</span>${n.body?`<span class="d network-body">${n.body}</span>`:''}</span>`;
  if(!preview)b.onclick=()=>focus(i);world.appendChild(b);n.btn=b;
  if(preview){n.K=[];return;}
  const m=n.kids.length;n.K=n.kids.map((t,j)=>{
    const detailed=typeof t==='object';
    const aa=a+(j-(m-1)/2)*.33,r=RC+[0,75,-35,55][j%4],P={x:r*Math.cos(aa),y:r*Math.sin(aa)};
    const k=document.createElement('div');k.className='k n';k.dataset.s=Math.cos(aa)<0?'l':'r';k.style.cssText=`left:${P.x}px;top:${P.y}px;--d:${2.2+i*.1}s`;
    if(detailed)k.classList.add('has-description');
    if(detailed&&t.number)k.classList.add('featured');
    k.innerHTML=`<i></i><span>${detailed?`${t.number?`<b class="network-number">${t.number}</b>`:''}${t.title}<small>${t.desc}</small>`:t}</span>`;world.appendChild(k);
    const ke=el('path',{d:`M${n.N.x+u.x*44} ${n.N.y+u.y*44}L${P.x} ${P.y}`,class:'e',pathLength:1},edges);ke.style.setProperty('--d',(2+i*.1+j*.08)+'s');
    return{P,k,ke,detailed}});
});
// Afasta apenas os pontos cujos textos colidem, preservando a distribuição radial.
function separateLabels(n){
  const rect=(P,label)=>({x:P.x+label.offsetLeft,y:P.y+label.offsetTop,w:label.offsetWidth,h:label.offsetHeight});
  const move=(item,dx,dy)=>{item.P.x+=dx;item.P.y+=dy};
  const separate=(a,b,fixed=false)=>{
    const A=rect(a.P,a.label),B=rect(b.P,b.label),gap=56;
    const dx=(A.w+B.w)/2+gap-Math.abs(A.x+A.w/2-B.x-B.w/2);
    const dy=(A.h+B.h)/2+gap-Math.abs(A.y+A.h/2-B.y-B.h/2);
    if(dx<=0||dy<=0)return false;
    const share=fixed?1:.5;
    if(dx<dy){const shift=(A.x+A.w/2<B.x+B.w/2?-1:1)*(dx+1);move(a,shift*share,0);if(!fixed)move(b,-shift*share,0)}
    else{const shift=(A.y+A.h/2<B.y+B.h/2?-1:1)*(dy+1);move(a,0,shift*share);if(!fixed)move(b,0,-shift*share)}
    return true;
  };
  const items=n.K.map(k=>({...k,label:k.k.querySelector('span')}));
  const main={P:n.N,label:n.btn.querySelector('.lab')};
  for(let pass=0;pass<120;pass++){
    let changed=false;
    items.forEach((item,i)=>{
      if(separate(item,main,true))changed=true;
      for(let j=i+1;j<items.length;j++)if(separate(item,items[j]))changed=true;
    });
    if(!changed)break;
  }
  n.K.forEach(k=>{
    k.k.style.left=`${k.P.x}px`;k.k.style.top=`${k.P.y}px`;
    k.ke.setAttribute('d',`M${n.N.x+n.u.x*44} ${n.N.y+n.u.y*44}L${k.P.x} ${k.P.y}`);
  });
}
NODES.forEach(separateLabels);

// ligações entre vizinhos (anel exterior) e pontos de fundo
if(!preview)NODES.forEach((n,i)=>{const o=NODES[(i+1)%NODES.length],A=n.K[n.K.length-1].P,B=o.K[0].P;
  const e=el('path',{d:`M${A.x} ${A.y}L${B.x} ${B.y}`,class:'e x'},edges);e.style.setProperty('--d','3s')});
let sd=7;const rnd=()=>{sd=(sd*16807)%2147483647;return sd/2147483647};
const pts=NODES.flatMap(n=>n.K.map(k=>k.P));
for(let i=0;i<(preview?0:30);i++){const a=rnd()*6.283,r=640+rnd()*820,P={x:r*Math.cos(a),y:r*Math.sin(a)*.78};
  if(pts.some(q=>Math.hypot(q.x-P.x,q.y-P.y)<110))continue;
  el('circle',{cx:P.x,cy:P.y,r:2.2+rnd()*2,class:'amb'},amb);
  pts.filter(q=>q!==P).map(q=>[Math.hypot(q.x-P.x,q.y-P.y),q]).sort((x,y)=>x[0]-y[0]).slice(0,2).forEach(([d,q])=>{if(d<420)el('line',{x1:P.x,y1:P.y,x2:q.x,y2:q.y,stroke:'var(--hair)','stroke-width':1,'vector-effect':'non-scaling-stroke'},amb)});
  pts.push(P)}

// navegação
const bar=$('#bar');
const mk=(t,f)=>{const b=document.createElement('button');b.textContent=t;b.onclick=f;if(!preview)bar.appendChild(b);return b};
const bAll=mk('Visão geral',()=>focus(null)),bN=NODES.map((n,i)=>mk(n.short,()=>focus(i)));

// câmara
let W,H,cam={x:0,y:0,k:1},raf,cur=null;
const clamp=(v,a,b)=>Math.min(b,Math.max(a,v));
let previewProgress=0;
function setPreviewProgress(value){
  previewProgress=reduce?1:clamp(value,0,1);
  stage.classList.toggle('broken',previewProgress>0);
  pieces.forEach((p,i)=>{
    const t=clamp((previewProgress-i*.012)/.8,0,1),n=NODES.find(n=>n.piece===i);
    const dx=n?n.N.x/S-(bb[i].x-C.x):Math.cos(bb[i].a)*16;
    const dy=n?n.N.y/S-(bb[i].y-C.y):Math.sin(bb[i].a)*16;
    p.style.transform=`translate(${dx*t}px,${dy*t}px) rotate(${n?0:(i%2?5:-5)*t}deg)`;
  });
  NODES.forEach((n,i)=>{
    n.btn.style.opacity=clamp((previewProgress-.4-i*.035)/.35,0,1);
    n.edge.style.strokeDashoffset=1-clamp((previewProgress-.2-i*.035)/.5,0,1);
  });
}
const mapHeight=()=>H-(embedded&&!preview?100:0);
const apply=()=>world.style.transform=`translate(${W/2-cam.x*cam.k}px,${mapHeight()/2-cam.y*cam.k}px) scale(${cam.k})`;
function fly(t,ms=1300){cancelAnimationFrame(raf);if(reduce)ms=1;const s={...cam},t0=performance.now();
  const step=now=>{let u=Math.min(1,(now-t0)/ms);u=u<.5?4*u*u*u:1-Math.pow(-2*u+2,3)/2;
    cam.x=s.x+(t.x-s.x)*u;cam.y=s.y+(t.y-s.y)*u;cam.k=s.k*Math.pow(t.k/s.k,u);apply();if(u<1)raf=requestAnimationFrame(step)};raf=requestAnimationFrame(step)}
function view(rects,max,align=.5){let x0=1e9,y0=1e9,x1=-1e9,y1=-1e9;rects.forEach(r=>{x0=Math.min(x0,r[0]);y0=Math.min(y0,r[1]);x1=Math.max(x1,r[2]);y1=Math.max(y1,r[3])});
  const k=clamp(Math.min(Math.max(1,W-64)/(x1-x0),Math.max(1,mapHeight()-64)/(y1-y0)),.05,max);
  const free=Math.max(0,W-64-(x1-x0)*k);
  return{x:(x0+x1)/2+free*(.5-align)/k,y:(y0+y1)/2,k};}
const lab=(P,s,w)=>[P.x-(s==='l'?w:30),P.y-60,P.x+(s==='l'?30:w),P.y+(P.h||70)];
const target=i=>{const sm=W<700;
  if(preview){
    let halfWidth=270,halfHeight=270;
    NODES.forEach(n=>{
      const label=n.btn.querySelector('.lab');
      const x=n.N.x+label.offsetLeft,y=n.N.y+label.offsetTop;
      halfWidth=Math.max(halfWidth,Math.abs(x),Math.abs(x+label.offsetWidth),Math.abs(n.N.x)+50);
      halfHeight=Math.max(halfHeight,Math.abs(y),Math.abs(y+label.offsetHeight),Math.abs(n.N.y)+50);
    });
    return{x:0,y:0,k:Math.max(.05,Math.min((W-64)/(2*halfWidth),(mapHeight()-64)/(2*halfHeight),1.1))};
  }
  if(i===null){const overview=view(NODES.map(n=>lab({...n.N,h:90},n.s,sm?230:350)),1.1);overview.k*=embedded?1.12:.9;return overview;}
  const n=NODES[i];
  // Mede os textos no espaço da rede, antes da escala da câmara.
  const bounds=(P,label)=>{
    const x=P.x+label.offsetLeft,y=P.y+label.offsetTop;
    return[Math.min(P.x-12,x),Math.min(P.y-12,y),Math.max(P.x+12,x+label.offsetWidth),Math.max(P.y+12,y+label.offsetHeight)];
  };
  return view([bounds(n.N,n.btn.querySelector('.lab')),...n.K.map(k=>bounds(k.P,k.k.querySelector('span')))],1.35,.15);
};
function focus(i,ms){cur=i;
  if(i===null)delete stage.dataset.focus;else stage.dataset.focus=i;
  NODES.forEach((n,j)=>{n.btn.classList.toggle('act',j===i);n.edge.classList.toggle('act',j===i);n.K.forEach(k=>{k.k.classList.toggle('on',j===i);k.ke.classList.toggle('act',j===i)});bN[j].classList.toggle('on',j===i)});
  if(i!==null)separateLabels(NODES[i]);
  bAll.classList.toggle('on',i===null);fly(target(i),ms)}

// interação: arrastar, roda e pinça
const ptr=new Map();let moved=0,pd=0;
stage.addEventListener('pointerdown',e=>{if(e.target.closest('.p,.hud'))return;ptr.set(e.pointerId,{x:e.clientX,y:e.clientY});stage.setPointerCapture(e.pointerId);cancelAnimationFrame(raf);moved=0;pd=ptr.size===2?dist():0;stage.classList.add('drag')});
const dist=()=>{const [a,b]=[...ptr.values()];return Math.hypot(a.x-b.x,a.y-b.y)};
stage.addEventListener('pointermove',e=>{const p=ptr.get(e.pointerId);if(!p)return;
  const dx=e.clientX-p.x,dy=e.clientY-p.y;p.x=e.clientX;p.y=e.clientY;moved+=Math.abs(dx)+Math.abs(dy);
  if(preview){if(embedded)scrollPage(0,-dy);return;}
  if(ptr.size===2){const d=dist();if(pd)zoomAt(e.clientX,e.clientY,d/pd);pd=d}else if(embedded&&e.pointerType==='touch'&&Math.abs(dy)>Math.abs(dx)){scrollPage(0,-dy)}else{cam.x-=dx/cam.k;cam.y-=dy/cam.k;apply()}});
const up=e=>{if(!ptr.delete(e.pointerId))return;pd=0;if(!ptr.size){stage.classList.remove('drag');if(moved<5&&cur!==null&&!e.target.closest('#logo'))focus(null)}};
stage.addEventListener('pointerup',up);stage.addEventListener('pointercancel',up);
function zoomAt(px,py,f){const bounds=stage.getBoundingClientRect();px-=bounds.left;py-=bounds.top;const nk=clamp(cam.k*f,.25,2.4),wx=cam.x+(px-W/2)/cam.k,wy=cam.y+(py-mapHeight()/2)/cam.k;cam.k=nk;cam.x=wx-(px-W/2)/nk;cam.y=wy-(py-mapHeight()/2)/nk;apply()}
document.addEventListener('wheel',e=>{if(e.ctrlKey||e.metaKey)return;e.preventDefault();if(embedded){const unit=e.deltaMode===1?16:e.deltaMode===2?H:1;scrollPage(e.deltaX*unit,e.deltaY*unit);return}cancelAnimationFrame(raf);zoomAt(e.clientX,e.clientY,Math.exp(-e.deltaY*.0015))},{passive:false});
$('#logo').addEventListener('click',()=>{if(!preview&&moved<5)breakLogo(!stage.classList.contains('broken'))});
addEventListener('keydown',e=>{const n=NODES.length;
  if(preview)return;
  if(e.key==='Escape')focus(null);
  else if(e.key==='ArrowRight'||e.key==='ArrowDown')focus(cur===null?0:(cur+1)%n);
  else if(e.key==='ArrowLeft'||e.key==='ArrowUp')focus(cur===null?n-1:(cur+n-1)%n)});
addEventListener('resize',()=>{W=stage.clientWidth;H=stage.clientHeight;if(stage.classList.contains('broken'))fly(target(cur),1);else{cam=target(null);apply()}});

// A abertura automática começa uma única vez, quando o mapa fica visível.
W=stage.clientWidth;H=stage.clientHeight;
cam=target(null);
apply();bAll.classList.add('on');
let openingStarted=false;
function startOpening(){
  if(openingStarted)return;
  openingStarted=true;
  if(reduce||!preview){
    stage.classList.add('initializing');
    breakLogo(true);cam=target(null);apply();
    stage.getBoundingClientRect();stage.classList.remove('initializing');
    return;
  }
  setTimeout(()=>{breakLogo(true)},600);
}
if(embedded){
  addEventListener('message',event=>{
    if(event.source!==window.parent)return;
    if(preview&&event.data?.type==='andavira:ecosystem-progress'&&Number.isFinite(event.data.progress))setPreviewProgress(event.data.progress);
    else if(!preview&&event.data?.type==='andavira:ecosystem-start')startOpening();
  });
  if(preview)setPreviewProgress(0);
  window.parent.postMessage({type:'andavira:ecosystem-ready'},'*');
}else startOpening();

// Confirma o espaçamento com as medidas finais da fonte carregada.
document.fonts.ready.then(()=>{
  NODES.forEach(separateLabels);
  if(preview){cam=target(null);apply();setPreviewProgress(previewProgress);return;}
  const ring=[...edges.querySelectorAll('.e.x')];
  NODES.forEach((n,i)=>{
    const next=NODES[(i+1)%NODES.length],A=n.K[n.K.length-1].P,B=next.K[0].P;
    ring[i].setAttribute('d',`M${A.x} ${A.y}L${B.x} ${B.y}`);
  });
  if(cur!==null)fly(target(cur),1);
});
