// 上のディレクトリのリンクを表示（パンくずリストの代わり）

<template>
  <a v-if="upper && upper._path !== '/'" :href="upper._path" class="text-decoration-none">{{ upper.title }} /
  </a>
</template>

<script setup lang="ts">
import { findAPage } from '~~/composables/findAPage';

const { page } = useContent();

const { data: upper } = await findAPage(page.value._path.split('/').slice(0, -1).join('/'));
</script>
