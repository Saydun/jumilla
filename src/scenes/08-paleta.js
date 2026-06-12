// 08-paleta.js
// BLOQUE 2.5 · Paleta de colores · Pulsaciones 30-36 (GUION_TECNICO.md).
//
//   step(1) · Puls. 30 · Intro
//     "Una paleta / inspirada en Jumilla." sobre fondo BLANCO (texto negro), stagger.
//   step(2-6) · Puls. 31-35 · Los 5 colores uno a uno
//     Muestra grande (480 px diám.) centrada izq. + ficha grande dcha. Al avanzar, el
//     anterior se reduce a 100 px y migra a la franja inferior; entra el siguiente.
//   step(7) · Puls. 36 · Paleta completa
//     Los 5 swatches morphean a la grid (220×220, border-radius 18 px) con margen amplio;
//     debajo de cada uno aparece su ficha pequeña (todo en la misma página → sin
//     transición rara entre páginas).
//
// Fondo BLANCO, textos NEGROS (para que el Negro Enriquecido sea visible como color).

import { gsap } from 'gsap';

const COLORES = [
  { name: 'Monastrell',         hex: '#85004D', cmyk: 'C10 M100 Y0 K50',  desc: 'EL ALMA DEL TERRITORIO' },
  { name: 'Azul Heráldico',     hex: '#1B5C9D', cmyk: 'C92 M63 Y10 K1',   desc: 'EL CIELO Y LA INSTITUCIÓN' },
  { name: 'Púrpura Profundo',   hex: '#54334C', cmyk: 'C64 M80 Y40 K42',  desc: 'LA MADUREZ DEL VINO' },
  { name: 'Verde Envero',       hex: '#428C42', cmyk: 'C76 M22 Y92 K6',   desc: 'LA VID EN TRANSFORMACIÓN' },
  { name: 'Negro Enriquecido',  hex: '#121212', cmyk: 'C60 M50 Y50 K100', desc: 'EL PESO DE LA HISTORIA' }
];

// Geometría (px de stage 2048×768).
const HERO     = { x: 640, y: 320, size: 480 };
const PARK_Y   = 685;
const PARK_X   = [724, 874, 1024, 1174, 1324];                 // 5 slots, 50 px de gap, centrados
// Paleta completa: bloques de 220 px con 80 px de gap → margen lateral 314 px (respira).
const GRID     = { y: 290, size: 220, radius: 18, ficheY: 440, cx: [424, 724, 1024, 1324, 1624] };

export default {
  id: 'paleta',
  pulsaciones: 7,
  state: null,

  setup(stage /*, preloader */) {
    this.state = { stage, timelines: [] };
    stage.style.background = '';

    const root = document.createElement('div');
    root.className = 'pal-root';
    stage.appendChild(root);
    this.state.root = root;

    // ---- Puls. 30 · Intro ----
    const intro = document.createElement('div');
    intro.className = 'pal-page pal-intro';
    root.appendChild(intro);
    const i1 = document.createElement('p'); i1.className = 'pal-intro-line1'; i1.textContent = 'Una paleta';
    const i2 = document.createElement('p'); i2.className = 'pal-intro-line2'; i2.textContent = 'inspirada en Jumilla.';
    const isub = document.createElement('p'); isub.className = 'pal-intro-sub'; isub.textContent = '5 COLORES QUE CUENTAN LA HISTORIA DEL TERRITORIO.';
    intro.appendChild(i1); intro.appendChild(i2); intro.appendChild(isub);
    this.state.intro = intro;
    this.state.introLines = [i1, i2, isub];
    gsap.set([i1, i2, isub], { autoAlpha: 0, y: 30 });

    // ---- Stage compartido para puls. 31-36 · 5 swatches + 1 ficha grande + 5 fichitas ----
    const stagePage = document.createElement('div');
    stagePage.className = 'pal-page';
    root.appendChild(stagePage);
    gsap.set(stagePage, { autoAlpha: 0 });
    this.state.stagePage = stagePage;

    // 5 swatches: arrancan ocultos en estado HERO base (centrados con xPercent/yPercent -50).
    this.state.swatches = COLORES.map((c) => {
      const sw = document.createElement('div');
      sw.className = 'pal-swatch';
      sw.style.background = c.hex;
      stagePage.appendChild(sw);
      gsap.set(sw, {
        left: HERO.x, top: HERO.y, xPercent: -50, yPercent: -50,
        width: HERO.size, height: HERO.size, borderRadius: HERO.size / 2,
        autoAlpha: 0, scale: 0, transformOrigin: '50% 50%'
      });
      return sw;
    });

    // Ficha grande (hero): única, se reescribe su contenido en cada puls. 31-35.
    const ficha = document.createElement('div');
    ficha.className = 'pal-ficha';
    const fName = document.createElement('p'); fName.className = 'pal-ficha-name';
    const fDesc = document.createElement('p'); fDesc.className = 'pal-ficha-desc';
    const fHex  = document.createElement('p'); fHex.className  = 'pal-ficha-tech';
    const fCmyk = document.createElement('p'); fCmyk.className = 'pal-ficha-tech';
    ficha.appendChild(fName); ficha.appendChild(fDesc); ficha.appendChild(fHex); ficha.appendChild(fCmyk);
    stagePage.appendChild(ficha);
    gsap.set(ficha, { autoAlpha: 0, x: 40 });
    this.state.ficha = { el: ficha, name: fName, desc: fDesc, hex: fHex, cmyk: fCmyk };

    // 5 fichitas pequeñas: posicionadas EXACTAMENTE bajo cada slot de la grid (para que
    // coincidan con los swatches cuando se morpheen en puls. 36). Empiezan ocultas.
    this.state.fichitas = COLORES.map((c, i) => {
      const fi = document.createElement('div');
      fi.className = 'pal-fichita';
      const n  = document.createElement('p'); n.className  = 'pal-fichita-name'; n.textContent  = c.name;
      const d  = document.createElement('p'); d.className  = 'pal-fichita-desc'; d.textContent  = c.desc;
      const h  = document.createElement('p'); h.className  = 'pal-fichita-tech'; h.textContent  = c.hex.toUpperCase();
      const cm = document.createElement('p'); cm.className = 'pal-fichita-tech is-muted'; cm.textContent = c.cmyk;
      fi.appendChild(n); fi.appendChild(d); fi.appendChild(h); fi.appendChild(cm);
      stagePage.appendChild(fi);
      gsap.set(fi, {
        left: GRID.cx[i], top: GRID.ficheY, xPercent: -50,    // centrada bajo su swatch
        autoAlpha: 0, y: 16
      });
      return fi;
    });
  },

  step(n) {
    switch (n) {
      case 1: return this.stepIntro();
      case 2: case 3: case 4: case 5: case 6:
        return this.stepColor(n - 2);   // 0..4
      case 7: return this.stepPaletaCompleta();
      default: return Promise.resolve();
    }
  },

  // Puls. 30 · Intro · stagger desde abajo.
  stepIntro() {
    const tl = gsap.timeline();
    tl.to(this.state.introLines, {
      autoAlpha: 1, y: 0, duration: 0.8, ease: 'power2.out', stagger: 0.25
    });
    this.state.timelines.push(tl);
    return tl.then();
  },

  // Puls. 31-35 · Mueve el anterior a la franja parqueada y trae el nuevo al hero.
  stepColor(i) {
    const tl = gsap.timeline();

    // Cross-fade desde la intro (solo en la primera transición).
    if (i === 0) {
      tl.to(this.state.intro, { autoAlpha: 0, duration: 0.5, ease: 'power2.inOut' }, 0);
      tl.set(this.state.stagePage, { autoAlpha: 1 }, 0.5);
    }
    const at0 = i === 0 ? 0.5 : 0;

    // Anterior → franja parqueada (si lo hay).
    if (i > 0) {
      const prev = this.state.swatches[i - 1];
      const pSize = 100;
      tl.to(prev, {
        left: PARK_X[i - 1], top: PARK_Y,
        width: pSize, height: pSize, borderRadius: pSize / 2,
        duration: 0.6, ease: 'power2.inOut'
      }, at0);
      tl.to(this.state.ficha.el, { autoAlpha: 0, x: 40, duration: 0.3, ease: 'power2.in' }, at0);
    }

    // Reescribe la ficha grande con los datos del color actual mientras está invisible.
    tl.add(() => this._setFicha(COLORES[i]), at0 + 0.3);

    // Nuevo color entra al hero desde scale 0 (back.out).
    const cur = this.state.swatches[i];
    gsap.set(cur, {
      left: HERO.x, top: HERO.y, width: HERO.size, height: HERO.size,
      borderRadius: HERO.size / 2, scale: 0, autoAlpha: 0
    });
    tl.to(cur, {
      autoAlpha: 1, scale: 1, duration: 0.8, ease: 'back.out(1.4)'
    }, at0 + 0.2);

    // Ficha grande entra con fade + leve slide desde la derecha.
    tl.to(this.state.ficha.el, {
      autoAlpha: 1, x: 0, duration: 0.6, ease: 'power2.out'
    }, at0 + 0.4);

    this.state.timelines.push(tl);
    return tl.then();
  },

  _setFicha(c) {
    const f = this.state.ficha;
    f.name.textContent = c.name;
    f.desc.textContent = c.desc;
    f.hex.textContent  = 'HEX  ·  ' + c.hex.toUpperCase();
    f.cmyk.textContent = 'CMYK  ·  ' + c.cmyk;
  },

  // Puls. 36 · Paleta completa · los 5 swatches morphean a la grid y aparecen las
  // fichas pequeñas debajo de cada uno (todo en la misma página, sin cross-fade raro).
  stepPaletaCompleta() {
    const tl = gsap.timeline();
    // Saca la ficha grande de la pulsación anterior.
    tl.to(this.state.ficha.el, { autoAlpha: 0, duration: 0.4, ease: 'power2.inOut' }, 0);
    // Morphing simultáneo: los 5 swatches viajan a sus posiciones de grid (rectángulos
    // 220×220, border-radius 18). Cada uno desde donde estaba (parqueado o hero).
    this.state.swatches.forEach((sw, i) => {
      tl.to(sw, {
        left: GRID.cx[i], top: GRID.y,
        width: GRID.size, height: GRID.size, borderRadius: GRID.radius,
        duration: 0.8, ease: 'power2.inOut'
      }, 0.2);
    });
    // Fichitas debajo, con stagger 0.1 s tras el morph.
    tl.to(this.state.fichitas, {
      autoAlpha: 1, y: 0, duration: 0.5, ease: 'power2.out', stagger: 0.1
    }, '>0.05');
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
