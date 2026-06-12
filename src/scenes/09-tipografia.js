// 09-tipografia.js
// BLOQUE 2.6 · Tipografía · Pulsaciones 37-41 (GUION_TECNICO.md).
//
//   step(1) · Puls. 37 · Intro
//     "Una arquitectura / tipográfica." Match 120 reg + Match 170 bold, blanco, stagger.
//   step(2) · Puls. 38 · Match
//     "J" gigante (Match 600 bold) a la izquierda + ficha (nombre, rol, descripción).
//   step(3) · Puls. 39 · Abecedario Match
//     Dos filas A-M / N-Ñ-O-Z + fila de dígitos 0-9, letra a letra con stagger rápido.
//   step(4) · Puls. 40 · Bebas Neue
//     Ficha (nombre, rol, descripción) a la izquierda + 3 palabras a la derecha con
//     jerarquía por tamaño (CAPITAL 200, ELEGANCIA 140, PATRIMONIO 100).
//   step(5) · Puls. 41 · Jerarquía editorial
//     Composición editorial centrada: kicker / titular Match 180 / subtítulo Match 90 /
//     body Bebas con stagger desde arriba.
//
// Fondo NEGRO ENRIQUECIDO en todas las páginas, todo el texto BLANCO. Sin Monastrell.

import { gsap } from 'gsap';

const ABC_ROW_1 = ['A','B','C','D','E','F','G','H','I','J','K','L','M'];
const ABC_ROW_2 = ['N','Ñ','O','P','Q','R','S','T','U','V','W','X','Y','Z'];
const DIGITS    = ['0','1','2','3','4','5','6','7','8','9'];

export default {
  id: 'tipografia',
  pulsaciones: 5,
  state: null,

  setup(stage /*, preloader */) {
    this.state = { stage, timelines: [], pages: {}, currentKey: null };
    stage.style.background = '';

    const root = document.createElement('div');
    root.className = 'tip-root';
    stage.appendChild(root);
    this.state.root = root;
  },

  // ---- Helpers ----
  _page(key, builder) {
    if (this.state.pages[key]) return this.state.pages[key];
    const page = document.createElement('div');
    page.className = 'tip-page';
    gsap.set(page, { autoAlpha: 0 });
    this.state.root.appendChild(page);
    builder(page);
    this.state.pages[key] = page;
    return page;
  },

  _crossfade(tl, nextKey, builder, at = 0) {
    const next = this._page(nextKey, builder);
    const prevKey = this.state.currentKey;
    if (prevKey && prevKey !== nextKey) {
      const prev = this.state.pages[prevKey];
      tl.to(prev, { autoAlpha: 0, duration: 0.5, ease: 'power2.inOut' }, at);
      tl.to(next, { autoAlpha: 1, duration: 0.5, ease: 'power2.inOut' }, at + 0.2);
    } else {
      tl.to(next, { autoAlpha: 1, duration: 0.5, ease: 'power2.inOut' }, at);
    }
    this.state.currentKey = nextKey;
    return next;
  },

  step(n) {
    switch (n) {
      case 1: return this.stepIntro();
      case 2: return this.stepMatch();
      case 3: return this.stepAbecedario();
      case 4: return this.stepBebas();
      case 5: return this.stepJerarquia();
      default: return Promise.resolve();
    }
  },

  // Puls. 37 · Intro · "Una arquitectura / tipográfica." con stagger desde abajo.
  stepIntro() {
    const tl = gsap.timeline();
    let l1, l2;
    const page = this._crossfade(tl, 'intro', (p) => {
      p.classList.add('tip-intro');
      l1 = document.createElement('p'); l1.className = 'tip-intro-l1'; l1.textContent = 'Una arquitectura';
      l2 = document.createElement('p'); l2.className = 'tip-intro-l2'; l2.textContent = 'tipográfica.';
      p.appendChild(l1); p.appendChild(l2);
      gsap.set([l1, l2], { autoAlpha: 0, y: 40 });
    }, 0);
    // Buscar las dos líneas en la página por si era reutilizada.
    const lines = page.querySelectorAll('.tip-intro-l1, .tip-intro-l2');
    tl.to(lines, {
      autoAlpha: 1, y: 0, duration: 0.8, ease: 'power2.out', stagger: 0.25
    }, 0.3);
    this.state.timelines.push(tl);
    return tl.then();
  },

  // Puls. 38 · Match · "J" gigante + ficha (entran a la vez con leve stagger).
  stepMatch() {
    const tl = gsap.timeline();
    let J, name, role, body;
    const page = this._crossfade(tl, 'match', (p) => {
      p.classList.add('tip-match');
      const left = document.createElement('div');
      J = document.createElement('p'); J.className = 'tip-match-J'; J.textContent = 'J';
      left.appendChild(J);

      const info = document.createElement('div'); info.className = 'tip-match-info';
      name = document.createElement('p'); name.className = 'tip-match-name'; name.textContent = 'Match';
      role = document.createElement('p'); role.className = 'tip-match-role'; role.textContent = 'TIPOGRAFÍA PRINCIPAL DEL SISTEMA';
      body = document.createElement('p'); body.className = 'tip-match-body';
      body.textContent = 'EXPANSIVA, ROBUSTA, ARQUITECTÓNICA. SOSTIENE LOS TITULARES, LOS NÚMEROS Y LAS PIEZAS DE PRESENCIA. ES EL TONO INSTITUCIONAL DE LA NUEVA MARCA.';
      info.appendChild(name); info.appendChild(role); info.appendChild(body);

      p.appendChild(left); p.appendChild(info);
      gsap.set(J, { autoAlpha: 0, y: 80 });
      gsap.set([name, role, body], { autoAlpha: 0, x: 40 });
    }, 0);
    const j = page.querySelector('.tip-match-J');
    const info = page.querySelectorAll('.tip-match-name, .tip-match-role, .tip-match-body');
    tl.to(j, { autoAlpha: 1, y: 0, duration: 0.9, ease: 'power3.out' }, 0.3);
    tl.to(info, {
      autoAlpha: 1, x: 0, duration: 0.7, ease: 'power2.out', stagger: 0.12
    }, 0.6);
    this.state.timelines.push(tl);
    return tl.then();
  },

  // Puls. 39 · Abecedario Match · letra a letra con stagger rápido.
  stepAbecedario() {
    const tl = gsap.timeline();
    const page = this._crossfade(tl, 'abc', (p) => {
      p.classList.add('tip-abc');
      const buildRow = (chars, extraClass = '') => {
        const row = document.createElement('div');
        row.className = 'tip-abc-row' + (extraClass ? ' ' + extraClass : '');
        chars.forEach((ch) => {
          const c = document.createElement('span');
          c.className = 'tip-abc-char';
          c.textContent = ch;
          row.appendChild(c);
        });
        return row;
      };
      p.appendChild(buildRow(ABC_ROW_1));
      p.appendChild(buildRow(ABC_ROW_2));
      p.appendChild(buildRow(DIGITS, 'is-digits'));
      gsap.set(p.querySelectorAll('.tip-abc-char'), { autoAlpha: 0, y: 24 });
    }, 0);
    const chars = page.querySelectorAll('.tip-abc-char');
    tl.to(chars, {
      autoAlpha: 1, y: 0, duration: 0.5, ease: 'power2.out', stagger: 0.025
    }, 0.3);
    this.state.timelines.push(tl);
    return tl.then();
  },

  // Puls. 40 · Bebas Neue · ficha izq. + 3 palabras dcha. (jerarquía por tamaño).
  stepBebas() {
    const tl = gsap.timeline();
    const page = this._crossfade(tl, 'bebas', (p) => {
      p.classList.add('tip-bebas');

      const info = document.createElement('div'); info.className = 'tip-bebas-info';
      const name = document.createElement('p'); name.className = 'tip-bebas-name'; name.textContent = 'Bebas Neue';
      const role = document.createElement('p'); role.className = 'tip-bebas-role'; role.textContent = 'TIPOGRAFÍA SECUNDARIA · CLAIMS Y ETIQUETAS';
      const body = document.createElement('p'); body.className = 'tip-bebas-body';
      body.textContent = 'CONDENSADA, ALTA, INDUSTRIAL. ACOMPAÑA AL CLAIM CAPITAL DE LA MONASTRELL Y ARTICULA LOS DATOS, LOS RÓTULOS Y LOS PEQUEÑOS TEXTOS DEL SISTEMA.';
      info.appendChild(name); info.appendChild(role); info.appendChild(body);

      const words = document.createElement('div'); words.className = 'tip-bebas-words';
      const w1 = document.createElement('p'); w1.className = 'tip-bebas-word is-1'; w1.textContent = 'CAPITAL';
      const w2 = document.createElement('p'); w2.className = 'tip-bebas-word is-2'; w2.textContent = 'ELEGANCIA';
      const w3 = document.createElement('p'); w3.className = 'tip-bebas-word is-3'; w3.textContent = 'PATRIMONIO';
      words.appendChild(w1); words.appendChild(w2); words.appendChild(w3);

      p.appendChild(info); p.appendChild(words);
      gsap.set([name, role, body], { autoAlpha: 0, x: -40 });
      gsap.set([w1, w2, w3], { autoAlpha: 0, x: 40 });
    }, 0);
    const infoEls = page.querySelectorAll('.tip-bebas-name, .tip-bebas-role, .tip-bebas-body');
    const wordEls = page.querySelectorAll('.tip-bebas-word');
    tl.to(infoEls, {
      autoAlpha: 1, x: 0, duration: 0.7, ease: 'power2.out', stagger: 0.12
    }, 0.3);
    tl.to(wordEls, {
      autoAlpha: 1, x: 0, duration: 0.7, ease: 'power2.out', stagger: 0.18
    }, 0.45);
    this.state.timelines.push(tl);
    return tl.then();
  },

  // Puls. 41 · Jerarquía editorial · composición centrada (kicker / título / sub / body).
  stepJerarquia() {
    const tl = gsap.timeline();
    const page = this._crossfade(tl, 'jer', (p) => {
      p.classList.add('tip-jer');
      const pre = document.createElement('p'); pre.className = 'tip-jer-pre'; pre.textContent = 'DESCUBRE JUMILLA';
      const titulo = document.createElement('p'); titulo.className = 'tip-jer-titulo'; titulo.textContent = 'Capital del vino';
      const sub = document.createElement('p'); sub.className = 'tip-jer-sub'; sub.textContent = 'más antiguo de España.';
      const body = document.createElement('p'); body.className = 'tip-jer-body';
      body.textContent = '700 AÑOS DE MONASTRELL · UN TERRITORIO QUE CONSERVA LA TRADICIÓN, ELEVA SU CULTURA Y MIRA HACIA EL FUTURO.';
      p.appendChild(pre); p.appendChild(titulo); p.appendChild(sub); p.appendChild(body);
      gsap.set([pre, titulo, sub, body], { autoAlpha: 0, y: 30 });
    }, 0);
    const lines = page.querySelectorAll('.tip-jer-pre, .tip-jer-titulo, .tip-jer-sub, .tip-jer-body');
    tl.to(lines, {
      autoAlpha: 1, y: 0, duration: 0.8, ease: 'power2.out', stagger: 0.2
    }, 0.3);
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
