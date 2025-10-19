<script setup>
const props = defineProps({
  code: { type: String, required: true },
  lang: { type: String, required: true },
});

const isCopied = ref(false);

const onCopy = () => {
  navigator.clipboard.writeText(props.code).then(() => {
    isCopied.value = true;
    setTimeout(() => {
      isCopied.value = false;
    }, 2000);
  });
};

const highlighter = await getShikiHighlighter();
const html = highlighter.highlight(props.code, { lang: props.lang });
</script>

<template>
  <div class="relative text-sm">
    <button
      class="absolute right-2 top-2 bg-gray-600 text-white px-2 rounded-md cursor-pointer py-2 flex items-center justify-center h-8 w-8"
      aria-label="Copy code snippet to clipboard"
      @click="onCopy"
    >
      <template v-if="isCopied">
        <span class="material-icons-outlined !text-lg">check</span>
      </template>
      <template v-else>
        <span class="material-icons-outlined !text-lg">content_copy</span>
      </template>
    </button>
    <div class="p-4 bg-[#272822] rounded-md overflow-auto" v-html="html" />
  </div>
</template>
