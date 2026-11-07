HEADER = "CRIM 1 · ARTS. 1–11 · ALL 49 CASES · FACTS → RULE"
PRON = [
 (r"\bOanis\b","Oh-ah-nees"),(r"\bIligan\b","Ee-lee-gahn"),(r"\bMananquil\b","Mah-nahn-keel"),(r"\bBalmores\b","Bal-mor-ess"),
 (r"\bIntod\b","In-tod"),(r"\bDomasian\b","Doh-mah-syahn"),(r"\bJacinto\b","Hah-seen-toh"),(r"\bEduave\b","Eh-dwah-veh"),
 (r"\bOrita\b","Oh-ree-tah"),(r"\bCampuhan\b","Kahm-poo-hahn"),(r"\bAdiao\b","Ah-dyow"),(r"\bLamahang\b","Lah-mah-hahng"),
 (r"\bSalvilla\b","Sal-vee-ya"),(r"\bBorinaga\b","Boh-ree-nah-gah"),(r"\bSy Pio\b","See Pyoh"),(r"\bRavelo\b","Rah-veh-loh"),
 (r"\bKalalo\b","Kah-lah-loh"),(r"\bBoholst-Caballero\b","Boh-holst Kah-bah-yeh-roh"),(r"\bAlconga\b","Al-kong-gah"),
 (r"\bSumicad\b","Soo-mee-kahd"),(r"\bGenosa\b","Heh-noh-sah"),(r"\bLuague\b","Lwah-geh"),(r"\bJaurigue\b","How-ree-geh"),
 (r"\bApolinar\b","Ah-poh-lee-nar"),(r"\bBumanglag\b","Boo-mahng-lahg"),(r"\bNarvaez\b","Nar-vah-ess"),(r"\bChua Hiong\b","Choo-ah Hyong"),
 (r"\bPelayo\b","Peh-lah-yoh"),(r"\bEsmedia\b","Ess-meh-dyah"),(r"\bDelima\b","Deh-lee-mah"),(r"\bBelbes\b","Bel-bess"),
 (r"\bBeronilla\b","Beh-roh-nee-ya"),(r"\bLol-lo\b","Lol-loh"),(r"\bSaraw\b","Sah-rau"),(r"\bLook Chaw\b","Look Chow"),
 (r"\bMagsumbol\b","Mag-soom-bol"),(r"\bGervero\b","Her-veh-roh"),(r"\bGualberto\b","Gwal-ber-toh"),(r"\bNapilon\b","Nah-pee-lon"),
 (r"\bdolo\b","doh-loh"),(r"\bculpa\b","kool-pah"),(r"\bpraeter intentionem\b","pray-ter in-ten-shee-oh-nem"),
 (r"\baberratio ictus\b","ab-eh-rah-shee-oh ik-tus"),(r"\berror in personae\b","error in per-soh-nay"),
 (r"\bhostes humani generis\b","hos-teez hyoo-mah-nee jen-er-iss"),(r"\bapoderamiento\b","ah-poh-deh-rah-myen-toh"),
 (r"\bbalisong\b","bah-lee-song"),(r"\bpingahan\b","pee-ngah-hahn"),(r"\bBP 22\b","B P twenty-two"),(r"\bRA 9262\b","R A ninety-two sixty-two"),
 (r"\bTy\b","Tee"),(r"\bSy\b","See"),(r"\bMooney\b","Moo-nee"),(r"\bBalagtas\b","Bah-lahg-tahs"),(r"\bTecson\b","Tek-son"),
 (r"\bCubol\b","Koo-bol"),(r"\bQuiñones\b","Kee-nyo-nes"),(r"\bAvelina\b","Ah-veh-lee-nah"),(r"\bFleischer\b","Fly-sher"),
 (r"\bSaldivar\b","Sal-dee-var"),(r"\bAmpieng\b","Am-pyeng"),(r"\bBernardina\b","Ber-nar-dee-nah"),(r"\bMarivic\b","Mah-ree-vik"),
 (r"\bMurakami\b","Moo-rah-kah-mee"),(r"\bTomambing\b","Toh-mahm-bing"),(r"\bArmalite\b","Arma-lite"),(r"\bLugatiman\b","Loo-gah-tee-mahn"),
]
SCENES = []
def S(id, chapter, beats, html): SCENES.append(dict(id=id, chapter=chapter, beats=beats, html=html))

S("title","Intro",[
 "Forty-nine cases. Six topics. One rule each.",
 "For every case: the facts that decided it, then the doctrine you write in your answer.",
 "Watch for the one fact in each case that flips the result. That is what Sir switches in his problems."],
"""<div class="fill col center-v gap36">
 <div class="kicker" data-fx="fade">Criminal Law 1 · Prof. Gutierrez · Midterm</div>
 <div class="title" data-fx="up">49 cases<span class="vs"> in </span>one sitting</div>
 <div class="row gap24" data-fx="up" data-b="1"><span class="chip court">KEY FACTS</span><span class="h2" style="font-size:60px">→</span><span class="chip court">RULE</span></div>
 <div class="banner" data-fx="pop" data-b="2">Find the <b>deciding fact</b>: that is what gets switched on the exam.</div>
</div>""")

def intro(id, chap, title, rule_lines, beats):
    rows = "".join(f'<div class="rc" data-fx="up" data-b="{min(i+1,len(beats)-1)}"><span class="rn">{i+1}</span><div>{r}</div></div>' for i, r in enumerate(rule_lines))
    S(id, chap, beats, f"""<div class="fill col gap28">
 <div class="head"><div class="kicker" data-fx="fade">{chap}</div><div class="h2" data-fx="up">{title}</div></div>
 <div class="col gap18 grow center-v">{rows}</div></div>""")

N = [0]
def case(id, chap, name, cite, hook, verdict, vcls, facts, rule, b_facts, b_rule):
    N[0] += 1
    chips = "".join(f'<div class="fact" data-fx="up" data-b="1" data-d="{0.3+i*1.6:.1f}"><span class="tn">{i+1}</span><div>{f}</div></div>' for i, f in enumerate(facts))
    S(id, chap, [f"{name}. {hook}.", b_facts, b_rule], f"""<div class="fill col gap24">
 <div class="row between"><div class="head"><div class="kicker">{chap} · case {N[0]} of 49</div><div class="h2 cname">{name}</div><div class="m sm">{cite}</div></div>
 <div class="verdict {vcls}" data-fx="stamp" data-b="2">{verdict}</div></div>
 <div class="pill court" data-fx="pop" data-d="0.5">{hook}</div>
 <div class="grid2 gap28 grow">
  <div class="pcard" data-fx="left" data-b="1"><div class="kicker sm">Key facts</div>{chips}</div>
  <div class="pcard rulebox" data-fx="right" data-b="2"><div class="kicker sm court">The rule</div><div class="rule">{rule}</div></div>
 </div></div>""")

# ───────── ART. 2
intro("i2","Art. 2","Where the Code applies",[
 "Inside our territory: everyone, any nationality (territoriality + generality).",
 "Foreign <b>merchant</b> ship in our waters: triable unless it's purely internal (English rule). Warships: never.",
 "Outside: only the five cases of Art. 2, including crimes against the law of nations."],
 ["Article Two. Where the Code applies.","Inside our territory, the Code binds everyone. A crime aboard a foreign merchant ship in our waters is triable here unless it only concerns the ship's internal management: the English rule.","Outside our territory, the Code reaches only the five cases in Article Two."])
case("bull","Art. 2","U.S. v. Bull","15 Phil. 7 (1910)","Cattle in transit","CONVICTED","no",
 ["Norwegian ship <i>Standard</i>, Formosa → Manila","677 cattle and carabaos, no stalls","Act No. 55 (animal cruelty)"],
 "A <b>continuing offense</b> that continues inside our waters is triable here, whatever the ship's flag.",
 "Bull, master of the Norwegian ship Standard, carried six hundred seventy-seven cattle and carabaos from Formosa to Manila with no stalls to secure them. He said the offense happened on the high seas.",
 "Conviction affirmed. The forbidden condition continued inside our waters, so our courts had jurisdiction: a continuing offense is triable here.")
case("vanwilsem","Art. 2","Del Socorro v. Van Wilsem","G.R. No. 193707 (2014)","Dutch dad, no support","REMANDED","grey",
 ["Dutch father, divorced in Holland","Promised support, never paid","Remarried and lives in Cebu"],
 "Penal laws bind foreigners who <b>live or sojourn</b> here; unproved foreign law is presumed the same as ours.",
 "A Dutch national promised to support his son after their divorce in Holland, never paid, then moved to Cebu and remarried. The trial court dismissed the case under R A ninety-two sixty-two because he was a foreigner.",
 "Reversed and remanded. Penal laws bind all who live or sojourn here, and since he never proved Dutch law, it is presumed to be the same as ours.")
case("wongcheng","Art. 2","People v. Wong Cheng","46 Phil. 729 (1922)","Opium smoked aboard","TRIABLE","no",
 ["English ship <i>Changsa</i>","Anchored 2½ miles off Manila","Smoked opium on board"],
 "Smoking opium aboard a foreign merchant ship in our waters is a <b>breach of public order</b>: triable here.",
 "Wong Cheng smoked opium aboard the English ship Changsa, anchored two and a half miles off Manila. The trial court dismissed for lack of jurisdiction.",
 "Reversed. We follow the English rule. Smoking opium here makes the drug take effect in our territory, a breach of public order, so our courts can try it.")
case("lookchaw","Art. 2","U.S. v. Look Chaw","18 Phil. 573","Opium landed, sold","CONVICTED","no",
 ["Ship <i>Erroll</i> in transit, Hong Kong → Mexico","Anchored at Cebu; sacks of opium","He sold opium here"],
 "Mere <b>possession</b> in transit is not triable; <b>landing or selling</b> the drug here is.",
 "The ship Erroll was in transit from Hong Kong to Mexico when it stopped at Cebu. Agents found sacks of opium under Look Chaw's control, and he had sold opium here.",
 "Convicted. Mere possession aboard a ship in transit is not triable here, but once the opium is landed or sold on our soil, it is an open violation of our laws.")
case("ahsing","Art. 2","U.S. v. Ah Sing","36 Phil. 978 (1917)","Opium, terminal port","CONVICTED","no",
 ["Fireman on the <i>Shun Chang</i>","8 cans of opium from Saigon","Cebu was the destination"],
 "Bringing drugs to a Philippine port that is the ship's <b>destination</b> consummates illegal importation.",
 "Ah Sing, a fireman on the Shun Chang, bought eight cans of opium in Saigon. They were found hidden in the ashes below the boiler when the ship reached Cebu, its destination.",
 "Convicted of illegal importation. The ship was not in transit, so importation was complete once it entered port with the drug aboard.")
case("lollo","Art. 2","People v. Lol-lo and Saraw","43 Phil. 19 (1922)","Moro pirates","PIRACY","no",
 ["Dutch boat attacked in Dutch waters","Cargo taken, two women raped","Arrested in Tawi-Tawi"],
 "Pirates are <b>hostes humani generis</b>, enemies of mankind: triable anywhere.",
 "Armed Moros attacked a boat of Dutch subjects in the Dutch East Indies, took the cargo, raped two women and tried to sink the boat. Lol-lo and Saraw went home to Tawi-Tawi, where they were arrested.",
 "Piracy, and our courts had jurisdiction. Pirates are hostes humani generis, enemies of all mankind, so they may be tried wherever they are found. Lol-lo was sentenced to death.")

# ───────── ART. 3
intro("i3","Art. 3","Felonies: intent and mistake",[
 "Felony = act or omission + punishable + <b>dolo</b> (freedom, intelligence, intent) or <b>culpa</b>.",
 "Mistake of fact excuses if: lawful had facts been as believed · lawful intent · <b>no fault</b>.",
 "Sir's one lesson: there must be <b>intent</b> for a crime."],
 ["Article Three. Felonies, intent and mistake of fact.","A felony needs an act or omission, punishable by law, done by dolo or culpa.","Mistake of fact excuses only if the act would have been lawful had the facts been as believed, the intent was lawful, and the mistake was without fault."])
case("ahchong","Art. 3","U.S. v. Ah Chong","15 Phil. 488 (1910)","Roommate 'robber'","ACQUITTED","yes",
 ["Dark room at 10 p.m.; door forced open","“Who is there?” twice, no answer","Hit by the chair; knife from under pillow"],
 "An honest mistake of fact <b>without fault</b> negates intent: no time to verify, no crime.",
 "Ah Chong, a cook at Fort McKinley, was woken at ten at night by someone forcing the door. He asked who is there twice, got no answer, was hit by the chair, and stabbed the intruder with the knife under his pillow. It was his roommate, Pascual Gualberto.",
 "Acquitted. Had the facts been as he believed, it was lawful self-defense; he acted in good faith with no time to verify. No intent, no felony.")
case("oanis","Art. 3","People v. Oanis","74 Phil. 257 (1943)","Shot the sleeper","MURDER, MITIGATED","grey",
 ["Ordered to get Balagtas 'dead or alive'","Man asleep, back to the door","Fired without asking; it was Tecson"],
 "A mistake through <b>fault</b> does not excuse. With time to verify, killing is murder, at most mitigated.",
 "Officers Oanis and Galanta, hunting the escaped convict Balagtas, found a man asleep with his back to the door and fired without asking who he was. He was an innocent man, Serapio Tecson.",
 "Murder, mitigated by incomplete fulfillment of duty. Unlike Ah Chong, they had time to verify, so the mistake was their fault. A deliberate shooting is dolo, not reckless imprudence.")
case("magsumbol","Art. 3","Magsumbol v. People","G.R. No. 207175 (2014)","Coconut trees, unclear boundary","ACQUITTED","yes",
 ["33 coconut trees cut","Authorized by Atanacio, a brother-in-law","Boundary between lots unclear"],
 "A good-faith belief that one is <b>authorized</b> negates intent to gain in theft.",
 "Magsumbol and others cut thirty-three coconut trees, believing they stood on the land of Atanacio, who had authorized them. The trees were on the adjoining lot, and the boundary was unclear.",
 "Acquitted on reasonable doubt. Intent to gain was not proven: they acted openly and in good faith, so the mistake of fact negated criminal intent.")
case("gervero","Art. 3","People v. Gervero","G.R. No. 206725 (2018)","'Thought they were NPA'","MURDER","no",
 ["CAFGU men asked the victims for money","Hours later, shot them in the rice field","Claimed they mistook them for NPA"],
 "The mistake must be <b>reasonable</b>, and the act lawful under the facts believed. Neither here.",
 "CAFGU members asked a village watch commander for money, then hours later shot him and two others dead. They claimed they mistook the victims for N P A rebels.",
 "Murder affirmed. They had met the victims hours earlier, so the mistake was not honest, and killing without verifying would not have been lawful anyway.")

# ───────── ART. 4(1)
intro("i4a","Art. 4(1)","Wrong different from intended",[
 "Liable for all <b>direct, natural and logical</b> consequences of an intentional felony.",
 "Proximate cause: unbroken by an <b>efficient intervening cause</b>. Illness, complications, refused treatment don't break it.",
 "Error in personae · aberratio ictus · praeter intentionem."],
 ["Article Four, paragraph one. A wrong different from the one intended.","Whoever commits a felony is liable for its direct, natural and logical consequences, as long as the felony is the proximate cause.","The victim's illness, hospital complications and refused treatment do not break the chain."])
case("iligan","Art. 4(1)","People v. Iligan","191 SCRA 643 (1990)","Hacked, then run over","HOMICIDE","no",
 ["Hacked on the head with a bolo","Then run over by a vehicle","Death cert: vehicular accident"],
 "The felony need not be the immediate cause; it is enough that it <b>set off the chain</b>.",
 "Iligan hacked Quiñones on the head with a bolo. Quiñones was later run over by a vehicle, and the death certificate blamed the accident.",
 "Homicide. The hacking was the proximate cause, because it set off the chain that ended under the vehicle. Treachery was not proven, and the co-accused's mere presence was not conspiracy.")
case("mananquil","Art. 4(1)","People v. Mananquil","132 SCRA 196 (1984)","Gasoline on husband","PARRICIDE","no",
 ["Threw gasoline and set him on fire","He died 4 days later of pneumonia","She was 71 on appeal"],
 "Complications of the injury, like <b>pneumonia</b>, are natural consequences of the felony.",
 "Valentina Mananquil threw gasoline on her husband and set him on fire. He died four days later of pneumonia.",
 "Parricide affirmed: the burns caused the pneumonia, so they were the proximate cause. Because she was seventy-one, the Court recommended executive clemency under Article Five.")
case("brobst","Art. 4(1)","U.S. v. Brobst","14 Phil. 310 (1909)","One fist blow","HOMICIDE","no",
 ["Masbate mine; “Sigue, vamus!”","Fist blow over the lower ribs","Walked 200 yards, died; no autopsy"],
 "Liable for the <b>natural consequences</b> of a felony, even if unintended.",
 "Brobst ordered a fired laborer, Saldivar, off the mine. When Saldivar just grinned, Brobst struck him hard below the ribs. Saldivar walked about two hundred yards to his sister's house and died. There was no autopsy.",
 "Homicide. A healthy man who dies right after the blow, with no other explanation, died of the blow. You answer for the natural consequences of your felony.")
case("garcia","Art. 4(1)","Garcia v. People","597 SCRA 392 (2009)","Mauled heart patient","HOMICIDE, MITIGATED","grey",
 ["Videoke noise complaints","Mauled Chy, who had a weak heart","Died of a heart attack"],
 "A pre-existing illness is <b>not</b> an efficient intervening cause; praeter intentionem mitigates.",
 "After Manuel Chy complained about videoke noise, Garcia mauled him. Chy, who had a heart condition, died of a heart attack.",
 "Homicide, with the mitigating circumstance of no intention to commit so grave a wrong. The mauling triggered the heart attack, and you take your victim as you find him.")

# ───────── ART. 4(2)
intro("i4b","Art. 4(2)","Impossible crimes",[
 "Against <b>persons or property</b> · evil intent · inherently impossible or inadequate/ineffectual means · <b>no other felony</b>.",
 "Could never succeed → impossible. Could have, but stopped by an outside cause → attempted.",
 "Kidnapping can never be an impossible crime."],
 ["Article Four, paragraph two. Impossible crimes.","Four requisites: an offense against persons or property, evil intent, inherent impossibility or inadequate or ineffectual means, and no other felony committed.","If it could have succeeded but someone stopped it, that is an attempt, not an impossible crime."])
case("balmores","Art. 4(2)","People v. Balmores","85 Phil. 493 (1950)","Doctored sweepstakes ticket","ATTEMPTED ESTAFA","no",
 ["Wrote the winning number on a torn ticket","Tried to cash ₱1,359.55","Clerk spotted the fake"],
 "Failure because an <b>alert clerk</b> caught it = attempt, not impossible crime. (Sir disagrees.)",
 "Balmores tore off part of a sweepstakes ticket and wrote in the winning number, then tried to cash the prize. The clerk spotted the forgery and called the police.",
 "Attempted estafa through falsification. The crime failed because of an outside cause, an alert clerk, not inherent impossibility. Sir Barry disagrees with this ruling, so know the counterargument.")
case("intod","Art. 4(2)","Intod v. Court of Appeals","215 SCRA 52 (1992)","Empty bedroom","IMPOSSIBLE CRIME","grey",
 ["Hired to kill over a land dispute","Fired into her bedroom at 10 p.m.","She was in another city"],
 "<b>Physical impossibility</b>, like an absent victim, is inherent impossibility: impossible crime.",
 "Intod and others, hired to kill Bernardina over a land dispute, fired into her bedroom at ten at night. She was in another city, and no one was hit.",
 "Modified from attempted murder to an impossible crime. Her absence made the killing physically impossible, which is inherent impossibility under Article Four.")
case("domasian","Art. 4(2)","People v. Domasian","219 SCRA 245 (1993)","Ransom note too late","KIDNAPPING","no",
 ["8-year-old taken by tricycle and minibus","Rescued after a driver got suspicious","Ransom note arrived after"],
 "Kidnapping is against <b>liberty</b>, and was already consummated: never an impossible crime.",
 "Domasian took an eight-year-old boy, Enrico, by tricycle and minibus. A suspicious tricycle driver alerted the tanods and the boy was rescued. The ransom note arrived afterward.",
 "Kidnapping affirmed. Impossible crime covers only offenses against persons or property, and the kidnapping was consummated the moment the boy lost his liberty.")
case("jacinto","Art. 4(2)","Jacinto v. People","G.R. No. 162540 (2009)","Bounced stolen check","IMPOSSIBLE CRIME","grey",
 ["Collector kept a ₱10,000 check for Mega Foam","Deposited it in her sister's husband's account","The check bounced"],
 "Theft needs property <b>with value</b>; a worthless check makes theft impossible.",
 "Gemma Jacinto, a collector of Mega Foam, kept a ten thousand peso check meant for the company and deposited it in her sister's husband's account. The check bounced.",
 "Impossible crime, not qualified theft. The check was worthless from the start, so nothing of value could be gained. That is inherent impossibility.")

# ───────── ART. 6
intro("i6","Art. 6","Stages of execution",[
 "Attempted: overt acts begun, not all done. Frustrated: <b>all acts done</b>, result fails for independent causes.",
 "Homicide: <b>mortal wound</b> + survival = frustrated. No or minor wound = attempted. No intent to kill = injuries.",
 "No frustrated <b>theft</b>. No frustrated <b>rape</b>."],
 ["Article Six. The stages of execution.","Attempted means the offender began with overt acts but did not finish them. Frustrated means he did everything, but the result failed for reasons independent of his will.","In homicide, a mortal wound the victim survives is frustrated. And there is no frustrated theft, and no frustrated rape."])
case("eduave","Art. 6","U.S. v. Eduave","36 Phil. 209 (1917)","Bolo, left for dead","FRUSTRATED MURDER","no",
 ["Bolo from behind: 8½-inch (22 cm) gash","Thought her dead; threw her in the bushes","She survived"],
 "All acts of execution done (subjective phase complete), death prevented by independent causes = <b>frustrated</b>.",
 "Eduave struck a girl from behind with a bolo, leaving a gash eight and a half inches long. Thinking she was dead, he threw her into the bushes. She survived.",
 "Frustrated murder, qualified by treachery. He performed every act needed to kill and believed she was dead; she survived for reasons independent of his will.")
case("orita","Art. 6","People v. Orita","184 SCRA 105 (1990)","No frustrated rape","CONSUMMATED RAPE","no",
 ["Balisong at her neck, forced upstairs","Partial penetration only","She jumped from a window"],
 "There is <b>no frustrated rape</b>: the slightest penetration consummates it.",
 "Orita, a constabulary soldier, held a balisong to a college student's neck and forced her upstairs. He achieved only partial penetration before she escaped through a window. The trial court said frustrated rape.",
 "Consummated rape. Any penetration, however slight, consummates the crime, so rape has no frustrated stage.")
case("campuhan","Art. 6","People v. Campuhan","329 SCRA 270 (2000)","Kneeling, pants down","ATTEMPTED RAPE","grey",
 ["Mother making Milo downstairs","Saw him kneeling before her 4-year-old","Hymen intact; no injury"],
 "Consummation needs at least touching of the <b>labia</b>; anything short of that is attempted rape.",
 "While Corazon made Milo downstairs, she heard her four-year-old cry, ran up, and saw Primo kneeling before the child with his shorts down. The medical exam showed no injury.",
 "Attempted rape, not statutory rape. There was reasonable doubt that the penis touched the labia; the mother could not have seen it from where she stood.")
case("adiao","Art. 6","U.S. v. Adiao","38 Phil. 754 (1918)","Belt in desk","CONSUMMATED THEFT","no",
 ["Customs inspector","Took a leather belt from baggage","Hid it in his desk"],
 "Theft is consummated by the <b>taking</b>; the chance to dispose is immaterial.",
 "Adiao, a customs inspector, took a leather belt from a Japanese passenger's baggage and hid it in his desk, where it was found.",
 "Consummated theft, not frustrated. The taking was complete once he hid the belt, even though he never got to dispose of it.")
case("valenzuela","Art. 6","Valenzuela v. People","525 SCRA 306 (2007)","Tide in a taxi","CONSUMMATED THEFT","no",
 ["Hauled Tide out of SM North EDSA","Loaded it into a taxi","Guard stopped them in the lot"],
 "<b>No frustrated theft.</b> Unlawful taking is complete upon possession.",
 "Valenzuela hauled cases of Tide out of the supermarket at S M North Edsa and loaded them into a taxi. A guard stopped them before they left the parking lot.",
 "Consummated theft, and there is no frustrated theft. Theft is complete once the offender gains possession; being able to dispose of the goods is not an element.")
case("lamahang","Art. 6","People v. Lamahang","61 Phil. 703 (1935)","Iron bar, store wall","ATTEMPTED TRESPASS","grey",
 ["Caught at dawn by a policeman","Prying the store wall with an iron bar","One board broken"],
 "Overt acts must be directly linked to a <b>specific</b> crime; an indeterminate offense is no attempted robbery.",
 "At dawn, a policeman caught Lamahang prying open the wall of a store with an iron bar. He had broken one board and loosened another.",
 "Attempted trespass to dwelling, not attempted robbery. His acts showed an intent to enter, but not what he would do inside: an indeterminate offense.")
case("salvilla","Art. 6","People v. Salvilla","184 SCRA 671 (1990)","Lumber-yard hostages","CONSUMMATED ROBBERY","no",
 ["Armed with guns and a grenade","Took cash and jewelry at a lumber yard","Hostage standoff; never got away"],
 "Robbery with intimidation is consummated upon <b>gaining possession</b>, even without escape.",
 "Salvilla's group robbed a lumber company in Iloilo with guns and a grenade, held the owner and his daughters hostage, and were caught after an assault. They argued they never got away with the loot.",
 "Consummated robbery. The loot was taken and in their control; the chance to dispose of it does not matter.")
case("borinaga","Art. 6","People v. Borinaga","55 Phil. 433 (1930)","Knife in chair","FRUSTRATED MURDER","no",
 ["Unpaid fish-corral work; “American brute”","Stabbed at Mooney's back; hit the chair","Came back; scared off by a flashlight"],
 "Majority: frustrated. Today: <b>no wound = attempted</b> (mortal-wound rule).",
 "Over unpaid work on a fish corral, Borinaga stabbed at the American Mooney from behind. The knife lodged in the back of his chair, and Mooney was unhurt.",
 "The majority said frustrated murder, but three justices dissented. Under today's mortal-wound rule, a blow that wounds no one is only an attempt. Know both.")
case("sypio","Art. 6","People v. Sy Pio","94 Phil. 885 (1954)",".45 in a store","ATTEMPTED MURDER","grey",
 [".45 pistol in a Sta. Cruz store","Shot Tan in the right shoulder","Tan ran and hid; healed"],
 "Frustrated only if the <b>subjective phase</b> is complete; he saw the victim escape.",
 "Sy Pio shot Tan Siong Kiap in the right shoulder inside a store. Tan ran and hid in a back room, and Sy Pio fled. Tan recovered.",
 "Attempted murder, not frustrated. Sy Pio saw his victim escape, so he knew he had not done everything needed to kill, and the wound was not fatal.")
case("ravelo","Art. 6","People v. Ravelo","202 SCRA 655 (1991)","CHDF 'NPA' interrogation","SLIGHT PHYSICAL INJURIES","grey",
 ["Militia seized him as a suspected NPA","Mauled; told he would be killed","He escaped"],
 "Intent to kill must be shown by <b>overt acts</b>; a verbal threat is not enough.",
 "Militiamen seized Joey Lugatiman as a suspected rebel, mauled him, and told him he would be killed. He escaped.",
 "Slight physical injuries, not frustrated murder. A verbal threat and minor injuries do not prove intent to kill.")
case("kalalo","Art. 6","People v. Kalalo","59 Phil. 715 (1934)","Bolos over land","HOMICIDE · ATTEMPTED","grey",
 ["Land dispute in Batangas","Two men hacked to death","Four shots at a fleeing man, all missed"],
 "Repeated shots show <b>intent to kill</b>; missing = attempted. Balanced forces = no abuse of strength.",
 "In a land dispute, the Kalalo group hacked two men to death, and Marcelo fired four shots at another man as he fled, missing every time.",
 "Homicide for the two deaths, since both sides were armed. Attempted homicide for the four missed shots: they showed intent to kill, but nothing hit.")

# ───────── ART. 11 · ¶1
intro("i11a","Art. 11 · ¶1","Self-defense",[
 "<b>UNREAL</b>: UNlawful aggression · REAsonable necessity · Lack of sufficient provocation.",
 "No unlawful aggression = no defense at all. It must <b>still exist</b>: a fleeing aggressor ends it.",
 "Rational equivalence, not equal weapons. Honor, property and reputation can be defended too."],
 ["Article Eleven, paragraph one. Self-defense.","Remember unreal: unlawful aggression, reasonable necessity of the means, and lack of sufficient provocation.","Without unlawful aggression, there is no self-defense at all, and it must still exist when you strike."])
case("boholst","Art. 11 · ¶1","People v. Boholst-Caballero","61 SCRA 180 (1974)","Choked on the road","ACQUITTED","yes",
 ["Husband choked her as she lay on her back","She grabbed HIS knife from his belt","Stabbed him once"],
 "Choking is unlawful aggression; necessity is judged by the <b>danger</b>, not the harm done.",
 "Cunigunda's husband choked her as she lay on her back on the road. Nearly unconscious, she pulled the knife from his own belt and stabbed him.",
 "Acquitted: complete self-defense. Choking is unlawful aggression, and grabbing the weapon within reach was reasonable.")
case("alconga","Art. 11 · ¶1","People v. Alconga","78 Phil. 366 (1947)","Blackjack, two stages","HOMICIDE","no",
 ["Attacked with a pingahan","Shot back from under the bench","Chased the fleeing man and killed him"],
 "When the aggressor <b>flees</b>, aggression ceases; what follows is retaliation.",
 "After a blackjack game, the deceased attacked Alconga with a pingahan. Alconga fought back, and when the wounded man ran away, Alconga chased him and killed him.",
 "Homicide. The first stage was self-defense, but once the aggressor fled, the aggression ceased. The pursuit was retaliation.")
case("mack","Art. 11 · ¶1","U.S. v. Mack","8 Phil. 701 (1907)","Revolver vs. bolo","ACQUITTED","yes",
 ["Policeman advanced brandishing a bolo","3 to 6 feet away","Soldier fired three shots"],
 "Rational equivalence: the defender is <b>not expected to aim</b> at a less vital part.",
 "In Tacloban, a policeman cursing the soldier Mack advanced on him brandishing a bolo. At three to six feet, Mack drew his revolver and fired three shots.",
 "Acquitted. With an armed attacker that close, he could not flee or aim carefully. A revolver against a bolo was reasonable.")
case("sumicad","Art. 11 · ¶1","People v. Sumicad","56 Phil. 643 (1932)","Bully at chapel work","ACQUITTED","yes",
 ["Bigger, stronger bully punched him","He retreated, was cornered","Bully tried to grab his bolo"],
 "Reasonableness depends on <b>size, strength</b>, character, and retreat.",
 "During work on a chapel, Cubol, a bigger and stronger bully, punched Sumicad and cornered him. Sumicad cut him with a bolo as a warning, and Cubol was killed trying to grab it.",
 "Acquitted. He did not have to risk losing his only weapon to a stronger, violent man who could turn it on him.")
case("genosa","Art. 11 · ¶1","People v. Genosa","419 SCRA 537 (2004)","Battered wife, pipe","PARRICIDE, MITIGATED","grey",
 ["Abusive husband came home drunk","8 months pregnant, she struck him with a pipe","Then shot him in the bedroom"],
 "BWS needs the <b>cycle twice</b>; aggression must exist at the killing. (Now RA 9262 § 26.)",
 "Marivic Genosa, eight months pregnant, killed her abusive husband. After he came home drunk and went to the bedroom, she struck him with a pipe and then shot him.",
 "Parricide, but with mitigating circumstances and no death penalty. The Court recognized battered woman syndrome but found the cycle unproven and no aggression at the moment of the killing.")
case("luague","Art. 11 · ¶1","People v. Luague","62 Phil. 504 (1935)","Kitchen, knife","ACQUITTED","yes",
 ["Home alone with three small children","Neighbor threatened her with a knife","Tried to rape her in the kitchen"],
 "Attempted rape is aggression against <b>honor</b>; she may kill if it's the only way.",
 "Natividad Luague was home alone with her three small children when a man followed her into the kitchen, threatened her with a knife and tried to rape her. She killed him.",
 "Acquitted. Attempted rape is unlawful aggression against honor, a right as precious as life.")
case("delacruz","Art. 11 · ¶1","People v. De la Cruz","61 Phil. 344 (1935)","Grabbed on dark path","ACQUITTED","yes",
 ["Dark, narrow path at night","Grabbed from behind and groped","Stabbed him with a pocket knife"],
 "Darkness and isolation leave <b>no other means</b>: defense of honor is complete.",
 "Walking home at night on a dark, narrow path, De la Cruz was grabbed from behind, kissed and groped, and was being thrown down. She stabbed him with a pocket knife.",
 "Acquitted. In the dark and alone, she had no other means of defending her honor.")
case("jaurigue","Art. 11 · ¶1","People v. Jaurigue","76 Phil. 174 (1946)","Fan knife in chapel","HOMICIDE, MITIGATED","grey",
 ["Lighted chapel, people present","Her father was there","Hand on her thigh; she stabbed his neck"],
 "Aggression, yes, but the means were <b>excessive</b> for the setting: incomplete defense.",
 "In a lighted chapel, with her father and others present, Amado put his hand on Avelina Jaurigue's thigh. She stabbed him in the neck with a fan knife.",
 "Homicide, mitigated. There was unlawful aggression, but no danger of rape in that crowded, lighted chapel, so stabbing was excessive.")
case("apolinar","Art. 11 · ¶1","People v. Apolinar","C.A., 38 O.G. 2870","Shot the palay thief","HOMICIDE","no",
 ["Guarding land with a shotgun at night","Man carrying palay","Fired at him as he fled"],
 "Defense of property needs an <b>attack on the person</b> (old rule).",
 "Guarding land at night with a shotgun, Apolinar saw a man carrying away palay. He fired in the air, then at the fleeing man, killing him.",
 "Not justified. A fleeing thief makes no attack on the guard; had the thief swung a bolo at him, the shooting would have been justified.")
case("bumanglag","Art. 11 · ¶1","U.S. v. Bumanglag","14 Phil. 644 (1909)","Sheathed bolo","HOMICIDE","no",
 ["Stolen palay hidden in sugarcane","They lay in wait for the thief","His bolo was still in its sheath"],
 "Physical evidence (a <b>sheathed bolo</b>) destroys a claim of aggression.",
 "Bumanglag and others lay in wait for the thief who took his palay and killed him. They claimed he drew his bolo, but the bolo was found still in its sheath.",
 "Homicide. There was no unlawful aggression: the sheathed bolo and the cutting wounds contradicted their story.")
case("narvaez","Art. 11 · ¶1","People v. Narvaez","121 SCRA 389 (1983)","Chiselled walls","HOMICIDE, MITIGATED","grey",
 ["Land dispute; workers fencing him in","Chiselling the walls of his house","“Gadamit, proceed”; he fired"],
 "Attack on <b>property rights</b> is aggression, but killing is disproportionate.",
 "In a land dispute, Fleischer's laborers chiselled the walls of Narvaez's house to fence him in. When told to stop, Fleischer said proceed, and Narvaez shot him and his companion.",
 "Murder reduced to homicide with incomplete defense. There was aggression against his property rights, but shooting was disproportionate.")
case("chuahiong","Art. 11 · ¶1","People v. Chua Hiong","C.A., 51 O.G. 1932","Libel answered by libel","ACQUITTED","yes",
 ["His nephew attacked him in print","He replied in print","Called it a 'persecution mania'"],
 "An <b>adequate</b> libelous reply to a libel is justified.",
 "Chua Hiong answered his nephew's published attacks with a reply saying the nephew seemed obsessed with a persecution mania.",
 "Acquitted. A person who is libeled may hit back with an adequate reply; the sting of a libel stays, so answering it is defense.")
case("pelayo","Art. 11 · ¶1","People v. Pelayo, Jr.","64 O.G. 1991","Accused the governor","CONVICTED","no",
 ["Said the governor took protection money","Repeated it before the city council","Claimed self-defense"],
 "A reply must be limited to <b>repairing the damage</b>; a new attack isn't defense.",
 "Pelayo told a lawyer, then the city council, that the governor took protection money from gambling. He claimed he was defending himself.",
 "Convicted of light oral defamation. Defending one's reputation means explaining one's side, not hitting back with a new and unrelated accusation.")

# ───────── ART. 11 · ¶2–6
intro("i11b","Art. 11 · ¶2–6","Relatives, strangers, necessity, duty, obedience",[
 "<b>URIC</b> relatives · <b>U'RE NOTI</b> strangers (not induced by revenge).",
 "<b>X>MEN</b>: evil exists · greater than injury done · no other means. Only ¶4 has civil liability.",
 "Duty: injury must be the <b>necessary consequence</b>. Obedience (<b>SUPERMAN</b>): lawful order, lawful means."],
 ["Paragraphs two to six.","For relatives, the relative's own provocation does not matter if you took no part in it. For strangers, you must not be moved by revenge.","Necessity weighs the evils. Duty requires the injury to be the necessary consequence of the duty. Obedience needs a lawful order carried out by lawful means."])
case("esmedia","Art. 11 · ¶2–6","U.S. v. Esmedia","17 Phil. 260 (1910)","Father in the mud","JUSTIFIED · HOMICIDE","grey",
 ["Father down in the mud, wounded","Uncle standing over him","They also killed the uncle's father"],
 "Defense of relatives may rest on the defender's <b>honest belief</b>.",
 "The Esmedia brothers found their father lying wounded in the mud with their uncle standing over him, and killed the uncle. They also killed the uncle's father, who arrived later.",
 "Justified as to the uncle, because they honestly believed he would strike again. Homicide as to his father, who made no aggression.")
case("normahernandez","Art. 11 · ¶2–6","People v. Norma Hernandez","C.A., 55 O.G. 8465","Runaway bride","ACQUITTED","yes",
 ["Wedding fully prepared","She never loved him","Eloped with the man she loved"],
 "Escaping a <b>loveless marriage</b> is avoiding a greater evil; damage to honor counts.",
 "Norma Hernandez walked out of a fully prepared wedding to a man she never loved and eloped with another. She was charged with slander by deed.",
 "Acquitted. Avoiding a loveless marriage is avoiding a greater evil, and damage to another includes injury to honor.")
case("dudley","Art. 11 · ¶2–6","Regina v. Dudley and Stephens","14 QBD 273 (1884)","Cabin boy eaten","MURDER","no",
 ["Yacht <i>Mignonette</i> sank","About 20 days adrift","Killed and ate the cabin boy"],
 "A life for a life is <b>not a greater evil</b> avoided: necessity never justifies killing an innocent.",
 "After the yacht Mignonette sank, Dudley and Stephens, adrift for about twenty days, killed the seventeen-year-old cabin boy and ate him. They were rescued four days later.",
 "Murder. Necessity does not justify killing an innocent; under our law, a life for a life is not avoiding a greater evil.")
case("ty","Art. 11 · ¶2–6","Ty v. People","439 SCRA 220 (2004)","Hospital bill checks","CONVICTED","no",
 ["Mother's hospital bill over ₱1 million","Seven postdated checks bounced","Feared mistreatment of her mother"],
 "The evil must <b>actually exist</b>, not be of your making, with no less harmful means.",
 "Vicky Ty issued seven postdated checks for her mother's hospital bill, and they bounced. She claimed she feared the hospital's treatment of her mother.",
 "Convicted under B P twenty-two. The feared evil was speculative, it came from her own failure to pay, and less harmful means existed.")
case("delima","Art. 11 · ¶2–6","People v. Delima","46 Phil. 738 (1922)","Bamboo lance escapee","ACQUITTED","yes",
 ["Escaped prisoner with a bamboo lance","Thrust at the policeman, fled armed","Shot dead in pursuit"],
 "Killing an armed, resisting escapee is <b>fulfillment of duty</b>, even when self-defense fails.",
 "An escaped prisoner, Napilon, thrust a bamboo lance at Policeman Delima and fled, still armed. Delima pursued and shot him dead.",
 "Acquitted under fulfillment of duty. Self-defense failed because the aggression had ceased, but killing an armed, resisting fugitive was the necessary consequence of his duty.")
case("belbes","Art. 11 · ¶2–6","People v. Belbes","334 SCRA 161 (2000)","Armalite at the prom","HOMICIDE, MITIGATED","grey",
 ["Policeman keeping order at a prom","Fired an Armalite within seconds","Killed a drunk man, Bataller"],
 "On duty, but the killing was <b>not a necessary consequence</b>: incomplete justification.",
 "A policeman keeping order at a high-school prom fired an Armalite burst within seconds of responding, killing a drunk man.",
 "Homicide, with incomplete fulfillment of duty. He was on duty, but shooting at once, without first trying to subdue him, was not a necessary consequence of keeping order.")
case("beronilla","Art. 11 · ¶2–6","People v. Beronilla","96 Phil. 566 (1955)","12 bolomen jury","ACQUITTED","yes",
 ["Wartime military mayor of La Paz, Abra","Collaborator tried by 12 bolomen","Executed on superiors' orders"],
 "Good-faith obedience, <b>unaware of illegality</b> and without negligence, negates criminal intent.",
 "Beronilla, a wartime military mayor in Abra, had a collaborator tried by a jury of twelve bolomen and executed on his superiors' orders. A radiogram questioning the trial never reached him.",
 "Acquitted. A subordinate who obeys orders in good faith, unaware they are illegal and without negligence, acts without criminal intent.")

S("recap","Recap",[
 "To recap, five things to remember.",
 "One. No time to verify excuses a mistake. Time to verify does not.",
 "Two. The felony only needs to start the chain. Illness, complications and refused treatment do not break it.",
 "Three. Could never succeed is an impossible crime. Stopped by someone else is an attempt.",
 "Four. No frustrated theft, no frustrated rape, and in homicide the wound decides the stage.",
 "Five. No unlawful aggression, no self-defense. And when the aggressor flees, it is over. Good luck at two o'clock."],
"""<div class="fill col gap24">
 <div class="head"><div class="kicker" data-fx="fade">Recap</div><div class="h2" data-fx="up">Five things to remember</div></div>
 <div class="col gap16 grow center-v">
  <div class="rc" data-fx="up" data-b="1"><span class="rn">1</span><div><b>Ah Chong vs. Oanis</b>: no time to verify excuses; time to verify doesn't.</div></div>
  <div class="rc" data-fx="up" data-b="2"><span class="rn">2</span><div>The felony just has to <b>start the chain</b> (Iligan, Garcia, Mananquil).</div></div>
  <div class="rc" data-fx="up" data-b="3"><span class="rn">3</span><div><b>Impossible</b> (Intod, Jacinto) vs. <b>attempted</b> (Balmores).</div></div>
  <div class="rc" data-fx="up" data-b="4"><span class="rn">4</span><div>No frustrated <b>theft</b> or <b>rape</b>; the <b>wound</b> decides homicide's stage.</div></div>
  <div class="rc" data-fx="up" data-b="5"><span class="rn">5</span><div>No unlawful aggression = no defense; a <b>fleeing</b> aggressor ends it (Alconga).</div></div>
 </div>
 <div class="banner" data-fx="pop" data-b="5" data-d="2">IRAC · why this element, why not that one · Good luck at 2:00 p.m.</div>
</div>""")
