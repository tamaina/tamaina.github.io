<template>
  <div>
    <div class="min-vh-100 py-5 container" :class="$style.default">
      <BreadCrumb />
      <slot />

      <div id="index" v-if="pages && pages.length > 0">
        <div :class="$style['index']" :min-item-size="Math.min(pages.length, 20)" key-field="_id">
          <div class="mb-3" :class="$style['index-item-outer']" v-for="item in pageItems" :key="item._id">
            <NuxtLink :to="item._path" class="text-decoration-none">
              <div class="">
                <div :class="{ 'mb-0': !item.description, [$style['index-item-title']]: true }" v-text="item.title" />
                <div :class="$style['index-item-description']" v-text="item.description" />
              </div>
            </NuxtLink>
          </div>
        </div>

        <div :class="$style['index-pagination']" v-if="totalPages > 1">
          <button v-if="page !== 1" class="btn btn-primary" :class="$style['index-pagination-button']" @click="page += -1">Prev ＜</button>
          <div>
            <input type="number" v-model="page" min="1" :max="totalPages" step="1" class="form-control" :class="$style['index-pagination-input']" /> / {{ totalPages }}
          </div>
          <button v-if="page !== totalPages" class="btn btn-primary" :class="$style['index-pagination-button']" @click="page += -1">＞ Next</button>
        </div>
      </div>
    </div>

    <BsNavbar />
  </div>
</template>

<script setup lang="ts">
const content = useContent();

const baseQuery = queryContent(content.page.value._path).where(content.page.value.where || {});
const { data: _pages } = await useAsyncData(`indexPages:${content.page.value._id}`, () => baseQuery.only(['_id', '_path', '_file', 'title', 'description', 'thumbnail']).find());

console.log(_pages.value)

// 直下のページだけを表示
const pages = computed(() => _pages.value.filter((page) =>
  // ルートページのときだけ違うロジックにする必要がある
  content.page.value._path === '/' ? (page._path !== '/' && page._path.split('/').length === 2)
  : page._path.split('/').length === content.page.value._path.split('/').length + 1));

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
      //router.replace({ query: { page: 1 } });
    } else if (Number(newValue) > totalPages.value) {
      page.value = totalPages.value;
      //router.replace({ query: { page: totalPages.value } });
    } else {
      //pushOrReplace(newValue)({ query: { page: newValue } });
    }
  }, { immediate: true });
});
</script>

<style module lang="scss">
.default {
  max-width: 60rem;
}

.index {
  display: block;
}

.index-item-outer {
  display: block;
  width: 100%;
}

.index-item-title {
  font-size: 1.2rem;
  font-weight: 700;
}

.index-item-description {
  font-size: 1.1rem;
}

.index-pagination {
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
