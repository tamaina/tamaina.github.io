<template>
    <NuxtPage />
</template>

<script setup lang="ts">
const darkOrLight = ref(isDark() ? 'dark' : 'light');
if (process.browser) {
    watch(darkOrLight, () => {
        document.body.dataset.bsTheme = darkOrLight.value;
    });
}
provide('darkOrLight', darkOrLight);

onMounted(() => {
    console.log('mounted app');
    initAd();
})

const { page } = useContent();
const _imgPath = computed(() => page.value && page.value.thumbnail && getImgRelativePath(decodeURIComponent(page.value.thumbnail), page.value._file));
const img = useImage();
const imgPath = computed(() =>
    _imgPath.value &&
    ((new URL(img(_imgPath.value, { width: 1200, height: 630 }), HOST)) ?? '').toString());

useHead({
    htmlAttrs: { lang: 'ja' },
    title: page.value.title ? `${page.value.title} - aqz/tamaina's homepage` : `a9z.dev - aqz/tamaina's homepage`,
    meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width,initial-scale=1' },
        ...(imgPath.value ? [
            { property: 'og:img', content: imgPath.value },
            { property: 'twitte:card', content: 'summary_large_image' },
            { property: 'twitter:img', content: imgPath.value },
        ] : [
            { property: 'twitte:card', content: 'summary' },
        ]),
        { property: 'og:title', content: page.value.title },
        { property: 'description', content: page.value.description },
        { property: 'og:description', content: page.value.description },
    ],
    link: [
        { rel: 'stylesheet', href: 'https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css' },
        { rel: 'stylesheet', href: 'https://cdn.jsdelivr.net/gh/tamaina/The-Japanese-Web-Fonts@v7.2.0/dist/GenEiUniverSans/GenEiUniverSans.css' },
        { rel: 'stylesheet', href: 'https://cdn.jsdelivr.net/npm/yakuhanjp@3.3.0/dist/css/yakuhanjp.min.css' },
        { rel: 'stylesheet', href: 'https://cdn.jsdelivr.net/gh/tamaina/The-Japanese-Web-Fonts@v7.2.0/dist/SourceHanSans/SourceHanSans.css' },
        { rel: 'stylesheet', href: 'https://cdn.jsdelivr.net/gh/tamaina/The-Japanese-Web-Fonts@v7.2.0/dist/NasuM/NasuM.css' },
    ],
    script: [
        { src: '/boot.js', async: true },
        { src: 'https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js' },
    ],
    bodyAttrs: {
        'data-bs-theme': darkOrLight.value,
    }
});
</script>
