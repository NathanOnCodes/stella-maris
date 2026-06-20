<script setup lang="ts">
const search = ref('')
</script>

<template>
  <header class="sticky top-0 z-20 flex items-center justify-between bg-white/80 backdrop-blur-md border-b border-slate-200 px-6 py-3">
    <div class="w-72">
      <div class="relative max-w-xs">
        <UIcon name="i-lucide-search" class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400 size-4 mt-2.5 ml-3" />
        <input
          v-model="search"
          type="text"
          placeholder="Buscar..."
          class="w-full rounded-xl border border-slate-200 bg-slate-50 py-2 pl-10 pr-4 text-sm text-slate-700 placeholder-slate-400 transition-all focus:border-burgundy-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-burgundy-400/20"
        />
      </div>
    </div>

    <div class="flex items-center gap-4">
      <button class="relative rounded-xl p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-700 transition-colors">
        <UIcon name="i-lucide-bell" class="size-5" />
        <span class="absolute right-1.5 top-1.5 size-2 rounded-full bg-red-500" />
      </button>

      <div class="flex items-center gap-3 pl-4 border-l border-slate-200">
        <div class="text-right">
          <p class="text-sm font-medium text-slate-700">Admin</p>
          <p class="text-xs text-slate-400">admin@stellamaris.com</p>
        </div>
        <div class="flex size-9 items-center justify-center rounded-full bg-burgundy-800 text-sm font-medium text-white">
          A
        </div>
      </div>
    </div>
  </header>
</template>