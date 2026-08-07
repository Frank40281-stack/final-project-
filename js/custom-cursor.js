(function () {
  'use strict';
  if (typeof window === 'undefined') return;
  if (window.__ALPHA_MOBILE_LITE__) return;

  function initGlobalCursor() {
    const pathname = window.location.pathname;
    const isHomePage = pathname.endsWith('/index.html') || pathname === '/' || pathname.endsWith('/') || document.querySelector('.s-hero-new') !== null;
    
    if (!isHomePage) {
      const existing = document.getElementById('cursor');
      if (existing) existing.style.display = 'none';
      return;
    }

    let cursor = document.getElementById('cursor');
    if (!cursor) {
      cursor = document.createElement('div');
      cursor.className = 'cursor';
      cursor.id = 'cursor';
      cursor.setAttribute('aria-hidden', 'true');
      cursor.innerHTML = '<div class="cursor__dot"></div><div class="cursor__ring"></div>';
      document.body.appendChild(cursor);
    }

    const ring = cursor.querySelector('.cursor__ring');
    let mx = -100, my = -100;
    let rx = -100, ry = -100;
    let isVisible = false;

    function checkHover(target) {
      if (!target || !target.closest) return;
      const interactive = target.closest('a, button, select, input, label, [role="button"], [data-market], [data-industry], [data-cycle], .stock-card, .cycle-top-stock, .market-tabs button, .industry-tabs button, [tabindex]');
      if (interactive) {
        cursor.classList.add('cursor--hover');
      } else {
        cursor.classList.remove('cursor--hover');
      }
    }

    document.addEventListener('mousemove', e => {
      mx = e.clientX;
      my = e.clientY;
      if (!isVisible) {
        isVisible = true;
        cursor.style.opacity = '1';
      }
      checkHover(e.target);
    });

    document.addEventListener('mouseleave', () => {
      isVisible = false;
      cursor.style.opacity = '0';
      cursor.classList.remove('cursor--hover');
    });

    (function loop() {
      rx += (mx - rx) * 0.18;
      ry += (my - ry) * 0.18;
      cursor.style.transform = `translate3d(${mx}px, ${my}px, 0)`;
      if (ring) {
        ring.style.transform = `translate3d(${rx - mx}px, ${ry - my}px, 0) translate(-50%, -50%)`;
      }
      requestAnimationFrame(loop);
    })();

    document.addEventListener('mouseover', e => {
      checkHover(e.target);
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initGlobalCursor);
  } else {
    initGlobalCursor();
  }
})();
