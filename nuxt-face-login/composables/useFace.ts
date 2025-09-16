// composables/useFace.ts
let faceapi: any; // cache local del módulo

const MODELS_URL = '/models';

export function useFace() {
  const loading = ref(false);
  const stream = ref<MediaStream | null>(null);
  const videoEl = ref<HTMLVideoElement | null>(null);

  async function ensureFaceApi() {
  if (!process.client) return;
  if (!faceapi) {
    faceapi = await import('@vladmandic/face-api');
    // Forzar backend
    try {
      await faceapi.tf.setBackend('webgl');
    } catch {
      await faceapi.tf.setBackend('cpu');
    }
    await faceapi.tf.ready();
  }
}

  async function loadModels() {
    loading.value = true;
    await ensureFaceApi();
    await faceapi.nets.tinyFaceDetector.loadFromUri(MODELS_URL);
    await faceapi.nets.faceLandmark68Net.loadFromUri(MODELS_URL);
    await faceapi.nets.faceRecognitionNet.loadFromUri(MODELS_URL);
    loading.value = false;
  }

  async function startCamera() {
    await ensureFaceApi();
    stream.value = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
    if (videoEl.value) {
      (videoEl.value as any).srcObject = stream.value;
      await videoEl.value.play();
    }
  }

  function stopCamera() {
    stream.value?.getTracks().forEach(t => t.stop());
    stream.value = null;
  }

  async function captureDescriptor(): Promise<number[] | null> {
    if (!videoEl.value) return null;
    await ensureFaceApi();
    const det = await faceapi
      .detectSingleFace(videoEl.value, new faceapi.TinyFaceDetectorOptions())
      .withFaceLandmarks()
      .withFaceDescriptor();
    return det ? Array.from(det.descriptor) : null;
  }

  return { loading, videoEl, loadModels, startCamera, stopCamera, captureDescriptor };
}
