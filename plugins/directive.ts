export default defineNuxtPlugin((nuxtApp) => {
    nuxtApp.vueApp.directive('push-ad', {
        mounted() {
            if (typeof window !== 'undefined' && window.adsbygoogle) {
                try {
                    window.adsbygoogle.push({});
                } catch (e) {
                    console.error('window.adsbygoogle.push({}) failed (mounted)', e);
                }
            }
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

            try {
                window.adsbygoogle.push({});
            } catch (e) {
                console.error('window.adsbygoogle.push({}) failed (updated)', e);
            }
        },
    })
});
