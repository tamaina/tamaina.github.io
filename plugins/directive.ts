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
            if (el.attributes.getNamedItem('style')) el.attributes.removeNamedItem('style');
            if (el.attributes.getNamedItem('data-adsbygoogle-status')) el.attributes.removeNamedItem('data-adsbygoogle-status');
            if (el.attributes.getNamedItem('data-ad-status')) el.attributes.removeNamedItem('data-ad-status');

            window.adsbygoogle.push({});
        },
    })
});
