// https://github.com/nuxt/content/blob/ec3c61f3ce6dfd79624551bb3ec9bf3e1330ea59/src/runtime/components/Prose/ProseImg.vue

<template>
<div>
  <div v-if="showAd" class="my-4">
    <AdInArticle />
  </div>
  <NuxtPicture
    :src="imgPath"
    :alt="alt"
    :width="width"
    :height="height"
    quality="85"
    loading="lazy"
    sizes="350 smp:550 sm:650"
    @click="viewer?.show()"
    :img-attrs="{ class: `img-fluid ${$style['prose-img']}`, title }"
  />
  <div class="text-center" :class="$style.title" v-text="title" />
</div>
</template>

<script setup lang="ts">
import 'viewerjs/dist/viewer.css';
import Viewer from 'viewerjs';

const props = defineProps({
  src: {
    type: String,
    default: ''
  },
  alt: {
    type: String,
    default: ''
  },
  title: {
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
});

const { page } = useContent();
const imgPath = computed(() => page.value && getImgRelativePath(decodeURIComponent(props.src), page.value._file));

const viewer = computed(() => {
  const img = new Image();
  img.src = imgPath.value;

  return new Viewer(img, {
    navbar: false,
    title: () => props.title || props.alt,
    url: () => imgPath.value,
  });
});

const salt = (props.src ?? 'aaa').split('').reduce((sum, c) => sum + c.charCodeAt(0), 0);
const showAd = salt % 7 === 0;
</script>

<style module lang="scss">
.prose-img {
  display: block;
  margin: .5rem auto auto;
  max-height: min(30rem, 50vh);
  max-width: 100%;
  cursor: pointer;
}

.title {
  font-weight: 400;
  margin-bottom: 0.5rem;
}
</style>
