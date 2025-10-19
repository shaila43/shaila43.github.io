<script setup>
const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });
</script>

<template>
  <nav class="max-w-3xl mx-auto mt-12">
    <nuxt-link
      to="/"
      class="inline-block text-white py-2 px-4 bg-gradient-brand text-center shadow"
    >
      Back to list
    </nuxt-link>

    <button
      @click="scrollToTop"
      class="fixed right-4 bottom-4 w-12 h-12 rounded-full bg-gradient-brand text-white flex items-center justify-center shadow-lg z-50 cursor-pointer"
      aria-label="Back to top"
    >
      <span class="material-icons-outlined">expand_less</span>
    </button>
  </nav>
</template>
