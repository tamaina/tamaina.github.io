<template>
  <div>
    <div class="min-vh-100 py-5 container" :class="$style.default">
      <BreadCrumb :addDividerToEnd="true" />
      <div id="body" :class="$style.content">
        <slot />
      </div>

      <div id="index" class="mt-5" v-if="pages && pages.length > 0">
        <div :class="$style['index']" :min-item-size="Math.min(pages.length, 20)" key-field="_id">
          <div class="mb-3" :class="$style['index-item-outer']" v-for="item in pageItems" :key="item._id">
            <a :href="item._path" class="text-decoration-none">
              <div class="">
                <div :class="{ 'mb-0': !item.description, [$style['index-item-title']]: true }" v-text="item.title" />
                <div :class="$style['index-item-description']" v-text="item.description" />
              </div>
            </a>
          </div>
        </div>

        <div :class="$style['index-pagination']" v-if="totalPages > 1">
          <button v-if="pagingNumber !== 1" class="btn btn-primary" :class="$style['index-pagination-button']" @click="prevPage">Prev ＜</button>
          <div>
            <input type="number" v-model="pagingNumber" min="1" :max="totalPages" step="1" class="form-control" :class="$style['index-pagination-input']" /> / {{ totalPages }}
          </div>
          <button v-if="pagingNumber !== totalPages" class="btn btn-primary" :class="$style['index-pagination-button']" @click="nextPage">＞ Next</button>
        </div>
      </div>

      <ClientOnly>
        <ins
          class="adsbygoogle my-3"
          style="display:block"
          data-ad-format="autorelaxed"
          data-ad-client="ca-pub-1736621122676736"
          :data-ad-slot="isDark() ? 6544689751 : 7169954832"
          v-push-ad>
        </ins>
      </ClientOnly>
    </div>

    <BsNavbar />
  </div>
</template>

<script setup lang="ts">
const { page } = useContent();

const baseQuery = queryContent(page.value._path).where(page.value.where || {});
const { data: _pages } = await useAsyncData(`indexPages:${page.value._id}`, () => baseQuery.only(['_id', '_path', '_file', 'title', 'description', 'thumbnail']).find());

// 直下のページだけを表示
const pages = computed(() => (_pages.value ?? []).filter((p) =>
  // ルートページのときだけ違うロジックにする必要がある
  page.value._path === '/' ? (p._path !== '/' && p._path.split('/').length === 2)
  : p._path.split('/').length === page.value._path.split('/').length + 1));

const router = useRouter();
const pagingNumber = ref(Number(router.currentRoute.value.query.page) || 1);
const perPage = ref(20);
const total = computed(() => pages.value.length);
const totalPages = computed(() => Math.ceil(total.value / perPage.value));
const start = computed(() => (pagingNumber.value - 1) * perPage.value);
const end = computed(() => Math.min(start.value + perPage.value, total.value));
const pageItems = computed(() => pages.value.slice(start.value, end.value));

async function prevPage() {
  pagingNumber.value += -1;
  await nextTick();
  window.scrollTo(0, 0);
}

async function nextPage() {
  pagingNumber.value += 1;
  await nextTick();
  window.scrollTo(0, 0);
}

onMounted(() => {
  console.log('mounted index');
  initAd();

  watch(pagingNumber, (newValue) => {
    const pushOrReplace = (newValue: number) => {
      const curr = router.currentRoute.value.query.page as string | undefined;
      if (!curr) {
        return router.replace;
      }
      if (newValue.toString() === curr) {
        return router.replace;
      }
      return router.push;
    }

    if (perPage.value >= total.value) {
      pagingNumber.value = 1;
      router.replace({ query: {} });
    } else if (Number.isNaN(newValue) || !Number.isInteger(newValue) || Number(newValue) < 1) {
      pagingNumber.value = 1;
      router.replace({ query: { page: 1 } });
    } else if (Number(newValue) > totalPages.value) {
      pagingNumber.value = totalPages.value;
      router.replace({ query: { page: totalPages.value } });
    } else {
      pushOrReplace(newValue)({ query: { page: newValue } });
    }

    window.scrollTo(0, 0);
  }, { immediate: true });
});
</script>

<style module lang="scss">
.default {
  max-width: 50rem;
}

.content {
  .h1, h1 {
    line-height: 1.2;
  }

  .h2,
  .h3,
  .h4,
  .h5,
  .h6,
  h2,
  h3,
  h4,
  h5,
  h6 {
    margin-top: 1.5rem;
  }
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
