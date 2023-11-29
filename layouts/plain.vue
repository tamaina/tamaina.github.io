<template>
  <div>
    <slot />
  </div>
</template>

<script setup>
onMounted(() => {
  console.log('mounted plain');
})
</script>
