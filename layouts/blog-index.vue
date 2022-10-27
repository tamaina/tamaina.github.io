<template>
  <div>
    <div class="min-vh-100 py-5 container" :class="$style.default">
      <BreadCrumb :addDividerToEnd="true" />
      <slot />

      <div id="blog-index" v-if="pages && pages.length > 0">
        <div :class="$style['blog-index']">
          <ClientOnly>
            <ins
              class="adsbygoogle mb-3"
              style="display:block"
              data-ad-format="fluid"
              :data-ad-layout-key="ads[`${isMobile ? 'mobile' : 'desktop'}-${isDark() ? 'dark' : 'light'}`].layoutKey"
              data-ad-client="ca-pub-1736621122676736"
              :data-ad-slot="ads[`${isMobile ? 'mobile' : 'desktop'}-${isDark() ? 'dark' : 'light'}`].slot"
              v-push-ad>
            </ins>
            <div class="card mb-3 border-primary" :class="$style['blog-index-item-outer']" v-for="item in pageItems" :key="item._id">
              <a :href="item._path" class="row g-0 text-reset text-decoration-none">
                <div class="col-sm-4">
                  <nuxt-picture
                    v-if="item.thumbnail"
                    :src="getImgRelativePath(item.thumbnail, item._file)"
                    quality="80"
                    sizes="md:256vw lg:512px"
                    :img-attrs="{ class: `img-fluid w-100 rounded ${$style['blog-index-item-img']}` }"
                  ></nuxt-picture>
                </div>
                <div class="col-sm-8">
                  <div class="card-body">
                    <h5 class="card-title fw-bold" :class="{ 'mb-0': !item.description }" v-text="item.title" />
                    <div class="card-text" v-text="item.description" />
                  </div>
                </div>
              </a>
            </div>
            <ins
              class="adsbygoogle mb-3"
              style="display:block"
              data-ad-format="fluid"
              :data-ad-layout-key="ads[`${isMobile ? 'mobile' : 'desktop'}-${isDark() ? 'dark' : 'light'}`].layoutKey"
              data-ad-client="ca-pub-1736621122676736"
              :data-ad-slot="ads[`${isMobile ? 'mobile' : 'desktop'}-${isDark() ? 'dark' : 'light'}`].slot"
              v-push-ad>
            </ins>
          </ClientOnly>
        </div>

        <div :class="$style['blog-index-pagination']" v-if="totalPages > 1">
          <button v-if="pagingNumber !== 1" class="btn btn-primary" :class="$style['blog-index-pagination-button']" @click="pagingNumber += -1">Prev ＜</button>
          <div>
            <input type="number" v-model="pagingNumber" min="1" :max="totalPages" step="1" class="form-control" :class="$style['blog-index-pagination-input']" /> / {{ totalPages }}
          </div>
          <button v-if="pagingNumber !== totalPages" class="btn btn-primary" :class="$style['blog-index-pagination-button']" @click="pagingNumber += -1">＞ Next</button>
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

const baseQuery = queryContent(page.value._path).where(Object.assign({ publishedAt: { $gt: '' } }, page.value.where || {}));
const { data: _pages } = await useAsyncData(`blogIndexPages:${page.value._id}`, () => baseQuery.only(['_id', '_path', '_file', 'title', 'description', 'thumbnail']).sort({ publishedAt: -1 }).find());

// ignore myself
const pages = computed(() => _pages.value.filter((p) => p._id !== page.value._id));

const router = useRouter();
const pagingNumber = ref(Number(router.currentRoute.value.query.page) || 1);
const perPage = ref(10);
const total = computed(() => pages.value.length);
const totalPages = computed(() => Math.ceil(total.value / perPage.value));
const start = computed(() => (pagingNumber.value - 1) * perPage.value);
const end = computed(() => Math.min(start.value + perPage.value, total.value));
const pageItems = computed(() => pages.value.slice(start.value, end.value));

// ad
const isMobile = ref<boolean>(true);
const ads = {
  'mobile-light': {
    layoutKey: '-5n+c9-1y-85+x4',
    slot: '9266469283',
  },
  'mobile-dark': {
    layoutKey: '-5n+c9-1y-85+x4',
    slot: '7007724188',
  },
  'desktop-light': {
    layoutKey: '-fk-19+6t-41+ij',
    slot: '8248901089',
  },
  'desktop-dark': {
    layoutKey: '-fk-19+6t-41+ij',
    slot: '4281735911',
  },
}
function onResize() {
  isMobile.value = window.innerWidth < 576;
}

onMounted(() => {
  console.log('mounted blog-index');
  initAd();

  watch(pagingNumber, (newValue) => {
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
      router.replace({ query: { page: totalPages.value <= 1 ? undefined : 1 } });
    } else if (Number(newValue) > totalPages.value) {
      page.value = totalPages.value;
      router.replace({ query: { page: totalPages.value <= 1 ? undefined : totalPages.value } });
    } else {
      if (totalPages.value <= 1) router.replace({ query: { page: undefined } });
      else pushOrReplace(newValue)({ query: { page: newValue } });
    }
  }, { immediate: true });

  if (window) {
    window.addEventListener('resize', onResize);
    onResize();
  }
});

onUnmounted(() => {
  if (window) {
    window.removeEventListener('resize', onResize);
  }
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
  height: 100%;
  width: 100%;
  object-fit: cover;

  @media (max-width: 575.98px) {
    aspect-ratio: 3 / 2;
  }
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
