import { test } from 'node:test';
import assert from 'node:assert/strict';
import { validate, submitForm } from '../src/lib/form.mjs';

const ok = { name: 'Lucía Ortega', email: 'lucia@correo.es', tel: '+34 612 34 56 78', subj: 'Pedido', msg: 'Hola' };

test('todos los campos vacíos dan su error de "vacío"', () => {
  assert.deepEqual(validate({}), {
    name: 'form.err.name', email: 'form.err.email', tel: 'form.err.phone', subj: 'form.err.subject', msg: 'form.err.message'
  });
});

test('un correo mal formado da el error de correo no válido', () => {
  assert.equal(validate({ ...ok, email: 'a@b' }).email, 'form.err.emailInvalid');
});

test('un teléfono demasiado corto da el error de teléfono no válido', () => {
  assert.equal(validate({ ...ok, tel: '12' }).tel, 'form.err.phoneInvalid');
});

test('los espacios solos cuentan como vacío', () => {
  assert.equal(validate({ ...ok, name: '   ' }).name, 'form.err.name');
});

test('un formulario completo y válido no tiene errores', () => {
  assert.deepEqual(validate(ok), { name: null, email: null, tel: null, subj: null, msg: null });
});

test('si la red falla, submitForm devuelve ok:false', async () => {
  const r = await submitForm(ok, { key: 'k', fetchImpl: () => Promise.reject(new Error('offline')) });
  assert.deepEqual(r, { ok: false });
});

test('si el servicio responde con error, submitForm devuelve ok:false', async () => {
  const fetchImpl = async () => ({ ok: false, json: async () => ({ success: false }) });
  assert.deepEqual(await submitForm(ok, { key: 'k', fetchImpl }), { ok: false });
});

test('envío correcto a Web3Forms con la clave de acceso', async () => {
  let sent;
  const fetchImpl = async (url, init) => { sent = { url, body: JSON.parse(init.body) }; return { ok: true, json: async () => ({ success: true }) }; };
  assert.deepEqual(await submitForm(ok, { key: 'CLAVE', fetchImpl }), { ok: true });
  assert.equal(sent.url, 'https://api.web3forms.com/submit');
  assert.equal(sent.body.access_key, 'CLAVE');
  assert.equal(sent.body.email, 'lucia@correo.es');
  assert.equal(sent.body.message, 'Hola');
});
