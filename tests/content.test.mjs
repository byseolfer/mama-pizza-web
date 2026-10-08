import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const load = (p) => JSON.parse(readFileSync(new URL(`../${p}`, import.meta.url), 'utf8'));
const carta = load('content/carta.json');
const site = load('content/site.json');
const sec = (id) => carta.sections.find((s) => s.id === id);

test('la carta tiene las 9 secciones en el orden del PDF', () => {
  assert.deepEqual(carta.sections.map((s) => s.id),
    ['pizzas', 'sugerencias', 'porciones', 'calientes', 'frios', 'hamburguesas', 'perritos', 'ensaladas', 'sandwiches']);
});

test('cada sección tiene el número de líneas del PDF', () => {
  const counts = Object.fromEntries(carta.sections.map((s) => [s.id, s.items.length]));
  assert.deepEqual(counts, { pizzas: 7, sugerencias: 5, porciones: 12, calientes: 6, frios: 8, hamburguesas: 2, perritos: 2, ensaladas: 2, sandwiches: 3 });
});

test('los textos y precios de la carta son literales', () => {
  assert.deepEqual(sec('pizzas').items[0], { n: 'MAMA PIZZA BASE', m: '12,40', f: '18,60' });
  assert.equal(sec('sandwiches').items[1].n, 'VEGETAL (Tomate, lechuga, cebolla y pepinillo)');
  assert.equal(sec('sandwiches').items[1].p, '3,70');
  assert.equal(sec('frios').title, 'BOCADILLOS FRIOS');
  assert.equal(sec('pizzas').note, 'Todas las Pizzas llevan como base : Salsa de Tomate y Mozzarella');
  assert.deepEqual(sec('porciones').items[11], { n: 'Suplemento ingrediente', p: '0,60', s: true });
});

test('el horario tiene el martes cerrado y el viernes hasta las 23:30', () => {
  const day = (d) => site.hours.find((h) => h.day === d);
  assert.equal(day(2).open, null);
  assert.equal(day(5).close, '23:30');
});

test('las ofertas y el aviso legal son literales', () => {
  assert.equal(site.offers.fs.p, '50% DESCUENTO EN SEGUNDA PIZZA FAMILIARES O MEDIANAS 3 o MÁS INGREDIENTES FIN DE SEMANA, VIERNES Y VÍSPERAS');
  assert.equal(site.legal.length, 14);
});

test('ningún texto de contenido contiene la raya —', () => {
  for (const f of ['content/carta.json', 'content/site.json']) {
    assert.ok(!readFileSync(new URL(`../${f}`, import.meta.url), 'utf8').includes('—'), f);
  }
});
