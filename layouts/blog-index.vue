<template>
  <div>
    <slot />

    <h2>List</h2>
    <DynamicScroller :class="$style['blog-index']" :items="pages" :min-item-size="20">
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
        >
          <a :class="$style['blog-index-item-a']">
            <div v-text="item.title" />
            <div v-text="item.description" />
          </a>
        </DynamicScrollerItem>
      </template>
    </DynamicScroller>
  </div>
</template>

<script setup lang="ts">
import { DynamicScroller, DynamicScrollerItem } from 'vue-virtual-scroller';

const route = useRoute();
const { data: content } = await useAsyncData(() => queryContent(route.path).findOne());

const baseQuery = queryContent(route.path).where(Object.assign({ layout: 'blog-index' }, content.value.where || {}));
const { data: pages } = await useAsyncData(() => baseQuery.sort({ published: 1 }).find());
</script>

<style module lang="scss">
  .blog-index {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 0 1rem;
  }

  .blog-index-item-outer {
    display: block;
  }

  .blog-index-item-a {
    display: block;
    padding: 1rem;
  }
</style>
