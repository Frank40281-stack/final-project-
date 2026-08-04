(function () {
  'use strict';
  if (typeof window === 'undefined') return;

  function initGlobalCursor() {
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

    document.addEventListener('mousemove', e => {
      mx = e.clientX;
      my = e.clientY;
      if (!isVisible) {
        isVisible = true;
        cursor.style.opacity = '1';
      }
    });

    document.addEventListener('mouseleave', () => {
      isVisible = false;
      cursor.style.opacity = '0';
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
      const interactive = e.target.closest('a, button, select, input, label, [role="button"], [data-market], [data-industry], [data-cycle], .stock-card, .cycle-top-stock');
      if (interactive) {
        cursor.classList.add('cursor--hover');
      } else {
        cursor.classList.remove('cursor--hover');
      }
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initGlobalCursor);
  } else {
    initGlobalCursor();
  }
})();
