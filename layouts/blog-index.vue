<template>
  <div>
    <div class="min-vh-100 py-5 container">
      <slot />
      
      <div id="blog-index" v-if="pages">
        <div :class="$style['blog-index']" :min-item-size="Math.min(pages.length, 20)" key-field="_id">
          <div class="card mb-3" :class="$style['blog-index-item-outer']" v-for="item in pageItems" :key="item._id">
            <NuxtLink :to="item._path" class="row g-0 text-reset text-decoration-none">
              <div class="col-md-4">
                <nuxt-picture
                  v-if="item.thumbnail"
                  :src="getImgRelativePath(item.thumbnail, item._file)"
                  quality="80"
                  sizes="md:100vw lg:400px"
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

        <div :class="$style['blog-index-pagination']">
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
const router = useRouter();
const { data: content } = await useAsyncData(() => queryContent(router.currentRoute.value.path).findOne());

const baseQuery = queryContent(content.value._path).where(Object.assign({ layout: { $ne: 'blog-index' } }, content.value.where || {}));
const { data: pages } = await useAsyncData(() => baseQuery.only(['_id', '_path', '_file', 'title', 'description', 'thumbnail']).sort({ published: 1 }).find());

const page = ref(Number(router.currentRoute.value.query.page) || 1);
const perPage = ref(20);
const total = computed(() => pages.value.length);
const totalPages = computed(() => Math.ceil(total.value / perPage.value));
const start = computed(() => (page.value - 1) * perPage.value);
const end = computed(() => Math.min(start.value + perPage.value, total.value));
const pageItems = computed(() => pages.value.slice(start.value, end.value));

onMounted(() => {
  watch(page, (newValue) => {
    if (Number.isNaN(newValue) || !Number.isInteger(newValue) || Number(newValue) < 1) {
      page.value = 1;
      router.push({ query: { page: 1 } });
    } else if (Number(newValue) > totalPages.value) {
      page.value = totalPages.value;
      router.push({ query: { page: totalPages.value } });
    } else {
      router.push({ query: { page: newValue } });
    }
  }, { immediate: true });
});
</script>

<style module lang="scss">
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
