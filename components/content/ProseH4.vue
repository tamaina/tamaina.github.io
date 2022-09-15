<template>
  <h4 :id="id">
    <a :href="`#${id}`" class="text-reset">
      <slot />
    </a>
  </h4>
</template>

<script setup lang="ts">
defineProps<{ id: string }>()
</script>
