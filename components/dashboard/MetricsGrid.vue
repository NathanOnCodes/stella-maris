<template>
  <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
    <MetricCard
      title="Artigos"
      value="1.247"
      icon="i-lucide-file-text"
      trend="+12% este mês"
      :trend-up="true"
    />
    <MetricCard
      title="Orações"
      value="856"
      icon="i-lucide-book-open"
      trend="+8% este mês"
      :trend-up="true"
    />
    <MetricCard
      title="Novenas"
      value="432"
      icon="i-lucide-calendar-heart"
      trend="+3% este mês"
      :trend-up="true"
    />
    <MetricCard
      title="Assinantes"
      value="3.892"
      icon="i-lucide-users"
      trend="-2% este mês"
      :trend-up="false"
    />
  </div>
</template>