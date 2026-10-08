import { test } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync, mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { execFileSync } from 'node:child_process';
import { parse } from 'node-html-parser';
import { build } from '../tools/build.mjs';
import { LANGS } from '../src/lib/i18n.mjs';

const outDir = mkdtempSync(join(tmpdir(), 'mama-pizza-build-'));
await build({ siteUrl: 'https://example.test', outDir });

const page = (lang) => readFileSync(join(outDir, lang === 'es' ? 'index.html' : `${lang}/index.html`), 'utf8');
const ANCHORS = ['home', 'menu', 'map', 'times', 'payment', 'aboutUs', 'services', 'contact', 'reservation'];

test('existen los 16 index.html', () => {
  for (const lang of LANGS) {
    const p = lang === 'es' ? 'index.html' : `${lang}/index.html`;
    assert.ok(existsSync(join(outDir, p)), p);
  }
});

test('ningún HTML generado tiene marcadores sin resolver', () => {
  for (const lang of LANGS) {
    const html = page(lang);
    for (const bad of ['undefined', '{{', 'NaN', '—']) assert.ok(!html.includes(bad), `${lang}: ${bad}`);
  }
});

test('cada página tiene un único H1, el lang correcto y 17 hreflang', () => {
  for (const lang of LANGS) {
    const doc = parse(page(lang));
    assert.equal(doc.querySelectorAll('h1').length, 1, lang);
    assert.equal(doc.querySelector('html').getAttribute('lang'), lang, lang);
    assert.equal(doc.querySelectorAll('link[rel="alternate"][hreflang]').length, 17, lang);
  }
});

test('existen todos los anclajes de la página', () => {
  const doc = parse(page('es'));
  for (const id of ANCHORS) assert.ok(doc.querySelector(`#${id}`), id);
});

test('alemán mezcla interfaz traducida y contenido propio en español', () => {
  const doc = parse(page('de'));
  assert.ok(doc.text.includes('Öffnungszeiten'));
  assert.ok(doc.text.includes('Ofertas lunes a jueves'));
});

test('el sitemap tiene las 16 URL', () => {
  const xml = readFileSync(join(outDir, 'sitemap.xml'), 'utf8');
  assert.equal((xml.match(/<url>/g) || []).length, 16);
});

test('robots.txt apunta al sitemap', () => {
  assert.ok(readFileSync(join(outDir, 'robots.txt'), 'utf8').includes('Sitemap: https://example.test/sitemap.xml'));
});

test('el CLI falla sin SITE_URL', () => {
  assert.throws(() => execFileSync(process.execPath, ['tools/build.mjs'], {
    env: { ...process.env, SITE_URL: '' }, stdio: 'pipe'
  }));
});

test('todos los enlaces internos #ancla apuntan a un id existente', () => {
  const doc = parse(page('es'));
  const hrefs = doc.querySelectorAll('a[href^="#"]').map((a) => a.getAttribute('href')).filter((h) => h.length > 1);
  for (const h of hrefs) assert.ok(doc.querySelector(h), h);
});

test('el CSS no referencia clases que ya no existen en las plantillas (ej. legal-dialog)', () => {
  const css = readFileSync(join(outDir, 'assets/site.css'), 'utf8');
  assert.ok(!css.includes('.legal-dialog'), 'resto del refactor de la Tarea 9: la clase real es .legal-details');
});

test.after(() => rmSync(outDir, { recursive: true, force: true }));
