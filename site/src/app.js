(function(){
"use strict";
const EXAM=new Date("2026-11-07T14:00:00+08:00").getTime();
const $=(s,r=document)=>r.querySelector(s),$$=(s,r=document)=>[...r.querySelectorAll(s)];
const esc=s=>String(s).replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
const strip=s=>String(s).replace(/<[^>]+>/g,"");
const shuffle=a=>{for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a;};
const KEY="crimdesk1:";
const store={get(k,d){try{const v=localStorage.getItem(KEY+k);return v==null?d:JSON.parse(v);}catch(e){return d;}},set(k,v){try{localStorage.setItem(KEY+k,JSON.stringify(v));}catch(e){}}};
const KIT=["Blue book or notebook inserts","1/4 index card (3 × 5 in), name written <b>surname first</b>","Envelope","Stapler","Sign pen or fountain pen, <b>blue or black</b> (bring a spare)"];
let kit=store.get("kit",{});
let srs=store.get("srs",{}),fix=store.get("fix",{}),read=store.get("read2",{}),stats=store.get("stats",{rev:0,streak:0,best:0,days:{}}),sxdone=store.get("sx",{}),notes=store.get("notes",{});
const save=()=>{store.set("srs",srs);store.set("fix",fix);store.set("stats",stats);store.set("read2",read);store.set("sx",sxdone);};

// ---------- topics / cases ----------
const TOPIC={},TOPIC_NAME={};TOPICS.forEach(t=>{TOPIC[t.k]=t;TOPIC_NAME[t.k]=t.n;});
const SEC_OF={};TOPICS.forEach(t=>t.sec.forEach((s,i)=>SEC_OF[s.id]={t,s,i}));
const chProg=t=>{const n=t.sec.length,r=t.sec.filter(s=>read[s.id]).length;return{n,r,p:n?r/n:0};};
const ART_TOPIC={"1":"intro","2":"a2","3":"a3","4":"a4a","5":"a5","6":"a6","7":"a7","8":"a8","9":"a9","10":"a10","11":"a11"};
const CASE={};CASES.forEach(c=>CASE[c.id]=c);
const SHORT={bull:"Bull",vanwilsem:"Van Wilsem",wongcheng:"Wong Cheng",lookchaw:"Look Chaw",ahsing:"Ah Sing",lollo:"Lol-lo",ahchong:"Ah Chong",oanis:"Oanis",magsumbol:"Magsumbol",gervero:"Gervero",iligan:"Iligan",mananquil:"Mananquil",brobst:"Brobst",garcia:"Garcia",balmores:"Balmores",intod:"Intod",domasian:"Domasian",jacinto:"Jacinto",eduave:"Eduave",orita:"Orita",campuhan:"Campuhan",adiao:"Adiao",valenzuela:"Valenzuela",lamahang:"Lamahang",salvilla:"Salvilla",borinaga:"Borinaga",sypio:"Sy Pio",ravelo:"Ravelo",kalalo:"Kalalo",boholst:"Boholst-Caballero",alconga:"Alconga",mack:"Mack",sumicad:"Sumicad",genosa:"Genosa",luague:"Luague",delacruz:"De la Cruz",jaurigue:"Jaurigue",apolinar:"Apolinar",bumanglag:"Bumanglag",narvaez:"Narvaez",chuahiong:"Chua Hiong",pelayo:"Pelayo",esmedia:"Esmedia",normahernandez:"Norma Hernandez",dudley:"Dudley",ty:"Ty",delima:"Delima",belbes:"Belbes",beronilla:"Beronilla",agao:"Agao"};
const BY_SHORT={};Object.entries(SHORT).forEach(([id,s])=>BY_SHORT[s.toLowerCase()]=id);
const HC={g:"Liable / conviction",r:"Acquitted / justified",y:"Modified (crime, stage or circumstance)",b:"Principle"};
const hook=c=>`<span class="hk hk-${c.hc}" title="${HC[c.hc]}">${esc(c.h)}</span>`;
// where each case is discussed in the textbook
const CASE_SEC={};TOPICS.forEach(t=>t.sec.forEach(s=>s.b.forEach(b=>{if(b.k==="case"&&!CASE_SEC[b.id])CASE_SEC[b.id]=s.id;})));

// ---------- cards ----------
const CARDS={},DECK={codal:[],elements:[],cases:[],latin:[]};
CODAL.forEach(ar=>ar.p.forEach((para,pi)=>{let bi=0;para.replace(/\[\[(.+?)\]\]/g,()=>{const id=`c-${ar.a}-${pi}-${bi}`;CARDS[id]={id,deck:"codal",art:ar.a,t:ART_TOPIC[ar.a],ar,pi,bi};DECK.codal.push(id);bi++;return"";});}));
ELEMENTS.forEach(L=>L.i.forEach((_,ii)=>{const id=`e-${L.id}-${ii}`;CARDS[id]={id,deck:"elements",t:L.t,L,ii};DECK.elements.push(id);}));
const DIRS={cr:"Case → doctrine",fc:"Facts → case",dc:"Doctrine → case",fr:"Facts → ruling & why"};
CASES.forEach(c=>Object.keys(DIRS).forEach(d=>{const id=`k-${c.id}-${d}`;CARDS[id]={id,deck:"cases",t:c.t,c,dir:d};DECK.cases.push(id);}));
MAXIMS.forEach(x=>["lm","ml"].forEach(d=>{const id=`l-${x.id}-${d}`;CARDS[id]={id,deck:"latin",t:x.t,x,dir:d};DECK.latin.push(id);}));
const maximCard=x=>`<div class="mx-card"><div class="mx-la">${x.la}${x.sp?' <span class="mx-sp">Spanish</span>':""}</div><div class="mx-lit">“${x.lit.replace(/^“|”$/g,"")}”</div><div class="mx-m"><span class="lbl">Meaning</span> ${x.m}</div><div class="mx-app"><span class="lbl">Application</span> ${x.app}</div></div>`;

// ---------- SRS ----------
const now=()=>Date.now(),DAY=864e5;
const isDue=id=>{const s=srs[id];return s&&s.due<=now();};
function grade(id,g){
  const s=srs[id]||{ivl:0,ease:2.3,reps:0,due:0};
  if(g===1){s.ivl=0;s.ease=Math.max(1.3,s.ease-.2);s.due=now()+2*6e4;s.lapses=(s.lapses||0)+1;}
  else if(g===2){s.ivl=Math.max(.3,s.ivl*1.2);s.ease=Math.max(1.3,s.ease-.15);}
  else if(g===3){s.ivl=s.reps===0?.5:Math.max(1,s.ivl*s.ease);}
  else{s.ivl=s.reps===0?2:s.ivl*s.ease*1.4;s.ease=Math.min(2.8,s.ease+.15);}
  s.ivl=Math.min(s.ivl,4);if(g>1)s.due=now()+s.ivl*DAY;s.reps++;srs[id]=s;
  if(g===1)fix[id]=0;else if(id in fix&&g>=3){fix[id]++;if(fix[id]>=2)delete fix[id];}
  stats.rev++;const dk=new Date().toDateString();stats.days[dk]=(stats.days[dk]||0)+1;
  if(g>=3){stats.streak++;stats.best=Math.max(stats.best,stats.streak);}else stats.streak=0;
  save();
}
function buildRound(ids,n=20){
  const due=ids.filter(isDue).sort((a,b)=>srs[a].due-srs[b].due),fresh=ids.filter(i=>!srs[i]),later=ids.filter(i=>srs[i]&&!isDue(i)).sort((a,b)=>srs[a].due-srs[b].due),fx=ids.filter(i=>i in fix);
  return shuffle([...new Set([...fx,...due,...shuffle(fresh),...later])].slice(0,n));
}

// ---------- block rendering ----------
function codalHTML(a,ps){
  const ar=CODAL.find(x=>x.a===a);if(!ar)return"";
  const idx=ps&&ps.length?ps:ar.p.map((_,i)=>i);
  const label=ps&&ps.length&&!(ps.length===1&&ps[0]===0)?`Art. ${a}${ps.filter(i=>i>0).length&&a!=="3"&&a!=="6"&&a!=="8"&&a!=="9"&&a!=="5"?"("+ps.filter(i=>i>0).join(", ")+")":""}`:`Art. ${a}`;
  return `<div class="tb-codal"><div class="tb-codal-h"><span class="mono">Codal</span><span class="tb-codal-t">${label}. ${esc(ar.t)}</span></div>${idx.map(i=>`<p>${ar.p[i].replace(/\[\[(.+?)\]\]/g,'<span class="key">$1</span>')}</p>`).join("")}${ar.n&&(!ps||ps.includes(2))?`<div class="tb-codal-n">⚠ ${ar.n}</div>`:""}</div>`;
}
const linkCases=html=>html.replace(/<i>([^<]+)<\/i>/g,(m,t)=>{const id=BY_SHORT[t.trim().toLowerCase()];return id?`<i class="cl" data-case="${id}">${t}</i>`:m;});
function caseCard(id,why){
  const c=CASE[id];if(!c)return"";
  return `<article class="tb-case hc-${c.hc}"><div class="tb-case-h"><span class="tb-case-tag">Case</span><button class="tb-case-n" data-case="${id}">${esc(c.n)}</button>${hook(c)}<span class="tb-case-c">${esc(c.c)}</span></div>
  ${why?`<div class="tb-case-why">${why}</div>`:""}
  <div class="tb-case-b"><div class="tb-case-f"><span class="lbl">Facts</span> ${c.f}</div>
  <div class="tb-case-r"><span class="lbl">Held</span> ${c.r}</div>
  <div class="tb-case-w"><span class="lbl">Why</span> ${c.w}</div>
  <div class="tb-case-d"><span class="lbl">Doctrine</span> ${c.d}</div>
  ${c.k&&c.k.length?`<details class="tb-nits"><summary>Recit nitpicks (${c.k.length})</summary><ul>${c.k.map(x=>`<li>${x}</li>`).join("")}</ul></details>`:""}
  ${c.x?`<div class="tb-flag">⚠ ${c.x}</div>`:""}</div></article>`;
}
function gateHTML(gid){const G=GATES[gid];if(!G)return"";return `<div class="gt" data-gate="${gid}"><div class="gt-h"><span class="mono">Decision gate</span><b>${G.n}</b></div><div class="gt-body"></div></div>`;}
function runGate(el){
  const G=GATES[el.dataset.gate],body=$(".gt-body",el),path=[];
  function show(id){const nd=G.nodes[id];body.innerHTML=`${path.length?`<div class="gt-path">${path.join(" → ")}</div>`:""}<div class="gt-q">${nd.q}</div><div class="cd-row"><button class="cd-btn sm pri" data-a="y">Yes</button><button class="cd-btn sm" data-a="n">No</button>${path.length?'<button class="cd-btn sm ghost" data-a="r">Restart</button>':""}</div>`;
    body.onclick=e=>{const a=e.target.dataset.a;if(!a)return;if(a==="r"){path.length=0;return show(G.start);}const nx=nd[a];path.push(a==="y"?"Yes":"No");if(typeof nx==="string")show(nx);else end(nx);};}
  function end(x){const tone={g:"t-green",r:"t-red",y:"t-gold",b:"t-blue"}[x.tone]||"t-blue";body.innerHTML=`<div class="gt-path">${path.join(" → ")}</div><div class="gt-end ${tone}">${x.end}</div><div class="cd-row" style="margin-top:8px"><button class="cd-btn sm ghost" data-a="r">Restart</button></div>`;body.onclick=e=>{if(e.target.dataset.a==="r"){path.length=0;show(G.start);}};}
  show(G.start);
}
function vizHTML(id){const v=VIZ[id];if(!v)return"";return `<div class="vz-wrap" data-viz="${id}">${typeof v==="function"?v():v.html()}</div>`;}
function block(b){
  switch(b.k){
   case"p":return `<p>${b.x}</p>`;
   case"key":return `<aside class="tb-call c-key"><div class="tb-call-t">${b.t.startsWith("★")?`<span class="star">★</span>${b.t.slice(1)}`:b.t}</div><div>${b.x}</div></aside>`;
   case"trap":return `<aside class="tb-call c-trap"><div class="tb-call-t">⚠ ${b.t}</div><div>${b.x}</div></aside>`;
   case"dist":return `<aside class="tb-call c-dist"><div class="tb-call-t">⇄ ${b.t}</div><div>${b.x}</div></aside>`;
   case"ex":return `<aside class="tb-call c-ex"><div class="tb-call-t">✎ ${b.t}</div><div>${b.x}</div></aside>`;
   case"case":return caseCard(b.id,b.why);
   case"viz":return vizHTML(b.id);
   case"codal":return codalHTML(b.a,b.ps);
   case"req":return `<div class="tb-req"><div class="tb-req-t">${b.t}</div><ol>${b.items.map(([n,g])=>`<li><div class="n">${n}</div>${g?`<div class="g">${g}</div>`:""}</li>`).join("")}</ol></div>`;
   case"ul":return `<ul class="tb-ul">${b.x.map(x=>`<li>${x}</li>`).join("")}</ul>`;
   case"tbl":return `<div class="tblw"><table class="tb-t"><thead><tr>${b.head.map(h=>`<th>${h}</th>`).join("")}</tr></thead><tbody>${b.rows.map(r=>`<tr>${r.map(c=>`<td>${c}</td>`).join("")}</tr>`).join("")}</tbody></table></div>`;
   case"exam":return `<div class="tb-exam"><div class="mono">On the exam, write</div><div>${b.x}</div></div>`;
   case"drill":return `<div class="tb-drill"><div class="tb-drill-t">Change one fact <span class="cd-muted">tap to reveal</span></div>${b.x.map(([q,a])=>`<details><summary>${q}</summary><div class="ans">${a}</div></details>`).join("")}</div>`;
   case"gate":return gateHTML(b.id);
   case"maxims":return `<div class="mx-grid">${MAXIMS.filter(x=>x.g===b.g).map(maximCard).join("")}</div>`;
  }return"";
}

// ---------- case modal ----------
function openCase(id){
  const c=CASE[id];if(!c)return;const sec=CASE_SEC[id]&&SEC_OF[CASE_SEC[id]];
  const bg=document.createElement("div");bg.className="md-bg";
  bg.innerHTML=`<div class="md" role="dialog" aria-label="${esc(c.n)}"><div class="cd-row" style="justify-content:space-between"><span class="mono">${esc(TOPIC_NAME[c.t]||"")} · ${esc(c.g||"")}</span><button class="cd-ic" data-x aria-label="Close">✕</button></div>${caseCard(id)}
  ${sec?`<button class="cd-btn sm" data-goto="${sec.s.id}">Read it in context: ${esc(sec.t.n)} → ${esc(sec.s.t)}</button>`:""}</div>`;
  bg.addEventListener("click",e=>{if(e.target===bg||e.target.hasAttribute("data-x")){bg.remove();return;}const g=e.target.closest("[data-goto]");if(g){bg.remove();openSec(g.dataset.goto);}});
  document.body.appendChild(bg);
}
document.addEventListener("click",e=>{const t=e.target.closest("[data-case]");if(t&&!t.closest(".md")){e.preventDefault();openCase(t.dataset.case);}});

// ---------- navigation ----------
const V={};let tab=store.get("tab","today");
function go(t,arg){tab=t;store.set("tab",t);$$(".cd-tab").forEach(b=>b.classList.toggle("on",b.dataset.tab===t));const m=$("main");m.innerHTML="";m.className="v-"+t;V[t](m,arg);if(!(t==="review"&&arg&&arg.sec))window.scrollTo(0,0);}
function openSec(secId){const o=SEC_OF[secId];if(!o)return;go("review",{ch:o.t.k,sec:secId});}

// ---------- TODAY ----------
const PLAN=[
{d:"2026-11-02",lbl:"Mon 2 Nov",x:"Started: Chapters 0, 2, 3 and 4 (exam method, Intro & Art. 1, Art. 2, Art. 3). Codal cloze: Arts. 1–3.",ch:"a2"},
{d:"2026-11-03",lbl:"Tue 3 Nov",x:"Read the <b>updated Chapter 0</b> (Sir's format, IRAC, the confusable pairs) and the <b>new Chapter 1, Introductory readings</b>. Then finish Art. 2 and Art. 3. Elements deck: the readings lists.",ch:"method"},
{d:"2026-11-04",lbl:"Wed 4 Nov",x:"Chapters 5–8: Art. 4(1), Art. 4(2), Art. 5 and <b>Art. 6</b> (12 cases). Gates for Arts. 4 and 6. Cases drill: Facts → ruling & why.",ch:"a4a"},
{d:"2026-11-05",lbl:"Thu 5 Nov",x:"Chapters 9–12 (Arts. 7–10), then Chapter 13, <b>Art. 11</b> (20 cases). Codal cloze: Art. 11, word for word. Practice writing on the right-hand pages only.",ch:"a11"},
{d:"2026-11-06",lbl:"Fri 6 Nov",x:"<b>Mock exam A under exam conditions</b>: 5 questions, 2 hours, IRAC, right-hand pages only. Check against the model answers, then Mock B's problems. Clear the fix list. Pack the exam kit. Sleep by 1:00 a.m.",go:"samplex"},
{d:"2026-11-07",lbl:"Sat 7 Nov",x:"Morning: fix list → the readings and elements lists → the confusable pairs (Chapter 0) → Latin maxims (Appendix A). Bring the kit. <b>Exam 2:00–4:00 p.m.</b> Do the objective question first.",ch:"method"}];
function countdown(){const ms=EXAM-now();if(ms<=0)return"Exam day";const d=Math.floor(ms/DAY),h=Math.floor(ms%DAY/36e5),m=Math.floor(ms%36e5/6e4);return `<b>${d}d ${h}h ${m}m</b> to the midterm`;}
V.today=m=>{
  const all=Object.keys(CARDS),seen=all.filter(i=>srs[i]).length,due=all.filter(isDue).length,fx=Object.keys(fix).length;
  const todayKey=new Date().toLocaleDateString("en-CA",{timeZone:"Asia/Manila"});
  const totalSec=TOPICS.reduce((n,t)=>n+t.sec.length,0),readSec=Object.keys(read).filter(k=>read[k]&&SEC_OF[k]).length;
  const last=store.get("lastSec",null);const lastO=last&&SEC_OF[last];
  const deckStat=d=>`${DECK[d].filter(i=>srs[i]).length}/${DECK[d].length}`;
  const sxMiss=Object.entries(sxdone).filter(([,v])=>v==="miss").map(([k])=>k);
  m.innerHTML=`<section class="hero"><div class="hero-in"><div class="mono hero-k">Criminal Law 1 · Prof. Gutierrez · Midterm</div>
  <h1>Your Crim 1 textbook, Arts. 1–11</h1><p class="hero-p">Every article explained from the codal and Reyes, with each syllabus case placed where its doctrine is taught, plus drills to make it stick. Saturday, 7 November, 2:00–4:00 p.m. · ${countdown()}.</p>
  <div class="cd-row"><button class="cd-btn pri lg" data-open="${lastO?lastO.s.id:TOPICS[1].sec[0].id}">${lastO?`Continue reading: ${esc(lastO.t.n.split(" · ")[0])} → ${esc(lastO.s.t)}`:"Start reading: Chapter 1"}</button><button class="cd-btn lg" id="start">▶ Drill session</button></div>
  <div class="hero-prog"><div class="pg"><i style="width:${readSec/totalSec*100}%"></i></div><span>${readSec} of ${totalSec} sections read</span></div></div></section>
  <div class="cd-card kit"><div class="cd-row" style="justify-content:space-between"><div><div class="mono">Exam kit · Saturday</div><b class="disp" style="font-size:1.1rem">Pack these, then tick them off</b></div><span class="cd-muted" style="font-size:.85rem">5 questions · 24 min each · IRAC · right-hand pages only</span></div>
  <div class="kit-list">${KIT.map((k,i)=>`<label><input type="checkbox" data-kit="${i}" ${kit[i]?"checked":""}><span>${k}</span></label>`).join("")}</div></div>
  <h2 class="sec-h">Contents</h2>
  <div class="toc-grid">${TOPICS.map(t=>{const p=chProg(t);return `<button class="toc-card ${p.r===p.n&&p.n?"done":""}" data-ch="${t.k}"><span class="toc-num">${t.num}</span><span class="toc-body"><b>${esc(t.n)}</b><small>${esc(t.s)}</small><span class="pg sm"><i style="width:${p.p*100}%"></i></span><small>${p.r}/${p.n} sections${t.sec.reduce((n,s)=>n+s.b.filter(b=>b.k==="case").length,0)?` · ${t.sec.reduce((n,s)=>n+s.b.filter(b=>b.k==="case").length,0)} case cards`:""}</small></span></button>`;}).join("")}</div>
  <h2 class="sec-h">How to use this desk</h2>
  <div class="how"><div><span>1</span><b>Read</b> a chapter in the Reviewer. The codal comes first, then the explanation, then the cases right where they apply. Mark each section read.</div><div><span>2</span><b>Drill</b> the same day: codal cloze for the exact words, the elements deck for requisites, and the cases for facts → ruling.</div><div><span>3</span><b>Apply</b> in the Samplex: write first, then compare with the model answer. Misses go to your redo list.</div></div>
  <div class="cd-grid" style="margin-top:16px">
   <div class="cd-card"><div class="mono">Due now</div><div class="cd-stat">${due}</div><div class="cd-muted">cards across decks</div></div>
   <div class="cd-card"><div class="mono">Fix list</div><div class="cd-stat">${fx}</div><div class="cd-muted">missed; get each right twice</div></div>
   <div class="cd-card"><div class="mono">Cards seen</div><div class="cd-stat">${seen}<small>/${all.length}</small></div><div class="cd-muted">latin ${deckStat("latin")} · codal ${deckStat("codal")} · elements ${deckStat("elements")} · cases ${deckStat("cases")}</div></div>
   <div class="cd-card"><div class="mono">Streak</div><div class="cd-stat">${stats.streak}</div><div class="cd-muted">best ${stats.best} · ${stats.rev} reviews</div></div></div>
  ${sxMiss.length?`<div class="cd-card"><div class="mono">Samplex to redo</div>${sxMiss.map(id=>{const e=ESSAYS.find(x=>x.id===id);return e?`<button class="cd-chip" data-sx="${id}">${esc(e.set)} · ${esc(e.src.split("·")[0])}</button>`:"";}).join("")}</div>`:""}
  <h2 class="sec-h">Study plan</h2><div class="cd-plan">${PLAN.map(p=>`<div class="cd-day ${p.d===todayKey?"today":""}"><b>${p.lbl}${p.d===todayKey?' <span class="today-tag">today</span>':""}</b><div>${p.x} <button class="cd-btn sm" ${p.ch?`data-ch="${p.ch}"`:`data-go="${p.go}"`}>Open</button></div></div>`).join("")}</div>
  <p class="cd-muted legend">Progress is saved in this browser only. Case hooks: <span class="hk hk-g">liable</span> <span class="hk hk-r">acquitted / justified</span> <span class="hk hk-y">modified</span> <span class="hk hk-b">principle</span></p>`;
  $("#start",m).onclick=()=>drill(buildRound(all,25),"Session","today",all);
  m.onchange=e=>{const k=e.target.closest("[data-kit]");if(k){kit[k.dataset.kit]=k.checked;store.set("kit",kit);}};
  m.onclick=e=>{const o=e.target.closest("[data-open]");if(o)return openSec(o.dataset.open);const c=e.target.closest("[data-ch]");if(c)return go("review",{ch:c.dataset.ch});const g=e.target.closest("[data-go]");if(g)return go(g.dataset.go);const sx=e.target.closest("[data-sx]");if(sx)go("samplex",sx.dataset.sx);};
};

// ---------- REVIEWER (textbook) ----------
let hideKeys=false,spy=null;
V.review=(m,arg)=>{
  arg=arg||{};let key=arg.ch||store.get("rvTopic","method");if(!TOPIC[key])key="method";store.set("rvTopic",key);
  const T=TOPIC[key],ti=TOPICS.indexOf(T),p=chProg(T);
  const secHTML=(s,i)=>`<section class="tb-sec" id="sec-${s.id}" data-sec="${s.id}"><h3 class="tb-sec-h"><span class="tb-sec-n">${T.num}.${i+1}</span>${esc(s.t)}</h3>${linkCases(s.b.map(block).join(""))}
   <div class="tb-sec-end"><button class="cd-btn sm ${read[s.id]?"done":""}" data-read="${s.id}">${read[s.id]?"✓ Read":"Mark section read"}</button></div></section>`;
  m.innerHTML=`<div class="tb-wrap"><nav class="tb-toc" aria-label="Contents"><div class="tb-toc-in">${TOPICS.map(t=>{const q=chProg(t);return `<div class="tb-toc-ch ${t.k===key?"on":""}"><button data-ch="${t.k}"><span class="n">${t.num}</span><span class="t">${esc(t.n)}</span>${q.r===q.n&&q.n?'<span class="ok">✓</span>':""}</button>${t.k===key?`<div class="tb-toc-secs">${t.sec.map((s,i)=>`<a href="#sec-${s.id}" data-jump="${s.id}" class="${read[s.id]?"rd":""}">${t.num}.${i+1} ${esc(s.t)}</a>`).join("")}${t.end.length?`<a href="#review" data-jump="__end">Chapter review</a>`:""}</div>`:""}</div>`;}).join("")}</div></nav>
  <article class="tb ${hideKeys?"hidekeys":""}">
   <header class="tb-ch"><div class="tb-ch-num">Chapter ${T.num}</div><h2>${esc(T.n)}</h2><div class="tb-ch-sub">${esc(T.s)}</div>
    <p class="tb-lead">${linkCases(T.lead)}</p>
    ${T.goals&&T.goals.length?`<div class="tb-goals"><div class="mono">By the end of this chapter you can</div><ul>${T.goals.map(g=>`<li>${g}</li>`).join("")}</ul></div>`:""}
    <div class="tb-ch-tools"><div class="pg"><i style="width:${p.p*100}%"></i></div><span class="cd-muted">${p.r}/${p.n} read</span><button class="cd-btn sm ghost" id="hide">${hideKeys?"Show key terms":"Hide key terms"}</button></div></header>
   ${T.sec.map(secHTML).join("")}
   ${T.end.length?`<section class="tb-sec tb-review" id="review"><h3 class="tb-sec-h"><span class="tb-sec-n">✓</span>Chapter review</h3>${linkCases(T.end.map(block).join(""))}</section>`:""}
   <nav class="tb-pager">${ti>0?`<button class="cd-btn" data-ch="${TOPICS[ti-1].k}">← ${esc(TOPICS[ti-1].n)}</button>`:"<span></span>"}${ti<TOPICS.length-1?`<button class="cd-btn pri" data-ch="${TOPICS[ti+1].k}">${esc(TOPICS[ti+1].n)} →</button>`:""}</nav>
  </article></div>`;
  $$(".gt",m).forEach(runGate);
  $$("[data-viz]",m).forEach(el=>{const v=VIZ[el.dataset.viz];if(v&&v.init)v.init(el);});
  m.onclick=e=>{
    const c=e.target.closest("[data-ch]");if(c){go("review",{ch:c.dataset.ch});return;}
    const j=e.target.closest("[data-jump]");if(j){e.preventDefault();const el=j.dataset.jump==="__end"?$("#review",m):$("#sec-"+j.dataset.jump,m);if(el)el.scrollIntoView({behavior:"smooth",block:"start"});return;}
    const r=e.target.closest("[data-read]");if(r){const id=r.dataset.read;read[id]=!read[id];save();r.classList.toggle("done",!!read[id]);r.textContent=read[id]?"✓ Read":"Mark section read";const a=$(`[data-jump="${id}"]`,m);if(a)a.classList.toggle("rd",!!read[id]);const q=chProg(T);$(".tb-ch-tools .pg i",m).style.width=q.p*100+"%";$(".tb-ch-tools span",m).textContent=`${q.r}/${q.n} read`;if(read[id]){const nx=r.closest(".tb-sec").nextElementSibling;}return;}
    if(e.target.id==="hide"){hideKeys=!hideKeys;$(".tb",m).classList.toggle("hidekeys",hideKeys);e.target.textContent=hideKeys?"Show key terms":"Hide key terms";return;}
    if(hideKeys){const k=e.target.closest(".tb .key, .tb mark, .tb-call b, .tb p b");if(k)k.classList.toggle("show");}
  };
  if(spy)spy.disconnect();
  if("IntersectionObserver" in window){spy=new IntersectionObserver(es=>{es.forEach(en=>{if(en.isIntersecting){const id=en.target.dataset.sec;store.set("lastSec",id);$$(".tb-toc-secs a",m).forEach(a=>a.classList.toggle("cur",a.dataset.jump===id));}});},{rootMargin:"-30% 0px -60% 0px"});$$(".tb-sec[data-sec]",m).forEach(s=>spy.observe(s));}
  if(arg.sec){const el=$("#sec-"+arg.sec,m);if(el)setTimeout(()=>el.scrollIntoView({block:"start"}),30);}
};

// ---------- DRILL ENGINE ----------
let D=null;
function drill(ids,title,back,pool){if(!ids.length){alert("No cards match that filter.");return;}D={q:ids.slice(),i:0,flipped:false,hist:[],title,back:back||tab,requeued:new Set(),pool:pool||ids.slice()};document.body.classList.add("focus");renderDrill();}
function exitDrill(){document.body.classList.remove("focus");const b=D&&D.back;D=null;go(b||"today");}
function cardFront(c){
  if(c.deck==="codal"){let bi=0;const para=c.ar.p[c.pi].replace(/\[\[(.+?)\]\]/g,(m,x)=>{const r=bi===c.bi?'<span class="dr-blank">?</span>':x;bi++;return r;});return `<div class="dr-kind mono">Codal · Art. ${c.art} · ${esc(c.ar.t)}</div><div class="dr-front tb-codal" style="margin-top:12px">${para}</div>`;}
  if(c.deck==="latin"){const x=c.x;if(c.dir==="lm")return `<div class="dr-kind mono">Latin → meaning · ${esc((MAX_GROUPS.find(g=>g.g===x.g)||{}).t||"")}</div><div class="dr-name">${x.la}</div><div class="dr-cue">What does it mean, and where does it apply?</div>`;
    const hide=s=>s.replace(new RegExp(x.la.split(/[ ,(/]/)[0].replace(/[.*+?^${}()|[\]\\]/g,"\\$&"),"gi"),"▢▢▢");return `<div class="dr-kind mono">Meaning → Latin · ${esc((MAX_GROUPS.find(g=>g.g===x.g)||{}).t||"")}</div><div class="dr-front" style="margin-top:12px;text-align:center;font-size:1.08rem">“${x.lit.replace(/^“|”$/g,"")}”</div><div class="dr-front cd-muted" style="margin-top:8px;text-align:center">${hide(x.m)}</div><div class="dr-cue" style="margin-top:10px">Name the maxim or term.</div>`;}
  if(c.deck==="elements")return `<div class="dr-kind mono">Reyes · ${esc(TOPIC_NAME[c.t]||"")}</div><div class="disp" style="font-size:1.2rem;text-align:center;margin:8px 0">${esc(c.L.n)}</div><${c.L.o?"ol":"ul"} class="dr-items">${c.L.i.map((x,j)=>`<li>${j===c.ii?'<span class="dr-blank">?</span>':x}</li>`).join("")}</${c.L.o?"ol":"ul"}><div class="dr-cue">What is missing?</div>`;
  const k=c.c,lbl=`<div class="dr-kind mono">${DIRS[c.dir]} · ${esc(TOPIC_NAME[k.t]||"")}</div>`;
  if(c.dir==="cr")return `${lbl}<div class="dr-name">${esc(k.n)}</div><div class="dr-cue">State the doctrine, the ruling, and the fact that decided it.</div>`;
  if(c.dir==="dc")return `${lbl}<div class="dr-front" style="margin-top:14px;text-align:center;font-size:1.1rem">${k.d}</div><div class="dr-cue" style="margin-top:10px">Which case?</div>`;
  const facts=k.f.replace(new RegExp(SHORT[k.id].replace(/[.*+?^${}()|[\]\\]/g,"\\$&"),"gi"),"▢▢▢");
  if(c.dir==="fc")return `${lbl}<div class="dr-front" style="margin-top:12px">${facts}</div><div class="dr-cue" style="margin-top:10px">Name the case.</div>`;
  return `${lbl}<div class="dr-front" style="margin-top:12px">${k.f}</div><div class="dr-cue" style="margin-top:10px">Ruling? Which element was met or failed, and <b>why</b>?</div>`;
}
function cardBack(c){
  if(c.deck==="codal"){let bi=0;const para=c.ar.p[c.pi].replace(/\[\[(.+?)\]\]/g,(m,x)=>{const r=bi===c.bi?`<span class="dr-fill">${x}</span>`:x;bi++;return r;});return `<div class="tb-codal">${para}</div>`;}
  if(c.deck==="latin")return maximCard(c.x);
  if(c.deck==="elements")return `<div><span class="dr-fill">${c.L.i[c.ii]}</span></div>`;
  const k=c.c,head=`<div class="disp" style="font-style:italic;font-size:1.2rem;text-align:center">${esc(k.n)}${hook(k)}</div><div class="cd-muted" style="text-align:center;font-size:.85rem">${esc(k.c)}</div>`;
  if(c.dir==="fc"||c.dir==="dc")return `${head}<p><b>Doctrine:</b> ${k.d}</p><p class="cd-muted">${k.r}</p>${c.dir==="dc"?`<details><summary>Facts</summary>${k.f}</details>`:""}`;
  return `${head}<p><b>Ruling:</b> ${k.r}</p><p><b>Why:</b> ${k.w}</p><p><b>Doctrine:</b> ${k.d}</p>${k.k&&k.k.length?`<details><summary>Recit nitpicks</summary><ul>${k.k.map(x=>`<li>${x}</li>`).join("")}</ul></details>`:""}`;
}
function renderDrill(){
  const m=$("main");
  if(D.i>=D.q.length){m.innerHTML=`<div class="fx-bar"><span>${esc(D.title)}</span><button class="cd-btn sm" id="exit">Exit</button></div><div class="dr-shell"><div class="cd-card dr-done"><div class="disp" style="font-size:1.6rem">Round done</div><p class="cd-muted">${D.q.length} cards · streak ${stats.streak} (best ${stats.best}) · fix list ${Object.keys(fix).length}</p><div class="cd-row" style="justify-content:center"><button class="cd-btn pri" id="again">Another round</button>${D.hist.length?'<button class="cd-btn" id="prev">← Previous</button>':""}<button class="cd-btn" id="exit2">Done</button></div></div></div>`;
    $("#exit",m).onclick=exitDrill;$("#exit2",m).onclick=exitDrill;const p=$("#prev",m);if(p)p.onclick=undo;$("#again",m).onclick=()=>{const P=D.pool;drill(buildRound(P,20),D.title,D.back,P);};return;}
  const id=D.q[D.i],c=CARDS[id];
  m.innerHTML=`<div class="fx-bar"><span>${esc(D.title)} · ${strip(countdown())}</span><button class="cd-btn sm" id="exit">Exit (Esc)</button></div>
  <div class="dr-shell"><div class="dr-bar"><span>${D.i+1} / ${D.q.length}${id in fix?' · <span style="color:var(--red)">fix list</span>':""}</span><span>🔥 ${stats.streak}</span></div>
  <div class="cd-card dr-card" id="card">${cardFront(c)}${D.flipped?`<div class="dr-ans">${cardBack(c)}</div>`:'<button class="cd-btn dr-show" id="flip">Show answer (Space)</button>'}</div>
  ${D.flipped?`<div class="dr-grades"><button class="g1" data-g="1">Again<small>1 · ← swipe</small></button><button class="g2" data-g="2">Hard<small>2</small></button><button class="g3" data-g="3">Good<small>3 · swipe →</small></button><button class="g4" data-g="4">Easy<small>4 · swipe ↑</small></button></div>`:""}
  <div class="cd-row" style="margin-top:10px;justify-content:space-between"><button class="cd-btn sm" id="prev" ${D.hist.length?"":"disabled"}>← Previous</button><span class="cd-muted" style="font-size:.8rem">Space flip · 1–4 grade · ← back · Esc exit</span></div></div>`;
  $("#exit",m).onclick=exitDrill;$("#prev",m).onclick=undo;const f=$("#flip",m);if(f)f.onclick=flip;
  $$(".dr-grades button",m).forEach(b=>b.onclick=()=>doGrade(+b.dataset.g));
  const card=$("#card",m);let sx=0,sy=0,st=0;
  card.addEventListener("touchstart",e=>{const t=e.touches[0];sx=t.clientX;sy=t.clientY;st=Date.now();},{passive:true});
  card.addEventListener("touchend",e=>{const t=e.changedTouches[0],dx=t.clientX-sx,dy=t.clientY-sy;if(Math.abs(dx)<12&&Math.abs(dy)<12&&Date.now()-st<400){if(!D.flipped&&!e.target.closest("summary,a,button"))flip();return;}if(!D.flipped)return;if(Math.abs(dx)>70&&Math.abs(dx)>Math.abs(dy))doGrade(dx>0?3:1);else if(dy<-80&&Math.abs(dy)>Math.abs(dx))doGrade(4);});
}
function flip(){if(!D||D.flipped)return;D.flipped=true;renderDrill();}
function doGrade(g){if(!D||!D.flipped)return;const id=D.q[D.i];D.hist.push({i:D.i,id,s:srs[id]?{...srs[id]}:null,f:id in fix?fix[id]:undefined,streak:stats.streak,best:stats.best,rev:stats.rev,qlen:D.q.length});grade(id,g);if(g===1&&!D.requeued.has(id)){D.requeued.add(id);D.q.push(id);}D.i++;D.flipped=false;renderDrill();}
function undo(){if(!D||!D.hist.length)return;const h=D.hist.pop();if(h.s)srs[h.id]=h.s;else delete srs[h.id];if(h.f===undefined)delete fix[h.id];else fix[h.id]=h.f;stats.streak=h.streak;stats.best=h.best;stats.rev=h.rev;D.q.length=h.qlen;D.requeued.delete(h.id);D.i=h.i;D.flipped=true;save();renderDrill();}
document.addEventListener("keydown",e=>{
  if(!D){if(e.key==="Escape")$$(".md-bg").forEach(x=>x.remove());return;}
  if(e.target.matches("input,textarea"))return;
  if(e.key===" "){e.preventDefault();flip();}else if(/^[1-4]$/.test(e.key))doGrade(+e.key);else if(e.key==="ArrowLeft")undo();else if(e.key==="Escape"){if($(".md-bg"))$$(".md-bg").forEach(x=>x.remove());else exitDrill();}
});

// ---------- CODAL DRILL ----------
V.codal=m=>{
  const sel=store.get("codalSel",{deck:"codal",arts:[]});const arts=CODAL.map(a=>a.a);
  const artOf=c=>c.deck==="codal"?c.art:c.t==="readings"?"R":(Object.keys(ART_TOPIC).find(a=>ART_TOPIC[a]===c.t)||(c.t==="a4b"?"4":""));
  const pool=()=>{const ids=sel.deck==="both"?DECK.codal.concat(DECK.elements,DECK.latin):(DECK[sel.deck]||DECK.codal);return sel.arts.length?ids.filter(i=>sel.arts.includes(artOf(CARDS[i]))):ids;};
  function draw(){const p=pool(),d=p.filter(isDue).length,s=p.filter(i=>srs[i]).length;
    m.innerHTML=`<div class="cd-card"><div class="mono">Anki-style cloze</div><h2 style="margin:4px 0">Codal & elements drill</h2><p class="cd-muted">One blank per card, shown inside its own paragraph or list. Flip, then grade yourself honestly; misses come back until you get them right twice.</p>
    <div style="margin:10px 0"><span class="cd-muted">Deck: </span>${[["codal","Codal (verbatim)"],["elements","Elements & readings lists"],["latin","Latin maxims"],["both","All three"]].map(([k,l])=>`<button class="cd-chip ${sel.deck===k?"on":""}" data-deck="${k}">${l}</button>`).join("")}</div>
    <div><span class="cd-muted">Articles: </span><button class="cd-chip ${!sel.arts.length?"on":""}" data-art="">All</button>${arts.concat("R").map(a=>`<button class="cd-chip ${sel.arts.includes(a)?"on":""}" data-art="${a}">${a==="R"?"Intro readings":"Art. "+a}</button>`).join("")}</div>
    <div class="cd-row" style="margin-top:12px"><button class="cd-btn pri" id="go">▶ Start (${Math.min(20,p.length)} cards)</button><span class="cd-muted">${p.length} cards · ${s} seen · ${d} due</span></div></div>
    <div class="cd-card"><div class="mono">Read the codal first</div>${(sel.arts.length?sel.arts:arts).filter(a=>a!=="R").map(a=>codalHTML(a)).join("")}</div>`;
    m.onclick=e=>{const dk=e.target.closest("[data-deck]");if(dk){sel.deck=dk.dataset.deck;store.set("codalSel",sel);draw();}const ar=e.target.closest("[data-art]");if(ar){const a=ar.dataset.art;sel.arts=!a?[]:(sel.arts.includes(a)?sel.arts.filter(x=>x!==a):sel.arts.concat(a));store.set("codalSel",sel);draw();}if(e.target.id==="go"){const P=pool();drill(buildRound(P,20),"Codal drill","codal",P);}};}
  draw();
};

// ---------- CASES ----------
V.cases=m=>{
  const sel=store.get("caseSel",{view:"browse",dir:"mix",topics:[],q:""});const tps=["a2","a3","a4a","a4b","a6","a11"];
  const filtered=()=>CASES.filter(c=>(!sel.topics.length||sel.topics.includes(c.t))&&(!sel.q||strip(c.n+" "+c.h+" "+c.f+" "+c.d+" "+c.r).toLowerCase().includes(sel.q.toLowerCase())));
  function draw(){const L=filtered();
    m.innerHTML=`<div class="cd-card"><div class="cd-row" style="justify-content:space-between"><h2 style="margin:0">Cases <span class="cd-muted" style="font-size:1rem">${CASES.length}</span></h2><div>${[["browse","Browse"],["drill","Drill"]].map(([k,l])=>`<button class="cd-chip ${sel.view===k?"on":""}" data-view="${k}">${l}</button>`).join("")}</div></div>
    <div style="margin-top:8px"><button class="cd-chip ${!sel.topics.length?"on":""}" data-tp="">All</button>${tps.map(t=>`<button class="cd-chip ${sel.topics.includes(t)?"on":""}" data-tp="${t}">${esc(TOPIC_NAME[t].split(" · ")[0])}</button>`).join("")}</div>
    ${sel.view==="drill"?`<div style="margin-top:6px"><span class="cd-muted">Direction: </span>${Object.entries(DIRS).concat([["mix","Mixed"]]).map(([k,l])=>`<button class="cd-chip ${sel.dir===k?"on":""}" data-dir="${k}">${l}</button>`).join("")}</div><p class="cd-muted" style="font-size:.9rem">“Facts → ruling & why” is the crim mode: say who won, which element was met or failed, and the fact that decided it.</p><button class="cd-btn pri" id="go">▶ Start (${Math.min(20,L.length)} cases)</button>`:`<input class="cd-in" id="q" placeholder="Filter by name, hook, fact…" value="${esc(sel.q)}" style="margin-top:8px">`}</div>
    ${sel.view==="browse"?`<div class="cs-list">${L.map(c=>`<div class="cd-card cs-item hc-${c.hc}" data-case="${c.id}"><span class="nm">${esc(c.n)}</span>${hook(c)}<div class="cd-muted" style="font-size:.85rem">${esc(c.c)} · ${esc(TOPIC_NAME[c.t])} · ${esc(c.g)}</div><div style="margin-top:4px">${c.d}</div></div>`).join("")}</div>`:""}`;
    m.onclick=e=>{const v=e.target.closest("[data-view]");if(v){sel.view=v.dataset.view;store.set("caseSel",sel);draw();return;}const tp=e.target.closest("[data-tp]");if(tp){const t=tp.dataset.tp;sel.topics=!t?[]:(sel.topics.includes(t)?sel.topics.filter(x=>x!==t):sel.topics.concat(t));store.set("caseSel",sel);draw();return;}const dr=e.target.closest("[data-dir]");if(dr){sel.dir=dr.dataset.dir;store.set("caseSel",sel);draw();return;}
      if(e.target.id==="go"){const cs=filtered();let ids;if(sel.dir==="mix"){const ks=Object.keys(DIRS);ids=cs.map(c=>{const pref=ks.map(d=>`k-${c.id}-${d}`);const due=pref.filter(isDue);return due[0]||pref[Math.floor(Math.random()*ks.length)];});}else ids=cs.map(c=>`k-${c.id}-${sel.dir}`);drill(buildRound(ids,20),"Cases · "+(sel.dir==="mix"?"Mixed":DIRS[sel.dir]),"cases",ids);}};
    const q=$("#q",m);if(q)q.oninput=()=>{sel.q=q.value;store.set("caseSel",sel);const pos=q.selectionStart;draw();const q2=$("#q",m);q2.focus();q2.setSelectionRange(pos,pos);};}
  draw();
};

// ---------- SAMPLEX ----------
let timer=null;
V.samplex=(m,openId)=>{
  const sel=store.get("sxSel",{view:"essays",set:"Mock exam A"});if(openId){const e=ESSAYS.find(x=>x.id===openId);if(e){sel.view="essays";sel.set=e.set;}}
  const sets=[...new Set(ESSAYS.map(e=>e.set))];
  function draw(){let body="";
    if(sel.view==="essays"){body=ESSAYS.filter(e=>e.set===sel.set).map((e,i)=>`<div class="cd-card" id="sx-${e.id}"><div class="cd-row" style="justify-content:space-between"><span class="mono">${esc(e.src)}</span><span>${sxdone[e.id]==="ok"?'<span class="hk hk-r">got it</span>':sxdone[e.id]==="miss"?'<span class="hk hk-g">redo</span>':""}</span></div>
      <div class="disp" style="font-size:1.05rem;margin:4px 0">Q${i+1}. ${e.t.map(t=>esc(TOPIC_NAME[t].split(" · ")[0])).join(" + ")}</div><div class="sx-q">${e.q}</div>
      <textarea class="cd-in" data-note="${e.id}" placeholder="Outline in IRAC: Issue → Rule → Analysis (why this element, why not the other) → Conclusion. Saved on this device." style="margin-top:10px">${esc(notes[e.id]||"")}</textarea>
      <div class="cd-row" style="margin-top:8px"><button class="cd-btn sm" data-timer="${e.id}">⏱ 24:00</button><button class="cd-btn sm pri" data-rev="${e.id}">Show issues & model answer</button></div>
      <div class="sx-a" data-ans="${e.id}" hidden><div class="mono">Issues: tick the ones you spotted</div><div class="sx-iss">${e.iss.map(x=>`<label><input type="checkbox"> ${x}</label>`).join("")}</div>
      <div class="mono" style="margin-top:10px">Model answer</div><div>${linkCases(e.a)}</div><div class="tb-exam"><div class="mono">In one line</div>${e.c}</div>
      <div class="cd-row"><button class="cd-btn sm" data-mark="ok:${e.id}">✓ Got it</button><button class="cd-btn sm" data-mark="miss:${e.id}">✗ Missed issues → redo list</button></div></div></div>`).join("");}
    else body=MCQ.map((q,i)=>`<div class="cd-card" data-mcq="${q.id}"><div class="mono">${esc(q.src)}</div><div style="margin:6px 0"><b>${i+1}.</b> ${q.q}</div>${q.ch.map((c,j)=>`<button class="mc-ch" data-ch="${j}">(${"ABCD"[j]}) ${c}</button>`).join("")}<div class="mc-why" hidden><p><b>Answer: (${"ABCD"[q.k]})</b> ${q.why}</p>${q.note?`<p class="cd-muted">Note: ${q.note}</p>`:""}</div></div>`).join("");
    m.innerHTML=`<div class="cd-card"><div class="cd-row" style="justify-content:space-between"><h2 style="margin:0">Samplex</h2><div>${[["essays","Problems"],["mcq","MCQ"]].map(([k,l])=>`<button class="cd-chip ${sel.view===k?"on":""}" data-view="${k}">${l}</button>`).join("")}</div></div>
    ${sel.view==="essays"?`<div style="margin-top:8px">${sets.map(s=>`<button class="cd-chip ${sel.set===s?"on":""}" data-set="${esc(s)}">${esc(s)} (${ESSAYS.filter(e=>e.set===s).length})</button>`).join("")}</div><p class="cd-muted" style="font-size:.9rem;margin:6px 0 0">Each mock follows Sir\'s format: <b>4 problems + 1 objective/enumeration question</b>, 2 hours, about 24 minutes each. Write in IRAC on the right-hand pages only, then compare. Model answers show the “why, and why not” analysis he looks for.</p>`:`<p class="cd-muted" style="margin:6px 0 0">San Beda midterm MCQs (keys checked against Reyes) + mock items.</p>`}</div>${body}`;
    m.onclick=e=>{const v=e.target.closest("[data-view]");if(v){sel.view=v.dataset.view;store.set("sxSel",sel);draw();return;}const s=e.target.closest("[data-set]");if(s){sel.set=s.dataset.set;store.set("sxSel",sel);draw();return;}
      const r=e.target.closest("[data-rev]");if(r){const a=$(`[data-ans="${r.dataset.rev}"]`,m);a.hidden=!a.hidden;return;}
      const mk=e.target.closest("[data-mark]");if(mk){const[k,id]=mk.dataset.mark.split(":");sxdone[id]=k;save();draw();const el=$("#sx-"+id,m);if(el)el.scrollIntoView({block:"start"});return;}
      const tm=e.target.closest("[data-timer]");if(tm){if(timer)clearInterval(timer);let left=24*60;timer=setInterval(()=>{left--;if(!tm.isConnected){clearInterval(timer);return;}tm.textContent=`⏱ ${Math.floor(left/60)}:${String(left%60).padStart(2,"0")}`;if(left<=0){clearInterval(timer);tm.textContent="⏱ Time!";tm.style.color="var(--red)";}},1000);return;}
      const ch=e.target.closest("[data-ch]");if(ch){const box=ch.closest("[data-mcq]"),q=MCQ.find(x=>x.id===box.dataset.mcq);$$(".mc-ch",box).forEach((b,j)=>{b.classList.toggle("ok",j===q.k);b.classList.toggle("no",j===+ch.dataset.ch&&j!==q.k);});$(".mc-why",box).hidden=false;}};
    $$("[data-note]",m).forEach(t=>t.oninput=()=>{notes[t.dataset.note]=t.value;store.set("notes",notes);});
    if(openId){const el=$("#sx-"+openId,m);if(el)el.scrollIntoView({block:"start"});openId=null;}}
  draw();
};

// ---------- SEARCH ----------
const IDX=[];
const btext=b=>[b.t,b.x&&(Array.isArray(b.x)?b.x.flat().join(" "):b.x),b.items&&b.items.flat().join(" "),b.rows&&b.rows.flat().join(" "),b.why].filter(Boolean).join(" ");
TOPICS.forEach(T=>{IDX.push({k:"Chapter",t:`${T.num} · ${T.n}`,x:strip(T.lead),go:()=>go("review",{ch:T.k})});T.sec.forEach((s,i)=>{const x=strip(s.b.filter(b=>b.k!=="case").map(btext).join(" "));IDX.push({k:"Reviewer",t:`${T.num}.${i+1} ${s.t}`,x,go:()=>openSec(s.id)});});});
CODAL.forEach(a=>IDX.push({k:"Codal",t:`Art. ${a.a}. ${a.t}`,x:strip(a.p.join(" ").replace(/\[\[|\]\]/g,"")),go:()=>go("codal")}));
CASES.forEach(c=>IDX.push({k:"Case",t:c.n,x:strip([c.h,c.f,c.r,c.w,c.d,(c.k||[]).join(" ")].join(" ")),go:()=>openCase(c.id)}));
MAXIMS.forEach(x=>IDX.push({k:"Latin",t:strip(x.la),x:strip(x.lit+" "+x.m+" "+x.app),go:()=>go("review",{ch:"latin"})}));
ELEMENTS.forEach(L=>IDX.push({k:"Elements",t:L.n,x:strip(L.i.join(" · ")),go:()=>go("codal")}));
ESSAYS.forEach(e=>IDX.push({k:"Samplex",t:e.set+" · "+e.src,x:strip(e.q+" "+e.a),go:()=>go("samplex",e.id)}));
V.search=(m,q)=>{
  q=(q||"").trim();const words=q.toLowerCase().split(/\s+/).filter(Boolean);
  const hits=words.length?IDX.filter(h=>words.every(w=>(h.t+" "+h.x).toLowerCase().includes(w))).slice(0,60):[];
  const snip=x=>{const i=Math.max(0,x.toLowerCase().indexOf(words[0]));const s=Math.max(0,i-70);let t=esc(x.slice(s,s+220));words.forEach(w=>{t=t.replace(new RegExp(w.replace(/[.*+?^${}()|[\]\\]/g,"\\$&"),"gi"),mm=>`<mark>${mm}</mark>`);});return(s?"…":"")+t+"…";};
  m.innerHTML=`<div class="cd-card"><h2 style="margin:0 0 6px">Search</h2><div class="cd-muted">${hits.length} result${hits.length===1?"":"s"} for “${esc(q)}”</div>${hits.map((h,i)=>`<div class="sr-hit" data-i="${i}"><span class="hk hk-b" style="margin:0 6px 0 0">${h.k}</span><b>${esc(h.t)}</b><div class="cd-muted" style="font-size:.9rem">${snip(h.x)}</div></div>`).join("")}</div>`;
  m.onclick=e=>{const h=e.target.closest("[data-i]");if(h)hits[+h.dataset.i].go();};
};

// ---------- boot ----------
function theme(t){if(t)document.documentElement.setAttribute("data-theme",t);else document.documentElement.removeAttribute("data-theme");store.set("theme",t||"");}
theme(store.get("theme",""));
$("#theme").onclick=()=>{const cur=document.documentElement.getAttribute("data-theme");const dark=cur?cur==="dark":matchMedia("(prefers-color-scheme: dark)").matches;theme(dark?"light":"dark");};
$$(".cd-tab").forEach(b=>b.onclick=()=>go(b.dataset.tab));
const sIn=$("#search");let st;sIn.oninput=()=>{clearTimeout(st);st=setTimeout(()=>{if(sIn.value.trim().length>1)go("search",sIn.value);},250);};sIn.onkeydown=e=>{if(e.key==="Enter")go("search",sIn.value);};
const tick=()=>{$("#count").innerHTML=countdown();};tick();setInterval(tick,30000);
go(V[tab]&&tab!=="search"?tab:"today");
})();
