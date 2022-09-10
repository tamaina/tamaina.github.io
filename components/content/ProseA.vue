// https://github.com/nuxt/content/blob/ec3c61f3ce6dfd79624551bb3ec9bf3e1330ea59/src/runtime/components/Prose/ProseA.vue

<script setup lang="ts">
const props = defineProps({
  href: {
    type: String,
    default: ''
  },
  blank: {
    type: Boolean,
    default: false
  }
});

const content = useContent();

const linkTo = computed(() => {
  if (props.href.startsWith('http') || props.href.startsWith('/') || !content.page.value) {
    return props.href;
  }

  const indexRegExp = /\/index\.(md|yml|yaml|json)$/;
  const isIndex = indexRegExp.test(content.page.value._file);

  return isIndex ? `${content.page.value._path}/${props.href.startsWith('./') ? props.href.slice(2) : props.href}` : props.href;
});
</script>

<template>
  <NuxtLink :href="linkTo">
    <slot />
  </NuxtLink>
</template>