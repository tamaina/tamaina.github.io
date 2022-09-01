<script lang="ts" setup>
const { data } = await useAsyncData(() => queryContent('/').find())
</script>

<template>
  <ContentList path="/" v-slot="{ list }">
    <template v-for="x in list">
      <a :href="x._path">{{ x.title }}</a><br>
    </template>
  </ContentList>

  <ContentDoc path="/" />
</template>
