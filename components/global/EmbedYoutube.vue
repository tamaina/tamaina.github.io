<template>
  <div :class="$style['embed-youtube']">
    <iframe
      :src="`https://www.youtube.com/embed/${videoId}`"
      frameborder="0"
      allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
      allowfullscreen
      :class="$style['embed-youtube-iframe']">
    </iframe>
  </div>
</template>

<script lang="ts" setup>
const props = defineProps<{
  videoId: string
}>();
</script>

<style lang="scss" module>
.embed-youtube {
  width: 100%;
  aspect-ratio: 3/2;
  margin-bottom: 1rem;
}

.embed-youtube-iframe {
  width: 100%;
  height: 100%;
}
</style>
