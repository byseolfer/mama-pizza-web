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
