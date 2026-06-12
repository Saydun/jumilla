# SETUP INICIAL · Cómo arrancar el proyecto desde cero

> Este documento es la guía paso a paso para crear toda la estructura del proyecto desde cero. Claude Code debe seguir estos pasos en orden la primera vez que abra el proyecto vacío.

---

## 📋 Paso 0 · Verificación previa

Antes de empezar, comprobar que están disponibles:

- [ ] Node.js 18+ instalado (`node --version`)
- [ ] npm instalado (`npm --version`)
- [ ] Carpeta `/assets/logo/` con los SVG: `JU.svg`, `MI.svg`, `LLA.svg`, `SLOGAN.svg`, `BOTELLA.svg`, `CASTILLO.svg`, `UVAS.svg`, `PATRON.svg`, `LOGO_COMPLETO_JUMILLA_TURISMO.svg`, `LOGO_COMPLETO_BLANCO.svg`, `LOGO_HORIZONTAL.svg`, `LOGO_ISOTIPO.svg`
- [ ] Carpeta `/assets/fonts/Match/` con archivos de la fuente Match
- [ ] Carpeta `/assets/fonts/Bebas Neue/` con archivos de Bebas Neue

Si falta algún asset, pedírselo a Victoria antes de continuar.

---

## 📦 Paso 1 · Inicializar el proyecto

```bash
# En la raíz del proyecto
npm init -y
npm install vite gsap
npm install --save-dev @types/node

# Añadir scripts en package.json
```

Editar `package.json` y añadir en la sección de scripts:

```json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview --port 5174"
  }
}
```

---

## 📄 Paso 2 · Crear `vite.config.js`

```javascript
import { defineConfig } from 'vite';

export default defineConfig({
  root: '.',
  base: './',
  publicDir: 'assets',
  build: {
    outDir: 'dist',
    assetsInlineLimit: 0,    // no inlinear assets, siempre archivos
    rollupOptions: {
      output: {
        manualChunks: undefined
      }
    }
  },
  server: {
    port: 5173,
    open: true
  }
});
```

---

## 📄 Paso 3 · Crear `index.html`

```html
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Jumilla · Capital de la Monastrell</title>
  <link rel="stylesheet" href="/src/styles/variables.css" />
  <link rel="stylesheet" href="/src/styles/base.css" />
  <link rel="stylesheet" href="/src/styles/scenes.css" />
</head>
<body>
  <div id="loader">
    <div class="loader-text">Cargando…</div>
    <div class="loader-bar"><div class="loader-bar-fill"></div></div>
  </div>

  <div id="stage-container">
    <div id="stage"></div>
  </div>

  <div id="debug-overlay" class="hidden">
    <span id="debug-scene">-</span> · <span id="debug-step">-</span>
  </div>

  <script type="module" src="/src/main.js"></script>
</body>
</html>
```

---

## 🎨 Paso 4 · Crear los archivos de estilos

### `/src/styles/variables.css`

```css
:root {
  /* Paleta oficial de marca */
  --monastrell:         #85004D;
  --azul-heraldico:     #1B5C9D;
  --purpura-profundo:   #54334C;
  --verde-envero:       #428C42;
  --negro-enriquecido:  #121212;

  /* Auxiliares */
  --blanco:             #FFFFFF;
  --crema-suave:        #F7F1EC;
  --negro-puro:         #000000;
}

/* Tipografía Match */
@font-face {
  font-family: 'Match';
  src: url('/fonts/Match/Match-Regular.woff2') format('woff2');
  font-weight: 400;
  font-style: normal;
  font-display: block;
}

@font-face {
  font-family: 'Match';
  src: url('/fonts/Match/Match-Bold.woff2') format('woff2');
  font-weight: 700;
  font-style: normal;
  font-display: block;
}

/* Tipografía Bebas Neue */
@font-face {
  font-family: 'Bebas Neue';
  src: url('/fonts/Bebas Neue/BebasNeue-Regular.woff2') format('woff2');
  font-weight: 400;
  font-style: normal;
  font-display: block;
}

@font-face {
  font-family: 'Bebas Neue';
  src: url('/fonts/Bebas Neue/BebasNeue-Bold.woff2') format('woff2');
  font-weight: 700;
  font-style: normal;
  font-display: block;
}
```

> **NOTA**: Ajustar los nombres de los archivos de fuente al formato real recibido. Si vienen en TTF u OTF, convertirlos previamente a WOFF2 (`brew install woff2` y `woff2_compress fuente.ttf`). Si solo hay un archivo por familia, eliminar la versión bold.

### `/src/styles/base.css`

```css
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html, body {
  width: 100%;
  height: 100%;
  background: var(--negro-puro);
  overflow: hidden;
  font-family: 'Match', sans-serif;
  color: var(--blanco);
}

body.is-fullscreen {
  cursor: none;
}

/* Loader */
#loader {
  position: fixed;
  inset: 0;
  background: var(--negro-puro);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  transition: opacity 0.5s ease;
}

#loader.hidden {
  opacity: 0;
  pointer-events: none;
}

.loader-text {
  font-family: 'Bebas Neue', sans-serif;
  color: var(--monastrell);
  font-size: 32px;
  letter-spacing: 0.2em;
  margin-bottom: 32px;
}

.loader-bar {
  width: 320px;
  height: 4px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 2px;
  overflow: hidden;
}

.loader-bar-fill {
  width: 0%;
  height: 100%;
  background: var(--monastrell);
  transition: width 0.3s ease;
}

/* Stage container con escalado para pantallas no 2048x768 */
#stage-container {
  width: 100vw;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--negro-puro);
}

#stage {
  width: 2048px;
  height: 768px;
  position: relative;
  overflow: hidden;
  background: var(--negro-enriquecido);
  transform-origin: center center;
  /* el transform: scale() lo aplica controller.js dinámicamente */
}

/* Debug overlay */
#debug-overlay {
  position: fixed;
  bottom: 16px;
  right: 16px;
  background: rgba(0, 0, 0, 0.7);
  color: var(--monastrell);
  font-family: 'Bebas Neue', sans-serif;
  font-size: 16px;
  padding: 8px 16px;
  border-radius: 4px;
  z-index: 999;
  letter-spacing: 0.1em;
}

#debug-overlay.hidden {
  display: none;
}
```

### `/src/styles/scenes.css`

Vacío inicialmente. Cada escena añadirá sus estilos aquí o en archivos separados que se importarán.

---

## 🚀 Paso 5 · Crear el punto de entrada `/src/main.js`

```javascript
import { gsap } from 'gsap';
import { Controller } from './controller.js';
import { Preloader } from './preloader.js';

// Lista de assets a precargar
const ASSETS = {
  fonts: ['Match', 'Bebas Neue'],
  svgs: [
    '/logo/JU.svg',
    '/logo/MI.svg',
    '/logo/LLA.svg',
    '/logo/SLOGAN.svg',
    '/logo/BOTELLA.svg',
    '/logo/CASTILLO.svg',
    '/logo/UVAS.svg',
    '/logo/PATRON.svg',
    '/logo/LOGO_COMPLETO_JUMILLA_TURISMO.svg',
    '/logo/LOGO_COMPLETO_BLANCO.svg',
    '/logo/LOGO_HORIZONTAL.svg',
    '/logo/LOGO_ISOTIPO.svg'
  ]
};

async function init() {
  const preloader = new Preloader(ASSETS);
  await preloader.load((progress) => {
    document.querySelector('.loader-bar-fill').style.width = `${progress * 100}%`;
  });

  // Esperar 300ms para que la última actualización se vea
  await new Promise(r => setTimeout(r, 300));

  // Ocultar loader
  document.getElementById('loader').classList.add('hidden');

  // Inicializar controller con todas las escenas
  const controller = new Controller(preloader);
  await controller.init();
}

init();
```

---

## 🎬 Paso 6 · Crear `/src/preloader.js`

```javascript
export class Preloader {
  constructor(assets) {
    this.assets = assets;
    this.svgs = new Map();
  }

  async load(onProgress) {
    const totalSteps = this.assets.svgs.length + 1; // +1 por las fuentes
    let completedSteps = 0;

    const updateProgress = () => {
      completedSteps++;
      onProgress(completedSteps / totalSteps);
    };

    // Esperar a que las fuentes estén listas
    await document.fonts.ready;
    updateProgress();

    // Precargar todos los SVG como texto
    for (const path of this.assets.svgs) {
      const response = await fetch(path);
      const text = await response.text();
      this.svgs.set(path, text);
      updateProgress();
    }
  }

  getSVG(path) {
    return this.svgs.get(path);
  }
}
```

---

## 🎮 Paso 7 · Crear `/src/controller.js`

```javascript
import { gsap } from 'gsap';

// Importar todas las escenas (irlas añadiendo conforme se vayan creando)
// import escenaRecepcion from './scenes/00-loop-recepcion.js';
// import escenaApertura from './scenes/01-apertura.js';
// ... etc

export class Controller {
  constructor(preloader) {
    this.preloader = preloader;
    this.stage = document.getElementById('stage');
    this.scenes = [];           // se cargarán las escenas aquí
    this.currentSceneIndex = 0;
    this.currentStep = 0;
    this.isTransitioning = false;
    this.debugVisible = false;
  }

  async init() {
    this.setupKeyboard();
    this.setupResize();
    this.fitStage();

    // Cargar la primera escena
    if (this.scenes.length > 0) {
      await this.enterScene(0);
    } else {
      this.showPlaceholder();
    }
  }

  showPlaceholder() {
    this.stage.innerHTML = `
      <div style="
        position: absolute;
        inset: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-direction: column;
        color: var(--monastrell);
        font-family: 'Bebas Neue', sans-serif;
      ">
        <div style="font-size: 56px; letter-spacing: 0.1em;">JUMILLA</div>
        <div style="font-size: 28px; opacity: 0.7; margin-top: 16px;">CAPITAL DE LA MONASTRELL</div>
        <div style="font-size: 18px; opacity: 0.4; margin-top: 64px;">Esperando escenas registradas…</div>
      </div>
    `;
  }

  setupKeyboard() {
    document.addEventListener('keydown', (e) => {
      if (this.isTransitioning) return;

      switch(e.key) {
        case 'ArrowRight':
        case ' ':           // tecla espacio también avanza (por compatibilidad con algunos clickers)
          this.advance();
          break;
        case 'ArrowLeft':
          this.retreat();
          break;
        case 'f':
        case 'F':
          this.toggleFullscreen();
          break;
        case 'r':
        case 'R':
          this.restart();
          break;
        case 'd':
        case 'D':
          this.toggleDebug();
          break;
      }
    });
  }

  setupResize() {
    window.addEventListener('resize', () => this.fitStage());
  }

  fitStage() {
    const containerW = window.innerWidth;
    const containerH = window.innerHeight;
    const stageW = 2048;
    const stageH = 768;

    const scaleX = containerW / stageW;
    const scaleY = containerH / stageH;
    const scale = Math.min(scaleX, scaleY);

    this.stage.style.transform = `scale(${scale})`;
  }

  async advance() {
    if (this.scenes.length === 0) return;

    const scene = this.scenes[this.currentSceneIndex];
    this.currentStep++;

    if (this.currentStep > scene.pulsaciones) {
      // Cambiar a la siguiente escena
      await this.enterScene(this.currentSceneIndex + 1);
    } else {
      await scene.step(this.currentStep);
      this.updateDebug();
    }
  }

  async retreat() {
    // implementación básica de retroceso (solo para ensayos)
    // recomendado: reiniciar la escena actual desde el principio
    if (this.scenes.length === 0) return;
    if (this.currentStep > 1) {
      await this.enterScene(this.currentSceneIndex);
    } else if (this.currentSceneIndex > 0) {
      await this.enterScene(this.currentSceneIndex - 1);
    }
  }

  async enterScene(index) {
    if (index >= this.scenes.length) {
      console.log('Fin de la presentación');
      return;
    }

    this.isTransitioning = true;

    // Cross-fade negro
    const fade = document.createElement('div');
    fade.style.cssText = `
      position: absolute; inset: 0; background: #000;
      opacity: 0; z-index: 999;
    `;
    this.stage.appendChild(fade);

    await gsap.to(fade, { opacity: 1, duration: 0.4, ease: 'power2.inOut' });

    // Teardown escena anterior
    if (this.scenes[this.currentSceneIndex] && this.scenes[this.currentSceneIndex].teardown) {
      this.scenes[this.currentSceneIndex].teardown();
    }

    // Limpiar stage
    this.stage.innerHTML = '';
    this.stage.appendChild(fade);

    // Cargar nueva escena
    this.currentSceneIndex = index;
    this.currentStep = 1;
    const scene = this.scenes[index];

    scene.setup(this.stage);

    // Fade out negro
    await gsap.to(fade, { opacity: 0, duration: 0.4, ease: 'power2.inOut' });
    fade.remove();

    // Primer step de la escena
    await scene.step(1);

    this.isTransitioning = false;
    this.updateDebug();
  }

  async restart() {
    this.currentSceneIndex = 0;
    this.currentStep = 0;
    await this.enterScene(0);
  }

  toggleFullscreen() {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      document.body.classList.add('is-fullscreen');
    } else {
      document.exitFullscreen();
      document.body.classList.remove('is-fullscreen');
    }
  }

  toggleDebug() {
    this.debugVisible = !this.debugVisible;
    document.getElementById('debug-overlay').classList.toggle('hidden', !this.debugVisible);
    this.updateDebug();
  }

  updateDebug() {
    if (!this.debugVisible) return;
    const scene = this.scenes[this.currentSceneIndex];
    document.getElementById('debug-scene').textContent = scene ? scene.id : '-';
    document.getElementById('debug-step').textContent = `${this.currentStep}/${scene ? scene.pulsaciones : '?'}`;
  }
}
```

---

## 📊 Paso 8 · Crear `/src/data/encuestas.json`

```json
{
  "muestra": 417,
  "color_vino": 52.37,
  "castillo": 42.59,
  "estilo_elegante": 63,
  "logo_anterior": 9.78,
  "orgullo": 59.94,
  "metadata": {
    "fecha_estudio": "Octubre-Noviembre 2025",
    "metodologia": "Encuestas a pie de calle"
  }
}
```

---

## ✅ Paso 9 · Probar que todo arranca

```bash
npm run dev
```

Debería abrirse el navegador en `http://localhost:5173` con:
1. Una pantalla de carga en Monastrell que se llena.
2. Una pantalla placeholder con "JUMILLA · CAPITAL DE LA MONASTRELL · Esperando escenas registradas…"

Si esto funciona, la infraestructura está lista para empezar a implementar escenas.

---

## 🎬 Paso 10 · Implementar la primera escena (recomendación: Bloque 2.4 · Revelación logo)

El motivo de empezar por la revelación del logo es que es el bloque más complejo técnicamente. Si funciona, los demás son variaciones más simples del mismo patrón.

Crear `/src/scenes/05-revelacion-logo.js` siguiendo el patrón del módulo de escena documentado en `CLAUDE.md`.

Las pulsaciones a implementar son las 15-21 del guion (`GUION_TECNICO.md`, bloque 2.4).

Después, registrar la escena en `controller.js`:

```javascript
import escenaRevelacionLogo from './scenes/05-revelacion-logo.js';

// En el constructor del Controller:
this.scenes = [
  escenaRevelacionLogo,
  // ... resto de escenas conforme se vayan creando
];
```

---

## 🆘 Si algo no funciona

1. Verificar que las fuentes están en formato WOFF2 y los nombres en `variables.css` coinciden con los archivos reales.
2. Verificar que los SVG están accesibles abriendo `http://localhost:5173/logo/JU.svg` en el navegador.
3. Abrir las DevTools (F12) y revisar la consola por errores.
4. Si las fuentes no cargan, comprobar el path absoluto vs relativo (`/fonts/` vs `./fonts/`).

---

*Documento generado para Claude Code · Última actualización: mayo 2026.*
