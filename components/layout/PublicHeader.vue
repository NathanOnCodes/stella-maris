<script setup lang="ts">
const navLeft = [
  { label: 'Início', to: '/' },
  { label: 'Sobre', to: '/sobre' },
]

const navRight = [
  { label: 'Orações', to: '/oracoes' },
  { label: 'Contato', to: '/contato' },
]
</script>

<template>
  <header class="sticky top-0 z-50 border-b border-cream-200 bg-cream-100/90 backdrop-blur-md">
    <div class="mx-auto grid max-w-6xl grid-cols-[1fr_auto_1fr] items-center px-6 py-4">
      <nav class="hidden items-center gap-8 md:flex">
        <NuxtLink
          v-for="item in navLeft"
          :key="item.to"
          :to="item.to"
          class="text-sm font-medium text-slate-600 hover:text-burgundy-800 transition-colors"
        >
          {{ item.label }}
        </NuxtLink>
      </nav>

      <NuxtLink to="/" class="flex items-center gap-2 px-4">
        <UIcon name="i-lucide-star" class="size-6 text-burgundy-800 shrink-0" />
        <span class="font-serif text-xl font-bold text-burgundy-800 tracking-wide whitespace-nowrap">
          Regina Caeli
        </span>
      </NuxtLink>

      <div class="hidden items-center justify-end gap-8 md:flex">
        <nav class="flex items-center gap-8">
          <NuxtLink
            v-for="item in navRight"
            :key="item.to"
            :to="item.to"
            class="text-sm font-medium text-slate-600 hover:text-burgundy-800 transition-colors"
          >
            {{ item.label }}
          </NuxtLink>
        </nav>

        <StButton size="sm" variant="secondary" to="/login">
          Login
        </StButton>
      </div>
    </div>
  </header>
</template>