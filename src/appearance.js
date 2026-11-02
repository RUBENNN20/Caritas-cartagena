export const appearanceRegions = [
  { key: 'header', label: 'Encabezado y navegación', hint: 'Franja superior, logo y menú', bg: '#fffdf4', text: '#26372d', accent: '#e76f24', border: '#e8dfc8', areas: '.topline,.site-header', borderAreas: '.site-header', heading: '.brand__copy strong', body: '.topline,.nav', accents: '.topline a,.brand__copy strong,.nav>a:not(.button):hover', cards: '.site-header' },
  { key: 'hero', label: 'Portada principal', hint: 'Imagen, título y botones', bg: '#174b37', text: '#fffdf4', accent: '#ef7625', border: '#eac108', areas: '.hero', heading: '.hero h1', body: '.hero__lead', accents: '.hero h1 em,.hero .button--gold', cards: '.hero .button' },
  { key: 'intro', label: 'Presentación institucional', hint: 'Quiénes somos y texto introductorio', bg: '#fffdf7', text: '#3b3329', accent: '#087b45', border: '#e8dfc8', areas: '.intro', heading: '.intro h2', body: '.intro p', accents: '.intro .eyebrow>span,.intro .circle-link', cards: '.intro .circle-link' },
  { key: 'values', label: 'Franja de principios', hint: 'Justicia social, solidaridad y valores', bg: '#f4d34e', text: '#234732', accent: '#087b45', border: '#eac108', areas: '.values-band', heading: '', body: '.values-band', accents: '.values-band i', cards: '.values-band' },
  { key: 'projects', label: 'Proyectos y programas', hint: 'Tarjetas, títulos y enlaces de proyectos', bg: '#fff9ed', text: '#3b3329', accent: '#e76f24', border: '#eadfc9', areas: '.programs', heading: '.programs .section-heading h2,.program-card h3', body: '.program-card p,.program-card__meta', accents: '.programs .eyebrow>span,.program-card__discover,.program-card__arrow', cards: '.program-card__image,.program-card__logo' },
  { key: 'impact', label: 'Cifras e impacto', hint: 'Datos, fuentes y tarjetas de resultados', bg: '#fff9ed', text: '#3b3329', accent: '#087b45', border: '#eadfc9', areas: '.impact', heading: '.impact h2,.impact-card strong', body: '.impact p,.impact-card span,.impact-card small', accents: '.impact .eyebrow>span,.impact-card a', cards: '.impact-card' },
  { key: 'bank', label: 'Banco de Alimentos', hint: 'Bloque destacado e invitación a conocerlo', bg: '#17603f', text: '#fffdf4', accent: '#f4cf38', border: '#398259', areas: '.feature__content', heading: '.feature h2', body: '.feature__content>p:not(.eyebrow)', accents: '.feature h2 em,.feature .button', cards: '.feature .button' },
  { key: 'collaborate', label: 'Colaboración y donaciones', hint: 'Opciones para apoyar y vincularse', bg: '#fffdf7', text: '#3b3329', accent: '#087b45', border: '#d7e5d4', areas: '.collaborate', heading: '.collaborate h2,.collab-card h3', body: '.collaborate p,.collab-card p', accents: '.collaborate .eyebrow>span,.collab-card__link', cards: '.collab-card' },
  { key: 'news', label: 'Actualidad y noticias', hint: 'Historias, fechas e imágenes', bg: '#eef4e8', text: '#3b3329', accent: '#e76f24', border: '#d7e5d4', areas: '.news', heading: '.news h2,.news-card h3', body: '.news p,.news-card__meta', accents: '.news .eyebrow>span,.news .text-link', cards: '.news-card__image' },
  { key: 'transparency', label: 'Transparencia', hint: 'Informes, responsabilidad y enlaces', bg: '#563c2e', text: '#fffdf4', accent: '#f4cf38', border: '#785642', areas: '.transparency', heading: '.transparency h2', body: '.transparency p', accents: '.transparency h2 em,.transparency .button', cards: '.transparency .button' },
  { key: 'footer', label: 'Pie de página', hint: 'Contacto, enlaces institucionales y cierre', bg: '#155237', text: '#fffdf4', accent: '#f4cf38', border: '#377a52', areas: '.footer', heading: '.footer .brand__copy strong', body: '.footer p,.footer a,.footer small', accents: '.footer a:hover', cards: '.footer__contact,.footer__links' },
  { key: 'whatsapp', label: 'Botón flotante de WhatsApp', hint: 'Acceso fijo de contacto en la esquina inferior', bg: '#25d366', text: '#ffffff', accent: '#128c7e', border: '#128c7e', areas: '.whatsapp-float', heading: '', body: '.whatsapp-float', accents: '.whatsapp-float svg', cards: '.whatsapp-float' }
];

export const defaultAppearance = Object.fromEntries(appearanceRegions.map((region) => [region.key, {
  background: region.bg, text: region.text, accent: region.accent, border: region.border,
  borderWidth: region.key === 'projects' || region.key === 'collaborate' ? 1 : 0,
  radius: region.key === 'whatsapp' ? 48 : 0, headingScale: 100, bodyScale: 100, spacing: 100, font: 'original'
}]));

export const sectionAnimationOptions = [
  ['none', 'Sin animación'], ['fadeIn', 'Fundido'], ['fadeInUp', 'Fundido hacia arriba'], ['fadeInDown', 'Fundido hacia abajo'], ['fadeInLeft', 'Fundido desde la izquierda'], ['fadeInRight', 'Fundido desde la derecha'],
  ['fadeInTopLeft', 'Fundido desde arriba a la izquierda'], ['fadeInTopRight', 'Fundido desde arriba a la derecha'], ['fadeInBottomLeft', 'Fundido desde abajo a la izquierda'], ['fadeInBottomRight', 'Fundido desde abajo a la derecha'],
  ['zoomIn', 'Zoom suave'], ['zoomInUp', 'Zoom hacia arriba'], ['zoomInDown', 'Zoom hacia abajo'], ['zoomInLeft', 'Zoom desde la izquierda'], ['zoomInRight', 'Zoom desde la derecha'],
  ['slideInUp', 'Deslizar hacia arriba'], ['slideInDown', 'Deslizar hacia abajo'], ['slideInLeft', 'Deslizar desde la izquierda'], ['slideInRight', 'Deslizar desde la derecha'],
  ['flipInX', 'Giro horizontal'], ['flipInY', 'Giro vertical'], ['rotateIn', 'Rotación'], ['rotateInDownLeft', 'Rotar desde arriba a la izquierda'], ['rotateInDownRight', 'Rotar desde arriba a la derecha'],
  ['bounceIn', 'Rebote'], ['bounceInUp', 'Rebote hacia arriba'], ['bounceInDown', 'Rebote hacia abajo'], ['backInUp', 'Impulso hacia arriba'], ['backInDown', 'Impulso hacia abajo'], ['backInLeft', 'Impulso desde la izquierda'], ['backInRight', 'Impulso desde la derecha'],
  ['lightSpeedInLeft', 'Entrada veloz desde la izquierda'], ['lightSpeedInRight', 'Entrada veloz desde la derecha'], ['rollIn', 'Entrada rodando'], ['jackInTheBox', 'Giro con rebote'], ['rubberBand', 'Banda elástica'], ['swing', 'Balanceo'], ['tada', 'Celebración'], ['wobble', 'Ondulación'], ['heartBeat', 'Latido']
].map(([value, label]) => ({ value, label }));

export const defaultSectionAnimations = {
  header: { effect: 'fadeInDown', duration: 650, delay: 0 },
  hero: { effect: 'fadeIn', duration: 950, delay: 0 },
  intro: { effect: 'fadeInUp', duration: 750, delay: 0 },
  values: { effect: 'fadeIn', duration: 650, delay: 0 },
  projects: { effect: 'fadeInUp', duration: 750, delay: 100 },
  impact: { effect: 'zoomIn', duration: 650, delay: 0 },
  bank: { effect: 'fadeInRight', duration: 750, delay: 0 },
  collaborate: { effect: 'fadeInUp', duration: 750, delay: 0 },
  news: { effect: 'fadeInUp', duration: 750, delay: 100 },
  transparency: { effect: 'fadeInLeft', duration: 750, delay: 0 },
  footer: { effect: 'fadeInUp', duration: 700, delay: 0 },
  whatsapp: { effect: 'bounceIn', duration: 700, delay: 250 }
};
const animationKeys = new Set(sectionAnimationOptions.map((item) => item.value));
export function normalizeSectionAnimations(value = {}) {
  return Object.fromEntries(appearanceRegions.map((region) => {
    const item = value?.[region.key] || {};
    return [region.key, {
      effect: animationKeys.has(item.effect) ? item.effect : 'none',
      duration: clampNumber(item.duration, 300, 2400, 800),
      delay: clampNumber(item.delay, 0, 1500, 0)
    }];
  }));
}

const animationFrames = {
  fadeIn: 'from{opacity:0}to{opacity:1}', fadeInUp: 'from{opacity:0;transform:translate3d(0,28px,0)}to{opacity:1;transform:translate3d(0,0,0)}', fadeInDown: 'from{opacity:0;transform:translate3d(0,-28px,0)}to{opacity:1;transform:translate3d(0,0,0)}', fadeInLeft: 'from{opacity:0;transform:translate3d(-28px,0,0)}to{opacity:1;transform:translate3d(0,0,0)}', fadeInRight: 'from{opacity:0;transform:translate3d(28px,0,0)}to{opacity:1;transform:translate3d(0,0,0)}',
  fadeInTopLeft: 'from{opacity:0;transform:translate3d(-28px,-28px,0)}to{opacity:1;transform:translate3d(0,0,0)}', fadeInTopRight: 'from{opacity:0;transform:translate3d(28px,-28px,0)}to{opacity:1;transform:translate3d(0,0,0)}', fadeInBottomLeft: 'from{opacity:0;transform:translate3d(-28px,28px,0)}to{opacity:1;transform:translate3d(0,0,0)}', fadeInBottomRight: 'from{opacity:0;transform:translate3d(28px,28px,0)}to{opacity:1;transform:translate3d(0,0,0)}',
  zoomIn: 'from{opacity:0;transform:scale(.82)}to{opacity:1;transform:scale(1)}', zoomInUp: 'from{opacity:0;transform:scale(.82) translate3d(0,28px,0)}to{opacity:1;transform:scale(1) translate3d(0,0,0)}', zoomInDown: 'from{opacity:0;transform:scale(.82) translate3d(0,-28px,0)}to{opacity:1;transform:scale(1) translate3d(0,0,0)}', zoomInLeft: 'from{opacity:0;transform:scale(.82) translate3d(-28px,0,0)}to{opacity:1;transform:scale(1) translate3d(0,0,0)}', zoomInRight: 'from{opacity:0;transform:scale(.82) translate3d(28px,0,0)}to{opacity:1;transform:scale(1) translate3d(0,0,0)}',
  slideInUp: 'from{transform:translate3d(0,100%,0)}to{transform:translate3d(0,0,0)}', slideInDown: 'from{transform:translate3d(0,-100%,0)}to{transform:translate3d(0,0,0)}', slideInLeft: 'from{transform:translate3d(-100%,0,0)}to{transform:translate3d(0,0,0)}', slideInRight: 'from{transform:translate3d(100%,0,0)}to{transform:translate3d(0,0,0)}',
  flipInX: 'from{opacity:0;transform:perspective(500px) rotateX(80deg)}to{opacity:1;transform:perspective(500px) rotateX(0)}', flipInY: 'from{opacity:0;transform:perspective(500px) rotateY(80deg)}to{opacity:1;transform:perspective(500px) rotateY(0)}', rotateIn: 'from{opacity:0;transform:rotate(-18deg) scale(.9)}to{opacity:1;transform:rotate(0) scale(1)}', rotateInDownLeft: 'from{opacity:0;transform:rotate(-35deg);transform-origin:left top}to{opacity:1;transform:rotate(0);transform-origin:left top}', rotateInDownRight: 'from{opacity:0;transform:rotate(35deg);transform-origin:right top}to{opacity:1;transform:rotate(0);transform-origin:right top}',
  bounceIn: '0%{opacity:0;transform:scale(.3)}50%{opacity:1;transform:scale(1.06)}70%{transform:scale(.94)}100%{transform:scale(1)}', bounceInUp: '0%{opacity:0;transform:translate3d(0,70px,0) scale(.94)}60%{opacity:1;transform:translate3d(0,-10px,0) scale(1.02)}100%{transform:translate3d(0,0,0) scale(1)}', bounceInDown: '0%{opacity:0;transform:translate3d(0,-70px,0) scale(.94)}60%{opacity:1;transform:translate3d(0,10px,0) scale(1.02)}100%{transform:translate3d(0,0,0) scale(1)}',
  backInUp: '0%{opacity:0;transform:translate3d(0,100px,0) scale(.8)}80%{opacity:.8;transform:translate3d(0,-8px,0) scale(1.02)}100%{opacity:1;transform:translate3d(0,0,0) scale(1)}', backInDown: '0%{opacity:0;transform:translate3d(0,-100px,0) scale(.8)}80%{opacity:.8;transform:translate3d(0,8px,0) scale(1.02)}100%{opacity:1;transform:translate3d(0,0,0) scale(1)}', backInLeft: '0%{opacity:0;transform:translate3d(-100px,0,0) scale(.8)}80%{opacity:.8;transform:translate3d(8px,0,0) scale(1.02)}100%{opacity:1;transform:translate3d(0,0,0) scale(1)}', backInRight: '0%{opacity:0;transform:translate3d(100px,0,0) scale(.8)}80%{opacity:.8;transform:translate3d(-8px,0,0) scale(1.02)}100%{opacity:1;transform:translate3d(0,0,0) scale(1)}',
  lightSpeedInLeft: 'from{opacity:0;transform:translate3d(-100%,0,0) skewX(25deg)}to{opacity:1;transform:translate3d(0,0,0) skewX(0)}', lightSpeedInRight: 'from{opacity:0;transform:translate3d(100%,0,0) skewX(-25deg)}to{opacity:1;transform:translate3d(0,0,0) skewX(0)}', rollIn: 'from{opacity:0;transform:translate3d(-60px,0,0) rotate(-100deg)}to{opacity:1;transform:translate3d(0,0,0) rotate(0)}', jackInTheBox: '0%{opacity:0;transform:scale(.1) rotate(30deg);transform-origin:center bottom}50%{transform:rotate(-10deg)}70%{transform:rotate(3deg)}100%{opacity:1;transform:scale(1)}',
  rubberBand: '0%{transform:scale3d(1,1,1)}30%{transform:scale3d(1.18,.82,1)}40%{transform:scale3d(.82,1.18,1)}50%{transform:scale3d(1.1,.9,1)}65%{transform:scale3d(.96,1.04,1)}100%{transform:scale3d(1,1,1)}', swing: '20%{transform:rotate(8deg)}40%{transform:rotate(-6deg)}60%{transform:rotate(3deg)}80%{transform:rotate(-2deg)}100%{transform:rotate(0)}', tada: '10%,20%{transform:scale(.92) rotate(-3deg)}30%,50%,70%,90%{transform:scale(1.08) rotate(3deg)}40%,60%,80%{transform:scale(1.08) rotate(-3deg)}100%{transform:scale(1) rotate(0)}', wobble: '0%{transform:translateX(0)}15%{transform:translateX(-18px) rotate(-4deg)}30%{transform:translateX(14px) rotate(3deg)}45%{transform:translateX(-10px) rotate(-2deg)}60%{transform:translateX(6px) rotate(1deg)}100%{transform:translateX(0)}', heartBeat: '0%,28%,70%,100%{transform:scale(1)}14%,42%{transform:scale(1.08)}'
};
const animationSelectors = Object.fromEntries(appearanceRegions.map((region) => [region.key, region.areas]));
const animationObservers = new WeakMap();
const animationScrollStates = new WeakMap();
export function sectionAnimationCSS() {
  const keyframes = Object.entries(animationFrames).map(([name, frames]) => `@keyframes caritas-${name}{${frames}}`).join('\n');
  const effects = Object.keys(animationFrames).map((name) => `[data-caritas-anim="${name}"].caritas-anim-active{animation:caritas-${name} var(--caritas-anim-duration,800ms) ease both;animation-delay:var(--caritas-anim-delay,0ms)}`).join('\n');
  return `${keyframes}\n.caritas-anim-pending{opacity:0}\n${effects}\n@media(prefers-reduced-motion:reduce){.caritas-anim-pending{opacity:1!important}[data-caritas-anim]{animation:none!important}}`;
}

export function applySectionAnimations(documentRef, value = {}) {
  if (!documentRef?.head) return;
  const settings = normalizeSectionAnimations(value);
  let style = documentRef.getElementById('user-section-animation-styles');
  if (!style) { style = documentRef.createElement('style'); style.id = 'user-section-animation-styles'; documentRef.head.append(style); }
  style.textContent = sectionAnimationCSS();
  animationObservers.get(documentRef)?.disconnect();
  const reducedMotion = documentRef.defaultView?.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
  const Observer = documentRef.defaultView?.IntersectionObserver;
  const view = documentRef.defaultView;
  let scrollState = animationScrollStates.get(documentRef);
  if (view && !scrollState) {
    scrollState = { y: view.scrollY || 0, direction: 1 };
    view.addEventListener('scroll', () => {
      const nextY = view.scrollY || 0;
      if (nextY !== scrollState.y) scrollState.direction = nextY > scrollState.y ? 1 : -1;
      scrollState.y = nextY;
    }, { passive: true });
    animationScrollStates.set(documentRef, scrollState);
  }
  const observer = !reducedMotion && Observer ? new Observer((entries) => entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    entry.target.classList.remove('caritas-anim-pending');
    if (scrollState?.direction < 0 || entry.boundingClientRect.top < 0) return;
    entry.target.classList.remove('caritas-anim-active');
    void entry.target.offsetWidth;
    entry.target.classList.add('caritas-anim-active');
  }), { threshold: 0.12, rootMargin: '0px 0px -6% 0px' }) : null;
  if (observer) animationObservers.set(documentRef, observer);
  for (const node of documentRef.querySelectorAll('[data-caritas-animated]')) {
    node.classList.remove('caritas-anim-pending', 'caritas-anim-active');
    node.removeAttribute('data-caritas-animated');
    node.removeAttribute('data-caritas-anim');
    node.style.removeProperty('--caritas-anim-duration');
    node.style.removeProperty('--caritas-anim-delay');
  }
  for (const region of appearanceRegions) {
    const item = settings[region.key];
    if (item.effect === 'none') continue;
    for (const selector of animationSelectors[region.key].split(',')) {
      documentRef.querySelectorAll(selector.trim()).forEach((node) => {
        node.dataset.caritasAnimated = 'true';
        node.dataset.caritasAnim = item.effect;
        node.style.setProperty('--caritas-anim-duration', `${item.duration}ms`);
        node.style.setProperty('--caritas-anim-delay', `${item.delay}ms`);
        if (observer) { node.classList.add('caritas-anim-pending'); observer.observe(node); }
      });
    }
  }
}

const previousDefaults = {
  header: ['#fffdf9', '#56311f', '#e97b35', '#ead8c8'], hero: ['#56311f', '#fffdf9', '#e97b35', '#ead8c8'],
  intro: ['#fffdf9', '#56311f', '#e97b35', '#ead8c8'], values: ['#e5efdb', '#56311f', '#8a9a50', '#d4dfc8'],
  projects: ['#fff8f1', '#56311f', '#b34d27', '#ead8c8'], impact: ['#fff8f1', '#56311f', '#b34d27', '#ead8c8'],
  bank: ['#56311f', '#fffdf9', '#f2ad68', '#75432b'], collaborate: ['#fffdf9', '#56311f', '#b34d27', '#ead8c8'],
  news: ['#e9ede4', '#56311f', '#b34d27', '#d7dfd1'], transparency: ['#56311f', '#fffdf9', '#f2ad68', '#75432b'],
  footer: ['#56311f', '#fffdf9', '#f2ad68', '#75432b']
};

const fonts = { original: '', sans: "'DM Sans',Arial,sans-serif", serif: "Georgia,'Times New Roman',serif", display: "Manrope,'DM Sans',sans-serif" };
const bodyBase = { header: 11, hero: 15, intro: 15, values: 10, projects: 12, impact: 13, bank: 13, collaborate: 12, news: 10, transparency: 13, footer: 11 };
const hexColor = (value, fallback) => /^#[0-9a-f]{6}$/i.test(value || '') ? value : fallback;
const clampNumber = (value, low, high, fallback) => Number.isFinite(Number(value)) ? Math.min(high, Math.max(low, Number(value))) : fallback;

export function normalizeAppearance(value = {}) {
  return Object.fromEntries(appearanceRegions.map((region) => {
    const item = value?.[region.key] || {};
    const fallback = defaultAppearance[region.key];
    const legacy = previousDefaults[region.key] || [];
    const paletteColor = (key, position) => item[key] === legacy[position] ? region[{ background: 'bg', text: 'text', accent: 'accent', border: 'border' }[key]] : item[key];
    return [region.key, {
      background: hexColor(paletteColor('background', 0), region.bg), text: hexColor(paletteColor('text', 1), region.text),
      accent: hexColor(paletteColor('accent', 2), region.accent), border: hexColor(paletteColor('border', 3), region.border),
      borderWidth: clampNumber(item.borderWidth, 0, 8, fallback.borderWidth), radius: clampNumber(item.radius, 0, 48, fallback.radius),
      headingScale: clampNumber(item.headingScale, 75, 140, fallback.headingScale), bodyScale: clampNumber(item.bodyScale, 80, 130, fallback.bodyScale),
      spacing: clampNumber(item.spacing, 75, 130, fallback.spacing),
      font: Object.hasOwn(fonts, item.font) ? item.font : 'original'
    }];
  }));
}

function scaledHeading(region, scale) {
  const factor = scale / 100;
  const values = {
    header: [12, '1vw', 16], hero: [64, '9vw', 116], intro: [42, '6vw', 74], projects: [46, '6vw', 72], impact: [42, '5.2vw', 66],
    bank: [49, '6.3vw', 76], collaborate: [46, '6vw', 72], news: [46, '6vw', 72], transparency: [50, '7vw', 83], footer: [12, '1vw', 16]
  }[region] || [14, '1.2vw', 18];
  return `clamp(${(values[0] * factor).toFixed(2)}px,${(parseFloat(values[1]) * factor).toFixed(2)}vw,${(values[2] * factor).toFixed(2)}px)`;
}

export function appearanceCSS(value) {
  const appearance = normalizeAppearance(value);
  return appearanceRegions.map((region) => {
    const item = appearance[region.key];
    const font = fonts[item.font];
    const factor = item.headingScale / 100;
    const fontFamily = font ? `font-family:${font}!important;` : '';
    let headingRules = region.heading ? `${region.heading}{${fontFamily}font-size:${scaledHeading(region.key, item.headingScale)}!important}` : '';
    if (region.key === 'projects') headingRules = `.programs .section-heading h2{${fontFamily}font-size:${scaledHeading(region.key, item.headingScale)}!important}.program-card h3{${fontFamily}font-size:${(21 * factor).toFixed(2)}px!important}`;
    if (region.key === 'collaborate') headingRules = `.collaborate h2{${fontFamily}font-size:${scaledHeading(region.key, item.headingScale)}!important}.collab-card h3{${fontFamily}font-size:${(18 * factor).toFixed(2)}px!important}`;
    if (region.key === 'news') headingRules = `.news h2{${fontFamily}font-size:${scaledHeading(region.key, item.headingScale)}!important}.news-card h3{${fontFamily}font-size:clamp(${(20 * factor).toFixed(2)}px,${(2.3 * factor).toFixed(2)}vw,${(28 * factor).toFixed(2)}px)!important}`;
    if (region.key === 'impact') headingRules = `.impact h2{${fontFamily}font-size:${scaledHeading(region.key, item.headingScale)}!important}.impact-card strong{${fontFamily}font-size:${(40 * factor).toFixed(2)}px!important}`;
    const rules = [
      `${region.areas}{background-color:${item.background}!important;color:${item.text}!important;${fontFamily}}`,
      `${region.areas} *{color:${item.text}!important}`,
      font ? `${region.areas} a,${region.areas} p,${region.areas} span,${region.areas} small{font-family:${font}!important}` : '',
      headingRules,
      `${region.body}{font-size:${(bodyBase[region.key] * item.bodyScale / 100).toFixed(2)}px!important}`,
      `${region.accents}{color:${item.accent}!important}`,
      `${region.cards}{border-color:${item.border}!important;border-style:solid!important;border-width:${item.borderWidth}px!important;border-radius:${item.radius}px!important}`
    ];
    if (region.key === 'hero') rules.push(`.hero__image::after{content:'';position:absolute;inset:0;z-index:0;pointer-events:none;background:${item.background};opacity:.14}.hero .button--gold{background-color:${item.accent}!important;color:${item.text}!important}`);
    if (region.key === 'bank' || region.key === 'transparency') rules.push(`${region.areas} .button{background-color:${item.accent}!important;color:${item.text}!important}`);
    if (region.key === 'header') rules.push(`.topline a,.brand__copy strong{color:${item.accent}!important}`);
    rules.push(`${region.borderAreas || region.areas}{border-color:${item.border}!important}`);
    return rules.join('\n');
  }).join('\n');
}

export function applyAppearance(documentRef, value) {
  if (!documentRef?.head) return;
  const appearance = normalizeAppearance(value);
  let style = documentRef.getElementById('user-appearance-styles');
  if (!style) { style = documentRef.createElement('style'); style.id = 'user-appearance-styles'; documentRef.head.append(style); }
  style.textContent = appearanceCSS(appearance);
  for (const region of appearanceRegions) {
    const item = appearance[region.key];
    const rootNodes = region.areas.split(',').flatMap((selector) => [...documentRef.querySelectorAll(selector.trim())]);
    for (const node of rootNodes) {
      node.style.setProperty('background-color', item.background, 'important');
      node.style.setProperty('color', item.text, 'important');
      node.style.setProperty('--region-spacing', String(item.spacing / 100), 'important');
      if (fonts[item.font]) node.style.setProperty('font-family', fonts[item.font], 'important');
      node.querySelectorAll('*').forEach((child) => {
        child.style.setProperty('color', item.text, 'important');
        if (fonts[item.font]) child.style.setProperty('font-family', fonts[item.font], 'important');
      });
    }
    region.accents.split(',').forEach((selector) => documentRef.querySelectorAll(selector.trim()).forEach((node) => node.style.setProperty('color', item.accent, 'important')));
    region.cards.split(',').forEach((selector) => documentRef.querySelectorAll(selector.trim()).forEach((node) => {
      node.style.setProperty('border-color', item.border, 'important');
      node.style.setProperty('border-style', 'solid', 'important');
      node.style.setProperty('border-width', `${item.borderWidth}px`, 'important');
      node.style.setProperty('border-radius', `${item.radius}px`, 'important');
    }));
    if (region.key === 'hero') documentRef.querySelectorAll('.hero .button--gold').forEach((node) => node.style.setProperty('color', item.text, 'important'));
    if (region.key === 'bank' || region.key === 'transparency') documentRef.querySelectorAll(`${region.areas} .button`).forEach((node) => node.style.setProperty('color', item.text, 'important'));
  }
}
