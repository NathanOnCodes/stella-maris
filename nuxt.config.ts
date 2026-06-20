export default defineNuxtConfig({
  compatibilityDate: '2025-06-20',

  modules: ['@nuxt/ui'],

  components: [
    { path: '~/components/base', pathPrefix: false },
    { path: '~/components/layout', pathPrefix: false },
    { path: '~/components/dashboard', pathPrefix: false },
    { path: '~/components/landing', pathPrefix: false },
  ],

  runtimeConfig: {
    betterAuthSecret: process.env.BETTER_AUTH_SECRET,
    databaseUrl: process.env.DATABASE_URL,
    betterAuthUrl: process.env.BETTER_AUTH_URL,
  },

  css: ['~/assets/css/main.css'],

  devtools: { enabled: true },
})
