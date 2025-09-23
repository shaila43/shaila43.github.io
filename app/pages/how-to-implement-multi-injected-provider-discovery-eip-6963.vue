<script setup>
const providers = ref([]);
const currentProvider = ref(null);
const copiedScript = ref(false);
const copiedTemplate = ref(false);
const htmlScript = ref("");
const htmlTemplate = ref("");

const copyCode = (code, type) => {
  navigator.clipboard.writeText(code).then(() => {
    if (type === "script") copiedScript.value = true;
    if (type === "template") copiedTemplate.value = true;

    setTimeout(() => {
      if (type === "script") copiedScript.value = false;
      if (type === "template") copiedTemplate.value = false;
    }, 2000);
  });
};

const onSelectProvider = (provider) => (currentProvider.value = provider);

const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

const eip6963Handler = (event) => {
  const provider = event.detail;
  if (
    provider &&
    !providers.value.find((p) => p.info.uuid === provider.info.uuid)
  ) {
    providers.value.push(provider);
  }
};
const htmlScriptText = `import { ref, onMounted, onUnmounted } from 'vue';

const providers = ref([]);

const eip6963Handler = (event) => {
  const provider = event.detail;
  if (
    provider &&
    !providers.value.find((p) => p.info.uuid === provider.info.uuid)
  ) {
    providers.value.push(provider);
  }
};

onMounted(() => {
  window.addEventListener("eip6963:announceProvider", eip6963Handler);
  window.dispatchEvent(new Event("eip6963:requestProvider"));
});

onUnmounted(() => {
  window.removeEventListener("eip6963:announceProvider", eip6963Handler);
});
`;

const htmlTemplateText = `<template>
  <div
    v-for="provider in providers"
    :key="provider.info.name"
  >
    <img :src="provider.info.icon" />
    {{ provider.info.name }}
  </div>
</template>`;

watch(
  currentProvider,
  (newCurrentProvider) =>
    (document.body.style = newCurrentProvider ? "overflow: hidden" : "")
);

onMounted(async () => {
  window.addEventListener("eip6963:announceProvider", eip6963Handler);
  window.dispatchEvent(new Event("eip6963:requestProvider"));
  const highlighter = await getShikiHighlighter();
  htmlScript.value = highlighter.highlight(htmlScriptText, { lang: "js" });
  htmlTemplate.value = highlighter.highlight(htmlTemplateText, { lang: "vue" });
});

onUnmounted(() => {
  window.removeEventListener("eip6963:announceProvider", eip6963Handler);
});
</script>

<template>
  <div>
    <article class="max-w-3xl mx-auto">
      <img
        src="/img/multi-injected-provider-discovery-eip-6963.jpeg"
        class="w-full aspect-16/9 mx-auto"
      />
      <h2
        class="text-2xl md:text-3xl lg:text-4xl my-5 md:my-8 lg:my-10 font-bold text-neutral-800"
      >
        How to implement Multi Injected Provider Discovery | EIP-6963
      </h2>
      <div class="space-y-4 md:space-y-6">
        <p class="text-lg/relaxed text-neutral-700">
          <a
            class="font-semibold text-pink hover:text-dark-blue transition-all duration-300 underline decoration-pink hover:decoration-dark-blue"
            href="https://eips.ethereum.org/EIPS/eip-6963"
            target="_blank"
            rel="noopener noreferrer"
            >EIP-6963</a
          >
          is an Ethereum Improvement Proposal that defines a
          <strong class="font-semibold text-neutral-800"
            >standard interface for Ethereum provider detection in
            browsers</strong
          >. This solves a common problem: dApps often cannot reliably detect
          which wallets a user has installed, which can lead to inconsistent UX
          or failed connections. It allows dApps to discover which wallet
          providers (like MetaMask, Coinbase Wallet, or others) are available on
          a user’s browser without relying on custom scripts.
        </p>
        <p class="text-lg/relaxed text-neutral-700">
          Here’s why adopting EIP-6963 improves your dApp experience:
        </p>
        <ul
          class="text-lg/relaxed text-neutral-700 list-disc ml-10 space-y-3 marker:text-gray-300"
        >
          <li>
            <strong class="font-semibold text-neutral-800">dApps</strong> can
            automatically show a list of providers a user has installed
          </li>
          <li>
            makes
            <strong class="font-semibold text-neutral-800"
              >wallet detection</strong
            >
            more consistent and secure
          </li>
          <li>
            avoids relying on
            <strong class="font-semibold text-neutral-800"
              >window.ethereum</strong
            >
            heuristics, which may be unreliable
          </li>
          <li>
            ensures
            <strong class="font-semibold text-neutral-800"
              >future compatibility</strong
            >
            as new wallet providers adopt the standard.
          </li>
        </ul>
        <p class="text-lg/relaxed text-neutral-700">
          Let's look at a simple example in Vue.js.
        </p>
        <div class="relative text-sm">
          <button
            class="absolute right-2 top-2 bg-gray-600 text-white px-2 rounded-md cursor-pointer py-2 flex items-center justify-center h-10 w-10"
            @click="copyCode(htmlScriptText, 'script')"
            aria-label="Copy code snippet to clipboard"
          >
            <template v-if="copiedScript">
              <span class="material-icons-outlined">check</span>
            </template>
            <template v-else>
              <span class="material-icons-outlined">content_copy</span>
            </template>
          </button>
          <div
            v-html="htmlScript"
            class="p-4 bg-[#272822] rounded-md overflow-auto"
          ></div>
        </div>
        <p class="text-lg/relaxed text-neutral-700">
          The method relies on two events:
        </p>
        <ul
          class="text-lg/relaxed text-neutral-700 list-disc ml-10 space-y-3 marker:text-gray-300"
        >
          <li>
            <strong class="font-semibold text-neutral-800"
              >eip6963:announceProvider</strong
            >
            - emitted by a provider when it becomes available
          </li>
          <li>
            <strong class="font-semibold text-neutral-800"
              >eip6963:requestProvider</strong
            >
            - sent to request all available providers to announce themselves.
          </li>
        </ul>
        <p class="text-lg/relaxed text-neutral-700">
          With the list of providers collected, the app can display them for
          selection or allow login via the chosen provider.
        </p>
        <div class="relative text-sm">
          <button
            class="absolute right-2 top-2 bg-gray-600 text-white px-2 rounded-md cursor-pointer py-2 flex items-center justify-center h-10 w-10"
            @click="copyCode(htmlTemplateText, 'template')"
            aria-label="Copy code snippet to clipboard"
          >
            <template v-if="copiedTemplate">
              <span class="material-icons-outlined">check</span>
            </template>
            <template v-else>
              <span class="material-icons-outlined">content_copy</span>
            </template>
          </button>
          <div
            v-html="htmlTemplate"
            class="p-4 bg-[#272822] rounded-md overflow-auto"
          ></div>
        </div>
        <p class="text-lg/relaxed text-neutral-700">Useful links:</p>
        <ul
          class="text-lg/relaxed text-neutral-700 list-disc ml-10 space-y-3 marker:text-gray-300"
        >
          <li>
            <a
              href="https://eips.ethereum.org/EIPS/eip-6963"
              target="_blank"
              rel="noopener noreferrer"
              class="text-pink hover:text-dark-blue transition-all duration-300 underline decoration-pink hover:decoration-dark-blue"
              >EIP-6963 specification</a
            >
          </li>
        </ul>
        <div class="space-y-4 md:space-y-6">
          <div class="my-8 h-0.5 bg-gradient-to-r from-pink to-dark-blue"></div>
          <p class="text-lg/relaxed text-neutral-700 font-semibold">
            Live demo
          </p>
          <p class="text-lg/relaxed text-neutral-700">
            Detected providers appear below. Click one to select it and update
            the app state.
          </p>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <button
              v-for="provider in providers"
              :key="provider.info.name"
              class="flex items-center justify-center border border-black w-full p-2 cursor-pointer"
              :aria-label="`Select ${provider.info.name} wallet`"
              @click="onSelectProvider(provider)"
            >
              <img :src="provider.info.icon" class="h-8 mr-2" />
              {{ provider.info.name }}
            </button>
          </div>
          <p class="text-center" v-if="providers.length === 0">
            No providers detected. Consider guiding the user to install a
            compatible wallet to start interacting with the dApp.
          </p>
        </div>
      </div>
    </article>
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
    <Transition>
      <div
        v-if="currentProvider"
        class="fixed inset-0 z-50 flex items-center justify-center bg-black/80"
        @click.self="currentProvider = null"
      >
        <div
          class="bg-white rounded-md shadow-lg w-full max-w-md p-6 relative m-4"
        >
          <button
            class="absolute top-4 right-4 text-gray-600 hover:text-gray-300 cursor-pointer"
            aria-label="Close modal"
            @click="currentProvider = null"
          >
            <span class="material-icons-outlined">close</span>
          </button>
          <div class="space-y-5">
            <h2 class="text-lg font-semibold mb-4">Provider details</h2>
            <img
              :src="currentProvider.info.icon"
              class="h-24 w-24 p-1 mx-auto"
            />
            <p class="text-2xl font-medium text-center">
              {{ currentProvider.info.name }}
            </p>
            <div
              class="grid grid-cols-[50px_1fr] gap-x-4 gap-y-2 text-sm md:text-base"
            >
              <div class="font-semibold text-gray-600">Rdns:</div>
              <div class="text-gray-600">{{ currentProvider.info.rdns }}</div>

              <div class="font-semibold text-gray-600">Uuid:</div>
              <div class="text-gray-600">{{ currentProvider.info.uuid }}</div>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<style lang="css">
.v-enter-active,
.v-leave-active {
  transition: opacity 0.5s ease;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
}
</style>
