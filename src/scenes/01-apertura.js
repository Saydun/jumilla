// 01-apertura.js
// BLOQUE 1 · Apertura del presentador/a · Pulsaciones 1-2 (GUION_TECNICO.md).
//
//   step(1) · Puls. 1 · Título del evento
//     Fondo negro enriquecido. Dos líneas en Match bold, ambas en BLANCO, centradas en
//     pantalla. Las palabras entran una a una con stagger.
//   step(2) · Puls. 2 · Pantalla neutra
//     El título hace fade-out → pantalla limpia para que hable el presentador/a.
//     NO se muestra isotipo todavía: la marca aún no ha sido desvelada (eso ocurre en
//     el bloque 2.4). El isotipo solo puede aparecer después de la revelación.

import { gsap } from 'gsap';

export default {
  id: 'apertura',
  pulsaciones: 2,
  state: null,

  setup(stage /*, preloader */) {
    this.state = { stage, timelines: [] };
    stage.style.background = '';   // .apertura-root ya pinta el fondo de marca

    const root = document.createElement('div');
    root.className = 'apertura-root';
    stage.appendChild(root);
    this.state.root = root;

    // Bloque centrado con las dos líneas del título.
    const title = document.createElement('div');
    title.className = 'apertura-title';
    root.appendChild(title);
    this.state.title = title;

    const makeLine = (className, text) => {
      const p = document.createElement('p');
      p.className = className;
      text.split(' ').forEach((w, i) => {
        if (i > 0) p.appendChild(document.createTextNode(' '));
        const span = document.createElement('span');
        span.className = 'word';
        span.textContent = w;
        p.appendChild(span);
      });
      title.appendChild(p);
      return p;
    };

    this.state.line1 = makeLine('apertura-line1', 'Una marca para los');
    this.state.line2 = makeLine('apertura-line2', 'próximos 700 años');

    // Estado inicial: palabras hundidas + invisibles.
    this.state.words = Array.from(title.querySelectorAll('.word'));
    gsap.set(this.state.words, { autoAlpha: 0, y: 30 });
  },

  step(n) {
    switch (n) {
      case 1: return this.stepTitulo();
      case 2: return this.stepNeutra();
      default: return Promise.resolve();
    }
  },

  // Puls. 1 · Las 7 palabras entran con stagger (línea 1 → línea 2).
  stepTitulo() {
    const tl = gsap.timeline();
    tl.to(this.state.words, {
      autoAlpha: 1, y: 0, duration: 0.6, ease: 'power2.out', stagger: 0.12
    });
    this.state.timelines.push(tl);
    return tl.then();
  },

  // Puls. 2 · El título se apaga → pantalla limpia para que hable el presentador/a.
  // Sin isotipo: el aún-no-revelado se reserva para después del bloque 2.4.
  stepNeutra() {
    const tl = gsap.timeline();
    tl.to(this.state.title, { autoAlpha: 0, duration: 0.4, ease: 'power2.inOut' });
    this.state.timelines.push(tl);
    return tl.then();
  },

  teardown() {
    if (!this.state) return;
    this.state.timelines.forEach((t) => t.kill());
    this.state.stage.style.background = '';
    this.state = null;
  }
};
