import { siteCopy, navigationLinks, programs, news, heroSlides, orderedNavigationLinks } from './content.js?v=20261102-4';
import { readSavedContent, saveContent, clearSavedContent } from './store.js?v=20261102-3';
import { appearanceRegions, defaultAppearance, normalizeAppearance, applyAppearance, sectionAnimationOptions, defaultSectionAnimations, normalizeSectionAnimations } from './appearance.js?v=20261102-8';

const defaults = { site: siteCopy, heroSlides, navigationLinks, programs, news, appearance: defaultAppearance, animations: defaultSectionAnimations };
let state = readSavedContent(defaults);
state.site = { ...siteCopy, ...state.site };
state.navigationLinks = orderedNavigationLinks(state.navigationLinks || navigationLinks);
state.heroSlides = Array.isArray(state.heroSlides) && state.heroSlides.length ? state.heroSlides : [{ image: state.site.heroImage || heroSlides[0].image, alt: 'Foto de portada' }, ...structuredClone(heroSlides.slice(1))];
state.animations = normalizeSectionAnimations(state.animations);
let csrfToken = '';
const $ = (selector) => document.querySelector(selector);
const esc = (value) => String(value ?? '').replace(/[&<>"']/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char]);
const status = (message, error = false) => { const el = $('[data-status]'); el.textContent = message; el.classList.toggle('is-error', error); };

const siteFields = [
  ['heroEyebrow', 'Antetítulo de portada', 'text'], ['heroTitle', 'Título principal (usa saltos de línea)', 'textarea'],
  ['heroLead', 'Texto de apoyo de portada', 'textarea'],
  ['introEyebrow', 'Antetítulo de presentación', 'text'], ['introTitle', 'Título de presentación (usa saltos de línea)', 'textarea'],
  ['introBody', 'Texto de presentación', 'textarea'], ['featureEyebrow', 'Antetítulo del Banco de Alimentos', 'text'],
  ['featureTitle', 'Título del Banco (usa saltos de línea)', 'textarea'], ['featureBody', 'Texto del Banco de Alimentos', 'textarea'], ['featureCta', 'Texto del botón del Banco', 'text'], ['featureImage', 'Foto del Banco de Alimentos', 'image'],
  ['whatsappPhone', 'WhatsApp (código de país y número, solo dígitos)', 'text'], ['whatsappMessage', 'Mensaje inicial de WhatsApp', 'textarea']
];

function field(name, label, value, scope, key, type = 'text', wide = false) {
  const wrap = `class="field${wide ? ' field--wide' : ''}"`;
  const attrs = `data-scope="${scope}" data-key="${key}"`;
  if (type === 'textarea') return `<label ${wrap}><span>${esc(label)}</span><textarea ${attrs} maxlength="1200">${esc(value)}</textarea></label>`;
  if (type === 'image') return `<div ${wrap}><span class="upload-label">${esc(label)}</span><div class="image-controls"><label class="field"><span>Dirección HTTPS o ruta local (assets/...)</span><input type="text" placeholder="https://… o assets/brand/logo.svg" value="${esc(value)}" ${attrs} /></label><label class="upload-label">O elegir imagen<input type="file" accept="image/jpeg,image/png,image/webp" data-upload-scope="${scope}" data-upload-key="${key}" /><small>JPG, PNG o WebP · se reduce automáticamente</small></label></div><img class="image-preview" src="${esc(value || 'data:,')}" alt="Vista previa" data-preview="${scope}:${key}" /></div>`;
  return `<label ${wrap}><span>${esc(label)}</span><input type="text" value="${esc(value)}" maxlength="240" ${attrs} /></label>`;
}

function renderSiteFields() {
  $('[data-site-fields]').innerHTML = siteFields.map(([key, label, type]) => field(key, label, state.site[key] ?? '', 'site', key, type, ['heroLead', 'introTitle', 'introBody', 'featureTitle', 'featureBody'].includes(key))).join('');
  const seconds = $('[data-hero-seconds]');
  if (seconds) seconds.value = state.site.heroSlideSeconds || '6';
}

function renderHeroSlides() {
  const target = $('[data-hero-slide-fields]');
  if (!target) return;
  target.innerHTML = state.heroSlides.map((slide, index) => `<article class="content-card" data-hero-slide-card="${index}"><div class="content-card__head"><strong>Foto ${String(index + 1).padStart(2, '0')}</strong><button class="delete-item" type="button" data-delete="heroSlides" data-index="${index}">Eliminar foto</button></div><div class="content-card__fields">${field('image', 'Imagen', slide.image || '', 'heroSlides', `${index}.image`, 'image', true)}${field('alt', 'Descripción de la foto', slide.alt || '', 'heroSlides', `${index}.alt`, 'text', true)}</div></article>`).join('');
}

function renderHeaderFields() {
  $('[data-header-fields]').innerHTML = [
    field('headerLogo', 'Logotipo del encabezado', state.site.headerLogo ?? '', 'site', 'headerLogo', 'image', true),
    field('headerCta', 'Texto del botón principal', state.site.headerCta ?? '', 'site', 'headerCta')
  ].join('');
}

function renderNavigationFields() {
  $('[data-navigation-fields]').innerHTML = state.navigationLinks.map((item, index) => `<article class="content-card navigation-card" data-navigation-item="${index}">
    <div class="content-card__head"><strong>Enlace ${String(index + 1).padStart(2, '0')}</strong><button class="delete-item" type="button" data-delete="navigationLinks" data-index="${index}">Eliminar enlace</button></div>
    <div class="content-card__fields">${field('label', 'Texto visible', item.label, 'navigationLinks', `${index}.label`)}${field('href', 'Destino (por ejemplo #nosotros)', item.href, 'navigationLinks', `${index}.href`)}</div>
  </article>`).join('');
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
  renderHeaderFields();
  renderNavigationFields();
  renderSiteFields();
  renderHeroSlides();
  renderCards('programs', $('[data-program-fields]'));
  renderCards('news', $('[data-news-fields]'));
  renderAppearanceControls();
  $('[data-program-count]').textContent = `(${state.programs.length})`;
  updateThemePreview();
  updateAnimationPreview();
  updatePreviewContent();
}

function renderAppearanceControls() {
  const target = $('[data-appearance-controls]');
  target.innerHTML = appearanceRegions.map((region, index) => {
    const item = state.appearance[region.key];
    const colors = [['background', 'Fondo'], ['text', 'Texto'], ['accent', 'Acento'], ['border', 'Borde']];
    return `<details class="appearance-region" data-appearance-region="${region.key}" ${index === 0 ? 'open' : ''}>
      <summary><span><strong>${esc(region.label)}</strong><small>${esc(region.hint)}</small></span></summary>
      <div class="appearance-region__fields">
        ${colors.map(([key, label]) => `<label class="appearance-color"><span>${label}</span><input type="color" value="${item[key]}" aria-label="${label} de ${esc(region.label)}" data-appearance-key="${region.key}" data-appearance-prop="${key}" /></label>`).join('')}
        ${[['borderWidth', 'Grosor del borde', 0, 8, 'px'], ['radius', 'Redondeo de bordes', 0, 48, 'px'], ['headingScale', 'Tamaño de títulos', 75, 140, '%'], ['bodyScale', 'Tamaño de textos', 80, 130, '%'], ...(['hero', 'intro', 'values', 'projects', 'impact', 'collaborate', 'news', 'transparency', 'footer'].includes(region.key) ? [['spacing', 'Espacio vertical', 75, 130, '%']] : [])].map(([key, label, min, max, unit]) => `<label class="appearance-range"><span>${label}</span><output>${item[key]}${unit}</output><input type="range" min="${min}" max="${max}" step="1" value="${item[key]}" data-appearance-key="${region.key}" data-appearance-prop="${key}" data-unit="${unit}" aria-label="${label} de ${esc(region.label)}" /></label>`).join('')}
        <label class="appearance-select"><span>Tipografía de esta zona</span><select data-appearance-key="${region.key}" data-appearance-prop="font" aria-label="Tipografía de ${esc(region.label)}"><option value="original" ${item.font === 'original' ? 'selected' : ''}>Original del sitio</option><option value="sans" ${item.font === 'sans' ? 'selected' : ''}>Sans serif</option><option value="display" ${item.font === 'display' ? 'selected' : ''}>Display</option><option value="serif" ${item.font === 'serif' ? 'selected' : ''}>Serif</option></select></label>
        <div class="section-animation-controls"><strong>Animación al aparecer al desplazarte</strong><small>El efecto se reproduce una vez cuando esta zona entra en pantalla.</small><label class="appearance-select"><span>Efecto (${sectionAnimationOptions.length} opciones)</span><select data-animation-key="${region.key}" data-animation-prop="effect" aria-label="Animación de ${esc(region.label)}">${sectionAnimationOptions.map((option) => `<option value="${option.value}" ${state.animations[region.key].effect === option.value ? 'selected' : ''}>${esc(option.label)}</option>`).join('')}</select></label><div class="section-animation-ranges"><label class="appearance-range"><span>Duración</span><output>${(state.animations[region.key].duration / 1000).toFixed(1)} s</output><input type="range" min="300" max="2400" step="100" value="${state.animations[region.key].duration}" data-animation-key="${region.key}" data-animation-prop="duration" aria-label="Duración de la animación de ${esc(region.label)}" /></label><label class="appearance-range"><span>Retraso</span><output>${(state.animations[region.key].delay / 1000).toFixed(1)} s</output><input type="range" min="0" max="1500" step="100" value="${state.animations[region.key].delay}" data-animation-key="${region.key}" data-animation-prop="delay" aria-label="Retraso de la animación de ${esc(region.label)}" /></label></div></div>
      </div></details>`;
  }).join('');
}

// Panel tipo editor maestro: conserva la estructura original y expone controles por zona.
const toolTabs = document.querySelectorAll('[data-tool-tab]');
const canvasTools = document.querySelector('[data-canvas-tools]');
function showEditorTool(name) {
  toolTabs.forEach((tab) => tab.classList.toggle('is-active', tab.dataset.toolTab === name));
  const appearance = document.querySelector('[data-appearance-controls]');
  appearance.hidden = name !== 'sections' && name !== 'style' && name !== 'layout';
  canvasTools.hidden = name !== 'content';
  if (name === 'content') {
    canvasTools.innerHTML = `<label class="field"><span>Editar contenido</span><select data-canvas-section><option value="heroTitle">Título principal</option><option value="heroLead">Texto de portada</option><option value="heroEyebrow">Antetítulo</option><option value="introTitle">Título de presentación</option><option value="introBody">Texto de presentación</option><option value="featureTitle">Título Banco de Alimentos</option><option value="featureBody">Texto Banco de Alimentos</option></select></label><label class="field"><span>Texto</span><textarea data-canvas-text rows="4"></textarea></label><p>Para cambiar imágenes, usa los campos de imagen en Portada y textos principales o en la ficha del proyecto.</p><button type="button" class="button button--secondary" data-apply-canvas>Aplicar al lienzo</button>`;
    const select=canvasTools.querySelector('[data-canvas-section]'), input=canvasTools.querySelector('[data-canvas-text]');
    const sync=()=>{input.value=state.site[select.value]||''}; select.addEventListener('change',sync); sync();
    canvasTools.querySelector('[data-apply-canvas]').addEventListener('click',()=>{state.site[select.value]=input.value;renderSiteFields();updateThemePreview();updatePreviewContent();status('Contenido aplicado a la vista previa. Guarda para conservarlo.');});
  }
}
toolTabs.forEach((tab)=>tab.addEventListener('click',()=>showEditorTool(tab.dataset.toolTab)));

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

function updateAnimationPreview() {
  try { $('[data-theme-preview]')?.contentWindow?.caritasApplySectionAnimations?.(state.animations); }
  catch { /* Se aplicará cuando termine de cargar la vista previa. */ }
}

document.querySelector('[data-appearance-controls]').addEventListener('input', (event) => {
  const control = event.target.closest('[data-animation-key][data-animation-prop]');
  if (!control || control.dataset.animationProp === 'effect') return;
  const value = Number(control.value);
  state.animations[control.dataset.animationKey][control.dataset.animationProp] = value;
  const output = control.closest('.appearance-range')?.querySelector('output');
  if (output) output.value = `${(value / 1000).toFixed(1)} s`;
});
document.querySelector('[data-appearance-controls]').addEventListener('change', (event) => {
  const control = event.target.closest('[data-animation-key][data-animation-prop]');
  if (!control) return;
  const prop = control.dataset.animationProp;
  state.animations[control.dataset.animationKey][prop] = prop === 'effect' ? control.value : Number(control.value);
  updateAnimationPreview();
  const region = appearanceRegions.find((item) => item.key === control.dataset.animationKey);
  status(`Animación actualizada · ${region?.label}. Guarda para aplicarla.`);
});

document.querySelector('[data-appearance-controls]').addEventListener('input', (event) => {
  const control = event.target.closest('[data-appearance-key][data-appearance-prop]');
  if (!control) return;
  const { appearanceKey, appearanceProp } = control.dataset;
  const value = ['borderWidth', 'radius', 'headingScale', 'bodyScale', 'spacing'].includes(appearanceProp) ? Number(control.value) : control.value;
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
  state.animations = structuredClone(defaultSectionAnimations);
  renderAppearanceControls();
  updateThemePreview();
  updateAnimationPreview();
  status('Diseño inicial cargado en la vista previa. Guarda los cambios para aplicarlo.');
});

const previewFrame = document.querySelector('[data-theme-preview]');
// Usa el mismo origen exacto del administrador (127.0.0.1 vs localhost son
// orígenes distintos para el navegador, aunque apunten al mismo equipo).
previewFrame.src = new URL('/', window.location.href).href;

const previewRegionSelectors = {
  header: '.topline, .site-header', hero: '.hero', intro: '.intro', values: '.values-band',
  projects: '.program-card, .programs', impact: '.impact-card, .impact', bank: '.feature',
  collaborate: '.collab-card, .collaborate', news: '.news-card, .news',
  transparency: '.transparency', footer: '.footer', whatsapp: '.whatsapp-float'
};

function focusAppearanceRegion(region) {
  if (!region) return false;
  showEditorTool('sections');
  const regions = document.querySelectorAll('[data-appearance-region]');
  const selected = [...regions].find((item) => item.dataset.appearanceRegion === region.key);
  regions.forEach((item) => { item.open = item === selected; });
  selected?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  status(`Se abrió el diseño de ${region.label}.`);
  return Boolean(selected);
}

function focusContentField(key) {
  const select = canvasTools.querySelector('[data-canvas-section]');
  if (select && [...select.options].some((option) => option.value === key)) {
    showEditorTool('content');
    const activeSelect = canvasTools.querySelector('[data-canvas-section]');
    activeSelect.value = key;
    activeSelect.dispatchEvent(new Event('change'));
    canvasTools.querySelector('[data-canvas-text]')?.focus({ preventScroll: true });
    canvasTools.scrollIntoView({ behavior: 'smooth', block: 'center' });
    status('Se abrió la edición del texto seleccionado.');
    return true;
  }
  const field = document.querySelector(`[data-scope="site"][data-key="${key}"]`);
  if (!field) return false;
  field.closest('.field')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  field.focus({ preventScroll: true });
  status('Se abrió el campo correspondiente a la selección.');
  return true;
}

function focusContentCard(collection, title) {
  const index = state[collection]?.findIndex((item) => item.title === title) ?? -1;
  if (index < 0) return false;
  const card = document.querySelector(`[data-card="${collection}"][data-index="${index}"]`);
  if (!card) return false;
  card.scrollIntoView({ behavior: 'smooth', block: 'center' });
  card.classList.add('preview-edit-target');
  window.setTimeout(() => card.classList.remove('preview-edit-target'), 1800);
  card.querySelector('[data-key$=".title"]')?.focus({ preventScroll: true });
  status(`Se abrió la ficha de ${title}.`);
  return true;
}

function focusNavigationItem(index) {
  const card = document.querySelector(`[data-navigation-item="${index}"]`);
  const field = card?.querySelector(`[data-key="${index}.label"]`);
  if (!card || !field) return false;
  card.scrollIntoView({ behavior: 'smooth', block: 'center' });
  field.focus({ preventScroll: true });
  card.classList.add('preview-edit-target');
  window.setTimeout(() => card.classList.remove('preview-edit-target'), 1800);
  status('Se abrió el enlace seleccionado del encabezado.');
  return true;
}

function safeNavigationHref(value) {
  if (typeof value === 'string' && /^#[A-Za-z][\w-]*$/.test(value)) return value;
  try { const url = new URL(value); return url.protocol === 'https:' ? url.href : '#'; } catch { return '#'; }
}

function updatePreviewContent() {
  try {
    const doc = previewFrame.contentDocument;
    if (!doc?.documentElement) return;
    for (const node of doc.querySelectorAll('[data-content]')) {
      const value = state.site[node.dataset.content];
      if (typeof value === 'string') node.textContent = value;
    }
    for (const image of doc.querySelectorAll('[data-image]')) {
      const value = state.site[image.dataset.image];
      if (typeof value === 'string' && isSafeImageUrl(value)) image.src = value;
    }
    const previewNav = doc.querySelector('[data-navigation-links]');
    if (previewNav) previewNav.innerHTML = `${state.navigationLinks.map((item, index) => `<a href="${safeNavigationHref(item.href)}" data-navigation-index="${index}">${esc(item.label)}</a>`).join('')}<a class="button button--small button--dark" href="#colabora" data-content="headerCta">${esc(state.site.headerCta || 'Haz tu aporte')} <span aria-hidden="true">↗</span></a>`;
    doc.defaultView.caritasRenderProgramCards?.(state.programs);
    const whatsapp = doc.querySelector('[data-whatsapp-link]');
    const phone = String(state.site.whatsappPhone || '').replace(/\D/g, '');
    if (whatsapp) {
      whatsapp.hidden = phone.length < 10 || phone.length > 15;
      if (!whatsapp.hidden) whatsapp.href = `https://wa.me/${phone}?text=${encodeURIComponent(state.site.whatsappMessage || '')}`;
    }
    doc.defaultView.caritasRenderHeroCarousel?.(state.heroSlides, state.site.heroSlideSeconds);
  } catch { /* La vista previa puede terminar de cargar después de esta actualización. */ }
}

const previewPanel = document.querySelector('.appearance-preview-panel');
const previewExpandButton = document.querySelector('[data-preview-expand]');
function setPreviewExpanded(expanded) {
  previewPanel.classList.toggle('preview-is-expanded', expanded);
  document.body.classList.toggle('preview-expanded', expanded);
  previewExpandButton.textContent = expanded ? 'Cerrar vista ampliada' : 'Ampliar';
  previewExpandButton.setAttribute('aria-expanded', String(expanded));
}
previewExpandButton.addEventListener('click', () => setPreviewExpanded(!previewPanel.classList.contains('preview-is-expanded')));
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && previewPanel.classList.contains('preview-is-expanded')) setPreviewExpanded(false);
});

previewFrame.addEventListener('load', () => {
  updateThemePreview();
  updateAnimationPreview();
  updatePreviewContent();
  window.setTimeout(() => { updateThemePreview(); updateAnimationPreview(); updatePreviewContent(); }, 500);
  try {
    const doc = previewFrame.contentDocument;
    if (!doc || doc.documentElement.dataset.editorClickBound) return;
    doc.documentElement.dataset.editorClickBound = 'true';
    const clickStyle = doc.createElement('style');
    clickStyle.textContent = '[data-navigation-index],[data-content],[data-image],.program-card,.news-card,.impact-card,.collab-card,.topline,.site-header,.hero,.intro,.values-band,.programs,.impact,.feature,.collaborate,.news,.transparency,.footer,.whatsapp-float{cursor:crosshair!important}[data-navigation-index]:hover,[data-content]:hover,[data-image]:hover,.program-card:hover,.news-card:hover,.impact-card:hover,.collab-card:hover,.site-header:hover,.hero:hover,.intro:hover,.values-band:hover,.programs:hover,.impact:hover,.feature:hover,.collaborate:hover,.news:hover,.transparency:hover,.footer:hover,.whatsapp-float:hover{outline:2px dashed #ef7625!important;outline-offset:-3px}';
    doc.head.append(clickStyle);
    doc.addEventListener('click', (event) => {
      const target = event.target.closest('[data-navigation-index], [data-content], [data-image], [data-hero-slide-index], .program-card, .news-card, .impact-card, .collab-card, .topline, .site-header, .hero, .intro, .values-band, .programs, .impact, .feature, .collaborate, .news, .transparency, .footer, .whatsapp-float');
      if (!target) return;
      if (event.target.closest('[data-hero-previous], [data-hero-next]')) return;
      event.preventDefault();
      event.stopPropagation();
      const navLink = event.target.closest('[data-navigation-index]');
      if (navLink && focusNavigationItem(Number(navLink.dataset.navigationIndex))) return;
      const heroImage = event.target.closest('[data-hero-slide-index]');
      if (heroImage) {
        const card = document.querySelector(`[data-hero-slide-card="${Number(heroImage.dataset.heroSlideIndex)}"]`);
        card?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        card?.classList.add('preview-edit-target');
        window.setTimeout(() => card?.classList.remove('preview-edit-target'), 1800);
        card?.querySelector('[data-scope="heroSlides"][data-key$=".image"]')?.focus({ preventScroll: true });
        status('Se abrió la foto seleccionada de la portada.');
        return;
      }
      const content = event.target.closest('[data-content], [data-image]');
      const contentKey = content?.dataset.content || content?.dataset.image;
      if (contentKey && focusContentField(contentKey)) return;

      const programCard = target.closest('.program-card');
      if (programCard) {
        const title = programCard.querySelector('h3 a')?.textContent.trim();
        if (title && focusContentCard('programs', title)) return;
      }
      const newsCard = target.closest('.news-card');
      if (newsCard) {
        const title = newsCard.querySelector('h3 a')?.textContent.trim();
        if (title && focusContentCard('news', title)) return;
      }

      let node = target;
      let region = null;
      while (node && node !== doc.body && !region) {
        region = appearanceRegions.find((item) => (previewRegionSelectors[item.key] || item.areas).split(',').some((selector) => node.matches(selector.trim())));
        node = node.parentElement;
      }
      focusAppearanceRegion(region);
    }, true);
  } catch { /* La vista previa seguirá disponible aunque no admita selección directa. */ }
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
    if (saved?.version === 1 && saved.site && Array.isArray(saved.programs) && Array.isArray(saved.news)) state = {
      ...structuredClone(defaults), ...saved,
      site: { ...siteCopy, ...saved.site },
      heroSlides: Array.isArray(saved.heroSlides) && saved.heroSlides.length ? saved.heroSlides : [{ image: saved.site.heroImage || siteCopy.heroImage, alt: 'Foto de portada' }, ...structuredClone(heroSlides.slice(1))],
      navigationLinks: orderedNavigationLinks(saved.navigationLinks || navigationLinks),
      animations: normalizeSectionAnimations(saved.animations)
    };
  }
  state.appearance = normalizeAppearance(state.appearance);
  state.animations = normalizeSectionAnimations(state.animations);
  render();
  updatePreviewContent();
  const editors = document.querySelector('.legacy-editors');
  if (editors) editors.hidden = false;
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
  updatePreviewContent();
  const card = target.closest('.content-card');
  const heading = card?.querySelector('.content-card__head strong');
  if (heading && key.endsWith('.title')) heading.textContent = `${String(Number(key.split('.')[0]) + 1).padStart(2, '0')} · ${value || 'Sin título'}`;
  status('Tienes cambios sin guardar.');
}

function isSafeImageUrl(value) {
  if (/^data:image\/(?:svg\+xml|webp|png|jpeg);(?:base64,|charset=utf-8,)/i.test(value)) return true;
  if (/^assets\/(?!.*\.\.)(?:[a-z0-9._/-]+)$/i.test(value)) return true;
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
document.querySelector('[data-add-hero-slide]').addEventListener('click', () => {
  if (state.heroSlides.length >= 10) { status('La portada admite hasta 10 fotos.', true); return; }
  state.heroSlides.push({ image: '', alt: '' });
  renderHeroSlides();
  status('Foto agregada al carrusel. Completa la imagen y su descripción.');
});
document.querySelector('[data-add-navigation]').addEventListener('click', () => {
  state.navigationLinks.push({ label: 'Nuevo enlace', href: '#inicio' });
  renderNavigationFields();
  updatePreviewContent();
  status('Enlace agregado al borrador. Completa el texto y el destino.');
});
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
  if (!Array.isArray(content.heroSlides) || content.heroSlides.length < 1 || content.heroSlides.length > 10) throw new Error('El carrusel debe tener entre 1 y 10 fotos.');
  const seconds = Number(content.site.heroSlideSeconds);
  if (!Number.isInteger(seconds) || seconds < 2 || seconds > 30) throw new Error('El intervalo del carrusel debe ser un número entero entre 2 y 30 segundos.');
  for (const slide of content.heroSlides) {
    if (!slide.image || !isSafeImageUrl(slide.image) || !slide.alt?.trim()) throw new Error('Cada foto de portada debe incluir una imagen válida y una descripción accesible.');
    if (slide.image.startsWith('data:') && slide.image.length > 700_000) throw new Error('Una foto de portada supera el límite permitido.');
  }
  if (content.programs.length > 50 || content.news.length > 50) throw new Error('El contenido supera el máximo de 50 elementos por sección.');
  if (!Array.isArray(content.navigationLinks) || content.navigationLinks.length > 8) throw new Error('La navegación puede tener hasta 8 enlaces.');
  for (const item of content.navigationLinks) {
    if (!item.label?.trim() || !item.href?.trim()) throw new Error('Completa el texto y destino de cada enlace del encabezado.');
    if (!/^#[A-Za-z][\w-]*$/.test(item.href) && !/^https:\/\//i.test(item.href)) throw new Error('Los destinos de navegación deben ser anclas internas o enlaces HTTPS.');
  }
  const whatsappPhone = String(content.site.whatsappPhone || '').replace(/\D/g, '');
  if (whatsappPhone.length < 10 || whatsappPhone.length > 15) throw new Error('El teléfono de WhatsApp debe incluir el código de país y tener entre 10 y 15 dígitos.');
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
    if (key.toLowerCase().includes('image') || key === 'headerLogo') {
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
    const normalizedImport = {
      ...structuredClone(defaults), ...imported,
      site: { ...siteCopy, ...imported.site },
      heroSlides: Array.isArray(imported.heroSlides) && imported.heroSlides.length ? imported.heroSlides : [{ image: imported.site.heroImage || siteCopy.heroImage, alt: 'Foto de portada' }, ...structuredClone(heroSlides.slice(1))],
      navigationLinks: orderedNavigationLinks(imported.navigationLinks || navigationLinks)
    };
    validateContent(normalizedImport);
    state = { ...normalizedImport, appearance: normalizeAppearance(imported.appearance), animations: normalizeSectionAnimations(imported.animations) };
    render();
    status('Copia cargada como borrador. Presiona Guardar cambios para aplicarla.');
  } catch (error) { status(`No se pudo importar: ${error.message}`, true); }
  event.target.value = '';
});

initialize().catch((error) => status(`No se pudo cargar el editor: ${error.message}`, true));



