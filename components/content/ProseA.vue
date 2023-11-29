// https://github.com/nuxt/content/blob/ec3c61f3ce6dfd79624551bb3ec9bf3e1330ea59/src/runtime/components/Prose/ProseA.vue

<script setup lang="ts">
import { followNuxtContentUrlConversion } from '~/composables/followNuxtContentUrlConversion';

const props = defineProps<{
  href: string;
  blank?: boolean;
}>();

const { page } = useContent();
const target = computed(() => props.blank === true ? '_blank' : props.href.startsWith('http') ? '_blank' : props.blank ? '_blank' : '_self');

const linkTo = computed(() => {
  if (props.href.startsWith('http') || !page.value) {
    return props.href;
  }

  if (props.href.startsWith('/')) {
    return followNuxtContentUrlConversion(props.href);
  }

  const indexRegExp = /\/index\.(md|yml|yaml|json)$/;
  const isIndex = indexRegExp.test(page.value._file);

  return followNuxtContentUrlConversion(isIndex ? `${page.value._path}/${props.href.startsWith('./') ? props.href.slice(2) : props.href}` : props.href);
});
</script>

<template>
  <a :href="linkTo" :target="target">
    <slot />
  </a>
</template>
