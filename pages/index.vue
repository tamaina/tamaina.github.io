<template>
  <div class="nuxt-page-index">
    <ContentList path="/" v-slot="{ list }">
      <template v-for="x in list">
        <a :href="x._path">{{ x.title }}</a><br>
      </template>
    </ContentList>

    <ContentDoc path="/" />
  </div>
</template>
