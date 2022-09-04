<template>
  <NuxtLayout :name="layout">
    <NuxtPage />
  </NuxtLayout>
</template>

<script setup lang="ts">
const route = useRoute();
const router = useRouter();
const { data: content } = await useAsyncData(() => queryContent(route.path).findOne());
const layout = computed(() => (content.value && content.value.layout) || 'default');

watch(router.currentRoute, (newRoute) => {
  queryContent(newRoute.path).findOne()
  .then(async newContent => {
    await nextTick();
    content.value = newContent;
  });
});
</script>
