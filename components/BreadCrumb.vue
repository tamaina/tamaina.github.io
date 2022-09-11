<template>
  <nav aria-label="breadcrumb" class="mb-0" v-if="page && page._path !== '/'">
    <ol class="breadcrumb mb-0">
      <li class="breadcrumb-item" v-for="currentPage in pages" :key="page._id">
        <NuxtLink v-if="currentPage?.value && currentPage.value._path" :href="currentPage.value._path" class="text-decoration-none">{{ currentPage.value.navigation?.title || currentPage.value.title }}
        </NuxtLink>
      </li>
      <li class="breadcrumb-item"></li>
    </ol>
  </nav>
</template>

<script setup lang="ts">
import { findAPage } from '~~/composables/findAPage';

const { page } = useContent();

let currentPath = '';
const paths = [] as string[];

if (page && page.value && page.value._path) {
  for (const path of page.value._path.split('/')) {
    currentPath += `${path}`;
    if (currentPath === page.value._path) break;

    paths.push(currentPath);
    currentPath += '/';
  }
}

const pages = await Promise.all(paths.map((path) => findAPage(path).then(({ data }) => data)));
</script>
