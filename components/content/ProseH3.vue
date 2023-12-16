<template>
<div :id="id">
  <ClientOnly>
    <div v-if="showAd" class="my-4">
      <AdInArticle />
    </div>
  </ClientOnly>
  <h3>
    <a :href="`#${id}`" class="text-reset text-decoration-none">
      <slot />
    </a>
  </h3>
</div>
</template>

<script setup lang="ts">
defineProps<{ id: string }>();

const showAd = computed(() => Math.floor(Math.random() * 7) === 0); // 1/7 chance of showing ad
</script>
