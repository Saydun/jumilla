# CLAUDE.md — Proyecto Presentación Marca Turística Jumilla

> Este archivo es el contexto maestro del proyecto. Claude Code debe leerlo al inicio de cada sesión antes de modificar cualquier código. Aquí están las decisiones de diseño, los constraints técnicos, las convenciones de nomenclatura y la información que nunca debe ser olvidada ni contradicha.

---

## 🎯 Qué es este proyecto

Una pieza web interactiva fullscreen que se proyecta sobre una pantalla LED de 8 x 3 metros durante un evento institucional. Es la presentación pública de la nueva marca turística del municipio de Jumilla bajo el claim **"Capital de la Monastrell"**.

NO es una web. NO es una landing page. NO es una app. Es una **pieza de proyección controlada por clicker**, donde cada pulsación de la flecha derecha del teclado avanza a la siguiente escena o disparador de animación.

El día del evento esta pieza correrá en pantalla completa en un portátil dedicado, con la salida HDMI o NDI enrutada al Resolume de la empresa que opera la pantalla LED.

---

## 📅 Datos del evento

| Dato | Valor |
|---|---|
| **Fecha** | Martes 2 de junio de 2026 |
| **Hora citación** | 18:30 h |
| **Cliente** | Ayuntamiento de Jumilla |
| **Agencia** | Victoria Crea |
| **Claim oficial** | Capital de la Monastrell |
| **Hito estratégico** | Preparación del 700 aniversario de la Monastrell (1327-2027) |

---

## 🖥️ Constraints técnicos NO NEGOCIABLES

### Resolución de salida
- **2048 x 768 píxeles**
- **Ratio: 8:3 (panorámico extremo, NO es 16:9)**
- Todo el diseño debe pensarse para este ratio. Las composiciones horizontales son la norma, las verticales son excepción.

### Modo de visualización
- **Fullscreen obligatorio** (`document.documentElement.requestFullscreen()`)
- Cursor oculto cuando está en fullscreen
- Fondo del navegador en negro absoluto para evitar cualquier filtración de color

### Control
- **Único input válido: tecla flecha derecha (`ArrowRight`)** para avanzar
- Opcional: flecha izquierda (`ArrowLeft`) para retroceder (útil en ensayos, en el evento real no debería usarse)
- Tecla `F` para entrar en fullscreen
- Tecla `Escape` para salir de fullscreen
- Tecla `R` para reiniciar la presentación desde el inicio (solo para ensayos)
- **No usar nunca clics de ratón como input de avance** (el clicker emula el teclado)

### Rendimiento
- Todas las animaciones deben correr a 60fps mínimo
- Usar `transform` y `opacity` para las animaciones (no `top`, `left`, `width`, `height` salvo necesidad)
- Precargar todos los SVG, fuentes e imágenes antes de permitir el inicio
- Mostrar una pantalla de "Cargando…" en Monastrell mientras se precarga todo
- Permitir arranque solo cuando el ready state esté al 100%

### Compatibilidad
- **Único navegador objetivo: Chrome última versión** (es el que se va a usar el día del evento)
- No hace falta soporte de Safari, Firefox, IE, móvil, ni nada
- No hace falta responsive: el target es siempre 2048x768
- Sí hace falta que se vea bien también en pantallas de desarrollo (1920x1080, 2560x1440…) — usar `transform: scale()` para adaptar manteniendo proporción 8:3

---

## 🎨 Marca: paleta cromática oficial

```css
:root {
  --monastrell:       #85004D;  /* Primario. El alma de la marca. */
  --azul-heraldico:   #1B5C9D;  /* Secundario. Patrimonio e institución. */
  --purpura-profundo: #54334C;  /* Acento. La madurez del vino. */
  --verde-envero:     #428C42;  /* Acento. Naturaleza y vid en transformación. */
  --negro-enriquecido:#121212;  /* Neutro. Texto y fondos. */

  /* Auxiliares para la presentación (no son colores de marca, son utilitarios) */
  --blanco:           #FFFFFF;
  --crema-suave:      #F7F1EC;
  --negro-puro:       #000000;
}
```

**REGLAS DE USO DEL COLOR:**
- El color primario por defecto es Monastrell. Si una escena no especifica color, usar Monastrell.
- Nunca usar colores fuera de esta paleta. Si una animación necesita un matiz intermedio, usar transparencias (`rgba`) sobre los colores oficiales.
- Los fondos por defecto son negro enriquecido (`#121212`) o blanco (`#FFFFFF`), nunca grises arbitrarios.

### ⚖️ REGLA DE CONTRASTE OBLIGATORIA (fondo según el elemento protagonista)

Al colocar cualquier elemento visual en pantalla, elegir el fondo según el color del **elemento protagonista** de la escena:

- Si el protagonista es **blanco o muy claro** → fondo **Negro Enriquecido `#121212`** o **Monastrell `#85004D`**.
- Si el protagonista es **Monastrell `#85004D`, Púrpura, Negro u otro color oscuro** → fondo **Blanco `#FFFFFF`** o **Crema Suave `#F7F1EC`**.
- Para **textos puramente tipográficos sin protagonista visual**, mantener Negro Enriquecido por defecto.
- **Excepción**: un punto/foco de luz que debe *brillar* necesita oscuridad — usar negro puro aunque el punto sea de color oscuro (caso de la puls. 15).

**Por qué**: el objetivo es legibilidad MÁXIMA en la pantalla LED de 8×3 m, donde el contraste se ve más exagerado que en monitor pero los matices se pierden. Monastrell sobre negro (≈2:1) se ve digno en monitor pero pobre en LED; Monastrell sobre claro es el contraste correcto.

**Escenarios validados** (combinaciones de referencia ya en uso):
- **Fondo Monastrell `#85004D` + elementos en blanco** → caso válido y recomendado (logo en su versión blanca, textos blancos). Es el de la pantalla de bienvenida (escena 00 · recepción).
- **Fondo crema `#F7F1EC` + elementos Monastrell/negro** → el de la revelación del logo (escena 05): el logo Monastrell vive sobre crema, con cross-fade de negro→crema antes de que entren las letras.
- **Fondo negro/oscuro + elementos blancos** → para texto blanco o el logo blanco sobre oscuro.

---

## 🔤 Tipografías oficiales

Las fuentes están en `/assets/fonts/`:

### Match (tipografía principal)
- Uso: titulares grandes, el bloque JU/MI/LLA, números grandes, datos destacados
- Carácter: expansiva, robusta, arquitectónica
- Cargar como `@font-face` desde los archivos locales en `/assets/fonts/Match/`

### Bebas Neue (tipografía secundaria)
- Uso: claim "CAPITAL DE LA MONASTRELL", subtítulos, etiquetas, textos institucionales
- Carácter: condensada, alta, industrial
- Cargar como `@font-face` desde los archivos locales en `/assets/fonts/Bebas Neue/`

**REGLAS DE USO TIPOGRÁFICO:**
- **Nunca usar tipografías del sistema** (Arial, Helvetica, etc.) salvo fallback de emergencia
- **Nunca cargar tipografías de Google Fonts ni CDNs externos** — la pieza debe funcionar 100% offline
- Cargar las fuentes con `font-display: block` para evitar parpadeos de fuentes del sistema antes de que carguen las reales
- Esperar a que `document.fonts.ready` resuelva antes de mostrar la pantalla de inicio

---

## 🖼️ Assets gráficos disponibles

Todos los SVG están en `/assets/logo/` y `/assets/icons/`. Lista completa:

### Logo y piezas tipográficas (en `/assets/logo/`)
| Archivo | Contenido | Uso |
|---|---|---|
| `JU.svg` | Letras "JU" | Bloque superior del stacking en la animación de revelación |
| `MI.svg` | Letras "MI" | Bloque central del stacking |
| `LLA.svg` | Letras "LLA" | Bloque inferior del stacking |
| `SLOGAN.svg` | Texto "CAPITAL DE LA MONASTRELL" en Bebas Neue | Claim oficial |
| `LOGO_COMPLETO_JUMILLA_TURISMO.svg` | Logo completo compuesto (JU/MI/LLA + iconos + slogan) | Versión principal |
| `LOGO_COMPLETO_BLANCO.svg` | Logo completo en blanco | Versión para fondos oscuros |
| `LOGO_HORIZONTAL.svg` | Versión horizontal del logo | Versiones del logo |
| `LOGO_ISOTIPO.svg` | Solo el isotipo | Versiones del logo |

### Iconografía (en `/assets/icons/`)
| Archivo | Contenido | Uso |
|---|---|---|
| `BOTELLA.svg` | Icono de tres botellas | Encaja en hueco de la "M" inicial (sustituye letra) |
| `CASTILLO.svg` | Icono del Castillo (almena) | Encaja en hueco de la "H" central (sustituye letra) |
| `UVAS.svg` | Icono de racimo de uvas con hojas | Encaja en hueco de la primera "L" (sustituye letra) |
| `PATRON.svg` | Patrón visual repetitivo | Fondos decorativos en bloques específicos |

**REGLAS DE USO DE LOS SVG:**
- Cargar los SVG **inline** en el HTML mediante fetch, NO con `<img>`. Esto permite manipular cada path con GSAP.
- Si los SVG no tienen `id` en cada path, añadirlos programáticamente con una función helper antes de animar.
- Mantener los viewBox originales; el escalado se hace con CSS (`width`, `height`).
- Usar `fill="currentColor"` cuando sea posible para poder cambiar el color con CSS.

**Herramientas estándar en `/src/utils/svg-helpers.js`** (usarlas siempre, no reinventarlas):
- `injectSVG(container, svgText, { prefix })` — inyecta el SVG inline y asigna `id` a cada `<path>` (`prefix-0`, `prefix-1`…). Usar un `prefix` único por SVG para evitar colisiones de id entre varios SVG del mismo documento.
- `ensurePathIds(root, prefix)` — solo la asignación de ids (cuando el SVG ya está inyectado).
- `recolorSVG(root, color)` — **fuerza el color de relleno** mediante estilo inline (gana a la clase `.cls-N` del `<style>` embebido del export de Illustrator). **OBLIGATORIO** para el SLOGAN y cualquier SVG que venga en casi-negro `#060703`: recolorearlo a **Monastrell** sobre fondo claro, o a **blanco** sobre fondo Monastrell. Aplicar siempre la regla de contraste de arriba al elegir el color.
- `setupStrokeDraw(root, { color, strokeWidth })` — prepara los paths para el efecto "draw" manual (trazo con `stroke-dasharray`/`stroke-dashoffset` + relleno por `fill-opacity`). Acepta un contenedor con varios `<path>` o un `<path>` suelto. Es la **alternativa gratuita a DrawSVG** (no tenemos licencia de los plugins de pago de GSAP). Nota: GSAP no interpola `fill` desde `none`, por eso el relleno se anima con `fill-opacity` 0→1, no con `fill`.

### 🏛️ REGLA DE FIDELIDAD AL MANUAL DE MARCA

> Cualquier composición del logo en cualquier escena debe ser **PIXEL-PERFECT** respecto al manual de marca. Las proporciones, posiciones y tamaños relativos entre piezas son **sagrados**. Si una animación requiere romper la composición, hacerlo solo durante la animación y volver siempre al estado canónico del manual.

**Cómo cumplirla (patrón recomendado):** cuando haya que mostrar el logo o partes de él, inyectar el SVG **maestro** (`LOGO_COMPLETO_JUMILLA_TURISMO.svg`) completo y en su posición/proporción reales, y animar solo la **opacidad** (o entradas que vuelven a la posición canónica) de cada pieza. NO posicionar `JU.svg`/`MI.svg`/etc. como elementos sueltos con coordenadas a mano: eso introduce deriva. La escena 05 (revelación del logo) es el ejemplo de referencia: identifica las piezas del maestro (letras = `<g>` con `cls-1`, slogan = `<g>` con `cls-2`, iconos = `<path>` sueltos) y las revela una a una. Estructura del maestro: viewBox `260.06 × 403.1`; filas JU (y≈0–92), MI (y≈106–197), LLA (y≈211–301) muy apretadas (~14.6 de separación); BOTELLA dcha. de JU, CASTILLO dcha. de MI, UVAS **izq.** de LLA; SLOGAN abajo (y≈329–403, color `#060703`).

**Verificación obligatoria:** comparar la composición final de la escena con el SVG maestro abierto directamente. Deben ser visualmente idénticos.

### Imágenes pendientes (Victoria las añadirá próximamente)
- Loop de bienvenida (vídeo o secuencia de imágenes de Jumilla)
- Loop de cocktail
- Mockups del manual de marca (mupi, folletos, gorra, camiseta, rollup, pulsera, web, móvil)
- Foto opcional de la alcaldesa Seve González

Cuando estos assets no estén disponibles todavía, usar **placeholders en color Monastrell** con texto descriptivo del contenido pendiente. Nunca dejar elementos vacíos.

---

## 📊 Datos clave de la encuesta (reales, validados)

Estos son los datos que aparecen en la pantalla en el bloque 2.2. **No inventar otros datos. No redondear sin permiso.**

| Dato | Valor exacto |
|---|---|
| Ciudadanos encuestados | **417** |
| Asocian Jumilla con el rojo vino | **52,37 %** |
| Identifican El Castillo como símbolo | **42,59 %** |
| Piden estilo elegante / clásico / atemporal | **63 %** |
| Encontraban atractiva la marca anterior | **9,78 %** |
| Quieren sentir orgullo con la nueva marca | **59,94 %** |

Guardar estos datos en `/src/data/encuestas.json` para poder modificarlos sin tocar código.

---

## 🎬 Estructura narrativa de la presentación

La presentación tiene **5 bloques** y **66 pulsaciones + 2 loops automáticos**:

| Bloque | Contenido | Pulsaciones |
|---|---|---|
| 0 | Recepción (loop automático) | Loop |
| 1 | Apertura · presentadora (Ángela Moreno · Victoria Crea) + título + neutra | 1-3 |
| 2 | Intervención Victoria Crea (cuerpo principal) | 4-62 |
| 2.1 | Por qué cambiar | 4-5 |
| 2.2 | Encuestas (6 datos reales) | 6-13 |
| 2.3 | Manifiesto | 14-15 |
| 2.4 | Revelación del logo (narrativa, 15 pasos) | 16-30 |
| 2.5 | Paleta de colores (5 colores) | 31-37 |
| 2.6 | Tipografía | 38-42 |
| 2.7 | Iconografía | 43-45 |
| 2.8 | Aplicaciones (10 mockups reales) | 46-56 |
| 2.9 | **Broche final: 700 años · 2027** | 57-62 |
| 3 | Intervención alcaldesa Seve González | 63-64 |
| 4 | Cierre y cocktail | 65-66 + Loop |

> **Bloque 2.4 (revelación) es narrativo y granular (15 pulsaciones)**: A·punto → B1-B5·los 5 colores **uno por pulsación** (cada uno se recoge a la franja inferior) → C1-C2·tipografías Match y Bebas Neue → D1-D3·los 3 iconos uno por pulsación → E·letras JU-MI-LLA → F·ensamblado (los iconos vuelan a su sitio canónico) → G·slogan → H·variantes. Primero se presentan los conceptos de marca uno a uno, luego se ensambla el logo. Detalle en `GUION_TECNICO.md`.

El detalle pulsación a pulsación está en `/docs/GUION_TECNICO.md`. **Ese documento es la fuente de verdad**. Si hay discrepancia entre lo que digo aquí y lo que dice el guion, gana el guion.

---

## 🏗️ Arquitectura del código

### Stack
- **HTML5** + **CSS3** + **JavaScript ES6+** (vanilla, sin frameworks)
- **GSAP 3** (incluyendo plugins MotionPath y DrawSVG si son necesarios) para animaciones
- Nada de React, Vue, Svelte, Tailwind, etc. Mantener el stack mínimo.
- Empaquetado: **Vite** (rápido, simple, hot reload en desarrollo)

### Organización de archivos
```
jumilla-presentacion/
├── CLAUDE.md                    ← este archivo
├── README.md
├── index.html
├── package.json
├── vite.config.js
├── /src
│   ├── main.js                  ← punto de entrada, registra el controller
│   ├── controller.js            ← gestiona el avance entre pulsaciones
│   ├── preloader.js             ← precarga de assets
│   ├── /scenes
│   │   ├── 00-loop-recepcion.js
│   │   ├── 01-apertura.js
│   │   ├── 02-por-que-cambiar.js
│   │   ├── 03-encuestas.js
│   │   ├── 04-manifiesto.js
│   │   ├── 05-revelacion-logo.js
│   │   ├── 06-colores.js
│   │   ├── 07-tipografia.js
│   │   ├── 08-iconografia.js
│   │   ├── 09-aplicaciones.js
│   │   ├── 10-broche-700.js
│   │   ├── 11-alcaldesa.js
│   │   └── 12-cierre.js
│   ├── /styles
│   │   ├── variables.css        ← paleta, tipografías
│   │   ├── base.css             ← reset, fullscreen, base
│   │   └── scenes.css           ← estilos por escena
│   └── /data
│       └── encuestas.json
├── /assets
│   ├── /logo
│   ├── /icons
│   ├── /fonts
│   │   ├── /Match
│   │   └── /Bebas Neue
│   ├── /images                  ← cuando estén
│   └── /video                   ← cuando estén
└── /docs
    ├── GUION_TECNICO.md         ← guion pulsación a pulsación
    └── manual-marca.pdf
```

### Patrón de escenas
Cada escena es un módulo con esta estructura:

```javascript
// /src/scenes/03-encuestas.js
export default {
  id: 'encuestas',
  pulsaciones: 8,                   // cuántas pulsaciones tiene esta escena

  setup(stage) {
    // se llama una sola vez cuando entra la escena
    // crea los elementos en el DOM dentro de `stage`
  },

  step(n) {
    // se llama cada vez que se avanza dentro de la escena
    // `n` es el número de pulsación dentro de la escena (1 a pulsaciones)
    // devolver una promesa si la animación es asíncrona
  },

  teardown() {
    // se llama cuando salimos de la escena (limpieza)
  }
};
```

### Controller central
El `controller.js` mantiene:
- El array de escenas en orden
- El índice de escena actual y el índice de pulsación dentro de la escena
- El listener global de teclado
- La transición entre escenas (cross-fade en negro de 400ms)
- Pasa el `preloader` a cada escena en `setup(stage, preloader)` para que use los SVG ya precargados (100% offline).

### ⏱️ Comportamiento de entrada de escena (importante para el día del evento)
Al **entrar** en una escena, `enterScene()` ejecuta su `step(1)` automáticamente al final de la transición. Consecuencia en el flujo real (escenas registradas en orden):
- La **escena 0 (loop de recepción)** se monta al cargar la página y muestra su `step(1)` **sin pulsar** → correcto, la recepción debe verse sola.
- **Todas las demás escenas** llegan a su `step(1)` **como resultado de la pulsación** que cruza el límite desde la escena anterior. Es decir: 1 pulsación = 1 avance, sin desfases. No hay "off-by-one" en el flujo real.

⚠️ El aparente "off-by-one" solo ocurre al **probar una escena aislada** registrándola como escena 0 (entonces su `step(1)` se ve sin pulsar). Es un artefacto de testing, no del evento.

**TODO (al registrar todas las escenas en orden):** verificar que la **escena 0 es el loop de recepción** (la única que debe arrancar sola) y que el resto encadena 1 pulsación = 1 step. Si en el futuro alguna escena necesitara montarse sin disparar `step(1)`, añadir un flag `autoStart` al patrón de escena; hoy no hace falta.

---

## ⚙️ Convenciones de código

- **Nombres en inglés** para variables, funciones, clases CSS (`scene`, `step`, `revealLogo`)
- **Strings de cara al usuario en español** (textos de pantalla)
- **Comentarios en español** (para que cualquiera del equipo lo entienda)
- **Indentación: 2 espacios**
- **No usar `var`**, solo `const` y `let`
- **Funciones flecha** para callbacks, funciones nombradas para módulos
- **Async/await** sobre `.then()` cuando sea posible
- **Un módulo, una responsabilidad**: si un archivo crece por encima de 200 líneas, dividirlo

---

## 🎞️ Convenciones de animación (GSAP)

- **Duración por defecto**: `0.6s` para entradas, `0.4s` para salidas, `1.2s` para reveals dramáticos (logo, 700 años)
- **Easing por defecto**: `power2.out` para entradas, `power2.in` para salidas, `power3.inOut` para morphings
- **Stagger por defecto**: `0.08s` entre elementos cuando hay varios entrando a la vez
- **Nunca animar más de 5 cosas a la vez en pantalla**: si una composición es compleja, escalonarla con stagger
- **Las pulsaciones del clicker deben sentirse "responsivas"**: el primer fotograma de la nueva animación debe arrancar antes de 100ms desde la pulsación

### Patrones de animación comunes

**Reveal de texto palabra a palabra**: dividir el texto en `<span>` por palabra y stagger con `power2.out`, duración 0.6s, stagger 0.12s.

**Reveal de texto letra a letra**: dividir el texto en `<span>` por letra y stagger con `power2.out`, duración 0.4s, stagger 0.04s.

**Contador numérico animado**: usar `gsap.to({ value: 0 }, { value: target, duration: 1.5, ease: "power2.out", onUpdate: ... })`.

**Barra de progreso**: animar `scaleX` desde 0 hasta el porcentaje, `transform-origin: left`, duración 1.2s con `power3.out`.

**Cross-fade entre escenas**: una capa negra con `opacity: 0` que va a 1 en 400ms, cambio de escena, baja a 0 en 400ms.

---

## 🚨 Errores que NO debe cometer Claude Code

1. **No cambiar el claim**. El claim oficial es **"Capital de la Monastrell"**. NUNCA usar "Origen Profundo" (era de una propuesta anterior descartada).
2. **No usar Arial ni Helvetica** en pantalla. Solo Match y Bebas Neue.
3. **No usar emojis ni iconos genéricos** (FontAwesome, Material Icons). Solo los SVG oficiales del manual.
4. **No inventar datos**. Si necesita un porcentaje o un número, sacarlo de `/src/data/encuestas.json`.
5. **No conectar con internet**. Nada de Google Fonts, CDNs, APIs, fetch a servidores externos. La pieza debe funcionar 100% offline el día del evento.
6. **No usar `position: fixed` para layouts**. Toda la presentación es fullscreen, usar un contenedor `#stage` con `position: relative` y los hijos en `absolute`.
7. **No avanzar automáticamente**. Excepto los loops del bloque 0 y del cierre, **nada avanza solo**. Cada cambio de pantalla requiere una pulsación.
8. **No olvidar el formato 8:3**. Si una composición se ve bien en 16:9 pero mal en 8:3, está mal hecha. Diseñar siempre para 2048x768.
9. **No mostrar elementos de marca (logo, isotipo, slogan) ANTES de la revelación**. La marca se desvela en el Bloque 2.4 (puls. 15-29); hasta ese momento, las pantallas previas (recepción, apertura, encuestas, manifiesto) NO deben llevar logo ni isotipo. Después de la revelación, los elementos de marca sí pueden aparecer (variantes, aplicaciones, cierre…). La única excepción son las pantallas que YA son sobre la marca por definición (recepción incluye el logo del **Ayuntamiento** — no de la marca nueva — como cliente del evento).

---

## 🔄 Flujo de trabajo recomendado

Cuando Victoria pida implementar una nueva escena o modificar una existente:

1. **Leer primero `/docs/GUION_TECNICO.md`** en la sección correspondiente.
2. **Confirmar verbalmente** qué pulsaciones afecta y qué assets va a necesitar.
3. **Comprobar que los assets están disponibles** en `/assets/`. Si falta alguno, avisar a Victoria antes de empezar.
4. **Implementar la escena en su archivo correspondiente** dentro de `/src/scenes/`.
5. **Probar localmente** con `npm run dev` y verificar que las pulsaciones funcionan en orden.
6. **Documentar en comentarios** dentro del archivo de escena qué hace cada `step(n)`.

---

## 📞 Contacto y contexto humano

- **Victoria** es la responsable del proyecto. Opera el clicker el día del evento.
- **Ayuntamiento de Jumilla** es el cliente. Toda decisión de contenido se valida con ellos.
- **La alcaldesa Seve González** interviene después de Victoria Crea. Su discurso es libre, la pantalla solo le acompaña.
- **El presentador/a** todavía está por confirmar.

Si en algún momento Claude Code tiene dudas sobre algo que no está documentado aquí ni en `GUION_TECNICO.md`, **preguntar a Victoria antes de tomar decisiones**. Es mejor parar y preguntar que implementar algo que haya que rehacer.
