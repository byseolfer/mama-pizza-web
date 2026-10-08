import { test } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { LANGS, loadI18n, makeT } from '../src/lib/i18n.mjs';

const dir = new URL('../content/i18n/', import.meta.url);
const dicts = loadI18n(dir);

test('hay un archivo por cada uno de los 16 idiomas', () => {
  assert.deepEqual(LANGS, ['es', 'cs', 'de', 'en', 'fr', 'hr', 'it', 'hu', 'nl', 'pl', 'pt', 'ro', 'ru', 'sk', 'tr', 'uk']);
  for (const l of LANGS) assert.ok(existsSync(new URL(`${l}.json`, dir)), l);
});

test('español conserva los textos literales de la web actual', () => {
  const t = makeT(dicts, 'es');
  assert.equal(t('nav.location'), 'Dónde estamos');
  assert.deepEqual(t('sec.times'), ['Nuestros', 'horarios de apertura']);
  assert.equal(t('form.phone'), 'su teléfono');
  assert.equal(t('closed'), 'cerrado');
  assert.equal(t('title'), 'MAMA PIZZA - Madrid | Restaurante cerca de mí | Reserve ahora');
});

test('inglés y alemán usan las traducciones de la web actual', () => {
  const en = makeT(dicts, 'en');
  assert.equal(en('title'), 'MAMA PIZZA - Madrid | Restaurant near me | Book now');
  assert.equal(en('map.show'), 'Show Map');
  assert.equal(en('days')[0], 'Monday');
  assert.equal(en('clock'), '12');
  const de = makeT(dicts, 'de');
  assert.equal(de('days')[1], 'Dienstag');
  assert.equal(de('closed'), 'Geschlossen');
  assert.equal(de('clock'), '24');
});

test('los idiomas sin <title> en la web actual usan el título en español', () => {
  assert.equal(makeT(dicts, 'de')('title'), 'MAMA PIZZA - Madrid | Restaurante cerca de mí | Reserve ahora');
});

test('una clave que falta en un idioma cae al español', () => {
  assert.equal(makeT({ es: { a: 'x' }, de: {} }, 'de')('a'), 'x');
});

test('una clave que no existe ni en español es un error', () => {
  assert.throws(() => makeT(dicts, 'de')('ui.cosaQueNoExiste'));
});

test('todas las claves del español existen en inglés', () => {
  const missing = Object.keys(dicts.es).filter((k) => !(k in dicts.en) && !k.startsWith('_'));
  assert.deepEqual(missing, []);
});

test('ningún texto de interfaz contiene la raya —', () => {
  for (const l of LANGS) assert.ok(!readFileSync(new URL(`${l}.json`, dir), 'utf8').includes('—'), l);
});
