// https://github.com/nuxt/content/blob/main/src/runtime/pages/document-driven.vue
<script setup lang="ts">
import { useContent, useContentHead, useRequestEvent } from '#imports'
const { page } = useContent()
// Page not found, set correct status code on SSR
if (!page.value && process.server) {
  const event = useRequestEvent()
  event.res.statusCode = 404
}
useContentHead(page.value)
</script>

<template>
  <div>
    <NuxtLayout :name="page?.layout || 'default'">
      <ContentRenderer v-if="page && page.body" :key="page._id" :value="page" />
      <template v-else-if="page">
        <h1 v-text="page.title" />
        <p v-text="page.description" />
      </template>
    </NuxtLayout>
  </div>
</template>
