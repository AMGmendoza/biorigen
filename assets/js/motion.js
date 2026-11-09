/* ============================================================
   BIORIGEN · Capa de movimiento
   Interacciones interrumpibles con física de resortes.
   ============================================================ */
(function (global) {
  'use strict';

  const UI = global.BIORIGEN_UI || {};
  const reduceMotion = global.matchMedia('(prefers-reduced-motion: reduce)');
  const finePointer = global.matchMedia('(pointer: fine)');
  const mobileSheet = global.matchMedia('(max-width: 720px)');

  const reduced = () => reduceMotion.matches;

  /* Proyección de momento de Apple: dónde terminaría el gesto. */
  function project(velocity, deceleration = 0.998) {
    return (velocity / 1000) * deceleration / (1 - deceleration);
  }

  /* Resistencia progresiva en los bordes. */
  function rubberband(offset, dimension, constant = 0.55) {
    return (offset * dimension * constant) / (dimension + constant * Math.abs(offset));
  }

  /* Resorte crítico con velocidad heredada del gesto. */
  function springTo({ from, to, velocity = 0, response = 0.36, dampingRatio = 0.9, onUpdate, onDone }) {
    const stiffness = Math.pow((2 * Math.PI) / response, 2);
    const damping = 2 * dampingRatio * Math.sqrt(stiffness);
    let x = from;
    let v = velocity;
    let last = performance.now();

    function step(now) {
      const dt = Math.min((now - last) / 1000, 1 / 30);
      last = now;
      const acceleration = -stiffness * (x - to) - damping * v;
      v += acceleration * dt;
      x += v * dt;
      onUpdate(x);
      if (Math.abs(v) < 4 && Math.abs(x - to) < 0.5) {
        onUpdate(to);
        if (onDone) onDone();
        return;
      }
      global.requestAnimationFrame(step);
    }
    global.requestAnimationFrame(step);
  }

  /* ---------- Material del encabezado ---------- */
  function initHeaderMaterial() {
    const head = document.querySelector('.site-head');
    if (!head) return;
    let frame = 0;
    const update = () => {
      head.classList.toggle('is-scrolled', global.scrollY > 8);
      frame = 0;
    };
    global.addEventListener('scroll', () => {
      if (!frame) frame = global.requestAnimationFrame(update);
    }, { passive: true });
    update();
  }

  /* ---------- Paralaje del escenario ---------- */
  function initParallax() {
    const stage = document.querySelector('[data-parallax]');
    if (!stage || !finePointer.matches) return;
    const items = Array.from(stage.querySelectorAll('[data-float]'));
    if (!items.length) return;

    let targetX = 0;
    let targetY = 0;
    let currentX = 0;
    let currentY = 0;
    let frame = 0;
    let active = false;

    function render() {
      currentX += (targetX - currentX) * 0.085;
      currentY += (targetY - currentY) * 0.085;
      items.forEach((el) => {
        const depth = parseFloat(el.dataset.float) || 0.5;
        el.style.setProperty('--dx', (currentX * depth * 24).toFixed(2) + 'px');
        el.style.setProperty('--dy', (currentY * depth * 18).toFixed(2) + 'px');
      });
      if (!active && Math.abs(currentX - targetX) < 0.002 && Math.abs(currentY - targetY) < 0.002) {
        frame = 0;
        return;
      }
      frame = global.requestAnimationFrame(render);
    }

    function start() {
      if (!frame) frame = global.requestAnimationFrame(render);
    }

    stage.addEventListener('pointermove', (event) => {
      if (event.pointerType === 'touch' || reduced()) return;
      const rect = stage.getBoundingClientRect();
      targetX = ((event.clientX - rect.left) / rect.width - 0.5) * 2;
      targetY = ((event.clientY - rect.top) / rect.height - 0.5) * 2;
      active = true;
      start();
    });

    stage.addEventListener('pointerleave', () => {
      targetX = 0;
      targetY = 0;
      active = false;
      start();
    });
  }

  /* ---------- Arrastre con resorte ---------- */
  function trackVelocity(state, position) {
    const now = performance.now();
    state.velocity = (position - state.lastPosition) / Math.max(1, now - state.lastTime) * 1000;
    state.lastPosition = position;
    state.lastTime = now;
  }

  function initCartDrag() {
    const cart = document.getElementById('cartDrawer');
    const handle = cart ? cart.querySelector('[data-sheet-handle]') : null;
    if (!cart || !handle) return;

    let drag = null;

    handle.addEventListener('pointerdown', (event) => {
      if (reduced() || (event.button !== undefined && event.button !== 0)) return;
      drag = {
        pointerId: event.pointerId,
        startX: event.clientX,
        startY: event.clientY,
        lastPosition: event.clientX,
        lastTime: performance.now(),
        velocity: 0,
        moved: false,
        width: cart.getBoundingClientRect().width
      };
      handle.setPointerCapture(event.pointerId);
    });

    handle.addEventListener('pointermove', (event) => {
      if (!drag || event.pointerId !== drag.pointerId) return;
      const dx = event.clientX - drag.startX;
      const dy = event.clientY - drag.startY;
      if (!drag.moved) {
        if (Math.abs(dx) < 8 || Math.abs(dx) < Math.abs(dy)) return;
        drag.moved = true;
        cart.classList.add('is-dragging');
      }
      const width = drag.width;
      /* El cajón está anclado a la derecha: se cierra arrastrando hacia la
         derecha y el gesto contrario ofrece resistencia. */
      const offset = dx < 0 ? -rubberband(-dx, width) : Math.min(width, dx);
      cart.style.transform = `translate3d(${offset}px, 0, 0)`;
      trackVelocity(drag, event.clientX);
    });

    function endDrag(event) {
      if (!drag || (event && event.pointerId !== drag.pointerId)) return;
      const state = drag;
      drag = null;
      if (!state.moved) {
        cart.classList.remove('is-dragging');
        cart.style.transform = '';
        return;
      }
      const width = state.width;
      const projected = state.lastPosition - state.startX + project(state.velocity);
      const shouldClose = projected > width * 0.32 || state.velocity > 600;

      if (shouldClose) {
        springTo({
          from: state.lastPosition - state.startX,
          to: width + 24,
          velocity: state.velocity,
          onUpdate: (x) => { cart.style.transform = `translate3d(${x}px, 0, 0)`; },
          onDone: () => {
            /* Ya está fuera de pantalla: cerramos y devolvemos el control al CSS. */
            cart.classList.remove('is-dragging');
            UI.closeCart();
            global.setTimeout(() => { cart.style.transform = ''; }, 520);
          }
        });
      } else {
        springTo({
          from: state.lastPosition - state.startX,
          to: 0,
          velocity: state.velocity,
          onUpdate: (x) => { cart.style.transform = `translate3d(${x}px, 0, 0)`; },
          onDone: () => {
            cart.classList.remove('is-dragging');
            cart.style.transform = '';
          }
        });
      }
    }

    handle.addEventListener('pointerup', endDrag);
    handle.addEventListener('pointercancel', endDrag);
  }

  function initModalDrag() {
    Array.from(document.querySelectorAll('.modal')).forEach((modal) => {
      const panel = modal.querySelector('.modal__panel');
      const handle = panel ? panel.querySelector('[data-sheet-handle]') : null;
      if (!panel || !handle) return;

      let drag = null;

      handle.addEventListener('pointerdown', (event) => {
        if (reduced() || !mobileSheet.matches) return;
        if (event.button !== undefined && event.button !== 0) return;
        drag = {
          pointerId: event.pointerId,
          startY: event.clientY,
          lastPosition: event.clientY,
          lastTime: performance.now(),
          velocity: 0,
          moved: false,
          height: panel.getBoundingClientRect().height
        };
        handle.setPointerCapture(event.pointerId);
      });

      handle.addEventListener('pointermove', (event) => {
        if (!drag || event.pointerId !== drag.pointerId) return;
        const dy = event.clientY - drag.startY;
        if (!drag.moved) {
          if (Math.abs(dy) < 6) return;
          drag.moved = true;
          panel.classList.add('is-dragging');
        }
        const offset = dy < 0 ? -rubberband(-dy, drag.height, 0.4) : dy;
        panel.style.transform = `translate3d(0, ${offset}px, 0)`;
        trackVelocity(drag, event.clientY);
      });

      function endDrag(event) {
        if (!drag || (event && event.pointerId !== drag.pointerId)) return;
        const state = drag;
        drag = null;
        if (!state.moved) {
          panel.classList.remove('is-dragging');
          panel.style.transform = '';
          return;
        }
        const distance = state.lastPosition - state.startY;
        const projected = distance + project(state.velocity);
        const shouldClose = projected > state.height * 0.28 || state.velocity > 650;

        if (shouldClose) {
          springTo({
            from: distance,
            to: state.height + 80,
            velocity: state.velocity,
            onUpdate: (y) => { panel.style.transform = `translate3d(0, ${y}px, 0)`; },
            onDone: () => {
              panel.style.transform = `translate3d(0, ${state.height + 80}px, 0)`;
              modal.style.opacity = '0';
              panel.classList.remove('is-dragging');
              if (UI.closeModal) UI.closeModal(modal.id);
              global.requestAnimationFrame(() => {
                panel.style.transform = '';
                modal.style.opacity = '';
              });
            }
          });
        } else {
          springTo({
            from: distance,
            to: 0,
            velocity: state.velocity,
            onUpdate: (y) => { panel.style.transform = `translate3d(0, ${y}px, 0)`; },
            onDone: () => {
              panel.classList.remove('is-dragging');
              panel.style.transform = '';
            }
          });
        }
      }

      handle.addEventListener('pointerup', endDrag);
      handle.addEventListener('pointercancel', endDrag);
    });
  }

  function boot() {
    initHeaderMaterial();
    if (reduced()) return;
    initParallax();
    initCartDrag();
    initModalDrag();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot, { once: true });
  } else {
    boot();
  }
})(typeof window !== 'undefined' ? window : globalThis);
