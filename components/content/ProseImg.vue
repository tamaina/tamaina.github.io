// https://github.com/nuxt/content/blob/ec3c61f3ce6dfd79624551bb3ec9bf3e1330ea59/src/runtime/components/Prose/ProseImg.vue

<template>
<div>
  <ClientOnly>
    <div v-if="showAd" class="my-4">
      <AdInArticle />
    </div>
  </ClientOnly>
  <NuxtPicture
    :src="imgPath"
    :alt="alt"
    :width="width"
    :height="height"
    quality="85"
    loading="lazy"
    sizes="xs:256px md:512px lg:720px"
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

const showAd = computed(() => Math.floor(Math.random() * 7) === 0); // 1/7 chance of showing ad
</script>

<style module lang="scss">
.prose-img {
  display: block;
  margin: .5rem auto auto;
  min-height: 5em;
  max-height: min(30rem, 70vh);
  cursor: pointer;

  @media (min-width: 1400px) {
    max-width: 70%;
  }
}

.title {
  font-weight: 400;
  margin-bottom: 0.5rem;
}
</style>
