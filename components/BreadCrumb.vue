<template>
  <nav aria-label="breadcrumb" class="mb-0" v-if="content.page.value._path !== '/'">
    <ol class="breadcrumb mb-0">
      <li class="breadcrumb-item" v-for="page in pages" :key="page.value._id">
        <NuxtLink v-if="page.value && page.value._path" :href="page.value._path" class="text-decoration-none">{{ page.value.navigation?.title || page.value.title }}
        </NuxtLink>
      </li>
      <li class="breadcrumb-item"></li>
    </ol>
  </nav>
</template>

<script setup lang="ts">
import { findAPage } from '~~/composables/findAPage';

const content = useContent();

let currentPath = '';
const paths = [] as string[];

for (const path of content.page.value._path.split('/')) {
  currentPath += `${path}`;
  if (currentPath === content.page.value._path) break;

  paths.push(currentPath);
  currentPath += '/';
}

const pages = await Promise.all(paths.map((path) => findAPage(path).then(({ data }) => data)));
</script>
