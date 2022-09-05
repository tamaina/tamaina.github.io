<template>
  <div>
    <ContentList :path="$route.path" v-slot="{ list }">
      <template v-for="x in list">
        <a :href="x._path">{{ x.title }}</a><br>
      </template>
    </ContentList>

    <slot />
  </div>
</template>
