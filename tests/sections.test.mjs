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
