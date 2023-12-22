<template>
<div :id="id">
  <ClientOnly>
    <div v-if="showAd" class="my-4">
      <AdInArticle />
    </div>
  </ClientOnly>
  <h2>
    <a :href="`#${id}`" class="text-reset text-decoration-none">
      <slot />
    </a>
  </h2>
</div>
</template>

<script setup lang="ts">
defineProps<{ id: string }>();

const showAd = computed(() => Math.floor(Math.random() * 4) === 0); // 1/2 chance of showing ad
</script>
