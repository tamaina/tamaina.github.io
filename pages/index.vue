<script lang="ts" setup>
const { data } = await useAsyncData(() => queryContent('/').find())
</script>

<template>
  <template v-for="x in data" :key="x">
    <a :href="x._path">{{ x.title }}</a><br>
  </template>

  <ContentDoc path="/" />
</template>
