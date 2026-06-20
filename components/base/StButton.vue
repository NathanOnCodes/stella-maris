<script setup lang="ts">
const props = withDefaults(defineProps<{
  variant?: 'primary' | 'secondary' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  loading?: boolean
  disabled?: boolean
  to?: string
  type?: 'button' | 'submit' | 'reset'
}>(), {
  variant: 'primary',
  size: 'md',
  type: 'button',
})

const sizeClasses = {
  sm: 'px-4 py-1.5 text-sm',
  md: 'px-6 py-2.5 text-base',
  lg: 'px-8 py-3 text-lg',
}

const variantClasses = {
  primary: 'bg-burgundy-800 text-white hover:bg-burgundy-700 active:bg-burgundy-900 shadow-md shadow-burgundy-800/20',
  secondary: 'border-2 border-burgundy-800 text-burgundy-800 hover:bg-burgundy-50 active:bg-burgundy-100',
  ghost: 'text-burgundy-800 hover:bg-burgundy-50 active:bg-burgundy-100',
}
</script>

<template>
  <NuxtLink
    v-if="to"
    :to="to"
    class="inline-flex items-center justify-center gap-2 rounded-full font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-burgundy-400 focus:ring-offset-2"
    :class="[sizeClasses[size], variantClasses[variant]]"
  >
    <UIcon
      v-if="loading"
      name="i-lucide-loader-circle"
      class="size-4 animate-spin"
    />
    <slot name="icon" />
    <slot />
  </NuxtLink>
  <button
    v-else
    :type="type"
    :disabled="disabled || loading"
    class="inline-flex items-center justify-center gap-2 rounded-full font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-burgundy-400 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
    :class="[sizeClasses[size], variantClasses[variant]]"
  >
    <UIcon
      v-if="loading"
      name="i-lucide-loader-circle"
      class="size-4 animate-spin"
    />
    <slot name="icon" />
    <slot />
  </button>
</template>