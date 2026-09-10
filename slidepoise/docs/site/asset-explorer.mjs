// The showcase replays recorded decisions. Positions come from the exported PowerPoint objects.
const root = document.getElementById('asset-decisions');
if (root) {
  const byId = id => document.getElementById(id);
  const base = new URL('../../examples/consulting-ai-transformation/', import.meta.url);
  const tabs = [...root.querySelectorAll('[data-asset-case]')];
  const inspector = byId('asset-icon-inspector');
  const highlights = byId('asset-result-highlights');
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
  const hoverPointer = matchMedia('(hover: hover) and (pointer: fine)');
  const animations = new Set(), flights = new Set(), pauses = new Map();
  let examples, selected = 0, generation = 0, playing = false, previewTrigger;

  function closePreview() {
    if (inspector.matches(':popover-open')) inspector.hidePopover();
  }
  function positionPreview() {
    if (!previewTrigger || !inspector.matches(':popover-open')) return;
    const rect = previewTrigger.getBoundingClientRect(), box = inspector.getBoundingClientRect();
    const top = rect.bottom + box.height + 10 <= innerHeight - 12 ? rect.bottom + 10 : rect.top - box.height - 10;
    inspector.style.left = `${Math.max(12, Math.min(innerWidth - box.width - 12, rect.left + rect.width / 2 - box.width / 2))}px`;
    inspector.style.top = `${Math.max(12, Math.min(innerHeight - box.height - 12, top))}px`;
  }
  function currentIcons(file) {
    return examples?.[selected].icons.filter(icon => icon.file === file) || [];
  }
  function focusAsset(file) {
    const icons = currentIcons(file);
    library.forEach(tile => tile.classList.toggle('is-focused', tile.dataset.file === file));
    [...highlights.children].forEach(mark => mark.classList.toggle('is-focused', icons.some(icon => icon.entity === mark.dataset.entity)));
    highlights.classList.toggle('has-focus', icons.length > 0);
    if (examples) byId('asset-case-decision').textContent = icons.length === 1 ? icons[0].reason : icons.length ? examples[selected].decision : '';
  }
  const library = [
    ['file-search', 'File search'], ['team', 'Team'], ['database-2', 'Database'],
    ['route', 'Route'], ['user-star', 'Expert'], ['focus-2', 'Focus'],
    ['draft', 'Draft'], ['money-dollar-circle', 'Value'], ['shield-check', 'Review'],
    ['play-circle', 'Play'], ['send-plane-2', 'Send'], ['flag', 'Flag'],
  ].map(([name, label]) => {
    const tile = document.createElement('span');
    tile.className = 'asset-library-item'; tile.dataset.file = `${name}-line.svg`;
    tile.setAttribute('role', 'listitem');
    const button = document.createElement('button'); button.type = 'button';
    button.setAttribute('aria-label', `Inspect ${label.toLowerCase()} icon`);
    button.setAttribute('aria-haspopup', 'dialog');
    const icon = new Image(); icon.src = `assets/remix/${name}-line.svg`; icon.alt = '';
    const title = document.createElement('span'); title.textContent = label;
    button.append(icon); tile.append(button, title); byId('asset-library-grid').append(tile);
    button.addEventListener('pointerenter', () => { if (!playing && hoverPointer.matches) focusAsset(tile.dataset.file); });
    button.addEventListener('pointerleave', () => { if (!playing && !inspector.matches(':popover-open')) focusAsset(null); });
    button.addEventListener('focus', () => { if (!playing) focusAsset(tile.dataset.file); });
    button.addEventListener('blur', () => { if (!playing && !inspector.matches(':popover-open')) focusAsset(null); });
    button.addEventListener('click', () => {
      stopMotion(); closePreview(); previewTrigger = button; focusAsset(tile.dataset.file);
      byId('asset-inspector-image').src = icon.src;
      byId('asset-inspector-name').textContent = label;
      const matches = currentIcons(tile.dataset.file);
      const usage = byId('asset-inspector-use');
      usage.textContent = matches.length ? (matches.length === 1 ? matches[0].reason : examples[selected].decision) : '';
      usage.hidden = !matches.length;
      inspector.showPopover();
      positionPreview();
      byId('asset-inspector-close').focus({preventScroll: true});
    });
    return tile;
  });
  byId('asset-inspector-close').addEventListener('click', () => { closePreview(); previewTrigger?.focus({preventScroll: true}); });
  addEventListener('scroll', event => { if (!inspector.contains(event.target)) positionPreview(); }, {capture: true, passive: true});
  addEventListener('resize', () => { closePreview(); stopMotion(); });
  reducedMotion.addEventListener('change', () => stopMotion());

  async function read(url) {
    const response = await fetch(url);
    if (!response.ok) throw new Error('The recorded asset selections could not be loaded.');
    return response.json();
  }
  function setPlaying(value) {
    playing = value;
    byId('asset-play').setAttribute('aria-label', value ? 'Stop animation' : 'Play asset selection and placement');
    byId('asset-play-label').textContent = value ? 'Stop' : 'Play';
    byId('asset-play-glyph').setAttribute('d', value ? 'M6 6h8v8H6Z' : 'm7 4 9 6-9 6Z');
  }
  function stopMotion() {
    generation++; setPlaying(false);
    animations.forEach(animation => animation.cancel()); animations.clear();
    flights.forEach(flight => flight.remove()); flights.clear();
    pauses.forEach((resolve, timer) => { clearTimeout(timer); resolve(); }); pauses.clear();
    root.classList.remove('is-playing');
    if (examples) {
      const files = new Set(examples[selected].icons.map(icon => icon.file));
      library.forEach(tile => tile.classList.toggle('is-selected', files.has(tile.dataset.file)));
      byId('asset-library-count').textContent = `${files.size} selected`;
      focusAsset(null);
    }
  }
  function pause(milliseconds) {
    return new Promise(resolve => {
      const timer = setTimeout(() => { pauses.delete(timer); resolve(); }, milliseconds);
      pauses.set(timer, resolve);
    });
  }
  async function fly(file, destination, run) {
    if (run !== generation) return;
    const source = library.find(tile => tile.dataset.file === file).querySelector('img');
    const origin = root.getBoundingClientRect(), from = source.getBoundingClientRect(), to = destination.getBoundingClientRect();
    const size = 34;
    const flight = document.createElement('span'); flight.className = 'asset-flight'; flight.setAttribute('aria-hidden', 'true');
    const icon = new Image(); icon.src = `assets/remix/${file}`; icon.alt = ''; flight.append(icon);
    Object.assign(flight.style, {left: `${from.left + from.width / 2 - origin.left - size / 2}px`, top: `${from.top + from.height / 2 - origin.top - size / 2}px`, width: `${size}px`, height: `${size}px`});
    root.append(flight); flights.add(flight);
    const dx = to.left + to.width / 2 - from.left - from.width / 2, dy = to.top + to.height / 2 - from.top - from.height / 2;
    const scale = Math.max(.4, Math.min(1, to.width / size));
    const animation = flight.animate([
      {transform: 'translate(0,0) scale(1)', opacity: 1},
      {transform: `translate(${dx}px,${dy}px) scale(${scale})`, opacity: 1},
    ], {duration: 850, easing: 'cubic-bezier(.65,0,.35,1)', fill: 'forwards'});
    animations.add(animation); await animation.finished.catch(() => {});
    animations.delete(animation); flight.remove(); flights.delete(flight);
    if (run === generation) destination.classList.add('is-placed');
  }
  async function playFlow() {
    if (!examples) return;
    stopMotion(); closePreview();
    if (reducedMotion.matches) return;
    setPlaying(true);
    const run = generation, example = examples[selected];
    try { await byId('asset-result-image').decode(); } catch { if (run === generation) stopMotion(); return; }
    if (run !== generation) return;
    root.classList.add('is-playing');
    library.forEach(tile => tile.classList.remove('is-selected'));
    [...highlights.children].forEach(mark => mark.classList.remove('is-placed'));
    const files = [...new Set(example.icons.map(icon => icon.file))];
    for (const [index, file] of files.entries()) {
      if (run !== generation) return;
      library.find(tile => tile.dataset.file === file).classList.add('is-selected');
      byId('asset-library-count').textContent = `${index + 1} selected`;
      focusAsset(file);
      const entities = example.icons.filter(icon => icon.file === file).map(icon => icon.entity);
      await Promise.all([...highlights.children].filter(mark => entities.includes(mark.dataset.entity)).map(mark => fly(file, mark, run)));
      if (run !== generation) return;
      await pause(550);
    }
    if (run === generation) stopMotion();
  }
  function showCase(index) {
    stopMotion(); closePreview(); selected = index;
    tabs.forEach((tab, i) => { tab.setAttribute('aria-selected', String(i === index)); tab.tabIndex = i === index ? 0 : -1; });
    byId('asset-case-panel').setAttribute('aria-labelledby', tabs[index].id);
    if (!examples) return;
    const example = examples[index], files = new Set(example.icons.map(icon => icon.file));
    byId('asset-brief').textContent = example.brief;
    byId('asset-case-decision').textContent = '';
    library.forEach(tile => { tile.classList.toggle('is-selected', files.has(tile.dataset.file)); tile.classList.remove('is-focused'); });
    byId('asset-library-count').textContent = `${files.size} selected`;
    byId('asset-result-image').src = new URL(`assets/${example.id}-render.png`, base).href;
    byId('asset-result-image').alt = `${example.label}, rendered from the sample PowerPoint`;
    const link = byId('asset-result-link');
    link.href = `?deck=consulting-ai-transformation&slide=${example.id}&view=rebuilt#examples`;
    link.dataset.sampleSlide = example.id; link.setAttribute('aria-label', `Inspect slide. ${example.brief}`);
    highlights.replaceChildren(); highlights.classList.remove('has-focus');
    example.icons.forEach(icon => {
      const record = example.objects.find(object => object.name === icon.entity);
      if (!record) throw new Error('A selected asset is missing from the sample PowerPoint.');
      const xs = record.polygon.map(point => point[0]), ys = record.polygon.map(point => point[1]);
      const mark = document.createElement('span'); mark.dataset.entity = icon.entity;
      Object.assign(mark.style, {left: `${Math.min(...xs) * 100}%`, top: `${Math.min(...ys) * 100}%`, width: `${(Math.max(...xs) - Math.min(...xs)) * 100}%`, height: `${(Math.max(...ys) - Math.min(...ys)) * 100}%`}); highlights.append(mark);
    });
    byId('asset-case-panel').setAttribute('aria-busy', 'false');
  }
  tabs.forEach((tab, index) => {
    tab.addEventListener('click', () => showCase(index));
    tab.addEventListener('keydown', event => {
      const offset = {ArrowRight: 1, ArrowLeft: -1}[event.key];
      if (!offset && !['Home', 'End'].includes(event.key)) return;
      event.preventDefault();
      const next = event.key === 'Home' ? 0 : event.key === 'End' ? tabs.length - 1 : (index + offset + tabs.length) % tabs.length;
      showCase(next); tabs[next].focus();
    });
  });
  byId('asset-play').addEventListener('click', () => playing ? stopMotion() : playFlow());
  read(new URL('./assets/asset-selection-examples.json', import.meta.url)).then(async records => {
    examples = await Promise.all(records.map(async example => ({...example, objects: (await read(new URL(`assets/${example.id}-objects.json`, base))).objects})));
    showCase(selected); byId('asset-play').disabled = false;
  }).catch(() => {
    stopMotion(); byId('asset-case-panel').setAttribute('aria-busy', 'false');
    byId('asset-case-decision').textContent = 'The recorded choices could not be loaded. You can still open the sample slide.';
  });
}
