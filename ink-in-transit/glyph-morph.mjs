import {mix,smooth,clamp} from './motion.mjs';

// The static endpoints use the original font outlines. Only changing glyphs
// need resampled contours. Holes contract into a point when their topology changes.
export function glyphMorphs(font) {
  const sampler=document.createElementNS('http://www.w3.org/2000/svg','path');
  const samples=new Map(),morphs=new Map(),N=192;
  function contours(char){
    if(samples.has(char))return samples.get(char);
    const result=(font.glyphs[char].match(/M[^M]*/g)||[]).map(d=>{
      sampler.setAttribute('d',d);
      const length=sampler.getTotalLength();
      const points=Array.from({length:N},(_,i)=>{const p=sampler.getPointAtLength(length*i/N);return [p.x,p.y];});
      const area=points.reduce((v,p,i)=>{const q=points[(i+1)%N];return v+p[0]*q[1]-p[1]*q[0];},0);
      return {points,area};
    }).sort((a,b)=>Math.abs(b.area)-Math.abs(a.area));
    samples.set(char,result);return result;
  }
  const collapsed=points=>{
    const c=points.reduce((p,q)=>[p[0]+q[0]/N,p[1]+q[1]/N],[0,0]);
    return Array.from({length:N},()=>c);
  };
  function align(a,b){
    let offset=0,best=Infinity;
    for(let shift=0;shift<N;shift+=4){
      let cost=0;
      for(let j=0;j<N;j+=8){const p=a[j],q=b[(j+shift)%N];cost+=(p[0]-q[0])**2+(p[1]-q[1])**2;}
      if(cost<best){best=cost;offset=shift;}
    }
    return b.map((_,i)=>b[(i+offset)%N]);
  }
  return (a,b)=>{
    const key=a+'\0'+b;
    if(morphs.has(key))return morphs.get(key);
    if(a===b){const fixed=()=>font.glyphs[a];morphs.set(key,fixed);return fixed;}
    const ca=contours(a),cb=contours(b);
    const rings=Array.from({length:Math.max(ca.length,cb.length)},(_,i)=>{
      const pa=ca[i]?.points||collapsed(cb[i].points);
      let pb=cb[i]?.points||collapsed(ca[i].points);
      if(ca[i]&&cb[i]&&ca[i].area*cb[i].area<0)pb=[...pb].reverse();
      return [pa,align(pa,pb)];
    });
    const fn=progress=>{
      const t=smooth(clamp((progress-.2)/.6));
      if(t===0)return font.glyphs[a];if(t===1)return font.glyphs[b];
      return rings.map(([pa,pb])=>pa.map((p,i)=>`${i?'L':'M'}${mix(p[0],pb[i][0],t).toFixed(1)} ${mix(p[1],pb[i][1],t).toFixed(1)}`).join('')+'Z').join('');
    };
    morphs.set(key,fn);return fn;
  };
}
