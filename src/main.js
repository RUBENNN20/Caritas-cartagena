import { programs, news, siteCopy, navigationLinks, impact, heroSlides, orderedNavigationLinks } from './content.js?v=20261102-4';
import { readSavedContent } from './store.js?v=20261102-3';
import { defaultAppearance, normalizeAppearance, applyAppearance, normalizeSectionAnimations, applySectionAnimations } from './appearance.js?v=20261102-8';

const content = readSavedContent({ site: siteCopy, navigationLinks, programs, news, impact });
try {
  const response = await fetch('/api/content', { cache: 'no-store' });
  if (response.ok) {
    const saved = await response.json();
    if (saved?.version === 1 && saved.site && Array.isArray(saved.programs) && Array.isArray(saved.news)) Object.assign(content, saved);
  }
} catch { /* El sitio también puede abrirse en un alojamiento estático sin API local. */ }
content.site = { ...siteCopy, ...content.site };
content.navigationLinks = orderedNavigationLinks(content.navigationLinks || navigationLinks);
content.heroSlides = Array.isArray(content.heroSlides) && content.heroSlides.length ? content.heroSlides : [{ image: content.site.heroImage || heroSlides[0].image, alt: 'Imagen de portada' }, ...heroSlides.slice(1)];

const escapeHTML = (value) => String(value).replace(/[&<>"']/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char]);
const safeExternal = (value) => {
  try { const url = new URL(value); return ['https:', 'http:'].includes(url.protocol) ? url.href : '#'; }
  catch { return '#'; }
};
const safeImage = (value) => {
  if (/^data:image\/(?:svg\+xml|webp|png|jpeg);(?:base64,|charset=utf-8,)/i.test(value)) return value;
  if (/^assets\/(?!.*\.\.)(?:[a-z0-9._/-]+)$/i.test(value)) return value;
  try { return new URL(value).protocol === 'https:' ? value : '#'; } catch { return '#'; }
};
const safeNavigationHref = (value) => {
  if (typeof value === 'string' && /^#[A-Za-z][\w-]*$/.test(value)) return value;
  try { const url = new URL(value); return url.protocol === 'https:' ? url.href : '#'; } catch { return '#'; }
};

const nav = document.querySelector('[data-navigation-links]');
if (nav) {
  nav.innerHTML = `${content.navigationLinks.map((item, index) => `<a href="${safeNavigationHref(item.href)}" data-navigation-index="${index}">${escapeHTML(item.label || '')}</a>`).join('')}<a class="button button--small button--dark" href="#colabora" data-content="headerCta">${escapeHTML(content.site.headerCta || 'Haz tu aporte')} <span aria-hidden="true">↗</span></a>`;
}
const whatsappLink = document.querySelector('[data-whatsapp-link]');
if (whatsappLink) {
  const phone = String(content.site.whatsappPhone || '').replace(/\D/g, '');
  if (phone.length >= 10 && phone.length <= 15) {
    whatsappLink.href = `https://wa.me/${phone}?text=${encodeURIComponent(content.site.whatsappMessage || '')}`;
    whatsappLink.hidden = false;
  } else whatsappLink.hidden = true;
}
const imageFallbacks = ['assets/images/comunidad.svg', 'assets/images/alimentos.svg', 'assets/images/esperanza.svg'];
function addImageFallback(image, fallback) {
  image.addEventListener('error', () => {
    if (image.dataset.fallbackApplied) return;
    image.dataset.fallbackApplied = 'true';
    image.src = fallback;
  }, { once: true });
}

const heroCarouselState = { timer: 0, transitionTimer: 0, index: 0, signature: '', seconds: 6, reducedMotion: false };
window.caritasHeroStep = (delta) => {
  const images = [...document.querySelectorAll('[data-hero-carousel] .hero-slide')];
  if (!images.length) return;
  const previousIndex = heroCarouselState.index;
  const nextIndex = (previousIndex + delta + images.length) % images.length;
  if (nextIndex === previousIndex) return;
  const previous = images[previousIndex];
  const next = images[nextIndex];
  clearTimeout(heroCarouselState.transitionTimer);
  previous.classList.remove('is-active', 'is-entering-right');
  previous.classList.add('is-leaving-left');
  next.classList.remove('is-entering-right', 'is-leaving-left');
  void next.offsetWidth;
  next.classList.add('is-active');
  heroCarouselState.index = nextIndex;
  heroCarouselState.transitionTimer = window.setTimeout(() => {
    previous.classList.remove('is-leaving-left');
    previous.classList.add('is-entering-right');
  }, 950);
  const current = document.querySelector('[data-hero-current]');
  if (current) current.textContent = String(heroCarouselState.index + 1).padStart(2, '0');
};
window.caritasHeroRestart = () => {
  clearInterval(heroCarouselState.timer);
  if (!heroCarouselState.reducedMotion && document.querySelectorAll('[data-hero-carousel] .hero-slide').length > 1) {
    heroCarouselState.timer = window.setInterval(() => window.caritasHeroStep(1), heroCarouselState.seconds * 1000);
  }
};
function renderHeroCarousel(slides, seconds) {
  const root = document.querySelector('[data-hero-carousel]');
  if (!root) return;
  const validSlides = (Array.isArray(slides) ? slides : []).filter((slide) => slide?.image && safeImage(slide.image) !== '#');
  if (!validSlides.length) return;
  const interval = Math.max(2, Math.min(30, Number(seconds) || 6));
  const signature = JSON.stringify([validSlides, interval]);
  if (signature === heroCarouselState.signature) return;
  heroCarouselState.signature = signature;
  heroCarouselState.seconds = interval;
  heroCarouselState.reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  clearInterval(heroCarouselState.timer);
  heroCarouselState.index = 0;
  root.querySelectorAll('.hero-slide').forEach((image) => image.remove());
  validSlides.forEach((slide, index) => {
    const image = document.createElement('img');
    image.className = `hero-slide${index === 0 ? ' is-active' : ' is-entering-right'}`;
    image.dataset.heroSlideIndex = String(index);
    image.src = safeImage(slide.image);
    image.alt = slide.alt || `Foto ${index + 1} de portada`;
    image.fetchPriority = index === 0 ? 'high' : 'auto';
    if (index > 0) image.loading = 'lazy';
    addImageFallback(image, imageFallbacks[index % imageFallbacks.length]);
    root.insertBefore(image, root.querySelector('.hero-carousel-overlay'));
  });
  const current = document.querySelector('[data-hero-current]');
  const count = document.querySelector('[data-hero-count]');
  const controls = document.querySelector('[data-hero-carousel-controls]');
  if (count) count.textContent = String(validSlides.length).padStart(2, '0');
  if (controls) controls.hidden = validSlides.length < 2;
  const previous = document.querySelector('[data-hero-previous]');
  const next = document.querySelector('[data-hero-next]');
  if (previous && !previous.dataset.bound) { previous.dataset.bound = 'true'; previous.addEventListener('click', () => { window.caritasHeroStep(-1); window.caritasHeroRestart(); }); }
  if (next && !next.dataset.bound) { next.dataset.bound = 'true'; next.addEventListener('click', () => { window.caritasHeroStep(1); window.caritasHeroRestart(); }); }
  window.caritasHeroRestart();
}
window.caritasRenderHeroCarousel = renderHeroCarousel;
renderHeroCarousel(content.heroSlides, content.site.heroSlideSeconds);

for (const [key, value] of Object.entries(content.site)) {
  const node = [...document.querySelectorAll('[data-content]')].find((candidate) => candidate.dataset.content === key);
  if (node && typeof value === 'string') node.innerHTML = key === 'headerCta' ? `${escapeHTML(value)} <span aria-hidden="true">↗</span>` : escapeHTML(value);
}
for (const img of document.querySelectorAll('[data-image]')) {
  const imageUrl = content.site[img.dataset.image];
  if (typeof imageUrl === 'string') {
    if (img.dataset.image !== 'headerLogo') addImageFallback(img, img.dataset.image === 'featureImage' ? imageFallbacks[1] : imageFallbacks[0]);
    img.src = safeImage(imageUrl);
  }
}

const programGrid = document.querySelector('[data-program-grid]');
function renderProgramCards(items) {
  return items.filter((item) => item.status !== 'inactivo').sort((a,b) => Number(a.order ?? a.number ?? 999) - Number(b.order ?? b.number ?? 999)).map((item, index) => `
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
}
function paintProgramCards(items) {
  if (!programGrid || !Array.isArray(items)) return;
  programGrid.innerHTML = renderProgramCards(items);
  programGrid.querySelectorAll('.program-card__image img').forEach((image, index) => addImageFallback(image, imageFallbacks[index % imageFallbacks.length]));
}
paintProgramCards(content.programs);
window.caritasRenderProgramCards = paintProgramCards;

const impactGrid = document.querySelector('[data-impact-grid]');
if (impactGrid) impactGrid.innerHTML = (content.impact || impact).map((item) => `<article class="impact-card"><strong>${escapeHTML(item.value)}</strong><span>${escapeHTML(item.label)}</span><small>${escapeHTML(item.period)} · <a href="${safeExternal(item.source)}" target="_blank" rel="noopener noreferrer">Fuente ↗</a></small></article>`).join('');

const newsGrid = document.querySelector('[data-news-grid]');
if (newsGrid) {
  newsGrid.innerHTML = content.news.map((item) => `
    <article class="news-card"><a class="news-card__image" href="${safeExternal(item.href)}" target="_blank" rel="noopener noreferrer" aria-label="Consultar ${escapeHTML(item.category)} en su canal oficial"><img src="${safeImage(item.image)}" alt="${escapeHTML(item.alt)}" loading="lazy" width="1000" height="680" /><span aria-hidden="true">↗</span></a><div class="news-card__meta"><span>${escapeHTML(item.category)}</span><span>${escapeHTML(item.date)}</span></div><h3><a href="${safeExternal(item.href)}" target="_blank" rel="noopener noreferrer">${escapeHTML(item.title)}</a></h3>${item.description ? `<p class="news-card__description">${escapeHTML(item.description)}</p>` : ''}</article>`).join('');
  newsGrid.querySelectorAll('.news-card__image img').forEach((image, index) => addImageFallback(image, imageFallbacks[(index + 1) % imageFallbacks.length]));
}

const toggle = document.querySelector('.menu-toggle');
const siteNav = document.querySelector('#site-nav');
toggle?.addEventListener('click', () => {
  const expanded = toggle.getAttribute('aria-expanded') === 'true';
  toggle.setAttribute('aria-expanded', String(!expanded));
  toggle.querySelector('.sr-only').textContent = expanded ? 'Abrir menú' : 'Cerrar menú';
  siteNav?.classList.toggle('nav--open', !expanded);
});
siteNav?.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => {
  siteNav.classList.remove('nav--open');
  toggle?.setAttribute('aria-expanded', 'false');
  const label = toggle?.querySelector('.sr-only');
  if (label) label.textContent = 'Abrir menú';
}));

document.querySelector('[data-year]').textContent = new Date().getFullYear();
applyAppearance(document, normalizeAppearance(content.appearance || defaultAppearance));
const sectionAnimations = normalizeSectionAnimations(content.animations || {});
applySectionAnimations(document, sectionAnimations);
window.caritasApplySectionAnimations = (value) => applySectionAnimations(document, value);
