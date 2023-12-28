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
            <NuxtLink to="/" class="nav-link">Home</NuxtLink>
          </li>
          <li class="nav-item">
            <NuxtLink to="/blog" class="nav-link">ブログ</NuxtLink>
          </li>
          <li class="nav-item">
            <NuxtLink to="/products" class="nav-link">製品</NuxtLink>
          </li>
          <li class="nav-item">
            <NuxtLink to="/memo" class="nav-link">Memo</NuxtLink>
          </li>
          <li class="nav-item">
            <NuxtLink to="/privacypolicy" class="nav-link">プライバシーポリシー</NuxtLink>
          </li>
        </ul>
      </div>
    </div>
  </nav>
  </div>
</template>
