// パンくずリスト

<template>
  <nav aria-label="breadcrumb" class="mb-0" :class="$style['root']" v-show="page && page._path !== '/'">
    <ol class="breadcrumb mb-0">
      <li class="breadcrumb-item" v-for="currentPage in pages" :key="page._id" :class="{ [$style['with-end-divider']]: addDividerToEnd }">
        <NuxtLink v-if="currentPage?.value && currentPage.value._path" :to="currentPage.value._path" class="text-decoration-none">
          {{ currentPage.value.navigation?.title || currentPage.value.title }}
        </NuxtLink>
      </li>
    </ol>
  </nav>
</template>

<script setup lang="ts">
import { findAPage } from '~~/composables/findAPage';

defineProps<{
  addDividerToEnd?: boolean;
}>()

const { page } = useContent();

const pages = ref<any[]>([]);

watch(page, async (newPage) => {
  if (!newPage) return;

  let currentPath = '';
  const paths = [] as string[];

  for (const path of newPage._path.split('/')) {
    currentPath += `${path}`;
    if (currentPath === newPage._path) break;

    paths.push(currentPath);
    currentPath += '/';
  }

  pages.value = await Promise.all(paths.map((path) => findAPage(path).then(({ data }) => data)));

}, { immediate: true });
</script>

<style module lang="scss">
.root {
  min-height: calc(1em * var(--bs-body-line-height, 1.5));
}

.with-end-divider:last-child::after {
  float: right;
  padding-left: var(--bs-breadcrumb-item-padding-x);
  color: var(--bs-breadcrumb-divider-color);
  content: var(--bs-breadcrumb-divider, "/");
}
</style>
