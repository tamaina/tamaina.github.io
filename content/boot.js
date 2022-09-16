(() => {
const setDark = () => {
  if (typeof window === 'undefined') return;

  if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
    console.log('BOOT: SET DARK');
    document.documentElement.classList.add('dark');
  } else {
    console.log('BOOT: SET LIGHT');
    document.documentElement.classList.remove('dark');
  }
};

if (!document?.documentElement) window.addEventListener('DOMContentLoaded', setDark);
else setDark();
})();

window.adsbygoogle = window.adsbygoogle || [];
