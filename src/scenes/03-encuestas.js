// 03-encuestas.js
// BLOQUE 2.2 · Encuestas (datos reales) · 10 pulsaciones.
//
// Flujo:
//   1. Intro · "Hemos preguntado a Jumilla."
//   2. Dato 1 · 417 ciudadanos encuestados.
//   3. Perfil · GÉNERO (2 círculos: 52,05% mujeres / 47,63% hombres).
//   4. Perfil · EDAD (3 círculos: 42,59% 30-50 / 31,55% 16-30 / 25,87% +50).
//   5. Dato 2 · 52,37% asocian Jumilla con el rojo vino.
//   6. Dato 3 · 42,59% identifican El Castillo (con draw).
//   7. Dato 4 · 63% piden marca elegante/clásica/tradicional/formal.
//   8. Dato 5 · 9,78% encontraban atractiva la marca anterior.
//   9. Dato 6 · ORGULLO (59,94%).
//  10. Síntesis · strip demográfico arriba + 6 conclusiones abajo.
//
// Cada pulsación construye su propia "página" la primera vez que se llama y hace
// cross-fade con la anterior. Todos los datos vienen de `/src/data/encuestas.json`;
// nada de números hardcodeados.

import { gsap } from 'gsap';
import data from '../data/encuestas.json';
import { injectSVG, setupStrokeDraw } from '../utils/svg-helpers.js';

// Todo este bloque vive sobre fondo Monastrell con elementos en BLANCO (regla de
// contraste para que se vea bien en la pantalla LED de 8×3 m). El "draw" del castillo
// y los glows también van en blanco.
const WHITE = '#FFFFFF';
const CASTILLO_SVG = '/logo/CASTILLO.svg';

// Formatea un número con coma decimal española (52.37 → "52,37"). `d` decimales.
const fmt = (v, d = 0) => v.toFixed(d).replace('.', ',');

export default {
  id: 'encuestas',
  pulsaciones: 10,
  state: null,

  setup(stage, preloader) {
    this.state = { stage, preloader, timelines: [], pages: {}, currentPage: null };
    stage.style.background = '';

    const root = document.createElement('div');
    root.className = 'enc-root';
    stage.appendChild(root);
    this.state.root = root;
  },

  // Crea (o devuelve) la página de una pulsación. Si la crea, devuelve además su intro.
  _page(key, builder) {
    if (this.state.pages[key]) return { page: this.state.pages[key], built: false };
    const page = document.createElement('div');
    page.className = 'enc-page';
    this.state.root.appendChild(page);
    gsap.set(page, { autoAlpha: 0 });
    builder(page);
    this.state.pages[key] = page;
    return { page, built: true };
  },

  // Cross-fade estándar entre pulsaciones: apaga la página actual y enciende la nueva.
  _crossfade(tl, nextPage, at = 0) {
    if (this.state.currentPage && this.state.currentPage !== nextPage) {
      tl.to(this.state.currentPage, { autoAlpha: 0, duration: 0.4, ease: 'power2.inOut' }, at);
    }
    tl.set(nextPage, { autoAlpha: 1 }, at + 0.4);
    this.state.currentPage = nextPage;
  },

  // Helper de contador animado: tweenea {v:0}→{v:target} y actualiza textContent.
  _counter(tl, el, target, { decimals = 0, suffix = '', duration = 1.5, at = 0 } = {}) {
    const obj = { v: 0 };
    el.textContent = fmt(0, decimals) + suffix;
    tl.to(obj, {
      v: target, duration, ease: 'power2.out', at,
      onUpdate: () => { el.textContent = fmt(obj.v, decimals) + suffix; }
    }, at);
  },

  step(n) {
    switch (n) {
      case 1: return this.stepIntro();        // Intro
      case 2: return this.stepDato1();        // 417 ciudadanos
      case 3: return this.stepGenero();       // Perfil · sexo (NEW)
      case 4: return this.stepEdad();         // Perfil · edad (NEW)
      case 5: return this.stepDato2();        // 52,37% rojo vino
      case 6: return this.stepDato3();        // 42,59% castillo
      case 7: return this.stepDato4();        // 63% estilo
      case 8: return this.stepDato5();        // 9,78% logo anterior
      case 9: return this.stepDato6();        // ORGULLO
      case 10: return this.stepSintesis();     // síntesis (con strip demográfico)
      default: return Promise.resolve();
    }
  },

  // ----------------------------------------------------------------
  // Puls. 5 · Intro
  // ----------------------------------------------------------------
  stepIntro() {
    const tl = gsap.timeline();
    const refs = {};
    const { page, built } = this._page('intro', (p) => {
      // Izquierda: 3 líneas Match 110 (la primera en Monastrell).
      const left = document.createElement('div');
      left.className = 'enc-intro-left';
      const lines = [
        { text: 'Hemos', monastrell: true },
        { text: 'preguntado', monastrell: false },
        { text: 'a Jumilla.', monastrell: false }
      ];
      const wordEls = [];
      lines.forEach((l) => {
        const lineEl = document.createElement('p');
        lineEl.className = 'enc-intro-line' + (l.monastrell ? ' is-monastrell' : '');
        l.text.split(' ').forEach((w, i) => {
          if (i > 0) lineEl.appendChild(document.createTextNode(' '));
          const span = document.createElement('span');
          span.className = 'word';
          span.textContent = w;
          lineEl.appendChild(span);
          wordEls.push(span);
        });
        left.appendChild(lineEl);
      });
      p.appendChild(left);
      refs.words = wordEls;

      // Derecha: párrafo descriptivo.
      const right = document.createElement('p');
      right.className = 'enc-intro-right';
      right.textContent = 'Durante los meses de octubre y noviembre de 2025, a petición del Ayuntamiento de Jumilla, realizamos un estudio demoscópico a pie de calle. Más de 400 ciudadanos nos contaron qué imagen de Jumilla quieren ver.';
      p.appendChild(right);
      refs.right = right;

      gsap.set(wordEls, { autoAlpha: 0, x: -50 });
      gsap.set(right, { autoAlpha: 0 });
      p._refs = refs;
    });
    this._crossfade(tl, page, 0);
    const r = page._refs;
    tl.to(r.words, { autoAlpha: 1, x: 0, duration: 0.6, ease: 'power2.out', stagger: 0.15 }, 0.5);
    tl.to(r.right, { autoAlpha: 1, duration: 1.0, ease: 'power2.out' }, '+=0.3');
    this.state.timelines.push(tl);
    return tl.then();
  },

  // ----------------------------------------------------------------
  // Puls. 6 · Dato 1 · 417 ciudadanos
  // ----------------------------------------------------------------
  stepDato1() {
    const tl = gsap.timeline();
    const { page, built } = this._page('d1', (p) => {
      const box = document.createElement('div');
      box.className = 'enc-page enc-d1';
      box.style.position = 'absolute'; box.style.inset = '0';
      const num = document.createElement('div');
      num.className = 'enc-num enc-d1-num';
      num.textContent = '0';
      box.appendChild(num);
      const deco = document.createElement('div');
      deco.className = 'enc-d1-deco';
      box.appendChild(deco);
      const desc = document.createElement('p');
      desc.className = 'enc-desc enc-d1-desc';
      desc.textContent = 'ciudadanos encuestados';
      box.appendChild(desc);
      p.appendChild(box);

      gsap.set(num, { scale: 0.7, transformOrigin: '50% 50%' });
      gsap.set(deco, { scaleX: 0 });
      gsap.set(desc, { autoAlpha: 0 });
      p._refs = { num, deco, desc };
    });
    this._crossfade(tl, page, 0);
    const r = page._refs;
    // Reset por si re-entra.
    gsap.set(r.num, { scale: 0.7 });
    gsap.set(r.deco, { scaleX: 0 });
    gsap.set(r.desc, { autoAlpha: 0 });
    // Contador + escala simultáneos.
    this._counter(tl, r.num, data.muestra, { decimals: 0, duration: 1.5, at: 0.5 });
    tl.to(r.num, { scale: 1, duration: 1.5, ease: 'power2.out' }, 0.5);
    tl.to(r.deco, { scaleX: 1, duration: 0.6, ease: 'power2.out' }, '>');   // tras el contador
    tl.to(r.desc, { autoAlpha: 1, duration: 0.6, ease: 'power2.out' }, '>');
    this.state.timelines.push(tl);
    return tl.then();
  },

  // ----------------------------------------------------------------
  // Perfil · GÉNERO · 2 círculos (mujeres / hombres)
  // ----------------------------------------------------------------
  stepGenero() {
    return this._stepPerfil({
      key: 'genero',
      tag: 'PERFIL DE LA MUESTRA · GÉNERO',
      items: [
        { value: data.genero_mujeres, label: 'MUJERES' },
        { value: data.genero_hombres, label: 'HOMBRES' }
      ],
      threeUp: false
    });
  },

  // ----------------------------------------------------------------
  // Perfil · EDAD · 3 círculos (16-30 / 30-50 / +50)
  // ----------------------------------------------------------------
  stepEdad() {
    return this._stepPerfil({
      key: 'edad',
      tag: 'PERFIL DE LA MUESTRA · EDAD',
      items: [
        { value: data.edad_16_30, label: '16-30 AÑOS' },
        { value: data.edad_30_50, label: '30-50 AÑOS' },
        { value: data.edad_50_mas, label: '+50 AÑOS' }
      ],
      threeUp: true
    });
  },

  // Helper compartido por ambas pulsaciones (mismo layout, solo cambia nº de columnas
  // y el texto del tag).
  _stepPerfil({ key, tag, items, threeUp }) {
    const tl = gsap.timeline();
    const { page } = this._page(key, (p) => {
      const tagEl = document.createElement('p');
      tagEl.className = 'enc-perfil-tag';
      tagEl.textContent = tag;
      p.appendChild(tagEl);

      const circles = document.createElement('div');
      circles.className = 'enc-circles' + (threeUp ? ' is-3' : '');
      const colRefs = items.map(({ value, label }) => {
        const col = document.createElement('div'); col.className = 'enc-circle-col';
        const circle = document.createElement('div'); circle.className = 'enc-circle';
        const pct = document.createElement('p'); pct.className = 'enc-circle-pct'; pct.textContent = '0%';
        circle.appendChild(pct);
        const lbl = document.createElement('p'); lbl.className = 'enc-circle-label'; lbl.textContent = label;
        col.appendChild(circle); col.appendChild(lbl);
        circles.appendChild(col);
        return { circle, pct, lbl, value };
      });
      p.appendChild(circles);

      gsap.set(tagEl, { autoAlpha: 0, y: -10 });
      gsap.set(colRefs.map(c => c.circle), { autoAlpha: 0, scale: 0, transformOrigin: '50% 50%' });
      gsap.set(colRefs.map(c => c.lbl), { autoAlpha: 0, y: 12 });
      p._refs = { tagEl, colRefs };
    });
    this._crossfade(tl, page, 0);
    const r = page._refs;

    // Reset por si re-entra (los contadores siempre arrancan en 0).
    gsap.set(r.tagEl, { autoAlpha: 0, y: -10 });
    gsap.set(r.colRefs.map(c => c.circle), { autoAlpha: 0, scale: 0 });
    gsap.set(r.colRefs.map(c => c.lbl), { autoAlpha: 0, y: 12 });
    r.colRefs.forEach((c) => { c.pct.textContent = '0%'; });

    // Tag arriba.
    tl.to(r.tagEl, { autoAlpha: 1, y: 0, duration: 0.6, ease: 'power2.out' }, 0.5);

    // Círculos: entran con back.out + scale 0→1 + opacity 0→1.
    // stagger 0.15 entre columnas (relevante solo en el de 3; en el de 2 también se ve).
    const stagger = threeUp ? 0.15 : 0.12;
    tl.to(r.colRefs.map(c => c.circle), {
      autoAlpha: 1, scale: 1, duration: 0.7, ease: 'back.out(1.5)', stagger
    }, 0.75);

    // Contadores: cada uno arranca cuando "su" círculo está casi lleno.
    r.colRefs.forEach(({ pct, value }, i) => {
      this._counter(tl, pct, value, {
        decimals: 2, suffix: '%', duration: 1.1, at: 0.95 + i * stagger
      });
    });

    // Etiquetas debajo: tras el último contador.
    const lastEnd = 0.95 + (r.colRefs.length - 1) * stagger + 1.1;
    tl.to(r.colRefs.map(c => c.lbl), {
      autoAlpha: 1, y: 0, duration: 0.5, ease: 'power2.out', stagger: 0.1
    }, lastEnd);

    this.state.timelines.push(tl);
    return tl.then();
  },

  // ----------------------------------------------------------------
  // Puls. 7 · Dato 2 · 52,37% rojo vino
  // ----------------------------------------------------------------
  stepDato2() {
    const tl = gsap.timeline();
    const { page } = this._page('d2', (p) => {
      const wrap = document.createElement('div');
      wrap.className = 'enc-half';
      const left = document.createElement('div');
      left.className = 'enc-half-left';
      const pct = document.createElement('div');
      pct.className = 'enc-num enc-pct-280';
      pct.textContent = '0%';
      const desc = document.createElement('p');
      desc.className = 'enc-desc enc-desc-36';
      desc.textContent = 'asocia Jumilla con el rojo vino';
      left.appendChild(pct);
      left.appendChild(desc);
      const right = document.createElement('div');
      right.className = 'enc-half-right';
      const bar = document.createElement('div'); bar.className = 'enc-bar';
      const fill = document.createElement('div'); fill.className = 'enc-bar-fill';
      bar.appendChild(fill); right.appendChild(bar);
      wrap.appendChild(left); wrap.appendChild(right);
      p.appendChild(wrap);
      gsap.set(desc, { autoAlpha: 0 });
      gsap.set(fill, { scaleX: 0 });
      p._refs = { pct, desc, fill };
    });
    this._crossfade(tl, page, 0);
    const r = page._refs;
    gsap.set(r.desc, { autoAlpha: 0 });
    gsap.set(r.fill, { scaleX: 0 });
    this._counter(tl, r.pct, data.color_vino, { decimals: 2, suffix: '%', duration: 1.5, at: 0.5 });
    tl.to(r.fill, { scaleX: data.color_vino / 100, duration: 1.5, ease: 'power2.out' }, 0.5);
    tl.to(r.desc, { autoAlpha: 1, duration: 0.6, ease: 'power2.out' }, '>');
    this.state.timelines.push(tl);
    return tl.then();
  },

  // ----------------------------------------------------------------
  // Puls. 8 · Dato 3 · 42,59% El Castillo
  // ----------------------------------------------------------------
  stepDato3() {
    const tl = gsap.timeline();
    const { page } = this._page('d3', (p) => {
      const wrap = document.createElement('div');
      wrap.className = 'enc-half';
      const left = document.createElement('div');
      left.className = 'enc-half-left';
      const pct = document.createElement('div');
      pct.className = 'enc-num enc-pct-280';
      pct.textContent = '0%';
      const desc = document.createElement('p');
      desc.className = 'enc-desc enc-desc-36';
      desc.textContent = 'identifica el castillo como el símbolo de Jumilla';
      left.appendChild(pct);
      left.appendChild(desc);
      const right = document.createElement('div');
      right.className = 'enc-half-right';
      const castWrap = document.createElement('div');
      castWrap.className = 'enc-castillo';
      const { svg } = injectSVG(castWrap, this.state.preloader.getSVG(CASTILLO_SVG), { prefix: 'enc-castillo' });
      right.appendChild(castWrap);
      wrap.appendChild(left); wrap.appendChild(right);
      p.appendChild(wrap);
      // Preparar el "draw" del castillo.
      const strokes = setupStrokeDraw(svg, { color: WHITE, strokeWidth: 2 });
      gsap.set(desc, { autoAlpha: 0 });
      p._refs = { pct, desc, svg, strokes };
    });
    this._crossfade(tl, page, 0);
    const r = page._refs;
    gsap.set(r.desc, { autoAlpha: 0 });
    // Reset del castillo a "sin dibujar" si re-entra: setupStrokeDraw deja el estado base
    // al construir; en re-entradas dejo la última animación (no es crítico volver al inicio).
    this._counter(tl, r.pct, data.castillo, { decimals: 2, suffix: '%', duration: 1.5, at: 0.5 });
    r.strokes.forEach(({ path }) => {
      tl.to(path, { strokeDashoffset: 0, duration: 1.5, ease: 'power2.inOut' }, 0.5);
      tl.to(path, { fillOpacity: 1, strokeWidth: 0, duration: 0.4, ease: 'power1.out' }, 0.5 + 1.5);
    });
    tl.to(r.desc, { autoAlpha: 1, duration: 0.6, ease: 'power2.out' }, '>');
    this.state.timelines.push(tl);
    return tl.then();
  },

  // ----------------------------------------------------------------
  // Puls. 9 · Dato 4 · 63% estilo (4 atributos)
  // ----------------------------------------------------------------
  stepDato4() {
    const tl = gsap.timeline();
    const { page } = this._page('d4', (p) => {
      const top = document.createElement('div');
      top.className = 'enc-d4-top';
      const pct = document.createElement('div');
      pct.className = 'enc-num enc-d4-pct';
      pct.textContent = '0%';
      const desc = document.createElement('p');
      desc.className = 'enc-desc enc-desc-36';
      desc.textContent = 'demanda una marca con estos atributos';
      top.appendChild(pct); top.appendChild(desc);

      const grid = document.createElement('div');
      grid.className = 'enc-d4-grid';
      const labels = ['ELEGANTE', 'CLÁSICA', 'TRADICIONAL', 'FORMAL'];
      const boxes = labels.map((t) => {
        const b = document.createElement('div');
        b.className = 'enc-attr';
        b.textContent = t;
        grid.appendChild(b);
        return b;
      });
      p.appendChild(top); p.appendChild(grid);
      gsap.set(desc, { autoAlpha: 0 });
      gsap.set(boxes, { autoAlpha: 0, scale: 0.8, transformOrigin: '50% 50%' });
      p._refs = { pct, desc, boxes };
    });
    this._crossfade(tl, page, 0);
    const r = page._refs;
    gsap.set(r.desc, { autoAlpha: 0 });
    gsap.set(r.boxes, { autoAlpha: 0, scale: 0.8 });
    r.boxes.forEach((b) => b.classList.remove('is-on'));
    this._counter(tl, r.pct, data.estilo_elegante, { decimals: 0, suffix: '%', duration: 1.5, at: 0.5 });
    tl.to(r.desc, { autoAlpha: 1, duration: 0.6, ease: 'power2.out' }, '>');
    tl.to(r.boxes, {
      autoAlpha: 1, scale: 1, duration: 0.5, ease: 'power2.out', stagger: 0.12
    }, '<');
    // Iluminado escalonado (borde + color → Monastrell con un glow breve).
    r.boxes.forEach((b, i) => {
      tl.add(() => b.classList.add('is-on'), '>');
      tl.fromTo(b, {
        boxShadow: '0 0 0 rgba(255, 255, 255, 0)'
      }, {
        boxShadow: '0 0 32px rgba(255, 255, 255, 0.55)', duration: 0.25, ease: 'power2.out',
        yoyo: true, repeat: 1
      }, '<');
    });
    this.state.timelines.push(tl);
    return tl.then();
  },

  // ----------------------------------------------------------------
  // Puls. 10 · Dato 5 · 9,78% (impacto, sin contador animado)
  // ----------------------------------------------------------------
  stepDato5() {
    const tl = gsap.timeline();
    const { page } = this._page('d5', (p) => {
      const box = document.createElement('div');
      box.className = 'enc-page enc-d5';
      box.style.position = 'absolute'; box.style.inset = '0';
      const num = document.createElement('div');
      num.className = 'enc-num enc-d5-num';
      num.textContent = fmt(data.logo_anterior, 2) + '%';
      const desc = document.createElement('p');
      desc.className = 'enc-desc enc-d5-desc';
      desc.textContent = 'de la población encontraba atractiva la marca anterior';
      box.appendChild(num); box.appendChild(desc);
      p.appendChild(box);
      gsap.set([num, desc], { autoAlpha: 0 });
      p._refs = { num, desc };
    });
    this._crossfade(tl, page, 0);
    const r = page._refs;
    gsap.set([r.num, r.desc], { autoAlpha: 0 });
    // El número aparece SIN contador: fade-in rápido + scale 1.1→1 (impacto seco).
    tl.fromTo(r.num,
      { autoAlpha: 0, scale: 1.1 },
      { autoAlpha: 1, scale: 1, duration: 0.3, ease: 'power3.out' },
      0.5
    );
    // Pausa de 0.3 s · silencio visual antes del texto.
    tl.to(r.desc, { autoAlpha: 1, duration: 0.6, ease: 'power2.out' }, '>0.3');
    this.state.timelines.push(tl);
    return tl.then();
  },

  // ----------------------------------------------------------------
  // Puls. 11 · Dato 6 · ORGULLO
  // ----------------------------------------------------------------
  stepDato6() {
    const tl = gsap.timeline();
    const { page } = this._page('d6', (p) => {
      const box = document.createElement('div');
      box.className = 'enc-page enc-d6';
      box.style.position = 'absolute'; box.style.inset = '0';
      const intro = document.createElement('p');
      intro.className = 'enc-d6-intro';
      intro.textContent = `El ${fmt(data.orgullo, 2)}% quiere sentir`;
      const orgullo = document.createElement('p');
      orgullo.className = 'enc-d6-orgullo';
      const letters = 'ORGULLO'.split('').map((ch) => {
        const s = document.createElement('span'); s.className = 'letter'; s.textContent = ch;
        orgullo.appendChild(s); return s;
      });
      const outro = document.createElement('p');
      outro.className = 'enc-d6-outro';
      outro.textContent = 'con la nueva marca.';
      box.appendChild(intro); box.appendChild(orgullo); box.appendChild(outro);
      p.appendChild(box);
      gsap.set([intro, outro], { autoAlpha: 0 });
      gsap.set(letters, { autoAlpha: 0, y: 30, scale: 0.8, transformOrigin: '50% 50%' });
      p._refs = { intro, outro, orgullo, letters };
    });
    this._crossfade(tl, page, 0);
    const r = page._refs;
    gsap.set([r.intro, r.outro], { autoAlpha: 0 });
    gsap.set(r.letters, { autoAlpha: 0, y: 30, scale: 0.8 });
    gsap.set(r.orgullo, { textShadow: '0 0 0 rgba(255,255,255,0)' });
    tl.to([r.intro, r.outro], {
      autoAlpha: 1, duration: 0.6, ease: 'power2.out', stagger: 0.2
    }, 0.5);
    tl.to(r.letters, {
      autoAlpha: 1, y: 0, scale: 1, duration: 0.5, ease: 'power2.out', stagger: 0.08
    }, 0.8);
    // Glow sobre ORGULLO: halo blanco que se enciende y apaga (2 ciclos completos).
    tl.to(r.orgullo, {
      textShadow: '0 0 50px rgba(255,255,255,0.75)', duration: 0.4, ease: 'power2.inOut',
      yoyo: true, repeat: 3
    }, '>0.1');
    this.state.timelines.push(tl);
    return tl.then();
  },

  // ----------------------------------------------------------------
  // Síntesis · header "RESUMEN" arriba + grid de 6 conclusiones centrado
  // ----------------------------------------------------------------
  stepSintesis() {
    const tl = gsap.timeline();
    const { page } = this._page('sint', (p) => {
      const wrap = document.createElement('div');
      wrap.className = 'enc-sint';

      // --- Header pequeño arriba: "RESUMEN" ---
      const header = document.createElement('p');
      header.className = 'enc-sint-header';
      header.textContent = 'RESUMEN';
      wrap.appendChild(header);

      // --- Grid de las 6 conclusiones ---
      const grid = document.createElement('div');
      grid.className = 'enc-sint-grid';
      const cols = [
        { num: fmt(data.muestra, 0), desc: 'ciudadanos' },
        { num: fmt(data.color_vino, 2) + '%', desc: 'asocian con rojo vino' },
        { num: fmt(data.castillo, 2) + '%', desc: 'ven el castillo' },
        { num: fmt(data.estilo_elegante, 0) + '%', desc: 'piden elegancia' },
        { num: fmt(data.logo_anterior, 2) + '%', desc: 'veían atractiva la marca anterior' },
        { num: fmt(data.orgullo, 2) + '%', desc: 'quieren orgullo' }
      ];
      const colEls = [];
      const divEls = [];
      cols.forEach((c, i) => {
        const col = document.createElement('div');
        col.className = 'enc-sint-col';
        const num = document.createElement('div'); num.className = 'enc-sint-num'; num.textContent = c.num;
        const desc = document.createElement('p'); desc.className = 'enc-sint-desc'; desc.textContent = c.desc;
        col.appendChild(num); col.appendChild(desc);
        if (i < cols.length - 1) {
          const div = document.createElement('div');
          div.className = 'enc-sint-divider';
          col.appendChild(div);
          divEls.push(div);
        }
        grid.appendChild(col);
        colEls.push(col);
      });
      wrap.appendChild(grid);
      p.appendChild(wrap);

      gsap.set(header, { autoAlpha: 0, y: -10 });
      gsap.set(colEls, { autoAlpha: 0, y: 20 });
      gsap.set(divEls, { scaleY: 0 });
      p._refs = { header, cols: colEls, dividers: divEls };
    });
    this._crossfade(tl, page, 0);
    const r = page._refs;
    gsap.set(r.header, { autoAlpha: 0, y: -10 });
    gsap.set(r.cols, { autoAlpha: 0, y: 20 });
    gsap.set(r.dividers, { scaleY: 0 });

    // Primero entra el header pequeño, luego las 6 conclusiones, y por último los dividers.
    tl.to(r.header, {
      autoAlpha: 1, y: 0, duration: 0.5, ease: 'power2.out'
    }, 0.4);
    tl.to(r.cols, {
      autoAlpha: 1, y: 0, duration: 0.6, ease: 'power2.out', stagger: 0.1
    }, 0.65);
    tl.to(r.dividers, { scaleY: 1, duration: 0.5, ease: 'power2.out' }, '>');
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
