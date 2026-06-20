<script setup lang="ts">
const publications = [
  {
    title: 'A Importância do Santo Rosário na Vida Cristã',
    excerpt: 'Descubra como a oração do rosário pode transformar sua vida espiritual e aproximar você de Nossa Senhora.',
    date: '19 de Junho de 2026',
    category: 'Artigos',
  },
  {
    title: 'Novena de Nossa Senhora Aparecida',
    excerpt: 'Participe da novena em preparação para a festa da padroeira do Brasil. Reze conosco estes nove dias.',
    date: '18 de Junho de 2026',
    category: 'Novenas',
  },
  {
    title: 'Oração da Manhã para Começar o Dia',
    excerpt: 'Uma oração especial para consagrar seu dia a Deus e pedir a proteção da Virgem Maria.',
    date: '17 de Junho de 2026',
    category: 'Orações',
  },
  {
    title: 'Liturgia Diária — 20 de Junho',
    excerpt: 'Leituras e reflexões do dia: primeira leitura, salmo responsorial e evangelho comentado.',
    date: '16 de Junho de 2026',
    category: 'Liturgia',
  },
  {
    title: 'Terço da Misericórdia — Como Rezar',
    excerpt: 'Guia completo para rezar o Terço da Misericórdia, com todas as orações e meditações.',
    date: '15 de Junho de 2026',
    category: 'Orações',
  },
  {
    title: 'História da Devoção a Stella Maris',
    excerpt: 'Conheça a origem da devoção a Nossa Senhora Estrela do Mar e seu significado para os navegantes.',
    date: '14 de Junho de 2026',
    category: 'Artigos',
  },
]
</script>

<template>
  <PublicLayout>
    <HeroSection />

    <section class="mx-auto max-w-6xl px-6 py-16">
      <div class="mb-10 text-center">
        <h2 class="font-serif text-3xl font-bold text-slate-900">
          Últimas Publicações
        </h2>
      </div>

      <div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <PublicationCard
          v-for="pub in publications"
          :key="pub.title"
          v-bind="pub"
        />
      </div>
    </section>

    <footer class="border-t border-cream-200 bg-cream-50 py-8 text-center text-sm text-slate-400">
      <p>&copy; 2026 — Para maior Glória de Deus</p>
    </footer>
  </PublicLayout>
</template>