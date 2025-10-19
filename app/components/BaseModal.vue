<script setup>
import { watch, onBeforeUnmount } from "vue";

const props = defineProps({
  isOpen: { type: Boolean, default: false },
  class: { type: String, default: "max-w-md" },
  title: { type: String, default: "" },
});

const emit = defineEmits(["onClose"]);

const setBodyOverflow = (open) => {
  if (typeof document === "undefined") return;
  if (open) document.body.classList.add("overflow-hidden");
  else document.body.classList.remove("overflow-hidden");
};

watch(
  () => props.isOpen,
  (val) => setBodyOverflow(val),
  { immediate: true }
);

onBeforeUnmount(() => setBodyOverflow(false));
</script>

<template>
  <Transition name="fade">
    <div
      v-if="isOpen"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/80"
      @click.self="emit('onClose')"
    >
      <div
        class="bg-white shadow-lg w-full p-6 relative rounded-md"
        :class="class"
      >
        <div class="flex items-center justify-between mb-4">
          <h4 class="text-lg font-semibold">{{ title }}</h4>
          <button
            class="text-2xl text-gray-700 hover:text-gray-900 flex self-start"
            aria-label="Close modal"
            @click="emit('onClose')"
          >
            <span class="material-icons-outlined">close</span>
          </button>
        </div>
        <div class="mt-2 space-y-5">
          <slot />
        </div>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.4s;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
