export default defineNuxtPlugin((nuxtApp) => {
    nuxtApp.vueApp.directive('push-ad', {
        mounted() {
            if (typeof window !== 'undefined' && window.adsbygoogle) window.adsbygoogle.push({});
        },
    })
});
