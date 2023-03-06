<template>
<div :id="id">
  <ClientOnly>
    <div v-if="showAd" class="my-4">
      <ins
        class="adsbygoogle"
        style="display:block; text-align:center;"
        data-ad-layout="in-article"
        data-ad-format="fluid"
        data-ad-client="ca-pub-1736621122676736"
        :data-ad-slot="isDark() ? 5155586462 : 9613706222"
        v-push-ad>
      </ins>
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
