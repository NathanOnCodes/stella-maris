<template>
  <div class="min-h-screen bg-ice-100">
    <AdminSidebar />
    <div class="ml-60 flex flex-col min-h-screen">
      <AdminTopbar />
      <main class="flex-1 p-6">
        <slot />
      </main>
    </div>
  </div>
</template>