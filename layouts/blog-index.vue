<template>
  <div :data-bs-theme="darkOrLight">
    <div class="min-vh-100 py-5 container" :class="$style.default">
      <BreadCrumb :addDividerToEnd="true" class="fw-bold" />
      <div id="body" :class="$style.content">
        <slot />
      </div>

      <div id="blog-index" v-if="pages && pages.length > 0">
        <div :class="$style['blog-index']">
          <ins
            class="adsbygoogle mb-3"
            style="display:block"
            data-ad-format="fluid"
            :data-ad-layout-key="ads[`${isMobile ? 'mobile' : 'desktop'}-${darkOrLight}`].layoutKey"
            data-ad-client="ca-pub-1736621122676736"
            :data-ad-slot="ads[`${isMobile ? 'mobile' : 'desktop'}-${darkOrLight}`].slot"
            v-push-ad>
          </ins>
          <div class="card mb-3 border-primary" :class="$style['blog-index-item-outer']" v-for="item in pageItems" :key="item._id">
            <a :href="item._path" class="row g-0 text-reset text-decoration-none" :class="$style['blog-index-item-inner']">
              <div class="col-sm-4" :class="$style['blog-index-item-img-outer']">
                <nuxt-picture
                  v-if="item.thumbnail"
                  :src="getImgRelativePath(item.thumbnail, item._file)"
                  quality="80"
                  sizes="400 smp:560 sm:280 lg:312"
                  loading="eager"
                  :img-attrs="{ class: `w-100 rounded ${$style['blog-index-item-img']}` }"
                ></nuxt-picture>
              </div>
              <div class="col-sm-8">
                <div class="card-body">
                  <div class="card-text">
                    <small class="text-body-secondary"><PublishedAt :pageDefined="item" /></small>
                  </div>
                  <h5 class="card-title fw-bold" :class="{ 'mb-0': !item.description, [$style['blog-index-item-title']]: true }" v-text="item.title" />
                  <div class="card-text" :class="$style['blog-index-item-description']" v-text="item.description" />
                </div>
              </div>
            </a>
          </div>
          <ins
            class="adsbygoogle mb-3"
            style="display:block"
            data-ad-format="fluid"
            :data-ad-layout-key="ads[`${isMobile ? 'mobile' : 'desktop'}-${darkOrLight}`].layoutKey"
            data-ad-client="ca-pub-1736621122676736"
            :data-ad-slot="ads[`${isMobile ? 'mobile' : 'desktop'}-${darkOrLight}`].slot"
            v-push-ad>
          </ins>
        </div>

        <div :class="$style['blog-index-pagination']" v-if="totalPages > 1">
          <button v-show="pagingNumber !== 1" class="btn btn-primary" :class="$style['blog-index-pagination-button']" @click="prevPage">Prev ＜</button>
          <div>
            <input type="number" v-model="pagingNumber" min="1" :max="totalPages" step="1" class="form-control" :class="$style['blog-index-pagination-input']" /> / {{ totalPages }}
          </div>
          <button v-show="pagingNumber !== totalPages" class="btn btn-primary" :class="$style['blog-index-pagination-button']" @click="nextPage">＞ Next</button>
        </div>
      </div>

      <ins
        class="adsbygoogle my-3"
        style="display:block"
        data-ad-format="autorelaxed"
        data-ad-client="ca-pub-1736621122676736"
        :data-ad-slot="isDark() ? 6544689751 : 7169954832"
        v-push-ad>
      </ins>
    </div>

    <BsNavbar />
  </div>
</template>

<script setup lang="ts">
const darkOrLight = inject<Ref<'dark' | 'light'>>('darkOrLight', ref('dark'));
const perPage = 10;

const { page } = useContent();

const baseQuery = queryContent(page.value._path).where(Object.assign({ publishedAt: { $gt: '' } }, page.value.where || {}));
const { data: _pages } = await useAsyncData(`blogIndexPages:${page.value._id}`, () => baseQuery.only(['_id', '_path', '_file', 'title', 'description', 'thumbnail', 'publishedAt', 'updatedAt']).sort({ publishedAt: -1 }).find());

// ignore myself
const pages = computed(() => _pages.value?.filter((p) => p._id !== page.value._id) || []);

const router = useRouter();
const pagingNumber = ref(Number(router.currentRoute.value.query.page) || 1);
const total = computed(() => pages.value.length);
const totalPages = computed(() => Math.ceil(total.value / perPage));
const start = computed(() => (pagingNumber.value - 1) * perPage);
const end = computed(() => Math.min(start.value + perPage, total.value));
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
    layoutKey: '-ff-1f+7f-3n+fo',
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

async function prevPage() {
  pagingNumber.value += -1;
  await nextTick();
  //window.scrollTo(0, 0);
}

async function nextPage() {
  pagingNumber.value += 1;
  await nextTick();
  //window.scrollTo(0, 0);
}

onMounted(() => {
  console.log('mounted blog-index');

  watch(pagingNumber, (newValue, oldValue) => {
    console.log('watch pagingNumber', newValue, oldValue);
    const shouldReplace = (_newValue: number) => {
      const curr = router.currentRoute.value.query.page as string | undefined;
      console.log('shouldReplace', _newValue, curr);
      if (!curr) return true;
      if (_newValue.toString() === curr) return true;
      return false;
    }

    if (perPage >= total.value) {
      pagingNumber.value = 1;
      router.replace({ query: {} });
    } else if (Number.isNaN(newValue) || !Number.isInteger(newValue) || Number(newValue) < 1) {
      page.value = 1;
      router.replace({ query: { page: totalPages.value <= 1 ? undefined : 1 } });
    } else if (Number(newValue) > totalPages.value) {
      page.value = totalPages.value;
      router.replace({ query: { page: totalPages.value <= 1 ? undefined : totalPages.value } });
    } else {
      if (totalPages.value <= 1) router.replace({ query: { page: undefined } });
      else router.push({ query: { page: newValue }, replace: shouldReplace(newValue) });
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

.content {
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

.blog-index {
  display: block;
}

.blog-index-item-outer {
  display: block;
  width: 100%;

  @media (min-width: 576px) {
    height: 184px;
  }
}

.blog-index-item-inner {
  height: auto;

  @media (min-width: 576px) {
    height: 100%;
  }
}

.blog-index-item-img-outer {
  height: auto;

  @media (min-width: 576px) {
    height: 100%;
  }
}

.blog-index-item-img {
  display: block;
  height: 30vh !important;
  width: 100%;
  object-fit: cover;

  @media (min-width: 576px) {
    height: 100% !important;
  }
}

.blog-index-item-title {
  line-height: 1.3;
  margin: 0 0 4px 0;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  display: -webkit-box;
  overflow: hidden;
  text-overflow: ellipsis;
  line-break: strict;
  text-align: justify;
  word-break: normal;
}

.blog-index-item-description {
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  display: -webkit-box;
  overflow: hidden;
  text-overflow: ellipsis;
  line-break: strict;
  text-align: justify;
  word-break: normal;
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
