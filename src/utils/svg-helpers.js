// svg-helpers.js
// Utilidades para inyectar SVG inline y prepararlos para animar con GSAP.
//
// Contexto: los SVG del manual (Illustrator) NO traen `id` en sus <path>; el color
// va por clase CSS (.cls-1 { fill: ... }) dentro de un <style> embebido. Para poder
// seleccionar y animar cada path con GSAP (DrawSVG / MorphSVG o la alternativa manual
// con stroke-dasharray) necesitamos asignar ids nosotros mismos tras la inyección.

/**
 * Parsea una cadena SVG y devuelve el elemento <svg> ya como nodo DOM.
 * Usa DOMParser para tolerar el prólogo <?xml ?> que traen los exports de Illustrator.
 */
export function parseSVG(svgText) {
  const doc = new DOMParser().parseFromString(svgText, 'image/svg+xml');
  const svg = doc.documentElement;
  if (svg.nodeName.toLowerCase() !== 'svg') {
    throw new Error('parseSVG: la cadena no contiene un <svg> válido');
  }
  // Importar al documento actual para que getTotalLength() y el render funcionen.
  return document.importNode(svg, true);
}

/**
 * Asigna ids automáticos a cada <path> de `root` que no tenga uno.
 * Formato: `${prefix}-0`, `${prefix}-1`, … (prefix por defecto: "path").
 *
 * Se usa un prefijo para poder dar un ámbito único por cada SVG inyectado
 * (p. ej. "ju", "botella"): si varios SVG comparten el documento, ids globales
 * como "path-0" colisionarían y romperían la selección. Con prefijo cada SVG
 * tiene su propio espacio de nombres ("ju-0", "botella-0", …).
 *
 * @returns {SVGPathElement[]} los paths (con id garantizado), en orden de documento.
 */
export function ensurePathIds(root, prefix = 'path') {
  const paths = Array.from(root.querySelectorAll('path'));
  paths.forEach((path, i) => {
    if (!path.id) {
      path.id = `${prefix}-${i}`;
    }
  });
  return paths;
}

/**
 * Aísla (scopea) las clases CSS del `<style>` embebido de un SVG renombrándolas con
 * un prefijo único, tanto en el `<style>` como en los atributos `class` de los nodos.
 *
 * CRÍTICO: los exports de Illustrator traen un `<style>` con clases genéricas
 * (`.cls-1`, `.cls-2`…) que NO están scopeadas al SVG: al inyectar varios SVG inline
 * en el mismo documento, esas reglas son GLOBALES y la última gana. Sin esto, p. ej.
 * el `.cls-1 { fill:#060703 }` del SLOGAN repinta de casi-negro las letras JU/MI/LLA
 * (que esperaban su propio `.cls-1 { fill:#85004d }`), y las versiones del logo
 * pierden sus colores. Con un prefijo por SVG cada uno conserva los suyos.
 */
export function scopeSvgClasses(svg, prefix) {
  const styleEls = svg.querySelectorAll('style');
  if (!styleEls.length) return;

  // 1) Recolectar los nombres de clase declarados en los <style> del SVG.
  const classNames = new Set();
  styleEls.forEach((s) => {
    (s.textContent.match(/\.[A-Za-z_][\w-]*/g) || []).forEach((m) => classNames.add(m.slice(1)));
  });
  if (!classNames.size) return;

  // 2) Renombrar esas clases en el texto del <style>.
  styleEls.forEach((s) => {
    let css = s.textContent;
    classNames.forEach((cn) => {
      css = css.replace(new RegExp('\\.' + cn + '\\b', 'g'), '.' + prefix + '-' + cn);
    });
    s.textContent = css;
  });

  // 3) Renombrar esas mismas clases en los atributos class de los nodos.
  svg.querySelectorAll('[class]').forEach((el) => {
    const updated = el.getAttribute('class')
      .split(/\s+/)
      .map((c) => (classNames.has(c) ? prefix + '-' + c : c))
      .join(' ');
    el.setAttribute('class', updated);
  });
}

/**
 * Inyecta un SVG (como texto) dentro de `container`, aísla sus clases y le asigna
 * ids a sus paths. El `prefix` se usa tanto para scopear las clases como para los ids,
 * así que debe ser único por SVG.
 * @returns {{ svg: SVGElement, paths: SVGPathElement[] }}
 */
export function injectSVG(container, svgText, { prefix = 'path' } = {}) {
  const svg = parseSVG(svgText);
  scopeSvgClasses(svg, prefix);
  container.appendChild(svg);
  const paths = ensurePathIds(svg, prefix);
  return { svg, paths };
}

/**
 * Fuerza el color de relleno de las formas del SVG mediante estilo inline,
 * que tiene más prioridad que la clase .cls-N del <style> embebido.
 * Necesario porque, p. ej., SLOGAN.svg viene en casi-negro (#060703) e
 * invisible sobre fondo oscuro: hay que repintarlo en Monastrell.
 */
export function recolorSVG(root, color, selector = 'path, polygon, rect, circle, ellipse, line') {
  root.querySelectorAll(selector).forEach((el) => {
    el.style.fill = color;
  });
}

/**
 * Prepara los paths de un SVG para el efecto "draw" manual (alternativa gratuita a
 * DrawSVG): pinta el trazo, deja el relleno presente pero transparente
 * (fill-opacity: 0) y el trazo "sin dibujar" (dashoffset = longitud total).
 * Animar `strokeDashoffset` de longitud → 0 dibuja el contorno; luego se sube
 * `fill-opacity` a 1 para macizar el icono.
 *
 * IMPORTANTE: el relleno se deja en el color final con fill-opacity 0 (NO en
 * `fill: none`), porque GSAP no puede interpolar `fill` desde el keyword "none"
 * hacia un color; sí puede animar el valor numérico `fill-opacity`.
 *
 * Usa vector-effect="non-scaling-stroke" para que el grosor del trazo no se
 * deforme al escalar el SVG vía CSS.
 *
 * @returns {{ path: SVGPathElement, length: number }[]}
 */
export function setupStrokeDraw(root, { color, strokeWidth = 2 } = {}) {
  // Acepta tanto un contenedor con varios <path> como un <path> suelto (p. ej. un
  // icono individual del logo maestro).
  const isPath = root.tagName && root.tagName.toLowerCase() === 'path';
  const paths = isPath ? [root] : Array.from(root.querySelectorAll('path'));
  return paths.map((path) => {
    const length = path.getTotalLength();
    path.setAttribute('vector-effect', 'non-scaling-stroke');
    path.style.fill = color;
    path.style.fillOpacity = '0';
    path.style.stroke = color;
    path.style.strokeWidth = String(strokeWidth);
    path.style.strokeDasharray = String(length);
    path.style.strokeDashoffset = String(length);
    return { path, length };
  });
}
