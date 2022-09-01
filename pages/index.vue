<script setup>
const { data } = await useAsyncData(() => queryContent('/').find())
</script>

<template>
  <template v-for="x in data" :key="x">
  <a :href="x._path">{{ x }}</a><br>
  </template>

  <ContentDoc path="/" />
</template>
