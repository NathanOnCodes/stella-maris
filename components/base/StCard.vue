<script setup lang="ts">
withDefaults(defineProps<{
  padding?: 'sm' | 'md' | 'lg'
}>(), {
  padding: 'md',
})

const paddingClasses = {
  sm: 'p-4',
  md: 'p-6',
  lg: 'p-8',
}
</script>

<template>
  <div
    class="rounded-2xl border border-slate-100 bg-surface shadow-md shadow-slate-200/50"
    :class="paddingClasses[padding]"
  >
    <slot />
  </div>
</template>