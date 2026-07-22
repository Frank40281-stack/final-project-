(function () {
  if ('scrollRestoration' in history) {
    history.scrollRestoration = 'manual';
  }

  var navigation = performance.getEntriesByType && performance.getEntriesByType('navigation')[0];
  var isReload = navigation
    ? navigation.type === 'reload'
    : performance.navigation && performance.navigation.type === performance.navigation.TYPE_RELOAD;

  if (!isReload) return;

  var isResearchPage = /\/pages\/[^/]+$/i.test(window.location.pathname);
  var homeUrl = new URL(isResearchPage ? '../index.html' : './index.html', window.location.href);
  window.location.replace(homeUrl.href);
}());
