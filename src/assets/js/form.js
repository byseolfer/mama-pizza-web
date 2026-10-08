// Formulario "Envíenos su mensaje": valida, envía por Web3Forms (o deja el mailto nativo) y muestra los mensajes literales.
import { validate, submitForm } from './lib/form.mjs';

export function initForm() {
  const form = document.querySelector('.contacto form');
  if (!form) return;
  const key = form.dataset.key;
  if (!key) return; // sin clave, el formulario envía por mailto: de forma nativa

  const get = (name) => form.elements[name];

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const values = Object.fromEntries(['name', 'email', 'tel', 'subj', 'msg'].map((f) => [f, get(f).value]));
    const errors = validate(values);
    let firstInvalid = null;
    for (const [name, errKey] of Object.entries(errors)) {
      const box = form.querySelector(`[data-field="${name}"]`);
      const input = get(name);
      const errEl = box.querySelector('.err');
      box.classList.toggle('bad', Boolean(errKey));
      input.setAttribute('aria-invalid', String(Boolean(errKey)));
      if (errKey) {
        const msgs = JSON.parse(errEl.dataset.msgs);
        errEl.textContent = msgs[errKey];
        errEl.hidden = false;
        if (!firstInvalid) firstInvalid = input;
      } else {
        errEl.hidden = true;
      }
    }
    if (firstInvalid) { firstInvalid.focus(); return; }

    form.classList.remove('failed');
    const submitBtn = form.querySelector('.send');
    submitBtn.disabled = true;
    const { ok } = await submitForm(values, { key });
    submitBtn.disabled = false;
    if (ok) {
      form.classList.add('sent');
      form.querySelector('.done').hidden = false;
    } else {
      form.classList.add('failed');
    }
  });
}
