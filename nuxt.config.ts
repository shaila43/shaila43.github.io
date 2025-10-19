import tailwindcss from "@tailwindcss/vite";

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: process.env.NUXT_NODE_ENV === "development" },
  css: ["~/assets/css/main.css"],
  vite: { plugins: [tailwindcss()] },
  modules: ["nuxt-shiki"],
  shiki: {
    defaultTheme: "monokai",
    bundledLangs: ["js", "vue", "php", "shellscript"],
  },
  nitro: {
    preset: "github-pages",
  },
  app: {
    pageTransition: { name: "page", mode: "out-in" },
    head: {
      title: "Thoughts, Sparks & Chaos - Programming & Beyond",
      meta: [
        { name: "author", content: "Shaila43" },
        {
          name: "description",
          content:
            "Notes, experiments and fragments of programming knowledge, mixed with random sparks of curiosity.",
        },
        {
          name: "keywords",
          content:
            "programming, code, software, web development, notes, experiments, knowledge",
        },
        {
          property: "og:title",
          content: "Thoughts, Sparks & Chaos - Programming & Beyond",
        },
        {
          property: "og:description",
          content:
            "Notes, experiments and fragments of programming knowledge, mixed with random sparks of curiosity.",
        },
        { property: "og:type", content: "website" },
      ],
      htmlAttrs: { lang: "en" },
      link: [
        {
          href: "https://fonts.googleapis.com/icon?family=Material+Icons+Outlined",
          rel: "stylesheet",
        },
      ],
    },
  },
});
