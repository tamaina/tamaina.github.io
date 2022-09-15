(() => {
const bootOnReady = () => {
  if (typeof window === 'undefined') return;

  if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }
};

if (document.readyState !== 'loading') window.addEventListener('DOMContentLoaded', bootOnReady);
else bootOnReady();
})();

window.adsbygoogle = window.adsbygoogle || [];
