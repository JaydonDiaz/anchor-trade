(function () {
  var stored = localStorage.getItem('theme');
  var theme = stored || (window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark');
  document.documentElement.setAttribute('data-theme', theme);
})();

// Reload always starts at the top instead of the browser restoring
// wherever you were scrolled to — avoids any pinned/scroll-driven
// section's layout math racing a native scroll restore.
if ('scrollRestoration' in history) {
  history.scrollRestoration = 'manual';
}

document.addEventListener('DOMContentLoaded', function () {
  var toggle = document.getElementById('theme-toggle');
  if (!toggle) return;
  toggle.addEventListener('click', function () {
    var current = document.documentElement.getAttribute('data-theme') === 'light' ? 'light' : 'dark';
    var next = current === 'light' ? 'dark' : 'light';
    function apply() {
      document.documentElement.setAttribute('data-theme', next);
      localStorage.setItem('theme', next);
      document.dispatchEvent(new CustomEvent('themechange', { detail: { theme: next } }));
    }
    var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!reduceMotion && document.startViewTransition) {
      document.startViewTransition(apply);
    } else {
      apply();
    }
  });
});
