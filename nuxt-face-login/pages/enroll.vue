<script setup lang="ts">
const username = ref('');
const captures = ref<number>(0);
const maxCaptures = 5;
const msg = ref<string | null>(null);

const { videoEl, loadModels, startCamera, stopCamera, captureDescriptor } = useFace();

onMounted(async () => { await loadModels(); await startCamera(); });
onBeforeUnmount(stopCamera);

async function captureAndSave() {
  msg.value = null;
  if (!username.value) { msg.value = 'Ingresá un nombre de usuario'; return; }
  const desc = await captureDescriptor();
  if (!desc) { msg.value = 'No se detectó rostro'; return; }
  await $fetch('/api/faces/enroll', {
    method: 'POST',
    body: { username: username.value, descriptor: desc }
  });
  captures.value++;
  if (captures.value >= maxCaptures) {
    msg.value = `¡Listo! Registradas ${maxCaptures} capturas. Podés iniciar sesión.`;
  } else {
    msg.value = `Captura ${captures.value}/${maxCaptures} guardada.`;
  }
}
</script>

<template>
  <div class="min-h-screen grid place-items-center p-6">
    <div class="w-full max-w-md space-y-4">
      <h1 class="text-2xl font-semibold">Registrar rostro</h1>
      <input class="w-full rounded-xl border px-3 py-2" v-model="username" placeholder="Usuario" />
      <video ref="videoEl" autoplay playsinline class="w-full rounded-xl shadow" />
      <button class="px-4 py-2 rounded-xl border" @click="captureAndSave" :disabled="captures>=maxCaptures">
        Guardar captura
      </button>
      <p v-if="msg">{{ msg }}</p>
      <p class="text-sm">Sugerencia: tomá capturas con leves variaciones (ángulo e iluminación).</p>
    </div>
  </div>
</template>
