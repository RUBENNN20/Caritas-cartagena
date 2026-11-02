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
  { key: 'footer', label: 'Pie de página', hint: 'Contacto, enlaces institucionales y cierre', bg: '#155237', text: '#fffdf4', accent: '#f4cf38', border: '#377a52', areas: '.footer', heading: '.footer .brand__copy strong', body: '.footer p,.footer a,.footer small', accents: '.footer a:hover', cards: '.footer__contact,.footer__links' }
];

export const defaultAppearance = Object.fromEntries(appearanceRegions.map((region) => [region.key, {
  background: region.bg, text: region.text, accent: region.accent, border: region.border,
  borderWidth: region.key === 'projects' || region.key === 'collaborate' ? 1 : 0,
  radius: 0, headingScale: 100, bodyScale: 100, font: 'original'
}]));

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
    const legacy = previousDefaults[region.key];
    const paletteColor = (key, position) => item[key] === legacy[position] ? region[{ background: 'bg', text: 'text', accent: 'accent', border: 'border' }[key]] : item[key];
    return [region.key, {
      background: hexColor(paletteColor('background', 0), region.bg), text: hexColor(paletteColor('text', 1), region.text),
      accent: hexColor(paletteColor('accent', 2), region.accent), border: hexColor(paletteColor('border', 3), region.border),
      borderWidth: clampNumber(item.borderWidth, 0, 8, fallback.borderWidth), radius: clampNumber(item.radius, 0, 48, fallback.radius),
      headingScale: clampNumber(item.headingScale, 75, 140, fallback.headingScale), bodyScale: clampNumber(item.bodyScale, 80, 130, fallback.bodyScale),
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
