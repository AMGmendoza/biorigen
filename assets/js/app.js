/* ============================================================
   BIORIGEN · Aplicación de tienda y cuenta
   ============================================================ */
(function () {
  'use strict';

  const UI = window.BIORIGEN_UI;
  if (!UI) {
    console.error('Biorigen: falta components.js');
    return;
  }

  const DATA = window.BIORIGEN || {};
  const ART = window.BIORIGEN_ART || {};
  const PRODUCTS = DATA.PRODUCTS || [];
  const LINES = DATA.LINES || [];
  const $ = UI.$;
  const $$ = UI.$$;
  const esc = UI.esc;
  const money = UI.money;
  const icon = UI.icon;

  const state = {
    cart: [],
    favorites: [],
    accounts: [],
    session: null,
    orders: [],
    tastings: [],
    messages: []
  };

  /* ---------- Utilidades ---------- */
  const productById = (id) => PRODUCTS.find((p) => p.id === id);
  const lineById = (id) => LINES.find((l) => l.id === id);
  const sizeOf = (product, sizeId) => product?.sizes?.find((s) => s.id === sizeId) || product?.sizes?.[0];
  const clamp = (n, min, max) => Math.min(max, Math.max(min, n));
  const digits = (v) => String(v || '').replace(/\D/g, '');
  const validEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(v || '').trim());
  const initials = (name) => String(name || '')
    .trim().split(/\s+/).slice(0, 2).map((w) => w[0] || '').join('').toUpperCase();
  const formatDate = (iso) => {
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return '';
    return d.toLocaleDateString('es-MX', { day: '2-digit', month: 'short', year: 'numeric' });
  };

  function save() {
    try {
      localStorage.setItem(UI.STORE_KEY, JSON.stringify(state));
    } catch (err) {
      console.warn('Biorigen: no se pudo guardar el estado.', err);
    }
  }

  function load() {
    try {
      const raw = JSON.parse(localStorage.getItem(UI.STORE_KEY) || 'null');
      if (!raw || typeof raw !== 'object') return;

      if (Array.isArray(raw.cart)) {
        state.cart = raw.cart
          .map((item) => {
            const p = productById(item.productId);
            const s = p ? sizeOf(p, item.sizeId) : null;
            if (!p || !s) return null;
            return {
              key: `${p.id}::${s.id}`,
              productId: p.id,
              sizeId: s.id,
              qty: clamp(Number(item.qty) || 1, 1, 20)
            };
          })
          .filter(Boolean);
      }
      if (Array.isArray(raw.favorites)) {
        state.favorites = raw.favorites.filter((id) => productById(id));
      }
      if (Array.isArray(raw.accounts)) {
        state.accounts = raw.accounts
          .filter((a) => a && typeof a.email === 'string' && typeof a.hash === 'string')
          .map((a) => ({
            name: String(a.name || ''),
            email: a.email.toLowerCase(),
            hash: a.hash,
            createdAt: a.createdAt || new Date().toISOString()
          }));
      }
      if (typeof raw.session === 'string' && state.accounts.some((a) => a.email === raw.session)) {
        state.session = raw.session;
      }
      if (Array.isArray(raw.orders)) {
        state.orders = raw.orders.filter((o) => o && Array.isArray(o.items));
      }
      if (Array.isArray(raw.tastings)) state.tastings = raw.tastings;
      if (Array.isArray(raw.messages)) state.messages = raw.messages;
    } catch (err) {
      console.warn('Biorigen: no se pudo leer el estado.', err);
    }
  }

  function resetState() {
    state.cart = [];
    state.favorites = [];
    state.accounts = [];
    state.session = null;
    state.orders = [];
    state.tastings = [];
    state.messages = [];
  }

  function currentUser() {
    return state.accounts.find((a) => a.email === state.session) || null;
  }
  function isLoggedIn() { return Boolean(currentUser()); }

  async function sha256(text) {
    try {
      if (window.crypto && window.crypto.subtle) {
        const buf = await window.crypto.subtle.digest('SHA-256', new TextEncoder().encode(text));
        return Array.from(new Uint8Array(buf)).map((b) => b.toString(16).padStart(2, '0')).join('');
      }
    } catch (err) {
      /* contexto no seguro: se usa el respaldo local */
    }
    let h1 = 0xdeadbeef;
    let h2 = 0x41c6ce57;
    for (let i = 0; i < text.length; i += 1) {
      const ch = text.charCodeAt(i);
      h1 = Math.imul(h1 ^ ch, 2654435761);
      h2 = Math.imul(h2 ^ ch, 1597334677);
    }
    return 'fb' + (h1 >>> 0).toString(16) + (h2 >>> 0).toString(16);
  }

  /* ---------- Carrito ---------- */
  function cartItems() {
    return state.cart.map((item) => {
      const product = productById(item.productId);
      const size = product ? sizeOf(product, item.sizeId) : null;
      if (!product || !size) return null;
      return {
        ...item,
        product,
        size,
        line: lineById(product.line),
        total: size.price * item.qty
      };
    }).filter(Boolean);
  }
  const cartCount = () => state.cart.reduce((sum, item) => sum + item.qty, 0);
  const cartSubtotal = () => cartItems().reduce((sum, item) => sum + item.total, 0);

  function addToCart(productId, sizeId, qty = 1) {
    const product = productById(productId);
    if (!product) return;
    const size = sizeOf(product, sizeId);
    if (!size) return;
    const key = `${product.id}::${size.id}`;
    const existing = state.cart.find((item) => item.key === key);
    if (existing) existing.qty = clamp(existing.qty + qty, 1, 20);
    else state.cart.push({ key, productId: product.id, sizeId: size.id, qty: clamp(qty, 1, 20) });
    save();
    renderAll();
    UI.toast('Añadido al carrito', `${product.name} · ${size.label}`);
  }

  function changeQty(key, delta) {
    const item = state.cart.find((i) => i.key === key);
    if (!item) return;
    item.qty = clamp(item.qty + delta, 1, 20);
    save();
    renderAll();
  }

  function removeItem(key) {
    state.cart = state.cart.filter((i) => i.key !== key);
    save();
    renderAll();
    UI.toast('Producto retirado', 'Puedes volver a añadirlo cuando quieras.');
  }

  function cartItemHTML(item) {
    const art = ART.productArt
      ? ART.productArt({ ...item.product, art: { ...(item.product.art || {}), size: item.size.label } })
      : '';
    return `<div class="cart-item" data-key="${esc(item.key)}">
      <div class="cart-thumb" style="--tint:${esc(item.product.tint)};--tint2:${esc(item.product.tint2)}">${art}</div>
      <div class="cart-item__info">
        <div class="cart-item__line">${esc(item.line?.name || '')}</div>
        <div class="cart-item__name">${esc(item.product.name)}</div>
        <div class="cart-item__meta">${esc(item.size.label)} · ${money(item.size.price)} c/u</div>
        <div class="cart-qty">
          <button type="button" data-cart-dec="${esc(item.key)}" aria-label="Quitar una unidad">−</button>
          <span>${item.qty}</span>
          <button type="button" data-cart-inc="${esc(item.key)}" aria-label="Añadir una unidad">+</button>
        </div>
      </div>
      <div style="text-align:right">
        <div class="cart-item__price">${money(item.total)}</div>
        <button class="cart-item__remove" type="button" data-cart-remove="${esc(item.key)}" aria-label="Quitar ${esc(item.product.name)}">${icon('trash')}</button>
      </div>
    </div>`;
  }

  function renderCart() {
    const body = $('#cartBody');
    const foot = $('#cartFoot');
    if (!body || !foot) return;
    const items = cartItems();
    UI.updateCartCount(cartCount());

    if (!items.length) {
      body.innerHTML = `<div class="cart-empty">
        ${icon('cart')}
        <h4>Tu carrito está vacío</h4>
        <p>Explora el yogurt de nopal y el kéfir de leche. Los pedidos son una demostración académica.</p>
        <a class="btn btn--solid btn--sm" href="${UI.link('productos/')}" data-close-cart>Ver productos</a>
      </div>`;
      foot.innerHTML = '';
      return;
    }

    body.innerHTML = `<div class="cart-items">${items.map(cartItemHTML).join('')}</div>`;
    const subtotal = cartSubtotal();
    foot.innerHTML = `
      <div class="cart-line"><span>Subtotal</span><span>${money(subtotal)}</span></div>
      <div class="cart-line"><span>Envío</span><span>Por confirmar</span></div>
      <div class="cart-line cart-line--total"><span>Total</span><strong>${money(subtotal)}</strong></div>
      <button class="btn btn--solid btn--block" type="button" data-cart-checkout>Finalizar compra</button>
      <button class="btn btn--ghost btn--block" type="button" data-close-cart>Seguir explorando</button>
      <p class="cart-note">Demostración académica: no se procesan pagos ni se realizan envíos reales.</p>`;
  }

  /* ---------- Favoritos ---------- */
  function toggleFav(id) {
    if (!productById(id)) return;
    const index = state.favorites.indexOf(id);
    if (index >= 0) {
      state.favorites.splice(index, 1);
      UI.toast('Retirado de favoritos', 'Puedes volver a guardarlo cuando quieras.');
    } else {
      state.favorites.push(id);
      UI.toast('Guardado en favoritos', 'Lo encontrarás en tu cuenta.');
    }
    save();
    syncFavButtons();
    if ($('#profileModal')?.classList.contains('is-open')) renderProfile();
  }

  function syncFavButtons() {
    $$('[data-fav]').forEach((btn) => {
      const active = state.favorites.includes(btn.dataset.fav);
      btn.classList.toggle('is-fav', active);
      btn.setAttribute('aria-pressed', active ? 'true' : 'false');
      const label = active ? 'Quitar de favoritos' : 'Guardar en favoritos';
      if (btn.classList.contains('fav-btn')) btn.setAttribute('aria-label', label);
    });
  }

  /* ---------- Cuenta ---------- */
  function renderAccountButton() {
    const btn = $('#accountBtn');
    if (!btn) return;
    const user = currentUser();
    if (user) {
      btn.innerHTML = `<span class="account-avatar">${esc(initials(user.name))}</span>`;
      btn.setAttribute('aria-label', `Mi cuenta: ${user.name} (${initials(user.name)})`);
    } else {
      btn.innerHTML = icon('user');
      btn.setAttribute('aria-label', 'Mi cuenta');
    }
  }

  function openAccount() {
    if (!isLoggedIn()) {
      setAuthTab('login');
      UI.openModal('authModal');
      return;
    }
    renderProfile();
    setProfileTab('orders');
    UI.openModal('profileModal');
  }

  function setAuthTab(tab) {
    $$('.auth-tab').forEach((btn) => {
      const active = btn.dataset.authTab === tab;
      btn.classList.toggle('is-active', active);
      btn.setAttribute('aria-selected', active ? 'true' : 'false');
    });
    $('#loginForm')?.classList.toggle('is-hidden', tab !== 'login');
    $('#registerForm')?.classList.toggle('is-hidden', tab !== 'register');
    const le = $('#loginError');
    const re = $('#registerError');
    if (le) le.textContent = '';
    if (re) re.textContent = '';
  }

  function setProfileTab(tab) {
    $$('.profile-tab').forEach((btn) => {
      const active = btn.dataset.profileTab === tab;
      btn.classList.toggle('is-active', active);
      btn.setAttribute('aria-selected', active ? 'true' : 'false');
    });
    $$('.profile-panel').forEach((panel) => {
      panel.classList.toggle('is-active', panel.dataset.profilePanel === tab);
    });
  }

  function renderProfile() {
    const user = currentUser();
    if (!user) return;
    const head = $('#profileHead');
    if (head) {
      head.innerHTML = `<div class="avatar">${esc(initials(user.name))}</div>
        <div><h2 id="profileTitle">${esc(user.name)}</h2><p>${esc(user.email)} · Cuenta local de demostración</p></div>`;
    }

    const orders = state.orders.filter((o) => o.accountEmail === user.email || o.email === user.email);
    const ordersEl = $('#profileOrders');
    if (ordersEl) {
      if (!orders.length) {
        ordersEl.innerHTML = `<div class="profile-empty">${icon('package')}<p>Todavía no tienes pedidos registrados.</p><a class="btn btn--solid btn--sm" href="${UI.link('productos/')}" data-close-modal>Explorar productos</a></div>`;
      } else {
        ordersEl.innerHTML = orders.map((o) => `
          <div class="order-card">
            <div class="order-head"><strong>${esc(o.code || 'Pedido')}</strong><span>${esc(formatDate(o.date))}</span></div>
            <div class="order-items">
              ${(o.items || []).map((it) => `<div><span>${esc(it.name)} · ${esc(it.size)} × ${it.qty}</span><span>${money(it.price * it.qty)}</span></div>`).join('')}
            </div>
            <div class="order-total"><span>Total</span><span>${money(o.total)}</span></div>
          </div>`).join('');
      }
    }

    const favEl = $('#profileFavorites');
    if (favEl) {
      const favorites = state.favorites.map(productById).filter(Boolean);
      if (!favorites.length) {
        favEl.innerHTML = `<div class="profile-empty">${icon('heart')}<p>No has guardado productos todavía.</p><a class="btn btn--ghost btn--sm" href="${UI.link('productos/')}" data-close-modal>Ver catálogo</a></div>`;
      } else {
        favEl.innerHTML = `<div class="fav-list">${favorites.map((p) => {
          const art = ART.productArt ? ART.productArt(p) : '';
          return `<div class="fav-item">
            <div class="fav-item__thumb" style="--tint:${esc(p.tint)};--tint2:${esc(p.tint2)}">${art}</div>
            <div class="fav-item__info"><strong>${esc(p.name)}</strong><span>${esc(lineById(p.line)?.name || '')} · desde ${money(p.sizes[0].price)}</span></div>
            <a href="${UI.productLink(p)}" data-close-modal>Ver</a>
            <button class="link-btn" type="button" data-fav="${esc(p.id)}">Quitar</button>
          </div>`;
        }).join('')}</div>`;
      }
      syncFavButtons();
    }

    const dataEl = $('#profileData');
    if (dataEl) {
      dataEl.innerHTML = `<div class="detail-list">
        <div><span>Nombre</span><strong>${esc(user.name)}</strong></div>
        <div><span>Correo</span><strong>${esc(user.email)}</strong></div>
        <div><span>Miembro desde</span><strong>${esc(formatDate(user.createdAt))}</strong></div>
        <div><span>Pedidos</span><strong>${orders.length}</strong></div>
        <div><span>Favoritos</span><strong>${state.favorites.length}</strong></div>
      </div>
      <p class="form-note">Esta cuenta y tus pedidos viven solo en este navegador. No hay servidor ni envío de datos.</p>
      <button class="btn btn--ghost btn--sm" type="button" id="clearDataBtn">Borrar datos de la demostración</button>`;
    }
  }

  async function handleLogin(event) {
    event.preventDefault();
    const email = $('#loginEmail').value.trim().toLowerCase();
    const password = $('#loginPass').value;
    const errorEl = $('#loginError');
    errorEl.textContent = '';
    if (!validEmail(email) || !password) {
      errorEl.textContent = 'Escribe un correo válido y tu contraseña.';
      return;
    }
    const account = state.accounts.find((a) => a.email === email);
    if (!account) {
      errorEl.textContent = 'No encontramos una cuenta con ese correo en este navegador.';
      return;
    }
    const hash = await sha256(password);
    if (hash !== account.hash) {
      errorEl.textContent = 'La contraseña no coincide. Inténtalo de nuevo.';
      return;
    }
    state.session = account.email;
    save();
    renderAll();
    UI.closeModal('authModal');
    UI.toast('Bienvenido de nuevo', account.name);
    setTimeout(() => {
      renderProfile();
      setProfileTab('orders');
      UI.openModal('profileModal');
    }, 220);
  }

  async function handleRegister(event) {
    event.preventDefault();
    const name = $('#regName').value.trim();
    const email = $('#regEmail').value.trim().toLowerCase();
    const password = $('#regPass').value;
    const password2 = $('#regPass2').value;
    const errorEl = $('#registerError');
    errorEl.textContent = '';
    if (name.length < 2) { errorEl.textContent = 'Escribe tu nombre completo.'; return; }
    if (!validEmail(email)) { errorEl.textContent = 'Escribe un correo válido.'; return; }
    if (password.length < 6) { errorEl.textContent = 'La contraseña debe tener al menos 6 caracteres.'; return; }
    if (password !== password2) { errorEl.textContent = 'Las contraseñas no coinciden.'; return; }
    if (state.accounts.some((a) => a.email === email)) {
      errorEl.textContent = 'Ya existe una cuenta con ese correo. Inicia sesión.';
      return;
    }
    const hash = await sha256(password);
    state.accounts.push({ name, email, hash, createdAt: new Date().toISOString() });
    state.session = email;
    save();
    renderAll();
    UI.closeModal('authModal');
    UI.toast('Cuenta creada', `Hola, ${name.split(' ')[0]}.`);
    setTimeout(() => {
      renderProfile();
      setProfileTab('orders');
      UI.openModal('profileModal');
    }, 220);
  }

  function logout() {
    state.session = null;
    save();
    renderAll();
    UI.closeModal('profileModal');
    UI.toast('Sesión cerrada', 'Tus datos siguen guardados en este navegador.');
  }

  /* ---------- Checkout ---------- */
  let checkoutStep = 1;

  function setCheckoutStep(step) {
    checkoutStep = step;
    $$('.checkout-form').forEach((form) => {
      form.classList.toggle('is-active', Number(form.dataset.coForm) === step);
    });
    $$('.checkout-step').forEach((el) => {
      const n = Number(el.dataset.coStep);
      el.classList.toggle('is-active', n === step);
      el.classList.toggle('is-done', n < step);
    });
    $('#checkoutSuccess')?.classList.add('is-hidden');
  }

  function renderCheckoutSummary() {
    const items = cartItems();
    const box = $('#coItems');
    const total = $('#coTotal');
    if (box) {
      box.innerHTML = items.map((it) => `<div class="co-item"><span>${esc(it.product.name)} · ${esc(it.size.label)} × ${it.qty}</span><span>${money(it.total)}</span></div>`).join('') || '<div class="co-item"><span>Carrito vacío</span><span>$0</span></div>';
    }
    if (total) total.textContent = money(cartSubtotal());
  }

  function openCheckout() {
    if (!cartItems().length) {
      UI.toast('Tu carrito está vacío', 'Añade un producto antes de finalizar la compra.', 'error');
      return;
    }
    renderCheckoutSummary();
    setCheckoutStep(1);
    $('#checkoutSuccess')?.classList.add('is-hidden');
    const card = $('input[name="pay"][value="card"]');
    if (card) card.checked = true;
    $('#cardFields')?.classList.remove('is-hidden');
    const terms = $('#coTerms');
    if (terms) terms.checked = false;
    const cardFields = ['#coCard', '#coExp', '#coCvv'];
    cardFields.forEach((sel) => { const el = $(sel); if (el) el.value = ''; });
    const user = currentUser();
    if (user) {
      if ($('#coName')) $('#coName').value = user.name;
      if ($('#coEmail')) $('#coEmail').value = user.email;
    }
    UI.openModal('checkoutModal');
  }

  function fieldError(message) {
    UI.toast('Revisa el formulario', message, 'error');
  }

  function validateRequired(fields) {
    for (const field of fields) {
      if (!String(field.value || '').trim()) {
        field.focus();
        fieldError('Completa todos los campos obligatorios.');
        return false;
      }
    }
    return true;
  }

  function completeOrder(payment) {
    const items = cartItems();
    if (!items.length) {
      UI.toast('Tu carrito está vacío', 'No se puede generar el pedido.', 'error');
      return;
    }
    const user = currentUser();
    const payLabels = { card: 'Tarjeta (demo)', transfer: 'Transferencia (demo)', cash: 'Contra entrega (demo)' };
    const total = cartSubtotal();
    const order = {
      id: 'ord_' + Date.now(),
      code: 'BG-' + new Date().getFullYear() + '-' + String(state.orders.length + 1).padStart(4, '0'),
      date: new Date().toISOString(),
      customer: $('#coName').value.trim(),
      email: $('#coEmail').value.trim().toLowerCase(),
      accountEmail: user ? user.email : null,
      phone: $('#coPhone').value.trim(),
      address: {
        street: $('#coAddress').value.trim(),
        city: $('#coCity').value.trim(),
        state: $('#coState').value.trim(),
        zip: $('#coZip').value.trim(),
        ref: $('#coRef').value.trim()
      },
      payment: payLabels[payment] || 'Demostración',
      items: items.map((it) => ({
        productId: it.product.id,
        sizeId: it.size.id,
        name: it.product.name,
        size: it.size.label,
        qty: it.qty,
        price: it.size.price
      })),
      total,
      status: 'Registrado (demo)'
    };

    state.orders.unshift(order);
    state.cart = [];
    save();
    renderAll();
    renderCheckoutSummary();

    $$('.checkout-form').forEach((form) => form.classList.remove('is-active'));
    $$('.checkout-step').forEach((el) => el.classList.add('is-done'));
    const success = $('#checkoutSuccess');
    if (success) success.classList.remove('is-hidden');
    if ($('#successName')) $('#successName').textContent = order.customer.split(/\s+/)[0] || '';
    if ($('#successCode')) $('#successCode').textContent = `Pedido ${order.code}`;
    if (user) renderProfile();
    UI.toast('Pedido registrado', `Gracias, ${order.customer.split(/\s+/)[0] || ''}. Es una demostración.`);
  }

  /* ---------- Degustación ---------- */
  function fillTastingSelect() {
    const select = $('#tastingProductSelect');
    if (!select) return;
    let html = '<option value="">Proyecto o colaboración</option>';
    LINES.filter((l) => l.id === 'gluco-control' || l.id === 'kefir').forEach((line) => {
      const items = PRODUCTS.filter((p) => p.line === line.id);
      if (!items.length) return;
      html += `<optgroup label="${esc(line.name)}">`;
      html += items.map((p) => `<option value="${esc(p.id)}">${esc(p.name)}</option>`).join('');
      html += '</optgroup>';
    });
    select.innerHTML = html;
  }

  function renderTastingPreview(productId) {
    const box = $('#tastingProduct');
    if (!box) return;
    const product = productById(productId);
    if (product) {
      const art = ART.productArt ? ART.productArt(product) : '';
      box.innerHTML = `${art}<div><strong>${esc(product.name)}</strong><span>${esc(lineById(product.line)?.name || '')} · ${esc(product.sizes[0].label)}</span></div>`;
    } else {
      box.innerHTML = `${icon('flask')}<div><strong>Proyecto o colaboración</strong><span>Cuéntanos qué tienes en mente.</span></div>`;
    }
  }

  function openTasting(productId) {
    fillTastingSelect();
    const select = $('#tastingProductSelect');
    if (select) select.value = productId && productById(productId) ? productId : '';
    renderTastingPreview(select?.value || '');
    const user = currentUser();
    if (user) {
      if ($('#tastingName')) $('#tastingName').value = user.name;
      if ($('#tastingEmail')) $('#tastingEmail').value = user.email;
    }
    const status = $('#tastingStatus');
    if (status) { status.textContent = ''; status.className = 'form-status'; }
    UI.openModal('tastingModal');
  }

  function handleTasting(event) {
    event.preventDefault();
    const name = $('#tastingName').value.trim();
    const email = $('#tastingEmail').value.trim();
    const consent = $('#tastingForm input[name="consent"]').checked;
    const status = $('#tastingStatus');
    if (name.length < 2) { status.textContent = 'Escribe tu nombre.'; status.className = 'form-status is-error'; return; }
    if (!validEmail(email)) { status.textContent = 'Escribe un correo válido.'; status.className = 'form-status is-error'; return; }
    if (!consent) { status.textContent = 'Acepta que podamos contactarte para dar seguimiento.'; status.className = 'form-status is-error'; return; }
    const select = $('#tastingProductSelect');
    const product = productById(select?.value);
    state.tastings.unshift({
      id: 'tst_' + Date.now(),
      date: new Date().toISOString(),
      name,
      email,
      org: $('#tastingOrg').value.trim(),
      phone: $('#tastingPhone').value.trim(),
      productId: product?.id || null,
      productName: product?.name || 'Proyecto o colaboración',
      message: $('#tastingMessage').value.trim()
    });
    save();
    status.textContent = 'Solicitud registrada. Gracias por tu interés.';
    status.className = 'form-status is-ok';
    UI.toast('Solicitud enviada', 'La guardamos en esta demostración.');
    $('#tastingForm').reset();
    setTimeout(() => UI.closeModal('tastingModal'), 1500);
  }

  /* ---------- Contacto ---------- */
  function handleContact(event) {
    event.preventDefault();
    const name = $('#contactName').value.trim();
    const email = $('#contactEmail').value.trim();
    const subject = $('#contactSubject').value.trim();
    const message = $('#contactMessage').value.trim();
    const consent = $('#contactConsent').checked;
    const status = $('#contactStatus');
    if (!name || !validEmail(email) || !message) {
      status.textContent = 'Completa tu nombre, un correo válido y el mensaje.';
      status.className = 'form-status is-error';
      return;
    }
    if (!consent) {
      status.textContent = 'Acepta que podamos contactarte para responder.';
      status.className = 'form-status is-error';
      return;
    }
    state.messages.unshift({
      id: 'msg_' + Date.now(),
      date: new Date().toISOString(),
      name,
      email,
      subject: subject || 'Contacto',
      message
    });
    save();
    status.textContent = 'Mensaje registrado. Gracias por escribirnos.';
    status.className = 'form-status is-ok';
    UI.toast('Mensaje enviado', 'Lo guardamos en esta demostración.');
    $('#contactForm').reset();
  }

  /* ---------- Página de producto ---------- */
  function bindProductPage() {
    const page = $('[data-product-page]');
    if (!page) return;
    const product = productById(page.dataset.productPage);
    if (!product) return;

    const sizeButtons = $$('.size-opt', page);
    const addBtn = $('[data-add-to-cart]', page);
    const qtyInput = $('#qtyInput');
    const galleryArt = page.querySelector('.product-gallery__art');

    function selectSize(sizeId) {
      const size = sizeOf(product, sizeId);
      if (!size) return;
      sizeButtons.forEach((btn) => btn.classList.toggle('is-active', btn.dataset.size === size.id));
      if (galleryArt && ART.productArt) {
        galleryArt.innerHTML = ART.productArt({
          ...product,
          art: { ...(product.art || {}), size: size.label }
        });
      }
      if ($('#priceNow')) $('#priceNow').textContent = money(size.price);
      if ($('#priceOld')) {
        $('#priceOld').textContent = size.compare ? money(size.compare) : '';
        $('#priceOld').hidden = !size.compare;
      }
      if ($('#priceUnit')) $('#priceUnit').textContent = `/ ${size.label}`;
      if ($('#sizeLabel')) $('#sizeLabel').textContent = size.label;
      if ($('#priceSave')) {
        if (size.compare && size.compare > size.price) {
          $('#priceSave').textContent = `Ahorras ${money(size.compare - size.price)}`;
          $('#priceSave').hidden = false;
        } else {
          $('#priceSave').hidden = true;
        }
      }
      if (addBtn) addBtn.dataset.size = size.id;
    }

    sizeButtons.forEach((btn) => btn.addEventListener('click', () => selectSize(btn.dataset.size)));
    const active = $('.size-opt.is-active', page) || sizeButtons[0];
    if (active) selectSize(active.dataset.size);

    if ($('#qtyMinus') && qtyInput) {
      $('#qtyMinus').addEventListener('click', () => { qtyInput.value = clamp(Number(qtyInput.value) - 1, 1, 20); });
      $('#qtyPlus').addEventListener('click', () => { qtyInput.value = clamp(Number(qtyInput.value) + 1, 1, 20); });
      qtyInput.addEventListener('change', () => { qtyInput.value = clamp(Number(qtyInput.value) || 1, 1, 20); });
    }

    if (addBtn) {
      addBtn.addEventListener('click', () => {
        const qty = qtyInput ? clamp(Number(qtyInput.value) || 1, 1, 20) : 1;
        addToCart(product.id, addBtn.dataset.size || product.sizes[0].id, qty);
        renderCart();
        UI.openCart();
      });
    }
  }

  /* ---------- Catálogo ---------- */
  function bindCatalog() {
    const filters = $$('[data-filter]');
    if (!filters.length) return;
    filters.forEach((btn) => {
      btn.addEventListener('click', () => {
        const filter = btn.dataset.filter;
        filters.forEach((b) => b.classList.toggle('is-active', b === btn));
        let visible = 0;
        $$('.product-card[data-line]').forEach((card) => {
          const show = filter === 'all' || card.dataset.line === filter;
          card.classList.toggle('is-hidden', !show);
          if (show) visible += 1;
        });
        const count = $('#catalogCount');
        if (count) count.textContent = `${visible} producto${visible === 1 ? '' : 's'}`;
        $('#catalogEmpty')?.classList.toggle('is-hidden', visible > 0);
      });
    });
  }

  /* ---------- Tabs y acordeones ---------- */
  function bindTabs() {
    $$('.tab-btn').forEach((btn) => {
      btn.addEventListener('click', () => {
        const target = btn.dataset.tab;
        $$('.tab-btn').forEach((b) => {
          const active = b === btn;
          b.classList.toggle('is-active', active);
          b.setAttribute('aria-selected', active ? 'true' : 'false');
        });
        $$('.tab-panel').forEach((panel) => panel.classList.toggle('is-active', panel.id === 'tab-' + target));
      });
    });
  }

  function bindAccordions() {
    $$('.acc-btn').forEach((btn) => {
      btn.addEventListener('click', () => {
        const item = btn.closest('.acc-item');
        const open = item.classList.toggle('is-open');
        btn.setAttribute('aria-expanded', open ? 'true' : 'false');
      });
    });
  }

  /* ---------- Eventos globales ---------- */
  function bindGlobal() {
    document.addEventListener('click', (event) => {
      const openCart = event.target.closest('[data-open-cart]');
      if (openCart) {
        event.preventDefault();
        renderCart();
        UI.openCart();
        return;
      }
      const account = event.target.closest('[data-open-account]');
      if (account) {
        event.preventDefault();
        openAccount();
        return;
      }
      const tasting = event.target.closest('[data-tasting]');
      if (tasting) {
        event.preventDefault();
        openTasting(tasting.dataset.tasting);
        return;
      }
      const openTastingBtn = event.target.closest('[data-open-tasting]');
      if (openTastingBtn) {
        event.preventDefault();
        openTasting(null);
        return;
      }
      const checkout = event.target.closest('[data-open-checkout]');
      if (checkout) {
        event.preventDefault();
        openCheckout();
        return;
      }
      const fav = event.target.closest('[data-fav]');
      if (fav) {
        event.preventDefault();
        toggleFav(fav.dataset.fav);
      }
    });

    $('#cartBody')?.addEventListener('click', (event) => {
      const inc = event.target.closest('[data-cart-inc]');
      const dec = event.target.closest('[data-cart-dec]');
      const remove = event.target.closest('[data-cart-remove]');
      if (inc) changeQty(inc.dataset.cartInc, 1);
      if (dec) changeQty(dec.dataset.cartDec, -1);
      if (remove) removeItem(remove.dataset.cartRemove);
    });

    $('#cartFoot')?.addEventListener('click', (event) => {
      if (event.target.closest('[data-cart-checkout]')) {
        event.preventDefault();
        UI.closeCart();
        setTimeout(openCheckout, 180);
      }
    });

    $('#profileData')?.addEventListener('click', (event) => {
      if (event.target.closest('#clearDataBtn')) {
        if (window.confirm('¿Borrar la cuenta, los pedidos y los favoritos de esta demostración?')) {
          try { localStorage.removeItem(UI.STORE_KEY); } catch (err) { /* sin almacenamiento */ }
          resetState();
          UI.closeModal('profileModal');
          renderAll();
          UI.toast('Datos borrados', 'La demostración volvió a su estado inicial.');
        }
      }
    });

    $('#logoutBtn')?.addEventListener('click', logout);

    $$('[data-auth-tab]').forEach((btn) => {
      btn.addEventListener('click', () => setAuthTab(btn.dataset.authTab));
    });
    $$('[data-profile-tab]').forEach((btn) => {
      btn.addEventListener('click', () => setProfileTab(btn.dataset.profileTab));
    });

    $('#loginForm')?.addEventListener('submit', handleLogin);
    $('#registerForm')?.addEventListener('submit', handleRegister);
    $('#tastingForm')?.addEventListener('submit', handleTasting);
    $('#contactForm')?.addEventListener('submit', handleContact);
    $('#tastingProductSelect')?.addEventListener('change', (event) => renderTastingPreview(event.target.value));
  }

  function bindCheckout() {
    $('#coForm1')?.addEventListener('submit', (event) => {
      event.preventDefault();
      const fields = [$('#coName'), $('#coEmail'), $('#coPhone')];
      if (!validateRequired(fields)) return;
      if (!validEmail($('#coEmail').value)) { $('#coEmail').focus(); fieldError('Escribe un correo válido.'); return; }
      if (digits($('#coPhone').value).length < 10) { $('#coPhone').focus(); fieldError('Escribe un teléfono de al menos 10 dígitos.'); return; }
      setCheckoutStep(2);
    });

    $('#coForm2')?.addEventListener('submit', (event) => {
      event.preventDefault();
      const fields = [$('#coAddress'), $('#coCity'), $('#coState'), $('#coZip')];
      if (!validateRequired(fields)) return;
      if (digits($('#coZip').value).length !== 5) { $('#coZip').focus(); fieldError('El código postal debe tener 5 dígitos.'); return; }
      setCheckoutStep(3);
    });

    $('#coForm3')?.addEventListener('submit', (event) => {
      event.preventDefault();
      const terms = $('#coTerms');
      if (!terms.checked) { fieldError('Acepta que este pedido es una demostración.'); terms.focus(); return; }
      const payment = $('input[name="pay"]:checked')?.value || 'card';
      if (payment === 'card') {
        const card = $('#coCard');
        const exp = $('#coExp');
        const cvv = $('#coCvv');
        if (digits(card.value).length !== 16) { card.focus(); fieldError('El número de tarjeta debe tener 16 dígitos (demo).'); return; }
        if (!/^\d{2}\/\d{2}$/.test(exp.value.trim())) { exp.focus(); fieldError('Usa el formato MM/AA.'); return; }
        if (digits(cvv.value).length < 3) { cvv.focus(); fieldError('El CVV debe tener 3 o 4 dígitos.'); return; }
      }
      completeOrder(payment);
    });

    $$('[data-co-back]').forEach((btn) => {
      btn.addEventListener('click', () => setCheckoutStep(Math.max(1, checkoutStep - 1)));
    });

    $$('input[name="pay"]').forEach((radio) => {
      radio.addEventListener('change', () => {
        const payment = $('input[name="pay"]:checked')?.value;
        $('#cardFields')?.classList.toggle('is-hidden', payment !== 'card');
      });
    });
  }

  /* ---------- Arranque ---------- */
  function renderAll() {
    renderCart();
    renderAccountButton();
    syncFavButtons();
    UI.updateCartCount(cartCount());
  }

  function boot(attempt = 0) {
    if (!document.getElementById('cartDrawer')) {
      if (attempt < 80) setTimeout(() => boot(attempt + 1), 20);
      return;
    }
    load();
    bindGlobal();
    bindCheckout();
    bindProductPage();
    bindCatalog();
    bindTabs();
    bindAccordions();
    renderAll();
    renderCart();
    setAuthTab('login');
  }

  window.BIORIGEN_APP = {
    state,
    isLoggedIn,
    currentUser,
    openAccount,
    openTasting,
    addToCart,
    renderAll
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => boot(), { once: true });
  } else {
    boot();
  }
})();
