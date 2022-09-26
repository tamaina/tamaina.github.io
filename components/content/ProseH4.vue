<template>
  <h4 :id="id">
    <a :href="`#${id}`" class="text-reset text-decoration-none">
      <slot />
    </a>
  </h4>
</template>

<script setup lang="ts">
defineProps<{ id: string }>()
</script>
