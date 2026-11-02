// node site/tests/smoke.js [outdir]
const {chromium}=require('playwright');const path=require('path');
const FILE='file://'+path.resolve(__dirname,'../dist/crim1-midterm-desk.html');const OUT=process.argv[2]||'/tmp';
(async()=>{const b=await chromium.launch();let fails=0;
for(const [w,h] of [[400,860],[1280,900]]) for(const scheme of ['light','dark']){
  const ctx=await b.newContext({viewport:{width:w,height:h},colorScheme:scheme});const p=await ctx.newPage();const errs=[];
  p.on('pageerror',e=>errs.push(e.message));p.on('console',m=>{if(m.type()==='error'&&!/fonts\.g/.test(m.text()))errs.push(m.text())});
  await p.goto(FILE);await p.waitForSelector('.toc-card');
  const over=async(tag)=>{const o=await p.evaluate(()=>document.documentElement.scrollWidth-window.innerWidth);if(o>1){errs.push(`overflow ${o}px at ${tag}`);}};
  await over('today');if(w===400&&scheme==='light')await p.screenshot({path:`${OUT}/today-${w}.png`});
  // reviewer
  await p.click('[data-tab=review]');await p.click('.tb-toc [data-ch=a6]');await p.waitForSelector('.tb-codal');await over('review');
  await p.click('.gt [data-a=y]');await p.waitForSelector('.gt-q, .gt-end');
  await p.click('.tb-case-n');await p.waitForSelector('.md');await p.keyboard.press('Escape');
  if(await p.$('.md'))errs.push('modal not closed');
  await p.click('[data-read]');
  await p.click('.tb-toc [data-ch=a11]');await p.waitForSelector('.vz-meter');await p.click('.vz-meter [data-r=ua]');if(!/No self-defense/.test(await p.textContent('.vz-out')))errs.push('meter');await over('a11');
  for(const ch of ['a2','a4a','a6','a11']){await p.click(`.tb-toc [data-ch=${ch}]`);await p.waitForSelector('.tb-sec');await over(ch);if(scheme==='light')await p.screenshot({path:`${OUT}/ch-${ch}-${w}.png`,fullPage:true});}
  if(scheme==='dark')await p.screenshot({path:`${OUT}/review-${w}-dark.png`,fullPage:false});
  // codal drill
  await p.click('[data-tab=codal]');await p.click('#go');await p.waitForSelector('.dr-card');
  if(!(await p.$('.dr-blank')))errs.push('no blank on codal card');
  await p.keyboard.press(' ');await p.waitForSelector('.dr-fill');await over('drill');
  if(w===400&&scheme==='light')await p.screenshot({path:`${OUT}/codal-${w}.png`});
  await p.keyboard.press('1');await p.waitForSelector('#flip');await p.keyboard.press('ArrowLeft');await p.waitForSelector('.dr-grades');
  await p.keyboard.press('3');await p.keyboard.press('Escape');await p.waitForSelector('.cd-tabs');
  // cases drill fr
  await p.click('[data-tab=cases]');await p.click('[data-view=drill]');await p.click('[data-dir=fr]');await p.click('#go');await p.waitForSelector('.dr-card');
  await p.click('#flip');await p.waitForSelector('.dr-ans');const txt=await p.textContent('.dr-ans');if(!/Why:/.test(txt))errs.push('fr back missing why');
  if(w===1280&&scheme==='light')await p.screenshot({path:`${OUT}/case-fr-${w}.png`});
  await p.click('[data-g="4"]');await p.click('#exit');
  await p.click('[data-tab=cases]');await p.click('[data-view=browse]');await over('browse');
  // samplex
  await p.click('[data-tab=samplex]');await p.click('[data-rev]');await p.waitForSelector('.sx-a:not([hidden])');await over('samplex');
  await p.click('[data-view=mcq]');await p.click('.mc-ch');await p.waitForSelector('.mc-why:not([hidden])');
  // search
  await p.fill('#search','unlawful aggression');await p.keyboard.press('Enter');await p.waitForSelector('.sr-hit');
  const n=await p.$$eval('.sr-hit',x=>x.length);if(n<3)errs.push('few search hits '+n);
  // persistence
  await p.reload();await p.waitForSelector('main');const rv=await p.evaluate(()=>localStorage.getItem('crimdesk1:read2'));if(!rv||!rv.includes('a6-'))errs.push('read not persisted');
  console.log(`${w} ${scheme}: ${errs.length?'FAIL '+errs.join(' | '):'ok'}`);fails+=errs.length;await ctx.close();}
await b.close();process.exit(fails?1:0);})();
