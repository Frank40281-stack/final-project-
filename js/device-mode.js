(function () {
  'use strict';

  var root = document.documentElement;
  var coarsePointer = window.matchMedia && window.matchMedia('(pointer: coarse)').matches;
  var narrowScreen = typeof screen !== 'undefined' && Math.min(screen.width, screen.height) <= 900;
  var touchDevice = (navigator.maxTouchPoints || 0) > 0;
  var mobileLite = Boolean(coarsePointer || (touchDevice && narrowScreen));

  window.__ALPHA_MOBILE_LITE__ = mobileLite;
  root.classList.toggle('mobile-lite', mobileLite);
  root.classList.toggle('desktop-mode', !mobileLite);

  // Mobile starts directly at the first research cycle; desktop keeps the home experience.
  var path = window.location.pathname;
  var isHomePage = /(?:\/|^)index\.html$/i.test(path) || /\/$/.test(path);
  if (mobileLite && isHomePage) {
    window.location.replace(new URL('pages/industry.html?cycle=cycle-1', window.location.href).href);
  }
}());
