<script setup lang="ts">
const quickLinks = [
  { label: 'Orações', icon: 'i-lucide-book-open', to: '/oracoes' },
  { label: 'Artigos', icon: 'i-lucide-file-text', to: '/artigos' },
  { label: 'Novenas', icon: 'i-lucide-calendar-heart', to: '/novenas' },
  { label: 'Liturgia', icon: 'i-lucide-scroll-text', to: '/liturgia' },
]
</script>

<template>
  <section class="relative flex min-h-[70vh] items-center justify-center overflow-hidden bg-burgundy-900">
    <div class="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-burgundy-800 via-burgundy-900 to-burgundy-950" />

    <div class="relative z-10 mx-auto max-w-3xl px-6 text-center">
      <h1 class="font-serif text-4xl font-bold text-white md:text-5xl lg:text-6xl">
        Stella Maris
      </h1>
      <p class="mt-4 text-lg text-burgundy-200 md:text-xl">
        Guiando almas ao porto seguro
      </p>
      <p class="mt-3 text-sm text-burgundy-300 max-w-xl mx-auto">
        Um farol de fé e espiritualidade — orações, novenas e artigos para fortalecer sua caminhada cristã.
      </p>
    </div>

    <div class="absolute bottom-0 left-0 right-0 flex justify-center pb-8">
      <StButton size="lg" to="/sobre">
        Saiba Mais
      </StButton>
    </div>

    <div class="absolute right-4 top-1/2 -translate-y-1/2 hidden lg:flex flex-col gap-3">
      <NuxtLink
        v-for="link in quickLinks"
        :key="link.to"
        :to="link.to"
        class="flex size-12 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur-sm hover:bg-white/20 transition-colors"
        :title="link.label"
      >
        <UIcon :name="link.icon" class="size-5" />
      </NuxtLink>
    </div>
  </section>
</template>