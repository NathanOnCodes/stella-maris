<script setup lang="ts">
const activities = [
  { title: 'A Importância do Santo Rosário', type: 'Artigo', author: 'Pe. José', status: 'Publicado', date: '19/06/2026' },
  { title: 'Novena de Nossa Senhora Aparecida', type: 'Novena', author: 'Ir. Maria', status: 'Revisão', date: '18/06/2026' },
  { title: 'Oração da Manhã', type: 'Oração', author: 'Pe. José', status: 'Publicado', date: '17/06/2026' },
  { title: 'Liturgia Diária - 20/06', type: 'Artigo', author: 'Diác. Paulo', status: 'Rascunho', date: '16/06/2026' },
  { title: 'Terço da Misericórdia', type: 'Oração', author: 'Ir. Maria', status: 'Publicado', date: '15/06/2026' },
]

function statusClass(status: string) {
  switch (status) {
    case 'Publicado': return 'bg-emerald-100 text-emerald-700'
    case 'Revisão': return 'bg-amber-100 text-amber-700'
    case 'Rascunho': return 'bg-slate-100 text-slate-600'
    default: return 'bg-slate-100 text-slate-600'
  }
}
</script>

<template>
  <StCard padding="lg">
    <h3 class="font-serif text-lg font-semibold text-slate-900 mb-4">
      Atividades Recentes
    </h3>
    <div class="overflow-x-auto">
      <table class="w-full text-sm">
        <thead>
          <tr class="border-b border-slate-200 text-left text-slate-500">
            <th class="pb-3 font-medium">Título</th>
            <th class="pb-3 font-medium">Tipo</th>
            <th class="pb-3 font-medium">Autor</th>
            <th class="pb-3 font-medium">Status</th>
            <th class="pb-3 font-medium">Data</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(item, idx) in activities"
            :key="idx"
            class="border-b border-slate-100 last:border-0"
          >
            <td class="py-3 font-medium text-slate-800">{{ item.title }}</td>
            <td class="py-3 text-slate-500">{{ item.type }}</td>
            <td class="py-3 text-slate-500">{{ item.author }}</td>
            <td class="py-3">
              <span class="rounded-full px-2.5 py-0.5 text-xs font-medium" :class="statusClass(item.status)">
                {{ item.status }}
              </span>
            </td>
            <td class="py-3 text-slate-400">{{ item.date }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </StCard>
</template>