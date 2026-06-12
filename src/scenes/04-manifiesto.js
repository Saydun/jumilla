// 04-manifiesto.js
// BLOQUE 2.3 · Manifiesto · Pulsaciones 13-14 (GUION_TECNICO.md).
//
// Composición compacta y TODO EN BLANCO sobre fondo negro enriquecido. Los resaltes van
// por NEGRITA (no por color Monastrell — sobre negro pierde nitidez en la LED de 8×3 m).
//
//   step(1) · Puls. 13 · Síntesis verbal · 2 LÍNEAS.
//     L1 (Match Regular 48): "La ciudadanía nos pidió una marca elegante por fuera y
//     cercana por dentro."
//     L2 (Match Bold 64): "Una marca de la que sentirse orgullosos."
//   step(2) · Puls. 14 · Posicionamiento · 2 LÍNEAS.
//     L1 (Match Regular 52): "Por eso construimos una marca turística"
//     L2 (Match Bold 70): "para el destino vinícola más antiguo de España."

import { gsap } from 'gsap';

export default {
  id: 'manifiesto',
  pulsaciones: 2,
  state: null,

  setup(stage /*, preloader */) {
    this.state = { stage, timelines: [] };
    stage.style.background = '';

    const root = document.createElement('div');
    root.className = 'man-root';
    stage.appendChild(root);
    this.state.root = root;

    const mkLine = (parent, text, sizeClass) => {
      const p = document.createElement('p');
      p.className = 'man-line ' + sizeClass;
      p.textContent = text;
      parent.appendChild(p);
      return p;
    };

    // ---- Puls. 13 · Síntesis · 2 líneas ----
    const sint = document.createElement('div');
    sint.className = 'man-page';
    root.appendChild(sint);
    this.state.sint = sint;

    const s1 = mkLine(sint, 'La ciudadanía nos pidió una marca elegante por fuera y cercana por dentro.', 'is-sint-l1');
    const s2 = mkLine(sint, 'Una marca de la que sentirse orgullosos.', 'is-sint-l2');
    this.state.sintLines = [s1, s2];
    gsap.set([s1, s2], { autoAlpha: 0, y: 24 });

    // ---- Puls. 14 · Posicionamiento · 2 líneas (oculto hasta su turno) ----
    const pos = document.createElement('div');
    pos.className = 'man-page';
    root.appendChild(pos);
    gsap.set(pos, { autoAlpha: 0 });
    this.state.pos = pos;

    const p1 = mkLine(pos, 'Por eso construimos una marca turística', 'is-pos-l1');
    const p2 = mkLine(pos, 'para el destino vinícola más antiguo de España.', 'is-pos-l2');
    this.state.posLines = [p1, p2];
    gsap.set([p1, p2], { autoAlpha: 0, y: 32 });
  },

  step(n) {
    switch (n) {
      case 1: return this.stepSintesis();
      case 2: return this.stepPosicionamiento();
      default: return Promise.resolve();
    }
  },

  // Puls. 13 · Las 2 líneas entran con stagger 0.3 s. Jerarquía por peso (L1 regular,
  // L2 bold) y por tamaño (L2 más grande para rematar con "sentirse orgullosos.").
  stepSintesis() {
    const tl = gsap.timeline();
    tl.to(this.state.sintLines, {
      autoAlpha: 1, y: 0, duration: 0.8, ease: 'power2.out', stagger: 0.3
    }, 0);
    this.state.timelines.push(tl);
    return tl.then();
  },

  // Puls. 14 · Cross-fade de la síntesis a las 2 líneas de posicionamiento.
  stepPosicionamiento() {
    const tl = gsap.timeline();
    tl.to(this.state.sint, { autoAlpha: 0, duration: 0.4, ease: 'power2.inOut' }, 0);
    tl.set(this.state.pos, { autoAlpha: 1 }, 0.4);
    tl.to(this.state.posLines, {
      autoAlpha: 1, y: 0, duration: 0.8, ease: 'power2.out', stagger: 0.3
    }, 0.4);
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
