// Replay recorded asset decisions against the actual objects in the sample PowerPoint.
const root = document.getElementById('asset-decisions');
if (root) {
  const byId = id => document.getElementById(id);
  const base = new URL('../../examples/consulting-ai-transformation/', import.meta.url);
  const tabs = [...root.querySelectorAll('[data-asset-case]')];
  const inspector = byId('asset-icon-inspector');
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
  let examples, selected = 0, generation = 0, visible = false, previewTrigger, pinned = null;
  const animations = new Set(), flights = new Set();
  const libraryFiles = [
    ['file-search', 'File search'], ['team', 'Team'], ['database-2', 'Database'],
    ['route', 'Route'], ['user-star', 'Expert'], ['focus-2', 'Focus'],
    ['draft', 'Draft'], ['money-dollar-circle', 'Value'], ['shield-check', 'Review'],
    ['play-circle', 'Play'], ['send-plane-2', 'Send'], ['flag', 'Flag'],
  ];
  function closePreview() {
    if (inspector.matches(':popover-open')) inspector.hidePopover();
  }
  const library = libraryFiles.map(([name, label]) => {
    const tile = document.createElement('span');
    tile.className = 'asset-library-item'; tile.dataset.file = `${name}-line.svg`;
    tile.setAttribute('role', 'listitem');
    const button = document.createElement('button'); button.type = 'button';
    button.setAttribute('aria-label', `Inspect ${label.toLowerCase()} icon`);
    button.setAttribute('aria-haspopup', 'dialog');
    const icon = new Image(); icon.src = `assets/remix/${name}-line.svg`; icon.alt = '';
    button.append(icon); tile.append(button); byId('asset-library-grid').append(tile);
    button.addEventListener('click', () => {
      stopMotion(); closePreview(); previewTrigger = button;
      byId('asset-inspector-image').src = icon.src;
      byId('asset-inspector-name').textContent = label;
      inspector.showPopover();
      const rect = button.getBoundingClientRect(), box = inspector.getBoundingClientRect();
      inspector.style.left = `${Math.max(12, Math.min(innerWidth-box.width-12,rect.left+rect.width/2-box.width/2))}px`;
      inspector.style.top = `${Math.max(12, Math.min(innerHeight-box.height-12,rect.bottom+10))}px`;
      byId('asset-inspector-close').focus({preventScroll:true});
    });
    return tile;
  });
  byId('asset-inspector-close').addEventListener('click', () => { closePreview(); previewTrigger?.focus({preventScroll:true}); });
  addEventListener('scroll', event => { if (!inspector.contains(event.target)) closePreview(); }, {capture:true,passive:true});
  addEventListener('resize', () => { closePreview(); stopMotion(); });
  reducedMotion.addEventListener('change', () => stopMotion());
  async function read(url) {
    const response = await fetch(url);
    if (!response.ok) throw new Error('The recorded asset selections could not be loaded.');
    return response.json();
  }
  function stopMotion() {
    generation++;
    animations.forEach(animation => animation.cancel()); animations.clear();
    flights.forEach(flight => flight.remove()); flights.clear();
    root.classList.remove('is-playing');
    if (examples) {
      const files = new Set(examples[selected].icons.map(icon => icon.file));
      library.forEach(tile => tile.classList.toggle('is-selected', files.has(tile.dataset.file)));
    }
  }
  async function fly(file, source, destination, run) {
    if (run !== generation) return;
    const origin = root.getBoundingClientRect();
    const from = source.getBoundingClientRect(), to = destination.getBoundingClientRect();
    const size = 32;
    const flight = document.createElement('span'); flight.className = 'asset-flight'; flight.setAttribute('aria-hidden','true');
    const icon = new Image(); icon.src = `assets/remix/${file}`; icon.alt = ''; flight.append(icon);
    Object.assign(flight.style,{left:`${from.left+from.width/2-origin.left-size/2}px`,top:`${from.top+from.height/2-origin.top-size/2}px`,width:`${size}px`,height:`${size}px`});
    root.append(flight);flights.add(flight);
    const dx=to.left+to.width/2-from.left-from.width/2, dy=to.top+to.height/2-from.top-from.height/2;
    const scale=Math.max(.4,Math.min(1,to.width/size));
    const animation=flight.animate([
      {transform:'translate(0,0) scale(1)',opacity:1},
      {transform:`translate(${dx}px,${dy}px) scale(${scale})`,opacity:1},
    ],{duration:460,easing:'cubic-bezier(.22,.68,0,1)',fill:'forwards'});
    animations.add(animation);
    await animation.finished.catch(() => {});
    animations.delete(animation);flight.remove();flights.delete(flight);
  }
  async function replay() {
    if (!examples) return;
    stopMotion();closePreview();
    if (reducedMotion.matches) return;
    pinned=null;
    const run=generation, example=examples[selected];
    byId('asset-case-decision').textContent=example.decision;
    // Wait for the real render so placement is always shown against the matching slide.
    try { await byId('asset-result-image').decode(); } catch { return; }
    if (run !== generation) return;
    root.classList.add('is-playing');
    const choices=[...byId('asset-choices').children];
    choices.forEach(choice => { choice.classList.remove('is-arrived'); choice.setAttribute('aria-pressed','false'); });
    byId('asset-result-highlights').classList.remove('has-focus');
    library.forEach(tile => tile.classList.remove('is-focused'));
    await Promise.all(example.icons.map(async (icon,index) => {
      const source=library.find(tile => tile.dataset.file===icon.file).querySelector('img');
      const choice=choices[index], target=byId('asset-result-highlights').children[index];
      await fly(icon.file,source,choice.querySelector('img'),run);
      if (run !== generation) return;
      choice.classList.add('is-arrived');
      await fly(icon.file,choice.querySelector('img'),target,run);
    }));
    if (run===generation) root.classList.remove('is-playing');
  }
  function showCase(index, animate=true) {
    stopMotion();closePreview();selected=index;pinned=null;
    tabs.forEach((tab,i) => { tab.setAttribute('aria-selected',String(i===index));tab.tabIndex=i===index?0:-1; });
    byId('asset-case-panel').setAttribute('aria-labelledby',tabs[index].id);
    if (!examples) return;
    const example=examples[index];
    byId('asset-brief').textContent=example.brief;
    byId('asset-case-decision').textContent=example.decision;
    const selectedFiles=new Set(example.icons.map(icon=>icon.file));
    library.forEach(tile => { tile.classList.toggle('is-selected',selectedFiles.has(tile.dataset.file));tile.classList.remove('is-focused'); });
    byId('asset-library-count').textContent=`${selectedFiles.size} selected`;
    byId('asset-result-image').src=new URL(`assets/${example.id}-render.png`,base).href;
    byId('asset-result-image').alt=`${example.label}, rendered from the sample PowerPoint`;
    const link=byId('asset-result-link');
    link.href=`?deck=consulting-ai-transformation&slide=${example.id}&view=rebuilt#examples`;
    link.dataset.sampleSlide=example.id;link.setAttribute('aria-label',`Inspect slide. ${example.brief}`);
    const highlights=byId('asset-result-highlights');highlights.replaceChildren();highlights.classList.remove('has-focus');
    const buttons=[];
    function highlight(entity) {
      stopMotion();
      [...highlights.children].forEach(mark=>mark.classList.toggle('is-focused',mark.dataset.entity===entity));
      highlights.classList.toggle('has-focus',Boolean(entity));
      const icon=example.icons.find(item=>item.entity===entity);
      library.forEach(tile=>tile.classList.toggle('is-focused',tile.dataset.file===icon?.file));
      byId('asset-case-decision').textContent=icon?.reason||example.decision;
    }
    const choices=example.icons.map(icon=>{
      const record=example.objects.find(object=>object.name===icon.entity);
      if (!record) throw new Error('A selected asset is missing from the sample PowerPoint.');
      const xs=record.polygon.map(point=>point[0]),ys=record.polygon.map(point=>point[1]);
      const mark=document.createElement('span');mark.dataset.entity=icon.entity;
      Object.assign(mark.style,{left:`${Math.min(...xs)*100}%`,top:`${Math.min(...ys)*100}%`,width:`${(Math.max(...xs)-Math.min(...xs))*100}%`,height:`${(Math.max(...ys)-Math.min(...ys))*100}%`});highlights.append(mark);
      const button=document.createElement('button');button.type='button';button.className='asset-choice';
      button.setAttribute('aria-label',`Locate ${icon.label} in the PowerPoint`);button.setAttribute('aria-pressed','false');
      const image=new Image();image.src=`assets/remix/${icon.file}`;image.alt='';
      const name=document.createElement('strong');name.textContent=icon.label;button.append(image,name);buttons.push(button);
      button.addEventListener('pointerenter',()=>highlight(icon.entity));
      button.addEventListener('pointerleave',()=>highlight(pinned));
      button.addEventListener('focus',()=>highlight(icon.entity));button.addEventListener('blur',()=>highlight(pinned));
      button.addEventListener('click',()=>{ pinned=pinned===icon.entity?null:icon.entity;buttons.forEach(item=>item.setAttribute('aria-pressed',String(item===button&&Boolean(pinned))));highlight(pinned); });
      return button;
    });
    byId('asset-choices').replaceChildren(...choices);byId('asset-choices').style.setProperty('--asset-choice-count',choices.length);
    byId('asset-case-panel').setAttribute('aria-busy','false');
    if (animate) replay();
  }
  tabs.forEach((tab,index)=>{
    tab.addEventListener('click',()=>showCase(index));
    tab.addEventListener('keydown',event=>{
      const offset={ArrowRight:1,ArrowLeft:-1}[event.key];
      if (!offset&&!['Home','End'].includes(event.key)) return;
      event.preventDefault();const next=event.key==='Home'?0:event.key==='End'?tabs.length-1:(index+offset+tabs.length)%tabs.length;
      showCase(next);tabs[next].focus();
    });
  });
  byId('asset-replay').addEventListener('click',replay);
  const observer=new IntersectionObserver(entries=>{
    if (entries.some(entry=>entry.isIntersecting)) { visible=true;if(examples) replay();observer.disconnect(); }
  },{threshold:.2});observer.observe(root);
  read(new URL('./assets/asset-selection-examples.json',import.meta.url)).then(async records=>{
    examples=await Promise.all(records.map(async example=>({...example,objects:(await read(new URL(`assets/${example.id}-objects.json`,base))).objects})));
    showCase(selected,visible);
  }).catch(()=>{
    stopMotion();byId('asset-case-panel').setAttribute('aria-busy','false');
    byId('asset-case-decision').textContent='The recorded choices could not be loaded. You can still open the sample slide.';
  });
}
