// https://github.com/nuxt/content/blob/ec3c61f3ce6dfd79624551bb3ec9bf3e1330ea59/src/runtime/components/Prose/ProseImg.vue

<template>
  <ClientOnly>
    <div v-if="showAd">
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
  <NuxtPicture
    :src="imgPath"
    :alt="alt"
    :width="width"
    :height="height"
    quality="98"
    loading="lazy"
    sizes="xs:256px md:512px lg:1024px"
    ref="picture"
    @click="viewer?.show()"
    :img-attrs="{ class: `img-fluid ${$style['prose-img']}`, title }"
  />
  <div class="text-center" :class="$style.title" v-text="title" />
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
const imgPath = computed(() => {
  return page.value && getImgRelativePath(props.src, page.value._file)
});

const picture = ref<InstanceType<typeof NuxtPicture>>();
const img = computed(() => picture.value?.$el.querySelector('img'));
const viewer = computed(() => {
  if (!img.value) return;

  return new Viewer(img.value, {
    navbar: false,
    title: () => props.title || props.alt,
    url: () => imgPath.value,
  });
});

const showAd = computed(() => Math.floor(Math.random() * 4) === 0); // 1/4 chance of showing ad
</script>

<style module lang="scss">
.prose-img {
  display: block;
  margin: .5rem auto auto;
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
