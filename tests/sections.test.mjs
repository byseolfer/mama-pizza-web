import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { parse } from 'node-html-parser';
import { loadI18n, makeT } from '../src/lib/i18n.mjs';
import { renderHero, renderMobileBar } from '../src/templates/hero.mjs';

const load = (p) => JSON.parse(readFileSync(new URL(`../${p}`, import.meta.url), 'utf8'));
const site = load('content/site.json');
const carta = load('content/carta.json');
const dicts = loadI18n(new URL('../content/i18n/', import.meta.url));
const ctx = (lang = 'es') => ({ t: makeT(dicts, lang), site, carta, lang, dicts });

test('hero: un único H1 "MAMA PIZZA" antes del H2 "Bienvenido"', () => {
  const html = renderHero(ctx());
  const doc = parse(html);
  const h1 = doc.querySelectorAll('h1');
  assert.equal(h1.length, 1);
  assert.equal(h1[0].text.replace(/\s+/g, ' ').trim(), 'MAMA PIZZA');
  assert.equal(doc.querySelector('h2').text.trim(), 'Bienvenido');
  assert.ok(html.indexOf('<h1') < html.indexOf('<h2'));
  assert.equal(doc.querySelector('header').getAttribute('id'), 'home');
});

test('hero: usa la foto dedicada hero-*, no la foto compartida de la carta', () => {
  const doc = parse(renderHero(ctx()));
  const img = doc.querySelector('.hero-bg img');
  assert.match(img.getAttribute('src'), /\/assets\/img\/hero-960\.webp$/);
  const avifSrcset = doc.querySelector('.hero-bg source[type="image/avif"]').getAttribute('srcset');
  assert.match(avifSrcset, /\/assets\/img\/hero-480\.avif/);
});

test('hero: la navegación enlaza a las secciones de la web actual', () => {
  const hrefs = parse(renderHero(ctx())).querySelectorAll('.nav-links a').map((a) => a.getAttribute('href'));
  for (const h of ['#menu', '#map', '#times', '#aboutUs', '#contact']) assert.ok(hrefs.includes(h), h);
});

test('hero: "Reserva" llama por teléfono', () => {
  const tel = parse(renderHero(ctx())).querySelectorAll('a[href="tel:+34917954422"]');
  assert.ok(tel.length >= 2);
  assert.ok(tel.some((a) => a.text.includes('Reserva')));
});

test('hero: la cinta lleva las dos ofertas literales y la copia es aria-hidden', () => {
  const doc = parse(renderHero(ctx()));
  const ticker = doc.querySelector('.ticker');
  assert.ok(ticker.text.includes(site.offers.lj.p));
  assert.ok(ticker.text.includes(site.offers.fs.p));
  const groups = ticker.querySelectorAll('.track > .group');
  assert.equal(groups.length, 2);
  assert.equal(groups[1].getAttribute('aria-hidden'), 'true');
});

test('hero: textos de interfaz traducidos en inglés', () => {
  const doc = parse(renderHero(ctx('en')));
  assert.ok(doc.querySelectorAll('.nav-links a').some((a) => a.text.trim() === 'Location'));
  assert.equal(doc.querySelector('h1').text.replace(/\s+/g, ' ').trim(), 'MAMA PIZZA');
});

test('barra móvil: llamar y ir al menú', () => {
  const doc = parse(renderMobileBar(ctx()));
  assert.ok(doc.querySelector('a[href="tel:+34917954422"]'));
  assert.ok(doc.querySelector('a[href="#menu"]'));
});

// ---------- Carta ----------
import { renderCarta } from '../src/templates/carta.mjs';
const cartaDoc = () => parse(renderCarta(ctx()));

test('carta: sección #menu con H2 "Nuestro / menú"', () => {
  const doc = cartaDoc();
  assert.equal(doc.querySelector('section').getAttribute('id'), 'menu');
  assert.deepEqual(doc.querySelectorAll('h2 > span').map((s) => s.text), ['Nuestro', 'menú']);
});

test('carta: 10 H3 con los títulos literales del PDF', () => {
  const h3 = cartaDoc().querySelectorAll('h3');
  assert.equal(h3.length, 10);
  const titles = [...carta.sections.map((s) => s.title), carta.ingredients.title];
  h3.forEach((h, i) => assert.ok(h.text.trim().startsWith(titles[i]), `${h.text} / ${titles[i]}`));
});

test('carta: están las 47 líneas de la carta', () => {
  const total = carta.sections.reduce((a, s) => a + s.items.length, 0);
  assert.equal(total, 47);
  const names = cartaDoc().querySelectorAll('.n').map((n) => n.text.trim());
  assert.equal(names.length, 47);
  assert.ok(names.includes('PALOMETA AHUMADA, ANCHOAS Y MAHONESA'));
});

test('carta: enlaces a los PDF con su texto actual', () => {
  const links = cartaDoc().querySelectorAll('.pdfs a').map((a) => [a.text.trim(), a.getAttribute('href')]);
  assert.deepEqual(links, [['Ingredientes', carta.pdf.ing], ['Menú', carta.pdf.menu], ['Porciones', carta.pdf.por]]);
});

test('carta: el precio es literal y el € va aparte, oculto al lector', () => {
  const eur = cartaDoc().querySelector('.eur');
  assert.equal(eur.childNodes[0].text, '12,40');
  assert.equal(eur.querySelector('span[aria-hidden="true"]').text.trim(), '€');
});

test('carta: el índice tiene un enlace por categoría', () => {
  const doc = cartaDoc();
  const targets = doc.querySelectorAll('.sheet a').map((a) => a.getAttribute('href'));
  assert.deepEqual(targets, [...carta.sections.map((s) => `#carta-${s.id}`), '#carta-ing']);
  for (const t of targets) assert.ok(doc.querySelector(t), t);
});

test('carta: las franjas con foto de stock tienen texto alternativo local', () => {
  const bans = cartaDoc().querySelectorAll('.ban[role="img"]');
  assert.equal(bans.length, 6);
  for (const b of bans) assert.match(b.getAttribute('aria-label'), /en MAMA PIZZA, Villaverde \(Madrid\)$/);
});

// ---------- Ofertas, horarios, mapa, reserva, pago y servicios ----------
import { renderInfo } from '../src/templates/info.mjs';
const infoDoc = (lang = 'es') => parse(renderInfo(ctx(lang)));
const clean = (s) => s.replace(/\s+/g, ' ').trim();

test('info: existen los anclajes de la web actual', () => {
  const doc = infoDoc();
  for (const id of ['aboutUs', 'times', 'map', 'reservation', 'payment', 'services']) assert.ok(doc.querySelector(`#${id}`), id);
});

test('info: los dos cupones con H3, H4 y texto literal', () => {
  const doc = infoDoc();
  for (const o of [site.offers.lj, site.offers.fs]) {
    const h3 = doc.querySelectorAll('h3').find((h) => h.text.trim() === o.h3);
    assert.ok(h3, o.h3);
    const card = h3.parentNode;
    assert.equal(card.querySelector('h4').text.trim(), 'Todas las ofertas son para llevar');
    assert.equal(card.querySelector('p').text.trim(), o.p);
  }
});

test('info: horario con 7 días, martes "cerrado" y placa en vivo', () => {
  const doc = infoDoc();
  assert.deepEqual(doc.querySelectorAll('#times h2 > span').map((s) => s.text), ['Nuestros', 'horarios de apertura']);
  const rows = doc.querySelectorAll('#times .hours li');
  assert.equal(rows.length, 7);
  assert.equal(clean(rows[1].text), 'Martes cerrado');
  assert.equal(clean(rows[0].text), 'Lunes 18:00 – 23:00');
  assert.ok(doc.querySelector('#times [data-live]'));
});

test('info: horario en formato de 12 h en inglés', () => {
  assert.equal(clean(infoDoc('en').querySelectorAll('#times .hours li')[0].text), 'Monday 06:00 PM – 11:00 PM');
});

test('info: "Mostrar mapa" es un enlace a Google Maps con el aviso de privacidad', () => {
  const doc = infoDoc();
  const a = doc.querySelector('#map a[data-consent]');
  assert.ok(a.getAttribute('href').startsWith('https://www.google.com/maps'));
  assert.equal(a.text.trim(), 'Mostrar mapa');
  assert.ok(doc.querySelector('#map').text.includes('Su dirección IP se enviará a Google Maps.'));
  assert.ok(doc.querySelector('#map').text.includes(site.address.full));
});

test('info: reserva con textos literales', () => {
  const doc = infoDoc();
  const res = doc.querySelector('#reservation');
  assert.deepEqual(res.querySelectorAll('h2 > span').map((s) => s.text), ['Haz tu', 'reserva']);
  assert.ok(res.querySelector('h4').text.includes('Llámanos al 917954422'));
  assert.ok(res.text.includes('LLÁMANOS Y RESERVA TU PEDIDO PARA LA HORA QUE QUIERAS'));
});

test('info: opciones de pago y servicios', () => {
  const doc = infoDoc();
  assert.ok(clean(doc.querySelector('#payment').text).includes('Disponible opciones de pago'));
  for (const s of ['En efectivo', 'VISA']) assert.ok(doc.querySelector('#payment').text.includes(s));
  for (const s of ['Aire acondicionado', 'Para llevar']) assert.ok(doc.querySelector('#services').text.includes(s));
});

// ---------- Todo de un vistazo + formulario ----------
import { renderContacto } from '../src/templates/contacto.mjs';
const contactoDoc = (formKey) => parse(renderContacto({ ...ctx(), formKey }));

test('contacto: H2 "Todo / de un vistazo" y los tres datos con su H3', () => {
  const doc = contactoDoc();
  assert.equal(doc.querySelector('section').getAttribute('id'), 'contact');
  assert.deepEqual(doc.querySelectorAll('h2 > span').map((s) => s.text), ['Todo', 'de un vistazo']);
  const h3 = doc.querySelectorAll('h3').map((h) => h.text.trim());
  for (const t of ['Encuéntrenos', 'Envíenos un correo electrónico', 'Llámenos', 'Envíenos su mensaje']) assert.ok(h3.includes(t), t);
  assert.ok(doc.querySelector('a[href="mailto:mamapizza6@gmail.com"]'));
  assert.ok(doc.querySelector('a[href="tel:+34917954422"]'));
});

test('contacto: etiquetas literales unidas a su campo', () => {
  const doc = contactoDoc();
  const labels = doc.querySelectorAll('form label');
  assert.deepEqual(labels.map((l) => l.text.trim()), ['Su nombre', 'Su correo electrónico', 'su teléfono', 'Asunto', 'Su mensaje']);
  for (const l of labels) assert.ok(doc.querySelector(`#${l.getAttribute('for')}`), l.getAttribute('for'));
  assert.equal(doc.querySelector('form button[type="submit"]').text.trim(), 'Enviar');
  assert.ok(doc.querySelector('input[name="botcheck"]'));
});

test('contacto: los mensajes de error, éxito y fallo son literales', () => {
  const html = renderContacto({ ...ctx(), formKey: 'k' });
  for (const t of ['Introduzca su nombre.', 'Introduzca una dirección de correo electrónico válida', 'Su mensaje ha sido enviado.',
    'Le contestaremos a la mayor brevedad.', 'Fallo en el envío del mensaje']) assert.ok(html.includes(t), t);
});

test('contacto: sin clave el formulario usa mailto; con clave, Web3Forms', () => {
  assert.equal(contactoDoc().querySelector('form').getAttribute('action'), 'mailto:mamapizza6@gmail.com');
  const f = contactoDoc('CLAVE').querySelector('form');
  assert.equal(f.getAttribute('action'), 'https://api.web3forms.com/submit');
  assert.equal(f.getAttribute('method'), 'POST');
  assert.equal(f.querySelector('input[name="access_key"]').getAttribute('value'), 'CLAVE');
});

// ---------- Pie en ticket, aviso legal, cookies e idioma ----------
import { renderFooter } from '../src/templates/footer.mjs';
const footDoc = (lang = 'es') => parse(renderFooter(ctx(lang)));

test('pie: H2 MAMA PIZZA y navegación con los 8 enlaces literales', () => {
  const doc = footDoc();
  assert.equal(doc.querySelectorAll('h2').some((h) => h.text.trim() === 'MAMA PIZZA'), true);
  const hrefs = doc.querySelectorAll('footer nav a').map((a) => a.getAttribute('href'));
  for (const h of ['#menu', '#map', '#times', '#payment', '#aboutUs', '#services', '#contact', '#reservation']) {
    assert.ok(hrefs.includes(h), h);
  }
});

test('pie: tripAdvisor y facebook con sus URLs y aria-label', () => {
  const doc = footDoc();
  const tripadvisor = doc.querySelector('a[aria-label="tripAdvisor"]');
  const facebook = doc.querySelector('a[aria-label="facebook"]');
  assert.equal(tripadvisor.getAttribute('href'), site.social.tripadvisor);
  assert.equal(facebook.getAttribute('href'), site.social.facebook);
});

test('pie: el aviso legal tiene las 14 parejas literales', () => {
  const doc = footDoc();
  const dt = doc.querySelectorAll('.legal-modal dt').map((d) => d.text.trim());
  const dd = doc.querySelectorAll('.legal-modal dd').map((d) => d.text.trim());
  assert.deepEqual(dt, site.legal.map((l) => l[0]));
  assert.deepEqual(dd, site.legal.map((l) => l[1]));
  assert.ok(dd.includes('SEGOVIA BLANCO'));
  assert.ok(dd.includes('B80102528'));
});

test('pie: política de privacidad y cookies', () => {
  const doc = footDoc();
  assert.ok(doc.querySelector('a[href]').getAttribute('href'));
  const privacy = doc.querySelectorAll('a').find((a) => a.text.trim() === 'Política de privacidad');
  assert.equal(privacy.getAttribute('href'), site.privacyUrl);
  const cookiesBtn = doc.querySelectorAll('button').find((b) => b.text.trim() === 'Cambiar configuración de cookies');
  assert.ok(cookiesBtn);
});

test('pie: selector de 16 idiomas con el actual seleccionado', () => {
  const doc = footDoc('de');
  const opts = doc.querySelectorAll('select option');
  assert.equal(opts.length, 16);
  const selected = opts.find((o) => o.hasAttribute('selected'));
  assert.equal(selected.getAttribute('value'), '/de/');
  assert.equal(selected.text.trim(), 'Deutsch');
});

test('pie: copyright nuevo y sin el crédito de DISH', () => {
  const html = renderFooter(ctx());
  assert.ok(html.includes('© 2026 MAMA PIZZA'));
  assert.ok(!html.includes('DISH'));
});

test('carta: el estilo de cada franja no se trunca por comillas sin escapar y respeta su posición', () => {
  const doc = cartaDoc();
  // Posiciones reales de content/carta.json para dos franjas "crop" y una "photo".
  const casos = [
    ['sugerencias', carta.sections.find((s) => s.id === 'sugerencias').crop.pos],
    ['porciones', carta.sections.find((s) => s.id === 'porciones').crop.pos],
    ['frios', carta.sections.find((s) => s.id === 'frios').photo.pos]
  ];
  for (const [id, pos] of casos) {
    const ban = doc.querySelector(`#carta-${id} .ban`);
    const style = ban.getAttribute('style');
    assert.ok(style.includes('type("image/webp")'), `${id}: el estilo se truncó antes de llegar al segundo formato — ${style}`);
    assert.ok(style.includes(`background-position:${pos}`), `${id}: falta la posición ${pos} en "${style}"`);
  }
});
