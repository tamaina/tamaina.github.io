<template>
    <NuxtPage />
</template>

<script setup lang="ts">
useHead({
    titleTemplate: (titleChunk) => {
        return titleChunk ? `${titleChunk} - aqz/tamaina's homepage` : `a9z.dev - aqz/tamaina's homepage`;
    }
});
</script>
