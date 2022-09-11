<template>
  <div>
    <div class="min-vh-100 py-5 container" :class="$style.default">
      <BreadCrumb />
      <slot />

      <div id="blog-index" v-if="pages && pages.length > 0">
        <div :class="$style['blog-index']" :min-item-size="Math.min(pages.length, 20)" key-field="_id">
          <div class="card mb-3 border-primary" :class="$style['blog-index-item-outer']" v-for="item in pageItems" :key="item._id">
            <NuxtLink :to="item._path" class="row g-0 text-reset text-decoration-none">
              <div class="col-md-4">
                <nuxt-picture
                  v-if="item.thumbnail"
                  :src="getImgRelativePath(item.thumbnail, item._file)"
                  quality="80"
                  sizes="md:256vw lg:512px"
                  :img-attrs="{ class: `img-fluid w-100 rounded ${$style['blog-index-item-img']}` }"
                ></nuxt-picture>
              </div>
              <div class="col-md-8">
                <div class="card-body">
                  <h5 class="card-title fw-bold" :class="{ 'mb-0': !item.description }" v-text="item.title" />
                  <div class="card-text" v-text="item.description" />
                </div>
              </div>
            </NuxtLink>
          </div>
        </div>

        <div :class="$style['blog-index-pagination']" v-if="totalPages > 1">
          <button v-if="page !== 1" class="btn btn-primary" :class="$style['blog-index-pagination-button']" @click="page += -1">Prev ＜</button>
          <div>
            <input type="number" v-model="page" min="1" :max="totalPages" step="1" class="form-control" :class="$style['blog-index-pagination-input']" /> / {{ totalPages }}
          </div>
          <button v-if="page !== totalPages" class="btn btn-primary" :class="$style['blog-index-pagination-button']" @click="page += -1">＞ Next</button>
        </div>
      </div>
    </div>

    <BsNavbar />
  </div>
</template>

<script setup lang="ts">
const content = useContent();

const baseQuery = queryContent(content.page.value._path).where(Object.assign({ layout: { $ne: 'blog-index' } }, content.page.value.where || {}));
const { data: _pages } = await useAsyncData(`blogIndexPages:${content.page.value._id}`, () => baseQuery.only(['_id', '_path', '_file', 'title', 'description', 'thumbnail']).sort({ published: 1 }).find());

// ignore myself
const pages = computed(() => _pages.value.filter((page) => page._id !== content.page.value._id));

const router = useRouter();
const page = ref(Number(router.currentRoute.value.query.page) || 1);
const perPage = ref(20);
const total = computed(() => pages.value.length);
const totalPages = computed(() => Math.ceil(total.value / perPage.value));
const start = computed(() => (page.value - 1) * perPage.value);
const end = computed(() => Math.min(start.value + perPage.value, total.value));
const pageItems = computed(() => pages.value.slice(start.value, end.value));

onMounted(() => {
  watch(page, (newValue) => {
    const pushOrReplace = (newValue) => {
      const curr = router.currentRoute.value.query.page;
      if (!curr) {
        return router.replace;
      }
      if (newValue === curr) {
        return router.replace;
      }
      return router.push;
    }

    if (Number.isNaN(newValue) || !Number.isInteger(newValue) || Number(newValue) < 1) {
      page.value = 1;
      router.replace({ query: { page: 1 } });
    } else if (Number(newValue) > totalPages.value) {
      page.value = totalPages.value;
      router.replace({ query: { page: totalPages.value } });
    } else {
      pushOrReplace(newValue)({ query: { page: newValue } });
    }
  }, { immediate: true });
});
</script>

<style module lang="scss">
.default {
  max-width: 60rem;

  .h1, h1 {
    line-height: 1.2;
  }
}

.blog-index {
  display: block;
}

.blog-index-item-outer {
  display: block;
  width: 100%;
}

.blog-index-item-img {
  display: block;
  aspect-ratio: 3 / 2;
  object-fit: cover;
}

.blog-index-pagination {
  display: flex;
  justify-content: space-around;
  &-button {
    padding: .5rem;
    width: auto;
  }

  &-input {
    display: inline-block;
    height: 100%;
    width: 5em;
  }
}
</style>
