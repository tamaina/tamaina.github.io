<template>
    <div :data-bs-theme="darkOrLight">
        <NuxtPage />
    </div>
</template>

<script setup lang="ts">
const darkOrLight = ref('dark');
provide('darkOrLight', darkOrLight);

onMounted(() => {
  console.log('mounted app');
  initAd();
  darkOrLight.value = isDark() ? 'dark' : 'light';
})

const { page } = useContent();
const _imgPath = computed(() => page.value && page.value.thumbnail && getImgRelativePath(decodeURIComponent(page.value.thumbnail), page.value._file));
const img = useImage();
const imgPath = computed(() =>
    _imgPath.value &&
    new URL(img(_imgPath.value, { width: 1200, height: 630 }), HOST).pathname);

useHead({
    titleTemplate: (titleChunk) => {
        return titleChunk ? `${titleChunk} - aqz/tamaina's homepage` : `a9z.dev - aqz/tamaina's homepage`;
    },
    meta: [
        ...(imgPath.value ? [
            { property: 'og:img', content: `${HOST}${imgPath.value}` },
            { property: 'twitter:img', content: `${HOST}${imgPath.value}` },
        ] : [])
    ],
});
</script>
