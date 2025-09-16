<script setup lang="ts">
const me = await $fetch<{ username?: string }>('/api/auth/me', { credentials: 'include' });

async function logout() {
  await $fetch('/api/auth/logout', { method: 'POST', credentials: 'include' });
  await navigateTo('/login');
}
</script>

<template>
  <div class="min-h-screen p-8">
    <header class="flex items-center justify-between mb-8">
      <h1 class="text-2xl font-semibold">Bienvenido/a, {{ me?.username || 'Usuario' }}</h1>
      <button class="px-3 py-2 rounded-xl border" @click="logout">Salir</button>
    </header>
    <main>
      <p>Ésta es la landing privada de tu app.</p>
    </main>
  </div>
</template>
