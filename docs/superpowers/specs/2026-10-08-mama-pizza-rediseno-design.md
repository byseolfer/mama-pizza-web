# Mama Pizza: especificación del rediseño web

Fecha: 2026-10-08
Estado: borrador para revisión del cliente
Fuentes: `docs/contenido-original.md` (textos literales), `docs/decisiones.md` (elecciones), `docs/fotos-stock.md` (imágenes), maquetas en `propuestas/`.

---

## 1. Objetivo y criterios de éxito

**Objetivo.** Rediseñar la web de MAMA PIZZA (pizzería en Calle Parvillas Altas 6, Villaverde, Madrid) para que:
1. la marca se vea **moderna y premium**, conservando su identidad (rojo, verde, vichy, porción de pizza), y
2. la **carta se consulte cómodamente en el móvil**, como HTML y no como PDF.

**Restricción principal.** Los textos visibles de la web y de la carta se mantienen **literales** para no perder SEO. Única excepción aprobada: la meta description.

**Éxito.**
- Toda la carta (Menú, Porciones, Ingredientes) es texto HTML indexable, con los mismos nombres, descripciones y precios que los PDF.
- Se mantienen el `<title>`, la jerarquía de encabezados y los anclajes de la web actual.
- Lighthouse móvil: Rendimiento ≥ 90, Accesibilidad ≥ 95, SEO 100.
- Se puede llamar a la pizzería con un toque desde cualquier punto de la página en móvil.

---

## 2. Estructura de la página (una sola página, en este orden)

| # | Bloque | Anclaje | Maqueta de referencia |
|---|---|---|---|
| 1 | Cabecera + Hero | `#home` | `propuestas/01-cabecera-hero.html` · opción **04 Cinemático nocturno** |
| 2 | Cinta de ofertas | (parte del hero) | misma maqueta |
| 3 | Carta | `#menu` | `propuestas/03-carta-pizarra.html` · variante **05 + 01 (papel sobre madera con fotos)** |
| 4 | Ofertas y reserva ("Sobre nosotros") | `#aboutUs`, `#reservation` | `propuestas/04-info.html` · opción **02 Cupones y cartel** |
| 5 | Horarios | `#times` | ídem (cartel de puerta) |
| 6 | Dónde estamos | `#map` | ídem (polaroid) |
| 7 | Opciones de pago y servicios | `#payment`, `#services` | ídem (pegatinas) |
| 8 | Todo de un vistazo + formulario | `#contact` | `propuestas/05-contacto-pie.html` · **02 + ticket de la 03** |
| 9 | Pie de página (ticket) | | ídem |
| | Barra fija inferior (solo móvil) | | "Reserva" (tel:) + "Menú" (#menu) |

Los anclajes son los mismos que usa hoy la navegación (`#home`, `#menu`, `#map`, `#times`, `#payment`, `#aboutUs`, `#services`, `#contact`, `#reservation`), para que los enlaces existentes sigan funcionando.

---

## 3. Sistema visual

**Tema.** La página es oscura de principio a fin. A partir de la carta, el fondo es la **madera** de la foto original, oscurecida, y el contenido va sobre **papel crema** (carta, cupones, polaroid, formulario, ticket). El hero es la única zona de foto a sangre.

**Tipografía.** Archivo (fuente variable con eje de anchura), autoalojada en woff2.
- Titulares: peso 900, anchura 115-125 %, mayúsculas, interlineado 0,85-0,95.
- Texto: peso 400-700, anchura 100 %, 14-16 px, mínimo 16 px en campos de formulario (evita el zoom en iOS).

**Colores (tokens).**

| Token | Valor | Uso |
|---|---|---|
| `--night` | `#121310` | fondo base |
| `--ink` | `#F6F3EE` | texto sobre oscuro |
| `--mute` | `#ABA8A0` | texto secundario sobre oscuro |
| `--red` | `#E0412F` | acento único: CTAs, oferta 2 x 1, botón "Carta" |
| `--paper` | `#F2ECE0` | papel |
| `--paper-ink` | `#26211C` | texto sobre papel |
| `--paper-mute` | `#6B645A` | secundario sobre papel |
| `--red-paper` | `#C8321F` | títulos sobre papel, vichy |
| `--green-paper` | `#1E6B45` | subtítulos sobre papel, oferta 50 % |

**Formas.** CTAs en píldora. Tarjetas oscuras con radio de 18-24 px y papeles con radio de 4-6 px, con bordes troquelados, dentados o perforados según el objeto.

**Iconos.** Phosphor (una sola familia), autoalojados como SVG sprite. Logos de tripAdvisor y Facebook desde Simple Icons, también autoalojados.

**Movimiento** (todo desactivado con `prefers-reduced-motion`):
- entrada escalonada del hero,
- cinta de ofertas en bucle (la única cinta animada de la página),
- pulso del indicador "Abierto ahora",
- apertura y cierre del índice de la carta y de los modales.

---

## 4. Componentes

### 4.1 Cabecera + Hero (Cinemático nocturno)
- **Navegación:** píldora de cristal flotante con logo (porción + "MAMA PIZZA"), enlaces (Menú, Dónde estamos, Horarios de apertura, Sobre nosotros, Contacto) y CTA roja **"Reserva"**, que es `tel:+34917954422`. Por debajo de 980 px se convierte en botón de menú que abre un panel con los mismos enlaces.
- **Hero:** foto a sangre `pizza.jpg` con degradado oscuro. Abajo a la izquierda: H2 "Bienvenido", **H1 "MAMA PIZZA"**, frase de la carta "La Pizza como tú la quieres.... También bocadillos, hamburguesas y ensaladas" y los CTAs "Reserva" y "Nuestro menú". En el HTML el H1 va antes que el H2 "Bienvenido", como en la web actual, y "Bienvenido" se coloca encima solo visualmente con CSS (`order`). Así la jerarquía de encabezados queda correcta.
- **Cinta de ofertas** bajo el hero, con los textos literales de las dos ofertas y "Todas las ofertas son para llevar".
- **Barra fija inferior en móvil:** "Reserva" y "Menú".

### 4.2 Carta (papel sobre madera con fotos)
- **Cabecera** sobre madera: foto de portada, línea "La Pizza como tú la quieres....", **H2 "Nuestro menú"**, enlaces a los PDF con su texto actual ("Ingredientes", "Menú", "Porciones") y la tarjeta roja "OFERTA:" con el texto literal del PDF.
- **Hoja de papel** con borde troquelado, tira vichy y sello "MAMA PIZZA". Contiene, por este orden: PIZZAS (PRECIO SEGÚN INGREDIENTES), PIZZAS (SUGERENCIAS), PIZZAS (PORCIONES), BOCADILLOS CALIENTES, BOCADILLOS FRIOS, HAMBURGUESAS, PERRITO CALIENTE, ENSALADAS, SANDWICHES e INGREDIENTES PIZZAS.
- **Cada categoría** (H3) arranca con una franja de foto y el título encima. Los platos van en filas con puntos guía hasta el precio. Las pizzas llevan dos columnas, MEDIANA y FAMILIAR. Los suplementos van en gris.
- **Fotos de las franjas:** stock de Unsplash en calientes, fríos, hamburguesas, perritos, ensaladas y sándwiches; recortes de `pizza.jpg` en el resto. Las pizzas sugeridas llevan miniatura redonda.
- **Botón flotante rojo "Carta"** que abre un índice: hoja inferior en móvil, ventana flotante en escritorio. Salta a cada categoría.
- **Escritorio:** dos columnas, como una carta impresa.
- **Precios:** se muestran con " €". En el HTML el número es literal.

### 4.3 Ofertas, reserva, horarios, ubicación, pago y servicios (Cupones y cartel)
- **Ofertas:** dos cupones de papel troquelados con resguardo. Cada uno lleva H3 ("Ofertas lunes a jueves" / "Ofertas fines de semana"), H4 "Todas las ofertas son para llevar" y el texto literal. Resguardo: "2 x 1" en rojo y "50%" en verde.
- **Horarios:** cartel de puerta colgado con **H2 "Nuestros horarios de apertura"**, los 7 días literales y una placa **ABIERTO / CERRADO** calculada con la hora de Madrid. Debajo, "Hasta las 23:00", "Abrimos hoy a las 18:00" o "Abrimos el miércoles a las 18:00". El día de hoy aparece resaltado.
- **Dónde estamos:** polaroid con mapa estático oscuro y marcador, pie con H2 "Dónde estamos" y la dirección. El botón **"Mostrar mapa"** carga Google Maps, con el aviso literal "Su dirección IP se enviará a Google Maps.".
- **Reserva:** **H2 "Haz tu reserva"**, teléfono 917954422 en grande, H4 "Llámanos al 917954422", "LLÁMANOS Y RESERVA TU PEDIDO PARA LA HORA QUE QUIERAS" y CTA "Reserva".
- **Pago y servicios:** pegatinas con "Disponible opciones de pago" (En efectivo, VISA) y "Nuestros servicios" (Aire acondicionado, Para llevar).
- **"Sobre nosotros":** en la web actual es un encabezado H3 sin contenido propio que agrupa las tarjetas de Reserva y Ofertas. Se conserva como H2 del bloque y como anclaje `#aboutUs`. Opcional: si la pizzería aporta un texto propio, se añade aquí.

### 4.4 Todo de un vistazo + formulario (02)
- **Columna izquierda:** **H2 "Todo de un vistazo"** y tres datos grandes enlazados: Encuéntrenos (abre Google Maps), Envíenos un correo electrónico (`mailto:`) y Llámenos (`tel:`).
- **Columna derecha:** hoja de papel con tira vichy y formulario **"Envíenos su mensaje"**.
  - Campos: Su nombre, Su correo electrónico, su teléfono, Asunto y Su mensaje. Botón "Enviar".
  - Mensajes de error, éxito y fallo literales.
  - Etiqueta encima de cada campo y error debajo, con `aria-invalid` y `aria-describedby`.
- **Envío:** servicio de formularios externo (Web3Forms o Formspree) con destino `mamapizza6@gmail.com`. Antispam con honeypot; sin CAPTCHA visible.

### 4.5 Pie de página (ticket de caja)
- **Contenido del ticket,** con borde dentado arriba y abajo:
  - H2 "MAMA PIZZA" y la dirección,
  - Llámenos y correo,
  - navegación (Menú, Dónde estamos, Horarios de apertura, Opciones de pago, Sobre nosotros, Servicios, Contacto, Reserva),
  - tripAdvisor y facebook,
  - Aviso legal, Política de privacidad y Cambiar configuración de cookies,
  - selector de **Idioma** con los 16 nombres literales,
  - código de barras decorativo y "© 2026 MAMA PIZZA".
- **Aviso legal:** se abre en un modal con todos los datos literales.
- **Crédito eliminado:** "Diseñado por DISH Digital Solutions GmbH...".

---

## 5. SEO

**Se mantiene literal:**
- `<title>`: "MAMA PIZZA - Madrid | Restaurante cerca de mí | Reserve ahora", y su versión traducida en cada idioma, tomada de la web actual.
- H1 "MAMA PIZZA" y todos los H2, H3 y H4 de `contenido-original.md`.
- Textos de enlace "Ingredientes", "Menú" y "Porciones" hacia los PDF.
- Teléfono, dirección y correo.

**Se mejora:**
- **Meta description y `og:description`** (antes "Bienvenido"). Propuesta en español, de 150 caracteres o menos:
  > "MAMA PIZZA, pizzería en Villaverde (Madrid). La pizza como tú la quieres, bocadillos, hamburguesas y ensaladas. 2x1 de lunes a jueves. Llama al 917954422."
- **Carta en HTML** en vez de solo PDF. Es la mayor ganancia de contenido indexable.
- **Datos estructurados JSON-LD:**
  - `Restaurant` con nombre, dirección, `geo` (40.3449809, -3.7077763), teléfono, correo, `servesCuisine: Pizza`, `priceRange: €`, `paymentAccepted: Cash, VISA`, `openingHoursSpecification` (martes cerrado), `hasMap`, `sameAs` (tripAdvisor, Facebook), `acceptsReservations: true` e `image`.
  - `Menu`, con `MenuSection` por categoría y `MenuItem` con `offers.price` y `priceCurrency: EUR`. Las pizzas llevan dos ofertas: Mediana y Familiar.
  - `Offer` / `hasOfferCatalog` para el 2 x 1 y el 50 %. Opcional; validar con la Prueba de resultados enriquecidos.
- **Open Graph y Twitter Card** con una imagen de 1200×630 nueva.
- **`alt` descriptivos y locales** en todas las imágenes, por ejemplo "… en MAMA PIZZA, Villaverde (Madrid)".
- **`hreflang` para los 16 idiomas más `x-default` → es.** Hoy solo se declaran es y en, y algunas versiones (por ejemplo de) ni siquiera tienen `<title>`.
- **`canonical`** por idioma, `sitemap.xml` con alternates y `robots.txt`.
- **Rendimiento:** imágenes WebP/AVIF con `srcset` y tamaños reservados (CLS < 0,1), hero con `fetchpriority="high"` y fuente con `font-display: swap` y precarga.

---

## 6. Idiomas (16)

- **Idiomas:** es (por defecto), cs, de, en, fr, hr, it, hu, nl, pl, pt, ro, ru, sk, tr, uk.
- **Comportamiento actual que se replica:**
  - **Se traduce:** la interfaz (títulos de sección, días de la semana, "Mostrar mapa", aviso de Google Maps, etiquetas y mensajes del formulario, enlaces del pie). Se toman **literalmente de la versión de cada idioma de la web actual**.
  - **Se queda en español:** el contenido propio de la pizzería (ofertas, tarjetas de Reserva, nombres y descripciones de la carta), como ocurre hoy.
  - **Formato de hora** por idioma, por ejemplo "06:00 PM – 11:00 PM" en inglés, igual que la web actual.
- **Mejora opcional (decidir):** traducir también la carta y las ofertas, al menos al inglés. Sería contenido nuevo traducido a mano o revisado.
- **URLs:** `/` (es), `/en/`, `/de/`… La web actual usa `?lang=xx` (ver riesgo de dominio en §9).

---

## 7. Arquitectura técnica

- **HTML estático, sin framework.** Para no mantener 16 HTML a mano, un **script de generación** pequeño (Node o Python, sin dependencias pesadas) produce las páginas a partir de:
  - `content/carta.json`: carta literal, la misma estructura que ya usan las maquetas (`propuestas/carta-data.js`),
  - `content/site.json`: datos del negocio, horarios, ofertas y aviso legal,
  - `content/i18n/{lang}.json`: textos de interfaz por idioma,
  - `templates/index.html` con las secciones.
- **Salida:** `dist/{lang}/index.html` con CSS crítico en línea, más un CSS y un JS pequeños compartidos.
- **JS mínimo:** estado "Abierto ahora", índice de la carta, carga del mapa con consentimiento, modal de aviso legal, validación y envío del formulario, y selector de idioma. Sin dependencias.
- **Assets autoalojados:**
  - fotos (`pizza.jpg` y las 6 de Unsplash, optimizadas),
  - mapa estático (una imagen generada una vez, para no pedir teselas a terceros al cargar),
  - fuente Archivo (woff2, subconjuntos latin y latin-ext; Archivo no tiene cirílico, así que ru y uk usan la fuente del sistema como reserva),
  - iconos.
- **Privacidad y cookies:** no se usan cookies no esenciales ni analítica, así que no hace falta banner. El enlace "Cambiar configuración de cookies" se conserva y abre un panel informativo. Si más adelante se añade analítica, se añade el banner.
- **Alojamiento:** cualquier hosting estático (Netlify, Cloudflare Pages, Vercel o el hosting del cliente). Pendiente: ver §9.

---

## 8. Accesibilidad y calidad

- Contraste AA en todo, incluido texto sobre papel y sobre foto.
- Áreas táctiles de 44 px o más.
- Foco visible y navegación completa por teclado: el índice de la carta y los modales atrapan el foco y se cierran con Esc.
- `lang` correcto por página, landmarks (`header`, `nav`, `main`, `footer`) y orden de encabezados sin saltos.
- `prefers-reduced-motion` respetado.
- **Pruebas antes de entregar:**
  - navegadores: Safari iOS, Chrome Android y escritorio (Chrome, Safari, Firefox),
  - anchos: 375, 768, 1024 y 1440 px,
  - herramientas: Lighthouse, la Prueba de resultados enriquecidos de Google y el validador de `hreflang`.

---

## 9. Riesgos y cuestiones abiertas (requieren respuesta de la pizzería)

1. **Dominio (riesgo SEO principal).** La web vive en `mamapizza.metro.bar`, un subdominio de la plataforma METRO/DISH. Si la nueva web va a otro dominio, hay que confirmar si DISH permite redirecciones 301 desde `mamapizza.metro.bar/?lang=xx`. Si no lo permite, se pierde la autoridad acumulada y conviene actualizar Google Business Profile, tripAdvisor y Facebook con la nueva URL. **Hay que decidir el dominio antes de construir.**
2. **Oferta del fin de semana.** La web dice "FIN DE SEMANA, VIERNES Y VÍSPERAS" y el PDF dice "fines de semana y festivos". Se publican tal cual; conviene que la pizzería confirme cuál es la correcta.
3. **"SUPLEMENTO" de pizzas** (2,50 / 3,00): confirmar que es el precio de cada ingrediente a partir del sexto.
4. **Fotos propias.** Las fotos de stock y los recortes son provisionales. Lo ideal es una sesión de fotos de sus productos y del local.
5. **Política de privacidad.** La actual está alojada en DISH. Hay que redactar una propia que mencione el formulario y el servicio de envío.
6. **Logo.** En las maquetas se usa un redibujo provisional de la porción. Falta aprobar el logo final, que se modernizará a partir del original.
7. **Traducción de la carta** a otros idiomas: ¿sí o no? (§6).
8. **Servicio del formulario:** elegir Web3Forms o Formspree y crear la cuenta con `mamapizza6@gmail.com`.

---

## 10. Fuera de alcance

- Pedidos online o pasarela de pago.
- Panel para que la pizzería edite precios. Se editan en `content/carta.json`; si más adelante hace falta, se puede añadir un CMS sin cambiar el diseño.
- Analítica y publicidad.
