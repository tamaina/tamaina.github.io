<template>
<ClientOnly>
  <div v-if="c_1d2">
    <ins
      class="adsbygoogle"
      style="display:block; text-align:center;"
      data-ad-layout="in-article"
      data-ad-format="fluid"
      data-ad-client="ca-pub-1736621122676736"
      :data-ad-slot="isDark() ? 5155586462 : 9613706222">
    </ins>
    <ScriptX>
      (adsbygoogle = window.adsbygoogle || []).push({});
    </ScriptX>
  </div>
</ClientOnly>
<h2 :id="id">
  <a :href="`#${id}`" class="text-reset">
    <slot />
  </a>
</h2>
</template>

<script setup lang="ts">
import ScriptX from 'vue-scriptx';

defineProps<{ id: string }>();

const c_1d2 = computed(() => Math.floor(Math.random() * 2) !== 0);
</script>
