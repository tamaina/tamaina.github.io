<template>
  <div>
    <div class="min-vh-100 py-5 container" :class="$style.default">
      <BreadCrumb />

      <slot />
    </div>

    <BsNavbar />
  </div>
</template>

<style module lang="scss">
.default {
  max-width: 60rem;

  .h1, h1 {
    line-height: 1.2;
  }

  .h2, .h3, .h4, .h5, .h6, h2, h3, h4, h5, h6 {
    margin-top: 1.25rem;
  }
}
</style>
