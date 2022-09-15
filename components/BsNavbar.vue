// ナビゲーションバー

<template>
  <div>
  <div style="height: 3.625rem"></div>
  <nav class="navbar navbar-expand-lg fixed-bottom navbar-dark bg-dark">
    <div class="container">
      <a class="navbar-brand fw-bold" href="#">a9z.dev</a>
      <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent"
        aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon bg-dark"></span>
      </button>
      <div class="collapse navbar-collapse" id="navbarSupportedContent">
        <ul class="navbar-nav me-auto mb-2 mb-lg-0">
          <li class="nav-item">
            <a href="/" class="nav-link">Home</a>
          </li>
          <li class="nav-item">
            <a href="/blog" class="nav-link">ブログ</a>
          </li>
          <li class="nav-item">
            <a href="/products" class="nav-link">製品</a>
          </li>
          <!-- ？？？？？？
          <ContentNavigation v-slot="{ navigation }">
            <li v-for="link of navigation" :key="link._path" class="nav-item">
              <a :href="link._path" class="nav-link">{{ link.title }}</a>
            </li>
          </ContentNavigation>
          -->
        </ul>
      </div>
    </div>
  </nav>
  </div>
</template>
