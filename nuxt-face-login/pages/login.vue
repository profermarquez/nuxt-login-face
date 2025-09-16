<script setup lang="ts">
const { videoEl, loadModels, startCamera, stopCamera, captureDescriptor } = useFace();
const loading = ref(false);
const error = ref<string | null>(null);

onMounted(async () => {
  await loadModels();
  await startCamera();
});
onBeforeUnmount(stopCamera);

async function doLogin() {
  error.value = null;
  loading.value = true;
  const desc = await captureDescriptor();
  if (!desc) { error.value = 'No se detectó rostro'; loading.value = false; return; }
  try {
    await $fetch('/api/auth/login', {
      method: 'POST',
      body: { descriptor: desc },
      credentials: 'include'
    });
    await navigateTo('/');
  } catch (e: any) {
    error.value = e?.data?.message || 'Error de login';
  } finally {
    loading.value = false;
  }
}
</script>

<template>
  <div class="min-h-screen grid place-items-center p-6">
    <div class="w-full max-w-md space-y-4">
      <h1 class="text-2xl font-semibold">Ingresar con tu rostro</h1>
      <video ref="videoEl" autoplay playsinline class="w-full rounded-xl shadow" />
      <button class="px-4 py-2 rounded-xl border" :disabled="loading" @click="doLogin">
        {{ loading ? 'Verificando...' : 'Ingresar' }}
      </button>
      <p v-if="error" class="text-red-600">{{ error }}</p>
      <p class="text-sm">
        ¿Aún no registraste tu rostro?
        <NuxtLink class="underline" to="/enroll">Ir al registro</NuxtLink>
      </p>
    </div>
  </div>
</template>
