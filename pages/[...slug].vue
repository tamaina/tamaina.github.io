<template>
  <p><NuxtLink to="/">Back To Home</NuxtLink></p>

  <main>
    <ContentDoc v-slot="{ doc }">
      <ContentRenderer :value="doc" />
      <pre>{{ doc }}</pre>
    </ContentDoc>
  </main>
</template>
