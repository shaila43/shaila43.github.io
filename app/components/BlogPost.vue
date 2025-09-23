<script setup>
defineProps({
  title: { type: String, required: true },
  href: { type: String, required: true },
  lead: { type: String, required: true },
  date: { type: String, required: true },
  badges: { type: Array, default: [] },
  image: { type: String, required: true },
});
</script>

<template>
  <NuxtLink :to="href" class="group">
    <article class="space-y-2 md:space-y-3">
      <div class="overflow-hidden">
        <img
          :src="image"
          class="w-full aspect-3/2 object-cover scale-100 group-hover:scale-115 transition-all duration-500"
        />
      </div>
      <div class="d-flex items-center">
        <span class="text-sm md:text-base inline-block mr-3 g">{{ date }}</span>
        <span
          v-for="badge in badges"
          class="bg-black text-white text-sm px-2.5 py-1 inline-block rounded-md mr-2"
          >{{ badge }}</span
        >
      </div>
      <h3 class="text-lg md:text-xl font-semibold">{{ title }}</h3>
      <!-- <p class="text-sm md:text-base text-justify">{{ lead }}...</p> -->
      <button
        class="text-white py-1 px-3 mt-2 md:mt-4 inline-block bg-gradient-brand text-sm md:text-base cursor-pointer"
      >
        Read more
      </button>
    </article>
  </NuxtLink>
</template>
