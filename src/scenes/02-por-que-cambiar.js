// 02-por-que-cambiar.js
// BLOQUE 2.1 · Por qué cambiar · Pulsaciones 3-4 (GUION_TECNICO.md).
//
//   step(1) · Puls. 3 · Pregunta de apertura
//     Tres líneas Match 180 bold apiladas alineadas a la izquierda dentro de un bloque
//     centrado: "¿Por qué" (blanco) / "cambia" (Monastrell) / "Jumilla su marca?" (blanco).
//     Las líneas 1 y 3 entran palabra a palabra con stagger; la línea 2 entra con un
//     scale especial (0.7 → 1, back.out) para enfatizar el verbo.
//   step(2) · Puls. 4 · Diagnóstico de partida
//     Cross-fade: la pregunta hace fade-out hacia arriba y entran tres líneas centradas
//     "Porque / su gente / nos lo ha pedido." con "su gente" en Monastrell 220 y un
//     subrayado Monastrell que se dibuja de izquierda a derecha tras aparecer la línea.

import { gsap } from 'gsap';

export default {
  id: 'por-que-cambiar',
  pulsaciones: 2,
  state: null,

  setup(stage /*, preloader */) {
    this.state = { stage, timelines: [] };
    stage.style.background = '';

    const root = document.createElement('div');
    root.className = 'pq-root';
    stage.appendChild(root);
    this.state.root = root;

    // ----- Puls. 3 · Pregunta · 2 LÍNEAS -----
    // Línea 1: "¿Por qué cambia" (con "cambia" inline en Monastrell + scale back.out).
    // Línea 2: "Jumilla su marca?" (palabras con stagger).
    const pregunta = document.createElement('div');
    pregunta.className = 'pq-pregunta';
    root.appendChild(pregunta);
    gsap.set(pregunta, { xPercent: -50, yPercent: -50 });
    this.state.pregunta = pregunta;

    // Línea 1 — "¿Por qué" (palabras) + "cambia" (span aparte para escalar).
    const line1 = document.createElement('p');
    line1.className = 'pq-line';
    '¿Por qué'.split(' ').forEach((w, i) => {
      if (i > 0) line1.appendChild(document.createTextNode(' '));
      const span = document.createElement('span');
      span.className = 'word';
      span.textContent = w;
      line1.appendChild(span);
    });
    line1.appendChild(document.createTextNode(' '));
    const cambia = document.createElement('span');
    cambia.className = 'pq-cambia';
    cambia.textContent = 'cambia';
    line1.appendChild(cambia);
    pregunta.appendChild(line1);
    this.state.cambia = cambia;

    // Línea 2 — "Jumilla su marca?" (palabras con stagger).
    const line2 = document.createElement('p');
    line2.className = 'pq-line';
    'Jumilla su marca?'.split(' ').forEach((w, i) => {
      if (i > 0) line2.appendChild(document.createTextNode(' '));
      const span = document.createElement('span');
      span.className = 'word';
      span.textContent = w;
      line2.appendChild(span);
    });
    pregunta.appendChild(line2);

    this.state.line1Words = Array.from(line1.querySelectorAll('.word'));
    this.state.line2Words = Array.from(line2.querySelectorAll('.word'));

    // Estado inicial puls. 3: palabras invisibles+hundidas; "cambia" además escalada.
    gsap.set([...this.state.line1Words, ...this.state.line2Words], { autoAlpha: 0, y: 30 });
    gsap.set(cambia, { autoAlpha: 0, scale: 0.7, transformOrigin: '50% 50%' });

    // ----- Puls. 4 · Diagnóstico · 2 LÍNEAS (oculto hasta su turno) -----
    // Línea 1: "Porque su gente" (con "su gente" inline Monastrell + subrayado).
    // Línea 2: "nos lo ha pedido."
    const respuesta = document.createElement('div');
    respuesta.className = 'pq-respuesta';
    root.appendChild(respuesta);
    gsap.set(respuesta, { xPercent: -50, yPercent: -50, autoAlpha: 0 });
    this.state.respuesta = respuesta;

    // Línea 1.
    const rLine1 = document.createElement('p');
    rLine1.className = 'pq-line';
    rLine1.appendChild(document.createTextNode('Porque '));
    const suGenteWrap = document.createElement('span');
    suGenteWrap.className = 'pq-su-gente-wrap';
    const suGente = document.createElement('span');
    suGente.className = 'pq-su-gente';
    suGente.textContent = 'su gente';
    const underline = document.createElement('span');
    underline.className = 'pq-underline';
    suGenteWrap.appendChild(suGente);
    suGenteWrap.appendChild(underline);
    rLine1.appendChild(suGenteWrap);
    respuesta.appendChild(rLine1);

    // Línea 2.
    const rLine2 = document.createElement('p');
    rLine2.className = 'pq-line';
    rLine2.textContent = 'nos lo ha pedido.';
    respuesta.appendChild(rLine2);

    this.state.rLine1 = rLine1;
    this.state.rLine2 = rLine2;
    this.state.underline = underline;

    // Estado inicial puls. 4: líneas invisibles+hundidas; subrayado colapsado en su ancho.
    gsap.set([rLine1, rLine2], { autoAlpha: 0, y: 20 });
    gsap.set(underline, { scaleX: 0 });
  },

  step(n) {
    switch (n) {
      case 1: return this.stepPregunta();
      case 2: return this.stepDiagnostico();
      default: return Promise.resolve();
    }
  },

  // Puls. 3 · Línea 1 palabras "¿Por qué" → "cambia" scale back.out → Línea 2 palabras.
  stepPregunta() {
    const tl = gsap.timeline();
    tl.to(this.state.line1Words, {
      autoAlpha: 1, y: 0, duration: 0.6, ease: 'power2.out', stagger: 0.12
    }, 0);
    tl.to(this.state.cambia, {
      autoAlpha: 1, scale: 1, duration: 0.8, ease: 'back.out(1.7)'
    }, 0.5);
    tl.to(this.state.line2Words, {
      autoAlpha: 1, y: 0, duration: 0.6, ease: 'power2.out', stagger: 0.12
    }, 1.1);
    this.state.timelines.push(tl);
    return tl.then();
  },

  // Puls. 4 · Salida pregunta + entrada respuesta (2 líneas) + subrayado en "su gente".
  stepDiagnostico() {
    const tl = gsap.timeline();
    // Salida de la pregunta hacia arriba.
    tl.to(this.state.pregunta, {
      autoAlpha: 0, y: -20, duration: 0.4, ease: 'power2.inOut'
    }, 0);
    // Entrada de la respuesta · 2 líneas con stagger.
    tl.set(this.state.respuesta, { autoAlpha: 1 }, 0.4);
    tl.to([this.state.rLine1, this.state.rLine2], {
      autoAlpha: 1, y: 0, duration: 0.6, ease: 'power2.out', stagger: 0.25
    }, 0.4);
    // Subrayado Monastrell bajo "su gente" (scaleX 0 → 1 desde la izquierda).
    tl.to(this.state.underline, {
      scaleX: 1, duration: 0.7, ease: 'power2.out'
    }, 0.4 + 0.6);
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
