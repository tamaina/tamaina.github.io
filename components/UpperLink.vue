<template>
  <NuxtLink v-if="upper && upper._path !== '/'" :href="upper._path" class="text-decoration-none">{{ upper.title }} /
  </NuxtLink>
</template>

<script setup lang="ts">
import { findAPage } from '~~/composables/findAPage';

const content = useContent();

const { data: upper } = await findAPage(content.page.value._path.split('/').slice(0, -1).join('/'));
</script>
