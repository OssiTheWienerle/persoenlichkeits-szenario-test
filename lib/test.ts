import content from './test-content.json' with { type: 'json' };
export const TEST_VERSION = '2.0.0';
export const buttonAmounts = [10,20,50,100,200,500,1000,2000,5000,10000,20000,50000,100000,200000,500000,1000000,2000000,5000000,10000000];
export const formatEuro = (value:number) => new Intl.NumberFormat('de-DE',{style:'currency',currency:'EUR',maximumFractionDigits:0}).format(value);
export type TraitKey = 'E'|'R'|'G'|'V'|'M'|'K'|'I'|'A'|'S';
export type Option = {id:string;text:string};
export type Axis = {trait:TraitKey;question:string;low:string;high:string};
export type Scenario = {id:number;title:string;length:string;paragraphs:string[];actions:Option[];motives:Option[];axes:Axis[]};
export const scenarios = content as Scenario[];
export const traits: Record<TraitKey,{name:string;description:string}> = {
 E:{name:'Emotionales Mitfühlen',description:'Wie stark dich das vorgestellte Erleben anderer emotional berührt.'},
 R:{name:'Verantwortung & Reue',description:'Wie stark du Verantwortung, Rücksicht oder erwartete Reue in den betreffenden Situationen angibst.'},
 G:{name:'Anspruch & Überlegenheit',description:'Wie stark du besondere Anerkennung, Zustimmung oder einen Vorrang eigener Ansprüche erwartest.'},
 V:{name:'Kränkbarkeit & Selbstwert',description:'Wie stark Zurückweisung, Kritik oder geringere Bedeutung deinen Selbstwert berühren.'},
 M:{name:'Instrumentelle Einflussnahme',description:'Wie bereit du wärst, die Gefühle oder Entscheidungen anderer für eigene Ziele zu beeinflussen.'},
 K:{name:'Gleichgültigkeit gegenüber Folgen',description:'Wie wenig die beschriebenen Nachteile für andere deine Entscheidung beeinflussen würden.'},
 I:{name:'Impulsive Reaktion',description:'Wie stark du einen unmittelbaren Handlungsimpuls angibst. Der Impuls ist nicht gleich der gewählten Handlung.'},
 A:{name:'Vergeltungsimpuls',description:'Wie stark du auf Kränkung oder Nachteile mit einer Gegenverletzung reagieren möchtest.'},
 S:{name:'Freude am Leid selbst',description:'Wie viel Befriedigung du am Leiden oder an der Beschämung selbst angibst, unabhängig von einem weiteren Nutzen.'},
};
export const contextQuestions = [
 {id:'duration',question:'Seit wann kennst du vergleichbare Reaktionen aus deinem tatsächlichen Leben?',options:['Erst seit wenigen Wochen oder Monaten','Seit etwa einem Jahr','Seit mehreren Jahren','Mir sind solche Reaktionen kaum bekannt','Kann ich nicht einschätzen']},
 {id:'settings',question:'In wie vielen Lebensbereichen treten vergleichbare Reaktionen auf?',options:['Vor allem in einer einzelnen Beziehung oder Situation','In mehreren Beziehungen oder Lebensbereichen','In fast allen Lebensbereichen','Kaum oder gar nicht','Kann ich nicht einschätzen']},
 {id:'conflicts',question:'Wie häufig führen deine Reaktionen zu wiederkehrenden Konflikten?',options:['Nie oder selten','Gelegentlich','Häufig','Sehr häufig','Kann ich nicht einschätzen']},
 {id:'burden',question:'Wie stark belasten dich oder andere diese Reaktionen im Alltag?',options:['Kaum oder gar nicht','Etwas','Deutlich','Sehr stark','Kann ich nicht einschätzen']},
 {id:'stress',question:'Wie belastet fühlst du dich zurzeit insgesamt?',options:['Wenig oder gar nicht','Mäßig','Deutlich','Sehr stark','Möchte ich nicht angeben']},
 {id:'imagination',question:'Wie gut kannst du deine wahrscheinliche Reaktion in fiktiven Situationen einschätzen?',options:['Gut','Teilweise','Eher schwer','Sehr schwer','Kann ich nicht einschätzen']},
];
export type Answer = {action:string|null;motive:string|null;ratings:Partial<Record<TraitKey,number|null>>;skipped:boolean;buttonAmount?:number|null};
export type Payload = {version:string;adult:boolean;context:Record<string,string>;answers:Record<string,Answer>};
export const blankAnswer = ():Answer => ({action:null,motive:null,ratings:{},skipped:false});
const object = (x:unknown): x is Record<string,unknown> => !!x && typeof x==='object' && !Array.isArray(x);
export function validatePayload(raw:unknown):Payload {
 if(!object(raw)||raw.version!==TEST_VERSION||typeof raw.adult!=='boolean'||!object(raw.context)||!object(raw.answers)) throw new Error('Die Datei gehört nicht zu dieser Testversion oder ist unvollständig.');
 const context:Record<string,string>={};
 for(const q of contextQuestions) { const v=raw.context[q.id]; if(v!==undefined) {if(typeof v!=='string'||!q.options.includes(v)) throw new Error('Ungültige Kontextantwort.');context[q.id]=v;} }
 const answers:Record<string,Answer>={};
 for(const [id,value] of Object.entries(raw.answers)) {
  const s=scenarios.find(x=>String(x.id)===id);
  if(!s||!object(value)||!object(value.ratings)||typeof value.skipped!=='boolean') throw new Error('Ungültige Situation in der Datei.');
  for(const key of ['action','motive'] as const) {
   const options=key==='action'?s.actions:s.motives;
   if(value[key]!==null && value[key]!=='other' && !options.some(o=>o.id===value[key])) throw new Error('Ungültige Antwortauswahl.');
  }
  const ratings:Answer['ratings']={};
  for(const [k,v] of Object.entries(value.ratings)) {
   if(!s.axes.some(a=>a.trait===k)||v!==null&&(typeof v!=='number'||!Number.isInteger(v)||v<1||v>10)) throw new Error('Eine Skalenantwort liegt außerhalb von 1–10.');
   ratings[k as TraitKey]=v as number|null;
  }
  if(value.buttonAmount!==undefined&&(s.id!==12||value.buttonAmount!==null&&(typeof value.buttonAmount!=='number'||!buttonAmounts.includes(value.buttonAmount)))) throw new Error('Ungültiger Betrag für die Knopf-Situation.');
  answers[id]={action:value.action as string|null,motive:value.motive as string|null,ratings,skipped:value.skipped,...(value.buttonAmount!==undefined?{buttonAmount:value.buttonAmount as number|null}:{})};
 }
 return {version:TEST_VERSION,adult:raw.adult,context,answers};
}
export const hasButtonAmount = (a:Answer) => a.action==='press-0'||a.action==='other'||typeof a.buttonAmount==='number'&&buttonAmounts.includes(a.buttonAmount);
export const isComplete = (s:Scenario,a?:Answer) => !!a&&!a.skipped&&a.action!==null&&a.motive!==null&&(s.id!==12||hasButtonAmount(a))&&s.axes.every(x=>typeof a.ratings[x.trait]==='number');
export function describeButtonDecision(a?:Answer) {
 if(!a||a.skipped||a.action===null)return 'Keine auswertbare Knopfentscheidung angegeben.';
 if(a.action==='press-0')return 'Du gibst an, bei keinem Betrag zwischen 10 Euro und 10 Millionen Euro pro Druck zu drücken.';
 if(a.action==='other')return 'Keine der angebotenen Druckzahlen passt ausreichend; eine Betragsgrenze wird daraus nicht abgeleitet.';
 const count=scenarios.find(s=>s.id===12)!.actions.find(o=>o.id===a.action)?.text;
 return `Deine angegebene Absicht: ${count??'Anzahl offen'} bei ${typeof a.buttonAmount==='number'?`mindestens ${formatEuro(a.buttonAmount)} pro Druck`:'noch nicht festgelegtem Mindestbetrag'}. Die Zahl beschreibt eine hypothetische Absicht; ein eigener Tod würde weitere Drucke beenden.`;
}
export function calculateProfile(answers:Record<string,Answer>) {
 return (Object.keys(traits) as TraitKey[]).map(key=>{
  const observations=scenarios.flatMap(s=>{
   const a=answers[s.id], axis=s.axes.find(x=>x.trait===key), value=a?.ratings[key];
   return !a?.skipped&&axis&&typeof value==='number'&&Number.isInteger(value)&&value>=1&&value<=10 ? [{scenarioId:s.id,title:s.title,question:axis.question,value}] : [];
  });
  const values=observations.map(x=>x.value), enough=values.length>=3;
  const average=values.length?values.reduce((a,b)=>a+b,0)/values.length:null;
  return {key,...traits[key],count:values.length,score:enough&&average!==null?Math.round(average*10)/10:null,min:values.length?Math.min(...values):null,max:values.length?Math.max(...values):null,observations};
 });
}
export type Profile = ReturnType<typeof calculateProfile>;
export function getEvidence(payload:Payload) {
 return scenarios.filter(s=>payload.answers[s.id]&&!payload.answers[s.id].skipped).map(s=>{
  const a=payload.answers[s.id];
  return {scenarioId:s.id,title:s.title,conditions:s.paragraphs,action:a.action==='other'?'Keine Option passt':s.actions.find(x=>x.id===a.action)?.text??'Unbeantwortet',motive:a.motive==='other'?'Keine Option passt':s.motives.find(x=>x.id===a.motive)?.text??'Unbeantwortet',...(s.id===12?{buttonDecision:{minimumEuroPerPress:a.action==='press-0'||a.action==='other'?null:a.buttonAmount??null,intendedPressCount:a.action?.startsWith('press-')?a.action.slice(6):null,interpretation:'Angegebene Absicht bei diesem Mindestbetrag, keine Verhaltensvorhersage. 1000000+ bedeutet mindestens eine Million; Selbsttod beendet den Durchlauf.'}}:{}),ratings:s.axes.map(axis=>({question:axis.question,trait:axis.trait,value:a.ratings[axis.trait]??null,low:axis.low,high:axis.high}))};
 });
}
export function buildReportInput(payload:Payload) {
 return {testVersion:TEST_VERSION,classification:'Explorativer, nicht klinisch validierter Szenario-Selbsttest',context:contextQuestions.map(q=>({question:q.question,answer:payload.context[q.id]??'Nicht angegeben'})),profile:calculateProfile(payload.answers),evidence:getEvidence(payload),limits:['Keine Diagnose, Erkrankungswahrscheinlichkeit, Normwerte oder klinischen Schweregrade.','Konsistenz innerhalb dieses Durchlaufs ist weder Ehrlichkeit noch zeitliche Stabilität.','Die meisten Situationen sind hypothetisch und erlauben keine sichere Verhaltensvorhersage.','Nicht gegebene Informationen bleiben unbekannt.']};
}
export function shuffled<T>(arr:T[],seed:number):T[] {
 const out=[...arr];let state=seed>>>0;
 for(let i=out.length-1;i>0;i--){state=(Math.imul(state,1664525)+1013904223)>>>0;const j=state%(i+1);[out[i],out[j]]=[out[j],out[i]];}
 return out;
}
export function localInterpretation(payload:Payload) {
 const p=calculateProfile(payload.answers), evidence=getEvidence(payload), enough=p.filter(x=>x.score!==null);
 const describe=(keys:TraitKey[])=>keys.map(k=>{const t=p.find(x=>x.key===k)!;return `${t.name}: ${t.score===null?'zu wenig Information':`${String(t.score).replace('.',',')}/10 (${t.count} Antworten)`}`;}).join(' · ');
 return [
 {title:'Was dieses Profil beschreibt',text:`Du hast ${evidence.length} von 15 Situationen zumindest teilweise beantwortet. In ${enough.length} von neun Bereichen liegen mindestens drei Skalenantworten vor. Die Werte beschreiben die Intensität deiner Selbsteinschätzungen in diesen Situationen. Sie zeigen weder, wie du im Vergleich zur Bevölkerung abschneidest, noch wie wahrscheinlich eine Erkrankung ist.`},
 {title:'Gefühl, Motiv und Handlung',text:'Ein unmittelbarer Impuls kann stark sein, obwohl du eine zurückhaltende Handlung wählst. Auch wenig emotionales Mitfühlen schließt verantwortungsvolle Entscheidungen nicht aus. Umgekehrt bedeutet das Verstehen anderer Menschen noch nicht, dass ihre Interessen dein Handeln bestimmen. Prüfe deshalb die konkreten Antwortbelege zusammen mit den Skalenwerten.'},
 {title:'Deine Knopfentscheidung',text:describeButtonDecision(payload.answers[12])+' Betragsgrenze und Druckzahl werden als Antwortbelege angezeigt und nicht in einen Diagnose- oder Sadismuswert umgerechnet.'},
 {title:'Konsistenz und Kontext',text:'Die Spannweiten zeigen, wie unterschiedlich du die Fragen eines Bereichs beantwortet hast. Die Situationen haben unterschiedliche Bedingungen: persönliche Nähe, Kränkung, eigener Nutzen und Nebenfolgen. Große Unterschiede können deshalb einen nachvollziehbaren Kontextbezug ausdrücken. Ähnliche Werte in diesem Durchlauf belegen noch kein dauerhaftes Persönlichkeitsmuster.'},
 {title:'Narzisstische Merkmale',text:`${describe(['G','V'])}. Diese Bereiche beziehen sich auf besondere Ansprüche und auf Verletzlichkeit des Selbstwerts. Kränkbarkeit allein kann viele Bedeutungen haben. Die Werte ergeben keine Diagnose einer narzisstischen Persönlichkeitsstörung; tatsächliche Beziehungsmuster, Dauer und Auswirkungen fehlen oder sind nur knapp selbst berichtet.`},
 {title:'Antisoziale Merkmale und Psychopathie-Konzepte',text:`${describe(['M','K','I','R'])}. Diese Angaben können Fragen zu Einflussnahme, Rücksicht und Selbstkontrolle anstoßen. Die Bereiche sind unterschiedlich und werden nicht zu einem „Psychopathie-Prozentsatz“ zusammengezählt. Aussagen über eine antisoziale Persönlichkeitsstörung benötigen zusätzlich eine umfassende Beurteilung des tatsächlichen Verhaltens und seiner Entwicklung.`},
 {title:'Vergeltung und sadistische Tendenzen',text:`${describe(['A','S'])}. Ein Vergeltungswunsch ist von Freude am Leid selbst zu unterscheiden. Die Knopf-Situation erfasst zusätzlich deinen angegebenen Mindestbetrag und die beabsichtigte Anzahl der Drucke. Sie enthält auch ein Risiko für dich und nahestehende Menschen. Diese Wahl wird nicht numerisch als Sadismus oder Diagnose bewertet: Geldinteresse, Risikobereitschaft und Freude am Tod sind verschiedene Angaben. Ein einzelner hoher Wert erhält kein Etikett. Betrachte die Situationen einzeln und frage dich, ob die Angaben auch außerhalb dieses Gedankenspiels zutreffen.`},
 {title:'Zwei Beobachtungsfragen für deinen Alltag',text:'Wann hast du zuletzt einen starken ersten Impuls gespürt, aber anschließend anders gehandelt? Und verändert sich deine Rücksicht auf andere vor allem bei persönlicher Kränkung, eigenem Vorteil oder fehlender Nähe? Konkrete wiederkehrende Beispiele sagen mehr über deinen Alltag aus als eine einzelne hypothetische Entscheidung.'},
 ];
}
