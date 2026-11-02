// Reviewer helpers (textbook schema). A chapter = {k,num,n,s,lead,goals,sec:[sections],end:[blocks]}; a section = {id,t,b:[blocks]}.
window.TOPICS = [];
window.RH = {
  CH:(k,num,n,s,lead,goals,sec,end)=>window.TOPICS.push({k,num,n,s,lead,goals,sec,end:end||[]}),
  S:(id,t,...b)=>({id,t,b}),
  P:x=>({k:"p",x}),            // explanatory prose
  K:(t,x)=>({k:"key",t,x}),    // key idea (green)
  TR:(t,x)=>({k:"trap",t,x}),  // trap / exam warning (amber)
  DS:(t,x)=>({k:"dist",t,x}),  // distinguish (blue)
  EX:(t,x)=>({k:"ex",t,x}),    // Reyes illustration
  C:(id,why)=>({k:"case",id,why}), // inline case card
  V:id=>({k:"viz",id}),        // diagram
  CO:(a,ps)=>({k:"codal",a,ps}),   // codal (ps = paragraph indexes to show; omit = all)
  RQ:(t,items)=>({k:"req",t,items}), // numbered requisite tiles: items = [[name, gloss], …]
  UL:x=>({k:"ul",x}),
  TB:(head,rows)=>({k:"tbl",head,rows}),
  EXAM:x=>({k:"exam",x}),
  DR:x=>({k:"drill",x}),
  G:id=>({k:"gate",id})
};
