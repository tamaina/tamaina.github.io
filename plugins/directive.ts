export default defineNuxtPlugin((nuxtApp) => {
    nuxtApp.vueApp.directive('push-ad', {
        mounted() {
            if (typeof window !== 'undefined' && window.adsbygoogle) window.adsbygoogle.push({});
        },
        updated(el: HTMLDivElement, binding, vnode, prevNode) {
            if (typeof window === 'undefined' || !window.adsbygoogle) return;
            if (!(el instanceof HTMLElement)) return;

            while (el.firstChild) {
                el.removeChild(el.firstChild);
            }
            el.attributes.removeNamedItem('style');
            el.attributes.removeNamedItem('data-adsbygoogle-status');
            el.attributes.removeNamedItem('data-ad-status');

            if (typeof window !== 'undefined' && window.adsbygoogle) window.adsbygoogle.push({});
        },
    })
});
