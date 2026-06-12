# GUION TÉCNICO · Presentación marca turística Jumilla

> **Documento maestro de implementación**. Este archivo es la fuente de verdad sobre qué ocurre en cada pulsación del clicker. Claude Code debe consultarlo antes de implementar o modificar cualquier escena. Cada bloque describe la composición visual, la animación esperada, el comportamiento del clicker y los assets necesarios.
>
> **Resolución de trabajo**: 2048 x 768 px (ratio 8:3 panorámico).
> **Coordenadas**: el origen (0,0) es la esquina superior izquierda. El centro de la pantalla está en (1024, 384).

---

## 📐 Sistema de layout

Toda la presentación corre dentro de un contenedor único:

```html
<div id="stage" style="width: 2048px; height: 768px; position: relative; overflow: hidden; background: #121212;"></div>
```

Cada escena reemplaza el contenido de `#stage` en su `setup(stage)`. Los elementos dentro de la escena son `position: absolute` para poder posicionarlos con precisión píxel a píxel.

Cuando la presentación se ejecute en una pantalla de desarrollo (1920x1080), el contenedor `#stage` debe escalarse manteniendo la proporción 8:3, centrado horizontal y verticalmente con fondo negro alrededor. Esto se gestiona en `controller.js`.

---

## ⚙️ Convenciones de timing

| Tipo de animación | Duración | Easing |
|---|---|---|
| Entrada estándar (fade-in, slide-in) | 0.6s | `power2.out` |
| Salida estándar (fade-out) | 0.4s | `power2.in` |
| Reveal dramático (logo, 700 años) | 1.2s | `power3.out` |
| Contador numérico | 1.5s | `power2.out` |
| Barra de progreso | 1.2s | `power3.out` |
| Cross-fade entre escenas | 0.4s + 0.4s | `power2.inOut` |
| Stagger entre elementos | 0.08s | (entre tweens) |
| Stagger entre letras | 0.04s | (entre tweens) |

---

# 🎬 BLOQUE 0 · Recepción

## Pulsación: LOOP (automático, sin clicker)

### Estado de pantalla
Loop automático que corre en bucle mientras llega la gente al evento (~18:00-18:30 h). **Arranca solo al cargar la pieza; no requiere pulsación.**

### Composición visual
- **Fondo**: vídeo `/assets/video/videoloop_1.mp4` en bucle (muteado, `playsInline`, `object-fit: cover`). Por encima, una capa **Monastrell al 55 %** que tiñe la imagen pero deja respirar el movimiento del fondo. Si el archivo no carga (códec o ausencia), fallback automático al Monastrell sólido — el código tiene timeout de 5 s y detección de error.
- Composición minimalista: **solo dos elementos** sobre el vídeo tintado, ambos en **blanco**:

  **Logo del Ayuntamiento** · `/assets/logo/logo_ayto.svg`, ~90 px de alto, centrado horizontalmente a 200 px del borde superior.

  **Bloque tipográfico central** · 3 líneas Bebas Neue Pro, mismo tamaño y tracking, **el énfasis lo lleva el peso**:

  | Línea | Texto | Peso |
  |---|---|---|
  | L1 | PRESENTACIÓN DE | Bebas Middle 500 |
  | L2 | **LA NUEVA MARCA TURÍSTICA** | **Bebas Bold 700** |
  | L3 | DE JUMILLA | Bebas Middle 500 |

  - Tamaño: **60 px** uniforme.
  - Tracking: **0.14 em**.
  - Line-height: 1.18.
  - `text-indent: 0.14em` para corregir el sesgo óptico del letter-spacing en texto centrado.
  - Bloque centrado en `top: 54 %`.

- **NO hay**: marco, fecha, plecas hairline, claim "PRESENTACIÓN PÚBLICA", ornamentos, dashes. Restraint puro · estilo cartel de cine clásico.

### Animación
- **Entrada serena**:
  1. Logo del ayto fade-in + slide-up (1.0 s, `power2.out`).
  2. Las 3 líneas del bloque entran con stagger apretado (0.14 s) → se levantan como un solo gesto (1.1 s, `power2.out`), desde `t = 0.45 s`.
- **Bucle (multiparallax sutil, períodos diferentes para evitar sensación de loop)**:
  - Conjunto `recep-content`: scale 1 ↔ 1.012 cada 12 s (`sine.inOut`).
  - Bloque central: `y` 0 ↔ -4 px cada 16 s.
  - El vídeo aporta su propio movimiento como capa de fondo.
- **Nada rápido**: debe poder verse una hora seguida sin cansar.

### Assets necesarios
- `/assets/logo/logo_ayto.svg` — disponible.
- `/assets/video/videoloop_1.mp4` — disponible (~210 MB, H.264).

### Comportamiento del clicker
- La primera pulsación de la flecha derecha rompe el loop y avanza al **Bloque 1, Pulsación 2**.

---

# 🎬 BLOQUE 1 · Apertura del presentador/a

## Pulsación 1 · Presentación de Ángela Moreno · Victoria Crea

### Estado de pantalla
Tarjeta institucional que presenta a la persona que va a hablar sobre la nueva marca. Hermana visual de la presentación de la alcaldesa (puls. 63) — mismo tratamiento de fondo y misma estructura, para que ambas piezas se reconozcan como pareja.

### Composición visual
- **Fondo**: vídeo `/assets/video/videoloop_1.mp4` en bucle (muteado, `object-fit: cover`) + tinte **Monastrell al 78 %** por encima. El alto tinte deja apenas un movimiento sutil tras el Monastrell para que no compita con el nombre.
- **Centrado vertical**, todo en blanco:
  - Nombre (Match Bold, 160 px): "Ángela Moreno"
  - Línea horizontal blanca (300 × 3 px, transform-origin izquierdo).
  - Rol (Bebas Neue, 26 px, blanco al 78 %, letterspacing 0.22 em): "RESPONSABLE DE ASUNTOS PÚBLICOS Y CORPORATIVOS"
  - Empresa (Bebas Neue Bold, 38 px, blanco 100 %, letterspacing 0.32 em): "VICTORIA CREA"
- Las dos líneas del cargo van agrupadas en un wrapper con gap interno de 10 px (más apretado que el gap general de 28 px de la página) para que se lean como una unidad.

### Animación
1. Nombre palabra a palabra (duración 0.7 s, stagger 0.15 s, `power2.out`).
2. Línea decorativa scaleX 0→1 (0.6 s, `power2.out`).
3. Rol fade-in (0.5 s).
4. Empresa fade-in con delay 0.1 s respecto al rol (0.5 s).

### Comportamiento del clicker
- Una pulsación → avanza al paso 2 (título del evento).

### Assets necesarios
- `/assets/video/videoloop_1.mp4` — disponible.

---

## Pulsación 2 · Título del evento

### Estado de pantalla
Fondo negro enriquecido (`#121212`). Las dos líneas del claim del evento aparecen centradas a gran tamaño, **todo en blanco**.

### Composición visual
- Fondo: `#121212`
- Texto principal centrado vertical y horizontalmente, en dos líneas (Match Bold, ambas en **blanco**):
  - Línea 1 (Match, 140 px, blanco, bold): "Una marca para los"
  - Línea 2 (Match, 180 px, blanco, bold): "próximos 700 años"
- **Sin subtexto**: la fecha/datos del evento ya están en la pantalla de bienvenida.

### Animación
- Las 7 palabras de ambas líneas aparecen una a una con stagger (`y: 30 → 0` + `opacity: 0 → 1`), duración 0.6 s por palabra, stagger 0.12 s. Empieza por la línea 1.

### Comportamiento del clicker
- Una pulsación → avanza al paso 3 de este bloque.

---

## Pulsación 3 · Pantalla neutra

### Estado de pantalla
Pantalla neutra mientras el presentador/a habla. Sin elementos que distraigan.

### Composición visual
- Fondo: `#121212`
- **Nada más en pantalla.** El título de la pulsación 1 se ha apagado.

> **Regla**: el isotipo **NO** se muestra todavía. La marca aún no ha sido desvelada (eso ocurre en el bloque 2.4). El isotipo solo puede aparecer en pantallas **posteriores** a la revelación.

### Animación
- Cross-fade desde la pantalla anterior: el título del paso 2 hace fade-out (duración 0.4 s) y la pantalla queda limpia.

### Comportamiento del clicker
- Una pulsación → avanza al Bloque 2.1, Pulsación 4.

---

# 🎬 BLOQUE 2.1 · Por qué cambiar

## Pulsación 4 · Pregunta de apertura

### Estado de pantalla
Pregunta a pantalla completa que abre el discurso de Victoria Crea.

### Composición visual
- Fondo: `#121212`
- Centrado vertical y horizontalmente:
  - (Match, 180px, blanco): "¿Por qué"
  - (Match, 180px, color Monastrell): "cambia"
  - (Match, 180px, blanco): "Jumilla su marca?"
- Las tres líneas apiladas verticalmente, alineadas a la izquierda dentro de un bloque centrado en pantalla.

### Animación
1. La línea 1 ("¿Por qué") aparece palabra a palabra (duración 0.6s, stagger 0.12s).
2. La línea 2 ("cambia") aparece con un efecto especial: tipográfico aparece desde abajo con un peso visual mayor (escala de 0.7 → 1, `opacity: 0 → 1`, duración 0.8s, ease `back.out(1.7)`).
3. La línea 3 ("Jumilla su marca?") aparece palabra a palabra como la línea 1.

El orden temporal es: línea 1 (0.6s) → línea 2 (0.8s con delay 0.4s desde inicio línea 1) → línea 3 (delay 1.2s).

### Comportamiento del clicker
- Una pulsación → avanza al paso 5.

---

## Pulsación 5 · Diagnóstico de partida

### Estado de pantalla
Respuesta a la pregunta anterior, con énfasis en "su gente".

### Composición visual
- Fondo: `#121212`
- Centrado:
  - (Match, 140px, blanco): "Porque"
  - (Match, 220px, color Monastrell, bold): "su gente"
  - (Match, 140px, blanco): "nos lo ha pedido."

### Animación
1. Salida de las líneas del paso 4 (fade-out + leve desplazamiento hacia arriba, duración 0.4s).
2. Entrada de las nuevas líneas con stagger entre ellas (duración 0.6s, stagger 0.2s entre líneas).
3. Cuando "su gente" termina de aparecer, una línea horizontal aparece debajo de ese texto, dibujándose de izquierda a derecha con DrawSVG (duración 0.8s, color Monastrell, grosor 8px).

### Comportamiento del clicker
- Una pulsación → avanza al Bloque 2.2, Pulsación 6.

---

# 🎬 BLOQUE 2.2 · Encuestas (datos reales)

> **IMPORTANTE**: todos los datos vienen de `/src/data/encuestas.json`. No hardcodear.

> **REGLA DE CONTRASTE DEL BLOQUE 2.2** (decisión global, sobre-escribe cualquier mención de color en las pulsaciones siguientes): **fondo Monastrell `#85004D`** y **todos los datos / textos / líneas decorativas / barra / castillo / ORGULLO en BLANCO**. Razón: la pantalla LED de 8×3 m exige contraste alto y los datos lucen mejor blancos sobre Monastrell que en una pantalla negra con números Monastrell. Los glows (cajas atributos, ORGULLO) también van en blanco.

## Pulsación 6 · Introducción

### Estado de pantalla
Aprovechamos el formato panorámico 8:3 para una composición horizontal.

### Composición visual
- Fondo: `#121212`
- A la izquierda (columna que ocupa el 40% del ancho):
  - (Match, 110px, color Monastrell): "Hemos"
  - (Match, 110px, blanco): "preguntado"
  - (Match, 110px, blanco): "a Jumilla."
- A la derecha (columna que ocupa el 55% del ancho), un párrafo:
  - (Bebas Neue, 32px, blanco con opacidad 0.85, line-height 1.5):
    "Durante los meses de octubre y noviembre de 2025, realizamos un estudio demoscópico a pie de calle. Más de 400 ciudadanos nos contaron qué Jumilla quieren ver."

### Animación
1. Las líneas del título entran palabra a palabra desde la izquierda (slide-in desde `x: -50` con fade-in, stagger 0.15s).
2. El párrafo de la derecha aparece con un fade-in suave (delay 0.8s, duración 1s).

### Comportamiento del clicker
- Una pulsación → paso 7.

---

## Pulsación 7 · Dato 1 · Muestra (417 encuestados)

### Estado de pantalla
Primer dato impactante: el tamaño de la muestra.

### Composición visual
- Fondo: `#121212`
- Centrado:
  - Número gigante (Match, 360px, color Monastrell, bold): **"417"**
  - Debajo (Bebas Neue, 48px, blanco): "ciudadanos encuestados"
  - Línea decorativa horizontal (Monastrell, 4px de grosor, 200px de ancho) entre los dos textos.

### Animación
1. El número aparece con efecto contador: usar GSAP para tweenear un objeto `{ value: 0 }` hasta `{ value: 417 }` en 1.5s, y actualizar el `textContent` en cada `onUpdate`. Easing `power2.out`.
2. Al mismo tiempo, escala del número desde 0.7 hasta 1 (duración 1.5s, mismo ease).
3. La línea decorativa se dibuja con DrawSVG cuando el contador termina (duración 0.6s).
4. El texto "ciudadanos encuestados" aparece con fade-in al terminar la línea (duración 0.6s).

### Comportamiento del clicker
- Una pulsación → paso 8.

---

## Pulsación 8 · Dato 2 · Color (52,37% rojo vino)

### Estado de pantalla
Dato sobre la percepción cromática + visual de barra de progreso.

### Composición visual
Layout horizontal:
- Mitad izquierda:
  - (Match, 280px, color Monastrell, bold): **"52,37%"**
  - (Bebas Neue, 36px, blanco): "asocia Jumilla con el rojo vino"
- Mitad derecha:
  - Una barra horizontal (**600 px** ancho, 80 px alto) con borde blanco al 45 %. Sobre fondo Monastrell la barra requiere más contraste que el 0.2 original.
  - Dentro, una barra que se llena hasta el 52,37 % del ancho, en **blanco**.

> Implementación: el grid horizontal (puls. 8 y 8) usa `grid-template-columns: 58% 42%` (no 50/50): el número "52,37%" / "42,59%" en Match Bold 280 px ocupa ~960 px y necesita una columna izquierda más generosa para no salirse. Con 58 % (1188 px - 160 px de padding = 1028 px) el número respira, y la barra (600 px) / castillo cabe sobrado en el 42 % derecho.

### Animación
1. Cross-fade desde la pantalla anterior (los elementos del 417 salen con fade-out).
2. El número del % aparece con contador animado de 0% a 52,37%, duración 1.5s.
3. **A la vez** que el contador sube, la barra de la derecha se llena (`scaleX` de 0 a 0.5237, `transform-origin: left`, duración 1.5s, mismo ease).
4. El texto "asocia Jumilla con el rojo vino" aparece con fade-in cuando termina el contador (duración 0.6s).

### Comportamiento del clicker
- Una pulsación → paso 9.

---

## Pulsación 9 · Dato 3 · Símbolo (42,59% El Castillo)

### Estado de pantalla
Dato sobre el símbolo principal de Jumilla, con la silueta del Castillo.

### Composición visual
Layout horizontal:
- Mitad izquierda:
  - (Match, 280px, color Monastrell, bold): **"42,59%"**
  - (Bebas Neue, 36px, blanco): "identifica El Castillo como el símbolo de Jumilla"
- Mitad derecha:
  - Silueta de `CASTILLO.svg` en color Monastrell, tamaño 500px de alto, centrada en su columna.

### Animación
1. Cross-fade desde la pantalla anterior.
2. Contador del % de 0 a 42,59 (duración 1.5s).
3. La silueta del Castillo aparece con efecto DrawSVG (los paths se dibujan de arriba a abajo, duración 1.5s, ease `power2.inOut`). Una vez dibujada, el `fill` se aplica con un fade-in de color (Monastrell) en 0.4s.
4. Texto descriptivo con fade-in al final (0.6s).

### Comportamiento del clicker
- Una pulsación → paso 10.

---

## Pulsación 10 · Dato 4 · Estilo (63% elegante/clásico)

### Estado de pantalla
Dato sobre el estilo visual deseado, con cuatro conceptos iluminándose.

### Composición visual
Layout vertical:
- Arriba (centrado):
  - (Match, 280px, color Monastrell, bold): **"63%"**
  - (Bebas Neue, 36px, blanco): "pide una marca con estos atributos"
- Abajo (grid de 4 columnas iguales con margen de 40px entre cada):
  - 4 cajas con borde de 2px blanco, padding interior:
    - "ELEGANTE" (Bebas Neue, 48px)
    - "CLÁSICA"
    - "TRADICIONAL"
    - "FORMAL"

### Animación
1. Cross-fade desde la pantalla anterior.
2. Contador del % de 0 a 63 (duración 1.5s).
3. Las 4 cajas aparecen con stagger desde la izquierda: cada caja entra con `opacity: 0 → 1` y `scale: 0.8 → 1`, duración 0.5s, stagger 0.12s.
4. Cuando todas están visibles, **se iluminan** una a una: el borde cambia de blanco a Monastrell con un breve glow (`box-shadow` con Monastrell al 50%), stagger 0.15s.

### Comportamiento del clicker
- Una pulsación → paso 11.

---

## Pulsación 11 · Dato 5 · Logo anterior (9,78%)

### Estado de pantalla
**Momento delicado del guion**. Visualización del bajo nivel de atracción que generaba el logo anterior. Diseño que enfatiza el dato sin ser ofensivo.

### Composición visual
- Centrado (fondo Monastrell por la regla del bloque, números/textos en blanco):
  - (Match, 380px, blanco, bold): **"9,78%"**
  - (Bebas Neue, 42px, blanco): "encontraba atractiva la marca anterior"
- **Sin fondo adicional**: pantalla limpia, sin placeholder del logo anterior (no había imagen disponible y un bloque gris al fondo daba la sensación de "elemento sin explicar").

### Animación
1. Cross-fade desde la pantalla anterior.
2. El número 9,78% aparece **sin contador animado**: fade-in rápido (0.3 s) + leve `scale: 1.1 → 1` (efecto de impacto seco).
3. Pausa de 0.3 s sin movimiento (silencio visual).
4. El texto descriptivo aparece con fade-in (0.6 s).

### Nota especial
Este dato debe sentirse como un golpe sutil. La ausencia de contador animado (a diferencia de los datos anteriores) refuerza la idea de "este es el dato que justifica todo lo que viene".

### Comportamiento del clicker
- Una pulsación → paso 12.

---

## Pulsación 12 · Dato 6 · Emoción (59,94% orgullo)

### Estado de pantalla
Cierre emocional del bloque de datos. La palabra ORGULLO toma el protagonismo.

### Composición visual
- Fondo: `#121212`
- Distribución:
  - Arriba (Bebas Neue, 36px, blanco con opacidad 0.7): "El 59,94% quiere sentir"
  - Centro (Match, 380px, color Monastrell, bold): **"ORGULLO"**
  - Abajo (Bebas Neue, 36px, blanco con opacidad 0.7): "con la nueva marca."

### Animación
1. Cross-fade desde la pantalla anterior.
2. Las dos líneas de Bebas Neue aparecen con fade-in (duración 0.6s, stagger 0.2s).
3. La palabra ORGULLO aparece letra por letra (cada letra `opacity: 0 → 1`, `y: 30 → 0`, `scale: 0.8 → 1`, duración 0.5s por letra, stagger 0.08s).
4. Una vez compuesta, ORGULLO recibe un suave **glow** (text-shadow con Monastrell, fadeIn 0.4s, fadeOut 0.4s, repite 2 veces).

### Comportamiento del clicker
- Una pulsación → paso 13.

---

## Pulsación 13 · Síntesis de datos

### Estado de pantalla
Composición resumen con los 6 datos visibles a la vez, aprovechando todo el ancho de la pantalla.

### Composición visual
Grid de 6 columnas (formato panorámico 8:3 lo permite perfectamente). Cada columna:
- Arriba: el número en grande (Match, 110px, color Monastrell)
- Abajo: breve descripción (Bebas Neue, 22px, blanco)

Los 6 datos:
1. **417** · ciudadanos
2. **52,37%** · asocian con rojo vino
3. **42,59%** · ven El Castillo
4. **63%** · piden elegancia
5. **9,78%** · veían atractiva la marca anterior
6. **59,94%** · quieren orgullo

Entre cada columna, una línea divisoria vertical fina (1px, blanco con opacidad 0.15).

### Animación
1. Cross-fade desde la pantalla anterior.
2. Las 6 columnas aparecen con stagger desde la izquierda (cada una con `opacity: 0 → 1` y `y: 20 → 0`, duración 0.6s, stagger 0.1s).
3. Las líneas divisorias se dibujan con DrawSVG cuando todas las columnas están visibles (duración 0.5s, todas a la vez).

### Comportamiento del clicker
- Una pulsación → avanza al Bloque 2.3, Pulsación 14.

---

# 🎬 BLOQUE 2.3 · Manifiesto

> **REGLA DEL BLOQUE 2.3** (decisión): el manifiesto vive sobre fondo negro enriquecido y **TODO el texto va en blanco**. Los resaltes van por **NEGRITA**, NO por color Monastrell — sobre negro el Monastrell pierde nitidez en la pantalla LED de 8 × 3 m. Composición compacta (tipografías ~25 % más pequeñas que la propuesta original, gaps cortos).

## Pulsación 14 · Síntesis verbal

### Estado de pantalla
Frase de transición entre los datos y la revelación de la marca.

### Composición visual
- Fondo: `#121212`
- Texto centrado, máximo 84 % del ancho, todo en blanco:
  - (Match, 60 px, regular): "La ciudadanía nos pidió una marca"
  - (Match, 76 px, **bold**): "elegante por fuera y cercana por dentro."
  - (Match, 60 px, regular): "Una marca que diera"
  - (Match, 104 px, **bold**): "orgullo."

### Animación
- Cada línea aparece con fade-in y leve slide-up (duración 0.7 s, stagger 0.25 s entre líneas). La energía visual la lleva la negrita de las líneas 2 y 4; sin glow Monastrell.

### Comportamiento del clicker
- Una pulsación → paso 15.

---

## Pulsación 15 · Posicionamiento

### Estado de pantalla
Frase de posicionamiento estratégico antes de la revelación del logo.

### Composición visual
- Fondo: `#121212`
- Texto centrado, todo en blanco (jerarquía por tamaño y peso):
  - (Bebas Neue, 32 px, blanco con opacidad 0.6, tracking amplio): "Por eso construimos"
  - (Match, 100 px, **bold**, line-height 1.16): "una marca para el destino vinícola"
  - (Match, 132 px, **bold**, line-height 1.12): "más antiguo de España."

### Animación
- Cross-fade desde la pantalla anterior.
- Las líneas aparecen con stagger desde abajo (`y: 50 → 0`, fade-in, duración 0.8s, stagger 0.3s).

### Comportamiento del clicker
- Una pulsación → avanza al Bloque 2.4, Pulsación 16. **Momento clave del evento.**

---

# 🎬 BLOQUE 2.4 · Revelación del logo

> **Momento estrella.** Revelación **PROGRESIVA Y NARRATIVA**: se presentan los CONCEPTOS de la marca **uno por pulsación** (cada uno centrado y luego recogido a la franja inferior como "ya presentado") y después se ENSAMBLA el logo a partir de ellos. **15 pulsaciones (16-30)**, con cross-fades suaves.

## Pulsación 16 · A · Tensión previa
Fondo negro puro. Punto de luz Monastrell pulsante en el centro. → paso 17.

## Pulsación 17 · B1 · Color · Monastrell
Cross-fade del fondo a crema (#F7F1EC). Muestra grande centrada del color **Monastrell** (#85004D) con nombre (Match) y HEX (Bebas Neue). → paso 18.

## Pulsación 18 · B2 · Color · Azul Heráldico
El color anterior se recoge a la franja inferior; entra centrado **Azul Heráldico** (#1B5C9D). → paso 19.

## Pulsación 19 · B3 · Color · Púrpura Profundo
Recoge el anterior; entra **Púrpura Profundo** (#54334C). → paso 20.

## Pulsación 20 · B4 · Color · Verde Envero
Recoge el anterior; entra **Verde Envero** (#428C42). → paso 21.

## Pulsación 21 · B5 · Color · Negro Enriquecido
Recoge el anterior; entra **Negro Enriquecido** (#121212). → paso 22.

## Pulsación 22 · C1 · Tipografía · Match
Se recoge el último color. Centrado: la palabra **"Match"** escrita en la fuente Match, con rótulo "TIPOGRAFÍA PRINCIPAL". → paso 23.

## Pulsación 23 · C2 · Tipografía · Bebas Neue
Se recoge "Match". Centrado: **"Bebas Neue"** escrito en Bebas Neue, con rótulo "TIPOGRAFÍA SECUNDARIA". → paso 24.

## Pulsación 24 · D1 · Icono · Castillo
Se recoge "Bebas Neue". Centrado: el icono **CASTILLO** con efecto "draw" (contorno → relleno Monastrell) y etiqueta **PATRIMONIO**. → paso 25.

## Pulsación 25 · D2 · Icono · Uvas
Recoge el castillo; entra el icono **UVAS** (draw) con etiqueta **ORIGEN**. → paso 26.

## Pulsación 26 · D3 · Icono · Botella
Recoge las uvas; entra el icono **BOTELLA** (draw) con etiqueta **VINO**. → paso 27.

## Pulsación 27 · E · Las letras JU-MI-LLA
Se recoge el último icono. Aparece el bloque tipográfico **JU-MI-LLA** (sin iconos) en su posición exacta del logo final. → paso 28.

## Pulsación 28 · F · El logo ensamblado
Los 3 iconos **vuelan** desde la franja (trayectoria curva, MotionPath) a su sitio canónico: BOTELLA dcha. de JU, CASTILLO dcha. de MI, UVAS izq. de LLA. → paso 29.

## Pulsación 29 · G · El slogan
Se apagan las piezas de la franja. Aparece **"CAPITAL DE LA MONASTRELL"** en su posición/color del manual. Logo completo. → paso 30.

## Pulsación 30 · H · Variantes del logo
Grid de 4: PRINCIPAL, HORIZONTAL e ISOTIPO a color sobre tarjeta blanca; UNA TINTA (blanco) sobre tarjeta Monastrell. → avanza al Bloque 2.5, Pulsación 31.

### Implementación
`src/scenes/05-revelacion-logo.js`. **Fidelidad pixel-perfect a cualquier escala**: las letras, los iconos y el slogan finales son piezas del SVG **maestro** reveladas en su posición real; el vuelo de los iconos (F) se calcula en runtime midiendo dónde renderiza cada icono del maestro y la escala del stage. "Draw" con `setupStrokeDraw` (alternativa gratuita a DrawSVG); vuelo con `MotionPathPlugin`.

# 🎬 BLOQUE 2.5 · Paleta de colores

> **REGLA DEL BLOQUE 2.5** (decisión): el bloque entero vive sobre **fondo BLANCO** con textos en **negro**. Razón: con fondo oscuro el Negro Enriquecido (`#121212`) se confundía con el fondo y no era distinguible como color. Al pasar a fondo blanco, los 5 colores de la paleta se ven correctamente (incluido el negro).

## Pulsación 31 · Introducción a la paleta

### Estado de pantalla
Titular introductorio antes de mostrar los colores uno a uno.

### Composición visual
- Fondo: **blanco**
- Texto centrado, todo en negro enriquecido:
  - (Match, 120 px, **bold**): "Una paleta"
  - (Match, 120 px, **bold**): "inspirada en Jumilla."
  - Debajo (Bebas Neue, 36 px, negro al 65 %): "5 COLORES QUE CUENTAN LA HISTORIA DEL TERRITORIO."

### Animación
- Líneas con fade-in y stagger desde abajo (0.8s, stagger 0.25s).

### Comportamiento del clicker
- Una pulsación → paso 32.

---

## Pulsaciones 32-36 · Los 5 colores uno a uno

> Estos 5 pasos siguen el mismo patrón visual: un color grande entra desde el centro, luego se reduce y aparece el siguiente. Implementar como un único componente reutilizable.

### Patrón visual (común a los 5 colores)

Layout horizontal cuando todos están visibles. Mientras se introducen, el color actual aparece grande y centrado:

**Estado "introduciendo color N":**
- Círculo grande (480px de diámetro) centrado del color introducido
- A la derecha del círculo, ficha con:
  - (Match, 72px, blanco, bold): nombre del color
  - (Bebas Neue, 24px, blanco con opacidad 0.7): descripción poética
  - (Bebas Neue, 22px, blanco): "HEX: #XXXXXX"
  - (Bebas Neue, 22px, blanco): "CMYK: ..."
- Los colores anteriores ya introducidos aparecen reducidos en la parte inferior, alineados horizontalmente (círculos de 100px).

### Datos de los 5 colores

| # | Nombre | HEX | CMYK | Descripción |
|---|---|---|---|---|
| 1 | Monastrell | `#85004D` | C10 M100 Y0 K50 | El alma del territorio |
| 2 | Azul Heráldico | `#1B5C9D` | C92 M63 Y10 K1 | El cielo y la institución |
| 3 | Púrpura Profundo | `#54334C` | C64 M80 Y40 K42 | La madurez del vino |
| 4 | Verde Envero | `#428C42` | C76 M22 Y92 K6 | La vid en transformación |
| 5 | Negro Enriquecido | `#121212` | C60 M50 Y50 K100 | El peso de la historia |

### Animación de cada paso (32-36)
1. Si hay color anterior grande: se reduce a círculo pequeño (100 px) y migra a la fila inferior (duración 0.6 s, ease `power2.inOut`).
2. El nuevo color entra: círculo aparece desde `scale: 0` hasta `scale: 1` (duración 0.8 s, ease `back.out(1.4)`), `opacity: 0 → 1`.
3. La ficha de información a la derecha aparece con fade-in y leve slide-in desde la derecha (duración 0.6 s, delay 0.4 s).

> Implementación: una sola página `stagePage` compartida entre puls. 32-37 con 5 swatches persistentes que morphean entre 3 estados (hero 480 px → parked 100 px → grid 220 × 220). La ficha grande única se reescribe entre pulsaciones; las 5 fichitas pequeñas están pre-posicionadas exactamente bajo cada slot de la grid para que coincidan con el morph final.

### Comportamiento del clicker
- Cada pulsación avanza al siguiente color.

---

## Pulsación 37 · Paleta completa

### Estado de pantalla
Los 5 colores compuestos en una panorámica final, todos visibles a la vez.

### Composición visual
Grid horizontal de 5 columnas centradas (bloques **220 × 220 px**, separación 80 px → margen lateral ≈ 314 px para que la composición respire):
- Cada bloque: rectángulo del color con border-radius 18 px, 220 × 220.
- Debajo del rectángulo, ficha pequeña centrada (todo en negro):
  - (Match, 28 px, **bold**): nombre del color
  - (Bebas Neue, 17 px, negro al 65 %): descripción breve
  - (Bebas Neue, 16 px): HEX
  - (Bebas Neue, 16 px, negro al 65 %): CMYK

### Animación
1. Morphing fluido y SIMULTÁNEO: los 4 círculos parqueados + el círculo grande (hero) migran a sus posiciones de grid 220 × 220 con border-radius 18 px (todos en la misma página, sin cross-fade entre páginas que producía una transición rara).
2. Las fichas pequeñas, posicionadas exactamente bajo cada bloque del grid, aparecen con fade-in escalonado (duración 0.5 s, stagger 0.1 s).

### Comportamiento del clicker
- Una pulsación → avanza al Bloque 2.6, Pulsación 38.

---

# 🎬 BLOQUE 2.6 · Tipografía

## Pulsación 38 · Introducción

### Estado de pantalla
Titular del bloque tipográfico.

### Composición visual
- Fondo: `#121212`
- Texto centrado, todo en blanco (regla LED: Monastrell sobre negro pierde nitidez en pantalla grande):
  - (Match, 120 px, regular): "Una arquitectura"
  - (Match, 170 px, **bold**): "tipográfica."

### Animación
- Slide-in con stagger (0.8 s, stagger 0.25 s).

### Comportamiento del clicker
- Una pulsación → paso 39.

---

## Pulsación 39 · Tipografía principal · Match

### Estado de pantalla
La letra "J" gigante para mostrar el carácter de la tipografía Match.

### Composición visual
- Fondo: `#121212`
- Grid 50/50, todo en blanco:
  - **Izquierda**: una "J" gigantesca (Match Bold, **600 px**, blanco). 600 en lugar de 700 da más respiración vertical.
  - **Derecha**:
    - (Match Bold, 96 px, blanco): "MATCH"
    - (Bebas Neue, 28 px, blanco al 70 %, letterspaced 0.18 em): "TIPOGRAFÍA PRINCIPAL DEL SISTEMA"
    - (Bebas Neue, 24 px, blanco al 75 %, letterspaced 0.06 em): "EXPANSIVA, ROBUSTA, ARQUITECTÓNICA. SOSTIENE LOS TITULARES, LOS NÚMEROS Y LAS PIEZAS DE PRESENCIA. ES EL TONO INSTITUCIONAL DE LA NUEVA MARCA."

### Animación
1. Cross-fade desde la pantalla anterior.
2. La "J" entra desde `y: 80` con fade-in (0.9 s, ease `power3.out`).
3. Los textos de la derecha aparecen con stagger desde `x: 40` (0.7 s, stagger 0.12 s).

### Comportamiento del clicker
- Una pulsación → paso 40.

---

## Pulsación 40 · Match · Abecedario

### Estado de pantalla
Despliegue del abecedario completo en Match para mostrar el conjunto de caracteres.

### Composición visual
- Fondo: `#121212`
- Abecedario completo (Match, 96px, blanco) distribuido en 2 o 3 filas, centrado:
  - Fila 1: A B C D E F G H I J K L M
  - Fila 2: N Ñ O P Q R S T U V W X Y Z
  - Fila 3 (más pequeña, 56px): 0 1 2 3 4 5 6 7 8 9
- Espaciado generoso entre letras.

### Animación
- Las letras aparecen con stagger muy rápido letra a letra (duración 0.3s por letra, stagger 0.04s).

### Comportamiento del clicker
- Una pulsación → paso 41.

---

## Pulsación 41 · Tipografía secundaria · Bebas Neue

### Estado de pantalla
Presentación de Bebas Neue como complemento.

### Composición visual
Grid 45/55, todo en blanco (regla LED):
- **Izquierda (45 %)**:
  - (Bebas Neue Bold, 96 px, blanco): "BEBAS NEUE"
  - (Bebas Neue, 28 px, blanco al 70 %, letterspaced 0.18 em): "TIPOGRAFÍA SECUNDARIA · CLAIMS Y ETIQUETAS"
  - (Bebas Neue, 24 px, blanco al 75 %, letterspaced 0.06 em): "CONDENSADA, ALTA, INDUSTRIAL. ACOMPAÑA AL CLAIM CAPITAL DE LA MONASTRELL Y ARTICULA LOS DATOS, LOS RÓTULOS Y LOS PEQUEÑOS TEXTOS DEL SISTEMA."
- **Derecha (55 %)**, muestra tipográfica con jerarquía por tamaño:
  - (Bebas Neue Bold, 200 px, blanco): "CAPITAL"
  - (Bebas Neue Bold, 140 px, blanco al 85 %): "ELEGANCIA"
  - (Bebas Neue Bold, 100 px, blanco al 60 %): "PATRIMONIO"

### Animación
- Cross-fade desde la pantalla anterior.
- Columna izquierda entra desde `x: -40` con stagger 0.12 s.
- Palabras de la derecha entran desde `x: 40` con stagger 0.18 s.

### Comportamiento del clicker
- Una pulsación → paso 42.

---

## Pulsación 42 · Jerarquía tipográfica

### Estado de pantalla
Ejemplo real de jerarquía mostrando cómo trabajan las dos tipografías juntas.

### Composición visual
- Fondo: `#121212`
- Composición editorial centrada, todo en blanco con variaciones de opacidad:
  - Kicker (Bebas Neue, 30 px, blanco al 70 %, letterspaced 0.32 em): "DESCUBRE JUMILLA"
  - Título (Match Bold, **180 px**, blanco): "Capital del vino"
  - Subtítulo (Match Regular, 90 px, blanco al 90 %): "más antiguo de España."
  - Cuerpo (Bebas Neue, 28 px, blanco al 70 %, letterspaced 0.08 em): "700 AÑOS DE MONASTRELL · UN TERRITORIO QUE CONSERVA LA TRADICIÓN, ELEVA SU CULTURA Y MIRA HACIA EL FUTURO."

### Animación
- Los elementos aparecen en orden jerárquico de arriba a abajo con stagger (0.8 s, stagger 0.2 s).

### Comportamiento del clicker
- Una pulsación → avanza al Bloque 2.7, Pulsación 43.

---

# 🎬 BLOQUE 2.7 · Iconografía

## Pulsación 43 · Introducción

### Estado de pantalla
Titular del bloque de iconografía.

### Composición visual
- Fondo: `#121212`
- Texto centrado, todo en blanco (regla LED):
  - (Match Regular, 140 px, blanco): "Un lenguaje"
  - (Match Bold, 180 px, blanco): "visual propio."

### Animación
- Slide-in con stagger (0.8 s, stagger 0.25 s).

### Comportamiento del clicker
- Una pulsación → paso 44.

---

## Pulsación 44 · Iconos principales

### Estado de pantalla
Los 3 iconos del sistema (botella, castillo, uvas) presentados en grande.

### Composición visual
Grid horizontal de 3 columnas iguales, padding 80×140:
- Columna 1: `BOTELLA.svg` en blanco, **300 px de alto**, centrado. Debajo: "VINO" (Bebas Bold 40, blanco, letterspaced 0.22 em) + sub "EL FRUTO DE 700 AÑOS DE MONASTRELL." (Bebas 19, blanco al 65 %, letterspaced 0.14 em).
- Columna 2: `CASTILLO.svg` en blanco, **300 px**. Debajo: "PATRIMONIO" + "EL CASTILLO COMO SÍMBOLO COMPARTIDO."
- Columna 3: `UVAS.svg` en blanco, **300 px**. Debajo: "ORIGEN" + "LA VID Y LA TIERRA QUE LO HICIERON POSIBLE."

> Decisión cromática: iconos en **blanco** (no Monastrell). En LED 8×3 m el Monastrell sobre `#121212` pierde definición; el blanco con efecto stroke-draw funciona muchísimo mejor (mismo patrón validado en el castillo de las encuestas).

> Tamaño ajustado: 460 → 300 px de alto + label 56 → 40 px tras revisión visual (el set inicial se veía gigantesco).

### Animación
1. Cross-fade desde la pantalla anterior.
2. Cada icono hace efecto **draw** (stroke-dashoffset → 0 en 1.0 s, ease `power2.inOut`) seguido del fill (fill-opacity 0→1, strokeWidth → 0, 0.4 s).
3. Stagger entre las 3 columnas: 0.4 s entre arranques.
4. Las etiquetas + sub-descriptores aparecen con fade-in + slide-up cuando los 3 iconos están macizados (0.6 s, stagger 0.08 s).

### Comportamiento del clicker
- Una pulsación → paso 45.

---

## Pulsación 45 · Sistema completo · Patrón

### Estado de pantalla
Los iconos se componen en el patrón visual repetitivo del manual de marca.

### Composición visual
- Fondo: Monastrell (`#85004D`).
- Cubriendo toda la pantalla: el patrón de `PATRON.svg` recoloreado a blanco con opacidad 0.15 (preserveAspectRatio `xMidYMid slice` para cubrir el stage).
- Encima del patrón, centrada, una caja blanca con padding 56×96:
  - (Match Bold, 96 px, color Monastrell): "Un sistema icónico"
  - (Bebas Neue, 36 px, color Negro Enriquecido, letterspaced 0.14 em): "que se aplica a cualquier soporte."

### Animación
1. Cross-fade desde la pantalla anterior.
2. El patrón aparece con un **wipe diagonal**: `clip-path` polygon que evoluciona de un triángulo en la esquina superior izquierda a cubrir toda la pantalla (1.2 s, `power2.inOut`, desde 0.4 s).
3. La caja central aparece con fade-in + `scale: 0.95 → 1` (0.7 s, `power2.out`, desde 1.2 s).

### Comportamiento del clicker
- Una pulsación → avanza al Bloque 2.8, Pulsación 46.

---

# 🎬 BLOQUE 2.8 · Aplicaciones reales

> **Mockups recibidos de Victoria (mayo 2026)**: 10 imágenes en `/assets/mockups/` que se reproducen una por pulsación, secuencia narrativa pública → institucional → impresa → identidad personal → digital. El bloque pasa de 6 a 11 pulsaciones (1 intro + 10 mockups) → desplaza la numeración global a partir de aquí.

## Pulsación 46 · Introducción

### Estado de pantalla
Titular del bloque de aplicaciones sobre negro.

### Composición visual
- Fondo: `#121212`
- Texto centrado:
  - (Match, 160 px, blanco): "Así se ve"
  - (Match, 220 px, **blanco bold**): "Jumilla."

> Decisión cromática: "Jumilla." se mantiene en **blanco bold** (no Monastrell). Coherente con la regla LED ya validada en el manifiesto y la tipografía — un Monastrell aislado sobre #121212 pierde nitidez en la pantalla de 8×3 m.

### Animación
- Stagger con fade-in y slide-up (0.9 s, ease `power2.out`, stagger 0.25 s).

### Comportamiento del clicker
- Una pulsación → paso 47.

---

## Pulsaciones 47-56 · Los 10 mockups uno a uno

> Cada pulsación reemplaza el contenido de UNA misma página `mock` (no se montan 10 páginas en memoria). Entre un mockup y el siguiente NO hay cross-fade de página completa: solo micro-fade del contenido (img + ficha) → swap → entrada del nuevo. Más rápido y limpio.

### Patrón visual común
- Fondo: `#121212`
- Grid horizontal `62 % / 38 %`:
  - **Izquierda (62 %)** · mockup PNG, max-height 680 px, centrado, con drop-shadow oscuro para despegarlo del fondo.
  - **Derecha (38 %)** · ficha tipográfica con:
    - Contador "XX / 10" — (Match, 140 px, blanco) + "/ 10" (Bebas, 36 px, blanco al 50 %).
    - Línea horizontal blanca, 120 px ancho, 3 px grosor (draw scaleX 0→1).
    - Nombre del soporte (Match, 92 px, blanco bold).
    - Tagline (Match, 38 px, blanco al 85 %).
    - Tag de categoría (Bebas, 26 px, letterspaced 0.28 em, blanco al 55 %).

### Lista de mockups (orden de pulsaciones)

| Pulsación | # | Archivo | Nombre | Tagline | Tag |
|---|---|---|---|---|---|
| 46 | 01 | `mock_mupi@2x.png` | **MUPI** | La marca toma la calle. | EXTERIOR · CIUDAD |
| 47 | 02 | `mock_bandera@2x.png` | **BANDERA** | Identidad institucional al viento. | EXTERIOR · INSTITUCIONAL |
| 48 | 03 | `mock_rollup@2x.png` | **ROLLUP** | La marca en el evento. | EVENTOS · STAND |
| 49 | 04 | `mock_flyer@2x.png` | **FLYER** | Una pieza editorial para llevarse. | IMPRESO · DIVULGACIÓN |
| 50 | 05 | `mock_sello@2x.png` | **SELLO** | El emblema sobre el documento oficial. | BURÓ · OFICIAL |
| 51 | 06 | `mock_camiseta@2x.png` | **CAMISETA** | El claim sobre el pecho. | MERCH · IDENTIDAD |
| 52 | 07 | `mock_gorra@2x.png` | **GORRA** | Vestir la marca cada día. | MERCH · CALLE |
| 53 | 08 | `mock_pulsera@2x.png` | **PULSERA** | El símbolo en la muñeca del visitante. | EVENTOS · RECUERDO |
| 54 | 09 | `mock_laptop@2x.png` | **WEB** | Jumilla en pantalla grande. | DIGITAL · PORTAL |
| 55 | 10 | `mock_movil@2x.png` | **INSTAGRAM** | La marca vive en su comunidad. | DIGITAL · REDES |

### Animación de cada paso
1. Salida del mockup previo (si lo hay): img fade-out + x:+40 + scale 0.98 (0.35 s, `power2.in`). Ficha hace fade-out con y:-10 a la vez.
2. Swap de contenido (img.src, número, nombre, tagline, tag) mientras está oculto.
3. Entrada del nuevo mockup: img desde x:-60 + scale 0.96→1 (0.9 s, `power3.out`).
4. Ficha derecha en cascada: número (0.6 s) → línea (drawX, 0.5 s, `power3.out`) → nombre → tagline → tag, con stagger ~0.12 s.

### Comportamiento del clicker
- Cada pulsación avanza al siguiente mockup. Al avanzar desde el 10 (puls. 56) → entra al **Bloque 2.9, Pulsación 57**.

### Assets necesarios
- `/assets/mockups/mock_mupi@2x.png` — disponible.
- `/assets/mockups/mock_bandera@2x.png` — disponible.
- `/assets/mockups/mock_rollup@2x.png` — disponible.
- `/assets/mockups/mock_flyer@2x.png` — disponible.
- `/assets/mockups/mock_sello@2x.png` — disponible.
- `/assets/mockups/mock_camiseta@2x.png` — disponible.
- `/assets/mockups/mock_gorra@2x.png` — disponible.
- `/assets/mockups/mock_pulsera@2x.png` — disponible.
- `/assets/mockups/mock_laptop@2x.png` — disponible.
- `/assets/mockups/mock_movil@2x.png` — disponible (mockup de **Instagram**, no app móvil).

---

# 🎬 BLOQUE 2.9 · Broche final · 700 años

> **Este es el segundo momento estrella del evento**, el cierre dramático de la intervención de Victoria Crea. La transición visual a este bloque debe ser un giro tonal claro: cambiamos de "presentar la marca" a "proyectar el futuro".

> Implementación: la cifra "1327"/"2027" se renderiza como un **odómetro mecánico** (4 columnas verticales con dígitos 0-9 apilados, overflow hidden, animación de `yPercent`). Permite el efecto "rodillo" de la puls. 59 sin librerías extra.

## Pulsación 57 · Transición · La fecha 1327

### Estado de pantalla
Pantalla en negro absoluto. Aparece una fecha del pasado.

### Composición visual
- Fondo: `#000000`
- Centrado vertical y horizontalmente, una cifra grande:
  - (Match, 360 px, **blanco**, opacidad 0.92): "1327"

> Decisión cromática: el "1327"/"2027" va en blanco (no Monastrell) por la regla LED. El **"700"** sí en Monastrell — al ser Match 600 px (~2,3 m en la LED real) la masa del color de marca se ve con autoridad.

### Animación
1. Cross-fade rápido a negro absoluto (0.5 s).
2. La cifra "1327" aparece con fade-in muy lento (duración 2 s) y un leve scale (`0.9 → 1`).
3. **No avanzar automáticamente.** Esperar pulsación.

### Comportamiento del clicker
- Una pulsación → paso 58.

---

## Pulsación 58 · El hito histórico

### Estado de pantalla
Se contextualiza la fecha con una explicación.

### Composición visual
- Misma pantalla que el paso 57, pero ahora debajo de "1327" aparece:
  - (Bebas Neue, 42 px, blanco con opacidad 0.7, máximo 70 % de ancho, centrado):
    "Primera prueba documental de la uva Monastrell en Jumilla."
- Una línea horizontal fina (color Monastrell, 2 px, 300 px de ancho) separa la cifra del texto.

### Animación
1. La línea se dibuja con `scaleX 0→1` (transform-origin izq.), 0.7 s, `power2.out`.
2. El texto aparece palabra a palabra con stagger (duración 0.4 s por palabra, stagger 0.08 s).

### Comportamiento del clicker
- Una pulsación → paso 59.

---

## Pulsación 59 · El salto temporal · 1327 → 2027

### Estado de pantalla
La cifra del pasado se transforma en la cifra del futuro mediante un morphing animado.

### Composición visual
- Solo queda la cifra en pantalla (la línea y el texto descriptivo desaparecen).
- La cifra cambia de "1327" a "2027" dígito a dígito (efecto rodillo mecánico).

### Animación
1. La línea horizontal y el texto descriptivo hacen fade-out (duración 0.5 s).
2. Cada uno de los 4 dígitos gira verticalmente en su cilindro: animación de `yPercent` con **10 vueltas extra** antes de asentarse en el dígito final. Cascada con stagger 0.05 s entre columnas y duración 1.6 + i·0.15 s (las últimas tardan un poco más → sensación de odómetro real).
3. Ease `power3.inOut`.
4. Al asentarse, el odómetro recibe la clase `.is-glow` que añade `text-shadow` Monastrell sutil (28 px / 80 px).

### Comportamiento del clicker
- Una pulsación → paso 60.

---

## Pulsación 60 · La cifra 700

### Estado de pantalla
La cifra **700** aparece como un monumento. **Momento de máximo impacto del bloque.**

### Composición visual
- Fondo: `#000000`
- Centrado:
  - (Match, 600 px, **color Monastrell, bold**, con text-shadow Monastrell sutil 40 px / 120 px): **"700"**
  - Debajo, margen 60 px:
  - (Bebas Neue, 56 px, blanco al 85 %): "AÑOS CUSTODIANDO"
  - (Bebas Neue, 56 px, blanco bold): "LA MONASTRELL"

### Animación
1. Cross-fade desde la pantalla del odómetro.
2. La cifra "700" entra desde arriba con peso brutal: slide `y: -240 → 0`, duración 1.0 s, ease `power4.out`.
3. Al aterrizar, sutil "impacto" (escala `1 → 1.06 → 1` en 0.18 s + 0.25 s).
4. Los textos descriptivos aparecen palabra a palabra con stagger (duración 0.5 s por palabra, stagger 0.12 s, desde 1.9 s).

### Comportamiento del clicker
- Una pulsación → paso 61.

---

## Pulsación 61 · Cierre Victoria Crea

### Estado de pantalla
Composición final del cierre: logo completo + claim + sello del aniversario.

### Composición visual
- Fondo: `#121212`
- Centro de pantalla: logo completo (`LOGO_COMPLETO_JUMILLA_TURISMO.svg`), 460 px de alto, centrado.
- Justo debajo (margen 36 px), el SVG `SLOGAN.svg` recoloreado a **Monastrell** (el original viene en casi-negro `#060703`, hay que forzar el `fill`).
- En la **esquina superior derecha** (top 100 px, right 120 px), un **sello circular**:
  - Círculo de 220 px de diámetro, **fondo Monastrell**, borde blanco 4 px, glow Monastrell sutil (40 px).
  - Dentro: "**700**" (Match, 72 px, **blanco bold**), divider blanco al 60 % (70 px), "1327 · 2027" (Bebas Neue, 20 px, blanco letterspaced 0.18 em).

> Decisión cromática del sello: fondo Monastrell con texto blanco (no negro con borde Monastrell, como decía el guion anterior). Sobre `#121212` el contraste es mejor y la pieza se siente "medalla institucional".

### Animación
1. Cross-fade desde la pantalla del 700 (0.5 s).
2. El logo aparece con fade-in y `scale: 0.95 → 1` (0.9 s, `power2.out`, desde 0.5 s).
3. El slogan aparece con fade-in + `y: 20 → 0` (0.7 s, desde 1.0 s).
4. El sello del aniversario aparece con rotación: `rotation: -30 → 0`, `opacity: 0 → 1`, `scale: 0.7 → 1` (0.9 s, ease `back.out(1.7)`, desde 1.3 s).

### Comportamiento del clicker
- Una pulsación → paso 62. **Pausa larga recomendada (aplauso final de Victoria Crea).**

---

## Pulsación 62 · Pantalla de transición a alcaldesa

### Estado de pantalla
Pantalla neutra con el isotipo en esquina mientras el presentador/a presenta a la alcaldesa.

### Composición visual
- Fondo: `#121212`
- Solo el isotipo (`LOGO_ISOTIPO.svg`) en **blanco** (recoloreado), esquina inferior derecha (bottom 80 px / right 100 px), opacidad 0.5, tamaño 120 px de alto.

### Animación
- Cross-fade desde la pantalla anterior. Todos los elementos hacen fade-out y aparece el isotipo en la esquina (0.6 s, `power2.out`).

### Comportamiento del clicker
- Una pulsación → avanza al Bloque 3, Pulsación 63.

---

# 🎬 BLOQUE 3 · Intervención alcaldesa

## Pulsación 63 · Presentación de la alcaldesa

### Estado de pantalla
Pantalla institucional con el nombre y cargo de la alcaldesa.

### Composición visual
- Fondo: `#121212` con un sutil patrón de fondo (`PATRON.svg` en Monastrell con opacidad 0.04).
- Centrado, todo en blanco (la línea y el cargo se pasan a blanco en lugar de Monastrell — sobre fondo negro el Monastrell pierde nitidez en la LED, patrón coherente con el manifiesto):
  - (Match, 160 px, blanco, bold): "Seve González"
  - Línea horizontal **blanca** (300 px ancho, 3 px grosor).
  - (Bebas Neue, 42 px, blanco, tracking 0.32 em): "ALCALDESA DE JUMILLA"

### Animación
1. Cross-fade.
2. El nombre aparece palabra a palabra (stagger 0.15s).
3. La línea horizontal se dibuja con `scaleX 0→1` (0.6s, `power2.out`).
4. El cargo aparece con fade-in (0.5s).

### Comportamiento del clicker
- Una pulsación → paso 64.

---

## Pulsación 64 · Durante el discurso

### Estado de pantalla
Pantalla discreta que acompaña el discurso de la alcaldesa sin distraer.

### Composición visual
- Fondo: `#121212`
- En la esquina inferior derecha (margen 80 px), `LOGO_ISOTIPO.svg` con sus colores originales (Monastrell + knockout blanco) al **40 % de opacidad**, tamaño 100 px. *(No hay versión "isotipo blanco" dedicada; recolorearlo todo a blanco aplana el knockout.)*
- En la esquina inferior izquierda (margen 80px), texto pequeño (Bebas Neue, 22px, blanco con opacidad 0.5): "CAPITAL DE LA MONASTRELL · 700 AÑOS · 2027".

### Animación
- Cross-fade desde la pantalla anterior. Los elementos discretos aparecen con fade-in suave.

### Comportamiento del clicker
- Una pulsación → avanza al Bloque 4, Pulsación 65.

---

# 🎬 BLOQUE 4 · Cierre y cocktail

## Pulsación 65 · Agradecimiento

### Estado de pantalla
Pantalla final formal de agradecimiento al acto.

### Composición visual
- Fondo: `#121212`
- Centrado:
  - (Match, 320 px, blanco, bold): "Gracias."
  - Debajo, **`LOGO_COMPLETO_BLANCO.svg`** (versión blanca, 280 px de alto). *No se añade `SLOGAN.svg` aparte porque el logo blanco ya integra el slogan visible sobre el fondo oscuro; añadir uno suelto sería duplicado. La versión en color del logo no se usa aquí porque su slogan integrado va en casi-negro (#060703) → invisible sobre `#121212`.*

### Animación
1. La palabra "Gracias." aparece con fade-in lento (1s).
2. El logo aparece con fade-in (delay 0.5s).
3. El claim aparece con fade-in (delay 1s).
4. Sutil pulso de respiración en el conjunto (todos los elementos ligeramente cambiando opacidad 0.95 ↔ 1 en ciclo de 4s, sutil).

### Comportamiento del clicker
- Una pulsación → paso 66.

---

## Pulsación 66 · Invitación al cocktail

### Estado de pantalla
Invitación visual al cocktail con vinos de Jumilla.

### Composición visual
- Fondo: **Monastrell sólido** (Capital de la Monastrell) — pendiente la imagen evocadora (copas/viñedos al atardecer); cuando esté disponible, se sustituye el fondo sólido por la imagen con tratamiento oscurecido y se reactivará el zoom-in lento.
- Centrado, todo en blanco:
  - (Bebas Neue, 42 px, blanco al 85 %, tracking amplio): "OS INVITAMOS A UN"
  - (Match, 220 px, **blanco bold**): "cocktail"
  - (Match, 96 px, **blanco bold**, centrado): "con los vinos de Jumilla."

### Animación
1. Cross-fade desde la pantalla anterior.
2. La imagen de fondo aparece con un suave zoom-in lento (`scale: 1 → 1.1` en 30s, infinito).
3. Los textos aparecen con stagger desde abajo (0.8s, stagger 0.3s).

### Comportamiento del clicker
- Una pulsación → avanza al **LOOP DE CIERRE** (automático).

---

## LOOP DE CIERRE · Ambiente cocktail

### Estado de pantalla
Loop automático que corre durante todo el cocktail. Composición que sirve de ambiente visual sin protagonizar.

### Composición visual
Secuencia automática (cada slide dura 8 s, cross-fade 1.5 s, ciclo infinito). Implementación actual: **3 slides tipográficas** sobre fondo Monastrell sólido con las frases del manifiesto en Match 132 bold blanco:
1. "Capital de la Monastrell."
2. "700 años custodiando la tradición."
3. "El origen del vino mediterráneo."

*Cuando lleguen los assets, se añadirán al ciclo: imágenes evocadoras de Jumilla (Castillo, viñedos, casco antiguo) y aplicaciones reales de la marca (mockups del bloque 2.8).*

Todas las slides comparten:
- El **isotipo discreto** en la esquina inferior derecha (opacidad 0.3, 90 px)
- Fondo Monastrell sólido (la imagen evocadora vendrá cuando esté disponible)

### Animación
- Transiciones entre slides: cross-fade lento (1.5s).
- Dentro de cada slide: parallax muy sutil para que no esté estática.

### Comportamiento del clicker
- **No avanza con clicker**. Es el estado final. Tecla `R` reinicia la presentación si fuera necesario para nuevos ensayos.

---

# 📋 Resumen final

| Bloque | Pulsaciones | Notas |
|---|---|---|
| 0 · Recepción | Loop | Sin clicker |
| 1 · Apertura | 1-3 | Pulsación 1 · presentadora Ángela Moreno (Victoria Crea) + título del evento + neutra |
| 2.1 · Por qué cambiar | 4-5 | |
| 2.2 · Encuestas | 6-13 | 6 datos + síntesis |
| 2.3 · Manifiesto | 14-15 | |
| 2.4 · Revelación logo | 16-30 | **Momento estrella 1** · revelación narrativa (15 pasos) |
| 2.5 · Colores | 31-37 | 5 colores |
| 2.6 · Tipografía | 38-42 | |
| 2.7 · Iconografía | 43-45 | |
| 2.8 · Aplicaciones | 46-56 | **10 mockups reales** (mupi, bandera, rollup, flyer, sello, camiseta, gorra, pulsera, web, instagram) |
| 2.9 · 700 años | 57-62 | **Momento estrella 2** |
| 3 · Alcaldesa | 63-64 | Pausa institucional |
| 4 · Cierre | 65-66 + Loop | |

**Total: 66 pulsaciones + 2 loops automáticos.**

> **Cambios acumulados (mayo 2026):**
> 1. Bloque 2.8 pasó de 6 → 11 pulsaciones (1 intro + 10 mockups), desplazando la numeración a partir de la 45. Subida de 60 → 65.
> 2. Añadida Pulsación 1 · presentadora Ángela Moreno (Victoria Crea), hermana visual de la presentación de la alcaldesa (puls. 63). Desplaza todas las pulsaciones posteriores +1. Subida de 65 → 66 (total actual).

---

## 🎯 Para Claude Code: orden de implementación recomendado

Si estás empezando el proyecto desde cero, este es el orden recomendado para construir las escenas:

1. **Infraestructura base**: `controller.js`, `preloader.js`, sistema de carga de fuentes, scaffolding del `#stage` con escalado responsive.
2. **Escena de Cargando**: simple, en Monastrell, mientras se precarga todo.
3. **Bloque 2.4 (revelación del logo)**: es el más complejo técnicamente. Si funciona esto, lo demás funciona.
4. **Bloque 2.2 (encuestas)**: el bloque con más pasos. Sirve para validar el patrón de animaciones repetitivas.
5. **Bloque 2.9 (700 años)**: el otro pico técnico (morphing de cifras).
6. **Bloques 0, 1, 2.1, 2.3**: textos y transiciones simples.
7. **Bloque 2.5 (colores)**: pieza muy reutilizable.
8. **Bloque 2.6 (tipografía)**: composiciones editoriales.
9. **Bloque 2.7 (iconografía)**: usa SVG ya cargados.
10. **Bloque 2.8 (aplicaciones)**: depende de mockups que llegarán después.
11. **Bloques 3 y 4 (alcaldesa y cierre)**: simples.
12. **Loops de recepción y cocktail**: cuando lleguen los assets.

---

## ⚠️ Recordatorios finales

- **El claim es "Capital de la Monastrell"**. No "Origen Profundo".
- **Los datos de la encuesta son reales y exactos**: 417, 52,37%, 42,59%, 63%, 9,78%, 59,94%.
- **Todo offline, sin internet**.
- **2048 x 768 píxeles, ratio 8:3**.
- **Solo flecha derecha avanza**.
- **Match + Bebas Neue, no más fuentes**.
- **Paleta cerrada: Monastrell, Azul Heráldico, Púrpura, Verde Envero, Negro Enriquecido**.

---

*Documento mantenido por Victoria Crea. Última actualización: mayo 2026.*
