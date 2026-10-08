// Formulario "Envíenos su mensaje": validación y envío (build, tests y navegador).
export const FIELDS = ['name', 'email', 'tel', 'subj', 'msg'];
const EMPTY = { name: 'form.err.name', email: 'form.err.email', tel: 'form.err.phone', subj: 'form.err.subject', msg: 'form.err.message' };
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE = /^\+?[\d\s-]{7,}$/;

export function validate(values) {
  const v = Object.fromEntries(FIELDS.map((f) => [f, String(values[f] ?? '').trim()]));
  const errors = Object.fromEntries(FIELDS.map((f) => [f, v[f] ? null : EMPTY[f]]));
  if (v.email && !EMAIL.test(v.email)) errors.email = 'form.err.emailInvalid';
  if (v.tel && !PHONE.test(v.tel)) errors.tel = 'form.err.phoneInvalid';
  return errors;
}

export async function submitForm(values, { key, fetchImpl = fetch }) {
  try {
    const res = await fetchImpl('https://api.web3forms.com/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({
        access_key: key,
        subject: `MAMA PIZZA web: ${values.subj}`,
        from_name: values.name,
        name: values.name,
        email: values.email,
        phone: values.tel,
        message: values.msg,
        botcheck: values.botcheck || ''
      })
    });
    const data = await res.json().catch(() => ({}));
    return { ok: Boolean(res.ok && data.success) };
  } catch {
    return { ok: false };
  }
}
