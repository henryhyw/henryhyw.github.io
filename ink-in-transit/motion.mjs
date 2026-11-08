export const clamp = (v, min = 0, max = 1) => Math.max(min, Math.min(max, v));
export const mix = (a,b,t) => a + (b-a)*t;
export const smooth = t => { t=clamp(t); return t*t*t*(t*(t*6-15)+10); };

// Rectangular Hungarian assignment. Every member of the smaller group gets
// a unique partner, giving maximum reuse before minimising travel distance.
export function assignment(costs) {
  const n=costs.length, m=costs[0]?.length || 0;
  if (!n || !m) return [];
  if (n>m) return assignment(Array.from({length:m},(_,j)=>costs.map(row=>row[j]))).map(([j,i])=>[i,j]);
  const u=Array(n+1).fill(0),v=Array(m+1).fill(0),p=Array(m+1).fill(0),way=Array(m+1).fill(0);
  for(let i=1;i<=n;i++){
    p[0]=i; let j0=0;
    const minv=Array(m+1).fill(Infinity),used=Array(m+1).fill(false);
    do {
      used[j0]=true; const i0=p[j0]; let delta=Infinity,j1=0;
      for(let j=1;j<=m;j++) if(!used[j]){
        const cur=costs[i0-1][j-1]-u[i0]-v[j];
        if(cur<minv[j]){minv[j]=cur;way[j]=j0;}
        if(minv[j]<delta){delta=minv[j];j1=j;}
      }
      for(let j=0;j<=m;j++) if(used[j]){u[p[j]]+=delta;v[j]-=delta;}else minv[j]-=delta;
      j0=j1;
    } while(p[j0]!==0);
    do{const j1=way[j0];p[j0]=p[j1];j0=j1;}while(j0);
  }
  return p.flatMap((i,j)=>i&&j?[[i-1,j-1]]:[]);
}

export function matchLetters(from,to) {
  const pairs=[],usedFrom=new Set(),usedTo=new Set();
  for(const char of new Set(from.map(x=>x.char))){
    const a=from.map((x,i)=>({...x,index:i})).filter(x=>x.char===char);
    const b=to.map((x,i)=>({...x,index:i})).filter(x=>x.char===char);
    const costs=a.map(s=>b.map(t=>(s.x-t.x)**2+(s.y-t.y)**2+(s.kind===t.kind?0:90000)));
    for(const [i,j] of assignment(costs)){
      pairs.push([a[i].index,b[j].index]);usedFrom.add(a[i].index);usedTo.add(b[j].index);
    }
  }
  return {pairs,exits:from.map((_,i)=>i).filter(i=>!usedFrom.has(i)),enters:to.map((_,i)=>i).filter(i=>!usedTo.has(i))};
}

// Retain every physical glyph. Exact letters get priority. The remaining
// outlines change shape during travel, so nothing enters or leaves the page.
export function matchInk(from,to) {
  if(from.length!==to.length)throw new Error('Portrait scenes must have the same character count.');
  const {pairs,exits,enters}=matchLetters(from,to);
  const costs=exits.map(i=>enters.map(j=>(from[i].x-to[j].x)**2+(from[i].y-to[j].y)**2+(from[i].kind===to[j].kind?0:90000)));
  const reshaped=assignment(costs).map(([i,j])=>[exits[i],enters[j]]);
  return {pairs:[...pairs,...reshaped],reused:pairs.length,reshaped:reshaped.length};
}

// The middle of each interval is motion. Both ends reserve readable stillness.
export function sceneAt(position,count) {
  const value=clamp(position,0,count-1), index=Math.min(Math.floor(value),count-2);
  return {index,t:smooth((value-index-.23)/.54)};
}

export function letterPosition(a,b,t,seed,flow=1) {
  const dx=b.x-a.x,dy=b.y-a.y,distance=Math.hypot(dx,dy);
  const envelope=Math.sin(Math.PI*t)**2;
  const direction=seed%2 ? 1 : -1;
  const arc=Math.min(distance*.2,70)*direction*flow;
  const norm=distance || 1;
  return {
    x:mix(a.x,b.x,t)-dy/norm*arc*envelope,
    y:mix(a.y,b.y,t)+dx/norm*arc*envelope-Math.sin(Math.PI*t)*Math.min(distance*.09,24)*flow,
    rotation:Math.sin(Math.PI*t*2)*Math.min(distance/65,9)*direction*flow,
    scale:mix(a.size,b.size,t),opacity:mix(a.opacity??1,b.opacity??1,t)
  };
}
