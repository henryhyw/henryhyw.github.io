// Inspect recorded Agent selections and their positions in the delivered PowerPoint.
const root = document.getElementById('asset-decisions');
if (root) {
  const byId = id => document.getElementById(id);
  const base = new URL('../../examples/consulting-ai-transformation/', import.meta.url);
  const tabs = [...root.querySelectorAll('[data-asset-case]')];
  let examples;
  let selected = 0;
  const libraryFiles = [
    ['file-search', 'File search'], ['team', 'Team'], ['database-2', 'Database'],
    ['route', 'Route'], ['user-star', 'Expert'], ['focus-2', 'Focus'],
    ['draft', 'Draft'], ['money-dollar-circle', 'Value'], ['shield-check', 'Review'],
    ['play-circle', 'Play'], ['send-plane-2', 'Send'], ['flag', 'Flag'],
  ];
  const library = libraryFiles.map(([name, label]) => {
    const tile = document.createElement('span');
    tile.className = 'asset-library-item'; tile.dataset.file = `${name}-line.svg`;
    tile.setAttribute('role', 'listitem'); tile.setAttribute('aria-label', label); tile.title = label;
    const icon = new Image(); icon.src = `assets/remix/${name}-line.svg`; icon.alt = '';
    tile.append(icon); byId('asset-library-grid').append(tile);
    return tile;
  });
  async function read(url) {
    const response = await fetch(url);
    if (!response.ok) throw new Error('The recorded asset selections could not be loaded.');
    return response.json();
  }
  function showCase(index) {
    selected = index;
    tabs.forEach((tab, i) => {
      tab.setAttribute('aria-selected', String(i === index));
      tab.tabIndex = i === index ? 0 : -1;
    });
    byId('asset-case-panel').setAttribute('aria-labelledby', tabs[index].id);
    if (!examples) return;
    const example = examples[index];
    byId('asset-brief').textContent = example.brief;
    byId('asset-case-decision').textContent = example.decision;
    const selectedFiles = new Set(example.icons.map(icon => icon.file));
    library.forEach(tile => tile.classList.toggle('is-selected', selectedFiles.has(tile.dataset.file)));
    byId('asset-library-count').textContent = `${selectedFiles.size} selected`;
    byId('asset-result-image').src = new URL(`assets/${example.id}-render.png`, base).href;
    byId('asset-result-image').alt = `${example.label}, rendered from the sample PowerPoint`;
    const link = byId('asset-result-link');
    link.href = `?deck=consulting-ai-transformation&slide=${example.id}&view=rebuilt#examples`;
    link.dataset.sampleSlide = example.id;
    link.setAttribute('aria-label', `Inspect slide. ${example.brief}`);
    byId('asset-result-caption').textContent = [
      'The symbols support the recommendation. The chart and tables carry the evidence.',
      'The same icon family marks each stage, alongside its responsibilities and feedback paths.',
      'Repeating the flag gives all four evidence gates the same visual identity.',
    ][index];
    const highlights = byId('asset-result-highlights'); highlights.replaceChildren();
    let pinned = null;
    const buttons = [];
    function highlight(entity) {
      [...highlights.children].forEach(mark => mark.classList.toggle('is-focused', mark.dataset.entity === entity));
      highlights.classList.toggle('has-focus', Boolean(entity));
      const icon = example.icons.find(item => item.entity === entity);
      library.forEach(tile => tile.classList.toggle('is-focused', tile.dataset.file === icon?.file));
      byId('asset-case-decision').textContent = icon?.reason || example.decision;
    }
    const choices = example.icons.map(icon => {
      const record = example.objects.find(object => object.name === icon.entity);
      if (!record) throw new Error('A selected asset is missing from the sample PowerPoint.');
      const xs = record.polygon.map(point => point[0]), ys = record.polygon.map(point => point[1]);
      const mark = document.createElement('span'); mark.dataset.entity = icon.entity;
      Object.assign(mark.style, {left: `${Math.min(...xs)*100}%`, top: `${Math.min(...ys)*100}%`, width: `${(Math.max(...xs)-Math.min(...xs))*100}%`, height: `${(Math.max(...ys)-Math.min(...ys))*100}%`});
      highlights.append(mark);
      const button = document.createElement('button'); button.type = 'button';
      button.className = 'asset-choice'; button.setAttribute('aria-label', `Locate ${icon.label} in the PowerPoint`); button.setAttribute('aria-pressed', 'false');
      const image = new Image(); image.src = `assets/remix/${icon.file}`; image.alt = '';
      const copy = document.createElement('span');
      const name = document.createElement('strong'); name.textContent = icon.label;
      copy.append(name);button.append(image, copy);buttons.push(button);
      button.addEventListener('pointerenter', () => highlight(icon.entity));
      button.addEventListener('pointerleave', () => highlight(pinned));
      button.addEventListener('focus', () => highlight(icon.entity));
      button.addEventListener('blur', () => highlight(pinned));
      button.addEventListener('click', () => {
        pinned = pinned === icon.entity ? null : icon.entity;
        buttons.forEach(item => item.setAttribute('aria-pressed', String(item === button && Boolean(pinned))));
        highlight(pinned);
      });
      return button;
    });
    byId('asset-choices').replaceChildren(...choices);
    byId('asset-choices').style.setProperty('--asset-choice-count', choices.length);
    byId('asset-case-panel').setAttribute('aria-busy', 'false');
  }
  tabs.forEach((tab, index) => {
    tab.addEventListener('click', () => showCase(index));
    tab.addEventListener('keydown', event => {
      const offset = {ArrowRight:1,ArrowLeft:-1}[event.key];
      if (!offset && !['Home','End'].includes(event.key)) return;
      event.preventDefault();
      const next = event.key === 'Home' ? 0 : event.key === 'End' ? tabs.length-1 : (index+offset+tabs.length)%tabs.length;
      showCase(next); tabs[next].focus();
    });
  });
  read(new URL('./assets/asset-selection-examples.json', import.meta.url)).then(async records => {
    examples = await Promise.all(records.map(async example => ({...example, objects:(await read(new URL(`assets/${example.id}-objects.json`,base))).objects})));
    showCase(selected);
  }).catch(() => {
    byId('asset-case-panel').setAttribute('aria-busy','false');
    byId('asset-case-decision').textContent = 'The recorded choices could not be loaded. You can still open the sample slide.';
  });
}
