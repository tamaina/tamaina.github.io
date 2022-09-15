<template>
  <h3 :id="id">
    <a :href="`#${id}`" class="text-reset">
      <slot />
    </a>
  </h3>
</template>

<script setup lang="ts">
defineProps<{ id: string }>()
</script>
