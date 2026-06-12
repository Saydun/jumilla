// 11-aplicaciones.js
// BLOQUE 2.8 · Aplicaciones reales · Pulsaciones 45-55 (11 pulsaciones).
//
//   step(1) · Puls. 45 · Intro
//     "Así se ve / Jumilla." Match 160 reg + Match 220 bold, ambas en blanco sobre
//     negro. Stagger desde abajo.
//   step(2..11) · Puls. 46-55 · 10 mockups uno por pulsación
//     Layout grid 62/38: mockup a la izquierda (max-height 680 px) + ficha a la
//     derecha (contador 01/10, línea, nombre Match 92, tagline Match 38, tag Bebas
//     pequeño). El mockup entra con slide-up + scale leve; la ficha rellena con
//     stagger.
//
// Orden narrativo: pública → institucional → impresa → identidad personal → digital.
//   46 · MUPI       (la marca toma la calle)
//   47 · BANDERA    (institucional)
//   48 · ROLLUP     (evento)
//   49 · FLYER      (editorial)
//   50 · SELLO      (oficial)
//   51 · CAMISETA   (merch identidad)
//   52 · GORRA      (merch calle)
//   53 · PULSERA    (evento personal)
//   54 · WEB        (digital pantalla)
//   55 · APP MÓVIL  (digital bolsillo)
//
// Cada paso reutiliza UNA misma página "mock" recoloreando contenido al avanzar,
// para evitar 10 páginas en memoria. La transición de un mockup al siguiente es un
// cross-fade rápido (300 ms) sobre la misma página.

import { gsap } from 'gsap';

const MOCKUPS = [
  { src: '/mockups/mock_mupi@2x.png',     name: 'MUPI',       tagline: 'La marca toma la calle.',              tag: 'EXTERIOR · CIUDAD' },
  { src: '/mockups/mock_bandera@2x.png',  name: 'BANDERA',    tagline: 'Identidad institucional al viento.',    tag: 'EXTERIOR · INSTITUCIONAL' },
  { src: '/mockups/mock_rollup@2x.png',   name: 'ROLLUP',     tagline: 'La marca en el evento.',                 tag: 'EVENTOS · STAND' },
  { src: '/mockups/mock_flyer@2x.png',    name: 'FLYER',      tagline: 'Una pieza editorial para llevarse.',    tag: 'IMPRESO · DIVULGACIÓN' },
  { src: '/mockups/mock_sello@2x.png',    name: 'SELLO',      tagline: 'El emblema sobre el documento oficial.', tag: 'BURÓ · OFICIAL' },
  { src: '/mockups/mock_camiseta@2x.png', name: 'CAMISETA',   tagline: 'El claim sobre el pecho.',               tag: 'MERCH · IDENTIDAD' },
  { src: '/mockups/mock_gorra@2x.png',    name: 'GORRA',      tagline: 'Vestir la marca cada día.',              tag: 'MERCH · CALLE' },
  { src: '/mockups/mock_pulsera@2x.png',  name: 'PULSERA',    tagline: 'El símbolo en la muñeca del visitante.', tag: 'EVENTOS · RECUERDO' },
  { src: '/mockups/mock_laptop@2x.png',   name: 'WEB',        tagline: 'Jumilla en pantalla grande.',            tag: 'DIGITAL · PORTAL' },
  { src: '/mockups/mock_movil@2x.png',    name: 'INSTAGRAM',  tagline: 'La marca vive en su comunidad.',         tag: 'DIGITAL · REDES' }
];

const TOTAL = MOCKUPS.length;

export default {
  id: 'aplicaciones',
  pulsaciones: 1 + TOTAL,
  state: null,

  setup(stage, preloader) {
    this.state = { stage, preloader, timelines: [], pages: {}, currentKey: null };
    stage.style.background = '';

    const root = document.createElement('div');
    root.className = 'apl-root';
    stage.appendChild(root);
    this.state.root = root;
  },

  _page(key, builder) {
    if (this.state.pages[key]) return this.state.pages[key];
    const page = document.createElement('div');
    page.className = 'apl-page';
    gsap.set(page, { autoAlpha: 0 });
    this.state.root.appendChild(page);
    builder(page);
    this.state.pages[key] = page;
    return page;
  },

  _crossfade(tl, nextKey, builder, at = 0, duration = 0.5) {
    const next = this._page(nextKey, builder);
    const prevKey = this.state.currentKey;
    if (prevKey && prevKey !== nextKey) {
      const prev = this.state.pages[prevKey];
      tl.to(prev, { autoAlpha: 0, duration, ease: 'power2.inOut' }, at);
      tl.to(next, { autoAlpha: 1, duration, ease: 'power2.inOut' }, at + duration * 0.4);
    } else {
      tl.to(next, { autoAlpha: 1, duration, ease: 'power2.inOut' }, at);
    }
    this.state.currentKey = nextKey;
    return next;
  },

  step(n) {
    if (n === 1) return this.stepIntro();
    const idx = n - 2; // 0..9
    if (idx >= 0 && idx < TOTAL) return this.stepMockup(idx);
    return Promise.resolve();
  },

  // Puls. 45 · Intro.
  stepIntro() {
    const tl = gsap.timeline();
    const page = this._crossfade(tl, 'intro', (p) => {
      p.classList.add('apl-intro');
      const l1 = document.createElement('p'); l1.className = 'apl-intro-l1'; l1.textContent = 'Así se ve';
      const l2 = document.createElement('p'); l2.className = 'apl-intro-l2'; l2.textContent = 'Jumilla.';
      p.appendChild(l1); p.appendChild(l2);
      gsap.set([l1, l2], { autoAlpha: 0, y: 50 });
    }, 0);
    const lines = page.querySelectorAll('.apl-intro-l1, .apl-intro-l2');
    tl.to(lines, {
      autoAlpha: 1, y: 0, duration: 0.9, ease: 'power2.out', stagger: 0.25
    }, 0.3);
    this.state.timelines.push(tl);
    return tl.then();
  },

  // Puls. 46-55 · Mockup i (0..9). Una sola página "mock" reutilizada.
  stepMockup(i) {
    const m = MOCKUPS[i];
    const tl = gsap.timeline();
    const page = this._page('mock', (p) => {
      p.classList.add('apl-mock');

      const left = document.createElement('div'); left.className = 'apl-mock-img';
      const img = document.createElement('img');
      img.alt = '';
      left.appendChild(img);

      const info = document.createElement('div'); info.className = 'apl-mock-info';
      const counter = document.createElement('div'); counter.className = 'apl-mock-counter';
      const num = document.createElement('p');   num.className = 'apl-mock-num';
      const total = document.createElement('p'); total.className = 'apl-mock-total';
      total.textContent = '/ ' + String(TOTAL).padStart(2, '0');
      counter.appendChild(num); counter.appendChild(total);

      const line = document.createElement('div'); line.className = 'apl-mock-line';
      const name = document.createElement('p'); name.className = 'apl-mock-name';
      const tagline = document.createElement('p'); tagline.className = 'apl-mock-tagline';
      const tag = document.createElement('p'); tag.className = 'apl-mock-tag';

      info.appendChild(counter);
      info.appendChild(line);
      info.appendChild(name);
      info.appendChild(tagline);
      info.appendChild(tag);

      p.appendChild(left); p.appendChild(info);

      p._refs = { img, num, line, name, tagline, tag };
    });

    const r = page._refs;
    const isFirst = this.state.currentKey !== 'mock';

    // Si venimos de la intro (o entrando por primera vez al mock), hacemos cross-fade
    // de página completa. Si ya estábamos en mock, solo cambiamos contenido con un
    // micro-fade del contenido para evitar "salto" visual.
    if (isFirst) {
      // Estado inicial del mock para la primera entrada.
      gsap.set(r.img, { autoAlpha: 0, x: -60, scale: 0.96 });
      gsap.set(r.num, { autoAlpha: 0, y: 30 });
      gsap.set(r.line, { scaleX: 0 });
      gsap.set([r.name, r.tagline, r.tag], { autoAlpha: 0, y: 20 });
      this._crossfade(tl, 'mock', () => {}, 0, 0.5);
    } else {
      // Salida del contenido previo.
      tl.to(r.img,                       { autoAlpha: 0, x: 40, scale: 0.98, duration: 0.35, ease: 'power2.in' }, 0);
      tl.to([r.num, r.name, r.tagline, r.tag], { autoAlpha: 0, y: -10, duration: 0.3, ease: 'power2.in' }, 0);
      tl.to(r.line, { scaleX: 0, duration: 0.3, ease: 'power2.in' }, 0);
      // Pre-set para la entrada del nuevo.
      tl.set(r.img, { x: -60, scale: 0.96 });
      tl.set([r.num, r.name, r.tagline, r.tag], { y: 20 });
    }

    const at = isFirst ? 0.4 : 0.4;

    // Actualizar contenido (es seguro hacerlo mientras la página/contenido está oculto).
    tl.add(() => {
      r.img.src = m.src;
      r.num.textContent = String(i + 1).padStart(2, '0');
      r.name.textContent = m.name;
      r.tagline.textContent = m.tagline;
      r.tag.textContent = m.tag;
    }, at - 0.05);

    // Entrada del mockup.
    tl.to(r.img, {
      autoAlpha: 1, x: 0, scale: 1, duration: 0.9, ease: 'power3.out'
    }, at);

    // Ficha derecha: contador → línea (drawX) → nombre → tagline → tag.
    tl.to(r.num,     { autoAlpha: 1, y: 0, duration: 0.6, ease: 'power2.out' }, at + 0.15);
    tl.to(r.line,    { scaleX: 1, duration: 0.5, ease: 'power3.out' }, at + 0.4);
    tl.to(r.name,    { autoAlpha: 1, y: 0, duration: 0.6, ease: 'power2.out' }, at + 0.5);
    tl.to(r.tagline, { autoAlpha: 1, y: 0, duration: 0.6, ease: 'power2.out' }, at + 0.62);
    tl.to(r.tag,     { autoAlpha: 1, y: 0, duration: 0.5, ease: 'power2.out' }, at + 0.72);

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
