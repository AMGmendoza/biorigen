/* ============================================================
   BIORIGEN · Ilustraciones SVG
   Envases, logotipos e iconos. Sin imágenes externas.
   ============================================================ */
(function (global) {
  'use strict';

  let uid = 0;
  const nextId = () => 'bg' + (++uid).toString(36) + Math.random().toString(36).slice(2, 6);

  const esc = (value) => String(value ?? '').replace(/[&<>"']/g, (ch) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  }[ch]));

  /* ---------- Logotipo ---------- */
  function logoMark(variant = 'A', className = 'brand-symbol') {
    const common = `class="${className}" viewBox="0 0 48 48" aria-hidden="true" focusable="false" fill="none"`;
    if (variant === 'B') {
      return `<svg ${common}>
        <circle cx="24" cy="24" r="19.2" stroke="currentColor" stroke-width="1.4" opacity=".3"/>
        <path d="M17 12.5h7.2c4.1 0 6.8 2.1 6.8 5.5 0 2.3-1.3 4-3.5 4.8 2.9.7 4.6 2.6 4.6 5.3 0 3.9-3 6.4-7.7 6.4H17Z" stroke="currentColor" stroke-width="2.4" stroke-linejoin="round"/>
        <path d="M21 17.2h3.3c1.5 0 2.4.8 2.4 2s-.9 2-2.4 2H21M21 25.4h3.8c1.7 0 2.7.9 2.7 2.2s-1 2.2-2.7 2.2H21" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
        <circle cx="36" cy="13" r="2.1" fill="currentColor"/>
      </svg>`;
    }
    if (variant === 'C') {
      return `<svg ${common}>
        <path d="M24 8c8.8 0 16 7.2 16 16s-7.2 16-16 16S8 32.8 8 24c0-6 3.3-11.2 8.2-13.9" stroke="currentColor" stroke-width="1.5" opacity=".28" stroke-linecap="round"/>
        <path d="M24 15c5 0 9 4 9 9s-4 9-9 9-9-4-9-9c0-3.2 1.7-6 4.3-7.6" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"/>
        <path d="M24 21.5c1.4 0 2.5 1.1 2.5 2.5s-1.1 2.5-2.5 2.5" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/>
        <circle cx="35" cy="11" r="1.8" fill="currentColor"/>
        <circle cx="39" cy="16" r="1.1" fill="currentColor" opacity=".7"/>
      </svg>`;
    }
    if (variant === 'D') {
      return `<svg ${common}>
        <path d="M24 6.5s13 14.1 13 22.2a13 13 0 0 1-26 0C11 20.6 24 6.5 24 6.5Z" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"/>
        <path d="M24 34V20" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/>
        <path d="M24 25.5c0-4.6 3-7.4 6.8-7.4 2 0 3.2 1.3 3.2 2.9 0 4-4.1 6.7-10 6.7" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M23.6 29c0-3.8-2.4-6-5.5-6-1.6 0-2.6 1-2.6 2.4 0 3.2 3.3 5.5 8.1 5.5" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>
        <circle cx="36" cy="34" r="1.5" fill="currentColor"/>
      </svg>`;
    }
    return `<svg ${common}>
      <circle cx="24" cy="24" r="19" stroke="currentColor" stroke-width="1.4" opacity=".28"/>
      <path d="M24 34V15.5" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/>
      <path d="M24 24.2c0-5.2 3.4-8.4 7.9-8.4 2.3 0 3.7 1.5 3.7 3.4 0 4.5-4.8 7.7-11.6 7.7" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M23.5 28.6c0-4.4-2.8-7-6.3-7-1.9 0-3 1.2-3 2.8 0 3.7 3.8 6.4 9.3 6.4" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>
      <circle cx="36.5" cy="33.5" r="1.7" fill="currentColor"/>
      <circle cx="40" cy="28.5" r="1.1" fill="currentColor" opacity=".75"/>
      <circle cx="32" cy="39" r="1" fill="currentColor" opacity=".6"/>
    </svg>`;
  }

  /* ---------- Envase de yogurt ---------- */
  function jarSVG(p) {
    const a = p.art || {};
    const id = nextId();
    return `<svg class="product-art" viewBox="0 0 240 300" role="img" aria-label="Envase de ${esc(p.name)}">
      <defs>
        <linearGradient id="body-${id}" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stop-color="#ffffff"/>
          <stop offset=".42" stop-color="#fdfaf3"/>
          <stop offset="1" stop-color="#e8ddc8"/>
        </linearGradient>
        <linearGradient id="label-${id}" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stop-color="${a.labelColor || '#DCE7C4'}"/>
          <stop offset="1" stop-color="${a.labelDeep || '#C3D5A4'}"/>
        </linearGradient>
      </defs>
      <ellipse cx="120" cy="279" rx="74" ry="11" fill="#16241B" opacity=".11"/>
      <rect x="56" y="46" width="128" height="31" rx="10" fill="${a.lid || '#1B3325'}"/>
      <rect x="62" y="53" width="116" height="4" rx="2" fill="#ffffff" opacity=".16"/>
      <rect x="64" y="77" width="112" height="14" rx="4" fill="#EDE3CF" stroke="#DCD1BA" stroke-width="1"/>
      <path d="M58 88h124l-9 154c-.6 11-8.6 17-19.6 17H86.6c-11 0-19-6-19.6-17Z" fill="url(#body-${id})" stroke="#DCD1BA" stroke-width="1.4"/>
      <path d="M80 100l-7 130" stroke="#ffffff" stroke-width="7" stroke-linecap="round" opacity=".55"/>
      <path d="M165 100l6 128" stroke="#16241B" stroke-width="10" stroke-linecap="round" opacity=".05"/>
      <rect x="72" y="130" width="96" height="112" rx="9" fill="url(#label-${id})"/>
      <rect x="72" y="130" width="96" height="112" rx="9" fill="none" stroke="#16241B" stroke-opacity=".08"/>
      <g transform="translate(110 138)" stroke="#16241B" stroke-width="1.5" fill="none" stroke-linecap="round" stroke-linejoin="round" opacity=".55">
        <path d="M10 19V7"/>
        <path d="M10 13.5c0-3.2 1.9-5 4.1-5 1.3 0 2 .9 2 1.9 0 2.4-2.2 4.3-6.1 4.3"/>
        <path d="M9.7 16c0-2.6-1.6-4-3.5-4-1.1 0-1.8.7-1.8 1.7 0 2.1 1.8 3.8 5.3 3.8"/>
      </g>
      <text x="120" y="176" text-anchor="middle" font-family="Fraunces, Georgia, serif" font-size="16.5" font-weight="700" letter-spacing="1" fill="#16241B">${esc(a.label || 'GLUCO')}</text>
      <text x="120" y="193" text-anchor="middle" font-family="Fraunces, Georgia, serif" font-size="16.5" font-weight="700" letter-spacing="1.2" fill="#16241B">${esc(a.label2 || 'CONTROL')}</text>
      <path d="M96 201h48" stroke="#16241B" stroke-opacity=".28" stroke-width="1"/>
      <text x="120" y="213" text-anchor="middle" font-family="Manrope, sans-serif" font-size="5.4" font-weight="700" letter-spacing="1.5" fill="#16241B" fill-opacity=".72">${esc(a.sub || 'YOGURT DE NOPAL')}</text>
      <text x="120" y="228" text-anchor="middle" font-family="Manrope, sans-serif" font-size="7" font-weight="800" letter-spacing=".6" fill="#16241B" fill-opacity=".8">${esc(a.size || '150 g')}</text>
      <circle cx="154" cy="232" r="3.6" fill="${a.dot || '#5C7F45'}"/>
    </svg>`;
  }

  /* ---------- Botella de kéfir ---------- */
  function bottleSVG(p) {
    const a = p.art || {};
    const id = nextId();
    const liquid = a.labelDeep || '#D8C39E';
    return `<svg class="product-art" viewBox="0 0 220 340" role="img" aria-label="Botella de ${esc(p.name)}">
      <defs>
        <linearGradient id="glass-${id}" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stop-color="#ffffff"/>
          <stop offset=".45" stop-color="#fdfaf3"/>
          <stop offset="1" stop-color="#e6dcc8"/>
        </linearGradient>
        <linearGradient id="liquid-${id}" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stop-color="${liquid}" stop-opacity=".92"/>
          <stop offset="1" stop-color="${liquid}" stop-opacity=".55"/>
        </linearGradient>
        <linearGradient id="cap-${id}" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stop-color="${a.lid || '#3E3A32'}"/>
          <stop offset="1" stop-color="#1f1d18"/>
        </linearGradient>
      </defs>
      <ellipse cx="110" cy="320" rx="62" ry="10" fill="#16241B" opacity=".12"/>
      <rect x="84" y="22" width="52" height="26" rx="6" fill="url(#cap-${id})"/>
      <rect x="88" y="27" width="44" height="3" rx="1.5" fill="#ffffff" opacity=".16"/>
      <path d="M90 48h40v24c0 8 3 13 9 20 10 11 16 25 16 43v143c0 14-9 22-23 22H88c-14 0-23-8-23-22V135c0-18 6-32 16-43 6-7 9-12 9-20Z" fill="url(#glass-${id})" stroke="#DCD1BA" stroke-width="1.5"/>
      <path d="M77 148h66v142c0 9-6 14-15 14H92c-9 0-15-5-15-14Z" fill="url(#liquid-${id})"/>
      <path d="M80 152h60" stroke="#ffffff" stroke-width="2" opacity=".35"/>
      <path d="M78 120l-5 176" stroke="#ffffff" stroke-width="6" stroke-linecap="round" opacity=".45"/>
      <rect x="63" y="170" width="94" height="106" rx="8" fill="${a.labelColor || '#EADCC2'}"/>
      <rect x="63" y="170" width="94" height="106" rx="8" fill="none" stroke="#16241B" stroke-opacity=".08"/>
      <text x="110" y="199" text-anchor="middle" font-family="Fraunces, Georgia, serif" font-size="20" font-weight="700" letter-spacing="2.4" fill="#16241B">${esc(a.label || 'KÉFIR')}</text>
      <path d="M82 208h56" stroke="#16241B" stroke-opacity=".25" stroke-width="1"/>
      <text x="110" y="221" text-anchor="middle" font-family="Manrope, sans-serif" font-size="5.2" font-weight="700" letter-spacing="1.4" fill="#16241B" fill-opacity=".7">${esc(a.sub || 'FERMENTADO DE LECHE')}</text>
      <text x="110" y="242" text-anchor="middle" font-family="Fraunces, Georgia, serif" font-size="15" font-weight="600" fill="#16241B">${esc(p.flavor || 'Natural')}</text>
      <text x="110" y="260" text-anchor="middle" font-family="Manrope, sans-serif" font-size="7" font-weight="800" letter-spacing=".8" fill="#16241B" fill-opacity=".75">${esc(a.size || '500 ml')}</text>
      <circle cx="140" cy="264" r="3.4" fill="${a.dot || '#A8875C'}"/>
      <g fill="#ffffff" opacity=".55">
        <circle cx="92" cy="285" r="2.2"/>
        <circle cx="103" cy="292" r="1.4"/>
        <circle cx="128" cy="288" r="1.8"/>
        <circle cx="136" cy="296" r="1.1"/>
      </g>
    </svg>`;
  }

  /* ---------- Tarro de crema ---------- */
  function creamSVG(p) {
    const a = p.art || {};
    const id = nextId();
    return `<svg class="product-art" viewBox="0 0 220 260" role="img" aria-label="Tarro de ${esc(p.name)}">
      <defs>
        <linearGradient id="cream-${id}" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stop-color="#ffffff"/>
          <stop offset=".45" stop-color="#fbf8f1"/>
          <stop offset="1" stop-color="#e4ddcd"/>
        </linearGradient>
      </defs>
      <ellipse cx="110" cy="238" rx="64" ry="10" fill="#16241B" opacity=".12"/>
      <rect x="44" y="52" width="132" height="28" rx="9" fill="${a.lid || '#3E4F57'}"/>
      <rect x="50" y="58" width="120" height="3" rx="1.5" fill="#ffffff" opacity=".16"/>
      <rect x="52" y="80" width="116" height="12" rx="4" fill="#e8e0d2" stroke="#d8cfbd" stroke-width="1"/>
      <path d="M50 92h120l-6 128c-.5 10-7.4 16-17.4 16H73.4c-10 0-16.9-6-17.4-16Z" fill="url(#cream-${id})" stroke="#d8cfbd" stroke-width="1.4"/>
      <path d="M66 100l-4 110" stroke="#ffffff" stroke-width="6" stroke-linecap="round" opacity=".5"/>
      <rect x="64" y="122" width="92" height="92" rx="7" fill="${a.labelColor || '#DCEBEE'}"/>
      <rect x="64" y="122" width="92" height="92" rx="7" fill="none" stroke="#16241B" stroke-opacity=".08"/>
      <text x="110" y="151" text-anchor="middle" font-family="Fraunces, Georgia, serif" font-size="15" font-weight="700" letter-spacing="1.2" fill="#16241B">SANO</text>
      <text x="110" y="167" text-anchor="middle" font-family="Fraunces, Georgia, serif" font-size="15" font-weight="700" letter-spacing="1.2" fill="#16241B">DERMA</text>
      <path d="M86 175h48" stroke="#16241B" stroke-opacity=".25" stroke-width="1"/>
      <text x="110" y="187" text-anchor="middle" font-family="Manrope, sans-serif" font-size="5" font-weight="700" letter-spacing="1.3" fill="#16241B" fill-opacity=".7">GANODERMA LUCIDUM</text>
      <text x="110" y="203" text-anchor="middle" font-family="Manrope, sans-serif" font-size="7" font-weight="800" letter-spacing=".6" fill="#16241B" fill-opacity=".75">CREMA · 50 g</text>
      <circle cx="140" cy="209" r="3.2" fill="${a.dot || '#5B7C8D'}"/>
    </svg>`;
  }

  /* ---------- Barra energética ---------- */
  function barSVG(p) {
    const a = p.art || {};
    return `<svg class="product-art" viewBox="0 0 240 200" role="img" aria-label="Barra ${esc(p.name)}">
      <ellipse cx="120" cy="176" rx="76" ry="9" fill="#16241B" opacity=".12"/>
      <g transform="rotate(-8 120 100)">
        <rect x="38" y="55" width="164" height="86" rx="12" fill="${a.labelColor || '#F0DDB2'}" stroke="#16241B" stroke-opacity=".08"/>
        <rect x="38" y="55" width="164" height="86" rx="12" fill="none" stroke="#ffffff" stroke-opacity=".35"/>
        <path d="M38 78h164" stroke="#16241B" stroke-opacity=".12"/>
        <path d="M38 120h164" stroke="#16241B" stroke-opacity=".12"/>
        <text x="120" y="96" text-anchor="middle" font-family="Fraunces, Georgia, serif" font-size="20" font-weight="700" letter-spacing="1.5" fill="#16241B">BIORIGEN</text>
        <text x="120" y="112" text-anchor="middle" font-family="Manrope, sans-serif" font-size="6" font-weight="700" letter-spacing="2" fill="#16241B" fill-opacity=".7">BARRA ENERGÉTICA</text>
        <text x="120" y="135" text-anchor="middle" font-family="Manrope, sans-serif" font-size="7" font-weight="800" letter-spacing="1" fill="#16241B" fill-opacity=".6">EN FORMULACIÓN</text>
        <circle cx="181" cy="68" r="4" fill="${a.dot || '#B08A3E'}"/>
      </g>
    </svg>`;
  }

  /* ---------- Biofertilizante ---------- */
  function fertilizerSVG(p) {
    const a = p.art || {};
    const id = nextId();
    return `<svg class="product-art" viewBox="0 0 220 320" role="img" aria-label="Envase de ${esc(p.name)}">
      <defs>
        <linearGradient id="fert-${id}" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stop-color="#6b5a3a"/>
          <stop offset=".45" stop-color="#8a7448"/>
          <stop offset="1" stop-color="#5b4b30"/>
        </linearGradient>
      </defs>
      <ellipse cx="110" cy="300" rx="58" ry="9" fill="#16241B" opacity=".12"/>
      <rect x="86" y="24" width="48" height="18" rx="4" fill="#2f2b22"/>
      <path d="M100 42h20v18h-20Z" fill="#3a352a"/>
      <path d="M96 60h28l16 24v190c0 13-9 21-22 21h-16c-13 0-22-8-22-21V84Z" fill="url(#fert-${id})" stroke="#3d3322" stroke-width="1.4"/>
      <path d="M80 130h60v142c0 8-5 13-14 13H94c-9 0-14-5-14-13Z" fill="#3f4a2a" opacity=".55"/>
      <rect x="68" y="150" width="84" height="94" rx="7" fill="${a.labelColor || '#E9F0D8'}"/>
      <text x="110" y="177" text-anchor="middle" font-family="Fraunces, Georgia, serif" font-size="16" font-weight="700" letter-spacing="1" fill="#16241B">BIOFERT</text>
      <path d="M86 185h48" stroke="#16241B" stroke-opacity=".25" stroke-width="1"/>
      <text x="110" y="197" text-anchor="middle" font-family="Manrope, sans-serif" font-size="5" font-weight="700" letter-spacing="1.3" fill="#16241B" fill-opacity=".7">A BASE DE HONGOS</text>
      <text x="110" y="215" text-anchor="middle" font-family="Manrope, sans-serif" font-size="6.5" font-weight="800" letter-spacing=".8" fill="#16241B" fill-opacity=".75">EN INVESTIGACIÓN</text>
      <circle cx="138" cy="226" r="3.2" fill="${a.dot || '#6E8B5A'}"/>
      <g fill="#ffffff" opacity=".25">
        <circle cx="86" cy="270" r="2"/>
        <circle cx="128" cy="276" r="1.4"/>
        <circle cx="105" cy="283" r="1.1"/>
      </g>
    </svg>`;
  }

  /* ---------- Matraz de laboratorio ---------- */
  function labSVG() {
    return `<svg class="product-art" viewBox="0 0 220 260" role="img" aria-label="Ilustración de laboratorio">
      <ellipse cx="110" cy="236" rx="58" ry="9" fill="#16241B" opacity=".1"/>
      <path d="M88 34h44v42l34 118c4 14-5 26-20 26H74c-15 0-24-12-20-26l34-118Z" fill="#fdfaf3" stroke="#d8cfbd" stroke-width="1.6"/>
      <path d="M76 158h68l15 38c3 9-4 16-14 16H75c-10 0-17-7-14-16Z" fill="#CFE39A" opacity=".85"/>
      <path d="M94 30h32" stroke="#16241B" stroke-width="3" stroke-linecap="round" opacity=".35"/>
      <g fill="#5C7F45" opacity=".8">
        <circle cx="96" cy="182" r="4"/>
        <circle cx="116" cy="196" r="3"/>
        <circle cx="130" cy="176" r="2.4"/>
      </g>
      <path d="M103 98h14M110 91v14" stroke="#16241B" stroke-width="1.6" stroke-linecap="round" opacity=".25"/>
    </svg>`;
  }

  function productArt(product, extraClass = '') {
    const type = product.art?.type;
    const cls = extraClass ? extraClass + ' ' : '';
    if (type === 'bottle') return bottleSVG(product).replace('class="product-art"', `class="${cls}product-art"`);
    if (type === 'cream') return creamSVG(product).replace('class="product-art"', `class="${cls}product-art"`);
    if (type === 'bar') return barSVG(product).replace('class="product-art"', `class="${cls}product-art"`);
    if (type === 'fertilizer') return fertilizerSVG(product).replace('class="product-art"', `class="${cls}product-art"`);
    return jarSVG(product).replace('class="product-art"', `class="${cls}product-art"`);
  }

  function lineArt(line) {
    if (line.art === 'bottle') return bottleSVG({ name: line.name, flavor: 'Natural', art: { label: 'KÉFIR', sub: 'FERMENTADO DE LECHE', size: '500 ml', lid: '#3E3A32', labelColor: '#EADCC2', labelDeep: '#D8C39E', dot: '#A8875C' } });
    if (line.art === 'cream') return creamSVG({ name: line.name, art: { lid: '#3E4F57', labelColor: '#DCEBEE', dot: '#5B7C8D' } });
    if (line.art === 'lab') return labSVG();
    return jarSVG({ name: line.name, art: { label: 'GLUCO', label2: 'CONTROL', sub: 'YOGURT DE NOPAL', size: '150 g', lid: '#1B3325', labelColor: '#DCE7C4', labelDeep: '#C3D5A4', dot: '#5C7F45' } });
  }

  const ART = { logoMark, jarSVG, bottleSVG, creamSVG, barSVG, fertilizerSVG, labSVG, productArt, lineArt };
  global.BIORIGEN_ART = ART;
  if (typeof module !== 'undefined' && module.exports) module.exports = ART;
})(typeof window !== 'undefined' ? window : globalThis);
