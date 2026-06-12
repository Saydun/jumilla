// 10-iconografia.js
// BLOQUE 2.7 · Iconografía · Pulsaciones 42-44 (GUION_TECNICO.md).
//
//   step(1) · Puls. 42 · Intro
//     "Un lenguaje / visual propio." Match 140 reg + Match 180 bold, blanco sobre
//     negro. Stagger desde abajo. (Sin Monastrell, regla de contraste LED.)
//   step(2) · Puls. 43 · Trío de iconos
//     3 columnas: BOTELLA / CASTILLO / UVAS (en blanco, ~460 px de alto) con efecto
//     "draw" (stroke-dashoffset → 0) seguido de fill-in. Etiquetas Bebas Neue debajo:
//     VINO · PATRIMONIO · ORIGEN, con sub-descriptor pequeño.
//   step(3) · Puls. 44 · Sistema
//     Fondo Monastrell sólido + patrón a opacidad 0.15 que entra con wipe (fade in con
//     clip-path diagonal) + caja blanca central con "Un sistema icónico" (Match 96
//     Monastrell bold) y "que se aplica a cualquier soporte." (Bebas 36 negro).
//
// Decisión de contraste: los iconos del trío van en BLANCO (no Monastrell) sobre el
// fondo negro enriquecido. En la LED de 8x3 m, Monastrell sobre negro pierde mucha
// definición; el blanco con stroke-draw funciona mucho mejor (mismo patrón validado
// en el castillo de las encuestas).

import { gsap } from 'gsap';
import { injectSVG, setupStrokeDraw, recolorSVG } from '../utils/svg-helpers.js';

const BOTELLA  = '/logo/BOTELLA.svg';
const CASTILLO = '/logo/CASTILLO.svg';
const UVAS     = '/logo/UVAS.svg';
const PATRON   = '/logo/PATRON.svg';

const ICONOS = [
  { src: BOTELLA,  prefix: 'ico-botella',  label: 'VINO',       sub: 'EL FRUTO DE 700 AÑOS DE MONASTRELL.' },
  { src: CASTILLO, prefix: 'ico-castillo', label: 'PATRIMONIO', sub: 'EL CASTILLO COMO SÍMBOLO COMPARTIDO.' },
  { src: UVAS,     prefix: 'ico-uvas',     label: 'ORIGEN',     sub: 'LA VID Y LA TIERRA QUE LO HICIERON POSIBLE.' }
];

export default {
  id: 'iconografia',
  pulsaciones: 3,
  state: null,

  setup(stage, preloader) {
    this.state = { stage, preloader, timelines: [], pages: {}, currentKey: null };
    stage.style.background = '';

    const root = document.createElement('div');
    root.className = 'ico-root';
    stage.appendChild(root);
    this.state.root = root;
  },

  _page(key, builder) {
    if (this.state.pages[key]) return this.state.pages[key];
    const page = document.createElement('div');
    page.className = 'ico-page';
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
      case 2: return this.stepTrio();
      case 3: return this.stepSistema();
      default: return Promise.resolve();
    }
  },

  // Puls. 42 · Intro.
  stepIntro() {
    const tl = gsap.timeline();
    const page = this._crossfade(tl, 'intro', (p) => {
      p.classList.add('ico-intro');
      const l1 = document.createElement('p'); l1.className = 'ico-intro-l1'; l1.textContent = 'Un lenguaje';
      const l2 = document.createElement('p'); l2.className = 'ico-intro-l2'; l2.textContent = 'visual propio.';
      p.appendChild(l1); p.appendChild(l2);
      gsap.set([l1, l2], { autoAlpha: 0, y: 40 });
    }, 0);
    const lines = page.querySelectorAll('.ico-intro-l1, .ico-intro-l2');
    tl.to(lines, {
      autoAlpha: 1, y: 0, duration: 0.8, ease: 'power2.out', stagger: 0.25
    }, 0.3);
    this.state.timelines.push(tl);
    return tl.then();
  },

  // Puls. 43 · Trío de iconos · draw + fill + etiquetas.
  stepTrio() {
    const tl = gsap.timeline();
    let strokesPerIcon = [];
    const page = this._crossfade(tl, 'trio', (p) => {
      p.classList.add('ico-trio');
      const refs = [];
      ICONOS.forEach((ic) => {
        const col = document.createElement('div'); col.className = 'ico-trio-col';
        const svgWrap = document.createElement('div'); svgWrap.className = 'ico-trio-svg';
        const { svg } = injectSVG(svgWrap, this.state.preloader.getSVG(ic.src), { prefix: ic.prefix });
        col.appendChild(svgWrap);

        const label = document.createElement('p'); label.className = 'ico-trio-label'; label.textContent = ic.label;
        const sub   = document.createElement('p'); sub.className   = 'ico-trio-sub';   sub.textContent   = ic.sub;
        col.appendChild(label); col.appendChild(sub);
        p.appendChild(col);

        const strokes = setupStrokeDraw(svg, { color: '#FFFFFF', strokeWidth: 2 });
        gsap.set([label, sub], { autoAlpha: 0, y: 20 });
        refs.push({ svg, strokes, label, sub });
      });
      p._refs = refs;
    }, 0);
    const refs = page._refs;

    // Draw stagger: cada icono arranca con 0.4 s de retraso respecto al anterior.
    refs.forEach((r, i) => {
      const at = 0.4 + i * 0.4;
      r.strokes.forEach(({ path }) => {
        tl.to(path, { strokeDashoffset: 0, duration: 1.0, ease: 'power2.inOut' }, at);
        tl.to(path, { fillOpacity: 1, strokeWidth: 0, duration: 0.4, ease: 'power1.out' }, at + 1.0);
      });
    });
    // Etiquetas: aparecen cuando los 3 iconos están macizados.
    const lastEnd = 0.4 + (refs.length - 1) * 0.4 + 1.0 + 0.4;
    refs.forEach((r, i) => {
      tl.to([r.label, r.sub], {
        autoAlpha: 1, y: 0, duration: 0.6, ease: 'power2.out', stagger: 0.08
      }, lastEnd + 0.1 + i * 0.12);
    });
    this.state.timelines.push(tl);
    return tl.then();
  },

  // Puls. 44 · Sistema · patrón Monastrell + caja blanca.
  stepSistema() {
    const tl = gsap.timeline();
    const page = this._crossfade(tl, 'sistema', (p) => {
      p.classList.add('ico-sistema');

      // Patrón en blanco al 15% sobre fondo Monastrell.
      const patBox = document.createElement('div'); patBox.className = 'ico-pattern';
      const { svg: patSvg } = injectSVG(patBox, this.state.preloader.getSVG(PATRON), { prefix: 'ico-patron' });
      recolorSVG(patSvg, '#FFFFFF');
      // No conservar el viewBox forzando el aspecto: queremos que cubra toda la pantalla.
      patSvg.setAttribute('preserveAspectRatio', 'xMidYMid slice');
      p.appendChild(patBox);

      // Caja central.
      const card = document.createElement('div'); card.className = 'ico-card';
      const title = document.createElement('p'); title.className = 'ico-card-title'; title.textContent = 'Un sistema icónico';
      const sub   = document.createElement('p'); sub.className   = 'ico-card-sub';   sub.textContent   = 'que se aplica a cualquier soporte.';
      card.appendChild(title); card.appendChild(sub);
      p.appendChild(card);

      // Estados iniciales: patrón oculto con clip-path (revelado en diagonal); caja
      // ligeramente reducida y oculta.
      gsap.set(patBox, { autoAlpha: 0, clipPath: 'polygon(0 0, 0 0, 0 0, 0 0)' });
      gsap.set(card, { autoAlpha: 0, scale: 0.95, transformOrigin: '50% 50%' });
    }, 0);

    const patBox = page.querySelector('.ico-pattern');
    const card   = page.querySelector('.ico-card');

    // Wipe diagonal del patrón: clip-path va de un triángulo en la esquina superior
    // izquierda a cubrir toda la pantalla. Opacidad final 0.15 (no 1) para que el
    // patrón aporte textura sutil sin competir con la caja blanca central.
    tl.to(patBox, { autoAlpha: 0.15, duration: 0.1, ease: 'none' }, 0.4);
    tl.fromTo(patBox, {
      clipPath: 'polygon(0% 0%, 0% 0%, 0% 0%)'
    }, {
      clipPath: 'polygon(0% 0%, 200% 0%, 0% 200%)',
      duration: 1.2, ease: 'power2.inOut'
    }, 0.4);

    // Caja central entra con scale up + fade tras 0.8 s.
    tl.to(card, {
      autoAlpha: 1, scale: 1, duration: 0.7, ease: 'power2.out'
    }, 1.2);

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
