# Mama Pizza: decisiones de diseño

Proceso: para cada componente se presentan 5 propuestas y el cliente elige.
Restricción: los textos de la web y la carta se mantienen literales (ver `contenido-original.md`).
Objetivos: marca más moderna/premium (C) + carta cómoda en móvil (D).
Identidad: mantener la actual y modernizarla (rojo + verde + vichy + porción de pizza).

| # | Componente | Elección | Archivo de propuestas |
|---|---|---|---|
| 1 | Cabecera + Hero | **04 · Cinemático nocturno** | `propuestas/01-cabecera-hero.html` |
| 2 | Carta | **05 · Pizarra con índice** (dudó con la 01; pidió "más detalles, no solo fondo negro") | `propuestas/02-carta.html` |
| 2b | Detalles de la carta | **Combinación 05 + 01: papel sobre madera con fotos** (portada con foto, franja de foto por categoría, miniaturas en sugerencias, papel crema troquelado con tira vichy roja) | `propuestas/03-carta-pizarra.html` (variante `v15`) |
| 3 | Ofertas, reserva, horarios, ubicación, pago y servicios | **02 · Cupones y cartel** (cupones troquelados, cartel de puerta ABIERTO/CERRADO en vivo, mapa polaroid, pegatinas de pago/servicios; fondo madera) | `propuestas/04-info.html` |
| 4 | Contacto ("Todo de un vistazo") + pie de página | **Combinación 02 + ticket de la 03**: contacto en grande y formulario en hoja de papel con tira vichy (02) + pie como ticket de caja con borde dentado, navegación, redes, legales, selector de idioma (16) y código de barras (03). Modal de Aviso legal literal | `propuestas/05-contacto-pie.html` (variante `c23`) |
| 2c | Fotos de la carta | Stock de Unsplash en BOCADILLOS CALIENTES, BOCADILLOS FRIOS, HAMBURGUESAS, PERRITO CALIENTE, ENSALADAS y SANDWICHES; pizzas, sugerencias, porciones e ingredientes se quedan con recortes de la foto original | `docs/fotos-stock.md` |

## Sistema visual derivado de la elección 1 (04 · Cinemático nocturno)
- Tema oscuro en toda la página (bloqueo de tema).
- Tipografía: Archivo (eje de anchura variable; titulares en 115-125 % de anchura, peso 900, mayúsculas).
- Colores: noche `#121310`, texto `#F6F3EE`, acento rojo brasa `#E0412F`, verde `#3E9B6A` como secundario puntual.
- Navegación: píldora de cristal flotante (backdrop-filter) y CTA "Reserva" roja.
- Hero: foto a sangre con degradado oscuro, H1 abajo a la izquierda.
- Cinta de ofertas en movimiento bajo el hero (única cinta animada de la página).
- Móvil: barra fija inferior con "Reserva" (tel:) y "Menú".
- Radios: CTAs en píldora completa.

## Decisiones técnicas y de contenido (2026-10-08)
- **Idiomas:** mantener los 16 idiomas de la web actual (es, cs, de, en, fr, hr, it, hu, nl, pl, pt, ro, ru, sk, tr, uk).
- **Formulario:** servicio de formularios externo (tipo Formspree / Web3Forms) que entrega en mamapizza6@gmail.com.
- **Meta description:** se mejora (la actual es "Bienvenido"). Es la única excepción a la regla de textos literales.
- **Tecnología:** HTML estático (HTML + CSS + JS sin framework).
