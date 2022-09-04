<template>
  <div class="nuxt-pages-root">
    <nav>
      <ContentNavigation v-slot="{ navigation }">
        <div v-for="link of navigation" :key="link._path">
          <NuxtLink :to="link._path">{{ link.title }}</NuxtLink>
        </div>
      </ContentNavigation>
    </nav>

    <main>
      <ContentDoc v-slot="{ doc }">
        <ContentRenderer v-if="doc.body" :value="doc" />
        <pre>{{ doc }}</pre>
      </ContentDoc>
    </main>
  </div>
</template>
