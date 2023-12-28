<template>
<div :id="id">
  <div v-if="showAd" class="my-4">
    <AdInArticle />
  </div>
  <h3>
    <a :href="`#${id}`" class="text-reset text-decoration-none">
      <slot />
    </a>
  </h3>
</div>
</template>

<script setup lang="ts">
const props = defineProps<{ id: string }>();

const salt = (props.id ?? 'aaa').split('').reduce((sum, c) => sum + c.charCodeAt(0), 0);
const showAd = salt % 7 === 0;
</script>
