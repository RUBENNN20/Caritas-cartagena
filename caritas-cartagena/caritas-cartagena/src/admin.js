import { siteCopy, programs, news } from './content.js';
import { readSavedContent, saveContent, clearSavedContent } from './store.js';
import { appearanceRegions, defaultAppearance, normalizeAppearance, applyAppearance } from './appearance.js';

const defaults = { site: siteCopy, programs, news, appearance: defaultAppearance };
let state = readSavedContent(defaults);
let csrfToken = '';
const $ = (selector) => document.querySelector(selector);
const esc = (value) => String(value ?? '').replace(/[&<>"']/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char]);
const status = (message, error = false) => { const el = $('[data-status]'); el.textContent = message; el.classList.toggle('is-error', error); };

const siteFields = [
  ['heroEyebrow', 'Antetítulo de portada', 'text'], ['heroTitle', 'Título principal (usa saltos de línea)', 'textarea'],
  ['heroLead', 'Texto de apoyo de portada', 'textarea'], ['heroImage', 'Foto de portada', 'image'],
  ['introEyebrow', 'Antetítulo de presentación', 'text'], ['introTitle', 'Título de presentación (usa saltos de línea)', 'textarea'],
  ['introBody', 'Texto de presentación', 'textarea'], ['featureEyebrow', 'Antetítulo del Banco de Alimentos', 'text'],
  ['featureTitle', 'Título del Banco (usa saltos de línea)', 'textarea'], ['featureBody', 'Texto del Banco de Alimentos', 'textarea'], ['featureCta', 'Texto del botón del Banco', 'text'], ['featureImage', 'Foto del Banco de Alimentos', 'image']
];

function field(name, label, value, scope, key, type = 'text', wide = false) {
  const wrap = `class="field${wide ? ' field--wide' : ''}"`;
  const attrs = `data-scope="${scope}" data-key="${key}"`;
  if (type === 'textarea') return `<label ${wrap}><span>${esc(label)}</span><textarea ${attrs} maxlength="1200">${esc(value)}</textarea></label>`;
  if (type === 'image') return `<div ${wrap}><span class="upload-label">${esc(label)}</span><div class="image-controls"><label class="field"><span>Dirección de imagen (HTTPS)</span><input type="url" placeholder="https://…" value="${esc(value)}" ${attrs} /></label><label class="upload-label">O elegir imagen<input type="file" accept="image/jpeg,image/png,image/webp" data-upload-scope="${scope}" data-upload-key="${key}" /><small>JPG, PNG o WebP · se reduce automáticamente</small></label></div><img class="image-preview" src="${esc(value || 'data:,')}" alt="Vista previa" data-preview="${scope}:${key}" /></div>`;
  return `<label ${wrap}><span>${esc(label)}</span><input type="text" value="${esc(value)}" maxlength="240" ${attrs} /></label>`;
}

function renderSiteFields() {
  $('[data-site-fields]').innerHTML = siteFields.map(([key, label, type]) => field(key, label, state.site[key] ?? '', 'site', key, type, ['heroLead', 'introTitle', 'introBody', 'featureTitle', 'featureBody'].includes(key))).join('');
}

function renderCards(collection, target) {
  const rows = state[collection];
  const heading = collection === 'programs' ? 'programa' : 'noticia';
  target.innerHTML = rows.map((item, index) => `<article class="content-card" data-card="${collection}" data-index="${index}">
    <div class="content-card__head"><strong>${String(index + 1).padStart(2, '0')} · ${esc(item.title || `Nueva ${heading}`)}</strong><button class="delete-item" type="button" data-delete="${collection}" data-index="${index}">Eliminar ${heading}</button></div>
    <div class="content-card__fields">
      ${collection === 'programs' ? field('category', 'Categoría', item.category, collection, `${index}.category`) : field('category', 'Categoría', item.category, collection, `${index}.category`)}
      ${field('title', 'Título', item.title, collection, `${index}.title`)}
      ${field('description', collection === 'programs' ? 'Descripción' : 'Resumen breve', item.description ?? '', collection, `${index}.description`, 'textarea', true)}
      ${collection === 'news' ? field('date', 'Fecha / etiqueta', item.date, collection, `${index}.date`) : field('number', 'Número', item.number, collection, `${index}.number`)}
      ${collection === 'programs' ? field('order', 'Orden de presentación', item.order ?? index + 1, collection, `${index}.order`) + `<label class="field"><span>Estado del proyecto</span><select data-scope="programs" data-key="${index}.status"><option value="activo" ${(item.status || 'activo') === 'activo' ? 'selected' : ''}>Activo</option><option value="inactivo" ${item.status === 'inactivo' ? 'selected' : ''}>Inactivo</option></select></label>` : ''}
      ${collection === 'impact' ? field('value', 'Cifra o valor', item.value, collection, `${index}.value`) + field('period', 'Período del dato', item.period, collection, `${index}.period`) + field('source', 'URL de la fuente oficial (HTTPS)', item.source, collection, `${index}.source`) : ''}
      ${collection === 'programs' ? `<label class="field field--wide"><span>Logo del proyecto (SVG, PNG o WebP)</span><input type="file" accept="image/svg+xml,image/png,image/webp,.svg" data-program-logo="${index}" /><small>Elige un archivo de logo; quedará asociado a esta ficha.</small></label><img class="program-logo-preview" src="${esc(item.logo || 'data:,')}" alt="Vista previa del logo" data-logo-preview="${index}" />` : ''}
      ${field('href', 'Enlace oficial (HTTPS)', item.href, collection, `${index}.href`)}
      ${field('image', 'Foto', item.image, collection, `${index}.image`, 'image', true)}
      ${field('alt', 'Descripción accesible de la foto', item.alt, collection, `${index}.alt`, 'text', true)}
    </div></article>`).join('');
}

function render() {
  renderSiteFields();
  renderCards('programs', $('[data-program-fields]'));
  renderCards('news', $('[data-news-fields]'));
  renderAppearanceControls();
  $('[data-program-count]').textContent = `(${state.programs.length})`;
  updateThemePreview();
}

function renderAppearanceControls() {
  const target = $('[data-appearance-controls]');
  target.innerHTML = appearanceRegions.map((region, index) => {
    const item = state.appearance[region.key];
    const colors = [['background', 'Fondo'], ['text', 'Texto'], ['accent', 'Acento'], ['border', 'Borde']];
    return `<details class="appearance-region" ${index === 0 ? 'open' : ''}>
      <summary><span><strong>${esc(region.label)}</strong><small>${esc(region.hint)}</small></span></summary>
      <div class="appearance-region__fields">
        ${colors.map(([key, label]) => `<label class="appearance-color"><span>${label}</span><input type="color" value="${item[key]}" aria-label="${label} de ${esc(region.label)}" data-appearance-key="${region.key}" data-appearance-prop="${key}" /></label>`).join('')}
        ${[['borderWidth', 'Grosor del borde', 0, 8, 'px'], ['radius', 'Redondeo de bordes', 0, 48, 'px'], ['headingScale', 'Tamaño de títulos', 75, 140, '%'], ['bodyScale', 'Tamaño de textos', 80, 130, '%']].map(([key, label, min, max, unit]) => `<label class="appearance-range"><span>${label}</span><output>${item[key]}${unit}</output><input type="range" min="${min}" max="${max}" step="1" value="${item[key]}" data-appearance-key="${region.key}" data-appearance-prop="${key}" data-unit="${unit}" aria-label="${label} de ${esc(region.label)}" /></label>`).join('')}
        <label class="appearance-select"><span>Tipografía de esta zona</span><select data-appearance-key="${region.key}" data-appearance-prop="font" aria-label="Tipografía de ${esc(region.label)}"><option value="original" ${item.font === 'original' ? 'selected' : ''}>Original del sitio</option><option value="sans" ${item.font === 'sans' ? 'selected' : ''}>Sans serif</option><option value="display" ${item.font === 'display' ? 'selected' : ''}>Display</option><option value="serif" ${item.font === 'serif' ? 'selected' : ''}>Serif</option></select></label>
      </div></details>`;
  }).join('');
}

function updateThemePreview() {
  const frame = $('[data-theme-preview]');
  if (!frame) return;
  try {
    const previewDocument = frame.contentDocument;
    if (previewDocument?.readyState === 'complete' && previewDocument.documentElement) {
      applyAppearance(previewDocument, state.appearance);
      const note = $('[data-preview-status]');
      if (note) note.textContent = 'Vista previa lista. Los ajustes se publican al guardar.';
      return;
    }
  } catch { /* Se reintentará cuando termine la carga del iframe. */ }
  // Algunos navegadores notifican el evento load antes de que el módulo de la portada
  // haya terminado de pintar sus tarjetas; reintentamos para que la previsualización
  // nunca quede en blanco ni omita la apariencia inicial.
  window.setTimeout(() => {
    try {
      const previewDocument = frame.contentDocument;
      if (previewDocument?.readyState === 'complete' && previewDocument.documentElement) {
        applyAppearance(previewDocument, state.appearance);
        const note = $('[data-preview-status]');
        if (note) note.textContent = 'Vista previa lista. Los ajustes se publican al guardar.';
      }
    } catch { /* El mensaje de error se mostrará si el iframe no puede cargarse. */ }
  }, 250);
}

document.querySelector('[data-appearance-controls]').addEventListener('input', (event) => {
  const control = event.target.closest('[data-appearance-key][data-appearance-prop]');
  if (!control) return;
  const { appearanceKey, appearanceProp } = control.dataset;
  const value = ['borderWidth', 'radius', 'headingScale', 'bodyScale'].includes(appearanceProp) ? Number(control.value) : control.value;
  state.appearance[appearanceKey][appearanceProp] = value;
  const output = control.closest('.appearance-range')?.querySelector('output');
  if (output) output.value = `${value}${control.dataset.unit}`;
  updateThemePreview();
  status(`Vista previa actualizada · ${appearanceRegions.find((region) => region.key === appearanceKey)?.label}. Guarda para aplicar el diseño.`);
});

document.querySelector('[data-appearance-controls]').addEventListener('change', (event) => {
  const control = event.target.closest('[data-appearance-key][data-appearance-prop]');
  if (!control) return;
  state.appearance[control.dataset.appearanceKey][control.dataset.appearanceProp] = control.value;
  updateThemePreview();
});

document.querySelector('[data-reset-appearance]').addEventListener('click', () => {
  state.appearance = structuredClone(defaultAppearance);
  renderAppearanceControls();
  updateThemePreview();
  status('Diseño inicial cargado en la vista previa. Guarda los cambios para aplicarlo.');
});

const previewFrame = document.querySelector('[data-theme-preview]');
previewFrame.addEventListener('load', () => {
  updateThemePreview();
  window.setTimeout(updateThemePreview, 500);
});
previewFrame.addEventListener('error', () => {
  const note = $('[data-preview-status]');
  if (note) note.textContent = 'No se pudo cargar la vista previa. Confirma que el sitio esté abierto desde iniciar-sitio.bat y vuelve a cargar el administrador.';
});
window.setTimeout(() => {
  try {
    if (previewFrame.contentDocument?.readyState !== 'complete') {
      const note = $('[data-preview-status]');
      if (note) note.textContent = 'La vista previa tarda en cargar. Comprueba que abriste el administrador desde http://127.0.0.1:8000 y no desde un archivo local.';
    }
  } catch {
    const note = $('[data-preview-status]');
    if (note) note.textContent = 'La vista previa necesita que el sitio y el administrador se abran desde el mismo servidor.';
  }
}, 6000);
document.querySelectorAll('[data-preview-device]').forEach((button) => button.addEventListener('click', () => {
  const mobile = button.dataset.previewDevice === 'mobile';
  $('[data-preview-frame]').classList.toggle('appearance-frame--mobile', mobile);
  $('[data-preview-frame]').classList.toggle('appearance-frame--desktop', !mobile);
  document.querySelectorAll('[data-preview-device]').forEach((deviceButton) => {
    const selected = deviceButton === button;
    deviceButton.classList.toggle('is-active', selected);
    deviceButton.setAttribute('aria-pressed', String(selected));
  });
  $('[data-preview-label]').textContent = mobile ? 'Móvil' : 'Escritorio';
}));

async function initialize() {
  const authResponse = await fetch('/api/auth/status', { credentials: 'same-origin', cache: 'no-store' });
  if (!authResponse.ok) throw new Error('No se pudo comprobar la sesión.');
  const auth = await authResponse.json();
  if (!auth.authenticated) { location.replace('login.html'); return; }
  csrfToken = auth.csrf || '';
  const contentResponse = await fetch('/api/content', { credentials: 'same-origin', cache: 'no-store' });
  if (contentResponse.ok) {
    const saved = await contentResponse.json();
    if (saved?.version === 1 && saved.site && Array.isArray(saved.programs) && Array.isArray(saved.news)) state = { ...structuredClone(defaults), ...saved };
  }
  state.appearance = normalizeAppearance(state.appearance);
  render();
  status('Contenido cargado desde el servidor.');
}

function writeValue(target, value) {
  const scope = target.dataset.scope;
  const key = target.dataset.key;
  if (!scope || !key) return;
  if (scope === 'site') state.site[key] = value;
  else {
    const [indexText, property] = key.split('.');
    const index = Number(indexText);
    if (Number.isInteger(index) && state[scope]?.[index]) state[scope][index][property] = value;
  }
  const preview = document.querySelector(`[data-preview="${scope}:${key}"]`);
  if (preview && isSafeImageUrl(value)) preview.src = value;
  const card = target.closest('.content-card');
  const heading = card?.querySelector('.content-card__head strong');
  if (heading && key.endsWith('.title')) heading.textContent = `${String(Number(key.split('.')[0]) + 1).padStart(2, '0')} · ${value || 'Sin título'}`;
  status('Tienes cambios sin guardar.');
}

function isSafeImageUrl(value) {
  if (/^data:image\/(?:webp|png|jpeg);base64,/i.test(value)) return true;
  try { return new URL(value).protocol === 'https:'; } catch { return false; }
}

document.body.addEventListener('input', (event) => {
  const target = event.target;
  if (!target.matches('[data-scope][data-key]')) return;
  writeValue(target, target.value);
});

async function makeSmallImage(file) {
  if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) throw new Error('Elige una imagen JPG, PNG o WebP.');
  if (file.size > 8 * 1024 * 1024) throw new Error('La imagen supera el máximo de 8 MB.');
  const data = await new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(new Error('No se pudo leer el archivo.'));
    reader.readAsDataURL(file);
  });
  const image = await new Promise((resolve, reject) => {
    const element = new Image();
    element.onload = () => resolve(element);
    element.onerror = () => reject(new Error('El archivo no parece ser una imagen válida.'));
    element.src = data;
  });
  const scale = Math.min(1, 1200 / Math.max(image.naturalWidth, image.naturalHeight));
  const canvas = document.createElement('canvas');
  canvas.width = Math.max(1, Math.round(image.naturalWidth * scale));
  canvas.height = Math.max(1, Math.round(image.naturalHeight * scale));
  canvas.getContext('2d').drawImage(image, 0, 0, canvas.width, canvas.height);
  let encoded = canvas.toDataURL('image/webp', 0.68);
  if (encoded.length > 700_000) {
    const shrink = Math.min(1, 950 / Math.max(canvas.width, canvas.height));
    canvas.width = Math.max(1, Math.round(canvas.width * shrink));
    canvas.height = Math.max(1, Math.round(canvas.height * shrink));
    canvas.getContext('2d').drawImage(image, 0, 0, canvas.width, canvas.height);
    encoded = canvas.toDataURL('image/webp', 0.56);
  }
  if (encoded.length > 700_000) throw new Error('La imagen sigue siendo muy pesada después de reducirla. Elige otra foto.');
  return encoded;
}

document.body.addEventListener('change', async (event) => {
  const input = event.target;
  if (input.matches('[data-program-logo]') && input.files?.[0]) {
    try {
      const file = input.files[0];
      if (!['image/svg+xml', 'image/png', 'image/webp'].includes(file.type) || file.size > 350_000) throw new Error('Usa SVG, PNG o WebP de máximo 350 KB.');
      const data = await new Promise((resolve, reject) => { const reader = new FileReader(); reader.onload = () => resolve(reader.result); reader.onerror = () => reject(new Error('No se pudo leer el logo.')); reader.readAsDataURL(file); });
      const index = Number(input.dataset.programLogo);
      state.programs[index].logo = data;
      const preview = document.querySelector(`[data-logo-preview="${index}"]`);
      if (preview) preview.src = data;
      status('Logo agregado al proyecto. Guarda los cambios para publicarlo.');
    } catch (error) { status(error.message, true); }
    input.value = '';
    return;
  }
  if (input.matches('[data-logo-upload]') && input.files?.[0]) {
    const file = input.files[0];
    if (file.size > 350_000 || (file.type !== 'image/svg+xml' && !file.name.toLowerCase().endsWith('.svg'))) {
      status('El logo debe ser SVG y pesar menos de 350 KB.', true);
      input.value = '';
      return;
    }
    const text = await file.text();
    if (!/^\s*<\?xml[^>]*\?>\s*<svg[\s>]/i.test(text) && !/^\s*<svg[\s>]/i.test(text)) {
      status('No se reconoce un archivo SVG válido.', true);
      input.value = '';
      return;
    }
    state.programs[Number(input.dataset.logoUpload)].logo = `data:image/svg+xml,${encodeURIComponent(text)}`;
    status('Logo SVG agregado al proyecto. Guarda los cambios.');
    input.value = '';
    return;
  }
  if (!input.matches('[data-upload-scope]') || !input.files?.[0]) return;
  try {
    const compressed = await makeSmallImage(input.files[0]);
    writeValue({ dataset: { scope: input.dataset.uploadScope, key: input.dataset.uploadKey }, closest: () => null }, compressed);
    const preview = document.querySelector(`[data-preview="${input.dataset.uploadScope}:${input.dataset.uploadKey}"]`);
    if (preview) preview.src = compressed;
    status('Imagen lista. Guarda los cambios para aplicarla al sitio.');
  } catch (error) { status(error.message, true); }
  input.value = '';
});

function addItem(collection) {
  const next = state[collection].length + 1;
  state[collection].push(collection === 'programs'
    ? { number: String(next).padStart(2, '0'), order: next, status: 'activo', category: '', title: '', description: '', image: '', alt: '', href: '', logo: '' }
    : { category: '', date: '', title: '', description: '', image: '', alt: '', href: '' });
  render();
  status('Elemento nuevo. Completa y guarda los cambios.');
}

document.querySelector('[data-add-program]').addEventListener('click', () => addItem('programs'));
document.querySelector('[data-add-news]').addEventListener('click', () => addItem('news'));
document.querySelector('[data-add-impact]')?.addEventListener('click', () => addItem('impact'));
document.body.addEventListener('click', async (event) => {
  const button = event.target.closest('[data-delete]');
  if (!button) return;
  const collection = button.dataset.delete;
  const index = Number(button.dataset.index);
  state[collection].splice(index, 1);
  render();
  status('Elemento eliminado del borrador. Presiona Guardar cambios para confirmar.');
});

function validateContent(content) {
  if (content.programs.length > 50 || content.news.length > 50) throw new Error('El contenido supera el máximo de 50 elementos por sección.');
  for (const item of [...content.programs, ...content.news]) {
    if (!item.title?.trim() || !item.category?.trim() || !item.image || !item.alt?.trim() || !item.href) throw new Error('Completa el título, categoría, foto, descripción accesible y enlace oficial de cada ficha.');
    if (content.programs.includes(item) && !item.description?.trim()) throw new Error('Cada programa necesita una descripción antes de guardar.');
    if (item.href && !/^https:\/\//i.test(item.href)) throw new Error('Los enlaces deben usar HTTPS.');
    if (item.image && !isSafeImageUrl(item.image)) throw new Error('Las fotos deben usar HTTPS o ser imágenes cargadas aquí.');
    if (item.logo && !(item.logo.startsWith('assets/brand/') || /^data:image\/(?:svg\+xml|png|webp);/i.test(item.logo))) throw new Error('El logo debe ser un SVG oficial, PNG o WebP cargado aquí.');
    for (const [key, value] of Object.entries(item)) {
      if (typeof value === 'string' && ['image', 'logo'].includes(key) && value.startsWith('data:') && value.length > 700_000) throw new Error('Una imagen o logo supera el límite permitido.');
      if (typeof value === 'string' && !['image', 'logo'].includes(key) && value.length > 5000) throw new Error('Un campo de contenido supera el límite permitido.');
    }
  }
  for (const key of Object.keys(siteCopy)) {
    const value = content.site[key];
    if (typeof value !== 'string') throw new Error('Revisa los textos de la portada.');
    if (key.toLowerCase().includes('image')) {
      if (!isSafeImageUrl(value) || (value.startsWith('data:') && value.length > 700_000)) throw new Error('Una foto de portada no cumple los límites permitidos.');
    } else if (value.length > 5000) throw new Error('Un texto de portada supera el límite permitido.');
  }
}

async function save() {
  try {
    validateContent(state);
    if (JSON.stringify(state).length > 4_200_000) throw new Error('El contenido supera el espacio local del navegador. Descarga una copia y reduce el número de fotos cargadas.');
    const response = await fetch('/api/content', { method: 'POST', credentials: 'same-origin', headers: { 'Content-Type': 'application/json', 'X-CSRF-Token': csrfToken }, body: JSON.stringify({ ...state, version: 1 }) });
    if (!response.ok) { const result = await response.json().catch(() => ({})); throw new Error(result.error || 'El servidor no pudo guardar los cambios.'); }
    saveContent(state);
    status(`Guardado en el servidor · ${new Date().toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' })}`);
  } catch (error) { status(`No se pudo guardar: ${error.message}`, true); }
}

document.querySelectorAll('[data-save]').forEach((button) => button.addEventListener('click', save));
document.querySelector('[data-reset]').addEventListener('click', async () => {
  if (!window.confirm('¿Restaurar el contenido inicial? Esto borrará los cambios locales guardados en este navegador.')) return;
  clearSavedContent();
  state = structuredClone(defaults);
  render();
  await save();
  status('Contenido inicial restaurado y guardado en el servidor.');
});

document.querySelector('[data-export]').addEventListener('click', () => {
  const blob = new Blob([JSON.stringify({ ...state, version: 1 }, null, 2)], { type: 'application/json' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = 'caritas-cartagena-contenido.json';
  link.click();
  URL.revokeObjectURL(link.href);
});

document.querySelector('[data-import]').addEventListener('change', async (event) => {
  const file = event.target.files?.[0];
  if (!file) return;
  try {
    if (file.size > 12 * 1024 * 1024) throw new Error('La copia supera el máximo de 12 MB.');
    const imported = JSON.parse(await file.text());
    if (imported.version !== 1 || !imported.site || !Array.isArray(imported.programs) || !Array.isArray(imported.news)) throw new Error('El archivo no tiene el formato de respaldo esperado.');
    validateContent(imported);
    state = { ...imported, appearance: normalizeAppearance(imported.appearance) };
    render();
    status('Copia cargada como borrador. Presiona Guardar cambios para aplicarla.');
  } catch (error) { status(`No se pudo importar: ${error.message}`, true); }
  event.target.value = '';
});

initialize().catch((error) => status(`No se pudo cargar el editor: ${error.message}`, true));



