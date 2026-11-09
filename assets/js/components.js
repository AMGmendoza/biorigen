/* ============================================================
   BIORIGEN · Componentes de interfaz
   Header/footer se generan en el HTML; aquí van las capas
   interactivas: carrito, cuenta, checkout, perfil y avisos.
   ============================================================ */
(function (global) {
  'use strict';

  const DATA = global.BIORIGEN || {};
  const ART = global.BIORIGEN_ART || {};
  /* En la portada `data-root` es "" y debe comportarse como "./": con "/" los
     enlaces generados aquí se escaparían de una subcarpeta de GitHub Pages. */
  const rootAttr = document.documentElement.getAttribute('data-root');
  const root = rootAttr ? rootAttr.replace(/\/?$/, '/') : './';
  const STORE_KEY = 'biorigen_v1_state';
  let lastFocus = null;

  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));
  const esc = (value) => String(value ?? '').replace(/[&<>"']/g, (ch) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  }[ch]));
  const money = (n) => '$' + Number(n || 0).toLocaleString('es-MX', { maximumFractionDigits: 0 });
  const icon = (name, cls = '') => `<svg class="icon ${cls}" aria-hidden="true" focusable="false"><use href="#i-${name}"></use></svg>`;
  const link = (path = '') => {
    if (!path || path === '#' || /^(https?:|mailto:|tel:|#)/.test(path)) return path;
    return root + path.replace(/^\//, '');
  };
  const productLink = (p) => link(`productos/${p.line}/${p.slug}/`);
  const lineLink = (l) => link(`productos/${l.slug}/`);
  const projectLink = (p) => link(`proyectos/${p.slug}/`);

  function toast(title, text = '', type = 'ok') {
    const stack = $('#toastStack');
    if (!stack) return;
    const el = document.createElement('div');
    el.className = 'toast' + (type === 'error' ? ' toast--error' : '');
    el.innerHTML = `${icon(type === 'error' ? 'info' : 'check-circle')}<div><strong>${esc(title)}</strong>${text ? `<span>${esc(text)}</span>` : ''}</div>`;
    stack.appendChild(el);
    setTimeout(() => {
      el.classList.add('is-out');
      setTimeout(() => el.remove(), 260);
    }, 4200);
  }

  function closeMobileMenu() {
    const panel = $('#mobilePanel');
    const btn = $('#menuBtn');
    if (panel?.classList.contains('is-open')) {
      panel.classList.remove('is-open');
      btn?.setAttribute('aria-expanded', 'false');
      if (!$('.modal.is-open') && !$('#cartDrawer')?.classList.contains('is-open')) {
        document.body.classList.remove('no-scroll');
      }
    }
  }

  function openCart() {
    closeModals();
    closeMobileMenu();
    const overlay = $('#overlay');
    const cart = $('#cartDrawer');
    if (!overlay || !cart) return;
    rememberOrigin();
    overlay.classList.add('is-open');
    cart.classList.add('is-open');
    cart.setAttribute('aria-hidden', 'false');
    document.body.classList.add('no-scroll');
    setTimeout(() => $('.cart-close', cart)?.focus(), 80);
  }

  function closeCart() {
    const overlay = $('#overlay');
    const cart = $('#cartDrawer');
    if (!overlay || !cart) return;
    /* Solo devolvemos el foco si el cajón estaba abierto: al abrir un modal
       se llama a closeCart() de forma preventiva y no debe consumir el foco
       de origen que el modal acaba de guardar. */
    const wasOpen = cart.classList.contains('is-open');
    overlay.classList.remove('is-open');
    cart.classList.remove('is-open');
    cart.setAttribute('aria-hidden', 'true');
    if (!$('.modal.is-open')) document.body.classList.remove('no-scroll');
    if (wasOpen) restoreFocus();
  }

  /* Devuelve el foco al disparador real: si el foco estaba dentro de otra
     capa que se está cerrando, conserva el origen anterior. */
  function rememberOrigin() {
    const active = document.activeElement;
    if (active && !active.closest('.modal, .cart-drawer, #mobilePanel')) lastFocus = active;
    else if (!lastFocus) lastFocus = active;
  }

  function restoreFocus() {
    const target = lastFocus;
    lastFocus = null;
    if (target && document.contains(target) && target.getClientRects().length) {
      target.focus({ preventScroll: true });
    }
  }

  function openModal(id) {
    /* Cerramos primero el cajón: si seguía abierto, su cierre devuelve el
       foco al disparador original, que es el origen correcto del modal. */
    closeCart();
    closeMobileMenu();
    rememberOrigin();
    $$('.modal').forEach((m) => {
      if (m.id !== id) {
        m.classList.remove('is-open');
        m.setAttribute('aria-hidden', 'true');
      }
    });
    const modal = document.getElementById(id);
    if (!modal) return;
    modal.classList.add('is-open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.classList.add('no-scroll');
    setTimeout(() => {
      const first = $('input:not([type="hidden"]), select, textarea, button:not(.modal__close)', modal);
      if (first) first.focus({ preventScroll: true });
    }, 90);
  }

  function closeModal(id) {
    const modal = id ? document.getElementById(id) : $('.modal.is-open');
    if (!modal) return;
    const wasOpen = modal.classList.contains('is-open');
    modal.classList.remove('is-open');
    modal.setAttribute('aria-hidden', 'true');
    if (!$('.modal.is-open') && !$('.cart-drawer.is-open')) document.body.classList.remove('no-scroll');
    if (wasOpen) restoreFocus();
  }

  function closeModals() {
    const open = $$('.modal.is-open');
    open.forEach((m) => {
      m.classList.remove('is-open');
      m.setAttribute('aria-hidden', 'true');
    });
    if (open.length) restoreFocus();
  }

  function closeAll() {
    closeCart();
    closeModals();
    document.body.classList.remove('no-scroll');
    $$('.has-drop.is-open').forEach((item) => {
      item.classList.remove('is-open');
      $('.drop-toggle', item)?.setAttribute('aria-expanded', 'false');
    });
    const panel = $('#mobilePanel');
    const btn = $('#menuBtn');
    if (panel?.classList.contains('is-open')) {
      panel.classList.remove('is-open');
      btn?.setAttribute('aria-expanded', 'false');
    }
  }

  function updateCartCount(count) {
    $$('.cart-count').forEach((el) => {
      el.textContent = count > 99 ? '99+' : String(count);
      el.hidden = count <= 0;
    });
    const head = $('#cartHeadCount');
    if (head) head.textContent = count === 0 ? 'Sin artículos' : `${count} artículo${count === 1 ? '' : 's'}`;
    const cartBtn = $('[data-open-cart]');
    if (cartBtn) {
      cartBtn.setAttribute(
        'aria-label',
        count > 0 ? `Abrir carrito (${count} artículo${count === 1 ? '' : 's'})` : 'Abrir carrito'
      );
    }
  }

  function chromeHTML() {
    return `
      <div class="overlay" id="overlay" data-close-cart></div>

      <aside class="cart-drawer" id="cartDrawer" role="dialog" aria-modal="true" aria-labelledby="cartTitle" aria-hidden="true">
        <div class="sheet-grab" data-sheet-handle aria-hidden="true"></div>
        <div class="cart-head">
          <div>
            <span class="eyebrow">Tu selección</span>
            <h3 id="cartTitle">Carrito</h3>
            <div class="cart-head__count" id="cartHeadCount">Sin artículos</div>
          </div>
          <button class="cart-close" type="button" data-close-cart aria-label="Cerrar carrito">${icon('close')}</button>
        </div>
        <div class="cart-body" id="cartBody"></div>
        <div class="cart-foot" id="cartFoot"></div>
      </aside>

      <div class="modal" id="authModal" role="dialog" aria-modal="true" aria-labelledby="authTitle" aria-hidden="true">
        <div class="modal__panel">
          <div class="sheet-grab" data-sheet-handle aria-hidden="true"></div>
          <button class="modal__close" type="button" data-close-modal aria-label="Cerrar">${icon('close')}</button>
          <div class="modal__head">
            <span class="eyebrow">Cuenta Biorigen</span>
            <h2 id="authTitle">Entra a tu cuenta</h2>
            <p>Guarda tus favoritos y consulta tus pedidos de demostración. Todo se guarda en este navegador.</p>
          </div>
          <div class="auth-tabs" role="tablist" aria-label="Acceso a la cuenta">
            <button class="auth-tab is-active" type="button" role="tab" aria-selected="true" data-auth-tab="login">Iniciar sesión</button>
            <button class="auth-tab" type="button" role="tab" aria-selected="false" data-auth-tab="register">Crear cuenta</button>
          </div>
          <form class="auth-form" id="loginForm" novalidate>
            <div class="field">
              <label for="loginEmail">Correo electrónico</label>
              <input class="input" id="loginEmail" name="email" type="email" autocomplete="email" required placeholder="tu@correo.com">
            </div>
            <div class="field">
              <label for="loginPass">Contraseña</label>
              <input class="input" id="loginPass" name="password" type="password" autocomplete="current-password" required placeholder="••••••••">
            </div>
            <p class="auth-error" id="loginError" role="alert"></p>
            <button class="btn btn--solid btn--block auth-submit" type="submit">Entrar</button>
            <p class="auth-note">Demostración local. No se envían datos a ningún servidor. No uses una contraseña que utilices en otros sitios.</p>
          </form>
          <form class="auth-form is-hidden" id="registerForm" novalidate>
            <div class="field">
              <label for="regName">Nombre completo</label>
              <input class="input" id="regName" name="name" type="text" autocomplete="name" required placeholder="Tu nombre">
            </div>
            <div class="field">
              <label for="regEmail">Correo electrónico</label>
              <input class="input" id="regEmail" name="email" type="email" autocomplete="email" required placeholder="tu@correo.com">
            </div>
            <div class="field">
              <label for="regPass">Contraseña (mínimo 6 caracteres)</label>
              <input class="input" id="regPass" name="password" type="password" autocomplete="new-password" required placeholder="••••••••">
            </div>
            <div class="field">
              <label for="regPass2">Repite la contraseña</label>
              <input class="input" id="regPass2" name="password2" type="password" autocomplete="new-password" required placeholder="••••••••">
            </div>
            <p class="auth-error" id="registerError" role="alert"></p>
            <button class="btn btn--solid btn--block auth-submit" type="submit">Crear mi cuenta</button>
            <p class="auth-note">Demostración local. No se envían datos a ningún servidor. No uses una contraseña que utilices en otros sitios.</p>
          </form>
        </div>
      </div>

      <div class="modal modal--wide" id="checkoutModal" role="dialog" aria-modal="true" aria-labelledby="checkoutTitle" aria-hidden="true">
        <div class="modal__panel">
          <div class="sheet-grab" data-sheet-handle aria-hidden="true"></div>
          <button class="modal__close" type="button" data-close-modal aria-label="Cerrar">${icon('close')}</button>
          <div class="modal__head">
            <span class="eyebrow">Compra de demostración</span>
            <h2 id="checkoutTitle">Finalizar pedido</h2>
            <p>Completa los datos para simular el pedido. No se procesan pagos ni se realizan envíos reales.</p>
          </div>
          <div class="checkout-steps" aria-hidden="true">
            <div class="checkout-step is-active" data-co-step="1"><span class="checkout-step__n">1</span><span>Datos</span></div>
            <span class="checkout-sep"></span>
            <div class="checkout-step" data-co-step="2"><span class="checkout-step__n">2</span><span>Envío</span></div>
            <span class="checkout-sep"></span>
            <div class="checkout-step" data-co-step="3"><span class="checkout-step__n">3</span><span>Pago</span></div>
          </div>
          <div class="checkout-grid">
            <div>
              <form class="checkout-form is-active" id="coForm1" data-co-form="1" novalidate>
                <h3>Tus datos</h3>
                <div class="form-grid">
                  <div class="field field--full">
                    <label for="coName">Nombre completo</label>
                    <input class="input" id="coName" name="name" autocomplete="name" required>
                  </div>
                  <div class="field">
                    <label for="coEmail">Correo</label>
                    <input class="input" id="coEmail" name="email" type="email" autocomplete="email" required>
                  </div>
                  <div class="field">
                    <label for="coPhone">Teléfono</label>
                    <input class="input" id="coPhone" name="phone" type="tel" autocomplete="tel" required>
                  </div>
                </div>
                <p class="form-error" id="coErr1" role="alert"></p>
                <div class="checkout-nav">
                  <button class="btn btn--ghost" type="button" data-close-modal>Cancelar</button>
                  <button class="btn btn--solid" type="submit">Continuar</button>
                </div>
              </form>

              <form class="checkout-form" id="coForm2" data-co-form="2" novalidate>
                <h3>Envío</h3>
                <div class="form-grid">
                  <div class="field field--full">
                    <label for="coAddress">Calle y número</label>
                    <input class="input" id="coAddress" name="address" autocomplete="street-address" required>
                  </div>
                  <div class="field">
                    <label for="coCity">Ciudad</label>
                    <input class="input" id="coCity" name="city" autocomplete="address-level2" required>
                  </div>
                  <div class="field">
                    <label for="coState">Estado</label>
                    <input class="input" id="coState" name="state" autocomplete="address-level1" required>
                  </div>
                  <div class="field">
                    <label for="coZip">Código postal</label>
                    <input class="input" id="coZip" name="zip" inputmode="numeric" autocomplete="postal-code" required>
                  </div>
                  <div class="field">
                    <label for="coRef">Referencias</label>
                    <input class="input" id="coRef" name="ref" placeholder="Entre calles, número exterior...">
                  </div>
                </div>
                <p class="form-error" id="coErr2" role="alert"></p>
                <div class="checkout-nav">
                  <button class="btn btn--ghost" type="button" data-co-back>Volver</button>
                  <button class="btn btn--solid" type="submit">Continuar</button>
                </div>
              </form>

              <form class="checkout-form" id="coForm3" data-co-form="3" novalidate>
                <h3>Pago</h3>
                <h4>Método de pago</h4>
                <div class="pay-methods">
                  <label class="pay-method"><input type="radio" name="pay" value="card" checked> ${icon('credit-card')} Tarjeta de crédito o débito</label>
                  <label class="pay-method"><input type="radio" name="pay" value="transfer"> ${icon('package')} Transferencia bancaria</label>
                  <label class="pay-method"><input type="radio" name="pay" value="cash"> ${icon('truck')} Pago contra entrega</label>
                </div>
                <div id="cardFields">
                  <div class="form-grid">
                    <div class="field field--full">
                      <label for="coCard">Número de tarjeta</label>
                      <input class="input" id="coCard" name="card" inputmode="numeric" placeholder="4242 4242 4242 4242">
                    </div>
                    <div class="field">
                      <label for="coExp">Vencimiento</label>
                      <input class="input" id="coExp" name="exp" placeholder="MM/AA">
                    </div>
                    <div class="field">
                      <label for="coCvv">CVV</label>
                      <input class="input" id="coCvv" name="cvv" inputmode="numeric" placeholder="123">
                    </div>
                  </div>
                </div>
                <label class="check" style="margin-top:12px">
                  <input type="checkbox" id="coTerms" required>
                  Acepto que este pedido es una demostración académica y no se realizará ningún cargo.
                </label>
                <p class="form-error" id="coErr3" role="alert"></p>
                <div class="checkout-nav">
                  <button class="btn btn--ghost" type="button" data-co-back>Volver</button>
                  <button class="btn btn--solid" type="submit">Confirmar pedido</button>
                </div>
              </form>

              <div class="checkout-success is-hidden" id="checkoutSuccess">
                <div class="checkout-success__icon">${icon('check')}</div>
                <h3>Pedido registrado</h3>
                <p>Gracias, <strong id="successName"></strong>. Tu pedido de demostración quedó guardado en este navegador.</p>
                <div class="order-code" id="successCode"></div>
                <button class="btn btn--solid" type="button" data-close-modal>Volver al sitio</button>
              </div>
            </div>
            <aside class="checkout-summary" aria-label="Resumen del pedido">
              <h3>Resumen</h3>
              <div class="co-items" id="coItems"></div>
              <div class="co-total"><span>Total estimado</span><strong id="coTotal">$0</strong></div>
              <p class="form-note" id="coShipping">Se confirma al finalizar · no incluye envío ni impuestos</p>
            </aside>
          </div>
        </div>
      </div>

      <div class="modal modal--wide" id="profileModal" role="dialog" aria-modal="true" aria-labelledby="profileTitle" aria-hidden="true">
        <div class="modal__panel">
          <div class="sheet-grab" data-sheet-handle aria-hidden="true"></div>
          <button class="modal__close" type="button" data-close-modal aria-label="Cerrar">${icon('close')}</button>
          <div class="profile-head" id="profileHead"></div>
          <div class="profile-tabs" role="tablist" aria-label="Mi cuenta">
            <button class="profile-tab is-active" type="button" role="tab" aria-selected="true" data-profile-tab="orders">Pedidos</button>
            <button class="profile-tab" type="button" role="tab" aria-selected="false" data-profile-tab="favorites">Favoritos</button>
            <button class="profile-tab" type="button" role="tab" aria-selected="false" data-profile-tab="data">Mi cuenta</button>
          </div>
          <div class="profile-panel is-active" data-profile-panel="orders" id="profileOrders"></div>
          <div class="profile-panel" data-profile-panel="favorites" id="profileFavorites"></div>
          <div class="profile-panel" data-profile-panel="data" id="profileData"></div>
          <div class="profile-actions">
            <button class="btn btn--ghost" type="button" data-open-tasting>Solicitar degustación</button>
            <button class="btn btn--ghost" type="button" id="logoutBtn">Cerrar sesión</button>
          </div>
        </div>
      </div>

      <div class="modal" id="tastingModal" role="dialog" aria-modal="true" aria-labelledby="tastingTitle" aria-hidden="true">
        <div class="modal__panel">
          <div class="sheet-grab" data-sheet-handle aria-hidden="true"></div>
          <button class="modal__close" type="button" data-close-modal aria-label="Cerrar">${icon('close')}</button>
          <div class="modal__head">
            <span class="eyebrow">Degustación</span>
            <h2 id="tastingTitle">Solicitar una degustación</h2>
            <p>Déjanos tus datos y el producto que te interesa. La solicitud se registra en esta demostración.</p>
          </div>
          <div class="tasting-product" id="tastingProduct"></div>
          <form class="tasting-form" id="tastingForm" novalidate>
            <div class="form-grid">
              <div class="field">
                <label for="tastingName">Nombre</label>
                <input class="input" id="tastingName" name="name" autocomplete="name" required>
              </div>
              <div class="field">
                <label for="tastingEmail">Correo</label>
                <input class="input" id="tastingEmail" name="email" type="email" autocomplete="email" required>
              </div>
              <div class="field">
                <label for="tastingOrg">Institución o negocio</label>
                <input class="input" id="tastingOrg" name="org" placeholder="Opcional">
              </div>
              <div class="field">
                <label for="tastingPhone">Teléfono</label>
                <input class="input" id="tastingPhone" name="phone" type="tel" autocomplete="tel" placeholder="Opcional">
              </div>
              <div class="field field--full">
                <label for="tastingProductSelect">Producto de interés</label>
                <select class="select" id="tastingProductSelect" name="product"></select>
              </div>
              <div class="field field--full">
                <label for="tastingMessage">Mensaje</label>
                <textarea class="textarea" id="tastingMessage" name="message" placeholder="Cuéntanos para qué evento, negocio o institución la solicitas."></textarea>
              </div>
            </div>
            <label class="check">
              <input type="checkbox" name="consent" required>
              Acepto que Biorigen me contacte para dar seguimiento a esta solicitud.
            </label>
            <p class="form-status" id="tastingStatus" role="status"></p>
            <button class="btn btn--solid btn--block" type="submit">Enviar solicitud</button>
            <p class="form-note">Demostración: la solicitud se guarda en este navegador, no se envía por correo.</p>
          </form>
        </div>
      </div>

      <p class="sr-only" id="uiLive" role="status" aria-live="polite"></p>
      <div class="toast-stack" id="toastStack" aria-live="polite" aria-atomic="false"></div>
    `;
  }

  function initChrome() {
    document.body.insertAdjacentHTML('beforeend', chromeHTML());
  }

  function initMenu() {
    $$('.has-drop').forEach((item) => {
      const btn = $('.drop-toggle', item);
      if (!btn) return;
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        const isOpen = item.classList.contains('is-open');
        $$('.has-drop.is-open').forEach((other) => {
          other.classList.remove('is-open');
          $('.drop-toggle', other)?.setAttribute('aria-expanded', 'false');
        });
        if (!isOpen) {
          item.classList.add('is-open');
          btn.setAttribute('aria-expanded', 'true');
        }
      });
    });

    document.addEventListener('click', (e) => {
      if (!e.target.closest('.has-drop')) {
        $$('.has-drop.is-open').forEach((item) => {
          item.classList.remove('is-open');
          $('.drop-toggle', item)?.setAttribute('aria-expanded', 'false');
        });
      }
    });

    const menuBtn = $('#menuBtn');
    const panel = $('#mobilePanel');
    if (menuBtn && panel) {
      menuBtn.addEventListener('click', () => {
        const open = panel.classList.toggle('is-open');
        menuBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
        document.body.classList.toggle('no-scroll', open);
      });
      panel.addEventListener('click', (e) => {
        if (e.target.closest('a')) closeMobileMenu();
      });
    }
    $$('.mobile-group').forEach((group) => {
      const btn = $('.mobile-toggle', group);
      if (!btn) return;
      btn.addEventListener('click', () => {
        const open = group.classList.toggle('is-open');
        btn.setAttribute('aria-expanded', open ? 'true' : 'false');
      });
    });
  }

  function initGlobalClicks() {
    document.addEventListener('input', (e) => {
      if (e.target.matches('[aria-invalid="true"]') && String(e.target.value || '').trim()) {
        e.target.removeAttribute('aria-invalid');
      }
    });
    document.addEventListener('click', (e) => {
      const closer = e.target.closest('[data-close-cart], [data-close-modal]');
      if (closer) {
        /* Los CTA que además navegan ("Ver productos", "Ver") deben seguir su
           href: cerramos la capa sin cancelar la navegación. */
        const navigates = closer.tagName === 'A' && closer.getAttribute('href') && closer.getAttribute('href') !== '#';
        if (!navigates) e.preventDefault();
        if (closer.hasAttribute('data-close-cart')) closeCart();
        else closeModal();
        if (navigates) {
          // El documento se va; liberamos el bloqueo para no dejar la página sin scroll.
          document.body.classList.remove('no-scroll');
          return;
        }
      }
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        closeAll();
        return;
      }
      if (e.key !== 'Tab') return;
      const dialog = $('.modal.is-open .modal__panel') || $('.cart-drawer.is-open');
      if (!dialog) return;
      const focusables = $$(
        'a[href], button:not([disabled]), input:not([disabled]):not([type="hidden"]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
        dialog
      ).filter((el) => el.offsetWidth > 0 || el.offsetHeight > 0);
      if (!focusables.length) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    });
  }

  function initReveal() {
    const items = $$('[data-reveal]');
    if (!items.length) return;
    items.forEach((el) => {
      const siblings = el.parentElement ? $$('[data-reveal]', el.parentElement) : [el];
      const index = Math.min(siblings.indexOf(el), 6);
      if (index > 0) el.style.setProperty('--reveal-i', String(index));
    });
    /* Lo que ya está en la primera pantalla se queda visible: el estado oculto
       se activa después, y solo para lo que está fuera de pantalla. Si el JS
       no llegara a cargar, el contenido sigue visible desde el HTML. */
    const viewport = window.innerHeight || document.documentElement.clientHeight;
    const pending = items.filter((el) => el.getBoundingClientRect().top >= viewport);
    items.forEach((el) => {
      if (!pending.includes(el)) el.classList.add('is-in', 'reveal-now');
    });
    if (!pending.length) return;
    document.documentElement.classList.add('reveal-ready');
    if (!('IntersectionObserver' in window)) {
      pending.forEach((el) => el.classList.add('is-in'));
      return;
    }
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-in');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: .12, rootMargin: '0px 0px -40px 0px' });
    pending.forEach((el) => io.observe(el));
  }

  function initYear() {
    $$('[data-year]').forEach((el) => { el.textContent = new Date().getFullYear(); });
  }

  const UI = {
    root, STORE_KEY, $, $$, esc, money, icon, link, productLink, lineLink, projectLink,
    toast, openCart, closeCart, openModal, closeModal, closeModals, closeAll,
    updateCartCount, initChrome, initMenu, initGlobalClicks, initReveal, initYear
  };

  global.BIORIGEN_UI = UI;

  function boot() {
    initChrome();
    initMenu();
    initGlobalClicks();
    initReveal();
    initYear();
    /* Red de seguridad: si el script de interfaz no llegara a cargar, el
       guardián del <head> vuelve visible el contenido a los 2.5 s. */
    if (global.__bgGuard) clearTimeout(global.__bgGuard);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot, { once: true });
  } else {
    boot();
  }
})(typeof window !== 'undefined' ? window : globalThis);
