/* ============================================================
   BIORIGEN · Generador del sitio estático
   Uso: node build.js
   Genera URLs limpias en carpetas con index.html.
   ============================================================ */
'use strict';

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const DATA = require('./assets/js/data.js');
const ART = require('./assets/js/art.js');

const { SITE, LINES, PRODUCTS, PROJECTS, TEAM, ADVISOR, VALUES, PROCESS, SCIENCE, FAQ } = DATA;
const ROOT = __dirname;
const CSS_PARTS = ['_base.css', '_home.css', '_pages.css', '_shop.css', '_responsive.css'];
let ASSET_VERSION = 'dev';

/* ---------- Utilidades ---------- */
const esc = (value) => String(value ?? '').replace(/[&<>"']/g, (ch) => ({
  '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
}[ch]));
const money = (n) => '$' + Number(n || 0).toLocaleString('es-MX', { maximumFractionDigits: 0 });
const icon = (name, cls = '') => `<svg class="icon ${cls}" aria-hidden="true" focusable="false"><use href="#i-${name}"></use></svg>`;
const href = (root, p = '') => root + String(p).replace(/^\//, '');
const productById = (id) => PRODUCTS.find((p) => p.id === id);
const lineById = (id) => LINES.find((l) => l.id === id);
const projectById = (id) => PROJECTS.find((p) => p.id === id);

function writePage(relPath, html) {
  const full = path.join(ROOT, relPath);
  fs.mkdirSync(path.dirname(full), { recursive: true });
  fs.writeFileSync(full, html, 'utf8');
  console.log('  ✓ ' + relPath);
}

function buildCSS() {
  const dir = path.join(ROOT, 'assets/css');
  const css = CSS_PARTS.map((file) => fs.readFileSync(path.join(dir, file), 'utf8')).join('\n');
  fs.writeFileSync(path.join(dir, 'styles.css'), css, 'utf8');
  console.log(`  ✓ assets/css/styles.css (${(css.length / 1024).toFixed(1)} KB)`);
}

function computeAssetVersion() {
  const files = [
    'assets/css/styles.css',
    'assets/js/data.js',
    'assets/js/art.js',
    'assets/js/components.js',
    'assets/js/app.js'
  ];
  const hash = crypto.createHash('sha1');
  files.forEach((file) => hash.update(fs.readFileSync(path.join(ROOT, file))));
  return hash.digest('hex').slice(0, 10);
}

function notFoundBaseScript() {
  return `<script>
  /* En GitHub Pages el 404 se sirve desde la ruta solicitada. Detectamos si
     el sitio vive en la raíz o en una subcarpeta (/repositorio/) y fijamos
     una base para que los estilos, scripts y enlaces funcionen. */
  (function () {
    var base = './';
    try {
      if (location.protocol !== 'file:') {
        var parts = location.pathname.split('/').filter(Boolean);
        var known = ['productos', 'nosotros', 'ciencia', 'proyectos', 'contacto', 'aviso-academico', 'logotipos'];
        if (!parts.length || parts.length === 1 || parts[0].indexOf('.') !== -1 || known.indexOf(parts[0]) !== -1) {
          base = '/';
        } else {
          var candidate = '/' + parts[0] + '/';
          var xhr = new XMLHttpRequest();
          xhr.open('HEAD', candidate + 'assets/css/styles.css', false);
          xhr.send();
          base = (xhr.status >= 200 && xhr.status < 400) ? candidate : '/';
        }
      }
    } catch (err) {
      base = './';
    }
    document.write('<base href="' + base + '">');
  })();
  </script>`;
}

/* ---------- Iconos ---------- */
function sprite() {
  return `<svg xmlns="http://www.w3.org/2000/svg" style="display:none" aria-hidden="true">
  <symbol id="i-arrow-right" viewBox="0 0 24 24"><path d="M5 12h14M13 6l6 6-6 6"/></symbol>
  <symbol id="i-arrow-left" viewBox="0 0 24 24"><path d="M19 12H5M11 18l-6-6 6-6"/></symbol>
  <symbol id="i-arrow-up-right" viewBox="0 0 24 24"><path d="M7 17 17 7M8 7h9v9"/></symbol>
  <symbol id="i-chevron-down" viewBox="0 0 24 24"><path d="m6 9 6 6 6-6"/></symbol>
  <symbol id="i-chevron-right" viewBox="0 0 24 24"><path d="m9 6 6 6-6 6"/></symbol>
  <symbol id="i-cart" viewBox="0 0 24 24"><path d="M3 4h2l2.4 11.2a2 2 0 0 0 2 1.6h8.8a2 2 0 0 0 2-1.6L21.5 8H6"/><circle cx="10" cy="20" r="1.2"/><circle cx="18" cy="20" r="1.2"/></symbol>
  <symbol id="i-user" viewBox="0 0 24 24"><circle cx="12" cy="8" r="3.6"/><path d="M4.5 21a7.5 7.5 0 0 1 15 0"/></symbol>
  <symbol id="i-heart" viewBox="0 0 24 24"><path d="M20.8 5.9a5.2 5.2 0 0 0-7.4 0L12 7.3l-1.4-1.4a5.2 5.2 0 0 0-7.4 7.4L12 22l8.8-8.7a5.2 5.2 0 0 0 0-7.4Z"/></symbol>
  <symbol id="i-close" viewBox="0 0 24 24"><path d="M6 6l12 12M18 6 6 18"/></symbol>
  <symbol id="i-plus" viewBox="0 0 24 24"><path d="M12 5v14M5 12h14"/></symbol>
  <symbol id="i-minus" viewBox="0 0 24 24"><path d="M5 12h14"/></symbol>
  <symbol id="i-trash" viewBox="0 0 24 24"><path d="M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3"/></symbol>
  <symbol id="i-check" viewBox="0 0 24 24"><path d="m5 12 5 5L20 6"/></symbol>
  <symbol id="i-check-circle" viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><path d="m8 12 3 3 5-6"/></symbol>
  <symbol id="i-leaf" viewBox="0 0 24 24"><path d="M12 21V10"/><path d="M12 14c0-4 2.6-7 6.4-7 1.8 0 2.8 1.2 2.8 2.7 0 3.6-3.9 6.3-9.2 6.3"/><path d="M11.7 17c0-3.4-2.2-5.5-5.2-5.5-1.5 0-2.4.9-2.4 2.2 0 2.9 3 5 7.6 5"/></symbol>
  <symbol id="i-flask" viewBox="0 0 24 24"><path d="M9 3h6M10 3v6l-5.2 8.4A2 2 0 0 0 6.5 21h11a2 2 0 0 0 1.7-3.6L14 9V3"/><path d="M8 15h8"/></symbol>
  <symbol id="i-drop" viewBox="0 0 24 24"><path d="M12 3s6.5 7.1 6.5 11.2a6.5 6.5 0 0 1-13 0C5.5 10.1 12 3 12 3Z"/></symbol>
  <symbol id="i-gut" viewBox="0 0 24 24"><path d="M6 5v6a4 4 0 0 0 4 4h1a4 4 0 0 1 4 4v1"/><path d="M10 5v4a2 2 0 0 0 2 2h1a3 3 0 0 1 3 3v1"/><path d="M18 5v2"/></symbol>
  <symbol id="i-sparkle" viewBox="0 0 24 24"><path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8Z"/><path d="M19 16l.8 2.2L22 19l-2.2.8L19 22l-.8-2.2L16 19l2.2-.8Z"/></symbol>
  <symbol id="i-shield" viewBox="0 0 24 24"><path d="M12 3 5 6v6c0 4.5 3 7.7 7 9 4-1.3 7-4.5 7-9V6Z"/><path d="m9 12 2 2 4-4"/></symbol>
  <symbol id="i-truck" viewBox="0 0 24 24"><path d="M3 6h11v11H3zM14 10h4l3 3v4h-7"/><circle cx="7" cy="19" r="1.5"/><circle cx="18" cy="19" r="1.5"/></symbol>
  <symbol id="i-clock" viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></symbol>
  <symbol id="i-map-pin" viewBox="0 0 24 24"><path d="M12 21s7-6.1 7-11a7 7 0 1 0-14 0c0 4.9 7 11 7 11Z"/><circle cx="12" cy="10" r="2.6"/></symbol>
  <symbol id="i-mail" viewBox="0 0 24 24"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m4 7 8 6 8-6"/></symbol>
  <symbol id="i-phone" viewBox="0 0 24 24"><path d="M6 3h3l2 5-2 1.5a12 12 0 0 0 5.5 5.5L16 13l5 2v3a2 2 0 0 1-2.2 2A17 17 0 0 1 4 5.2 2 2 0 0 1 6 3Z"/></symbol>
  <symbol id="i-info" viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><path d="M12 11v5M12 8h.01"/></symbol>
  <symbol id="i-lock" viewBox="0 0 24 24"><rect x="4" y="10" width="16" height="11" rx="2"/><path d="M8 10V7a4 4 0 0 1 8 0v3"/></symbol>
  <symbol id="i-credit-card" viewBox="0 0 24 24"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 10h18M7 15h4"/></symbol>
  <symbol id="i-package" viewBox="0 0 24 24"><path d="m12 3 8 4.5v9L12 21l-8-4.5v-9Z"/><path d="m4 7.5 8 4.5 8-4.5M12 12v9"/></symbol>
  <symbol id="i-star" viewBox="0 0 24 24"><path d="m12 3 2.8 5.7 6.2.9-4.5 4.4 1.1 6.2-5.6-3-5.6 3 1.1-6.2L3 9.6l6.2-.9Z"/></symbol>
  <symbol id="i-sprout" viewBox="0 0 24 24"><path d="M12 21v-8"/><path d="M12 14c0-3.6 2.4-6 6-6 1.6 0 2.6 1 2.6 2.4 0 3.3-3.5 5.6-8.6 5.6"/><path d="M11.7 17c0-3-2-4.8-4.7-4.8-1.4 0-2.2.8-2.2 2 0 2.6 2.7 4.4 6.9 4.4"/></symbol>
  <symbol id="i-bacteria" viewBox="0 0 24 24"><circle cx="8" cy="9" r="2.2"/><circle cx="16" cy="8" r="1.6"/><circle cx="14" cy="15" r="2.6"/><circle cx="7" cy="16" r="1.4"/><path d="M10 6.5 11.5 5M18 12l1.5-1M10 17l-1 1.5"/></symbol>
  <symbol id="i-wheat" viewBox="0 0 24 24"><path d="M12 21V7"/><path d="M12 10c-2.5 0-4-1.5-4-4 2.5 0 4 1.5 4 4ZM12 10c2.5 0 4-1.5 4-4-2.5 0-4 1.5-4 4ZM12 15c-2.5 0-4-1.5-4-4 2.5 0 4 1.5 4 4ZM12 15c2.5 0 4-1.5 4-4-2.5 0-4 1.5-4 4Z"/></symbol>
  <symbol id="i-sun" viewBox="0 0 24 24"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M2 12h2M20 12h2M5 5l1.5 1.5M17.5 17.5 19 19M19 5l-1.5 1.5M6.5 17.5 5 19"/></symbol>
</svg>`;
}

/* ---------- Header y footer ---------- */
function miniLine(line) {
  return ART.lineArt(line).replace('class="product-art"', 'class="product-art"');
}
function miniProduct(product) {
  return ART.productArt(product);
}

function header(root, active) {
  const is = (key) => (active === key ? ' aria-current="page"' : '');
  const productLines = LINES.filter((l) => l.id === 'gluco-control' || l.id === 'kefir');
  const projectCards = PROJECTS.map((p) => `
    <a class="drop-card" href="${href(root, `proyectos/${p.slug}/`)}">
      <span class="drop-thumb" style="background:${p.tint}">${projectArt(p)}</span>
      <span><strong>${esc(p.name)}</strong><small>${esc(p.category)} · ${esc(p.status)}</small></span>
    </a>`).join('');

  return `<div class="top-strip">
    <div class="container">
      <p><span class="dot"></span> Biotecnología alimentaria · Coatzacoalcos</p>
      <p class="top-right">Proyecto académico ITESCO · ${esc(SITE.fair)}</p>
    </div>
  </div>
  <header class="site-head">
    <div class="container head-inner">
      <a class="brand" href="${href(root, '')}" aria-label="biorigen. Biotecnología con origen, inicio">
        <span class="brand-mark">${ART.logoMark('A')}</span>
        <span>
          <span class="brand-word">biorigen<span>.</span></span>
          <span class="brand-tag">Biotecnología con origen</span>
        </span>
      </a>
      <nav class="head-nav" aria-label="Navegación principal">
        <ul class="menu-list">
          <li class="menu-item"><a class="menu-link" href="${href(root, '')}"${is('home')}>Inicio</a></li>
          <li class="menu-item has-drop">
            <button class="menu-link drop-toggle" type="button" aria-expanded="false" aria-controls="menuProductos">Productos ${icon('chevron-down', 'chev')}</button>
            <div class="drop-panel" id="menuProductos">
              <div class="drop-grid">
                <div class="drop-col-title">Líneas activas</div>
                ${productLines.map((l) => `
                  <a class="drop-card" href="${href(root, `productos/${l.slug}/`)}">
                    <span class="drop-thumb" style="background:${l.tint}">${miniLine(l)}</span>
                    <span><strong>${esc(l.name)}</strong><small>${esc(l.kind)} · ${esc(l.status)}</small></span>
                  </a>`).join('')}
                <div class="drop-col-title">Sabores destacados</div>
                ${PRODUCTS.filter((p) => p.featured).slice(0, 4).map((p) => `
                  <a class="drop-card" href="${href(root, `productos/${p.line}/${p.slug}/`)}">
                    <span class="drop-thumb" style="background:${p.tint}">${miniProduct(p)}</span>
                    <span><strong>${esc(p.name)}</strong><small>Desde ${money(p.sizes[0].price)} · ${esc(p.sizes[0].label)}</small></span>
                  </a>`).join('')}
                <div class="drop-foot">
                  <a class="link-btn" href="${href(root, 'productos/')}">Ver catálogo completo ${icon('arrow-right')}</a>
                  <span class="tag">6 productos demo</span>
                </div>
              </div>
            </div>
          </li>
          <li class="menu-item"><a class="menu-link" href="${href(root, 'nosotros/')}"${is('nosotros')}>Nosotros</a></li>
          <li class="menu-item"><a class="menu-link" href="${href(root, 'ciencia/')}"${is('ciencia')}>Ciencia</a></li>
          <li class="menu-item has-drop">
            <button class="menu-link drop-toggle" type="button" aria-expanded="false" aria-controls="menuProyectos">Proyectos ${icon('chevron-down', 'chev')}</button>
            <div class="drop-panel" id="menuProyectos">
              <div class="drop-grid">
                <div class="drop-col-title">Biorigen Labs</div>
                ${projectCards}
                <div class="drop-foot">
                  <a class="link-btn" href="${href(root, 'proyectos/')}">Ver todos los proyectos ${icon('arrow-right')}</a>
                  <span class="tag">En desarrollo</span>
                </div>
              </div>
            </div>
          </li>
          <li class="menu-item"><a class="menu-link" href="${href(root, 'contacto/')}"${is('contacto')}>Contacto</a></li>
        </ul>
      </nav>
      <div class="head-actions">
        <a class="btn btn--solid btn--sm head-cta" href="${href(root, 'productos/')}">Comprar</a>
        <button class="icon-btn" type="button" data-open-cart aria-label="Abrir carrito">${icon('cart')}<span class="cart-count" id="cartCount" hidden>0</span></button>
        <button class="icon-btn" type="button" id="accountBtn" data-open-account aria-label="Mi cuenta">${icon('user')}</button>
        <button class="menu-btn" type="button" id="menuBtn" aria-expanded="false" aria-controls="mobilePanel" aria-label="Abrir menú"><span></span><span></span></button>
      </div>
    </div>
    <div class="mobile-panel" id="mobilePanel">
      <div class="mobile-links">
        <a href="${href(root, '')}">Inicio</a>
        <div class="mobile-group">
          <button class="mobile-toggle" type="button" aria-expanded="false">Productos ${icon('chevron-down', 'chev')}</button>
          <div class="mobile-sub">
            <a href="${href(root, 'productos/')}">Ver catálogo</a>
            <a href="${href(root, 'productos/gluco-control/')}">Gluco-Control · yogurt</a>
            ${PRODUCTS.filter((p) => p.line === 'gluco-control').map((p) => `<a href="${href(root, `productos/${p.line}/${p.slug}/`)}">${esc(p.name)}</a>`).join('')}
            <a href="${href(root, 'productos/kefir/')}">Kéfir · fermentado de leche</a>
            ${PRODUCTS.filter((p) => p.line === 'kefir').map((p) => `<a href="${href(root, `productos/${p.line}/${p.slug}/`)}">${esc(p.name)}</a>`).join('')}
          </div>
        </div>
        <div class="mobile-group">
          <button class="mobile-toggle" type="button" aria-expanded="false">Proyectos ${icon('chevron-down', 'chev')}</button>
          <div class="mobile-sub">
            <a href="${href(root, 'proyectos/')}">Ver todos</a>
            ${PROJECTS.map((p) => `<a href="${href(root, `proyectos/${p.slug}/`)}">${esc(p.name)}</a>`).join('')}
          </div>
        </div>
        <a href="${href(root, 'nosotros/')}">Nosotros</a>
        <a href="${href(root, 'ciencia/')}">Ciencia</a>
        <a href="${href(root, 'contacto/')}">Contacto</a>
      </div>
      <div class="mobile-actions">
        <a class="btn btn--solid btn--block" href="${href(root, 'productos/')}">Comprar</a>
        <button class="btn btn--ghost btn--block" type="button" data-open-account>Mi cuenta</button>
        <button class="btn btn--ghost btn--block" type="button" data-open-tasting>Solicitar degustación</button>
      </div>
    </div>
  </header>`;
}

function footer(root) {
  return `<footer class="site-foot">
    <div class="container">
      <div class="foot-grid">
        <div class="foot-brand">
          <a class="brand" href="${href(root, '')}" aria-label="biorigen. Biotecnología con origen, inicio">
            <span class="brand-mark">${ART.logoMark('A')}</span>
            <span>
              <span class="brand-word">biorigen<span>.</span></span>
              <span class="brand-tag">Biotecnología con origen</span>
            </span>
          </a>
          <p>Fermentados y soluciones biotecnológicas que nacen en Coatzacoalcos. Ciencia aplicada, ingredientes locales y proyectos que crecen con nosotros.</p>
          <span class="foot-badge">Proyecto académico · ITESCO</span>
        </div>
        <div class="foot-col">
          <h3>Productos</h3>
          <a href="${href(root, 'productos/gluco-control/')}">Gluco-Control</a>
          <a href="${href(root, 'productos/kefir/')}">Kéfir de leche</a>
          <a href="${href(root, 'productos/')}">Catálogo completo</a>
          <button class="link-btn" type="button" data-open-tasting style="font-size:12px;padding:4px 0;border:0">Solicitar degustación</button>
        </div>
        <div class="foot-col">
          <h3>Biorigen</h3>
          <a href="${href(root, 'nosotros/')}">Nosotros</a>
          <a href="${href(root, 'ciencia/')}">Ciencia</a>
          <a href="${href(root, 'proyectos/')}">Proyectos</a>
          <a href="${href(root, 'contacto/')}">Contacto</a>
        </div>
        <div class="foot-col">
          <h3>Contacto</h3>
          <a href="mailto:${esc(SITE.email)}">${esc(SITE.email)}</a>
          <a href="tel:${esc(SITE.phoneHref)}">${esc(SITE.phone)}</a>
          <p class="foot-address">${esc(SITE.address)}<br>${esc(SITE.school)}</p>
        </div>
      </div>
      <div class="foot-bottom">
        <span>© <span data-year>${SITE.year}</span> Biorigen · Hecho con ciencia y fermentación.</span>
        <span class="foot-legal">Sitio de demostración académica. Precios, fichas y pedidos son simulados. <a href="${href(root, 'aviso-academico/')}" style="text-decoration:underline;text-underline-offset:2px">Aviso académico</a> · <a href="${href(root, 'logotipos/')}" style="text-decoration:underline;text-underline-offset:2px">Logotipos</a></span>
      </div>
    </div>
  </footer>`;
}

/* ---------- Layout ---------- */
function layout({ title, description, body, depth = 0, active = '', bodyClass = '', headExtra = '', root: rootOverride = null }) {
  const root = rootOverride !== null ? rootOverride : '../'.repeat(depth);
  const fullTitle = title === 'Inicio'
    ? 'Biorigen · Ciencia viva, origen local'
    : `${title} · Biorigen`;
  return `<!doctype html>
<html lang="es" data-root="${root}">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${esc(fullTitle)}</title>
  <meta name="description" content="${esc(description)}">
  <meta name="theme-color" content="#1B3325">
  <meta property="og:title" content="${esc(fullTitle)}">
  <meta property="og:description" content="${esc(description)}">
  <meta property="og:type" content="website">
  <meta property="og:locale" content="es_MX">
  ${headExtra}
  <link rel="icon" href="${root}assets/img/favicon.svg" type="image/svg+xml">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,400;0,9..144,500;0,9..144,600;0,9..144,700;1,9..144,400;1,9..144,600&family=Manrope:wght@400;500;600;700;800&family=Caveat:wght@500;600&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="${root}assets/css/styles.css?v=${ASSET_VERSION}">
  <noscript><style>[data-reveal]{opacity:1!important;transform:none!important}</style></noscript>
</head>
<body class="${bodyClass}">
  <a class="skip-link" href="#main">Saltar al contenido</a>
  ${sprite()}
  ${header(root, active)}
  <main id="main">${body}</main>
  ${footer(root)}
  <script src="${root}assets/js/data.js?v=${ASSET_VERSION}" defer></script>
  <script src="${root}assets/js/art.js?v=${ASSET_VERSION}" defer></script>
  <script src="${root}assets/js/components.js?v=${ASSET_VERSION}" defer></script>
  <script src="${root}assets/js/app.js?v=${ASSET_VERSION}" defer></script>
</body>
</html>`;
}

/* ---------- Piezas compartidas ---------- */
function breadcrumb(root, items) {
  return `<nav class="breadcrumb" aria-label="Ruta de navegación">${items.map((it, i) => {
    const last = i === items.length - 1;
    if (last) return `<span aria-current="page">${esc(it.label)}</span>`;
    return `<a href="${href(root, it.path)}">${esc(it.label)}</a><span>/</span>`;
  }).join('')}</nav>`;
}

function pageHero({ root, eyebrow, title, lead, actions = '', meta = '', center = false }) {
  return `<section class="page-hero${center ? ' page-hero--center' : ''}">
    <div class="container">
      ${root !== null ? breadcrumb(root, [{ label: 'Inicio', path: '' }, { label: eyebrow }]) : ''}
      <span class="eyebrow">${eyebrow}</span>
      <h1>${title}</h1>
      <p class="lead">${lead}</p>
      ${actions ? `<div class="page-hero__actions">${actions}</div>` : ''}
      ${meta ? `<div class="page-hero__meta">${meta}</div>` : ''}
    </div>
  </section>`;
}

function notice(text, iconName = 'info') {
  return `<div class="notice">${icon(iconName)}<div>${text}</div></div>`;
}

function sectionHead({ eyebrow, title, lead = '', action = '' }) {
  return `<div class="section-head" data-reveal>
    <div>
      <span class="eyebrow">${eyebrow}</span>
      <h2>${title}</h2>
      ${lead ? `<p class="lead">${lead}</p>` : ''}
    </div>
    ${action}
  </div>`;
}

function tastingBand(root, title, text, productId = null) {
  return `<div class="tasting-band" data-reveal>
    <div><h3>${title}</h3><p>${text}</p></div>
    <div style="display:flex;gap:8px;flex-wrap:wrap">
      <button class="btn btn--solid" type="button" ${productId ? `data-tasting="${esc(productId)}"` : 'data-open-tasting'}>${icon('sparkle')} Solicitar degustación</button>
      <a class="btn btn--ghost" href="${href(root, 'contacto/')}">Contacto</a>
    </div>
  </div>`;
}

function projectArt(project) {
  const map = {
    cream: { lid: '#3E4F57', labelColor: '#DCEBEE', labelDeep: '#BFD6DC', dot: '#5B7C8D' },
    bar: { labelColor: '#F0DDB2', labelDeep: '#E3C784', dot: '#B08A3E' },
    fertilizer: { labelColor: '#E9F0D8', labelDeep: '#D5E4B9', dot: '#6E8B5A' }
  };
  const art = { type: project.art, ...(map[project.art] || {}) };
  return ART.productArt({ name: project.name, flavor: project.name, art });
}

function productCard(product, root) {
  const line = lineById(product.line);
  const url = href(root, `productos/${product.line}/${product.slug}/`);
  const art = ART.productArt(product);
  const artText = art.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
  return `<article class="product-card" data-line="${esc(product.line)}" data-reveal>
    <div class="product-card__media" style="--tint:${esc(product.tint)};--tint2:${esc(product.tint2)}">
      <div class="product-card__badges">${product.badges.slice(0, 2).map((b) => `<span class="tag">${esc(b)}</span>`).join('')}</div>
      <button class="fav-btn" type="button" data-fav="${esc(product.id)}" aria-label="Guardar ${esc(product.name)}" aria-pressed="false">${icon('heart')}</button>
      <a class="product-card__art" href="${url}" aria-label="Ver ${esc(product.name)}. ${esc(artText)}">${art.replace('role="img"', 'role="presentation" aria-hidden="true"').replace(/\saria-label="[^"]*"/, '')}</a>
      <span class="product-card__flag">${esc(product.flag)}</span>
    </div>
    <div class="product-card__body">
      <span class="product-card__line">${esc(line?.name || '')}</span>
      <h3><a href="${url}">${esc(product.name)}</a></h3>
      <p>${esc(product.short)}</p>
      <div class="product-card__foot">
        <div class="price">
          <strong>${money(product.sizes[0].price)}</strong>
          <span>${esc(product.sizes[0].label)} · ${product.sizes.length} ${product.sizes.length === 1 ? 'tamaño' : 'tamaños'}</span>
        </div>
        <a class="btn btn--solid btn--sm" href="${url}">Ver producto</a>
      </div>
    </div>
  </article>`;
}

function projectCard(project, root) {
  const url = href(root, `proyectos/${project.slug}/`);
  return `<article class="project-card" data-reveal>
    <div class="project-card__art" style="background:linear-gradient(150deg,${esc(project.tint)},${esc(project.accent)}55)">${projectArt(project)}</div>
    <div class="project-card__body">
      <div class="project-card__meta">
        <span class="project-card__cat">${esc(project.category)}</span>
        <span class="status status--${esc(project.statusTone)}">${esc(project.status)}</span>
      </div>
      <h3><a href="${url}">${esc(project.name)}</a></h3>
      <p>${esc(project.summary)}</p>
      <a class="link-btn" href="${url}">Conocer el proyecto ${icon('arrow-right')}</a>
    </div>
  </article>`;
}

function teamCard(member) {
  return `<article class="team-card" data-reveal>
    <div class="avatar">${esc(member.initials)}</div>
    <strong>${esc(member.name)}</strong>
    <span>${esc(member.role)}<br>${esc(member.area)}</span>
  </article>`;
}

function valuesGrid() {
  return `<div class="values-grid">${VALUES.map((v) => `
    <div class="value-item" data-reveal>
      ${icon(v.icon)}
      <div><strong>${esc(v.title)}</strong><p>${esc(v.text)}</p></div>
    </div>`).join('')}</div>`;
}

function processGrid() {
  return `<div class="process-grid">${PROCESS.map((p) => `
    <div class="process-step" data-reveal>
      <span class="n">${esc(p.n)}</span>
      <h3>${esc(p.title)}</h3>
      <p>${esc(p.text)}</p>
    </div>`).join('')}</div>`;
}

function faqAccordion(items) {
  return `<div class="accordion">${items.map(([q, a], i) => `
    <div class="acc-item${i === 0 ? ' is-open' : ''}">
      <button class="acc-btn" type="button" aria-expanded="${i === 0 ? 'true' : 'false'}">${esc(q)} ${icon('plus')}</button>
      <div class="acc-panel"><p>${esc(a)}</p></div>
    </div>`).join('')}</div>`;
}

/* ---------- Inicio ---------- */
function homePage(root) {
  const gluco = productById('gluco-original');
  const kefir = productById('kefir-fresa');
  const sano = lineById('sano-derma');
  const marquee = Array(2).fill(`<span>Fermentación viva</span><span>Ingredientes locales</span><span>Ciencia aplicada</span><span>Hecho en Coatzacoalcos</span><span>Biotecnología con origen</span>`).join('');

  return `
  <section class="hero">
    <div class="container hero-grid">
      <div class="hero-copy">
        <span class="eyebrow">Biotecnología alimentaria · Coatzacoalcos</span>
        <h1 class="display">Ciencia viva,<br><em>origen local.</em></h1>
        <p class="lead">En Biorigen desarrollamos fermentados y soluciones biotecnológicas que nacen en el aula y se prueban en la mesa. Yogurt de nopal, kéfir de leche y proyectos que crecen con nosotros.</p>
        <div class="hero-actions">
          <a class="btn btn--solid" href="${href(root, 'productos/')}">Explorar productos ${icon('arrow-right')}</a>
          <a class="btn btn--ghost" href="${href(root, 'nosotros/')}">Conoce Biorigen</a>
        </div>
        <div class="hero-meta">
          <div><strong>2</strong><span>líneas activas</span></div>
          <div><strong>6</strong><span>productos demo</span></div>
          <div><strong>3</strong><span>proyectos</span></div>
        </div>
      </div>
      <div class="hero-art" aria-hidden="true">
        <div class="hero-disc"></div>
        <div class="hero-note hand">fermentación viva,<br>hecha en casa.</div>
        <span class="hero-stamp">${icon('leaf')} Hecho en Coatzacoalcos</span>
        <div class="hero-product hero-product--yogurt">${ART.productArt(gluco)}<span class="hero-label">Gluco-Control</span></div>
        <div class="hero-product hero-product--kefir">${ART.productArt(kefir)}<span class="hero-label">Kéfir de fresa</span></div>
        <div class="hero-product hero-product--cream">${ART.lineArt(sano)}<span class="hero-label">SANO-DERMA · proyecto</span></div>
      </div>
    </div>
    <div class="hero-marquee" aria-hidden="true"><div class="hero-marquee__track">${marquee}</div></div>
  </section>

  <section class="values-strip">
    <div class="container">${valuesGrid()}</div>
  </section>

  <section class="section">
    <div class="container">
      ${sectionHead({
        eyebrow: 'Nuestras líneas',
        title: 'Dos formas de empezar.',
        lead: 'Un yogurt funcional de nopal y un kéfir de leche con cultivos vivos. Dos fermentados, una misma idea: hacer las cosas con origen y evidencia.',
        action: `<a class="link-btn" href="${href(root, 'productos/')}">Ver catálogo ${icon('arrow-right')}</a>`
      })}
      <div class="line-grid">
        <article class="line-card line-card--gluco" data-reveal>
          <div class="line-card__top">
            <span class="line-card__kind">Yogurt funcional</span>
            <span class="line-card__status">Disponible en demo</span>
          </div>
          <div class="line-card__body">
            <h3>Gluco-Control</h3>
            <p>Yogurt con mucílago de nopal, fibra soluble y cultivos vivos. Tres perfiles: Original, Endulzado y Afrutado.</p>
            <div class="line-card__flavors"><span>Original</span><span>Endulzado</span><span>Afrutado</span></div>
            <a class="line-card__link" href="${href(root, 'productos/gluco-control/')}">Conocer la línea ${icon('arrow-right')}</a>
          </div>
          <div class="line-card__art">${ART.lineArt(lineById('gluco-control'))}</div>
        </article>
        <article class="line-card line-card--kefir" data-reveal>
          <div class="line-card__top">
            <span class="line-card__kind">Fermentado de leche</span>
            <span class="line-card__status">Disponible en demo</span>
          </div>
          <div class="line-card__body">
            <h3>Kéfir</h3>
            <p>Kéfir de leche fermentado con gránulos vivos. Natural, fresa y coco. Sin conservadores, con textura cremosa.</p>
            <div class="line-card__flavors"><span>Natural</span><span>Fresa</span><span>Coco</span></div>
            <a class="line-card__link" href="${href(root, 'productos/kefir/')}">Conocer la línea ${icon('arrow-right')}</a>
          </div>
          <div class="line-card__art">${ART.lineArt(lineById('kefir'))}</div>
        </article>
      </div>
    </div>
  </section>

  <section class="section section--cream">
    <div class="container story-grid">
      <div class="story-media" data-reveal>
        <span class="story-seal">Biorigen<br>ITESCO<br>2026</span>
        ${ART.labSVG()}
        <div class="story-caption"><strong>Del aula a la mesa</strong>Un proyecto de Ingeniería Bioquímica que aprendió a fermentar, formular y explicarse.</div>
      </div>
      <div class="story-copy" data-reveal>
        <span class="eyebrow">Nuestra historia</span>
        <h2>De un proyecto de aula a una marca que fermenta ideas.</h2>
        <p class="lead">Biorigen nace de una pregunta sencilla: ¿qué pasa si aplicamos lo que aprendemos en el laboratorio a problemas que tenemos cerca? La respuesta fue un yogurt de nopal, después un kéfir, y luego una lista de proyectos que no deja de crecer.</p>
        <blockquote class="story-quote">“No queremos inventar un producto; queremos entender un proceso y hacerlo bien.”<cite>Equipo Biorigen</cite></blockquote>
        <ul class="story-points">
          <li>${icon('check')} Formulamos con ingredientes de la región.</li>
          <li>${icon('check')} Documentamos cada prueba y cada límite.</li>
          <li>${icon('check')} Convertimos el aula en un espacio de producción piloto.</li>
        </ul>
        <a class="btn btn--solid" href="${href(root, 'nosotros/')}">Conoce al equipo ${icon('arrow-right')}</a>
      </div>
    </div>
  </section>

  <section class="section">
    <div class="container">
      ${sectionHead({
        eyebrow: 'Cómo trabajamos',
        title: 'Fermentar también es investigar.',
        lead: 'No hay atajos: seleccionamos, fermentamos, formulamos y validamos. Cada lote deja un aprendizaje y una versión mejor.'
      })}
      ${processGrid()}
    </div>
  </section>

  <section class="section section--dark">
    <div class="container science-layout">
      <div class="science-intro" data-reveal>
        <span class="eyebrow">Ciencia Biorigen</span>
        <h2>Lo que no está probado, se dice.</h2>
        <p class="lead">Trabajamos con fermentación láctica, cultivos vivos y biocompuestos. También sabemos lo que todavía no sabemos: por eso las fichas son estimadas y los proyectos se presentan con su estado real.</p>
        <a class="link-btn" href="${href(root, 'ciencia/')}">Leer sobre nuestro enfoque ${icon('arrow-right')}</a>
      </div>
      <div class="science-grid">
        ${SCIENCE.map((s) => `<article class="science-card" data-reveal>${icon(s.icon)}<h3>${esc(s.title)}</h3><p>${esc(s.text)}</p></article>`).join('')}
      </div>
    </div>
  </section>

  <section class="section">
    <div class="container">
      ${sectionHead({
        eyebrow: 'Biorigen Labs',
        title: 'Proyectos que todavía están fermentando.',
        lead: 'Una crema de Ganoderma para heridas en personas con diabetes, barras energéticas en formulación y un biofertilizante fúngico en investigación. Distintos caminos, el mismo método.',
        action: `<a class="link-btn" href="${href(root, 'proyectos/')}">Ver todos ${icon('arrow-right')}</a>`
      })}
      <div class="project-grid">${PROJECTS.map((p) => projectCard(p, root)).join('')}</div>
    </div>
  </section>

  <section class="section section--tight">
    <div class="container">
      <div class="fair-band" data-reveal>
        <div class="fair-year">2026</div>
        <div class="fair-copy">
          <span class="eyebrow">Feria de Alimentos</span>
          <h3>Nos vemos en la feria.</h3>
          <p>Presentamos los prototipos de Gluco-Control y Kéfir, y compartimos el avance de SANO-DERMA. Si quieres probarlos o colaborar, escríbenos.</p>
        </div>
        <a class="btn btn--lime" href="${href(root, 'contacto/')}">Agendar una degustación ${icon('arrow-right')}</a>
      </div>
    </div>
  </section>

  <section class="section section--cream">
    <div class="container">
      ${sectionHead({
        eyebrow: 'Quiénes somos',
        title: 'Un equipo de Ingeniería Bioquímica.',
        lead: 'Cinco estudiantes del ITESCO, un asesor y muchas horas de laboratorio. Esto es Biorigen.',
        action: `<a class="link-btn" href="${href(root, 'nosotros/')}">Conoce al equipo ${icon('arrow-right')}</a>`
      })}
      <div class="team-grid">${TEAM.map(teamCard).join('')}</div>
      <div class="advisor-row" data-reveal>
        <div class="avatar">${esc(ADVISOR.name.split(/\s+/).slice(0, 2).map((w) => w[0]).join(''))}</div>
        <div><strong>${esc(ADVISOR.name)}</strong><span>${esc(ADVISOR.role)} · ${esc(ADVISOR.area)}</span></div>
      </div>
    </div>
  </section>

  <section class="section section--tight">
    <div class="container">
      <div class="cta-band" data-reveal>
        <div>
          <span class="eyebrow">Empecemos</span>
          <h2>¿Probamos un fermentado?</h2>
          <p>Explora el catálogo, simula un pedido o solicita una degustación. Todo el sitio es una demostración académica.</p>
        </div>
        <div class="cta-band__actions">
          <a class="btn btn--solid" href="${href(root, 'productos/')}">Ver productos ${icon('arrow-right')}</a>
          <button class="btn btn--ghost" type="button" data-open-tasting>Solicitar degustación</button>
        </div>
      </div>
    </div>
  </section>`;
}

/* ---------- Catálogo ---------- */
function catalogPage(root) {
  return `
  ${pageHero({
    root,
    eyebrow: 'Catálogo',
    title: 'Fermentados con nombre y apellido.',
    lead: 'Seis productos de demostración: tres yogures de nopal y tres kéfirs de leche. Elige sabor y tamaño; el carrito guarda tu selección.',
    actions: `<button class="btn btn--solid" type="button" data-open-tasting>${icon('sparkle')} Solicitar degustación</button><a class="btn btn--ghost" href="${href(root, 'contacto/')}">Hablar con el equipo</a>`,
    meta: `<span class="tag">Precios demo</span><span class="tag">Fichas estimadas</span><span class="tag">Hecho en Coatzacoalcos</span>`
  })}
  <section class="section section--tight">
    <div class="container">
      <div class="catalog-toolbar">
        <div class="filter-row" role="group" aria-label="Filtrar productos">
          <button class="filter-btn is-active" type="button" data-filter="all">Todos</button>
          <button class="filter-btn" type="button" data-filter="gluco-control">Gluco-Control</button>
          <button class="filter-btn" type="button" data-filter="kefir">Kéfir</button>
        </div>
        <span class="catalog-count" id="catalogCount">${PRODUCTS.length} productos</span>
      </div>
      <h2 class="sr-only">Catálogo de productos</h2>
      <div class="catalog-grid" id="catalogGrid">
        ${PRODUCTS.map((p) => productCard(p, root)).join('')}
        <div class="catalog-empty is-hidden" id="catalogEmpty">No hay productos en esta línea todavía.</div>
      </div>
      <div class="catalog-note" data-reveal>
        ${icon('info')}
        <div>
          <strong>Todo lo que ves es una demostración.</strong>
          <p>Los precios, presentaciones y fichas nutrimentales son estimaciones del prototipo. No se procesan pagos ni se realizan envíos reales. Cuando los análisis de laboratorio estén listos, esta información se actualizará.</p>
        </div>
      </div>
    </div>
  </section>
  <section class="section section--cream">
    <div class="container">
      ${tastingBand(root, '¿Quieres probarlo antes de comprar?', 'Organizamos degustaciones para la comunidad, instituciones y puntos de venta. Déjanos tus datos y el producto que te interesa.', null)}
    </div>
  </section>`;
}

/* ---------- Página de línea ---------- */
function flavorCard(product, root) {
  const url = href(root, `productos/${product.line}/${product.slug}/`);
  return `<article class="flavor-card" data-reveal>
    <div class="flavor-card__media" style="--tint:${esc(product.tint)};--tint2:${esc(product.tint2)}">${ART.productArt(product)}</div>
    <div class="flavor-card__body">
      <h3>${esc(product.shortName)}</h3>
      <p>${esc(product.short)}</p>
      <div class="flavor-card__foot">
        <div class="price"><strong>${money(product.sizes[0].price)}</strong><span>desde · ${esc(product.sizes[0].label)}</span></div>
        <a class="btn btn--sm btn--solid" href="${url}">Elegir ${icon('arrow-right')}</a>
      </div>
    </div>
  </article>`;
}

function linePage(line, root) {
  const products = PRODUCTS.filter((p) => p.line === line.id);
  const sizeLabels = [...new Set(products.flatMap((p) => p.sizes.map((s) => s.label)))];
  const isGluco = line.id === 'gluco-control';
  const title = isGluco
    ? 'Gluco-Control: yogurt de nopal, fermentación viva.'
    : 'Kéfir: leche fermentada, cultivos vivos.';
  const lead = isGluco
    ? 'Un yogurt funcional con mucílago de nopal, fibra soluble y cultivos vivos. Tres perfiles para distintos momentos del día: Original, Endulzado y Afrutado.'
    : 'Una bebida fermentada de leche con gránulos vivos de bacterias y levaduras. Natural, fresa y coco. Textura cremosa, sabor ácido y una comunidad microbiana que hace el trabajo.';
  const bullets = isGluco
    ? ['Mucílago de nopal como fibra soluble', 'Cultivos lácticos vivos', 'Original sin azúcar añadida', 'Tres perfiles de sabor']
    : ['Gránulos de kéfir vivos', 'Fermentación artesanal de 24 a 48 h', 'Sin conservadores ni colorantes', 'Natural, fresa y coco'];
  const specs = isGluco
    ? [['Línea', 'Gluco-Control'], ['Productos', '3 sabores'], ['Presentaciones', '150 g y 400 g'], ['Conservación', '2–6 °C · 21 días'], ['Estado', 'Prototipo · demo']]
    : [['Línea', 'Kéfir'], ['Productos', '3 sabores'], ['Presentaciones', '250 ml, 500 ml y 1 L'], ['Conservación', '2–6 °C · 14 días'], ['Estado', 'Prototipo · demo']];
  const note = isGluco
    ? 'Fichas estimadas del prototipo. Los valores nutrimentales se actualizarán con los análisis de laboratorio.'
    : 'Contiene lactosa y puede contener trazas de alcohol (&lt;0.5 %). No es una bebida alcohólica. Personas inmunocomprometidas o embarazadas deben consultar a un profesional de la salud.';

  return `
  <section class="line-hero" style="--tint:${esc(line.tint)};--tint2:${esc(line.tint2)}">
    <div class="container">
      ${breadcrumb(root, [{ label: 'Inicio', path: '' }, { label: 'Productos', path: 'productos/' }, { label: line.name }])}
      <div class="line-hero__grid">
        <div class="line-hero__copy">
          <span class="eyebrow">${esc(line.kind)}</span>
          <h1>${title}</h1>
          <p class="lead">${lead}</p>
          <div class="line-hero__actions">
            <a class="btn btn--solid" href="#sabores">Elegir sabor ${icon('arrow-right')}</a>
            <button class="btn btn--ghost" type="button" data-open-tasting>${icon('sparkle')} Solicitar degustación</button>
          </div>
          <div class="line-stats">
            <div><strong>${products.length}</strong><span>sabores</span></div>
            <div><strong>${sizeLabels.length}</strong><span>presentaciones</span></div>
            <div><strong>100%</strong><span>fermentación viva</span></div>
          </div>
        </div>
        <div class="line-hero__art">
          <span class="line-hero__stamp">${esc(line.status)}</span>
          ${ART.lineArt(line)}
          <span class="line-hero__note">${isGluco ? 'sin azúcar añadida' : 'agita antes de servir'}</span>
        </div>
      </div>
    </div>
  </section>

  <section class="section" id="sabores">
    <div class="container">
      ${sectionHead({
        eyebrow: 'Sabores',
        title: 'Elige tu favorito.',
        lead: isGluco
          ? 'Tres formas de tomar el mismo fermentado: sin endulzar, con un toque dulce o con fruta de temporada.'
          : 'La misma base de kéfir, tres acentos distintos. Todos se fermentan con gránulos vivos y se sirven bien fríos.'
      })}
      <div class="flavor-grid">${products.map((p) => flavorCard(p, root)).join('')}</div>
    </div>
  </section>

  <section class="section section--cream">
    <div class="container line-info-grid">
      <div data-reveal>
        <span class="eyebrow">Qué hace diferente</span>
        <h2>${isGluco ? 'Fibra, cultivos y un sabor honesto.' : 'Una fermentación que se nota.'}</h2>
        <p class="lead">${isGluco
          ? 'El mucílago del nopal retiene agua y aporta cuerpo. Los cultivos lácticos transforman la leche y crean acidez. La canela redondea. No hay milagros: hay un proceso cuidado.'
          : 'El kéfir no se hace con un solo cultivo. Sus gránulos contienen bacterias lácticas y levaduras que fermentan la leche y producen una textura cremosa, un sabor ácido y compuestos que no aparecen en un yogurt convencional.'}</p>
        <ul class="line-info-list">${bullets.map((b) => `<li>${icon('check')} ${esc(b)}</li>`).join('')}</ul>
        <div class="mt-2">${notice(`<strong>Prototipo estimado.</strong> ${note}`)}</div>
      </div>
      <div data-reveal>
        <span class="eyebrow">Ficha de la línea</span>
        <h2>En números.</h2>
        <div class="line-specs">
          ${specs.map(([k, v]) => `<div class="line-specs__row"><span>${esc(k)}</span><strong>${v}</strong></div>`).join('')}
        </div>
        <p class="form-note" style="margin-top:12px">Precios de demostración. No se procesan pagos ni se realizan envíos reales.</p>
      </div>
    </div>
  </section>

  <section class="section">
    <div class="container">
      ${tastingBand(root, 'Lleva la línea a tu mesa.', 'Solicita una degustación para tu familia, tu negocio o tu institución. Registramos la solicitud en esta demostración.', null)}
    </div>
  </section>`;
}

/* ---------- Página de producto ---------- */
function productPage(product, root) {
  const line = lineById(product.line);
  const related = [
    ...PRODUCTS.filter((p) => p.line === product.line && p.id !== product.id),
    ...PRODUCTS.filter((p) => p.line !== product.line)
  ].slice(0, 3);
  const first = product.sizes[0];
  const flavors = PRODUCTS.filter((p) => p.line === product.line);
  const isKefir = product.line === 'kefir';

  return `
  <section class="product-hero" style="--tint:${esc(product.tint)};--tint2:${esc(product.tint2)}">
    <div class="container">
      ${breadcrumb(root, [
        { label: 'Inicio', path: '' },
        { label: 'Productos', path: 'productos/' },
        { label: line.name, path: `productos/${line.slug}/` },
        { label: product.shortName }
      ])}
      <div class="product-hero__grid" data-product-page="${esc(product.id)}">
        <div class="product-gallery">
          <span class="product-gallery__flag">Prototipo</span>
          <div class="product-gallery__art">${ART.productArt(product)}</div>
          <div class="product-gallery__caption">
            <span>Ficha estimada · pendiente de análisis</span>
            <span class="tag">${esc(line.name)}</span>
          </div>
        </div>
        <div class="product-info">
          <span class="eyebrow">${esc(line.name)} · ${esc(line.kind)}</span>
          <h1>${esc(product.name)}</h1>
          <p class="product-tagline">${esc(product.tagline)}</p>
          <div class="product-badges">
            ${product.badges.map((b) => `<span class="tag">${esc(b)}</span>`).join('')}
            <button class="btn btn--ghost btn--sm" type="button" data-fav="${esc(product.id)}" aria-pressed="false">${icon('heart')} Guardar</button>
          </div>
          ${flavors.length > 1 ? `<div class="picker picker--flavor">
            <div class="picker__head"><span>Sabor</span><span>${esc(product.flavor)}</span></div>
            <div class="flavor-options">
              ${flavors.map((p) => p.id === product.id
                ? `<span class="flavor-opt is-active" aria-current="page">${esc(p.flavor)}</span>`
                : `<a class="flavor-opt" href="${href(root, `productos/${line.slug}/${p.slug}/`)}">${esc(p.flavor)}</a>`
              ).join('')}
            </div>
          </div>` : ''}
          <div class="price-row">
            <span class="price-now" id="priceNow">${money(first.price)}</span>
            <s class="price-old" id="priceOld" ${first.compare ? '' : 'hidden'}>${money(first.compare)}</s>
            <span class="price-unit" id="priceUnit">/ ${esc(first.label)}</span>
            ${first.compare ? `<span class="price-save" id="priceSave">Ahorras ${money(first.compare - first.price)}</span>` : `<span class="price-save" id="priceSave" hidden></span>`}
          </div>
          <div class="picker">
            <div class="picker__head"><span>Tamaño</span><span id="sizeLabel">${esc(first.label)}</span></div>
            <div class="size-options">
              ${product.sizes.map((s, i) => `<button class="size-opt${i === 0 ? ' is-active' : ''}" type="button" data-size="${esc(s.id)}" aria-pressed="${i === 0}">${esc(s.label)}<small>${money(s.price)}</small></button>`).join('')}
            </div>
          </div>
          <div class="buy-row">
            <div class="qty">
              <button type="button" id="qtyMinus" aria-label="Quitar una unidad">${icon('minus')}</button>
              <input id="qtyInput" type="number" min="1" max="20" value="1" aria-label="Cantidad">
              <button type="button" id="qtyPlus" aria-label="Añadir una unidad">${icon('plus')}</button>
            </div>
            <button class="btn btn--solid" type="button" data-add-to-cart data-product="${esc(product.id)}" data-size="${esc(first.id)}">${icon('cart')} Añadir al carrito</button>
            <button class="btn btn--ghost" type="button" data-tasting="${esc(product.id)}">${icon('sparkle')} Solicitar degustación</button>
          </div>
          <ul class="product-perks">${product.benefits.map((b) => `<li>${icon('check')} ${esc(b)}</li>`).join('')}</ul>
          ${notice(`<strong>Ficha de prototipo.</strong> Los valores nutrimentales son estimaciones del prototipo y están pendientes de análisis de laboratorio. Los precios son de demostración.`)}
          <a class="tasting-link" href="#" data-tasting="${esc(product.id)}">¿Quieres probarlo antes? Solicita una degustación ${icon('arrow-right')}</a>
        </div>
      </div>
    </div>
  </section>

  <section class="section section--tight">
    <div class="container product-tabs" data-reveal>
      <h2 class="sr-only">Ficha del producto</h2>
      <div class="tab-list" role="tablist" aria-label="Ficha del producto">
        <button class="tab-btn is-active" type="button" role="tab" aria-selected="true" aria-controls="tab-ingredientes" data-tab="ingredientes">Ingredientes</button>
        <button class="tab-btn" type="button" role="tab" aria-selected="false" aria-controls="tab-nutricion" data-tab="nutricion">Perfil nutrimental</button>
        <button class="tab-btn" type="button" role="tab" aria-selected="false" aria-controls="tab-conservacion" data-tab="conservacion">Conservación y uso</button>
      </div>
      <div class="tab-panel is-active" id="tab-ingredientes" role="tabpanel">
        <h3>Ingredientes</h3>
        <p>${esc(product.ingredients)}</p>
        <ul>${product.benefits.map((b) => `<li>${icon('check')} ${esc(b)}</li>`).join('')}</ul>
        ${isKefir ? `<div class="mt-2">${notice('<strong>Contiene lactosa.</strong> La fermentación puede producir trazas de alcohol por debajo del 0.5 %. No es una bebida alcohólica. Personas inmunocomprometidas, embarazadas o con intolerancia severa a la lactosa deben consultar a un profesional de la salud.')}</div>` : ''}
      </div>
      <div class="tab-panel" id="tab-nutricion" role="tabpanel">
        <h3>Perfil nutrimental estimado</h3>
        <table class="nutrition">
          <caption>Por ${esc(first.label)} · valores estimados del prototipo</caption>
          <tbody>${product.nutrition.map(([k, v]) => `<tr><td>${esc(k)}</td><td>${esc(v)}</td></tr>`).join('')}</tbody>
        </table>
        <p class="nutrition-note">Estimación del prototipo. No sustituye un análisis de laboratorio ni una tabla nutrimental oficial.</p>
      </div>
      <div class="tab-panel" id="tab-conservacion" role="tabpanel">
        <h3>Conservación</h3>
        <p>${esc(product.conservation)}</p>
        <h3>Modo de uso</h3>
        <p>${esc(product.usage)}</p>
        <ul>
          <li>${icon('check')} Mantén la cadena de frío.</li>
          <li>${icon('check')} No congelar.</li>
          <li>${icon('check')} Consumir preferentemente antes de la fecha indicada.</li>
        </ul>
      </div>
    </div>
  </section>

  <section class="section">
    <div class="container product-details-grid">
      <div data-reveal>
        <span class="eyebrow">Cómo se disfruta</span>
        <h2>Un producto para la mesa, no para el estante.</h2>
        <p>${esc(product.usage)}</p>
        <ul class="story-points" style="margin-top:16px">
          <li>${icon('clock')} ${esc(product.conservation)}</li>
          <li>${icon('leaf')} Elaborado con ingredientes naturales.</li>
          <li>${icon('shield')} Prototipo académico, sin conservadores añadidos.</li>
        </ul>
        ${notice(`<strong>Recuerda:</strong> este producto es un prototipo de demostración. No sustituye una alimentación equilibrada ni la recomendación de un profesional de la salud.`)}
      </div>
      <div data-reveal>
        <span class="eyebrow">Ficha técnica</span>
        <h2>Los datos, claros.</h2>
        <div class="detail-list">
          <div><span>Línea</span><strong>${esc(line.name)}</strong></div>
          <div><span>Sabor</span><strong>${esc(product.flavor)}</strong></div>
          <div><span>Presentaciones</span><strong>${product.sizes.map((s) => esc(s.label)).join(' · ')}</strong></div>
          <div><span>Conservación</span><strong>${esc(product.conservation.split('.')[0])}</strong></div>
          <div><span>Estado</span><strong>Prototipo · demo</strong></div>
        </div>
        <div class="accordion" style="margin-top:24px">${faqAccordion(product.faq)}</div>
      </div>
    </div>
  </section>

  <section class="section section--cream">
    <div class="container">
      ${sectionHead({
        eyebrow: 'También te puede gustar',
        title: 'Otros sabores para probar.',
        lead: 'La misma línea, distintos perfiles. Todos los productos son parte de la demostración.'
      })}
      <div class="related-grid">${related.map((p) => productCard(p, root)).join('')}</div>
    </div>
  </section>

  <section class="section section--tight">
    <div class="container">
      ${tastingBand(root, 'Pruébalo antes de decidir.', 'Solicita una degustación de este producto. Registramos tus datos y el producto de interés en esta demostración.', product.id)}
    </div>
  </section>`;
}

/* ---------- Nosotros ---------- */
function aboutPage(root) {
  const timeline = [
    ['2024', 'Las primeras pruebas', 'En el laboratorio de Ingeniería Bioquímica del ITESCO empezamos a fermentar yogurt con mucílago de nopal. La pregunta era si la fibra podía mejorar la textura sin azúcar añadida.'],
    ['2025', 'Gluco-Control y SANO-DERMA', 'Gluco-Control se presenta en InnovaTecNM. En paralelo, el equipo de SANO-DERMA trabaja en una crema cicatrizante de Ganoderma lucidum para personas con diabetes.'],
    ['2026', 'Nace Biorigen', 'La marca se estructura para englobar las líneas: yogurt, kéfir y proyectos. Sumamos el kéfir de leche y abrimos Biorigen Labs para las ideas que vienen.']
  ];

  return `
  <section class="section section--tight">
    <div class="container">
      ${breadcrumb(root, [{ label: 'Inicio', path: '' }, { label: 'Nosotros' }])}
      <div class="about-hero" style="margin-top:18px">
        <div>
          <span class="eyebrow">Nosotros</span>
          <h1>Somos Biorigen.</h1>
          <p class="lead">Una marca de biotecnología alimentaria nacida en el ITESCO. No somos una empresa consolidada: somos un equipo que está aprendiendo a serlo, con métodos de laboratorio y una obsesión por hacer las cosas con origen.</p>
          <div class="page-hero__actions">
            <a class="btn btn--solid" href="${href(root, 'productos/')}">Ver productos ${icon('arrow-right')}</a>
            <a class="btn btn--ghost" href="${href(root, 'contacto/')}">Hablemos</a>
          </div>
        </div>
        <div class="about-media" data-reveal>
          <span class="about-media__seal">Biorigen<br>ITESCO<br>2026</span>
          ${ART.labSVG()}
          <div class="about-media__caption">Del laboratorio a la mesa. Del aula a la comunidad.</div>
        </div>
      </div>
    </div>
  </section>

  <section class="section section--cream">
    <div class="container">
      <div class="story-grid">
        <div class="story-copy" data-reveal>
          <span class="eyebrow">Nuestra historia</span>
          <h2>La bioquímica como punto de partida.</h2>
          <p>Biorigen une dos palabras: <strong>bioquímica</strong> y <strong>origen</strong>. La primera es el método; la segunda es la materia prima. Nacimos en Coatzacoalcos, una ciudad con una enorme riqueza natural y una necesidad concreta de alternativas alimentarias y de salud.</p>
          <p>El primer producto fue un yogurt de nopal. Después llegó el kéfir. Hoy la marca también cobija proyectos de investigación que no están a la venta: una crema de Ganoderma para heridas en personas con diabetes, barras energéticas en formulación y un biofertilizante fúngico en etapa temprana.</p>
          <blockquote class="story-quote">“No queremos vender una promesa. Queremos mostrar el proceso, los límites y lo que sigue.”<cite>Equipo Biorigen</cite></blockquote>
        </div>
        <div class="story-media" data-reveal>
          <span class="story-seal">Ciencia<br>viva<br>2026</span>
          ${ART.lineArt(lineById('gluco-control'))}
          <div class="story-caption"><strong>Fermentación viva</strong>El centro de todo lo que hacemos: cultivos activos, tiempo y temperatura.</div>
        </div>
      </div>
    </div>
  </section>

  <section class="section">
    <div class="container">
      ${sectionHead({
        eyebrow: 'Línea de tiempo',
        title: 'Cómo llegamos hasta aquí.',
        lead: 'Tres años de pruebas, presentaciones y preguntas nuevas. Esto es lo que ha cambiado.'
      })}
      <div class="timeline">
        ${timeline.map(([year, title, text]) => `<div class="timeline__item" data-reveal><div class="timeline__year">${year}</div><div class="timeline__body"><h3>${esc(title)}</h3><p>${esc(text)}</p></div></div>`).join('')}
      </div>
    </div>
  </section>

  <section class="section section--cream">
    <div class="container">
      ${sectionHead({ eyebrow: 'Lo que nos mueve', title: 'Cuatro principios, no un eslogan.', lead: 'No siempre los cumplimos al cien por ciento. Pero son la dirección.' })}
      ${valuesGrid()}
    </div>
  </section>

  <section class="section">
    <div class="container">
      ${sectionHead({
        eyebrow: 'Equipo',
        title: 'Las personas detrás de la marca.',
        lead: 'Estudiantes de Ingeniería Bioquímica del ITESCO, con el acompañamiento de un asesor académico.'
      })}
      <div class="team-grid">${TEAM.map(teamCard).join('')}</div>
      <div class="advisor-row" data-reveal>
        <div class="avatar">${esc(ADVISOR.name.split(/\s+/).slice(0, 2).map((w) => w[0]).join(''))}</div>
        <div><strong>${esc(ADVISOR.name)}</strong><span>${esc(ADVISOR.role)} · ${esc(ADVISOR.area)}</span></div>
      </div>
    </div>
  </section>

  <section class="section section--tight">
    <div class="container">
      <div class="about-quote" data-reveal>
        <blockquote>“El origen no es solo de dónde vienes. Es también lo que decides hacer con lo que tienes.”</blockquote>
        <cite>Biorigen · Coatzacoalcos</cite>
      </div>
    </div>
  </section>

  <section class="section section--tight">
    <div class="container">
      <div class="cta-band" data-reveal>
        <div><span class="eyebrow">Siguiente paso</span><h2>¿Colaboramos?</h2><p>Buscamos espacios para degustaciones, aliados para validación y personas que quieran sumar.</p></div>
        <div class="cta-band__actions"><a class="btn btn--solid" href="${href(root, 'contacto/')}">Contacto ${icon('arrow-right')}</a><a class="btn btn--ghost" href="${href(root, 'proyectos/')}">Ver proyectos</a></div>
      </div>
    </div>
  </section>`;
}

/* ---------- Ciencia ---------- */
function sciencePage(root) {
  return `
  ${pageHero({
    root,
    eyebrow: 'Ciencia',
    title: 'Ciencia que se puede explicar.',
    lead: 'Fermentación láctica, cultivos vivos y biocompuestos. Lo que sabemos, lo que estamos probando y lo que todavía no podemos afirmar.',
    actions: `<a class="btn btn--solid" href="${href(root, 'productos/')}">Ver los fermentados ${icon('arrow-right')}</a><a class="btn btn--ghost" href="${href(root, 'proyectos/')}">Proyectos de investigación</a>`
  })}
  <section class="section section--tight">
    <div class="container science-hero-grid">
      <div data-reveal>
        <span class="eyebrow">Nuestro enfoque</span>
        <h2>No vendemos milagros.</h2>
        <p class="lead">Un fermentado no es un medicamento. Un probiótico no sustituye una dieta. Un extracto no es una cura. En Biorigen partimos de esa honestidad para formular, probar y comunicar.</p>
        <p>Lo que sí podemos hacer es controlar el proceso: elegir materias primas, activar cultivos, medir acidez, ajustar textura y documentar cada lote. La ciencia está en los detalles que no se ven.</p>
      </div>
      <div class="science-hero-art" data-reveal>${ART.labSVG()}</div>
    </div>
  </section>

  <section class="section section--cream">
    <div class="container">
      ${sectionHead({ eyebrow: 'Cuatro frentes', title: 'Lo que estudiamos.', lead: 'Cada producto y cada proyecto se apoya en uno o varios de estos frentes.' })}
      <div class="pillar-grid">
        ${SCIENCE.map((s) => `<article class="pillar" data-reveal>${icon(s.icon)}<h3>${esc(s.title)}</h3><p>${esc(s.text)}</p></article>`).join('')}
      </div>
    </div>
  </section>

  <section class="section">
    <div class="container">
      ${sectionHead({ eyebrow: 'Método', title: 'Cuatro pasos, todos los días.', lead: 'El mismo proceso para un yogurt, un kéfir o una crema.' })}
      ${processGrid()}
    </div>
  </section>

  <section class="section section--dark">
    <div class="container">
      <div class="science-layout">
        <div class="science-intro" data-reveal>
          <span class="eyebrow">Transparencia</span>
          <h2>Lo que todavía no sabemos.</h2>
          <p class="lead">Las fichas nutrimentales de esta demostración son estimaciones. No tenemos análisis microbiológicos publicados. El kéfir puede contener trazas de alcohol. SANO-DERMA no es un medicamento ni está a la venta.</p>
        </div>
        <div class="science-grid">
          <article class="science-card" data-reveal>${icon('flask')}<h3>Fichas estimadas</h3><p>Los valores nutrimentales se calcularon a partir de la formulación del prototipo. Se actualizarán con análisis de laboratorio.</p></article>
          <article class="science-card" data-reveal>${icon('bacteria')}<h3>Microbiología pendiente</h3><p>Falta caracterizar la comunidad microbiana de cada lote y confirmar la viabilidad de los cultivos.</p></article>
          <article class="science-card" data-reveal>${icon('shield')}<h3>Validación clínica</h3><p>SANO-DERMA requiere pruebas de compatibilidad, eficacia y registro sanitario antes de cualquier uso comercial.</p></article>
          <article class="science-card" data-reveal>${icon('leaf')}<h3>Escalamiento</h3><p>Producir en el aula no es lo mismo que producir a escala. Estamos aprendiendo qué cambia cuando el volumen crece.</p></article>
        </div>
      </div>
    </div>
  </section>

  <section class="section">
    <div class="container">
      <div class="science-disclaimer" data-reveal>
        <strong>Nota importante.</strong> Ningún producto de este sitio sustituye un tratamiento médico, un diagnóstico ni una alimentación equilibrada. Si tienes una condición de salud, consulta a un profesional. La información nutrimental es una estimación del prototipo y no una declaración oficial.
      </div>
      <div class="mt-3">${tastingBand(root, 'La ciencia también se prueba.', 'Si te interesa conocer los prototipos, solicita una degustación o escríbenos para colaborar.', null)}</div>
    </div>
  </section>`;
}

/* ---------- Proyectos ---------- */
function projectsPage(root) {
  const sano = projectById('sano-derma');
  return `
  ${pageHero({
    root,
    eyebrow: 'Proyectos',
    title: 'Ideas que todavía están fermentando.',
    lead: 'Biorigen Labs reúne los proyectos académicos y personales que no caben en una sola línea de producto. Algunos ya tienen formulación; otros apenas empiezan.',
    actions: `<a class="btn btn--solid" href="${href(root, 'contacto/')}">Proponer una colaboración ${icon('arrow-right')}</a><a class="btn btn--ghost" href="${href(root, 'ciencia/')}">Nuestro enfoque</a>`,
    meta: `<span class="tag">Salud humana</span><span class="tag">Alimentación funcional</span><span class="tag">Agroindustria</span>`
  })}
  <section class="section section--tight">
    <div class="container">
      <div class="project-feature" data-reveal>
        <div class="project-feature__art">${projectArt(sano)}</div>
        <div>
          <div class="project-card__meta">
            <span class="project-card__cat">${esc(sano.category)}</span>
            <span class="status status--${esc(sano.statusTone)}">${esc(sano.status)}</span>
          </div>
          <h2>${esc(sano.name)}</h2>
          <p class="lead">${esc(sano.summary)}</p>
          <p>Un proyecto de investigación en salud humana que integra extractos de Ganoderma lucidum en una base dermatológica. Nació en InnovaTecNM 2025 y hoy se encuentra en etapa de validación y registro.</p>
          <div class="project-feature__actions">
            <a class="btn btn--solid" href="${href(root, 'proyectos/sano-derma/')}">Conocer el proyecto ${icon('arrow-right')}</a>
            <a class="btn btn--ghost" href="${href(root, 'contacto/')}">Contactar</a>
          </div>
        </div>
      </div>
    </div>
  </section>

  <section class="section">
    <div class="container">
      ${sectionHead({ eyebrow: 'Biorigen Labs', title: 'Tres proyectos, tres etapas.', lead: 'No todos están disponibles. No todos están terminados. Así se ve el avance real.' })}
      <div class="project-grid">${PROJECTS.map((p) => projectCard(p, root)).join('')}</div>
      <div class="catalog-note" data-reveal>
        ${icon('info')}
        <div><strong>No todo se vende.</strong><p>SANO-DERMA no es un medicamento ni un producto a la venta. Las barras y el biofertilizante son conceptos en desarrollo. Si te interesa colaborar en cualquiera de ellos, escríbenos.</p></div>
      </div>
    </div>
  </section>

  <section class="section section--cream">
    <div class="container">
      ${tastingBand(root, '¿Tienes una idea que fermentar?', 'Buscamos aliados académicos, instituciones y personas que quieran sumar a nuestros proyectos. También puedes pedir una degustación de los productos que ya existen.', null)}
    </div>
  </section>`;
}

function projectPage(project, root) {
  const related = PROJECTS.filter((p) => p.id !== project.id).slice(0, 2);
  const isSano = project.id === 'sano-derma';
  return `
  <section class="project-hero" style="--tint:${esc(project.tint)};--tint2:#FBF8F0">
    <div class="container">
      ${breadcrumb(root, [{ label: 'Inicio', path: '' }, { label: 'Proyectos', path: 'proyectos/' }, { label: project.name }])}
      <div class="project-hero__grid">
        <div>
          <div class="project-hero__meta">
            <span class="status status--${esc(project.statusTone)}">${esc(project.status)}</span>
            <span class="tag">${esc(project.category)}</span>
            <span class="tag">${esc(project.year)}</span>
          </div>
          <h1>${esc(project.name)}</h1>
          <p class="lead">${esc(project.summary)}</p>
          <div class="project-hero__actions">
            <a class="btn btn--solid" href="${href(root, 'contacto/')}">${esc(project.cta)} ${icon('arrow-right')}</a>
            <a class="btn btn--ghost" href="${href(root, 'proyectos/')}">Ver todos los proyectos</a>
          </div>
        </div>
        <div class="project-hero__art">${projectArt(project)}</div>
      </div>
    </div>
  </section>

  <section class="section">
    <div class="container project-layout">
      <div class="project-main">
        <h2 class="sr-only">Detalles del proyecto</h2>
        <p class="lead">${esc(project.description)}</p>
        <p>${esc(project.long)}</p>

        <h3>Lo que lo hace diferente</h3>
        <div class="highlight-grid">
          ${project.highlights.map(([title, text]) => `<div class="highlight" data-reveal><strong>${esc(title)}</strong><p>${esc(text)}</p></div>`).join('')}
        </div>

        <h3>Cómo avanza</h3>
        <div class="project-steps">
          ${project.process.map(([title, text], i) => `<div class="project-step"><div class="project-step__n">${i + 1}</div><div><strong>${esc(title)}</strong><p>${esc(text)}</p></div></div>`).join('')}
        </div>

        <h3>Próximos pasos</h3>
        <ul class="story-points">
          ${project.next.map((n) => `<li>${icon('check')} ${esc(n)}</li>`).join('')}
        </ul>

        <h3>Equipo</h3>
        <div class="project-side__team" style="margin-bottom:10px">
          ${project.team.map((t) => `<span>${esc(t)}</span>`).join('')}
        </div>
        ${project.advisors.length ? `<p class="form-note">Asesor: ${project.advisors.map(esc).join(', ')}</p>` : ''}

        <div class="project-disclaimer">
          <strong>Aviso importante</strong>
          ${esc(project.disclaimer)}
        </div>
      </div>

      <aside class="project-side">
        <h3>Ficha del proyecto</h3>
        <div class="detail-list">
          <div><span>Categoría</span><strong>${esc(project.category)}</strong></div>
          <div><span>Estado</span><strong>${esc(project.status)}</strong></div>
          <div><span>Año</span><strong>${esc(project.year)}</strong></div>
          <div><span>Línea</span><strong>Biorigen Labs</strong></div>
        </div>
        <h3 style="margin-top:18px">Etiquetas</h3>
        <div class="project-hero__meta">${project.tags.map((t) => `<span class="tag">${esc(t)}</span>`).join('')}</div>
        <a class="btn btn--solid btn--block" href="${href(root, 'contacto/')}" style="margin-top:18px">${esc(project.cta)}</a>
        <p class="form-note">${isSano ? 'Proyecto de investigación. No es un medicamento ni un producto a la venta.' : 'Proyecto en desarrollo. La información se actualizará cuando haya resultados.'}</p>
      </aside>
    </div>
  </section>

  <section class="section section--cream">
    <div class="container">
      ${sectionHead({ eyebrow: 'Sigue explorando', title: 'Otros proyectos.', lead: 'Cada proyecto tiene su propio ritmo y su propio estado.' })}
      <div class="project-grid">${related.map((p) => projectCard(p, root)).join('')}</div>
    </div>
  </section>

  <section class="section section--tight">
    <div class="container">
      ${tastingBand(root, '¿Te interesa este proyecto?', 'Podemos compartir el avance, buscar validación o explorar una colaboración. Escríbenos y platiquemos.', null)}
    </div>
  </section>`;
}

/* ---------- Contacto ---------- */
function contactPage(root) {
  return `
  ${pageHero({
    root,
    eyebrow: 'Contacto',
    title: 'Hablemos de fermentación.',
    lead: '¿Quieres probar los productos, solicitar una degustación, colaborar en un proyecto o llevar Biorigen a tu negocio? Escríbenos.',
    actions: `<button class="btn btn--solid" type="button" data-open-tasting>${icon('sparkle')} Solicitar degustación</button><a class="btn btn--ghost" href="mailto:${esc(SITE.email)}">Escribir por correo</a>`
  })}
  <section class="section section--tight">
    <div class="container contact-grid">
      <div class="contact-form-card" data-reveal>
        <span class="eyebrow">Escríbenos</span>
        <h2 style="font-size:clamp(1.7rem,3vw,2.3rem);margin-bottom:8px">Cuéntanos qué necesitas.</h2>
        <p class="muted" style="font-size:12px;margin-bottom:18px">Este formulario es parte de la demostración: el mensaje se guarda en tu navegador y no se envía por correo.</p>
        <form id="contactForm" novalidate>
          <div class="form-grid">
            <div class="field">
              <label for="contactName">Nombre</label>
              <input class="input" id="contactName" name="name" autocomplete="name" required>
            </div>
            <div class="field">
              <label for="contactEmail">Correo</label>
              <input class="input" id="contactEmail" name="email" type="email" autocomplete="email" required>
            </div>
            <div class="field field--full">
              <label for="contactSubject">Asunto</label>
              <input class="input" id="contactSubject" name="subject" placeholder="Degustación, colaboración, compra...">
            </div>
            <div class="field field--full">
              <label for="contactMessage">Mensaje</label>
              <textarea class="textarea" id="contactMessage" name="message" required placeholder="Cuéntanos quién eres y qué tienes en mente."></textarea>
            </div>
          </div>
          <label class="check" style="margin-top:12px">
            <input type="checkbox" id="contactConsent" required>
            Acepto que Biorigen me contacte para responder a este mensaje.
          </label>
          <p class="form-status" id="contactStatus" role="status"></p>
          <button class="btn btn--solid btn--block" type="submit" style="margin-top:8px">Enviar mensaje</button>
          <p class="form-note">También puedes escribir directamente a <a href="mailto:${esc(SITE.email)}" style="text-decoration:underline">${esc(SITE.email)}</a>.</p>
        </form>
      </div>
      <div>
        <div class="contact-cards">
          <div class="contact-card" data-reveal>
            ${icon('mail')}
            <h3>Correo</h3>
            <a href="mailto:${esc(SITE.email)}">${esc(SITE.email)}</a>
          </div>
          <div class="contact-card" data-reveal>
            ${icon('phone')}
            <h3>Teléfono</h3>
            <a href="tel:${esc(SITE.phoneHref)}">${esc(SITE.phone)}</a>
          </div>
          <div class="contact-card" data-reveal>
            ${icon('map-pin')}
            <h3>Base</h3>
            <p>${esc(SITE.address)}<br>${esc(SITE.school)}</p>
          </div>
        </div>
        <div class="contact-map" style="margin-top:12px" data-reveal>
          <div class="contact-map__pin">${icon('map-pin')}</div>
          <span class="contact-map__label">Coatzacoalcos, Veracruz · ITESCO</span>
        </div>
      </div>
    </div>
  </section>

  <section class="section section--cream">
    <div class="container">
      ${sectionHead({ eyebrow: 'Preguntas frecuentes', title: 'Antes de escribir.', lead: 'Las dudas que más nos hacen. Si la tuya no está, escríbenos.' })}
      ${faqAccordion(FAQ)}
    </div>
  </section>

  <section class="section section--tight">
    <div class="container">
      ${notice(`<strong>Demostración académica.</strong> Este sitio no procesa pagos ni envíos reales. Los datos que escribes se guardan solo en tu navegador. Para contactar al equipo fuera de la demo, usa el correo ${esc(SITE.email)}.`)}
    </div>
  </section>`;
}

/* ---------- Aviso académico ---------- */
function legalPage(root) {
  return `
  <section class="section section--tight">
    <div class="container legal-page">
      ${breadcrumb(root, [{ label: 'Inicio', path: '' }, { label: 'Aviso académico' }])}
      <span class="eyebrow" style="margin-top:18px">Aviso académico</span>
      <h1>Lo que este sitio es y lo que no es.</h1>
      <p class="lead">Biorigen es un proyecto académico del Instituto Tecnológico Superior de Coatzacoalcos. Este sitio presenta prototipos, proyectos de investigación y una tienda de demostración.</p>
      <div class="legal-meta">
        <span class="tag">Actualizado en octubre de 2026</span>
        <span class="tag">ITESCO · Coatzacoalcos</span>
        <span class="tag">Demostración</span>
      </div>

      <h2>1. Sitio de demostración</h2>
      <p>La tienda, el carrito, el checkout, la cuenta y las solicitudes de degustación son simulaciones. No se procesan pagos, no se realizan envíos y no se envían correos desde este sitio. Los datos que introduces se guardan únicamente en el almacenamiento local de tu navegador.</p>

      <h2>2. Productos y precios</h2>
      <p>Los productos Gluco-Control y Kéfir son prototipos académicos. Los precios, presentaciones y disponibilidad son de demostración y pueden cambiar sin previo aviso. No constituyen una oferta comercial.</p>

      <h2>3. Fichas nutrimentales</h2>
      <p>Los valores nutrimentales mostrados son estimaciones calculadas a partir de la formulación del prototipo. No han sido validados por un laboratorio acreditado y no deben interpretarse como una tabla nutrimental oficial. Cuando se realicen los análisis correspondientes, la información se actualizará.</p>

      <h2>4. SANO-DERMA</h2>
      <p>SANO-DERMA es un proyecto de investigación en salud humana. No es un medicamento, no ha completado su registro sanitario y no está a la venta. No debe usarse para diagnosticar, tratar, curar ni prevenir ninguna enfermedad. No sustituye la atención médica profesional.</p>

      <h2>5. Kéfir: advertencias</h2>
      <ul>
        <li>Contiene lactosa. No es apto para personas con intolerancia severa a la lactosa.</li>
        <li>La fermentación puede producir trazas de alcohol por debajo del 0.5 %. No es una bebida alcohólica.</li>
        <li>Personas inmunocomprometidas, embarazadas, niños pequeños o personas con condiciones médicas deben consultar a un profesional de la salud antes de consumirlo.</li>
        <li>No sustituye la leche materna ni una alimentación equilibrada.</li>
      </ul>

      <h2>6. Datos personales</h2>
      <p>Este sitio no tiene servidor ni base de datos. La cuenta, los pedidos, los favoritos y las solicitudes se guardan en el <em>localStorage</em> de tu navegador. Puedes borrarlos desde tu cuenta o limpiando los datos del sitio en tu navegador. No compartimos información con terceros porque no la recibimos.</p>

      <h2>7. Propiedad intelectual</h2>
      <p>El nombre Biorigen, los textos, las ilustraciones y el código de este sitio forman parte de un proyecto académico. Las marcas, imágenes y referencias de terceros pertenecen a sus respectivos titulares. El logotipo y las propuestas visuales se presentan como ejercicios de identidad.</p>

      <h2>8. Contacto</h2>
      <p>Para cualquier duda sobre el proyecto, escribe a <a href="mailto:${esc(SITE.email)}" style="text-decoration:underline">${esc(SITE.email)}</a> o al teléfono <a href="tel:${esc(SITE.phoneHref)}" style="text-decoration:underline">${esc(SITE.phone)}</a>. También puedes acudir al ${esc(SITE.school)}.</p>

      <div class="notice" style="margin-top:26px">
        ${icon('info')}
        <div><strong>Una nota final.</strong> Creemos que la transparencia también es parte de la ciencia. Si algo no está probado, lo decimos. Si algo cambia, lo actualizamos.</div>
      </div>
    </div>
  </section>`;
}

/* ---------- Logotipos ---------- */
function logosPage(root) {
  const proposals = [
    ['A', 'Brote orbital', 'Un brote de dos hojas dentro de un círculo abierto, con tres burbujas de fermentación. Es la propuesta más versátil: funciona a 16 px y a gran escala.', 'Recomendada'],
    ['B', 'Monograma B', 'Una B construida con dos arcos y un punto que evoca una espora. Más corporativa, ideal si Biorigen crece hacia servicios y laboratorio.', 'Corporativa'],
    ['C', 'Espiral de origen', 'Una espiral que se abre desde el centro, como un cultivo que crece. Transmite proceso, tiempo y fermentación.', 'Conceptual'],
    ['D', 'Gota de cultivo', 'Una gota con una hoja y burbujas. Une lo líquido y lo vivo; funciona bien en etiquetas de kéfir y yogurt.', 'Producto']
  ];
  return `
  ${pageHero({
    root,
    eyebrow: 'Logotipos',
    title: 'Cuatro rutas para una misma raíz.',
    lead: 'Propuestas de identidad para Biorigen. Todas comparten el mismo sistema tipográfico y la misma idea: biotecnología con origen. La propuesta A es la que se usa en este sitio.',
    actions: `<a class="btn btn--solid" href="${href(root, 'contacto/')}">Elegir una propuesta ${icon('arrow-right')}</a><a class="btn btn--ghost" href="${href(root, 'nosotros/')}">Conocer la marca</a>`
  })}
  <section class="section section--tight">
    <div class="container">
      <div class="logo-recommended" data-reveal>
        ${icon('sparkle')}
        <div><strong>Recomendación: propuesta A.</strong><p>El brote orbital se lee bien en el header, en una etiqueta pequeña y en una lona. Es orgánico sin ser literal y científico sin ser frío. Las otras tres quedan como alternativas para explorar.</p></div>
      </div>
      <h2 class="sr-only">Propuestas de logotipo</h2>
      <div class="logo-grid">
        ${proposals.map(([variant, name, text, tag], i) => `
          <article class="logo-card" data-reveal>
            <div class="logo-stage${i % 2 === 1 ? ' logo-stage--dark' : ''}">
              <div class="logo-stage__lockup">
                ${ART.logoMark(variant)}
                <div>
                  <div class="logo-stage__word">biorigen<span>.</span></div>
                  <span class="logo-stage__tag">Biotecnología con origen</span>
                </div>
              </div>
            </div>
            <div class="logo-card__body">
              <h3>Propuesta ${variant} · ${esc(name)}</h3>
              <p>${esc(text)}</p>
              <span class="tag ${variant === 'A' ? 'tag--lime' : ''}">${esc(tag)}</span>
            </div>
          </article>`).join('')}
      </div>
      <div class="catalog-note" data-reveal>
        ${icon('info')}
        <div><strong>¿Cómo se cambia?</strong><p>El logotipo del sitio se define en <code>assets/js/art.js</code> y se usa desde <code>build.js</code>. Si eliges otra propuesta, se cambia la letra en <code>logoMark('A')</code> por <code>'B'</code>, <code>'C'</code> o <code>'D'</code> y se vuelve a ejecutar <code>node build.js</code>.</p></div>
      </div>
    </div>
  </section>`;
}

/* ---------- 404 ---------- */
function notFoundPage(root) {
  return `<section class="notfound">
    <div class="container">
      <div class="notfound__code">404</div>
      <h1>Esta página no fermentó.</h1>
      <p>Puede que el enlace haya cambiado o que la página todavía no exista. Vuelve al inicio o explora el catálogo.</p>
      <h2 class="sr-only">Qué puedes hacer</h2>
      <div class="notfound__actions">
        <a class="btn btn--solid" href="${href(root, '')}">Volver al inicio ${icon('arrow-right')}</a>
        <a class="btn btn--ghost" href="${href(root, 'productos/')}">Ver productos</a>
      </div>
    </div>
  </section>`;
}

/* ---------- Generación ---------- */
function build() {
  console.log('Generando Biorigen...');
  buildCSS();
  ASSET_VERSION = computeAssetVersion();

  writePage('index.html', layout({
    title: 'Inicio',
    description: SITE.description,
    body: homePage(''),
    depth: 0,
    active: 'home'
  }));

  writePage('productos/index.html', layout({
    title: 'Catálogo',
    description: 'Catálogo de yogurt de nopal y kéfir de leche de Biorigen. Precios y fichas de demostración.',
    body: catalogPage('../'),
    depth: 1,
    active: 'productos'
  }));

  LINES.filter((l) => l.id === 'gluco-control' || l.id === 'kefir').forEach((line) => {
    writePage(`productos/${line.slug}/index.html`, layout({
      title: line.name,
      description: line.short,
      body: linePage(line, '../../'),
      depth: 2,
      active: 'productos'
    }));
    PRODUCTS.filter((p) => p.line === line.id).forEach((product) => {
      writePage(`productos/${line.slug}/${product.slug}/index.html`, layout({
        title: product.name,
        description: product.short,
        body: productPage(product, '../../../'),
        depth: 3,
        active: 'productos'
      }));
    });
  });

  writePage('nosotros/index.html', layout({
    title: 'Nosotros',
    description: 'Conoce al equipo de Biorigen, su historia y sus principios. Un proyecto de Ingeniería Bioquímica del ITESCO.',
    body: aboutPage('../'),
    depth: 1,
    active: 'nosotros'
  }));

  writePage('ciencia/index.html', layout({
    title: 'Ciencia',
    description: 'Fermentación láctica, probióticos y biocompuestos: el enfoque científico de Biorigen y lo que todavía falta por validar.',
    body: sciencePage('../'),
    depth: 1,
    active: 'ciencia'
  }));

  writePage('proyectos/index.html', layout({
    title: 'Proyectos',
    description: 'SANO-DERMA, barras energéticas y biofertilizante fúngico: los proyectos de Biorigen Labs y su estado real.',
    body: projectsPage('../'),
    depth: 1,
    active: 'proyectos'
  }));

  PROJECTS.forEach((project) => {
    writePage(`proyectos/${project.slug}/index.html`, layout({
      title: project.name,
      description: project.summary,
      body: projectPage(project, '../../'),
      depth: 2,
      active: 'proyectos'
    }));
  });

  writePage('contacto/index.html', layout({
    title: 'Contacto',
    description: 'Contacta a Biorigen para degustaciones, colaboraciones o información sobre los productos y proyectos.',
    body: contactPage('../'),
    depth: 1,
    active: 'contacto'
  }));

  writePage('aviso-academico/index.html', layout({
    title: 'Aviso académico',
    description: 'Aviso académico de Biorigen: demostración, fichas estimadas, advertencias del kéfir y estado de SANO-DERMA.',
    body: legalPage('../'),
    depth: 1,
    active: ''
  }));

  writePage('logotipos/index.html', layout({
    title: 'Logotipos',
    description: 'Propuestas de logotipo para Biorigen: brote orbital, monograma, espiral y gota de cultivo.',
    body: logosPage('../'),
    depth: 1,
    active: ''
  }));

  writePage('404.html', layout({
    title: 'Página no encontrada',
    description: 'La página que buscas no existe en Biorigen.',
    body: notFoundPage('./'),
    depth: 0,
    active: '',
    root: './',
    headExtra: notFoundBaseScript()
  }));

  const favicon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" rx="14" fill="#1B3325"/><g fill="none" stroke="#CFE39A" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M32 48V22"/><path d="M32 33c0-7 4.6-11.3 10.6-11.3 3.1 0 5 2 5 4.6 0 6.1-6.4 10.4-15.6 10.4"/><path d="M31.3 39c0-5.9-3.8-9.4-8.5-9.4-2.5 0-4 1.6-4 3.8 0 5 5.1 8.6 12.5 8.6"/><circle cx="49" cy="46" r="2.3" fill="#CFE39A" stroke="none"/></g></svg>`;
  fs.mkdirSync(path.join(ROOT, 'assets/img'), { recursive: true });
  fs.writeFileSync(path.join(ROOT, 'assets/img/favicon.svg'), favicon, 'utf8');
  fs.writeFileSync(path.join(ROOT, 'robots.txt'), 'User-agent: *\nAllow: /\n', 'utf8');

  console.log('\nListo. Sitio generado en: ' + ROOT);
  console.log('Páginas: ' + (4 + LINES.filter((l) => l.id === 'gluco-control' || l.id === 'kefir').length * 4 + PROJECTS.length + 5));
}

build();
