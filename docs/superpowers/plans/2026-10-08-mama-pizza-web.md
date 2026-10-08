# Mama Pizza: plan de implementación de la web

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Generar la nueva web estática de MAMA PIZZA, de una sola página en 16 idiomas, con la carta en HTML, el diseño elegido y el SEO literal de la web actual.

**Architecture:** Un script Node sin framework (`tools/build.mjs`) lee los datos de `content/` (carta, negocio, textos de interfaz por idioma) y los pasa a funciones de plantilla puras (`src/templates/*.mjs`, que devuelven strings HTML). Escribe `dist/` con una página por idioma, CSS concatenado, módulos JS del navegador sin bundler, imágenes optimizadas, `sitemap.xml` y `robots.txt`. La lógica compartida (horarios, validación del formulario) vive en `src/lib/` y la importan tanto el build como el navegador.

**Tech Stack:**
- Runtime y tests: Node 22 (ESM), `node --test`.
- devDependencies:
  - `sharp` (imágenes),
  - `node-html-parser` (extracción de textos y tests de HTML),
  - `@fontsource-variable/archivo` (fuente woff2 con eje `wdth`),
  - `@phosphor-icons/core` y `simple-icons` (SVG de iconos y logos).
- Envío del formulario: Web3Forms.

**Spec:** `docs/superpowers/specs/2026-10-08-mama-pizza-rediseno-design.md`.
**Referencias obligatorias:**
- `docs/contenido-original.md`: fuente de verdad de todos los textos.
- `docs/decisiones.md`: elecciones de diseño.
- `docs/fotos-stock.md`: fotos de stock.
- Maquetas aprobadas en `propuestas/`: hay que copiar su CSS y su marcado. Son la referencia visual.

## Global Constraints

- **Textos literales.** Todo texto visible de la web y de la carta se copia literal de `docs/contenido-original.md`, sin corregir mayúsculas, tildes ni puntuación ("BOCADILLOS FRIOS", "su teléfono", "Todas las Pizzas llevan como base : Salsa de Tomate y Mozzarella", "La Pizza como tú la quieres...."). Las únicas excepciones son:
  - la meta description,
  - el símbolo " €" tras los precios, que va en un `<span aria-hidden="true">` fuera del número,
  - las cadenas nuevas de interfaz `ui.*` de la Tarea 3.
- **`<title>` es:** `MAMA PIZZA - Madrid | Restaurante cerca de mí | Reserve ahora`. En los demás idiomas se usa el título extraído de la web actual; si no existe, el de `es`.
- **Meta description es:** `MAMA PIZZA, pizzería en Villaverde (Madrid). La pizza como tú la quieres, bocadillos, hamburguesas y ensaladas. 2x1 de lunes a jueves. Llama al 917954422.` Es la misma en todos los idiomas, porque el contenido propio está en español.
- **H1 único:** `MAMA PIZZA`. En el DOM va antes que el H2 `Bienvenido`.
- **Anclajes de sección exactos:** `home`, `menu`, `map`, `times`, `payment`, `aboutUs`, `services`, `contact`, `reservation`.
- **Datos de contacto:**
  - teléfono visible `917954422` / `+34917954422` y enlace `tel:+34917954422`,
  - correo `mamapizza6@gmail.com`,
  - dirección `Calle Parvillas Altas 6, 28021 Madrid, España`,
  - geo `40.3449809, -3.7077763`.
- **Horario (Europe/Madrid):**
  - lunes 18:00–23:00,
  - martes cerrado,
  - miércoles y jueves 18:00–23:00,
  - viernes y sábado 18:00–23:30,
  - domingo 18:00–23:00.
- **Idiomas, en este orden:** `es, cs, de, en, fr, hr, it, hu, nl, pl, pt, ro, ru, sk, tr, uk`. `es` vive en `/` y los demás en `/{lang}/`. `x-default` apunta a `/`.
- **Contenido propio en español en todos los idiomas** (ofertas, tarjeta Reserva, carta). Solo se traduce la interfaz.
- **Tokens de color:** `--night #121310`, `--ink #F6F3EE`, `--mute #ABA8A0`, `--red #E0412F`, `--paper #F2ECE0`, `--paper-ink #26211C`, `--paper-mute #6B645A`, `--red-paper #C8321F`, `--green-paper #1E6B45`.
- **Fuente:** Archivo variable autoalojada (`font-display: swap`). Sin fuentes ni iconos de CDN en producción.
- **Sin cookies no esenciales, sin analítica y sin CDN de terceros al cargar.** Google Maps solo tras pulsar "Mostrar mapa".
- **Ningún carácter `—` (raya)** en textos nuevos.
- **Variables de entorno del build:**
  - `SITE_URL` es obligatoria (el dominio está pendiente, spec §9.1); el build falla si falta.
  - `WEB3FORMS_KEY` es opcional; si falta, el formulario usa `mailto:` como alternativa.
- **Movimiento:** solo con `prefers-reduced-motion: no-preference`.
- **Calidad:**
  - Lighthouse móvil: Rendimiento ≥ 90, Accesibilidad ≥ 95, SEO 100.
  - Áreas táctiles de 44 px o más.
  - Contraste AA.

## Review Focus

1. **Dispositivo en otra zona horaria o en cambio de hora (DST).** "Abierto ahora" debe calcularse con la hora de Madrid, no con la del dispositivo. Test en la Tarea 2: `liveStatus` con un `Date` UTC en la madrugada del cambio de hora de octubre.
2. **Clave de interfaz que falta en un idioma.** La página debe mostrar el texto en español, nunca `undefined` ni la clave. Test en la Tarea 3: `t('xx-falta', 'de')` devuelve el valor de `es`; y en la Tarea 11, ningún HTML generado contiene `undefined` ni `{{`.
3. **Fallo de red o error del servicio al enviar el formulario.** Debe mostrar literal "Fallo en el envío del mensaje" y conservar lo escrito. Test en la Tarea 8: `submitForm` con un `fetch` simulado que rechaza devuelve `{ ok: false }` y no limpia los valores.
4. **JavaScript desactivado.** La carta completa, los horarios, los enlaces `tel:` y `mailto:` y el aviso legal (`<details>`) deben verse y funcionar. Test en la Tarea 11: el HTML generado contiene todos los `MenuItem` sin ejecutar JS, y "Mostrar mapa" es un `<a href>` a Google Maps mejorado progresivamente.
5. **Textos de interfaz largos (de, hu) y alfabeto cirílico (ru, uk).** La navegación no debe partirse en dos líneas a 1024 px y el cirílico debe verse con la fuente de reserva. Comprobación en la Tarea 12 (navegador, `de` y `ru` a 1024 px y 375 px). En la Tarea 5, el nav pasa a botón por debajo de 1100 px si `lang` es `de`, `hu` o `nl`.

---

## Estructura de archivos

```
package.json                      scripts: build, test, serve, images, extract-i18n
content/site.json                 negocio, contacto, horarios, ofertas, reserva, pago, servicios, aviso legal, form (es literal)
content/carta.json                carta literal (de propuestas/carta-data.js) + fotos por categoría
content/i18n/{lang}.json          16 archivos: textos de interfaz (extraídos) + ui.* (nuevos)
src/lib/hours.mjs                 lógica de horarios (build + navegador)
src/lib/form.mjs                  validación y envío del formulario (build + navegador)
src/lib/i18n.mjs                  carga de idiomas y t() con caída a es
src/lib/schema.mjs                JSON-LD Restaurant + Menu
src/templates/layout.mjs          <head>, SEO, hreflang, JSON-LD, envoltorio de página
src/templates/hero.mjs            nav, hero, cinta de ofertas, barra móvil
src/templates/carta.mjs           carta papel sobre madera + índice
src/templates/info.mjs            cupones, cartel de horarios, polaroid mapa, reserva, pago/servicios
src/templates/contacto.mjs        "Todo de un vistazo" + formulario
src/templates/footer.mjs          ticket, aviso legal, cookies, idioma
src/templates/icons.mjs           icon(name) → <svg><use href="/assets/icons.svg#name">
src/assets/css/{tokens,base,hero,carta,info,contacto,footer}.css
src/assets/js/main.js             punto de entrada; importa los módulos de abajo
src/assets/js/{nav,carta-index,live-hours,map-consent,form,legal,lang}.js
tools/extract-i18n.mjs            extrae los textos traducidos de la web actual (se ejecuta una vez)
tools/images.mjs                  optimiza fotos (AVIF/WebP + srcset), genera mapa estático y og.jpg
tools/icons.mjs                   genera dist/assets/icons.svg con los iconos usados
tools/build.mjs                   genera dist/
tests/*.test.mjs                  node --test
```

---

### Task 1: Proyecto y datos literales

**Files:**
- Create: `package.json`, `.gitignore` (`node_modules`, `dist`), `content/site.json`, `content/carta.json`, `tests/content.test.mjs`

**Interfaces:**
- Produces:
  - `content/carta.json`: `{ pdf:{ing,menu,por}, offer:{title, lines:string[]}, slogan:string, sections: Section[], ingredients:{ title, groups:{g:string, i:string[]}[] } }`, con:
    - `Section = { id, label, title, sub?, note?, sized:boolean, photo?:{ src, pos, alt }, crop?:{ size, pos }, items: Item[] }`,
    - `Item = { n, d?, p? , m?, f?, s?:true, ing?:string[] }`.

    Los ids, por orden, son `pizzas, sugerencias, porciones, calientes, frios, hamburguesas, perritos, ensaladas, sandwiches`. Los datos son los de `propuestas/carta-data.js` (`C`, `ING`, `OFFER`, `PDF`) y los recortes y fotos de `propuestas/03-carta-pizarra.html` (`CROP`, `PHOTO`).
  - `content/site.json`: `{ name, phone:{display:'917954422', intl:'+34917954422'}, email, address:{street:'Calle Parvillas Altas 6', postal:'28021', city:'Madrid', country:'España', full}, geo:{lat:40.3449809, lng:-3.7077763}, hours:[{day:0..6, open:'HH:MM'|null, close:'HH:MM'|null}], offers:{lj:{h3,h4,p}, fs:{h3,h4,p}}, reserve:{h3:'Reserva', h4:'Llámanos al 917954422', p}, welcome:'Bienvenido', aboutUs:'Sobre nosotros', payment:['En efectivo','VISA'], services:['Aire acondicionado','Para llevar'], legal:[[label,value]...], social:{tripadvisor, facebook}, privacyUrl, metaDescription }`. Los textos son los de `docs/contenido-original.md` §2 y §3.

- [ ] **Step 1:** `git init`, `npm init -y`, poner `"type":"module"` y los scripts `test: node --test tests/`, `build: node tools/build.mjs`, `serve: npx serve dist -l 4321`. Después `npm i -D sharp node-html-parser @fontsource-variable/archivo @phosphor-icons/core simple-icons`.
- [ ] **Step 2: Escribir el test que falla** `tests/content.test.mjs`:
  - `carta.sections.map(s=>s.id)` es igual al array de ids de arriba.
  - Número de platos por sección: `pizzas 7, sugerencias 5, porciones 12, calientes 6, frios 8, hamburguesas 2, perritos 2, ensaladas 2, sandwiches 3`.
  - Literales clave:
    - el plato `pizzas[0]` es `{n:'MAMA PIZZA BASE', m:'12,40', f:'18,60'}`,
    - `sandwiches[1].n === 'VEGETAL (Tomate, lechuga, cebolla y pepinillo)'` con `p:'3,70'`,
    - `frios` tiene el título `'BOCADILLOS FRIOS'`,
    - `pizzas.note === 'Todas las Pizzas llevan como base : Salsa de Tomate y Mozzarella'`,
    - `porciones[11]` es `{n:'Suplemento ingrediente', p:'0,60', s:true}`.
  - `site.hours`: el día `2` tiene `open:null` y el día `5` tiene `close:'23:30'`.
  - `site.offers.fs.p` es exactamente igual a `'50% DESCUENTO EN SEGUNDA PIZZA FAMILIARES O MEDIANAS 3 o MÁS INGREDIENTES FIN DE SEMANA, VIERNES Y VÍSPERAS'`.
  - `site.legal.length === 14`.
  - Ningún texto de `site.json` ni de `carta.json` contiene `—`.
- [ ] **Step 3:** `npm test` → FAIL (faltan los archivos).
- [ ] **Step 4:** Crear los dos JSON con los datos literales indicados.
- [ ] **Step 5:** `npm test` → PASS.
- [ ] **Step 6:** `git add -A && git commit -m "feat: datos literales de carta y negocio"`

### Task 2: Lógica de horarios

**Files:**
- Create: `src/lib/hours.mjs`, `tests/hours.test.mjs`

**Interfaces:**
- Consumes: `site.hours` (Tarea 1).
- Produces:
  - `madridParts(date: Date) → { day:0..6, minutes:number }`, con `Intl.DateTimeFormat('en-GB',{timeZone:'Europe/Madrid', weekday:'short', hour:'2-digit', minute:'2-digit', hourCycle:'h23'})`.
  - `liveStatus(hours, date: Date) → { open:boolean, today:number, kind:'until'|'today'|'next', time:'HH:MM', nextDay?:number }`.
  - `formatRange(open, close, clock:'24'|'12') → string`, donde `'24'` da `"18:00 – 23:00"` y `'12'` da `"06:00 PM – 11:00 PM"` (en-dash con espacios, como la web actual).

- [ ] **Step 1: Escribir los tests que fallan:**
  - Jueves `2026-10-08T17:30:00+02:00` → `{open:false, kind:'today', time:'18:00'}`.
  - Jueves `T20:00+02:00` → `{open:true, kind:'until', time:'23:00'}`.
  - Jueves `T23:00+02:00` (exacto) → `open:false`, `kind:'next'`, `nextDay:5`.
  - Lunes `2026-10-12T23:30+02:00` → `kind:'next'`, `nextDay:3`: se salta el martes.
  - Sábado `2026-10-10T23:29+02:00` → `open:true`.
  - **DST:** `new Date('2026-10-25T00:30:00Z')` (domingo, 02:30 hora de Madrid en el cambio) → `today:0`, `open:false`, `kind:'today'`.
  - **Dispositivo en otra zona:** con `process.env.TZ='America/New_York'` el resultado del caso "Jueves 20:00" no cambia.
  - `formatRange('18:00','23:30','12') === '06:00 PM – 11:30 PM'`.
- [ ] **Step 2:** `node --test tests/hours.test.mjs` → FAIL.
- [ ] **Step 3:** Implementar las tres funciones. Sin dependencias, válidas en Node y en el navegador.
- [ ] **Step 4:** `node --test tests/hours.test.mjs` → PASS.
- [ ] **Step 5:** `git commit -am "feat: horarios con estado en vivo en hora de Madrid"` (añadir antes los archivos nuevos).

### Task 3: Textos de interfaz en 16 idiomas

**Files:**
- Create: `tools/extract-i18n.mjs`, `content/i18n/{es,cs,de,en,fr,hr,it,hu,nl,pl,pt,ro,ru,sk,tr,uk}.json`, `src/lib/i18n.mjs`, `tests/i18n.test.mjs`

**Interfaces:**
- Produces:
  - `LANGS` (array en el orden de Global Constraints).
  - `loadI18n(dir) → Record<lang, Dict>`.
  - `makeT(dicts, lang) → (key:string) → string`. Si la clave falta en `lang`, devuelve la de `es`; si tampoco está en `es`, lanza un error.
  - Claves (todas obligatorias en `es` y `en`):
    - `title`, `clock` (`'24'`|`'12'`), `langName`;
    - `nav.menu, nav.location, nav.times, nav.payment, nav.about, nav.services, nav.contact, nav.reservation`;
    - `btn.reservation`;
    - `sec.menu`, `sec.reserve`, `sec.times`, `sec.payment`, `sec.services` y `sec.glance`, cada una como `[string,string]`, igual que los H2 partidos de la web ("Nuestro"/"menú");
    - `sec.location`, `map.show`, `map.ip`, `country`;
    - `days` (7 strings, de lunes a domingo), `closed`, `pay.cash`, `about`, `srv.ac`, `srv.takeaway`;
    - `glance.find, glance.mail, glance.call`;
    - `form.title, form.name, form.email, form.phone, form.subject, form.message, form.send, form.err.name, form.err.email, form.err.emailInvalid, form.err.phone, form.err.phoneInvalid, form.err.subject, form.err.message, form.ok, form.ok2, form.fail`;
    - `foot.legal, foot.privacy, foot.cookies`, `legal.labels` (14 strings);
    - claves nuevas `ui.openNow, ui.closedNow, ui.until, ui.opensToday, ui.opensOn, ui.today, ui.carta, ui.goTo, ui.close, ui.language, ui.ourMenu, ui.cookiesInfo, ui.howToGetThere`.

- [ ] **Step 1: Escribir los tests que fallan** `tests/i18n.test.mjs`:
  - Existen los 16 archivos.
  - `es.json` tiene `nav.location === 'Dónde estamos'`, `sec.times` igual a `['Nuestros','horarios de apertura']`, `form.phone === 'su teléfono'` y `closed === 'cerrado'`.
  - `en.json` tiene `title === 'MAMA PIZZA - Madrid | Restaurant near me | Book now'`, `map.show === 'Show Map'`, `days[0] === 'Monday'` y `clock === '12'`.
  - `de.json` tiene `days[1] === 'Dienstag'` y `closed === 'Geschlossen'`.
  - `makeT(dicts,'de')('ui.cosaQueNoExiste')` lanza un error, y `makeT({es:{a:'x'},de:{}}, 'de')('a') === 'x'`.
  - Ningún valor contiene `—`.
  - Todas las claves de `es` existen en `en`.
- [ ] **Step 2:** `node --test tests/i18n.test.mjs` → FAIL.
- [ ] **Step 3:** Implementar `tools/extract-i18n.mjs`.
  - Para cada idioma hace `fetch('https://mamapizza.metro.bar/?lang='+lang)`, quita `script` y `style` y obtiene la lista de textos visibles con `node-html-parser`.
  - Alinea por posición con la lista de `es`: el índice de cada texto conocido en `es` da el texto en `lang`.
  - Las claves de horas se ignoran (se generan con `formatRange`); `clock` es `'12'` si el texto de lunes contiene `PM`.
  - Si las listas difieren en longitud, alinea a partir del primer `H2` común y anota en consola las claves no resueltas, que quedan sin definir (caen a `es`).
  - Ejecutarlo una vez con `npm run extract-i18n` y versionar los JSON resultantes.
- [ ] **Step 4:** Escribir a mano las claves `ui.*`:
  - `es`: `Abierto ahora`, `Cerrado ahora`, `Hasta las {time}`, `Abrimos hoy a las {time}`, `Abrimos el {day} a las {time}`, `Hoy`, `Carta`, `Ir a`, `Cerrar`, `Idioma`, `Nuestro menú`, `Esta web solo usa cookies técnicas necesarias.`, `Cómo llegar`.
  - `en`, equivalentes en inglés.
  - Resto de idiomas, traducción cuidada. Añadir `"_review": ["ui.*"]` en cada archivo que no sea `es` ni `en`.
- [ ] **Step 5:** Implementar `src/lib/i18n.mjs`.
- [ ] **Step 6:** `node --test tests/i18n.test.mjs` → PASS.
- [ ] **Step 7:** Commit `feat: textos de interfaz en 16 idiomas`.

### Task 4: Head, SEO y datos estructurados

**Files:**
- Create: `src/lib/schema.mjs`, `src/templates/layout.mjs`, `tests/seo.test.mjs`

**Interfaces:**
- Consumes: `site`, `carta`, `makeT`, `LANGS`.
- Produces:
  - `restaurantLd(site, siteUrl) → object`, con `@type:'Restaurant'`, `servesCuisine:'Pizza'`, `priceRange:'€'`, `paymentAccepted:'Cash, VISA'`, `acceptsReservations:true`, `openingHoursSpecification`, sin martes y con `Friday`/`Saturday` hasta `23:30`, y `sameAs` con las 2 URLs sociales.
  - `menuLd(carta, siteUrl) → object`: `@type:'Menu'`, `hasMenuSection` (una por sección), cada `MenuItem` con `offers`. En pizzas son dos ofertas con `name:'MEDIANA'|'FAMILIAR'`. El precio va en formato numérico con punto (`'12.40'`) y `priceCurrency:'EUR'`. Los suplementos se excluyen.
  - `pageShell({ lang, t, siteUrl, body, site }) → string`, con:
    - `<!doctype html>`, `<html lang>`,
    - `<title>` = `t('title')`,
    - meta description = `site.metaDescription`,
    - `canonical` = `siteUrl + (lang==='es'?'/':'/'+lang+'/')`,
    - 16 `<link rel="alternate" hreflang>` más `x-default` → `/`,
    - Open Graph (`og:type restaurant.restaurant`, `og:image siteUrl+'/assets/og.jpg'`) y Twitter Card,
    - los meta `geo.position`, `ICBM` y `restaurant:contact_info:*` de la web actual,
    - dos `<script type="application/ld+json">`,
    - `<link rel="preload">` de la fuente y del póster del hero,
    - CSS enlazado `/assets/site.css` y `<script type="module" src="/assets/js/main.js">`.

- [ ] **Step 1: Escribir los tests que fallan:**
  - Parsear `pageShell(...)` de `es` y comprobar el `title` exacto de Global Constraints, la meta description exacta, que el `canonical` termina en `/` y que hay 17 `hreflang`.
  - Para `en`: el `canonical` termina en `/en/`.
  - El JSON-LD se puede parsear: `Restaurant.telephone === '+34917954422'` y `openingHoursSpecification.some(s=>s.dayOfWeek.includes('Tuesday')) === false`.
  - El `Menu` tiene 9 secciones, su primer item es `MAMA PIZZA BASE` con ofertas `12.40` y `18.60`, y ningún item se llama `SUPLEMENTO`.
- [ ] **Step 2:** `node --test tests/seo.test.mjs` → FAIL.
- [ ] **Step 3:** Implementar `schema.mjs` y `layout.mjs`.
- [ ] **Step 4:** PASS.
- [ ] **Step 5:** Commit `feat: head, hreflang y JSON-LD`.

### Task 5: Cabecera, hero, cinta de ofertas y barra móvil

**Files:**
- Create: `src/templates/hero.mjs`, `src/templates/icons.mjs`, `src/assets/css/tokens.css`, `src/assets/css/base.css`, `src/assets/css/hero.css`, `src/assets/js/nav.js`, `tests/sections.test.mjs`

**Interfaces:**
- Consumes: `t`, `site`, `carta.slogan`, `icon(name)`.
- Produces:
  - `icon(name:string, label?:string) → string` (SVG `<use>`; `aria-hidden` si no hay `label`).
  - `renderHero({t, site, carta}) → string` (`<header id="home">…`).
  - `renderMobileBar({t}) → string`.

- [ ] **Step 1: Escribir los tests que fallan** en `tests/sections.test.mjs` para el hero:
  - Hay exactamente un `h1` con el texto `MAMA PIZZA`, y en el DOM va antes que `h2` `Bienvenido`.
  - Los enlaces de la navegación tienen `href` `#menu`, `#map`, `#times`, `#aboutUs` y `#contact`.
  - Hay 2 o más `a[href="tel:+34917954422"]`.
  - La cinta contiene el texto exacto de las dos ofertas y `aria-hidden` en la copia duplicada.
  - La barra móvil tiene los enlaces `tel:` y `#menu`.
- [ ] **Step 2:** FAIL.
- [ ] **Step 3:** Implementar con el marcado y el CSS de la opción `o4` de `propuestas/01-cabecera-hero.html`:
  - nav píldora de cristal, que por debajo de 980 px pasa a botón con panel (`nav.js`: `aria-expanded`, Esc, foco al primer enlace). Por debajo de 1100 px en `html[lang=de|hu|nl]`.
  - Foto `pizza` con `<picture>` AVIF/WebP (rutas de la Tarea 10) y `fetchpriority="high"`.
  - `tokens.css` contiene exactamente los tokens de Global Constraints, `@font-face` de Archivo variable (`font-stretch 62% 125%`) y la cadena de reserva `system-ui, "Segoe UI", Roboto, sans-serif`.
- [ ] **Step 4:** PASS.
- [ ] **Step 5:** Commit `feat: cabecera y hero cinemático`.

### Task 6: Carta (papel sobre madera con fotos + índice)

**Files:**
- Create: `src/templates/carta.mjs`, `src/assets/css/carta.css`, `src/assets/js/carta-index.js`
- Modify: `tests/sections.test.mjs`

**Interfaces:**
- Consumes: `carta`, `t`, `icon`.
- Produces: `renderCarta({t, carta}) → string` (`<section id="menu">`).

- [ ] **Step 1: Escribir los tests que fallan** (carta):
  - Hay un `h2` con los textos `Nuestro` y `menú`.
  - Hay 10 `h3`: los 9 títulos de sección más `INGREDIENTES PIZZAS`, con los textos exactos de `carta.json`.
  - El texto de todos los `.n` junto suma 47 platos, igual que el total de `carta.json`.
  - Los enlaces a PDF tienen los textos `Ingredientes`, `Menú` y `Porciones` y sus URLs.
  - Todo precio aparece como `12,40` en un nodo y `€` en un `span[aria-hidden]` hermano.
  - El índice tiene un botón por sección y `data-target` igual a cada `id` de sección.
  - Cada `section` de categoría tiene `id="carta-{id}"`.
  - Las franjas con foto de stock llevan `role="img"` y un `aria-label` que termina en `en MAMA PIZZA, Villaverde (Madrid)`.
- [ ] **Step 2:** FAIL.
- [ ] **Step 3:** Implementar con el marcado y el CSS de la variante `v15` de `propuestas/03-carta-pizarra.html`:
  - portada, cabecera sobre madera, oferta, hoja de papel troquelada con tira vichy y sello;
  - franja por categoría, filas con puntos guía y miniaturas en las sugerencias;
  - dos columnas a partir de 760 px.
  - `carta-index.js`: el botón "Carta" (`t('ui.carta')`) abre una hoja inferior en móvil o un panel en escritorio. Hace `scrollIntoView` y cierra; con Esc y al pulsar fuera también cierra. Atrapa el foco mientras está abierto y devuelve el foco al botón al cerrar.
  - Las franjas usan las fotos optimizadas de la Tarea 10 (`/assets/img/{id}-{w}.{avif|webp}`) como `background-image` con `image-set()`.
- [ ] **Step 4:** PASS.
- [ ] **Step 5:** Commit `feat: carta en HTML papel sobre madera`.

### Task 7: Ofertas, horarios, mapa, reserva, pago y servicios (cupones y cartel)

**Files:**
- Create: `src/templates/info.mjs`, `src/assets/css/info.css`, `src/assets/js/live-hours.js`, `src/assets/js/map-consent.js`
- Modify: `tests/sections.test.mjs`

**Interfaces:**
- Consumes: `site`, `t`, `liveStatus`, `formatRange`, `icon`.
- Produces: `renderInfo({t, site}) → string`, con `section#aboutUs` (incluye `#reservation`), `#times`, `#map`, `#payment` y `#services`.

- [ ] **Step 1: Escribir los tests que fallan** (info):
  - Hay un `h3` `Ofertas lunes a jueves` y otro `Ofertas fines de semana`, cada uno con su `h4` `Todas las ofertas son para llevar` y el párrafo literal.
  - El `h2` de horarios tiene los textos `Nuestros` y `horarios de apertura`.
  - Hay 7 filas de horario con los nombres de `t('days')`, y la de martes tiene el texto `cerrado`.
  - La placa de estado se renderiza con `data-live` (el valor del build es solo inicial).
  - "Mostrar mapa" es `a[href^="https://www.google.com/maps"]` con `data-consent` y va acompañado del texto `Su dirección IP se enviará a Google Maps.`.
  - Están el `h2` `Haz tu` / `reserva`, `Llámanos al 917954422` y `LLÁMANOS Y RESERVA TU PEDIDO PARA LA HORA QUE QUIERAS`.
  - Están los textos de pago (`En efectivo`, `VISA`) y de servicios (`Aire acondicionado`, `Para llevar`).
  - Para `en`, la fila del lunes contiene `06:00 PM – 11:00 PM`.
- [ ] **Step 2:** FAIL.
- [ ] **Step 3:** Implementar con el marcado y el CSS de la opción `b2` de `propuestas/04-info.html`: cupones troquelados, cartel de puerta, polaroid, pared de reserva y pegatinas.
  - El mapa es la imagen estática de la Tarea 10, no teselas de OSM, con la atribución "© OpenStreetMap".
  - `live-hours.js` importa `src/lib/hours.mjs` (copiado a `/assets/js/lib/`), actualiza la placa ABIERTO/CERRADO, el subtítulo y la clase `today` al cargar y cada 60 s, con los textos `ui.*`.
  - `map-consent.js` intercepta el clic en `[data-consent]` y sustituye la polaroid por un `iframe` a `https://www.google.com/maps?q=Calle+Parvillas+Altas+6,+28021+Madrid&output=embed`. Sin JS, el enlace abre Google Maps.
- [ ] **Step 4:** PASS.
- [ ] **Step 5:** Commit `feat: cupones, cartel de horarios en vivo y mapa con consentimiento`.

### Task 8: "Todo de un vistazo" y formulario

**Files:**
- Create: `src/lib/form.mjs`, `src/templates/contacto.mjs`, `src/assets/css/contacto.css`, `src/assets/js/form.js`, `tests/form.test.mjs`
- Modify: `tests/sections.test.mjs`

**Interfaces:**
- Consumes: `site`, `t`, `icon`, `WEB3FORMS_KEY` (opción del build).
- Produces:
  - `validate(values:{name,email,tel,subj,msg}) → Record<field, errKey|null>`. Los `errKey` son `form.err.*`; el email se comprueba con `/^[^\s@]+@[^\s@]+\.[^\s@]+$/` y el teléfono con `/^\+?[\d\s-]{7,}$/`.
  - `submitForm(values, { key, fetchImpl }) → Promise<{ok:boolean}>`, que hace POST JSON a `https://api.web3forms.com/submit` con `access_key`, `subject`, `from_name` y `botcheck`.
  - `renderContacto({t, site, formKey}) → string` (`section#contact`).

- [ ] **Step 1: Escribir los tests que fallan** (`form.test.mjs`):
  - `validate({})` devuelve los 5 errores "vacío".
  - `validate({email:'a@b'})` da `email: 'form.err.emailInvalid'`.
  - `validate({tel:'12'})` da `tel: 'form.err.phoneInvalid'`.
  - Un valor completo y válido no da ningún error.
  - Con un `fetchImpl` que rechaza, `submitForm` devuelve `{ok:false}`.
  - Con un `fetchImpl` que responde `{success:true}`, devuelve `{ok:true}` y el cuerpo enviado incluye `access_key`.
- [ ] **Step 2: Escribir los tests que fallan** en `sections.test.mjs`:
  - El `h2` tiene los textos `Todo` y `de un vistazo`.
  - Están los `h3` `Encuéntrenos`, `Envíenos un correo electrónico` y `Llámenos`.
  - Los labels exactos son `Su nombre`, `Su correo electrónico`, `su teléfono`, `Asunto` y `Su mensaje`, y cada `label[for]` coincide con un `id`.
  - El botón tiene el texto `Enviar`.
  - Hay un input oculto `botcheck`.
  - Sin `formKey`, el `form` tiene `action="mailto:mamapizza6@gmail.com"`; con clave, `action="https://api.web3forms.com/submit"` y `method="POST"`, de modo que funciona sin JS.
- [ ] **Step 3:** FAIL.
- [ ] **Step 4:** Implementar con el marcado y el CSS de la opción `c2` (parte superior) de `propuestas/05-contacto-pie.html`.
  - `form.js` muestra los errores debajo de cada campo (`aria-invalid`, `aria-describedby`) y pone el foco en el primer error.
  - Al enviar con éxito muestra `form.ok` / `form.ok2`; si falla, `form.fail` y conserva los valores.
- [ ] **Step 5:** PASS.
- [ ] **Step 6:** Commit `feat: contacto y formulario con Web3Forms`.

### Task 9: Pie en ticket, aviso legal, cookies e idioma

**Files:**
- Create: `src/templates/footer.mjs`, `src/assets/css/footer.css`, `src/assets/js/legal.js`, `src/assets/js/lang.js`
- Modify: `tests/sections.test.mjs`

**Interfaces:**
- Consumes: `site`, `t`, `LANGS`, `dicts` (para `langName` de cada idioma), `icon`.
- Produces: `renderFooter({t, site, lang, dicts}) → string`.

- [ ] **Step 1: Escribir los tests que fallan** (pie):
  - Hay un `h2` `MAMA PIZZA`.
  - La navegación tiene los 8 enlaces con los textos `t('nav.*')`.
  - Los enlaces de tripAdvisor y Facebook tienen las URLs de `site.social` y `aria-label` `tripAdvisor` / `facebook`.
  - El aviso legal es un `<details>`/`<dialog>` con las 14 parejas literales: `SEGOVIA BLANCO`, `Tomo 1560 Folio 177 Hoja 28621`, `B80102528`…
  - Hay un enlace `Política de privacidad`.
  - Hay un botón `Cambiar configuración de cookies` que muestra `ui.cookiesInfo`.
  - El `select` de idioma tiene 16 `option`, con `value` igual a la URL de cada idioma, el texto `langName` y el actual seleccionado.
  - Aparece `© 2026 MAMA PIZZA` y no aparece la cadena `DISH`.
- [ ] **Step 2:** FAIL.
- [ ] **Step 3:** Implementar con el ticket de la variante `c23` de `propuestas/05-contacto-pie.html`: borde dentado, separadores discontinuos, código de barras decorativo `aria-hidden` y selector de idioma.
  - El aviso legal es un `<dialog>` abierto por `legal.js`, con un `<noscript>` alternativo que lo muestra como `<details>`.
  - `lang.js` navega a `select.value` al cambiar de idioma.
  - La "Política de privacidad" apunta provisionalmente a `site.privacyUrl` (spec §9.5).
- [ ] **Step 4:** PASS.
- [ ] **Step 5:** Commit `feat: pie en ticket con aviso legal e idiomas`.

### Task 10: Imágenes, mapa estático, fuente e iconos

**Files:**
- Create: `tools/images.mjs`, `tools/icons.mjs`, `assets-src/` (copiar `propuestas/assets/pizza.jpg` y descargar las 6 fotos de `docs/fotos-stock.md` con su URL `?w=1600&q=85`), `tests/assets.test.mjs`

**Interfaces:**
- Produces:
  - `dist/assets/img/{name}-{480|960|1600}.{avif,webp}` para `pizza, calientes, frios, hamburguesas, perritos, ensaladas, sandwiches`.
  - `dist/assets/img/map-{640|1200}.{avif,webp}`: mapa oscuro de 1200×800 centrado en la geo, marcador rojo dibujado al componer y atribución "© OpenStreetMap contributors".
  - `dist/assets/og.jpg` (1200×630, la pizza con "MAMA PIZZA").
  - `dist/assets/fonts/archivo-*.woff2`: copiados de `@fontsource-variable/archivo`, versión "full" con `wdth`, subconjuntos `latin` y `latin-ext`.
  - `dist/assets/icons.svg`: sprite con los iconos de Phosphor usados (`phone, book-open-text, list, x, map-pin, map-trifold, envelope-simple, money, credit-card, snowflake, bag, scissors, file-pdf, list-bullets, paper-plane-tilt`) y `tripadvisor` / `facebook` de `simple-icons`.

- [ ] **Step 1: Escribir los tests que fallan:**
  - Tras `node tools/images.mjs && node tools/icons.mjs` existen todos los archivos listados.
  - `og.jpg` mide 1200×630 (leer con `sharp().metadata()`).
  - Cada `-1600.webp` pesa menos de 250 KB.
  - El sprite contiene `id="phone"` e `id="tripadvisor"`.
- [ ] **Step 2:** FAIL.
- [ ] **Step 3:** Implementar los scripts.
  - El mapa se compone **una sola vez** con las teselas `https://tile.openstreetmap.org/16/{x}/{y}.png` para `x 32092..32094` e `y 24727..24729`, con un `User-Agent` identificativo. El punto del negocio está en el píxel `(261, 352)` del lienzo de 768×768.
  - Se aplica el mismo filtro oscuro que en la maqueta (`grayscale` + `negate` + `modulate`) y se versiona en `assets-src/map.png` para no volver a pedir teselas.
  - Añadir los scripts `images` e `icons` a `package.json`.
- [ ] **Step 4:** PASS.
- [ ] **Step 5:** Commit `feat: pipeline de imágenes, mapa estático, fuente e iconos` (sin `dist/`).

### Task 11: Build completo de 16 idiomas

**Files:**
- Create: `tools/build.mjs`, `src/assets/js/main.js`, `tests/build.test.mjs`

**Interfaces:**
- Consumes: todas las funciones `render*`, `pageShell`, `loadI18n`, `makeT`, `LANGS` y los scripts de la Tarea 10.
- Produces:
  - `build({ siteUrl, formKey, outDir='dist' }) → Promise<void>`, que genera:
    - `dist/index.html` (es) y `dist/{lang}/index.html`,
    - `dist/assets/site.css`, la concatenación en este orden: `tokens, base, hero, carta, info, contacto, footer`,
    - `dist/assets/js/**` (copia de `src/assets/js` y de `src/lib/hours.mjs` y `form.mjs` en `js/lib/`),
    - `dist/sitemap.xml` con `xhtml:link` alternates,
    - `dist/robots.txt` con `Sitemap: {siteUrl}/sitemap.xml`.
  - CLI: `SITE_URL=… WEB3FORMS_KEY=… node tools/build.mjs`. Sale con código 1 y el mensaje `SITE_URL es obligatoria` si falta.

- [ ] **Step 1: Escribir los tests que fallan** (`build.test.mjs`, con `build({siteUrl:'https://example.test', outDir: tmp})`):
  - Existen los 16 `index.html`.
  - Ningún HTML contiene `undefined`, `{{`, `NaN` ni `—`.
  - Cada página tiene un único `h1`, `html[lang]` correcto y 17 `hreflang`.
  - Todos los anclajes de Global Constraints existen como `id`.
  - La página `de` contiene `Öffnungszeiten` y también el texto en español `Ofertas lunes a jueves`.
  - El `sitemap.xml` tiene 16 `<url>`.
  - Ejecutar el CLI sin `SITE_URL` sale con código 1.
  - Todos los `href="#…"` apuntan a un `id` existente.
- [ ] **Step 2:** FAIL.
- [ ] **Step 3:** Implementar `build.mjs` (orden de `main`: hero, carta, info, contacto; luego pie y barra móvil) y `main.js`, que importa `nav, carta-index, live-hours, map-consent, form, legal, lang`.
- [ ] **Step 4:** `npm test` → todo PASS.
- [ ] **Step 5:** `SITE_URL=https://example.test npm run build && npm run serve` y abrir `http://localhost:4321/`, comparándolo visualmente con las maquetas elegidas.
- [ ] **Step 6:** Commit `feat: build estático de 16 idiomas`.

### Task 12: Verificación final en navegador

**Files:**
- Modify: lo que haga falta para corregir los fallos encontrados (cada corrección con su test si es lógica).
- Create: `docs/qa-2026-10-08.md` con los resultados.

- [ ] **Step 1:** Con `npm run serve`, revisar las páginas `/`, `/en/`, `/de/` y `/ru/` a 375, 768, 1024 y 1440 px.
  - La navegación cabe en una sola línea o en el botón.
  - No hay scroll horizontal.
  - El cirílico se ve con la fuente de reserva.
  - El índice de la carta, el mapa, el aviso legal, el formulario (errores, éxito y fallo, este último simulado cortando la red) y el selector de idioma funcionan.
- [ ] **Step 2:** Con JS desactivado: la carta, los horarios, los enlaces `tel:`, el enlace del mapa y el aviso legal (`noscript`) se ven y funcionan.
- [ ] **Step 3:** Con `prefers-reduced-motion: reduce` no se anima nada: ni la cinta, ni el pulso, ni la entrada del hero.
- [ ] **Step 4:** `npx lighthouse http://localhost:4321/ --preset=perf --form-factor=mobile` y la ejecución completa. Objetivos: Rendimiento ≥ 90, Accesibilidad ≥ 95, SEO 100. Anotar los resultados.
- [ ] **Step 5:** Validar el JSON-LD pegando el HTML de `/` en la Prueba de resultados enriquecidos de Google (https://search.google.com/test/rich-results) y en https://validator.schema.org. Anotar los avisos.
- [ ] **Step 6:** Commit `chore: QA final` con `docs/qa-2026-10-08.md`.

---

## Fuera del plan (pendiente de la pizzería, spec §9)

Dominio y redirecciones desde `mamapizza.metro.bar`, oferta de fin de semana, significado del SUPLEMENTO, fotos propias, política de privacidad propia, logo definitivo, traducción de la carta y cuenta de Web3Forms. El build ya tiene los puntos de enganche: `SITE_URL`, `WEB3FORMS_KEY`, `site.privacyUrl` y los datos en `content/`.
