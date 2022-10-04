<template>
  <div>
    <div class="min-vh-100 py-5 container" :class="$style.default">
      <BreadCrumb :addDividerToEnd="true" />

      <slot />

      <ClientOnly>
        <ins
          class="adsbygoogle my-3"
          style="display:block"
          data-ad-format="autorelaxed"
          data-ad-client="ca-pub-1736621122676736"
          :data-ad-slot="isDark() ? 6544689751 : 7169954832"
          v-push-ad>
        </ins>
      </ClientOnly>
    </div>

    <BsNavbar />
  </div>
</template>

<script setup>
onMounted(() => {
  console.log('mounted default');
  initAd();
});
</script>

<style module lang="scss">
.default {
  max-width: 60rem;

  .h1,
  h1 {
    line-height: 1.2;
  }

  .h2,
  .h3,
  .h4,
  .h5,
  .h6,
  h2,
  h3,
  h4,
  h5,
  h6 {
    margin-top: 1.25rem;
  }
}
</style>
