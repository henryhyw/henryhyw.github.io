// The page previews asset selection locally. Generation remains an Agent operation.
const root = document.getElementById('asset-explorer');
if (root) {
  const byId = id => document.getElementById(id);
  const icons = [ ['file-search', 'File search'], ['shield-check', 'Shield check'], ['user-star', 'Expert'], ['database-2', 'Database'], ['team', 'Team'], ['route', 'Route'], ['flag', 'Flag'], ['focus-2', 'Focus'] ];
  let variant = 'line';
  let selectedIcon = icons[0];
  let activeSource = 'remix';
  let uploaded = null;
  let uploadRequest = 0;
  const status = message => { byId('asset-status').textContent = message; };
  function showAsset(src, name, format) {
    const image = byId('asset-preview-image');
    image.src = src;
    image.alt = name;
    byId('asset-selected-name').textContent = name;
    byId('asset-selected-format').textContent = format;
  }
  function showIcon() {
    showAsset(`assets/remix/${selectedIcon[0]}-${variant}.svg`, selectedIcon[1], `SVG · ${variant === 'line' ? 'Line' : 'Fill'}`);
  }
  function renderIcons() {
    byId('asset-icon-grid').replaceChildren(...icons.map(icon => {
      const button = document.createElement('button');
      button.type = 'button';
      button.setAttribute('aria-label', icon[1]);
      button.setAttribute('aria-pressed', String(icon === selectedIcon));
      button.title = icon[1];
      const image = new Image(); image.src = `assets/remix/${icon[0]}-${variant}.svg`; image.alt = '';
      button.append(image);
      button.addEventListener('click', () => {
        selectedIcon = icon;
        for (const item of byId('asset-icon-grid').children) item.setAttribute('aria-pressed', String(item === button));
        showIcon(); status(`${icon[1]} selected.`);
      });
      return button;
    }));
  }
  root.querySelectorAll('[data-asset-variant]').forEach(button => button.addEventListener('click', () => {
    variant = button.dataset.assetVariant;
    root.querySelectorAll('[data-asset-variant]').forEach(item => item.setAttribute('aria-pressed', String(item === button)));
    renderIcons(); showIcon();
  }));
  function showUpload() {
    if (uploaded) showAsset(uploaded.url, uploaded.name, uploaded.format);
    else showAsset('mark.svg', 'SlidePoise logo', 'SVG · Original');
  }
  function showCommons() { showAsset('assets/wikimedia-foundation.svg', 'Wikimedia Foundation', 'SVG · Original'); }
  byId('asset-commons-example').addEventListener('click', () => { showCommons(); status('Original Wikimedia Foundation SVG selected.'); });
  const tabs = [...root.querySelectorAll('[data-asset-source]')];
  function selectSource(tab) {
    activeSource = tab.dataset.assetSource;
    tabs.forEach(item => {
      const selected = item === tab;
      item.setAttribute('aria-selected', String(selected)); item.tabIndex = selected ? 0 : -1;
      byId(item.getAttribute('aria-controls')).hidden = !selected;
    });
    if (activeSource === 'remix') showIcon();
    else if (activeSource === 'commons') showCommons();
    else showUpload();
  }
  tabs.forEach((tab, index) => {
    tab.addEventListener('click', () => selectSource(tab));
    tab.addEventListener('keydown', event => {
      const offset = {ArrowRight: 1, ArrowLeft: -1}[event.key];
      if (!offset && !['Home', 'End'].includes(event.key)) return;
      event.preventDefault();
      const next = tabs[event.key === 'Home' ? 0 : event.key === 'End' ? tabs.length - 1 : (index + offset + tabs.length) % tabs.length];
      selectSource(next); next.focus();
    });
  });
  root.querySelectorAll('[data-asset-stage]').forEach(button => button.addEventListener('click', () => {
    const stage = button.dataset.assetStage;
    byId('asset-placement').dataset.stage = stage;
    root.querySelectorAll('[data-asset-stage]').forEach(item => item.setAttribute('aria-pressed', String(item === button)));
    byId('asset-stage-description').textContent = stage === 'context'
      ? 'The selected artwork is included in the image-generation context, alongside your style references.'
      : 'The Agent locates the asset in the design. Reconstruction places the original file as a separate PowerPoint object.';
  }));
  byId('asset-example').addEventListener('click', () => {
    uploadRequest++;
    if (uploaded) URL.revokeObjectURL(uploaded.url);
    uploaded = null; byId('asset-upload').value = ''; showUpload(); status('SlidePoise logo selected.');
  });
  byId('asset-upload').addEventListener('change', async event => {
    const file = event.target.files?.[0]; if (!file) return;
    const request = ++uploadRequest;
    if (!['image/svg+xml','image/png','image/jpeg'].includes(file.type) || file.size > 10 * 1024 * 1024) {
      status('Choose an SVG, PNG or JPEG smaller than 10 MB.'); event.target.value = ''; return;
    }
    const url = URL.createObjectURL(file);
    try {
      const image = new Image(); image.src = url; await image.decode();
      if (request !== uploadRequest) { URL.revokeObjectURL(url); return; }
      if (uploaded) URL.revokeObjectURL(uploaded.url);
      uploaded = {url, name: file.name, format: file.type === 'image/svg+xml' ? 'SVG · Original' : `${image.naturalWidth} × ${image.naturalHeight}`};
      if (activeSource === 'upload') showUpload();
      status('Your image is ready. It stays in this browser.');
    } catch {
      URL.revokeObjectURL(url);
      if (request === uploadRequest) status('This image could not be opened. Try another file.');
    }
    event.target.value = '';
  });
  renderIcons();
}
