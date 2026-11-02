// Diagram library for the textbook. Each entry returns HTML; interactive ones also get an init(el).
window.VIZ=(function(){
const box=(t,b,cls="")=>`<div class="vz-box ${cls}"><div class="vz-bt">${t}</div><div>${b}</div></div>`;
const arrow=`<div class="vz-arrow">→</div>`;
const fig=(cap,inner)=>`<figure class="vz"><div class="vz-in">${inner}</div><figcaption>${cap}</figcaption></figure>`;
const chip=(t,tone="")=>`<span class="vz-chip ${tone}">${t}</span>`;
const V={};

V.examclock=()=>fig("Two hours, about eight problems: budget about 14 minutes each.",
 `<div class="vz-bar3"><div style="flex:3" class="t-blue">Spot issues · 3 min</div><div style="flex:10" class="t-green">Write C-L-E-A-R · 10 min</div><div style="flex:1.2" class="t-gold">Check</div></div>`);

V.checklist=()=>fig("Run every problem through these checks, in order.",
 `<ol class="vz-steps">${[["Jurisdiction","Art. 2: where? which vessel? which office?"],["Is there a felony?","Art. 3: act + punishable + dolo/culpa; mistake of fact? special law?"],["Different result?","Art. 4(1): proximate cause; personae / ictus / praeter"],["Impossible crime?","Art. 4(2): persons or property; impossibility; no other felony"],["Stage","Art. 6: overt act? subjective phase? desistance? no frustrated theft or rape"],["Light felony?","Art. 7: only if consummated, unless against persons or property"],["Conspiracy / proposal","Art. 8: a crime by itself, or a mode of liability?"],["Classification / special law","Arts. 9–10, if asked"],["Justified?","Art. 11: unlawful aggression first; complete or incomplete; civil liability"]].map((s,i)=>`<li><b>${s[0]}</b><span>${s[1]}</span></li>`).join("")}</ol>`);

V.theories=()=>fig("The RPC is mainly classical; Art. 4(2) is its clearest positivist feature.",
 `<div class="vz-2">${box("Classical (basis of the RPC)","<ul><li>Free will → the choice to do wrong</li><li>Penalty = <b>retribution</b>, in proportion to the act</li><li>Focus on the <b>act</b> and its result</li><li>Fixed penalties; mechanical</li></ul>","t-green")}${box("Positivist","<ul><li>Crime as a social and natural phenomenon</li><li>Penalty = <b>reform and protection</b></li><li>Focus on the <b>offender</b></li><li>Individualized measures (e.g., Art. 4(2), minors)</li></ul>","t-blue")}</div>`);

V.territory=()=>fig("Within the inner zones, the RPC applies to everyone (territoriality + generality). Beyond them, it applies only in Art. 2's five cases.",
 `<div class="vz-terr"><svg viewBox="0 0 340 230" role="img" aria-label="Maritime zones">
 <circle cx="170" cy="190" r="170" class="z4"/><circle cx="170" cy="190" r="128" class="z3"/><circle cx="170" cy="190" r="92" class="z2"/><circle cx="170" cy="190" r="58" class="z1"/>
 <path d="M120 200 q20 -40 50 -30 q30 -25 55 5 q10 25 -20 30 q-40 15 -85 -5z" class="land"/>
 <text x="170" y="196" class="tl">Land + interior waters</text><text x="170" y="122" class="tl">Territorial sea · 12 nm</text><text x="170" y="86" class="tl">Contiguous zone · 24 nm</text><text x="170" y="48" class="tl">EEZ · 200 nm</text><text x="170" y="14" class="tl">High seas → Art. 2 exceptions only</text></svg>
 <div class="vz-legend">${chip("Sovereignty: the RPC applies","t-green")} ${chip("Limited rights only","t-gold")} ${chip("Outside: Art. 2(1)–(5)","t-blue")}</div></div>`);

V.vessels=()=>fig("A foreign merchant vessel in our waters: which crimes aboard can our courts try? (English rule)",
 `<div class="vz-grid">${[
 ["Affects only the ship's internal management","Not triable","t-red","—"],
 ["Breach of public order (e.g., smoking opium in our waters)","Triable","t-green","Wong Cheng"],
 ["A continuing offense that continues inside our waters","Triable","t-green","Bull"],
 ["In transit + mere possession of the drug","Not triable","t-red","Look Chaw"],
 ["In transit, but the drug is landed or sold here","Triable","t-green","Look Chaw"],
 ["Our port is the destination, with the drug aboard","Triable (importation)","t-green","Ah Sing"],
 ["Any crime aboard a foreign WARSHIP","Never triable","t-red","—"]].map(r=>`<div class="vz-row"><div>${r[0]}</div><div class="vz-res ${r[2]}">${r[1]}</div><div class="vz-case">${r[3]}</div></div>`).join("")}</div>`);

V.felony=()=>fig("A felony needs all three elements. Dolo and culpa share freedom and intelligence; only the third requisite differs.",
 `<div class="vz-fel"><div class="vz-fel-row"><div class="vz-pill"><b>1</b> Act or omission</div><div class="vz-op">+</div><div class="vz-pill"><b>2</b> Punishable by the RPC</div><div class="vz-op">+</div><div class="vz-pill"><b>3</b> Done by dolo <i>or</i> culpa</div></div>
 <div class="vz-2" style="margin-top:10px">${box("Dolo (deceit)","Freedom + Intelligence + <b>Intent</b>","t-green")}${box("Culpa (fault)","Freedom + Intelligence + <b>Imprudence or negligence</b> (lack of skill or foresight)","t-blue")}</div>
 <div class="vz-fel-res"><span class="vz-op">=</span><div class="vz-pill t-dark">FELONY</div></div></div>`);

V.ahchongoanis=()=>fig("Same mistake, opposite results: the deciding fact is whether there was time to verify.",
 `<div class="vz-2">${box("Ah Chong: acquitted","<ul><li>Dark room at 10:00 p.m.; door forced</li><li>Asked “Who is there?” twice; no answer</li><li>Hit by the chair, so attacked at that moment</li><li><b>No time to verify</b> → mistake without fault</li></ul>","t-green")}${box("Oanis: murder (mitigated)","<ul><li>The man was <b>asleep</b>, back to the door</li><li>No threat; Brigida had pointed out the room</li><li>They fired without asking who he was</li><li><b>Ample time to verify</b> → mistake with fault</li></ul>","t-red")}</div>`);

V.chain=()=>fig("The chain holds through the victim's condition, refusal of treatment, medical error and infection. Only a foreign force or the victim's deliberate act breaks it.",
 `<div class="vz-chain"><div class="vz-link t-dark">Felony<br><small>(punch, hack, burn)</small></div><div class="vz-arrow">→</div><div class="vz-link">Natural, continuous sequence</div><div class="vz-arrow">→</div><div class="vz-link t-red">Result<br><small>(death, injury)</small></div></div>
 <div class="vz-2" style="margin-top:10px">${box("Does NOT break the chain",`<ul><li>The victim's illness or weak constitution (<i>Garcia</i>)</li><li>Complications such as pneumonia or infection (<i>Mananquil</i>)</li><li>A second force set off by the felony (<i>Iligan</i>: the vehicle)</li><li>Refusal of treatment or surgery; jumping into water out of fear</li><li>Unskillful medical treatment</li></ul>`,"t-green")}${box("BREAKS the chain",`<ul><li>An active force <b>absolutely foreign</b> to the felony (lightning; an unrelated accident)</li><li>The victim's own <b>intentional</b> act (deliberately reopening the wound)</li><li>A later, independent illness (<i>Urbano</i>: tetanus weeks later; rabies in <i>Tammang</i>)</li></ul>`,"t-red")}</div>`);

V.threeerrors=()=>fig("The three situations under Art. 4(1).",
 `<div class="vz-3">${[
 ["Error in personae","He shoots the person in front of him, believing him to be B; it is C.",`<svg viewBox="0 0 120 50"><circle cx="12" cy="25" r="7" class="p"/><line x1="22" y1="25" x2="96" y2="25" class="ar"/><circle cx="106" cy="25" r="8" class="v"/><text x="106" y="47" class="tl">C (thought B)</text></svg>`,"Art. 49: the lesser penalty, in its maximum period (if the crimes differ)"],
 ["Aberratio ictus","He aims at A; the bullet hits B beside A.",`<svg viewBox="0 0 120 50"><circle cx="12" cy="25" r="7" class="p"/><line x1="22" y1="25" x2="70" y2="20" class="ar0"/><circle cx="80" cy="18" r="7" class="g"/><path d="M70 20 Q90 30 100 38" class="ar"/><circle cx="106" cy="40" r="7" class="v"/><text x="80" y="8" class="tl">A</text><text x="106" y="50" class="tl">B</text></svg>`,"Usually a complex crime (Art. 48)"],
 ["Praeter intentionem","He meant only to injure; the victim died.",`<svg viewBox="0 0 120 50"><rect x="8" y="30" width="26" height="12" class="g"/><text x="21" y="26" class="tl">intended</text><rect x="70" y="8" width="40" height="34" class="v"/><text x="90" y="5" class="tl">result</text><line x1="38" y1="36" x2="66" y2="28" class="ar"/></svg>`,"Mitigating, Art. 13(3), unless the means show intent"]].map(r=>`<div class="vz-box"><div class="vz-bt">${r[0]}</div>${r[2]}<div>${r[1]}</div><div class="vz-note">${r[3]}</div></div>`).join("")}</div>`);

V.impossibility=()=>fig("The kinds of impossibility, with an example of each.",
 `<div class="vz-tree"><div class="vz-pill t-dark">Art. 4(2): why the crime could not happen</div><div class="vz-branches">
 <div>${box("Inherent impossibility","<div class='vz-sub'><b>Legal</b>: the completed act would not be a crime: taking your own watch; shooting a corpse.</div><div class='vz-sub'><b>Physical / factual</b>: unknown circumstances prevent it: an empty pocket or safe; the victim not in the room (<i>Intod</i>); a worthless check (<i>Jacinto</i>).</div>","t-green")}</div>
 <div>${box("Inadequate means","Not enough: too little arsenic. (If the means were <b>adequate</b> and the victim survived anyway → <b>frustrated</b>.)","t-gold")}</div>
 <div>${box("Ineffectual means","Cannot work at all: sugar for arsenic; an unloaded gun.","t-blue")}</div></div></div>`);

V.art5=()=>fig("Art. 5 in one picture: the judge applies the law as written and writes to the President.",
 `<div class="vz-2">${box("¶1 · The act is not punishable","Court thinks it should be repressed → <b>acquit</b> → report to the Chief Executive (through the DOJ) recommending <b>legislation</b>.","t-blue")}${box("¶2 · The penalty is clearly excessive","Court finds the accused guilty → <b>imposes the penalty</b> and <b>does not suspend</b> it → recommends <b>executive clemency</b> (as in <i>Mananquil</i>).","t-green")}</div>`);

V.stages=()=>fig("From thought to consummation. Desistance works only inside the subjective phase.",
 `<div class="vz-stages">
 <div class="vz-st t-mute"><b>Internal acts</b><small>ideas, plans: never punished</small></div>
 <div class="vz-st t-mute"><b>Preparatory acts</b><small>buying poison, carrying a weapon: not punished unless the law says so</small></div>
 <div class="vz-st t-gold"><b>Attempted</b><small>overt acts begun; not all acts of execution done</small></div>
 <div class="vz-st t-blue"><b>Frustrated</b><small>all acts of execution done; result fails for independent causes</small></div>
 <div class="vz-st t-red"><b>Consummated</b><small>all elements present</small></div></div>
 <div class="vz-phase"><div style="grid-column:3/4" class="vz-ph t-gold">◀ subjective phase: offender still in control ▶</div><div style="grid-column:4/6" class="vz-ph t-blue">◀ objective phase ▶</div></div>
 <div class="vz-note" style="text-align:center">Spontaneous desistance during the attempt = not liable for the attempt (but liable for acts already done that are crimes).</div>`);

V.woundladder=()=>fig("Homicide/murder: the stage follows the wound (with intent to kill proven).",
 `<div class="vz-ladder">${[
 ["No intent to kill proven","Physical injuries (or threats)","Ravelo","t-mute"],
 ["Intent to kill + no hit, or a non-mortal wound","ATTEMPTED","Kalalo (four shots missed); Sy Pio (shoulder; victim hid)","t-gold"],
 ["Intent to kill + mortal wound, victim saved by medical help","FRUSTRATED","Eduave (8½-in. bolo gash; believed dead)","t-blue"],
 ["Victim dies","CONSUMMATED","—","t-red"]].map(r=>`<div class="vz-rung ${r[3]}"><div>${r[0]}</div><b>${r[1]}</b><span>${r[2]}</span></div>`).join("")}</div>`);

V.crimestages=()=>fig("When is it consummated? The answer depends on each crime's elements.",
 `<div class="vz-grid vz-cs">${[
 ["Theft","Upon <b>taking</b> (possession); disposal is immaterial. <b>No frustrated stage.</b>","Adiao · Valenzuela"],
 ["Robbery with violence or intimidation","Upon gaining <b>possession</b> of the thing.","Salvilla"],
 ["Robbery with force upon things","When the thing is <b>carried out</b> of the building; caught inside → frustrated.","(Reyes: the sugar sack)"],
 ["Estafa","Upon actual <b>damage</b> to the victim; caught before damage → frustrated.","(Dominguez)"],
 ["Rape","Upon <b>any penetration</b> (touching the labia). <b>No frustrated stage.</b>","Orita · Campuhan · Agao"],
 ["Homicide / murder","Upon <b>death</b>; mortal wound + survival → frustrated.","Eduave · Sy Pio"],
 ["Arson","When <b>any part</b> of the building is burned.","(2019 Bar: attempted)"],
 ["Formal crimes (slander, false testimony); physical injuries","In <b>one act</b>; no attempt or frustration.","(2017 Bar)"],
 ["Two-party crimes (bribery, betting)","Upon <b>agreement</b>; a rejected offer is an attempt.","(U.S. v. Basa)"]].map(r=>`<div class="vz-row"><div><b>${r[0]}</b></div><div>${r[1]}</div><div class="vz-case">${r[2]}</div></div>`).join("")}</div>`);

V.conspiracy=()=>fig("Two lives of conspiracy.",
 `<div class="vz-2">${box("As a felony in itself","Only when the law punishes it <b>and</b> the crime is <b>not</b> committed: treason (115), coup d'état, rebellion, insurrection (136), sedition (141), monopolies (186). <b>Proposal</b>: treason and Art. 136 only.","t-blue")}${box("As a mode of liability","The crime <b>is</b> committed → “the act of one is the act of all.” It may be implied from conduct, but it must be proven beyond reasonable doubt; mere presence is not enough (<i>Iligan</i>).","t-green")}</div>`);

V.gravity=()=>fig("Classify by the HIGHER penalty or period when the penalty is compound.",
 `<div class="vz-ladder">${[
 ["Capital","Death (imposition prohibited by RA 9346)","GRAVE","t-red"],
 ["Afflictive","Reclusion perpetua · reclusion temporal · perpetual/temporary absolute or special disqualification · prisión mayor · fine over ₱1,200,000","GRAVE","t-red"],
 ["Correctional","Prisión correccional · arresto mayor · suspension · destierro · fine ₱40,000–₱1,200,000","LESS GRAVE","t-gold"],
 ["Light","Arresto menor · public censure · (for Art. 9) a fine not exceeding ₱40,000","LIGHT","t-green"]].map(r=>`<div class="vz-rung ${r[3]}"><div><b>${r[0]}</b></div><span>${r[1]}</span><b>${r[2]}</b></div>`).join("")}</div>`);

V.speciallaw=()=>fig("Which RPC rules reach special laws?",
 `<div class="vz-2">${box("Generally apply (suppletory)","<ul><li>Conspiracy (Art. 8), as in <i>Ladonga</i></li><li>Subsidiary imprisonment and civil liability rules</li><li><b>All</b> the graduation rules, if the special law adopts RPC penalties (<i>Simon</i>)</li></ul>","t-green")}${box("Generally do NOT apply","<ul><li>Attempted and frustrated stages, unless the law provides for them</li><li>Accomplices and accessories (penalties one or two degrees lower)</li><li>Mitigating and aggravating circumstances (Art. 64)</li><li>Good faith as a defense (mala prohibita)</li></ul>","t-red")}</div>`);

V.justexempt=()=>fig("Justifying vs. exempting (Art. 12 comes after the midterm, but this contrast is asked often).",
 `<div class="vz-2">${box("Justifying (Art. 11)","<ul><li>The <b>act</b> is lawful</li><li>No crime, no criminal</li><li>No civil liability (except ¶4)</li><li>Benefits everyone who took part</li></ul>","t-green")}${box("Exempting (Art. 12)","<ul><li>The <b>actor</b> is not culpable</li><li>There is a crime but no criminal liability</li><li>Civil liability remains (except ¶¶4, 7)</li><li>Personal to the one exempt</li></ul>","t-blue")}</div>`);

V.aggression=()=>fig("Unlawful aggression on a timeline: defense is lawful only while the aggression lasts.",
 `<div class="vz-stages vz-ua">
 <div class="vz-st t-mute"><b>Mere threatening attitude</b><small>insults; a hand in the pocket: not yet aggression</small></div>
 <div class="vz-st t-gold"><b>Imminent</b><small>a raised bolo, a drawn and aimed gun: you may “prevent”</small></div>
 <div class="vz-st t-red"><b>Actual</b><small>the attack is happening: you may “repel”</small></div>
 <div class="vz-st t-blue"><b>Ceased</b><small>the aggressor flees or is disarmed: further harm is retaliation</small></div></div>
 <div class="vz-note" style="text-align:center"><i>Alconga</i>: first stage (actual) = self-defense; second stage (he ran) = homicide. A retreat to get a better position does not end the aggression.</div>`);

V.equivalence=()=>fig("Rational equivalence in the cases: what was reasonable, and what was not.",
 `<div class="vz-grid">${[
 ["Revolver vs. a policeman advancing with a bolo, 3–6 ft away","Reasonable","t-green","Mack"],
 ["Bolo vs. a bigger, stronger bully trying to wrest it away","Reasonable","t-green","Sumicad"],
 ["The aggressor's own knife vs. being choked","Reasonable","t-green","Boholst-Caballero"],
 ["Knife vs. attempted rape on a dark path","Reasonable","t-green","De la Cruz"],
 ["Knife to the neck vs. a hand on the thigh in a lighted, crowded chapel","Excessive","t-red","Jaurigue"],
 ["Shotgun vs. laborers chiselling one's walls","Excessive","t-red","Narvaez"],
 ["Armalite without warning vs. a drunk at a prom","Excessive (duty)","t-red","Belbes"]].map(r=>`<div class="vz-row"><div>${r[0]}</div><div class="vz-res ${r[2]}">${r[1]}</div><div class="vz-case">${r[3]}</div></div>`).join("")}</div>`);

V.bws=()=>fig("The cycle of violence must happen at least twice (Genosa).",
 `<div class="vz-cyc"><div class="vz-st t-gold"><b>1 · Tension-building</b><small>minor battering, verbal or slight physical abuse</small></div><div class="vz-arrow">→</div><div class="vz-st t-red"><b>2 · Acute battering</b><small>brutal, unpredictable; only the batterer can end it</small></div><div class="vz-arrow">→</div><div class="vz-st t-green"><b>3 · Tranquil, loving</b><small>relief, apologies, hope that it won't happen again</small></div><div class="vz-loop">↺ repeats · at least twice</div></div>
 <div class="vz-note" style="text-align:center">RA 9262 § 26: BWS proven → no criminal and no civil liability, even without the self-defense requisites.</div>`);

V.relatives=()=>fig("Who may be defended under Art. 11(2). Green = a relative under ¶2; red = a “stranger” under ¶3.",
 `<div class="vz-kin2">
 <div class="vz-kg"><div class="vz-kh">Spouse</div><div>${chip("Spouse","t-green")}</div></div>
 <div class="vz-kg"><div class="vz-kh">Ascendants & descendants (any degree)</div><div>${chip("Parents 1°","t-green")}${chip("Grandparents 2°","t-green")}${chip("Children 1°","t-green")}${chip("Grandchildren 2°","t-green")}</div></div>
 <div class="vz-kg"><div class="vz-kh">Brothers & sisters</div><div>${chip("Legitimate, natural or adopted siblings 2°","t-green")}</div></div>
 <div class="vz-kg"><div class="vz-kh">By affinity: same degrees only</div><div>${chip("Parents-in-law","t-green")}${chip("Children-in-law","t-green")}${chip("Brothers/sisters-in-law","t-green")}</div></div>
 <div class="vz-kg"><div class="vz-kh">Consanguinity within the 4th civil degree</div><div>${chip("Uncles, aunts 3°","t-green")}${chip("Nephews, nieces 3°","t-green")}${chip("First cousins 4°","t-green")}</div></div>
 <div class="vz-kg"><div class="vz-kh">NOT relatives (use ¶3)</div><div>${chip("Spouse's first cousin","t-red")}${chip("Second cousins 6°","t-red")}${chip("Husband of one's sister-in-law (Cabellon)","t-red")}${chip("Best friend","t-red")}</div></div></div>
 <div class="vz-note">Counting civil degrees: go up to the common ancestor, then down, one degree per generation. You → parent (1) → sibling (2); → grandparent (2) → uncle (3) → first cousin (4).</div>`);

V.necessity=()=>fig("¶4 weighs two evils; the scale must tip clearly toward the evil avoided.",
 `<div class="vz-2">${box("Justified","<ul><li>A loveless marriage avoided; damage to honor caused (<i>Norma Hernandez</i>)</li><li>The fetus sacrificed to save the mother</li><li>Burning houses pulled down to stop a fire</li><li>Cargo thrown overboard to save a ship</li></ul>","t-green")}${box("Not justified","<ul><li>A life for a life (<i>Dudley</i>)</li><li>An imagined or speculative evil; other means available; an evil of one's own making (<i>Ty</i>)</li><li>Stopping a lawful defense (2004 Bar)</li></ul>","t-red")}</div><div class="vz-note" style="text-align:center">Civil liability: the persons <b>benefited</b> pay, in proportion to their benefit (Art. 101).</div>`);

V.sdmeter={html:()=>fig("Toggle the requisites to see the result. Unlawful aggression controls everything.",
 `<div class="vz-meter"><label><input type="checkbox" data-r="ua" checked> Unlawful aggression</label><label><input type="checkbox" data-r="rn" checked> Reasonable necessity of the means</label><label><input type="checkbox" data-r="lp" checked> Lack of sufficient provocation</label><div class="vz-out" aria-live="polite"></div></div>`),
 init:el=>{const out=el.querySelector(".vz-out");const upd=()=>{const v=k=>el.querySelector(`[data-r=${k}]`).checked;const ua=v("ua"),n=(v("rn")?1:0)+(v("lp")?1:0);let t,c;
  if(!ua){t="<b>No self-defense at all</b>, complete or incomplete. Look to other mitigating circumstances in Art. 13 (provocation, passion).";c="t-red";}
  else if(n===2){t="<b>Complete self-defense.</b> Acquittal; no criminal or civil liability (Mack; Boholst-Caballero).";c="t-green";}
  else if(n===1){t="<b>Incomplete self-defense: privileged mitigating</b> (unlawful aggression + the majority of requisites) → penalty 1 or 2 degrees lower (Art. 69). E.g., Jaurigue, Narvaez.";c="t-gold";}
  else {t="<b>Incomplete self-defense: ordinary mitigating</b> under Art. 13(1) (unlawful aggression alone).";c="t-blue";}
  out.className="vz-out "+c;out.innerHTML=t;};el.querySelectorAll("input").forEach(i=>i.onchange=upd);upd();}};

return V;})();
