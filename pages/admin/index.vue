<script setup lang="ts">
definePageMeta({
  middleware: ['auth'],
})
</script>

<template>
  <AdminLayout>
    <div class="flex flex-col gap-6">
      <div>
        <h1 class="font-serif text-2xl font-bold text-slate-900">Dashboard</h1>
        <p class="mt-1 text-sm text-slate-500">Visão geral do conteúdo e assinantes</p>
      </div>

      <MetricsGrid />

      <div class="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_380px]">
        <RecentActivities />
        <ChartPlaceholder />
      </div>
    </div>
  </AdminLayout>
</template>