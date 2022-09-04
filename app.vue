<template>
  <NuxtLayout :name="(content && content.layout) || 'default'">
    <NuxtPage />
  </NuxtLayout>
</template>

<script setup lang="ts">
const route = useRoute();
const { data: content } = await useAsyncData(() => queryContent(route.path).findOne());
</script>
