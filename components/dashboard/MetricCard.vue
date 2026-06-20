<script setup lang="ts">
defineProps<{
  title: string
  value: string
  icon: string
  trend?: string
  trendUp?: boolean
}>()
</script>

<template>
  <StCard padding="md">
    <div class="flex items-start justify-between">
      <div class="flex flex-col gap-1">
        <p class="text-sm font-medium text-slate-500">{{ title }}</p>
        <p class="font-serif text-2xl font-bold text-slate-900">{{ value }}</p>
      </div>
      <div class="flex size-10 items-center justify-center rounded-xl bg-burgundy-100">
        <UIcon :name="icon" class="size-5 text-burgundy-800" />
      </div>
    </div>
    <div v-if="trend" class="mt-3 flex items-center gap-1 text-xs font-medium" :class="trendUp ? 'text-emerald-600' : 'text-red-500'">
      <UIcon :name="trendUp ? 'i-lucide-trending-up' : 'i-lucide-trending-down'" class="size-3.5" />
      {{ trend }}
    </div>
  </StCard>
</template>