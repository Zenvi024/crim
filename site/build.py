#!/usr/bin/env python3
"""Build the single-file Crim 1 Midterm Desk: python3 site/build.py -> site/dist/crim1-midterm-desk.html"""
import json, pathlib, re, subprocess

ROOT = pathlib.Path(__file__).resolve().parent
src, data, dist = ROOT / "src", ROOT / "data", ROOT / "dist"
dist.mkdir(exist_ok=True)

order = ["cases.js", "codal.js", "reviewer.js", "samplex.js"]
datajs = "\n".join((data / f).read_text(encoding="utf-8") for f in order)

# --- validation (node evaluates the data and checks references) ---
check = r"""
const vm=require('vm');const w={};vm.runInNewContext(require('fs').readFileSync(0,'utf8'),{window:w});
const C=w.CASES,ids=new Set(C.map(c=>c.id)),T=new Set(w.TOPICS.map(t=>t.k));let err=[];
if(ids.size!==C.length)err.push('duplicate case id');
C.forEach(c=>{['n','c','t','h','hc','f','r','w','d'].forEach(k=>{if(!c[k])err.push(c.id+' missing '+k)});if(!T.has(c.t))err.push(c.id+' bad topic '+c.t);if(!'gryb'.includes(c.hc))err.push(c.id+' bad hc')});
w.TOPICS.forEach(t=>t.b.forEach(b=>{if(b.k==='cases')b.ids.forEach(i=>{if(!ids.has(i))err.push(t.k+' unknown case '+i)});if(b.k==='gate'&&!w.GATES[b.id])err.push('gate '+b.id);if(b.k==='codal'&&!w.CODAL.find(a=>a.a===b.a))err.push('codal '+b.a)}));
w.ELEMENTS.forEach(e=>{if(!T.has(e.t))err.push('element topic '+e.id+' '+e.t)});
w.ESSAYS.forEach(e=>e.t.forEach(t=>{if(!T.has(t))err.push('essay topic '+e.id)}));
w.MCQ.forEach(q=>{if(q.k<0||q.k>=q.ch.length)err.push('mcq key '+q.id)});
const syl=['bull','vanwilsem','wongcheng','lookchaw','ahsing','lollo','ahchong','oanis','magsumbol','gervero','iligan','mananquil','brobst','garcia','balmores','intod','domasian','jacinto','eduave','orita','campuhan','adiao','valenzuela','lamahang','salvilla','borinaga','sypio','ravelo','kalalo','boholst','alconga','mack','sumicad','genosa','luague','delacruz','jaurigue','apolinar','bumanglag','narvaez','chuahiong','pelayo','esmedia','normahernandez','dudley','ty','delima','belbes','beronilla'];
syl.forEach(i=>{if(!ids.has(i))err.push('syllabus case missing '+i)});
const cl=w.CODAL.reduce((n,a)=>n+a.p.join('').split('[[').length-1,0);
const el=w.ELEMENTS.reduce((n,e)=>n+e.i.length,0);
if(err.length){console.error(err.join('\n'));process.exit(1)}
console.log(JSON.stringify({cases:C.length,syllabus:syl.length,codalCloze:cl,elementCards:el,caseCards:C.length*4,topics:T.size,essays:w.ESSAYS.length,mcq:w.MCQ.length}));
"""
res = subprocess.run(["node", "-e", check], input=datajs, capture_output=True, text=True)
if res.returncode:
    raise SystemExit("DATA CHECK FAILED:\n" + res.stderr)
print("data ok:", res.stdout.strip())

html = (src / "template.html").read_text(encoding="utf-8")
html = html.replace("/*CSS*/", (src / "style.css").read_text(encoding="utf-8"))
html = html.replace("/*DATA*/", datajs.replace("</script", "<\\/script"))
html = html.replace("/*APP*/", (src / "app.js").read_text(encoding="utf-8"))
out = dist / "crim1-midterm-desk.html"
out.write_text(html, encoding="utf-8")
print("wrote", out, f"{out.stat().st_size/1024:.0f} KB")
