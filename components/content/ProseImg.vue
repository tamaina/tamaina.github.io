// https://github.com/nuxt/content/blob/ec3c61f3ce6dfd79624551bb3ec9bf3e1330ea59/src/runtime/components/Prose/ProseImg.vue

<template>
  <nuxt-picture
    v-if="imgPath"
    :src="imgPath"
    :alt="alt"
    :width="width"
    :height="height"
    quality="98"
    sizes="xs:200px md:500px lg:1024px"
  />
</template>

<script setup lang="ts">
const props = defineProps({
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
const content = useContent();
const imgPath = computed(() => {
  return content.page.value && getImgRelativePath(props.src, content.page.value._file)
});
</script>
