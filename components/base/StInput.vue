<script setup lang="ts">
const model = defineModel<string>({ required: true })

withDefaults(defineProps<{
  type?: string
  placeholder?: string
  label?: string
  error?: string
  disabled?: boolean
}>(), {
  type: 'text',
})

const slots = useSlots()
const hasIcon = computed(() => !!slots.icon)
</script>

<template>
  <div class="flex flex-col gap-1">
    <label v-if="label" class="text-sm font-medium text-slate-700">
      {{ label }}
    </label>
    <div class="relative">
      <div
        v-if="hasIcon"
        class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400"
      >
        <slot name="icon" />
      </div>
      <input
        v-model="model"
        :type="type"
        :placeholder="placeholder"
        :disabled="disabled"
        class="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-slate-900 placeholder-slate-400 transition-all duration-200 focus:border-burgundy-400 focus:outline-none focus:ring-2 focus:ring-burgundy-400/20 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-400"
        :class="[hasIcon ? 'pl-10' : '', error ? 'border-red-400 focus:border-red-400 focus:ring-red-400/20' : '']"
      />
    </div>
    <p v-if="error" class="text-sm text-red-500">{{ error }}</p>
  </div>
</template>