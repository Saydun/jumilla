// 05-revelacion-logo.js
// BLOQUE 2.4 · Revelación del logo · Revelación PROGRESIVA Y NARRATIVA (15 pulsaciones).
//
// Primero se presentan los CONCEPTOS de la marca, UNO POR PULSACIÓN, cada uno centrado y
// luego recogido a la franja inferior como "ya presentado"; después se ENSAMBLA el logo.
//
//   step 1  · A   · Tensión previa (punto de luz sobre negro)
//   step 2-6  · B1-B5 · Los 5 colores, uno por pulsación (centrado → franja)
//   step 7-8  · C1-C2 · Las 2 tipografías: MATCH (en Match) y BEBAS NEUE (en Bebas)
//   step 9-11 · D1-D3 · Los 3 iconos, uno por pulsación, con "draw" (centrado → franja)
//   step 12 · E   · Las letras JU-MI-LLA en su posición real del logo
//   step 13 · F   · Ensamblado: los iconos vuelan de la franja a su sitio canónico
//   step 14 · G   · El slogan CAPITAL DE LA MONASTRELL (logo completo)
//   step 15 · H   · Variantes del logo (grid de 4)
//
// Fidelidad pixel-perfect a CUALQUIER escala de pantalla: las letras, los iconos y el
// slogan finales son piezas del SVG maestro reveladas en su posición real. El vuelo de los
// iconos se calcula en runtime midiendo (getBoundingClientRect) dónde renderiza realmente
// cada icono del maestro y la escala del stage, así que no depende de constantes.

import { gsap } from 'gsap';
import { MotionPathPlugin } from 'gsap/MotionPathPlugin';
import { injectSVG, setupStrokeDraw, recolorSVG } from '../utils/svg-helpers.js';

gsap.registerPlugin(MotionPathPlugin);

const MONASTRELL = '#85004D';
const CREMA = '#F7F1EC';
const MASTER = '/logo/LOGO_COMPLETO_JUMILLA_TURISMO.svg';

const CX = 1024, CY = 330;        // centro de la zona "hero"
const STRIP_Y = 700;              // franja inferior
const FLYER_H = 200;              // alto base del icono centrado (px de stage)

const COLORS = [
  { name: 'MONASTRELL', hex: '#85004D' },
  { name: 'AZUL HERÁLDICO', hex: '#1B5C9D' },
  { name: 'PÚRPURA PROFUNDO', hex: '#54334C' },
  { name: 'VERDE ENVERO', hex: '#428C42' },
  { name: 'NEGRO ENRIQUECIDO', hex: '#121212' }
];
const COLOR_SLOTS = [600, 672, 744, 816, 888];
const TYPO = [
  { word: 'Match', font: "'Match', sans-serif", role: 'TIPOGRAFÍA PRINCIPAL', slot: 1010 },
  { word: 'Bebas Neue', font: "'Bebas Neue', sans-serif", role: 'TIPOGRAFÍA SECUNDARIA', slot: 1150 }
];
// Iconos en orden de aparición; slot en la franja inferior.
const ICON_ORDER = [
  { name: 'castillo', label: 'PATRIMONIO', slot: 1280 },
  { name: 'uvas', label: 'ORIGEN', slot: 1375 },
  { name: 'botella', label: 'VINO', slot: 1470 }
];

export default {
  id: 'revelacion-logo',
  pulsaciones: 15,
  state: null,

  // ----------------------------------------------------------------
  setup(stage, preloader) {
    this.state = { stage, preloader, timelines: [] };
    stage.style.background = '#000';

    const root = document.createElement('div');
    root.className = 'reveal-root';
    stage.appendChild(root);
    this.state.root = root;

    const bg = document.createElement('div');
    bg.className = 'reveal-bg';
    root.appendChild(bg);
    this.state.bg = bg;

    const dot = document.createElement('div');
    dot.className = 'reveal-dot';
    root.appendChild(dot);
    gsap.set(dot, { autoAlpha: 0, scale: 1 });
    this.state.dot = dot;

    // --- Logo maestro (oculto): letras, iconos y slogan en su posición real. ---
    const { svg: master } = injectSVG(root, preloader.getSVG(MASTER), { prefix: 'master' });
    master.classList.add('reveal-master');
    gsap.set(master, { xPercent: -50, yPercent: -50 });
    this.state.master = master;

    const layer = master.querySelector('g');
    const wrapper = layer.querySelector(':scope > g') || layer;
    const letterBlocks = [];
    const iconPaths = [];
    let sloganGroup = null;
    Array.from(wrapper.children).forEach((el) => {
      const tag = el.tagName.toLowerCase();
      if (tag === 'g') {
        const cls = el.querySelector('path, polygon')?.getAttribute('class') || '';
        if (cls.includes('cls-2')) sloganGroup = el;
        else letterBlocks.push(el);
      } else if (tag === 'path' || tag === 'polygon') {
        iconPaths.push(el);
      }
    });
    const byY = (a, b) => a.getBBox().y - b.getBBox().y;
    letterBlocks.sort(byY);   // [JU, MI, LLA]
    iconPaths.sort(byY);      // [botella(arriba), castillo(centro), uvas(abajo)]
    this.state.letters = letterBlocks;
    this.state.slogan = sloganGroup;
    this.state.masterIconByName = { botella: iconPaths[0], castillo: iconPaths[1], uvas: iconPaths[2] };

    // Ocultar todas las piezas del maestro (se revelan en E/F/G).
    gsap.set([...letterBlocks, sloganGroup, ...iconPaths], { autoAlpha: 0 });
    gsap.set(letterBlocks, { y: -20 });

    // --- Iconos voladores (clones del maestro), centrados y ocultos. ---
    // Iconos voladores: se inyectan los SVG de icono individuales (mismo método que el
    // maestro/variantes, que sí renderizan) dentro de un DIV que anima GSAP. El estado
    // final usa los iconos del MAESTRO (revelados en F), así que la fidelidad no depende
    // del flyer.
    const ICON_FILE = { castillo: '/logo/CASTILLO.svg', uvas: '/logo/UVAS.svg', botella: '/logo/BOTELLA.svg' };
    this.state.flyers = {};
    ICON_ORDER.forEach(({ name, label }) => {
      const wrap = document.createElement('div');
      wrap.className = 'rev-flyer';
      const { svg } = injectSVG(wrap, preloader.getSVG(ICON_FILE[name]), { prefix: `fly-${name}` });
      svg.classList.add('rev-flyer-svg');
      root.appendChild(wrap);
      gsap.set(wrap, { left: CX, top: CY, xPercent: -50, yPercent: -50, autoAlpha: 0 });
      const strokes = setupStrokeDraw(svg, { color: MONASTRELL, strokeWidth: 2 });

      const lbl = document.createElement('div');
      lbl.className = 'rev-iconlabel';
      lbl.textContent = label;
      root.appendChild(lbl);
      gsap.set(lbl, { left: CX, top: CY + 150, xPercent: -50, yPercent: -50, autoAlpha: 0 });

      this.state.flyers[name] = { wrap, svg, strokes, lbl };
    });

    // --- Colores (muestra grande centrada). ---
    this.state.colors = COLORS.map((c) => {
      const sw = document.createElement('div');
      sw.className = 'rev-cswatch';
      sw.style.background = c.hex;
      root.appendChild(sw);
      gsap.set(sw, { left: CX, top: CY, xPercent: -50, yPercent: -50, autoAlpha: 0 });

      const name = document.createElement('div');
      name.className = 'rev-cname';
      name.textContent = c.name;
      root.appendChild(name);
      gsap.set(name, { left: CX, top: CY + 175, xPercent: -50, yPercent: -50, autoAlpha: 0 });

      const hex = document.createElement('div');
      hex.className = 'rev-chex';
      hex.textContent = c.hex.toUpperCase();
      root.appendChild(hex);
      gsap.set(hex, { left: CX, top: CY + 222, xPercent: -50, yPercent: -50, autoAlpha: 0 });

      return { sw, name, hex };
    });

    // --- Tipografías (nombre en su propia fuente). ---
    this.state.typos = TYPO.map((t) => {
      const word = document.createElement('div');
      word.className = 'rev-typoword';
      word.style.fontFamily = t.font;
      word.textContent = t.word;
      root.appendChild(word);
      gsap.set(word, { left: CX, top: CY, xPercent: -50, yPercent: -50, autoAlpha: 0 });

      const role = document.createElement('div');
      role.className = 'rev-typorole';
      role.textContent = t.role;
      root.appendChild(role);
      gsap.set(role, { left: CX, top: CY + 130, xPercent: -50, yPercent: -50, autoAlpha: 0 });

      return { word, role };
    });
  },

  step(n) {
    const s = this.state;
    switch (n) {
      case 1: return this.stepA();
      case 2: return this.stepColor(0, true);   // B1 (con cross-fade de fondo)
      case 3: return this.stepColor(1);
      case 4: return this.stepColor(2);
      case 5: return this.stepColor(3);
      case 6: return this.stepColor(4);
      case 7: return this.stepTypo(0);           // C1 (recoge color 5)
      case 8: return this.stepTypo(1);           // C2 (recoge Match)
      case 9: return this.stepIcon(0);           // D1 (recoge Bebas)
      case 10: return this.stepIcon(1);          // D2
      case 11: return this.stepIcon(2);          // D3
      case 12: return this.stepLetters();        // E (recoge último icono)
      case 13: return this.stepAssemble();       // F
      case 14: return this.stepSlogan();         // G
      case 15: return this.stepVariantes();      // H
      default: return Promise.resolve();
    }
  },

  // Mueve un elemento centrado a un slot de la franja inferior (recoge), con labels fade.
  _park(main, labels, slotX, scale, tl, at = 0) {
    tl.to(main, { x: slotX - CX, y: STRIP_Y - CY, scale, duration: 0.7, ease: 'power2.inOut' }, at);
    if (labels && labels.length) tl.to(labels, { autoAlpha: 0, duration: 0.4, ease: 'power1.out' }, at);
  },

  // A · Tensión previa.
  stepA() {
    const { dot } = this.state;
    const tl = gsap.timeline({
      onComplete: () => {
        this.state.dotPulse = gsap.to(dot, {
          scale: 1.2, opacity: 0.7, duration: 1, ease: 'sine.inOut', repeat: -1, yoyo: true
        });
      }
    });
    tl.to(dot, { autoAlpha: 1, duration: 1.2, ease: 'power2.out' });
    this.state.timelines.push(tl);
    return tl.then();
  },

  // B1-B5 · Un color por pulsación: el anterior se recoge a la franja y entra el nuevo.
  stepColor(i, withBgFade = false) {
    const tl = gsap.timeline();
    if (withBgFade) {
      if (this.state.dotPulse) this.state.dotPulse.kill();
      tl.to(this.state.bg, { backgroundColor: CREMA, duration: 0.6, ease: 'power2.inOut' }, 0);
      tl.to(this.state.dot, { autoAlpha: 0, duration: 0.4 }, 0);
    } else {
      // Recoger el color anterior a su slot.
      const prev = this.state.colors[i - 1];
      this._park(prev.sw, [prev.name, prev.hex], COLOR_SLOTS[i - 1], 46 / 240, tl, 0);
    }
    // Entrar el color nuevo, centrado.
    const c = this.state.colors[i];
    gsap.set([c.sw], { scale: 0.6 });
    tl.to(c.sw, { autoAlpha: 1, scale: 1, duration: 0.7, ease: 'back.out(1.4)' }, withBgFade ? 0.5 : 0.25);
    tl.to([c.name, c.hex], { autoAlpha: 1, duration: 0.6, ease: 'power2.out' }, withBgFade ? 0.7 : 0.45);
    this.state.timelines.push(tl);
    return tl.then();
  },

  // C1-C2 · Las dos tipografías. La pieza anterior (último color o Match) se recoge.
  stepTypo(i) {
    const tl = gsap.timeline();
    if (i === 0) {
      const prev = this.state.colors[4];
      this._park(prev.sw, [prev.name, prev.hex], COLOR_SLOTS[4], 46 / 240, tl, 0);
    } else {
      const prev = this.state.typos[0];
      this._park(prev.word, [prev.role], TYPO[0].slot, 0.28, tl, 0);
    }
    const t = this.state.typos[i];
    gsap.set(t.word, { scale: 0.92 });
    tl.to(t.word, { autoAlpha: 1, scale: 1, duration: 0.8, ease: 'power2.out' }, 0.3);
    tl.to(t.role, { autoAlpha: 1, duration: 0.6, ease: 'power2.out' }, 0.55);
    this.state.timelines.push(tl);
    return tl.then();
  },

  // D1-D3 · Un icono por pulsación, con "draw" (contorno → relleno). El anterior se recoge.
  stepIcon(i) {
    const tl = gsap.timeline();
    if (i === 0) {
      const prev = this.state.typos[1];
      this._park(prev.word, [prev.role], TYPO[1].slot, 0.28, tl, 0);
    } else {
      const prevDef = ICON_ORDER[i - 1];
      const prev = this.state.flyers[prevDef.name];
      this._park(prev.wrap, [prev.lbl], prevDef.slot, 50 / FLYER_H, tl, 0);
    }
    const def = ICON_ORDER[i];
    const f = this.state.flyers[def.name];
    // Revelar con un tween (no tl.set: el .set posicional no se aplica de forma fiable aquí).
    tl.to(f.wrap, { autoAlpha: 1, duration: 0.3, ease: 'power1.out' }, 0.3);
    f.strokes.forEach(({ path }) => {
      tl.to(path, { strokeDashoffset: 0, duration: 0.8, ease: 'power2.out' }, 0.3);
      tl.to(path, { fillOpacity: 1, strokeWidth: 0, duration: 0.3, ease: 'power1.out' }, 1.1);
    });
    tl.to(f.lbl, { autoAlpha: 1, duration: 0.5, ease: 'power1.out' }, 0.9);
    this.state.timelines.push(tl);
    return tl.then();
  },

  // E · Recoge el último icono y revela las letras JU-MI-LLA en su posición real.
  stepLetters() {
    const tl = gsap.timeline();
    const lastDef = ICON_ORDER[2];
    const last = this.state.flyers[lastDef.name];
    this._park(last.wrap, [last.lbl], lastDef.slot, 50 / FLYER_H, tl, 0);
    this.state.letters.forEach((g, i) => {
      tl.to(g, { autoAlpha: 1, y: 0, duration: 0.7, ease: 'power3.out' }, 0.4 + i * 0.18);
    });
    this.state.timelines.push(tl);
    return tl.then();
  },

  // F · Ensamblado. Cada icono vuela desde su slot hasta donde renderiza el icono del
  // maestro (medido en runtime → correcto a cualquier escala) y al llegar se revela el
  // icono del maestro (pixel-perfect) y se apaga el flyer.
  stepAssemble() {
    const tl = gsap.timeline();
    const stage = this.state.stage;
    const stageScale = stage.getBoundingClientRect().width / stage.offsetWidth;

    ICON_ORDER.forEach((def, idx) => {
      const f = this.state.flyers[def.name];
      const masterPath = this.state.masterIconByName[def.name];

      // Posición/tamaño reales (en pantalla) del flyer ahora y del icono del maestro.
      const fr = f.wrap.getBoundingClientRect();
      const mr = masterPath.getBoundingClientRect();
      const dx = ((mr.left + mr.width / 2) - (fr.left + fr.width / 2)) / stageScale;
      const dy = ((mr.top + mr.height / 2) - (fr.top + fr.height / 2)) / stageScale;
      const curX = gsap.getProperty(f.wrap, 'x');
      const curY = gsap.getProperty(f.wrap, 'y');
      const curScale = gsap.getProperty(f.wrap, 'scaleX');
      const targetX = curX + dx;
      const targetY = curY + dy;
      const targetScale = curScale * (mr.height / fr.height);
      const ctrlX = (curX + targetX) / 2;
      const ctrlY = Math.min(curY, targetY) - 160;  // bombeo hacia arriba → curva

      const at = idx * 0.12;
      tl.to(f.wrap, {
        motionPath: { path: [{ x: curX, y: curY }, { x: ctrlX, y: ctrlY }, { x: targetX, y: targetY }], curviness: 1.3 },
        scale: targetScale, duration: 1.2, ease: 'power2.inOut'
      }, at);
      // Al aterrizar: cross-fade flyer → icono del maestro (estado final pixel-perfect).
      tl.to(masterPath, { autoAlpha: 1, duration: 0.25, ease: 'power1.out' }, at + 1.05);
      tl.to(f.wrap, { autoAlpha: 0, duration: 0.25, ease: 'power1.out' }, at + 1.1);
    });

    this.state.timelines.push(tl);
    return tl.then();
  },

  // G · Se apagan los conceptos que quedaban en la franja y aparece el slogan.
  stepSlogan() {
    const tl = gsap.timeline();
    const remnants = [];
    this.state.colors.forEach((c) => remnants.push(c.sw));
    this.state.typos.forEach((t) => remnants.push(t.word));
    tl.to(remnants, { autoAlpha: 0, duration: 0.5, ease: 'power2.inOut' }, 0);
    tl.to(this.state.slogan, { autoAlpha: 1, duration: 0.8, ease: 'power2.out' }, 0.3);
    this.state.timelines.push(tl);
    return tl.then();
  },

  // H · Variantes del logo.
  stepVariantes() {
    const { root, preloader } = this.state;
    const tl = gsap.timeline();
    const flyerWraps = Object.values(this.state.flyers).map((f) => f.wrap);
    tl.to([this.state.master, ...flyerWraps], { autoAlpha: 0, duration: 0.4, ease: 'power2.inOut' }, 0);

    const variants = document.createElement('div');
    variants.className = 'reveal-variants';
    root.appendChild(variants);
    this.state.variants = variants;

    // 5 variantes en fila:
    //  - mode 'color'  → fondo blanco (tarjeta), logo con sus colores.
    //  - mode 'blanco' → fondo Monastrell, logo blanco.
    //  - mode 'negro'  → fondo gris claro, logo recoloreado a negro pleno.
    const defs = [
      { path: '/logo/LOGO_COMPLETO_JUMILLA_TURISMO.svg', label: 'PRINCIPAL',          prefix: 'v-principal',  mode: 'color'  },
      { path: '/logo/LOGO_HORIZONTAL.svg',               label: 'HORIZONTAL',         prefix: 'v-horizontal', mode: 'color'  },
      { path: '/logo/LOGO_ISOTIPO.svg',                  label: 'ISOTIPO',            prefix: 'v-isotipo',    mode: 'color'  },
      { path: '/logo/LOGO_COMPLETO_BLANCO.svg',          label: 'UNA TINTA · BLANCO', prefix: 'v-blanco',     mode: 'blanco' },
      { path: '/logo/LOGO_COMPLETO_JUMILLA_TURISMO.svg', label: 'UNA TINTA · NEGRO',  prefix: 'v-negro',      mode: 'negro'  }
    ];
    const cols = defs.map(({ path, label, prefix, mode }) => {
      const col = document.createElement('div');
      col.className = 'variant-col';
      const frame = document.createElement('div');
      const frameMods = mode === 'blanco' ? ' is-monastrell'
                      : mode === 'negro'  ? ' is-gris'
                      : '';
      frame.className = 'variant-frame' + frameMods;
      const { svg } = injectSVG(frame, preloader.getSVG(path), { prefix });
      // Modo 'negro' · forzar todo el SVG a negro pleno (sobre fondo gris claro).
      if (mode === 'negro') recolorSVG(svg, '#000000');
      col.appendChild(frame);
      const lbl = document.createElement('div');
      lbl.className = 'variant-label';
      lbl.textContent = label;
      col.appendChild(lbl);
      variants.appendChild(col);
      return { col, lbl };
    });
    gsap.set(cols.map((c) => c.col), { autoAlpha: 0, x: -40 });
    gsap.set(cols.map((c) => c.lbl), { autoAlpha: 0 });
    tl.to(cols.map((c) => c.col), { autoAlpha: 1, x: 0, duration: 0.6, ease: 'power2.out', stagger: 0.12 }, 0.4);
    tl.to(cols.map((c) => c.lbl), { autoAlpha: 1, duration: 0.4, ease: 'power1.out' }, '+=0.1');

    this.state.timelines.push(tl);
    return tl.then();
  },

  teardown() {
    if (!this.state) return;
    if (this.state.dotPulse) this.state.dotPulse.kill();
    this.state.timelines.forEach((tl) => tl.kill());
    this.state.stage.style.background = '';
    this.state = null;
  }
};
