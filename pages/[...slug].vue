<script lang="ts" setup>
  //const { data } = await useAsyncData(() => useUnwrap())
</script>

<template>
  <main>
    <ContentDoc v-slot="{ doc }">
      <ContentRenderer :value="doc" />
      <div>{{ doc }}</div>
    </ContentDoc>
  </main>
</template>
