<template>
  <div :data-bs-theme="darkOrLight">
    <slot />
  </div>
</template>

<script setup>
const darkOrLight = ref('dark');

onMounted(() => {
  console.log('mounted plain');
  initAd();
  darkOrLight.value = isDark() ? 'dark' : 'light';
})
</script>
