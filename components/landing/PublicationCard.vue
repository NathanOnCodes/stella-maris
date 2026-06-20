<script setup lang="ts">
defineProps<{
  title: string
  excerpt: string
  date: string
  category: string
  image?: string
}>()
</script>

<template>
  <StCard padding="none" class="overflow-hidden group cursor-pointer hover:shadow-lg transition-shadow">
    <div class="aspect-video bg-gradient-to-br from-burgundy-200 to-burgundy-400 flex items-center justify-center">
      <UIcon v-if="!image" name="i-lucide-image" class="size-12 text-burgundy-600/50" />
      <img v-else :src="image" :alt="title" class="h-full w-full object-cover" />
    </div>
    <div class="p-5">
      <span class="inline-block rounded-full bg-burgundy-100 px-2.5 py-0.5 text-xs font-medium text-burgundy-700">
        {{ category }}
      </span>
      <h3 class="mt-3 font-serif text-lg font-semibold text-slate-900 group-hover:text-burgundy-800 transition-colors line-clamp-2">
        {{ title }}
      </h3>
      <p class="mt-2 text-sm text-slate-500 line-clamp-2">{{ excerpt }}</p>
      <p class="mt-3 text-xs text-slate-400">{{ date }}</p>
    </div>
  </StCard>
</template>