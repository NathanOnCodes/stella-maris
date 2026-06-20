<script setup lang="ts">
const route = useRoute()

const navItems = [
  { label: 'Dashboard', icon: 'i-lucide-layout-dashboard', to: '/admin' },
  { label: 'Artigos', icon: 'i-lucide-file-text', to: '/admin/artigos' },
  { label: 'Orações', icon: 'i-lucide-book-open', to: '/admin/oracoes' },
  { label: 'Novenas', icon: 'i-lucide-calendar-heart', to: '/admin/novenas' },
  { label: 'Assinantes', icon: 'i-lucide-users', to: '/admin/assinantes' },
  { label: 'Configurações', icon: 'i-lucide-settings', to: '/admin/configuracoes' },
]

function isActive(path: string) {
  if (path === '/admin') return route.path === '/admin'
  return route.path.startsWith(path)
}
</script>

<template>
  <aside class="fixed inset-y-0 left-0 z-30 flex w-60 flex-col bg-burgundy-900 text-white">
    <div class="flex items-center gap-3 px-6 py-5 border-b border-burgundy-800">
      <UIcon name="i-lucide-star" class="size-7 text-burgundy-300" />
      <div>
        <h2 class="font-serif text-lg tracking-wide">Stella Maris</h2>
        <p class="text-xs text-burgundy-400">Painel Administrativo</p>
      </div>
    </div>

    <nav class="flex-1 overflow-y-auto px-3 py-4">
      <ul class="flex flex-col gap-1">
        <li v-for="item in navItems" :key="item.to">
          <NuxtLink
            :to="item.to"
            class="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors"
            :class="isActive(item.to) ? 'bg-burgundy-800 text-white' : 'text-burgundy-300 hover:bg-burgundy-800/50 hover:text-white'"
          >
            <UIcon :name="item.icon" class="size-5 shrink-0" />
            {{ item.label }}
          </NuxtLink>
        </li>
      </ul>
    </nav>

    <div class="border-t border-burgundy-800 p-4">
      <button
        class="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-burgundy-400 hover:bg-burgundy-800/50 hover:text-white transition-colors"
        @click="navigateTo('/')"
      >
        <UIcon name="i-lucide-globe" class="size-5" />
        Ver Portal
      </button>
    </div>
  </aside>
</template>