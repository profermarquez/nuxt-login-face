# Nuxt Minimal Starter

Look at the [Nuxt documentation](https://nuxt.com/docs/getting-started/introduction) to learn more.

## Setup

Make sure to install dependencies:

# 1) Crear proyecto
npx nuxi@latest init nuxt-face-login
cd nuxt-face-login

# 2) Instalar dependencias
npm i

# 3) Paquetes necesarios (visión + estado + utilidades + JWT)
npm i @vladmandic/face-api @pinia/nuxt @vueuse/core jose

# 4) (Opcional) Tailwind para estilos rápidos
npm i -D @nuxtjs/tailwindcss

# 5) Crear carpeta para modelos de face-api
mkdir -p public/models

npm i -D @nuxtjs/tailwindcss tailwindcss postcss autoprefixer
npm i @vueuse/nuxt

# desde Powershell
# Ejecutá esto en PowerShell desde la raíz del proyecto
$ErrorActionPreference = "Stop"
$ProgressPreference = "SilentlyContinue"

# Asegura TLS moderno (por si tu PS es viejo)
[Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12

# Carpeta de destino
$base = "public/models"
New-Item -ItemType Directory -Force -Path $base | Out-Null

# Manifests a descargar
$urls = @(
  "https://cdn.jsdelivr.net/npm/@vladmandic/face-api/model/tiny_face_detector_model-weights_manifest.json",
  "https://cdn.jsdelivr.net/npm/@vladmandic/face-api/model/face_landmark_68_model-weights_manifest.json",
  "https://cdn.jsdelivr.net/npm/@vladmandic/face-api/model/face_recognition_model-weights_manifest.json"
)

# 1) Descargar manifests
foreach ($u in $urls) {
  $dest = Join-Path $base (Split-Path $u -Leaf)
  Invoke-WebRequest $u -OutFile $dest
}

# 2) Leer cada manifest y bajar sus .bin
Get-ChildItem $base -Filter "*weights_manifest.json" | ForEach-Object {
  $manifest = Get-Content $_.FullName | ConvertFrom-Json
  foreach ($w in $manifest.weights) {
    foreach ($p in $w.paths) {
      $binUrl = "https://cdn.jsdelivr.net/npm/@vladmandic/face-api/model/$p"
      $out = Join-Path $base $p
      $outDir = Split-Path $out -Parent
      New-Item -ItemType Directory -Force -Path $outDir | Out-Null
      Invoke-WebRequest $binUrl -OutFile $out
    }
  }
}

Write-Host "✅ Modelos listos en $base"

## Development Server

Start the development server on `http://localhost:3000`:

```bash
# npm
npm run dev

# pnpm
pnpm dev

# yarn
yarn dev

# bun
bun run dev
```

## Production

Build the application for production:

```bash
# npm
npm run build

# pnpm
pnpm build

# yarn
yarn build

# bun
bun run build
```

Locally preview production build:

```bash
# npm
npm run preview

# pnpm
pnpm preview

# yarn
yarn preview

# bun
bun run preview
```

Check out the [deployment documentation](https://nuxt.com/docs/getting-started/deployment) for more information.
