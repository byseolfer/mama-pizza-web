import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { liveStatus, formatRange, madridParts } from '../src/lib/hours.mjs';

const { hours } = JSON.parse(readFileSync(new URL('../content/site.json', import.meta.url), 'utf8'));
const at = (iso) => liveStatus(hours, new Date(iso));

test('jueves antes de abrir: abre hoy a las 18:00', () => {
  assert.deepEqual(at('2026-10-08T17:30:00+02:00'), { open: false, today: 4, kind: 'today', time: '18:00' });
});

test('jueves a las 20:00: abierto hasta las 23:00', () => {
  assert.deepEqual(at('2026-10-08T20:00:00+02:00'), { open: true, today: 4, kind: 'until', time: '23:00' });
});

test('jueves a las 23:00 exactas: cerrado, abre el viernes', () => {
  assert.deepEqual(at('2026-10-08T23:00:00+02:00'), { open: false, today: 4, kind: 'next', time: '18:00', nextDay: 5 });
});

test('lunes por la noche se salta el martes cerrado', () => {
  const s = at('2026-10-12T23:30:00+02:00');
  assert.equal(s.kind, 'next');
  assert.equal(s.nextDay, 3);
});

test('martes todo el día: cerrado, abre el miércoles', () => {
  const s = at('2026-10-13T19:00:00+02:00');
  assert.equal(s.open, false);
  assert.equal(s.nextDay, 3);
});

test('sábado a las 23:29: todavía abierto', () => {
  assert.equal(at('2026-10-10T23:29:00+02:00').open, true);
});

test('madrugada del cambio de hora de octubre usa la hora de Madrid', () => {
  assert.deepEqual(madridParts(new Date('2026-10-25T00:30:00Z')), { day: 0, minutes: 150 });
  assert.deepEqual(at('2026-10-25T00:30:00Z'), { open: false, today: 0, kind: 'today', time: '18:00' });
});

test('el resultado no depende de la zona horaria del dispositivo', () => {
  const code = `import('${new URL('../src/lib/hours.mjs', import.meta.url).href}').then(m => console.log(JSON.stringify(m.liveStatus(${JSON.stringify(hours)}, new Date('2026-10-08T20:00:00+02:00')))))`;
  const out = execFileSync(process.execPath, ['-e', code], { env: { ...process.env, TZ: 'America/New_York' } }).toString().trim();
  assert.deepEqual(JSON.parse(out), { open: true, today: 4, kind: 'until', time: '23:00' });
});

test('formatRange en 24 h y en 12 h como la web actual', () => {
  assert.equal(formatRange('18:00', '23:00', '24'), '18:00 – 23:00');
  assert.equal(formatRange('18:00', '23:30', '12'), '06:00 PM – 11:30 PM');
});
