<template>
  <div>
    <div class="min-vh-100 py-5 container" :class="$style.default">
      <NuxtLink v-if="upper" :href="upper._path" class="text-decoration-none">{{ upper.title }} /</NuxtLink>

      <slot />
    </div>

    <BsNavbar />
  </div>
</template>

<script setup lang="ts">
const content = useContent();

const { data: upper } = await useAsyncData(() => queryContent(content.page.value._path.split('/').slice(0, -1).join('/')).findOne());
</script>

<style module lang="scss">
.default {
  max-width: 60rem;

  .h1, h1 {
    line-height: 1.2;
  }

  .h2, .h3, .h4, .h5, .h6, h2, h3, h4, h5, h6 {
    margin-top: 1.25rem;
  }
}
</style>
