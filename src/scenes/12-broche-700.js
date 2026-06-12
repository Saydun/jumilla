// 12-broche-700.js
// BLOQUE 2.9 · Broche final · 700 años · 6 pulsaciones (guion 51-56).
// SEGUNDO MOMENTO ESTRELLA del evento: cierre dramático de la intervención de Victoria.
//
//   step(1) · Puls. 51 · La fecha 1327
//     Fondo negro absoluto. "1327" en odómetro (4 ruedas verticales, Match 360 blanco).
//     Aparece con fade-in lento + scale 0.9→1.
//   step(2) · Puls. 52 · El hito histórico
//     Bajo "1327": línea horizontal Monastrell 300 px (drawX) + frase palabra a palabra
//     "Primera prueba documental de la uva Monastrell en Jumilla."
//   step(3) · Puls. 53 · Salto 1327 → 2027 (efecto odómetro)
//     La línea y el texto se desvanecen. Cada dígito del 1327 gira verticalmente hasta
//     componer 2027. Glow Monastrell sutil al asentarse.
//   step(4) · Puls. 54 · La cifra 700 · MOMENTO DE MÁXIMO IMPACTO
//     "2027" hace fade-out. "700" Match 600 Monastrell entra desde y:-200 con power4.
//     Impacto scale 1→1.06→1. Debajo: "AÑOS CUSTODIANDO" + "LA MONASTRELL" (Bebas 56)
//     palabra a palabra.
//   step(5) · Puls. 55 · Cierre Victoria
//     Logo completo + slogan + sello circular Monastrell (700 · 1327·2027) arriba dcha.
//   step(6) · Puls. 56 · Transición a alcaldesa
//     Pantalla limpia, isotipo blanco al 50 % esquina inferior derecha.

import { gsap } from 'gsap';
import { injectSVG, recolorSVG } from '../utils/svg-helpers.js';

const LOGO_COMPLETO = '/logo/LOGO_COMPLETO_JUMILLA_TURISMO.svg';
const ISOTIPO       = '/logo/LOGO_ISOTIPO.svg';

// Decisión cromática: las cifras "1327"/"2027" van en blanco (legibilidad LED). El
// "700" sí en Monastrell — a 600 px ocupa varios metros en la LED y a esa masa el
// color de marca se ve con autoridad, no como las piezas pequeñas que rendían mal.

export default {
  id: 'broche-700',
  pulsaciones: 6,
  state: null,

  setup(stage, preloader) {
    this.state = { stage, preloader, timelines: [], pages: {}, currentKey: null };
    stage.style.background = '';

    const root = document.createElement('div');
    root.className = 'bro-root';
    stage.appendChild(root);
    this.state.root = root;
  },

  _page(key, builder) {
    if (this.state.pages[key]) return this.state.pages[key];
    const page = document.createElement('div');
    page.className = 'bro-page';
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

  // Construye una rueda odómetro de 4 dígitos. Devuelve los 4 wheels para animar.
  _buildOdometer(container, initial = '1327') {
    const odo = document.createElement('div'); odo.className = 'bro-odo';
    const wheels = [];
    for (let i = 0; i < 4; i++) {
      const cell = document.createElement('div'); cell.className = 'bro-odo-cell';
      const wheel = document.createElement('div'); wheel.className = 'bro-odo-wheel';
      // 0..9 apilados verticalmente.
      for (let d = 0; d <= 9; d++) {
        const s = document.createElement('span');
        s.textContent = String(d);
        wheel.appendChild(s);
      }
      cell.appendChild(wheel);
      odo.appendChild(cell);
      // Posicionar el dígito inicial. El wheel mide 10 dígitos = 10 × 360 px = 3600 px
      // de alto. yPercent es % de la altura del PROPIO wheel (3600 px), así que para
      // trasladar UN dígito (360 px) usamos yPercent = -10. Para mostrar el dígito d:
      // yPercent = -d * 10.
      const dig = parseInt(initial[i], 10);
      gsap.set(wheel, { yPercent: -dig * 10 });
      wheels.push(wheel);
    }
    container.appendChild(odo);
    return { odo, wheels };
  },

  // Anima los 4 dígitos a un valor objetivo con stagger horizontal.
  _spinOdometer(tl, wheels, target, at = 0) {
    const digits = String(target).padStart(4, '0').split('').map(Number);
    digits.forEach((d, i) => {
      // Para hacerlo dramático: cada rueda gira pasando por varios dígitos extra,
      // como si fuera un contador mecánico. 1 vuelta completa = 10 dígitos = -100 en
      // yPercent (porque 1 dígito = -10 yPercent). 3 vueltas extra + asentamiento en d:
      const yEnd = -(d + 30) * 10;   // 3 vueltas extra + asentamiento en d
      tl.to(wheels[i], {
        yPercent: yEnd,
        duration: 1.6 + i * 0.15,    // las últimas tardan un poco más → efecto cascada
        ease: 'power3.inOut'
      }, at + i * 0.05);
      // Reset modular: tras el tween reposicionamos el wheel en el dígito final sin
      // vueltas extras (instantáneo, invisible: mismo dígito mod 10).
      tl.set(wheels[i], { yPercent: -d * 10 });
    });
  },

  step(n) {
    switch (n) {
      case 1: return this.stepFecha1327();
      case 2: return this.stepHito();
      case 3: return this.stepSalto2027();
      case 4: return this.step700();
      case 5: return this.stepCierreVictoria();
      case 6: return this.stepTransitAlcaldesa();
      default: return Promise.resolve();
    }
  },

  // Puls. 51 · 1327 fade-in lento.
  stepFecha1327() {
    const tl = gsap.timeline();
    let odoRefs;
    const page = this._crossfade(tl, 'fecha', (p) => {
      p.classList.add('bro-fecha');
      const odoWrap = document.createElement('div');
      odoWrap.style.cssText = 'display:flex;align-items:center;justify-content:center;';
      const { odo, wheels } = this._buildOdometer(odoWrap, '1327');
      p.appendChild(odoWrap);
      p._odo = { odo, wheels };

      // Línea + descripción para puls. 52, ocultos por defecto.
      const line = document.createElement('div'); line.className = 'bro-fecha-line';
      p.appendChild(line);
      const desc = document.createElement('p'); desc.className = 'bro-fecha-desc';
      const words = 'Primera prueba documental de la uva Monastrell en Jumilla.'.split(' ');
      words.forEach((w, i) => {
        const span = document.createElement('span');
        span.className = 'word';
        span.textContent = w + (i < words.length - 1 ? '' : '');
        desc.appendChild(span);
      });
      p.appendChild(desc);
      gsap.set(desc.querySelectorAll('.word'), { autoAlpha: 0, y: 20 });
      gsap.set([line, desc], { autoAlpha: 0 });

      gsap.set(odo, { autoAlpha: 0, scale: 0.9, transformOrigin: '50% 50%' });
      p._refs = { odo, line, desc };
    }, 0);

    const r = page._refs;
    tl.to(r.odo, {
      autoAlpha: 1, scale: 1, duration: 2.0, ease: 'power2.out'
    }, 0.4);
    this.state.timelines.push(tl);
    return tl.then();
  },

  // Puls. 52 · Línea + frase palabra a palabra (reutiliza la página 'fecha').
  stepHito() {
    const tl = gsap.timeline();
    const page = this.state.pages.fecha;
    const r = page._refs;
    tl.to(r.line, { autoAlpha: 1, duration: 0.1 }, 0);
    tl.to(r.line, { scaleX: 1, duration: 0.7, ease: 'power2.out' }, 0.1);
    tl.to(r.desc, { autoAlpha: 1, duration: 0.1 }, 0.5);
    const words = r.desc.querySelectorAll('.word');
    tl.to(words, {
      autoAlpha: 1, y: 0, duration: 0.4, ease: 'power2.out', stagger: 0.08
    }, 0.6);
    this.state.timelines.push(tl);
    return tl.then();
  },

  // Puls. 53 · Salto temporal · línea/desc desaparecen + odómetro gira a 2027 +
  // pulso de escala al asentarse (sustituye al text-shadow glow, que se clipaba
  // en los bordes de cada .bro-odo-cell creando rectángulos visibles).
  stepSalto2027() {
    const tl = gsap.timeline();
    const page = this.state.pages.fecha;
    const r = page._refs;
    const wheels = page._odo.wheels;
    const odo = page._odo.odo;

    tl.to([r.line, r.desc], { autoAlpha: 0, duration: 0.5, ease: 'power2.inOut' }, 0);
    this._spinOdometer(tl, wheels, 2027, 0.5);
    // Pulso de escala al asentarse: 1 → 1.04 → 1. Acentúa el "thump" mecánico final
    // del odómetro sin recurrir a un glow que se cortaría con el overflow:hidden.
    tl.to(odo, { scale: 1.04, duration: 0.18, ease: 'power1.out', transformOrigin: '50% 50%' }, '+=0.05');
    tl.to(odo, { scale: 1.0, duration: 0.35, ease: 'power2.out' }, '>');
    this.state.timelines.push(tl);
    return tl.then();
  },

  // Puls. 54 · La cifra 700 · momento estrella.
  step700() {
    const tl = gsap.timeline();
    let refs;
    const page = this._crossfade(tl, '700', (p) => {
      p.classList.add('bro-700-page');
      const big = document.createElement('p'); big.className = 'bro-700'; big.textContent = '700';
      p.appendChild(big);
      const sub1 = document.createElement('p'); sub1.className = 'bro-700-sub1';
      const sub2 = document.createElement('p'); sub2.className = 'bro-700-sub2';
      'AÑOS CUSTODIANDO'.split(' ').forEach((w, i, arr) => {
        const s = document.createElement('span'); s.className = 'word';
        s.textContent = w + (i < arr.length - 1 ? '' : '');
        sub1.appendChild(s);
      });
      'LA MONASTRELL'.split(' ').forEach((w, i, arr) => {
        const s = document.createElement('span'); s.className = 'word';
        s.textContent = w + (i < arr.length - 1 ? '' : '');
        sub2.appendChild(s);
      });
      p.appendChild(sub1); p.appendChild(sub2);
      gsap.set(big, { autoAlpha: 0, y: -240, scale: 1, transformOrigin: '50% 50%' });
      gsap.set([...sub1.querySelectorAll('.word'), ...sub2.querySelectorAll('.word')],
        { autoAlpha: 0, y: 24 });
      p._refs = { big, sub1, sub2 };
    }, 0);
    const r = page._refs;

    // Entrada brutal del 700 desde arriba.
    tl.to(r.big, {
      autoAlpha: 1, y: 0, duration: 1.0, ease: 'power4.out'
    }, 0.5);
    // Impacto al aterrizar.
    tl.to(r.big, {
      scale: 1.06, duration: 0.18, ease: 'power1.out'
    }, 1.5);
    tl.to(r.big, {
      scale: 1, duration: 0.25, ease: 'power2.out'
    }, 1.68);
    // Sub-titles palabra a palabra.
    const words = [
      ...r.sub1.querySelectorAll('.word'),
      ...r.sub2.querySelectorAll('.word')
    ];
    tl.to(words, {
      autoAlpha: 1, y: 0, duration: 0.5, ease: 'power2.out', stagger: 0.12
    }, 1.9);
    this.state.timelines.push(tl);
    return tl.then();
  },

  // Puls. 55 · Cierre Victoria · fondo BLANCO + logo completo + sello aniversario.
  // NO incluimos SLOGAN.svg suelto: el logo maestro ya tiene "CAPITAL DE LA
  // MONASTRELL" embebido, ponerlo otra vez sería duplicado.
  stepCierreVictoria() {
    const tl = gsap.timeline();
    const page = this._crossfade(tl, 'cierre', (p) => {
      p.classList.add('bro-cierre');

      const logoBox = document.createElement('div'); logoBox.className = 'bro-cierre-logo';
      injectSVG(logoBox, this.state.preloader.getSVG(LOGO_COMPLETO), { prefix: 'bro-cierre-logo' });
      p.appendChild(logoBox);

      const sello = document.createElement('div'); sello.className = 'bro-cierre-sello';
      const s700 = document.createElement('p'); s700.className = 'bro-cierre-sello-700'; s700.textContent = '700';
      const div  = document.createElement('div'); div.className = 'bro-cierre-sello-divider';
      const fechas = document.createElement('p'); fechas.className = 'bro-cierre-sello-fechas'; fechas.textContent = '1327 · 2027';
      sello.appendChild(s700); sello.appendChild(div); sello.appendChild(fechas);
      p.appendChild(sello);

      gsap.set(logoBox, { autoAlpha: 0, scale: 0.95, transformOrigin: '50% 50%' });
      gsap.set(sello, { autoAlpha: 0, rotation: -30, scale: 0.7, transformOrigin: '50% 50%' });

      p._refs = { logoBox, sello };
    }, 0);

    const r = page._refs;
    tl.to(r.logoBox, { autoAlpha: 1, scale: 1, duration: 0.9, ease: 'power2.out' }, 0.5);
    tl.to(r.sello, {
      autoAlpha: 1, rotation: 0, scale: 1, duration: 0.9, ease: 'back.out(1.7)'
    }, 1.1);
    this.state.timelines.push(tl);
    return tl.then();
  },

  // Puls. 56 · Pantalla de transición a alcaldesa.
  stepTransitAlcaldesa() {
    const tl = gsap.timeline();
    const page = this._crossfade(tl, 'transit', (p) => {
      p.classList.add('bro-transit');
      const iso = document.createElement('div'); iso.className = 'bro-transit-iso';
      const { svg } = injectSVG(iso, this.state.preloader.getSVG(ISOTIPO), { prefix: 'bro-transit-iso' });
      recolorSVG(svg, '#FFFFFF');
      p.appendChild(iso);
      gsap.set(iso, { autoAlpha: 0 });
      p._refs = { iso };
    }, 0);
    const r = page._refs;
    tl.to(r.iso, { autoAlpha: 0.5, duration: 0.6, ease: 'power2.out' }, 0.4);
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
