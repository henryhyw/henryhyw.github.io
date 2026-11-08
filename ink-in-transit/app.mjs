import {scenes,interactivePoint} from './story.mjs';
import {clamp,mix,smooth,matchInk,sceneAt,letterPosition} from './motion.mjs';
import {glyphMorphs} from './glyph-morph.mjs';

const $=id=>document.getElementById(id);
const NS='http://www.w3.org/2000/svg';
const preference=matchMedia('(prefers-reduced-motion: reduce)');
const saved=history.state?.henryPortrait;
let reduced=preference.matches,layouts=[],nodes=[],plans=[],drawings=[],artRects=[];
let font,morph,stageHeight=0,unit=1,target=0,position=0,current=-1;
let frame=0,lastTime=0,glide=null,resizeTimer=0,layoutChoice=0,layoutAmount=0,drag=null;
const offsets=[{x:0,y:0},{x:0,y:0},{x:0,y:0}];
const ink=[],echo=[],controls=[];
const regions=[{x:111,y:142,w:155,h:82,label:'Move the slide text'},{x:305,y:130,w:158,h:153,label:'Move the chart'},{x:112,y:236,w:49,h:49,label:'Move the shape'}];
const node=(tag,parent)=>{const el=document.createElementNS(NS,tag);parent.append(el);return el;};
for(let i=0;i<18;i++){
  const p=node('path',$('ink')),e=node('path',$('ink-echo'));
  p.setAttribute('stroke','#435c4b');p.setAttribute('stroke-width',i===0?'1.8':'1.4');p.setAttribute('opacity',i===0?'.95':'.8');
  e.setAttribute('stroke','#687b5c');e.setAttribute('stroke-width','.65');e.setAttribute('opacity','.2');
  ink.push(p);echo.push(e);
}

function groupForStroke(stroke){if(stroke>=9&&stroke<=13)return 1;if(stroke===14)return 2;if(stroke>=4&&stroke<=8||stroke===15)return 0;return -1;}
function artPoint(scene,stroke,p){
  const result=interactivePoint(scene,stroke,p,scene===2?layoutAmount:1);
  if(scene===2){const group=groupForStroke(stroke);if(group>=0){result.x+=offsets[group].x;result.y+=offsets[group].y;}}
  return result;
}
regions.forEach((region,i)=>{
  const button=document.createElement('button');button.className='drawing-control';button.setAttribute('aria-label',region.label);
  button.addEventListener('pointerdown',event=>{
    if(event.button!==0||drag)return;
    glide=null;button.setPointerCapture(event.pointerId);
    drag={i,id:event.pointerId,x:event.clientX,y:event.clientY,from:{...offsets[i]},moved:false};
  });
  button.addEventListener('pointermove',event=>{
    if(!drag||drag.id!==event.pointerId||drag.i!==i)return;
    const scale=600/$('drawing-wrap').getBoundingClientRect().width;
    const dx=(event.clientX-drag.x)*scale,dy=(event.clientY-drag.y)*scale;
    if(Math.hypot(dx,dy)>3)drag.moved=true;
    offsets[i]={x:clamp(drag.from.x+dx,-80,80),y:clamp(drag.from.y+dy,-45,45)};wake();
  });
  button.addEventListener('pointerup',event=>{
    if(!drag||drag.id!==event.pointerId)return;
    const moved=drag.moved;drag=null;
    if(button.hasPointerCapture(event.pointerId))button.releasePointerCapture(event.pointerId);
    if(!moved){layoutChoice=(layoutChoice+1)%3;wake();}
  });
  button.addEventListener('pointercancel',()=>{drag=null;});
  button.addEventListener('lostpointercapture',()=>{drag=null;});
  button.addEventListener('click',event=>{if(event.detail===0){layoutChoice=(layoutChoice+1)%3;wake();}});
  button.addEventListener('keydown',event=>{
    const delta={ArrowLeft:[-8,0],ArrowRight:[8,0],ArrowUp:[0,-8],ArrowDown:[0,8]}[event.key];
    if(!delta)return;event.preventDefault();event.stopPropagation();
    offsets[i]={x:clamp(offsets[i].x+delta[0],-80,80),y:clamp(offsets[i].y+delta[1],-45,45)};wake();
  });
  $('drawing-controls').append(button);controls.push(button);
});

function addText(parent,text,kind){
  for(const piece of text.split(/(\s+)/)){
    if(/\s/.test(piece)){parent.append(piece.includes('\n')?document.createElement('br'):document.createTextNode(piece));continue;}
    const word=document.createElement('span');word.className='word';
    for(const char of Array.from(piece)){
      const span=document.createElement('span');span.className='measure-letter';span.dataset.kind=kind;span.dataset.char=char;span.textContent=char;
      const baseline=document.createElement('i');baseline.className='baseline';span.append(baseline);word.append(span);
    }
    parent.append(word);
  }
}
function measure(){
  const previous=unit>1?scrollY/unit:Number(saved?.position)||0;
  stageHeight=$('stage').getBoundingClientRect().height;unit=stageHeight*1.55;
  $('journey').style.height=`${stageHeight+unit*(scenes.length-1)}px`;
  const stageRect=$('stage').getBoundingClientRect(),copy=$('measure-copy'),wrap=$('drawing-wrap');
  layouts=[];artRects=[];
  for(const scene of scenes){
    copy.replaceChildren();
    const h=document.createElement('h1'),p=document.createElement('p');
    addText(h,scene.title,'title');addText(p,scene.text,'body');copy.append(h,p);
    layouts.push([...copy.querySelectorAll('.measure-letter')].map(span=>{
      const r=span.getBoundingClientRect(),baseline=span.querySelector('.baseline').getBoundingClientRect();
      return {char:span.dataset.char,x:r.left-stageRect.left,y:baseline.top-stageRect.top,size:parseFloat(getComputedStyle(span).fontSize),kind:span.dataset.kind};
    }));
    wrap.style.cssText='';
    if(innerWidth<=700){
      const bottom=copy.getBoundingClientRect().bottom-stageRect.top;
      const top=bottom+Math.max(12,stageHeight*.025);
      const maxHeight=Math.max(80,stageHeight-top-stageHeight*.04);
      const width=Math.min(innerWidth*.9,maxHeight*600/460);
      wrap.style.top=`${top}px`;wrap.style.width=`${width}px`;wrap.style.left=`${(innerWidth-width)/2}px`;
    }
    const r=wrap.getBoundingClientRect();artRects.push({x:r.left-stageRect.left,y:r.top-stageRect.top,width:r.width});
  }
  buildIdentities();position=target=clamp(previous,0,scenes.length-1);
  window.scrollTo({top:position*unit,behavior:'instant'});current=-1;render();
}
function buildIdentities(){
  $('letters').replaceChildren();nodes=[];plans=[];
  layouts[0].forEach((letter,id)=>letter.id=id);
  for(let i=1;i<layouts.length;i++){
    const matched=matchInk(layouts[i-1],layouts[i]);
    for(const [a,b] of matched.pairs)layouts[i][b].id=layouts[i-1][a].id;
  }
  for(let id=0;id<layouts[0].length;id++){
    const el=node('path',$('letters'));el.classList.add('letter');el.dataset.letterId=id;nodes.push(el);
  }
  for(let i=0;i<layouts.length-1;i++){
    const targets=new Map(layouts[i+1].map(t=>[t.id,t]));
    plans.push(layouts[i].map(a=>({a,b:targets.get(a.id),shape:morph(a.char,targets.get(a.id).char)})));
  }
}
function sampleDrawings(){
  const sampler=document.createElementNS(NS,'path');
  drawings=scenes.map(scene=>scene.paths.map(d=>{
    sampler.setAttribute('d',d);const length=sampler.getTotalLength();
    return Array.from({length:76},(_,i)=>{const p=sampler.getPointAtLength(length*i/75);return {x:p.x,y:p.y};});
  }));
}
function updateScene(index){
  if(current===index)return;current=index;
  $('readable').replaceChildren();const h=document.createElement('h1'),p=document.createElement('p');
  h.textContent=scenes[index].title.replace('\n',' ');p.textContent=scenes[index].text;$('readable').append(h,p);
}
function render(){
  if(!plans.length)return;
  const state=sceneAt(position,scenes.length);
  const index=reduced?Math.min(Math.round(position),scenes.length-2):state.index;
  const t=reduced?(Math.round(position)===scenes.length-1?1:0):state.t;
  const shown=t<.5?index:index+1;updateScene(shown);
  for(const {a,b,shape} of plans[index]){
    const delay=(a.id%9)/9*.065;
    const local=t===0?0:t===1?1:smooth(clamp((t-delay)/.935));
    const p=letterPosition(a,b,local,a.id,.8),el=nodes[a.id];
    const scale=p.scale/font.units;
    el.setAttribute('transform',`translate(${p.x.toFixed(2)} ${p.y.toFixed(2)}) rotate(${p.rotation.toFixed(2)}) scale(${scale} ${-scale})`);
    const d=shape(local);if(el.getAttribute('d')!==d)el.setAttribute('d',d);
    el.dataset.character=local<.5?a.char:b.char;
  }
  const a=artRects[index],b=artRects[index+1],wrap=$('drawing-wrap');
  wrap.style.left=`${mix(a.x,b.x,t)}px`;wrap.style.top=`${mix(a.y,b.y,t)}px`;wrap.style.width=`${mix(a.width,b.width,t)}px`;
  for(let s=0;s<18;s++){
    let d='',ghost='';
    for(let j=0;j<76;j++){
      const pa=artPoint(index,s,drawings[index][s][j]),pb=artPoint(index+1,s,drawings[index+1][s][j]);
      const bend=Math.sin(Math.PI*t)*Math.sin(j/75*Math.PI)*(s%2?1:-1)*13;
      const x=mix(pa.x,pb.x,t)+bend,y=mix(pa.y,pb.y,t)-Math.sin(Math.PI*t)*9,cmd=j?'L':'M';
      d+=`${cmd}${x.toFixed(1)} ${y.toFixed(1)}`;
      ghost+=`${cmd}${(x+Math.sin(j*.39+s)*.8+.6).toFixed(1)} ${(y+Math.cos(j*.26+s)*.65+.5).toFixed(1)}`;
    }
    ink[s].setAttribute('d',d);echo[s].setAttribute('d',ghost);
  }
  const editable=shown===2&&(t<.001||t>.999);
  $('drawing-controls').inert=!editable;
  controls.forEach((button,i)=>{
    button.disabled=!editable;
    const region=regions[i],stroke=i===0?4:i===1?10:14;
    const p=artPoint(2,stroke,region);
    button.style.left=`${p.x/6}%`;button.style.top=`${p.y/4.6}%`;
    button.style.width=`${region.w/6}%`;button.style.height=`${region.h/4.6}%`;
  });
}
function remember(){history.replaceState({...history.state,henryPortrait:{position:clamp(scrollY/unit,0,scenes.length-1)}},'');}
function wake(){if(!frame)frame=requestAnimationFrame(tick);}
function tick(time){
  frame=0;const dt=Math.min((time-lastTime)||16,48);lastTime=time;
  if(glide){const progress=clamp((time-glide.start)/glide.duration);target=mix(glide.from,glide.to,smooth(progress));window.scrollTo({top:target*unit,behavior:'instant'});if(progress===1)glide=null;}
  position=reduced?target:mix(position,target,1-Math.exp(-dt/65));
  if(Math.abs(position-target)<.00005)position=target;
  layoutAmount=reduced?layoutChoice:mix(layoutAmount,layoutChoice,1-Math.exp(-dt/150));
  if(Math.abs(layoutAmount-layoutChoice)<.001)layoutAmount=layoutChoice;
  render();
  if(glide||position!==target||layoutAmount!==layoutChoice)wake();else remember();
}
function go(to){
  to=clamp(to,0,scenes.length-1);
  if(reduced){target=position=to;window.scrollTo({top:to*unit,behavior:'instant'});render();remember();return;}
  glide={from:scrollY/unit,to,start:performance.now(),duration:Math.max(1450,Math.abs(to-position)*1000)};wake();
}
addEventListener('scroll',()=>{target=clamp(scrollY/unit,0,scenes.length-1);wake();},{passive:true});
addEventListener('wheel',()=>{glide=null;},{passive:true});
addEventListener('touchstart',()=>{glide=null;},{passive:true});
addEventListener('keydown',event=>{
  if(event.target.closest('button,input,textarea,select'))return;
  if(['ArrowDown','ArrowRight','PageDown',' '].includes(event.key)){event.preventDefault();go(Math.floor(position+.12)+1);}
  if(['ArrowUp','ArrowLeft','PageUp'].includes(event.key)){event.preventDefault();go(Math.ceil(position-.12)-1);}
  if(event.key==='Home'){event.preventDefault();go(0);}
  if(event.key==='End'){event.preventDefault();go(scenes.length-1);}
});
preference.addEventListener('change',event=>{reduced=event.matches;glide=null;position=target;wake();});
addEventListener('resize',()=>{clearTimeout(resizeTimer);resizeTimer=setTimeout(()=>{glide=null;measure();},100);});
addEventListener('pagehide',()=>{remember();cancelAnimationFrame(frame);frame=0;glide=null;});
addEventListener('pageshow',()=>{if(layouts.length){position=target=scrollY/unit;render();}});

try{
  [font]=await Promise.all([fetch('./glyphs.json').then(r=>{if(!r.ok)throw new Error('Font outlines unavailable');return r.json();}),document.fonts.load('20px Portrait')]);
  morph=glyphMorphs(font);sampleDrawings();measure();
}catch(error){
  console.error(error);$('journey').replaceChildren();
  for(const scene of scenes){const article=document.createElement('article'),h=document.createElement('h1'),p=document.createElement('p');article.style.cssText='padding:8vh 9vw;max-width:900px;font:20px/1.6 Georgia,serif';h.textContent=scene.title.replace('\n',' ');p.textContent=scene.text;article.append(h,p);$('journey').append(article);}
}
