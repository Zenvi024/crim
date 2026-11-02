(function(){
"use strict";
const EXAM = new Date("2026-11-07T14:00:00+08:00").getTime();
const $ = (s,r=document)=>r.querySelector(s), $$=(s,r=document)=>[...r.querySelectorAll(s)];
const esc = s=>String(s).replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
const strip = s=>String(s).replace(/<[^>]+>/g,"");
const shuffle = a=>{for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a;};
const KEY="crimdesk1:";
const store={get(k,d){try{const v=localStorage.getItem(KEY+k);return v==null?d:JSON.parse(v);}catch(e){return d;}},set(k,v){try{localStorage.setItem(KEY+k,JSON.stringify(v));}catch(e){}}};
let srs=store.get("srs",{}), fix=store.get("fix",{}), read=store.get("read",{}), stats=store.get("stats",{rev:0,streak:0,best:0,days:{}}), sxdone=store.get("sx",{}), notes=store.get("notes",{});
const save=()=>{store.set("srs",srs);store.set("fix",fix);store.set("stats",stats);store.set("read",read);store.set("sx",sxdone);};

// ---------- topics ----------
const TOPIC_NAME={}; TOPICS.forEach(t=>TOPIC_NAME[t.k]=t.n);
const ART_TOPIC={"1":"intro","2":"a2","3":"a3","4":"a4a","5":"a5","6":"a6","7":"a7","8":"a8","9":"a9","10":"a10","11":"a11"};
const CASE={}; CASES.forEach(c=>CASE[c.id]=c);
const SHORT={bull:"Bull",vanwilsem:"Van Wilsem",wongcheng:"Wong Cheng",lookchaw:"Look Chaw",ahsing:"Ah Sing",lollo:"Lol-lo",ahchong:"Ah Chong",oanis:"Oanis",magsumbol:"Magsumbol",gervero:"Gervero",iligan:"Iligan",mananquil:"Mananquil",brobst:"Brobst",garcia:"Garcia",balmores:"Balmores",intod:"Intod",domasian:"Domasian",jacinto:"Jacinto",eduave:"Eduave",orita:"Orita",campuhan:"Campuhan",adiao:"Adiao",valenzuela:"Valenzuela",lamahang:"Lamahang",salvilla:"Salvilla",borinaga:"Borinaga",sypio:"Sy Pio",ravelo:"Ravelo",kalalo:"Kalalo",boholst:"Boholst-Caballero",alconga:"Alconga",mack:"Mack",sumicad:"Sumicad",genosa:"Genosa",luague:"Luague",delacruz:"De la Cruz",jaurigue:"Jaurigue",apolinar:"Apolinar",bumanglag:"Bumanglag",narvaez:"Narvaez",chuahiong:"Chua Hiong",pelayo:"Pelayo",esmedia:"Esmedia",normahernandez:"Norma Hernandez",dudley:"Dudley",ty:"Ty",delima:"Delima",belbes:"Belbes",beronilla:"Beronilla",agao:"Agao"};
const BY_SHORT={}; Object.entries(SHORT).forEach(([id,s])=>BY_SHORT[s.toLowerCase()]=id);
const HC={g:"Liable / conviction affirmed",r:"Acquitted / not liable",y:"Modified (crime, stage or circumstance changed)",b:"Principle"};
const hook=c=>`<span class="hk hk-${c.hc}" title="${HC[c.hc]}">${esc(c.h)}</span>`;

// ---------- cards ----------
const CARDS={}; const DECK={codal:[],elements:[],cases:[]};
CODAL.forEach(ar=>ar.p.forEach((para,pi)=>{let bi=0;para.replace(/\[\[(.+?)\]\]/g,()=>{const id=`c-${ar.a}-${pi}-${bi}`;CARDS[id]={id,deck:"codal",art:ar.a,t:ART_TOPIC[ar.a],ar,pi,bi};DECK.codal.push(id);bi++;return"";});}));
ELEMENTS.forEach(L=>L.i.forEach((_,ii)=>{const id=`e-${L.id}-${ii}`;CARDS[id]={id,deck:"elements",t:L.t,L,ii};DECK.elements.push(id);}));
const DIRS={cr:"Case → doctrine",fc:"Facts → case",dc:"Doctrine → case",fr:"Facts → ruling & why"};
CASES.forEach(c=>Object.keys(DIRS).forEach(d=>{const id=`k-${c.id}-${d}`;CARDS[id]={id,deck:"cases",t:c.t==="a4b"?"a4b":c.t,c,dir:d};DECK.cases.push(id);}));
const topicOf=card=>card.t;

// ---------- SRS ----------
const now=()=>Date.now(), DAY=864e5;
function isDue(id){const s=srs[id];return s&&s.due<=now();}
function grade(id,g){
  const s=srs[id]||{ivl:0,ease:2.3,reps:0,due:0};
  if(g===1){s.ivl=0;s.ease=Math.max(1.3,s.ease-.2);s.due=now()+2*6e4;s.lapses=(s.lapses||0)+1;}
  else if(g===2){s.ivl=Math.max(.3,s.ivl*1.2);s.ease=Math.max(1.3,s.ease-.15);}
  else if(g===3){s.ivl=s.reps===0?.5:Math.max(1,s.ivl*s.ease);}
  else {s.ivl=s.reps===0?2:s.ivl*s.ease*1.4;s.ease=Math.min(2.8,s.ease+.15);}
  s.ivl=Math.min(s.ivl,4); if(g>1)s.due=now()+s.ivl*DAY; s.reps++; srs[id]=s;
  if(g===1){fix[id]=0;} else if(id in fix && g>=3){fix[id]++; if(fix[id]>=2) delete fix[id];}
  stats.rev++; const dk=new Date().toDateString(); stats.days[dk]=(stats.days[dk]||0)+1;
  if(g>=3){stats.streak++;stats.best=Math.max(stats.best,stats.streak);} else stats.streak=0;
  save();
}
function buildRound(ids,n=20){
  const due=ids.filter(isDue).sort((a,b)=>srs[a].due-srs[b].due);
  const fresh=ids.filter(i=>!srs[i]);
  const later=ids.filter(i=>srs[i]&&!isDue(i)).sort((a,b)=>srs[a].due-srs[b].due);
  const fx=ids.filter(i=>i in fix);
  const pick=[...new Set([...fx,...due,...shuffle(fresh),...later])].slice(0,n);
  return shuffle(pick);
}

// ---------- rendering helpers ----------
function codalHTML(a,opts={}){
  const ar=CODAL.find(x=>x.a===a); if(!ar)return"";
  const ps=ar.p.map(p=>`<p>${p.replace(/\[\[(.+?)\]\]/g,'<span class="key">$1</span>')}</p>`).join("");
  return `<div class="rv-codal"><div class="mono">Codal · RPC</div><div class="ttl">Art. ${ar.a}. ${esc(ar.t)}.</div>${ps}${ar.n?`<div class="rv-note">⚠ ${ar.n}</div>`:""}</div>`;
}
function linkCases(html){
  return html.replace(/<i>([^<]+)<\/i>/g,(m,t)=>{const id=BY_SHORT[t.trim().toLowerCase()];return id?`<i class="cl" data-case="${id}" style="cursor:pointer;text-decoration:underline dotted">${t}</i>`:m;});
}
function gateHTML(gid){
  const G=GATES[gid]; if(!G)return"";
  return `<div class="gt" data-gate="${gid}"><div class="mono">Decision gate · tap through</div><div class="disp" style="font-size:1.05rem">${G.n}</div><div class="gt-body"></div></div>`;
}
function runGate(el){
  const G=GATES[el.dataset.gate]; const body=$(".gt-body",el); const path=[];
  function show(nodeId){
    const nd=G.nodes[nodeId];
    body.innerHTML=`${path.length?`<div class="gt-path">${path.map(p=>esc(p)).join(" → ")}</div>`:""}<div class="gt-q">${nd.q}</div><div class="cd-row"><button class="cd-btn sm" data-a="y">Yes</button><button class="cd-btn sm" data-a="n">No</button>${path.length?'<button class="cd-btn sm" data-a="r">Restart</button>':""}</div>`;
    body.onclick=e=>{const a=e.target.dataset.a;if(!a)return; if(a==="r"){path.length=0;return show(G.start);} const nx=nd[a]; path.push((a==="y"?"Yes":"No")); if(typeof nx==="string")show(nx); else end(nx);};
  }
  function end(x){const tone={g:"tone-green",r:"tone-red",y:"tone-yellow",b:"tone-blue"}[x.tone]||"tone-blue";
    body.innerHTML=`<div class="gt-path">${path.join(" → ")}</div><div class="gt-end ${tone}">${x.end}</div><div class="cd-row" style="margin-top:8px"><button class="cd-btn sm" data-a="r">Restart</button></div>`;
    body.onclick=e=>{if(e.target.dataset.a==="r"){path.length=0;show(G.start);}};}
  show(G.start);
}

// ---------- modal ----------
function openCase(id){
  const c=CASE[id]; if(!c)return;
  const bg=document.createElement("div"); bg.className="md-bg";
  bg.innerHTML=`<div class="md" role="dialog" aria-label="${esc(c.n)}"><div class="cd-row" style="justify-content:space-between"><span class="mono">${esc(TOPIC_NAME[c.t]||"")} · ${esc(c.g||"")}</span><button class="cd-ic" data-x>✕</button></div>
  <h2>${esc(c.n)}</h2><div class="cd-muted">${esc(c.c)} ${hook(c)}</div>
  <div class="sec"><div class="lbl">Facts</div><div>${c.f}</div></div>
  <div class="sec"><div class="lbl">Ruling</div><div>${c.r}</div></div>
  <div class="sec"><div class="lbl">Why (element met or failed)</div><div>${c.w}</div></div>
  <div class="sec tone-blue rv-box"><div class="lbl">Doctrine</div><div>${c.d}</div></div>
  ${c.k&&c.k.length?`<div class="sec"><div class="lbl">Recit nitpicks</div><ul>${c.k.map(x=>`<li>${x}</li>`).join("")}</ul></div>`:""}
  ${c.x?`<div class="sec flag">⚠ ${c.x}</div>`:""}</div>`;
  bg.addEventListener("click",e=>{if(e.target===bg||e.target.hasAttribute("data-x"))bg.remove();});
  document.body.appendChild(bg);
}
document.addEventListener("click",e=>{const t=e.target.closest("[data-case]");if(t){e.preventDefault();openCase(t.dataset.case);}});

// ---------- views ----------
const V={};
let tab=store.get("tab","today");
function go(t,arg){tab=t;store.set("tab",t);$$(".cd-tab").forEach(b=>b.classList.toggle("on",b.dataset.tab===t));const m=$("main");m.innerHTML="";V[t](m,arg);window.scrollTo(0,0);}

// TODAY
const PLAN=[
{d:"2026-11-02",lbl:"Mon, 2 Nov",x:"Exam method + <b>Intro/Art. 1, Art. 2, Art. 3</b> in the Reviewer. Codal cloze: Arts. 1–3. Cases: Art. 2–3 (Facts → ruling). Re-read <i>Ah Chong</i>.",go:["review","a2"]},
{d:"2026-11-03",lbl:"Tue, 3 Nov",x:"Class: <b>note what Sir says about the exam</b>. Then <b>Art. 4(1) and 4(2), Art. 5</b>; tap through both gates. Codal cloze: Arts. 4–5. Elements: Art. 3–4 lists.",go:["review","a4a"]},
{d:"2026-11-04",lbl:"Wed, 4 Nov",x:"<b>Art. 6 (12 cases)</b> + Arts. 7–10. Stages gate. Cases drill: Art. 6, all directions. Commute: Reyes elements deck.",go:["review","a6"]},
{d:"2026-11-05",lbl:"Thu, 5 Nov",x:"<b>Art. 11 (20 cases)</b>. Self-defense gate. Codal cloze: Art. 11 (every requisite, word for word). Mock exam A, questions 1–4, timed.",go:["review","a11"]},
{d:"2026-11-06",lbl:"Fri, 6 Nov",x:"<b>Full mock</b>: Mock exam A, questions 5–8, + San Beda, under exam conditions (14 minutes per question). Then clear the fix list and every due card. Sleep by 1:00 a.m.",go:["samplex"]},
{d:"2026-11-07",lbl:"Sat, 7 Nov",x:"Morning: fix list → due codal cards → skim the hooks wall (Cases → Browse). Lunch, then rest. <b>Exam 2:00–4:00 p.m.</b> Write the conclusion first.",go:["today"]}];
function countdown(){const ms=EXAM-now(); if(ms<=0)return"Exam day: done or in progress";const d=Math.floor(ms/DAY),h=Math.floor(ms%DAY/36e5),m=Math.floor(ms%36e5/6e4);return `<b>${d}d ${h}h ${m}m</b> to the midterm`;}
V.today=m=>{
  const all=Object.keys(CARDS), seen=all.filter(i=>srs[i]).length, due=all.filter(isDue).length, fx=Object.keys(fix).length;
  const readN=TOPICS.filter(t=>read[t.k]).length, todayKey=new Date().toISOString().slice(0,10);
  const deckStat=d=>{const ids=DECK[d];return `${ids.filter(i=>srs[i]).length}/${ids.length}`;};
  const sxMiss=Object.entries(sxdone).filter(([k,v])=>v==="miss").map(([k])=>k);
  m.innerHTML=`<div class="cd-card"><div class="mono">Criminal Law 1 · Prof. Gutierrez · Midterm</div><h1 style="margin:4px 0 2px">Saturday, 7 November · 2:00–4:00 p.m.</h1><div class="cd-muted">Arts. 1–11 of the RPC: codal → Reyes → doctrines. ${countdown()}.</div>
  <div class="cd-row" style="margin-top:12px"><button class="cd-btn pri" id="start">▶ Start session (fix list + due + new)</button><button class="cd-btn" data-go="codal">Codal drill</button><button class="cd-btn" data-go="cases">Cases drill</button></div></div>
  <div class="cd-grid">
   <div class="cd-card"><div class="mono">Due now</div><div class="cd-stat">${due}</div><div class="cd-muted">cards across all decks</div></div>
   <div class="cd-card"><div class="mono">Fix list</div><div class="cd-stat">${fx}</div><div class="cd-muted">missed; clear by getting each right twice</div></div>
   <div class="cd-card"><div class="mono">Seen</div><div class="cd-stat">${seen}/${all.length}</div><div class="cd-muted">codal ${deckStat("codal")} · elements ${deckStat("elements")} · cases ${deckStat("cases")}</div></div>
   <div class="cd-card"><div class="mono">Streak</div><div class="cd-stat">${stats.streak}</div><div class="cd-muted">best ${stats.best} · ${stats.rev} reviews total</div></div>
  </div>
  <div class="cd-card"><div class="cd-row" style="justify-content:space-between"><div class="mono">Reviewer read</div><span class="cd-muted">${readN}/${TOPICS.length}</span></div><div class="pg" style="margin-top:6px"><i style="width:${readN/TOPICS.length*100}%"></i></div>
  <div style="margin-top:8px">${TOPICS.map(t=>`<span class="cd-chip ${read[t.k]?"on":""}" data-topic="${t.k}" style="cursor:pointer">${read[t.k]?"✓ ":""}${esc(t.n)}</span>`).join("")}</div></div>
  ${sxMiss.length?`<div class="cd-card"><div class="mono">Samplex to redo</div>${sxMiss.map(id=>{const e=ESSAYS.find(x=>x.id===id);return e?`<span class="cd-chip" data-sx="${id}" style="cursor:pointer">${esc(e.set)} · ${esc(e.src.split("·")[0])}</span>`:"";}).join("")}</div>`:""}
  <h2 style="margin:22px 0 10px">Study plan</h2><div class="cd-plan">${PLAN.map(p=>`<div class="cd-day ${p.d===todayKey?"today":""}"><b>${p.lbl}</b><div>${p.x} <button class="cd-btn sm" data-plan='${JSON.stringify(p.go)}'>Open</button></div></div>`).join("")}</div>
  <p class="cd-muted" style="font-size:.85rem;margin-top:18px">Progress is saved in this browser only (separately on your MacBook and iPhone). Hook colors: <span class="hk hk-g">liable</span> <span class="hk hk-r">acquitted</span> <span class="hk hk-y">modified</span> <span class="hk hk-b">principle</span></p>`;
  $("#start",m).onclick=()=>drill(buildRound(Object.keys(CARDS),25),"Session","today",Object.keys(CARDS));
  m.onclick=e=>{const g=e.target.closest("[data-go]");if(g)go(g.dataset.go);const tp=e.target.closest("[data-topic]");if(tp)go("review",tp.dataset.topic);const pl=e.target.closest("[data-plan]");if(pl){const a=JSON.parse(pl.dataset.plan);go(a[0],a[1]);}const sx=e.target.closest("[data-sx]");if(sx)go("samplex",sx.dataset.sx);};
};

// REVIEWER
let blur=false;
function renderBlock(b){
  switch(b.k){
   case"codal":return codalHTML(b.a);
   case"h":return `<h3>${b.x}</h3>`;
   case"p":return `<p>${b.x}</p>`;
   case"ul":return `<ul>${b.x.map(x=>`<li>${x}</li>`).join("")}</ul>`;
   case"box":return `<div class="rv-box tone-${b.tone}">${b.title?`<div class="bt">${b.title}</div>`:""}${b.x.map(x=>`<p>${x}</p>`).join("")}</div>`;
   case"tbl":return `<div class="tblw"><table class="rv-t"><thead><tr>${b.head.map(h=>`<th>${h}</th>`).join("")}</tr></thead><tbody>${b.rows.map(r=>`<tr>${r.map(c=>`<td>${c}</td>`).join("")}</tr>`).join("")}</tbody></table></div>`;
   case"cases":return `<div class="rv-cases">${b.ids.map(id=>{const c=CASE[id];if(!c)return"";return `<div class="rv-case"><span class="nm" data-case="${id}">${esc(c.n)}</span> <span class="cd-muted" style="font-size:.85rem">${esc(c.c)}</span>${hook(c)}<div class="d"><b>Doctrine:</b> ${c.d}</div><div class="cd-muted" style="font-size:.9rem;margin-top:3px">${c.r}</div></div>`;}).join("")}</div>`;
   case"exam":return `<div class="rv-exam"><div class="mono">On the exam, write</div><div>${b.x}</div></div>`;
   case"drill":return `<div class="rv-drill"><h3>Change one fact</h3>${b.x.map(([q,a])=>`<details><summary>${q}</summary><div class="ans">${a}</div></details>`).join("")}</div>`;
   case"gate":return gateHTML(b.id);
   case"gatelist":return `<h3>All decision gates</h3>${Object.keys(GATES).map(gateHTML).join("")}`;
  } return"";
}
V.review=(m,key)=>{
  key=key||store.get("rvTopic","method"); if(!TOPICS.find(t=>t.k===key))key="method"; store.set("rvTopic",key);
  const T=TOPICS.find(t=>t.k===key);
  m.innerHTML=`<div class="rv-wrap"><nav class="rv-nav">${TOPICS.map(t=>`<button data-k="${t.k}" class="${t.k===key?"on":""}"><span>${esc(t.n)}</span>${read[t.k]?'<span class="ok">✓</span>':""}</button>`).join("")}</nav>
  <article class="cd-card rv ${blur?"blur":""}"><div class="rv-head"><div><div class="mono">${esc(T.s)}</div><h2>${esc(T.n)}</h2></div><div class="cd-row"><button class="cd-btn sm" id="blur">${blur?"Unblur":"Blur keys"}</button><button class="cd-btn sm ${read[key]?"pri":""}" id="mark">${read[key]?"✓ Read":"Mark read"}</button></div></div>
  ${linkCases(T.b.map(renderBlock).join(""))}
  <div class="cd-row" style="margin-top:20px;justify-content:space-between">${(()=>{const i=TOPICS.indexOf(T);return `${i>0?`<button class="cd-btn sm" data-k="${TOPICS[i-1].k}">← ${esc(TOPICS[i-1].n)}</button>`:"<span></span>"}${i<TOPICS.length-1?`<button class="cd-btn sm" data-k="${TOPICS[i+1].k}">${esc(TOPICS[i+1].n)} →</button>`:""}`;})()}</div></article></div>`;
  $$(".gt",m).forEach(runGate);
  m.onclick=e=>{const b=e.target.closest("[data-k]");if(b){go("review",b.dataset.k);return;}
    if(e.target.id==="mark"){read[key]=!read[key];save();go("review",key);return;}
    if(e.target.id==="blur"){blur=!blur;go("review",key);return;}
    if(blur){const k=e.target.closest(".key, .rv b");if(k)k.classList.toggle("show");}};
};

// DRILL ENGINE
let D=null;
function drill(ids,title,back,pool){
  if(!ids.length){alert("No cards match that filter.");return;}
  D={q:ids.slice(),i:0,flipped:false,hist:[],title,back:back||tab,requeued:new Set(),pool:pool||ids.slice()};
  document.body.classList.add("focus"); renderDrill();
}
function exitDrill(){document.body.classList.remove("focus");const b=D&&D.back;D=null;go(b||"today");}
function cardFront(c){
  if(c.deck==="codal"){let bi=0;const para=c.ar.p[c.pi].replace(/\[\[(.+?)\]\]/g,(m,x)=>{const r=bi===c.bi?'<span class="dr-blank">?</span>':x;bi++;return r;});
    return `<div class="dr-kind mono">Codal · Art. ${c.art} · ${esc(c.ar.t)}</div><div class="dr-front rv-codal" style="margin-top:12px">${para}</div>`;}
  if(c.deck==="elements"){return `<div class="dr-kind mono">Reyes · ${esc(TOPIC_NAME[c.t]||"")}</div><div class="disp" style="font-size:1.2rem;text-align:center;margin:8px 0">${esc(c.L.n)}</div><${c.L.o?"ol":"ul"} class="dr-items">${c.L.i.map((x,j)=>`<li>${j===c.ii?'<span class="dr-blank">?</span>':x}</li>`).join("")}</${c.L.o?"ol":"ul"}><div class="dr-cue">What is missing?</div>`;}
  const k=c.c, lbl=`<div class="dr-kind mono">${DIRS[c.dir]} · ${esc(TOPIC_NAME[k.t]||"")}</div>`;
  if(c.dir==="cr")return `${lbl}<div class="dr-name">${esc(k.n)}</div><div class="dr-cue">State the doctrine, the ruling, and the deciding fact.</div>`;
  if(c.dir==="dc")return `${lbl}<div class="dr-front" style="margin-top:14px;text-align:center;font-size:1.1rem">${k.d}</div><div class="dr-cue" style="margin-top:10px">Which case?</div>`;
  const facts=k.f.replace(new RegExp(SHORT[k.id].replace(/[.*+?^${}()|[\]\\]/g,"\\$&"),"gi"),"▢▢▢");
  if(c.dir==="fc")return `${lbl}<div class="dr-front" style="margin-top:12px">${facts}</div><div class="dr-cue" style="margin-top:10px">Name the case.</div>`;
  return `${lbl}<div class="dr-front" style="margin-top:12px">${k.f}</div><div class="dr-cue" style="margin-top:10px">Ruling? Which element was met or failed, and <b>why</b>?</div>`;
}
function cardBack(c){
  if(c.deck==="codal"){let bi=0;const para=c.ar.p[c.pi].replace(/\[\[(.+?)\]\]/g,(m,x)=>{const r=bi===c.bi?`<span class="dr-fill">${x}</span>`:x;bi++;return r;});return `<div class="rv-codal">${para}</div>`;}
  if(c.deck==="elements")return `<div><span class="dr-fill">${c.L.i[c.ii]}</span></div>`;
  const k=c.c, head=`<div class="disp" style="font-style:italic;font-size:1.2rem;text-align:center">${esc(k.n)}${hook(k)}</div><div class="cd-muted" style="text-align:center;font-size:.85rem">${esc(k.c)}</div>`;
  if(c.dir==="fc"||c.dir==="dc")return `${head}<p><b>Doctrine:</b> ${k.d}</p><p class="cd-muted">${k.r}</p>${c.dir==="dc"?`<details><summary>Facts</summary>${k.f}</details>`:""}`;
  return `${head}<p><b>Ruling:</b> ${k.r}</p><p><b>Why:</b> ${k.w}</p><p><b>Doctrine:</b> ${k.d}</p>${k.k&&k.k.length?`<details><summary>Recit nitpicks</summary><ul>${k.k.map(x=>`<li>${x}</li>`).join("")}</ul></details>`:""}`;
}
function renderDrill(){
  const m=$("main");
  if(D.i>=D.q.length){m.innerHTML=`<div class="fx-bar"><span>${esc(D.title)}</span><button class="cd-btn sm" id="exit">Exit</button></div><div class="dr-shell"><div class="cd-card dr-done"><div class="disp" style="font-size:1.6rem">Round done</div><p class="cd-muted">${D.q.length} cards · streak ${stats.streak} (best ${stats.best}) · fix list ${Object.keys(fix).length}</p><div class="cd-row" style="justify-content:center"><button class="cd-btn pri" id="again">Another round</button>${D.hist.length?'<button class="cd-btn" id="prev">← Previous</button>':""}<button class="cd-btn" id="exit2">Done</button></div></div></div>`;
    $("#exit",m).onclick=exitDrill;$("#exit2",m).onclick=exitDrill;const p=$("#prev",m);if(p)p.onclick=undo;
    $("#again",m).onclick=()=>{const P=D.pool;drill(buildRound(P,20),D.title,D.back,P);};return;}
  const id=D.q[D.i], c=CARDS[id];
  m.innerHTML=`<div class="fx-bar"><span>${esc(D.title)} · ${countdown().replace(/<[^>]+>/g,"")}</span><button class="cd-btn sm" id="exit">Exit (Esc)</button></div>
  <div class="dr-shell"><div class="dr-bar"><span>${D.i+1} / ${D.q.length}${id in fix?' · <span style="color:var(--red)">fix list</span>':""}</span><span>🔥 ${stats.streak}</span></div>
  <div class="cd-card dr-card" id="card">${cardFront(c)}${D.flipped?`<div class="dr-ans">${cardBack(c)}</div>`:'<button class="cd-btn dr-show" id="flip">Show answer (Space)</button>'}</div>
  ${D.flipped?`<div class="dr-grades"><button class="g1" data-g="1">Again<small>1 · ← swipe</small></button><button class="g2" data-g="2">Hard<small>2</small></button><button class="g3" data-g="3">Good<small>3 · swipe →</small></button><button class="g4" data-g="4">Easy<small>4 · swipe ↑</small></button></div>`:""}
  <div class="cd-row" style="margin-top:10px;justify-content:space-between"><button class="cd-btn sm" id="prev" ${D.hist.length?"":"disabled"}>← Previous</button><span class="cd-muted" style="font-size:.8rem">Space flip · 1–4 grade · ← back · Esc exit</span></div></div>`;
  $("#exit",m).onclick=exitDrill; $("#prev",m).onclick=undo;
  const f=$("#flip",m); if(f)f.onclick=flip;
  $$(".dr-grades button",m).forEach(b=>b.onclick=()=>doGrade(+b.dataset.g));
  const card=$("#card",m); let sx=0,sy=0,st=0;
  card.addEventListener("touchstart",e=>{const t=e.touches[0];sx=t.clientX;sy=t.clientY;st=Date.now();},{passive:true});
  card.addEventListener("touchend",e=>{const t=e.changedTouches[0],dx=t.clientX-sx,dy=t.clientY-sy;
    if(Math.abs(dx)<12&&Math.abs(dy)<12&&Date.now()-st<400){if(!D.flipped&&!e.target.closest("summary,a,button"))flip();return;}
    if(!D.flipped)return; if(Math.abs(dx)>70&&Math.abs(dx)>Math.abs(dy))doGrade(dx>0?3:1); else if(dy<-80&&Math.abs(dy)>Math.abs(dx))doGrade(4);});
}
function flip(){if(!D||D.flipped)return;D.flipped=true;renderDrill();}
function doGrade(g){
  if(!D||!D.flipped)return; const id=D.q[D.i];
  D.hist.push({i:D.i,id,s:srs[id]?{...srs[id]}:null,f:id in fix?fix[id]:undefined,streak:stats.streak,best:stats.best,rev:stats.rev,qlen:D.q.length});
  grade(id,g);
  if(g===1&&!D.requeued.has(id)){D.requeued.add(id);D.q.push(id);}
  D.i++;D.flipped=false;renderDrill();
}
function undo(){
  if(!D||!D.hist.length)return; const h=D.hist.pop();
  if(h.s)srs[h.id]=h.s; else delete srs[h.id];
  if(h.f===undefined)delete fix[h.id]; else fix[h.id]=h.f;
  stats.streak=h.streak;stats.best=h.best;stats.rev=h.rev; D.q.length=h.qlen; D.requeued.delete(h.id);
  D.i=h.i;D.flipped=true;save();renderDrill();
}
document.addEventListener("keydown",e=>{
  if(!D){if(e.key==="Escape")$$(".md-bg").forEach(x=>x.remove());return;}
  if(e.target.matches("input,textarea"))return;
  if(e.key===" "){e.preventDefault();flip();}
  else if(/^[1-4]$/.test(e.key))doGrade(+e.key);
  else if(e.key==="ArrowLeft")undo();
  else if(e.key==="Escape"){if($(".md-bg"))$$(".md-bg").forEach(x=>x.remove());else exitDrill();}
});

// CODAL DRILL
V.codal=m=>{
  const sel=store.get("codalSel",{deck:"codal",arts:[]});
  const arts=CODAL.map(a=>a.a), tks=[...new Set(ELEMENTS.map(l=>l.t))];
  function pool(){const ids=(sel.deck==="both"?DECK.codal.concat(DECK.elements):DECK[sel.deck]);if(!sel.arts.length)return ids;return ids.filter(i=>{const c=CARDS[i];return c.deck==="codal"?sel.arts.includes(c.art):sel.arts.includes(Object.keys(ART_TOPIC).find(a=>ART_TOPIC[a]===c.t)||(c.t==="a4b"?"4":""));});}
  function draw(){
    const p=pool(), d=p.filter(isDue).length, s=p.filter(i=>srs[i]).length;
    m.innerHTML=`<div class="cd-card"><div class="mono">Anki-style cloze</div><h2 style="margin:4px 0">Codal & elements drill</h2><p class="cd-muted">One blank per card, inside its own paragraph or list. Flip, then grade yourself honestly; misses return until you get them right twice.</p>
    <div style="margin:10px 0"><span class="cd-muted">Deck: </span>${[["codal","Codal (verbatim)"],["elements","Reyes elements"],["both","Both"]].map(([k,l])=>`<span class="cd-chip ${sel.deck===k?"on":""}" data-deck="${k}" style="cursor:pointer">${l}</span>`).join("")}</div>
    <div><span class="cd-muted">Articles: </span><span class="cd-chip ${!sel.arts.length?"on":""}" data-art="" style="cursor:pointer">All</span>${arts.map(a=>`<span class="cd-chip ${sel.arts.includes(a)?"on":""}" data-art="${a}" style="cursor:pointer">Art. ${a}</span>`).join("")}</div>
    <div class="cd-row" style="margin-top:12px"><button class="cd-btn pri" id="go">▶ Start (${Math.min(20,p.length)} cards)</button><span class="cd-muted">${p.length} cards · ${s} seen · ${d} due</span></div></div>
    <div class="cd-card"><div class="mono">Read the codal first</div>${(sel.arts.length?sel.arts:arts).map(a=>codalHTML(a)).join("")}</div>`;
    m.onclick=e=>{const dk=e.target.closest("[data-deck]");if(dk){sel.deck=dk.dataset.deck;store.set("codalSel",sel);draw();}
      const ar=e.target.closest("[data-art]");if(ar){const a=ar.dataset.art;if(!a)sel.arts=[];else sel.arts=sel.arts.includes(a)?sel.arts.filter(x=>x!==a):sel.arts.concat(a);store.set("codalSel",sel);draw();}
      if(e.target.id==="go")drill(buildRound(pool(),20),"Codal drill","codal",pool());};
  }
  draw();
};

// CASES
V.cases=(m)=>{
  const sel=store.get("caseSel",{view:"browse",dir:"mix",topics:[],q:""});
  const tps=["a2","a3","a4a","a4b","a6","a11"];
  function filtered(){return CASES.filter(c=>(!sel.topics.length||sel.topics.includes(c.t))&&(!sel.q||strip(c.n+" "+c.h+" "+c.f+" "+c.d+" "+c.r).toLowerCase().includes(sel.q.toLowerCase())));}
  function draw(){
    const L=filtered();
    m.innerHTML=`<div class="cd-card"><div class="cd-row" style="justify-content:space-between"><h2 style="margin:0">Cases <span class="cd-muted" style="font-size:1rem">${CASES.length}</span></h2><div>${[["browse","Browse"],["drill","Drill"]].map(([k,l])=>`<span class="cd-chip ${sel.view===k?"on":""}" data-view="${k}" style="cursor:pointer">${l}</span>`).join("")}</div></div>
    <div style="margin-top:8px"><span class="cd-chip ${!sel.topics.length?"on":""}" data-tp="" style="cursor:pointer">All</span>${tps.map(t=>`<span class="cd-chip ${sel.topics.includes(t)?"on":""}" data-tp="${t}" style="cursor:pointer">${esc(TOPIC_NAME[t].split(" · ")[0])}</span>`).join("")}</div>
    ${sel.view==="drill"?`<div style="margin-top:6px"><span class="cd-muted">Direction: </span>${Object.entries(DIRS).concat([["mix","Mixed"]]).map(([k,l])=>`<span class="cd-chip ${sel.dir===k?"on":""}" data-dir="${k}" style="cursor:pointer">${l}</span>`).join("")}</div>
      <p class="cd-muted" style="font-size:.9rem">“Facts → ruling & why” is the crim mode: say who won, which element was met or failed, and the fact that decided it. Case names in the facts are hidden in “Facts → case”.</p>
      <button class="cd-btn pri" id="go">▶ Start (${Math.min(20,L.length)} cases)</button>`:`<input class="cd-in" id="q" placeholder="Filter by name, hook, fact…" value="${esc(sel.q)}" style="margin-top:8px">`}</div>
    ${sel.view==="browse"?`<div class="cs-list">${L.map(c=>`<div class="cd-card cs-item" data-case="${c.id}" style="margin:0"><span class="nm">${esc(c.n)}</span>${hook(c)}<div class="cd-muted" style="font-size:.85rem">${esc(c.c)} · ${esc(TOPIC_NAME[c.t])} · ${esc(c.g)}</div><div style="margin-top:4px">${c.d}</div></div>`).join("")}</div>`:""}`;
    m.onclick=e=>{const v=e.target.closest("[data-view]");if(v){sel.view=v.dataset.view;store.set("caseSel",sel);draw();return;}
      const tp=e.target.closest("[data-tp]");if(tp){const t=tp.dataset.tp;sel.topics=!t?[]:(sel.topics.includes(t)?sel.topics.filter(x=>x!==t):sel.topics.concat(t));store.set("caseSel",sel);draw();return;}
      const dr=e.target.closest("[data-dir]");if(dr){sel.dir=dr.dataset.dir;store.set("caseSel",sel);draw();return;}
      if(e.target.id==="go"){const cs=filtered();let ids;
        if(sel.dir==="mix"){const ks=Object.keys(DIRS);ids=cs.map(c=>{const pref=ks.map(d=>`k-${c.id}-${d}`);const due=pref.filter(isDue);return due[0]||pref[Math.floor(Math.random()*ks.length)];});}
        else ids=cs.map(c=>`k-${c.id}-${sel.dir}`);
        drill(buildRound(ids,20),"Cases · "+(sel.dir==="mix"?"Mixed":DIRS[sel.dir]),"cases",ids);}};
    const q=$("#q",m); if(q)q.oninput=()=>{sel.q=q.value;store.set("caseSel",sel);const pos=q.selectionStart;draw();const q2=$("#q",m);q2.focus();q2.setSelectionRange(pos,pos);};
  }
  draw();
};

// SAMPLEX
let timer=null;
V.samplex=(m,openId)=>{
  const sel=store.get("sxSel",{view:"essays",set:"Mock exam A"});
  if(openId){const e=ESSAYS.find(x=>x.id===openId);if(e){sel.view="essays";sel.set=e.set;}}
  const sets=[...new Set(ESSAYS.map(e=>e.set))];
  function draw(){
    let body="";
    if(sel.view==="essays"){const L=ESSAYS.filter(e=>e.set===sel.set);
      body=L.map((e,i)=>`<div class="cd-card" id="sx-${e.id}"><div class="cd-row" style="justify-content:space-between"><span class="mono">${esc(e.src)}</span><span>${sxdone[e.id]==="ok"?'<span class="hk hk-g">got it</span>':sxdone[e.id]==="miss"?'<span class="hk hk-r">redo</span>':""}</span></div>
      <div class="disp" style="font-size:1.05rem;margin:4px 0">Q${i+1}. ${e.t.map(t=>esc(TOPIC_NAME[t].split(" · ")[0])).join(" + ")}</div><div class="sx-q">${e.q}</div>
      <textarea class="cd-in" data-note="${e.id}" placeholder="Outline your answer (C-L-E-A-R). Saved on this device." style="margin-top:10px">${esc(notes[e.id]||"")}</textarea>
      <div class="cd-row" style="margin-top:8px"><button class="cd-btn sm" data-timer="${e.id}">⏱ 14:00</button><button class="cd-btn sm pri" data-rev="${e.id}">Show issues & model answer</button></div><div class="sx-a" data-ans="${e.id}" hidden>
      <div class="mono">Issues: tick the ones you spotted</div><div class="sx-iss">${e.iss.map(x=>`<label><input type="checkbox"> ${x}</label>`).join("")}</div>
      <div class="mono" style="margin-top:10px">Model answer</div><div>${linkCases(e.a)}</div><div class="rv-exam"><div class="mono">Back-page CLEAR</div>${e.c}</div>
      <div class="cd-row"><button class="cd-btn sm" data-mark="ok:${e.id}">✓ Got it</button><button class="cd-btn sm" data-mark="miss:${e.id}">✗ Missed issues → redo list</button></div></div></div>`).join("");}
    else{body=MCQ.map((q,i)=>`<div class="cd-card" data-mcq="${q.id}"><div class="mono">${esc(q.src)}</div><div style="margin:6px 0"><b>${i+1}.</b> ${q.q}</div>${q.ch.map((c,j)=>`<button class="mc-ch" data-ch="${j}">(${"ABCD"[j]}) ${c}</button>`).join("")}<div class="mc-why" hidden><p><b>Answer: (${"ABCD"[q.k]})</b> ${q.why}</p>${q.note?`<p class="cd-muted">Note: ${q.note}</p>`:""}</div></div>`).join("");}
    m.innerHTML=`<div class="cd-card"><div class="cd-row" style="justify-content:space-between"><h2 style="margin:0">Samplex</h2><div>${[["essays","Problems"],["mcq","MCQ"]].map(([k,l])=>`<span class="cd-chip ${sel.view===k?"on":""}" data-view="${k}" style="cursor:pointer">${l}</span>`).join("")}</div></div>
    ${sel.view==="essays"?`<div style="margin-top:8px">${sets.map(s=>`<span class="cd-chip ${sel.set===s?"on":""}" data-set="${esc(s)}" style="cursor:pointer">${esc(s)} (${ESSAYS.filter(e=>e.set===s).length})</span>`).join("")}</div><p class="cd-muted" style="font-size:.9rem;margin:6px 0 0">Mock exam A is modeled on his style: syllabus-case facts mixed and switched. Write first, then compare. About 14 minutes each.</p>`:`<p class="cd-muted" style="margin:6px 0 0">San Beda midterm MCQs (keys checked against Reyes) + mock items.</p>`}</div>${body}`;
    m.onclick=e=>{const v=e.target.closest("[data-view]");if(v){sel.view=v.dataset.view;store.set("sxSel",sel);draw();return;}
      const s=e.target.closest("[data-set]");if(s){sel.set=s.dataset.set;store.set("sxSel",sel);draw();return;}
      const r=e.target.closest("[data-rev]");if(r){const a=$(`[data-ans="${r.dataset.rev}"]`,m);a.hidden=!a.hidden;return;}
      const mk=e.target.closest("[data-mark]");if(mk){const[k,id]=mk.dataset.mark.split(":");sxdone[id]=k;save();draw();const el=$("#sx-"+id,m);if(el)el.scrollIntoView({block:"start"});return;}
      const tm=e.target.closest("[data-timer]");if(tm){if(timer)clearInterval(timer);let left=14*60;timer=setInterval(()=>{left--;if(!tm.isConnected){clearInterval(timer);return;}tm.textContent=`⏱ ${Math.floor(left/60)}:${String(left%60).padStart(2,"0")}`;if(left<=0){clearInterval(timer);tm.textContent="⏱ Time!";tm.style.color="var(--red)";}},1000);return;}
      const ch=e.target.closest("[data-ch]");if(ch){const box=ch.closest("[data-mcq]"),q=MCQ.find(x=>x.id===box.dataset.mcq);$$(".mc-ch",box).forEach((b,j)=>{b.classList.toggle("ok",j===q.k);b.classList.toggle("no",j===+ch.dataset.ch&&j!==q.k);});$(".mc-why",box).hidden=false;}};
    $$("[data-note]",m).forEach(t=>t.oninput=()=>{notes[t.dataset.note]=t.value;store.set("notes",notes);});
    if(openId){const el=$("#sx-"+openId,m);if(el){el.scrollIntoView({block:"start"});}openId=null;}
  }
  draw();
};

// SEARCH
const IDX=[];
CODAL.forEach(a=>IDX.push({k:"Codal",t:`Art. ${a.a}. ${a.t}`,x:strip(a.p.join(" ").replace(/\[\[|\]\]/g,"")),go:()=>go("codal")}));
TOPICS.forEach(T=>T.b.forEach(b=>{let x="";if(b.x)x=Array.isArray(b.x)?b.x.flat().join(" "):b.x;if(b.rows)x=b.rows.flat().join(" ");if(b.title)x=b.title+" "+x;if(x)IDX.push({k:"Reviewer",t:T.n,x:strip(x),go:()=>go("review",T.k)});}));
CASES.forEach(c=>IDX.push({k:"Case",t:c.n,x:strip([c.h,c.f,c.r,c.w,c.d,(c.k||[]).join(" ")].join(" ")),go:()=>openCase(c.id)}));
ELEMENTS.forEach(L=>IDX.push({k:"Elements",t:L.n,x:strip(L.i.join(" · ")),go:()=>go("codal")}));
ESSAYS.forEach(e=>IDX.push({k:"Samplex",t:e.set+" · "+e.src,x:strip(e.q+" "+e.a),go:()=>go("samplex",e.id)}));
V.search=(m,q)=>{
  q=(q||"").trim(); const words=q.toLowerCase().split(/\s+/).filter(Boolean);
  const hits=words.length?IDX.filter(h=>words.every(w=>(h.t+" "+h.x).toLowerCase().includes(w))).slice(0,60):[];
  const snip=x=>{const i=x.toLowerCase().indexOf(words[0]);const s=Math.max(0,i-70);let t=esc(x.slice(s,s+220));words.forEach(w=>{t=t.replace(new RegExp(w.replace(/[.*+?^${}()|[\]\\]/g,"\\$&"),"gi"),mm=>`<mark>${mm}</mark>`);});return(s?"…":"")+t+"…";};
  m.innerHTML=`<div class="cd-card"><h2 style="margin:0 0 6px">Search</h2><div class="cd-muted">${hits.length} result${hits.length===1?"":"s"} for “${esc(q)}”</div>${hits.map((h,i)=>`<div class="sr-hit" data-i="${i}"><span class="hk hk-b" style="margin:0 6px 0 0">${h.k}</span><b>${esc(h.t)}</b><div class="cd-muted" style="font-size:.9rem">${snip(h.x)}</div></div>`).join("")}</div>`;
  m.onclick=e=>{const h=e.target.closest("[data-i]");if(h)hits[+h.dataset.i].go();};
};

// ---------- boot ----------
function theme(t){if(t)document.documentElement.setAttribute("data-theme",t);else document.documentElement.removeAttribute("data-theme");store.set("theme",t||"");}
theme(store.get("theme",""));
$("#theme").onclick=()=>{const cur=document.documentElement.getAttribute("data-theme");const dark=cur?cur==="dark":matchMedia("(prefers-color-scheme: dark)").matches;theme(dark?"light":"dark");};
$$(".cd-tab").forEach(b=>b.onclick=()=>go(b.dataset.tab));
const sIn=$("#search"); let st; sIn.oninput=()=>{clearTimeout(st);st=setTimeout(()=>{if(sIn.value.trim().length>1)go("search",sIn.value);},250);};
sIn.onkeydown=e=>{if(e.key==="Enter")go("search",sIn.value);};
const tick=()=>{$("#count").innerHTML=countdown();}; tick(); setInterval(tick,30000);
go(V[tab]&&tab!=="search"?tab:"today");
})();
