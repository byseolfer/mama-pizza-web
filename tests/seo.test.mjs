import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { parse } from 'node-html-parser';
import { loadI18n, makeT } from '../src/lib/i18n.mjs';
import { restaurantLd, menuLd } from '../src/lib/schema.mjs';
import { pageShell } from '../src/templates/layout.mjs';

const load = (p) => JSON.parse(readFileSync(new URL(`../${p}`, import.meta.url), 'utf8'));
const site = load('content/site.json');
const carta = load('content/carta.json');
const dicts = loadI18n(new URL('../content/i18n/', import.meta.url));
const SITE = 'https://example.test';
const page = (lang) => parse(pageShell({ lang, t: makeT(dicts, lang), siteUrl: SITE, body: '<main></main>', site, carta }));

test('título y meta description literales', () => {
  const doc = page('es');
  assert.equal(doc.querySelector('title').text, 'MAMA PIZZA - Madrid | Restaurante cerca de mí | Reserve ahora');
  assert.equal(doc.querySelector('meta[name="description"]').getAttribute('content'),
    'MAMA PIZZA, pizzería en Villaverde (Madrid). La pizza como tú la quieres, bocadillos, hamburguesas y ensaladas. 2x1 de lunes a jueves. Llama al 917954422.');
  assert.equal(doc.querySelector('html').getAttribute('lang'), 'es');
});

test('canonical por idioma y 17 hreflang con x-default en la raíz', () => {
  const es = page('es');
  assert.equal(es.querySelector('link[rel="canonical"]').getAttribute('href'), `${SITE}/`);
  const alts = es.querySelectorAll('link[rel="alternate"][hreflang]');
  assert.equal(alts.length, 17);
  assert.equal(alts.find((a) => a.getAttribute('hreflang') === 'x-default').getAttribute('href'), `${SITE}/`);
  assert.equal(alts.find((a) => a.getAttribute('hreflang') === 'de').getAttribute('href'), `${SITE}/de/`);
  assert.equal(page('en').querySelector('link[rel="canonical"]').getAttribute('href'), `${SITE}/en/`);
});

test('Open Graph de restaurante con imagen propia', () => {
  const doc = page('es');
  assert.equal(doc.querySelector('meta[property="og:type"]').getAttribute('content'), 'restaurant.restaurant');
  assert.equal(doc.querySelector('meta[property="og:image"]').getAttribute('content'), `${SITE}/assets/og.jpg`);
});

test('el JSON-LD de la página se puede leer', () => {
  const blocks = page('es').querySelectorAll('script[type="application/ld+json"]').map((s) => JSON.parse(s.text));
  assert.deepEqual(blocks.map((b) => b['@type']), ['Restaurant', 'Menu']);
});

test('Restaurant: teléfono, pago y horario sin martes', () => {
  const r = restaurantLd(site, SITE);
  assert.equal(r.telephone, '+34917954422');
  assert.equal(r.servesCuisine, 'Pizza');
  assert.equal(r.paymentAccepted, 'Cash, VISA');
  assert.equal(r.acceptsReservations, true);
  assert.equal(r.openingHoursSpecification.some((s) => [].concat(s.dayOfWeek).includes('Tuesday')), false);
  const fri = r.openingHoursSpecification.find((s) => [].concat(s.dayOfWeek).includes('Friday'));
  assert.equal(fri.closes, '23:30');
  assert.deepEqual(r.sameAs, [site.social.tripadvisor, site.social.facebook]);
});

test('Menu: 9 secciones, precios con punto y sin suplementos', () => {
  const m = menuLd(carta, SITE);
  assert.equal(m.hasMenuSection.length, 9);
  const first = m.hasMenuSection[0].hasMenuItem[0];
  assert.equal(first.name, 'MAMA PIZZA BASE');
  assert.deepEqual(first.offers.map((o) => [o.name, o.price, o.priceCurrency]), [['MEDIANA', '12.40', 'EUR'], ['FAMILIAR', '18.60', 'EUR']]);
  const names = m.hasMenuSection.flatMap((s) => s.hasMenuItem.map((i) => i.name));
  assert.equal(names.some((n) => /^suplemento/i.test(n)), false);
});
