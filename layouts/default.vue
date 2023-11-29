<template>
  <div>
    <div class="min-vh-100 py-5 container" :class="$style.default">
      <div class="d-flex flex-wrap-reverse justify-content-between">
        <BreadCrumb :addDividerToEnd="true" />
        <p class="text-end small ms-auto ps-4 mb-0">
          <PublishedAt />
        </p>
      </div>

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
});
</script>

<style module lang="scss">
.default {
  max-width: 40rem;

  :global {
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
      margin-top: 1.5rem;
    }
  }
}
</style>
