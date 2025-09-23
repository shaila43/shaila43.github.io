<template>
  <div>
    <h2
      class="text-2xl md:text-3xl lg:text-4xl text-center mt-5 md:mt-8 lg:mt-10 font-semibold"
    >
      Thoughts, Sparks & Chaos
    </h2>
    <p
      class="text-lg md:text-xl lg:text-2xl text-center mb-8 md:mb-12 lg:mb-16 mt-6 font-medium"
    >
      Some random portion of useless knowledge - or maybe not.
    </p>

    <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-10">
      <BlogPost
        image="/img/multi-injected-provider-discovery-eip-6963.jpeg"
        date="09.09.2025"
        :badges="['Vue', 'Web3']"
        title="How to implement Multi Injected Provider Discovery | EIP-6963"
        lead="
          EIP-6963 is an Ethereum Improvement Proposal that defines a standard
          interface for Ethereum provider detection in browsers. It allows dApps
          to discover which wallet providers"
        href="how-to-implement-multi-injected-provider-discovery-eip-6963"
      >
      </BlogPost>
    </div>
  </div>
</template>
