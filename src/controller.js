import { gsap } from 'gsap';

// Importar todas las escenas (irlas añadiendo conforme se vayan creando)
import escenaLoopRecepcion from './scenes/00-loop-recepcion.js';
import escenaPresentadora from './scenes/13-presentadora.js';
import escenaApertura from './scenes/01-apertura.js';
import escenaPorQueCambiar from './scenes/02-por-que-cambiar.js';
import escenaEncuestas from './scenes/03-encuestas.js';
import escenaManifiesto from './scenes/04-manifiesto.js';
import escenaRevelacionLogo from './scenes/05-revelacion-logo.js';
import escenaPaleta from './scenes/08-paleta.js';
import escenaTipografia from './scenes/09-tipografia.js';
import escenaIconografia from './scenes/10-iconografia.js';
import escenaAplicaciones from './scenes/11-aplicaciones.js';
import escenaBroche700 from './scenes/12-broche-700.js';
import escenaAlcaldesa from './scenes/06-alcaldesa.js';
import escenaCierre from './scenes/07-cierre.js';
// ... etc

export class Controller {
  constructor(preloader) {
    this.preloader = preloader;
    this.stage = document.getElementById('stage');
    // Escenas en orden de presentación. El loop de recepción (bloque 0) va PRIMERO:
    // arranca solo al cargar y queda en bucle hasta la primera pulsación, que avanza a
    // la revelación del logo (bloque 2.4). Se irán añadiendo las demás escenas.
    this.scenes = [
      escenaLoopRecepcion,
      escenaPresentadora,
      escenaApertura,
      escenaPorQueCambiar,
      escenaEncuestas,
      escenaManifiesto,
      escenaRevelacionLogo,
      escenaPaleta,
      escenaTipografia,
      escenaIconografia,
      escenaAplicaciones,
      escenaBroche700,
      escenaAlcaldesa,
      escenaCierre
    ];
    this.currentSceneIndex = 0;
    this.currentStep = 0;
    this.isTransitioning = false;
    this.debugVisible = false;
  }

  async init() {
    this.setupKeyboard();
    this.setupResize();
    this.fitStage();

    // Solo en dev (Vite elimina este bloque en `vite build`): expone helpers en
    // window para saltar a cualquier escena/pulsación desde la consola y soporta
    // navegación por hash de URL.
    if (import.meta.env.DEV) {
      this.setupDevShortcuts();
    }

    // Cargar la primera escena
    if (this.scenes.length > 0) {
      await this.enterScene(0);
    } else {
      this.showPlaceholder();
    }
  }

  // Helpers de desarrollo · solo se cargan en `npm run dev`.
  // Uso desde la consola del navegador:
  //   jumpTo(10, 7)               → escena 10 (aplicaciones), pulsación 7 (TEXTIL)
  //   jumpTo('aplicaciones', 7)   → mismo, por id
  // Uso por hash de URL:
  //   http://localhost:5173/#10/7
  setupDevShortcuts() {
    const sceneMap = this.scenes.reduce((acc, s, i) => { acc[s.id] = i; return acc; }, {});
    const jump = (sceneRef, step = 1) => {
      const idx = typeof sceneRef === 'string' ? sceneMap[sceneRef] : sceneRef;
      if (typeof idx !== 'number' || idx < 0 || idx >= this.scenes.length) {
        console.warn('[dev] jumpTo: escena no encontrada:', sceneRef);
        console.info('[dev] escenas disponibles:', Object.entries(sceneMap)
          .map(([id, i]) => `  ${i} · ${id} (${this.scenes[i].pulsaciones} puls)`).join('\n'));
        return;
      }
      this.jumpTo(idx, step);
    };
    window.jumpTo = jump;

    // Navegación por hash: #10/7 → escena 10, paso 7. #10 → escena 10, paso 1.
    const hashJump = () => {
      const m = window.location.hash.match(/^#(\w+)(?:\/(\d+))?$/);
      if (!m) return;
      const sceneRef = /^\d+$/.test(m[1]) ? parseInt(m[1], 10) : m[1];
      const step = m[2] ? parseInt(m[2], 10) : 1;
      jump(sceneRef, step);
    };
    window.addEventListener('hashchange', hashJump);
    // Si la URL ya trae hash al cargar, esperamos a que el controller acabe de montar
    // la escena 0 y luego saltamos.
    if (window.location.hash) setTimeout(hashJump, 100);

    console.info('%c[dev] jumpTo(sceneIndex, step) disponible en la consola.',
      'background:#85004D;color:#fff;padding:4px 8px;border-radius:3px');
    console.info('Escenas:\n' + Object.entries(sceneMap)
      .map(([id, i]) => `  ${String(i).padStart(2)} · ${id} (${this.scenes[i].pulsaciones} puls)`).join('\n'));
  }

  // Salta directo a cualquier escena/pulsación. Útil para desarrollo.
  // Nota: como cada step suele construir/mostrar su propia "página" y hacer cross-fade
  // con la anterior, saltar directo al paso N normalmente FUNCIONA sin haber pasado
  // por los previos. En las escenas que sí dependen de estado acumulado (alguna
  // animación de salida del paso N-1), el resultado puede ser estéticamente
  // "incompleto" pero suficiente para previsualizar.
  async jumpTo(sceneIndex, step = 1) {
    if (sceneIndex < 0 || sceneIndex >= this.scenes.length) return;
    this.isTransitioning = true;

    const fade = document.createElement('div');
    fade.style.cssText = 'position:absolute;inset:0;background:#000;opacity:0;z-index:999;';
    this.stage.appendChild(fade);
    await gsap.to(fade, { opacity: 1, duration: 0.25, ease: 'power2.inOut' });

    if (this.scenes[this.currentSceneIndex] && this.scenes[this.currentSceneIndex].teardown) {
      this.scenes[this.currentSceneIndex].teardown();
    }
    this.stage.innerHTML = '';
    this.stage.appendChild(fade);

    this.currentSceneIndex = sceneIndex;
    this.currentStep = step;
    const scene = this.scenes[sceneIndex];
    scene.setup(this.stage, this.preloader);

    await gsap.to(fade, { opacity: 0, duration: 0.25, ease: 'power2.inOut' });
    fade.remove();

    await scene.step(step);
    this.isTransitioning = false;
    this.updateDebug();
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

    scene.setup(this.stage, this.preloader);

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
