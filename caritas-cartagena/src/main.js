import { programs, news, siteCopy, impact } from './content.js';
import { readSavedContent } from './store.js';
import { defaultAppearance, normalizeAppearance, applyAppearance } from './appearance.js';

const content = readSavedContent({ site: siteCopy, programs, news, impact });

const escapeHTML = (value) => String(value).replace(/[&<>"']/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char]);
const safeExternal = (value) => {
  try { const url = new URL(value); return ['https:', 'http:'].includes(url.protocol) ? url.href : '#'; }
  catch { return '#'; }
};
const safeImage = (value) => {
  if (/^data:image\/(?:svg\+xml|webp|png|jpeg);(?:base64,|charset=utf-8,)/i.test(value)) return value;
  try { return new URL(value).protocol === 'https:' ? value : '#'; } catch { return '#'; }
};
const imageFallbacks = ['assets/images/comunidad.svg', 'assets/images/alimentos.svg', 'assets/images/esperanza.svg'];
function addImageFallback(image, fallback) {
  image.addEventListener('error', () => {
    if (image.dataset.fallbackApplied) return;
    image.dataset.fallbackApplied = 'true';
    image.src = fallback;
  }, { once: true });
}

for (const [key, value] of Object.entries(content.site)) {
  const node = [...document.querySelectorAll('[data-content]')].find((candidate) => candidate.dataset.content === key);
  if (node && typeof value === 'string') node.textContent = value;
}
for (const img of document.querySelectorAll('[data-image]')) {
  const imageUrl = content.site[img.dataset.image];
  if (typeof imageUrl === 'string') {
    addImageFallback(img, img.dataset.image === 'featureImage' ? imageFallbacks[1] : imageFallbacks[0]);
    img.src = safeImage(imageUrl);
  }
}

const programGrid = document.querySelector('[data-program-grid]');
if (programGrid) {
  programGrid.innerHTML = content.programs.filter((item) => item.status !== 'inactivo').sort((a,b) => Number(a.order ?? a.number ?? 999) - Number(b.order ?? b.number ?? 999)).map((item, index) => `
    <article class="program-card">
      <a class="program-card__image" href="${safeExternal(item.href)}" target="_blank" rel="noopener noreferrer" aria-label="Conocer ${escapeHTML(item.title)} en su sitio oficial">
        <img src="${safeImage(item.image)}" alt="${escapeHTML(item.alt)}" loading="lazy" width="900" height="650" />
        <span class="program-card__arrow" aria-hidden="true">↗</span>
      </a>
      <div class="program-card__meta"><span>${escapeHTML(item.category)}</span><span>${escapeHTML(item.number)}</span></div>
      <h3>${item.logo ? `<img class="program-card__logo" src="${safeImage(item.logo)}" alt="Logo de ${escapeHTML(item.title)}" loading="lazy" />` : ''}<a href="${safeExternal(item.href)}" target="_blank" rel="noopener noreferrer">${escapeHTML(item.title)}</a></h3>
      <p>${escapeHTML(item.description)}</p>
      <a class="program-card__discover" href="${safeExternal(item.href)}" target="_blank" rel="noopener noreferrer">Conoce el proyecto <span aria-hidden="true">↗</span></a>
    </article>`).join('');
  programGrid.querySelectorAll('.program-card__image img').forEach((image, index) => addImageFallback(image, imageFallbacks[index % imageFallbacks.length]));
}

const impactGrid = document.querySelector('[data-impact-grid]');
if (impactGrid) impactGrid.innerHTML = (content.impact || impact).map((item) => `<article class="impact-card"><strong>${escapeHTML(item.value)}</strong><span>${escapeHTML(item.label)}</span><small>${escapeHTML(item.period)} · <a href="${safeExternal(item.source)}" target="_blank" rel="noopener noreferrer">Fuente ↗</a></small></article>`).join('');

const newsGrid = document.querySelector('[data-news-grid]');
if (newsGrid) {
  newsGrid.innerHTML = content.news.map((item) => `
    <article class="news-card"><a class="news-card__image" href="${safeExternal(item.href)}" target="_blank" rel="noopener noreferrer" aria-label="Consultar ${escapeHTML(item.category)} en su canal oficial"><img src="${safeImage(item.image)}" alt="${escapeHTML(item.alt)}" loading="lazy" width="1000" height="680" /><span aria-hidden="true">↗</span></a><div class="news-card__meta"><span>${escapeHTML(item.category)}</span><span>${escapeHTML(item.date)}</span></div><h3><a href="${safeExternal(item.href)}" target="_blank" rel="noopener noreferrer">${escapeHTML(item.title)}</a></h3>${item.description ? `<p class="news-card__description">${escapeHTML(item.description)}</p>` : ''}</article>`).join('');
  newsGrid.querySelectorAll('.news-card__image img').forEach((image, index) => addImageFallback(image, imageFallbacks[(index + 1) % imageFallbacks.length]));
}

const toggle = document.querySelector('.menu-toggle');
const nav = document.querySelector('#site-nav');
toggle?.addEventListener('click', () => {
  const expanded = toggle.getAttribute('aria-expanded') === 'true';
  toggle.setAttribute('aria-expanded', String(!expanded));
  toggle.querySelector('.sr-only').textContent = expanded ? 'Abrir menú' : 'Cerrar menú';
  nav?.classList.toggle('nav--open', !expanded);
});
nav?.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => {
  nav.classList.remove('nav--open');
  toggle?.setAttribute('aria-expanded', 'false');
  const label = toggle?.querySelector('.sr-only');
  if (label) label.textContent = 'Abrir menú';
}));

document.querySelector('[data-year]').textContent = new Date().getFullYear();
applyAppearance(document, normalizeAppearance(content.appearance || defaultAppearance));
