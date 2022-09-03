// https://github.com/nuxt/content/blob/ec3c61f3ce6dfd79624551bb3ec9bf3e1330ea59/src/runtime/components/Prose/ProseImg.vue

<template>
  <nuxt-picture
    :src="(src.startsWith('http') || src.startsWith('/')) ? src : `/${pathname}/${src}`"
    :alt="alt"
    :width="width"
    :height="height"
    sizes="xs:200px md:500px lg:1024px"
  />
</template>

<script setup lang="ts">
defineProps({
  src: {
    type: String,
    default: ''
  },
  alt: {
    type: String,
    default: ''
  },
  width: {
    type: [String, Number],
    default: undefined
  },
  height: {
    type: [String, Number],
    default: undefined
  }
})

const route = useRoute();
const { data: content } = await useAsyncData(() => queryContent(route.path).findOne());
const indexRegExp = /\/index\.(md|yml|yaml|json)$/;
const isIndex = indexRegExp.test(content.value._file);
const pathname = isIndex ? content.value._file.replace(indexRegExp, '') : content.value._file.replace(/\/[^/]+$/, '');
</script>
