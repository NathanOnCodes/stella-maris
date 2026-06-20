<script setup lang="ts">
definePageMeta({
  layout: false,
})

const email = ref('')
const password = ref('')
const loading = ref(false)
const error = ref('')

async function handleLogin() {
  loading.value = true
  error.value = ''

  try {
    await $fetch('/api/auth/sign-in', {
      method: 'POST',
      body: { email: email.value, password: password.value },
    })
    await navigateTo('/admin')
  }
  catch {
    error.value = 'Email ou senha inválidos. Verifique suas credenciais.'
  }
  finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="min-h-screen bg-gradient-to-br from-burgundy-900 via-burgundy-800 to-burgundy-700 flex items-center justify-center p-4">
    <StCard padding="lg" class="w-full max-w-md">
      <!-- Adicione aqui o logo de Nossa Senhora -->
      <div class="flex flex-col items-center gap-2 mb-8">
        <h1 class="font-serif text-3xl text-burgundy-800 tracking-wide">
          Regina Caeli
        </h1>
        <p class="text-slate-500 text-sm">Acesse sua conta</p>
      </div>

      <form class="flex flex-col gap-5" @submit.prevent="handleLogin">
        <StInput
          v-model="email"
          label="Email"
          type="email"
          placeholder="seu@email.com"
        >
          <template #icon>
            <UIcon name="i-lucide-mail" class="size-4" />
          </template>
        </StInput>

        <StInput
          v-model="password"
          label="Senha"
          type="password"
          placeholder="Sua senha"
        >
          <template #icon>
            <UIcon name="i-lucide-lock" class="size-4" />
          </template>
        </StInput>

        <div class="flex justify-end">
          <NuxtLink to="/recuperar-senha" class="text-sm text-burgundy-700 hover:text-burgundy-900 transition-colors">
            Esqueceu sua senha?
          </NuxtLink>
        </div>

        <p v-if="error" class="text-sm text-red-500 text-center">{{ error }}</p>

        <StButton type="submit" :loading="loading" class="w-full">
          Entrar
        </StButton>
      </form>

      <p class="mt-6 text-center text-sm text-slate-500">
        Não tem uma conta?
        <NuxtLink to="/cadastro" class="text-burgundy-700 hover:text-burgundy-900 font-medium transition-colors">
          Cadastre-se
        </NuxtLink>
      </p>
    </StCard>
  </div>
</template>