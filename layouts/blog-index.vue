<template>
  <div>
    <slot />

    <div v-if="pages">
      <h2>List</h2>
      <DynamicScroller :class="$style['blog-index']" :items="pages" :min-item-size="Math.min(pages.length, 20)" key-field="_id">
        <template v-slot="{ item, index, active }">
          <DynamicScrollerItem
            :item="item"
            :active="active"
            :size-dependencies="[
              item.title,
              item.description,
            ]"
            :data-index="index"
            :class="$style['blog-index-item-outer']"
            :key="item.id"
          >
            <NuxtLink :to="item._path" :class="$style['blog-index-item-a']">
              <div v-text="item.title" />
              <div v-text="item.description" />
              <nuxt-picture v-if="item.thumbnail" :src="getImgRelativePath(item.thumbnail, item._file)" :class="$style['blog-index-item-picture']"></nuxt-picture>
            </NuxtLink>
          </DynamicScrollerItem>
        </template>
      </DynamicScroller>
    </div>
  </div>
</template>

<script setup lang="ts">
import { DynamicScroller, DynamicScrollerItem } from 'vue-virtual-scroller';

const route = useRoute();
const { data: content } = await useAsyncData(() => queryContent(route.path).findOne());

const baseQuery = queryContent(route.path).where(Object.assign({ layout: { $ne: 'blog-index' } }, content.value.where || {}));
const { data: pages } = await useAsyncData(() => baseQuery.sort({ published: 1 }).find());
console.log(pages)
</script>

<style module lang="scss">
  .blog-index {
    display: flex;
    flex-direction: column;
    align-items: left;
    justify-content: center;
    padding: 0 1rem;
  }

  .blog-index-item-outer {
    display: block;
    width: auto;
  }

  .blog-index-item-a {
    display: block;
    padding: 1rem;
    width: auto;
  }

  .blog-index-item-picture {
    > img {
      display: block;
      width: 300px;
      height: auto;
    }
  }
</style>
