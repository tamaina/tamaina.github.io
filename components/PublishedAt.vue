// publishedAt/updatedAt表示

<template>
  <template v-if="page && page.publishedAt">{{ dateFormatter.format(new Date(page.publishedAt)) }} </template>
  <template v-if="page && page.publishedAt && page.updatedAt"> / </template>
  <template v-if="page && page.updatedAt">{{ dateFormatter.format(new Date(page.updatedAt)) }}更新</template>
</template>

<script lang="ts">
const dateFormatter = new Intl.DateTimeFormat('ja-JP', { dateStyle: 'long' });
</script>

<script setup lang="ts">
const props = defineProps<{
  pageDefined?: Record<string, any>;
}>()

const page = computed(() => props.pageDefined ?? useContent().page?.value );
</script>
