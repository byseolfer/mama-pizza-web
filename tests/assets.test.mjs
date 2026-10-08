import { test, before } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, statSync, readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';
import { buildImages } from '../tools/images.mjs';
import { buildIcons } from '../tools/icons.mjs';

const dist = new URL('../.tmp-assets-test/', import.meta.url);
const file = (p) => new URL(p, dist);

before(async () => {
  await buildImages({ srcDir: new URL('../assets-src/', import.meta.url), outDir: dist });
  await buildIcons({ outDir: dist });
}, { timeout: 60_000 });

const PHOTOS = ['pizza', 'hero', 'calientes', 'frios', 'hamburguesas', 'perritos', 'ensaladas', 'sandwiches'];

test('cada foto tiene sus 3 anchos en AVIF y WebP', () => {
  for (const name of PHOTOS) for (const w of [480, 960, 1600]) for (const ext of ['avif', 'webp']) {
    assert.ok(existsSync(file(`img/${name}-${w}.${ext}`)), `img/${name}-${w}.${ext}`);
  }
});

test('el mapa estático tiene sus dos anchos en AVIF y WebP', () => {
  for (const w of [640, 1200]) for (const ext of ['avif', 'webp']) assert.ok(existsSync(file(`img/map-${w}.${ext}`)), `img/map-${w}.${ext}`);
});

test('la imagen og.jpg mide 1200x630', async () => {
  const meta = await sharp(fileURLToPath(file('og.jpg'))).metadata();
  assert.equal(meta.width, 1200);
  assert.equal(meta.height, 630);
});

test('las fotos de 1600px pesan menos de 250 KB en WebP', () => {
  for (const name of PHOTOS) assert.ok(statSync(file(`img/${name}-1600.webp`)).size < 250 * 1024, name);
});

test('la fuente Archivo se copia en woff2 (latin y latin-ext)', () => {
  assert.ok(existsSync(file('fonts/archivo-latin.woff2')));
  assert.ok(existsSync(file('fonts/archivo-latin-ext.woff2')));
});

test('el sprite de iconos contiene los iconos de la interfaz y los logos sociales', () => {
  const svg = readFileSync(file('icons.svg'), 'utf8');
  for (const id of ['phone', 'book-open-text', 'list', 'x', 'map-pin', 'map-trifold', 'envelope-simple', 'money',
    'credit-card', 'snowflake', 'bag', 'scissors', 'file-pdf', 'list-bullets', 'paper-plane-tilt', 'tripadvisor', 'facebook']) {
    assert.ok(svg.includes(`id="${id}"`), id);
  }
});
