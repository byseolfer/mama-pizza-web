// "Todo de un vistazo" + formulario (propuestas/05-contacto-pie.html, parte superior de la opción c2).
import { esc } from './util.mjs';
import { icon } from './icons.mjs';

const FIELDS = [
  { id: 'name', label: 'form.name', type: 'text', ac: 'name', err: 'form.err.name' },
  { id: 'email', label: 'form.email', type: 'email', ac: 'email', err: 'form.err.email', err2: 'form.err.emailInvalid' },
  { id: 'tel', label: 'form.phone', type: 'tel', ac: 'tel', err: 'form.err.phone', err2: 'form.err.phoneInvalid' },
  { id: 'subj', label: 'form.subject', type: 'text', ac: 'off', err: 'form.err.subject' },
  { id: 'msg', label: 'form.message', type: 'area', err: 'form.err.message' }
];

function field(t, f) {
  const id = `f-${f.id}`;
  const msgs = { [f.err]: t(f.err), ...(f.err2 ? { [f.err2]: t(f.err2) } : {}) };
  const control = f.type === 'area'
    ? `<textarea id="${id}" name="${f.id}" rows="5" required aria-describedby="${id}-e"></textarea>`
    : `<input id="${id}" name="${f.id}" type="${f.type}" autocomplete="${f.ac}" required aria-describedby="${id}-e">`;
  return `<div class="f" data-field="${f.id}"><label for="${id}">${esc(t(f.label))}</label>${control}<span class="err" id="${id}-e" data-msgs='${esc(JSON.stringify(msgs))}' hidden>${esc(t(f.err))}</span></div>`;
}

export function renderContacto({ t, site, formKey }) {
  const action = formKey
    ? `action="https://api.web3forms.com/submit" method="POST"`
    : `action="mailto:${site.email}" method="post" enctype="text/plain"`;
  return `<section id="contact" class="contacto wood" aria-labelledby="h-glance">
<div class="contacto-in">
<div class="glance">
<h2 id="h-glance" class="h2">${t('sec.glance').map((s) => `<span>${esc(s)}</span>`).join('')}</h2>
<div class="big">
<a href="${esc(site.mapsSearch)}" target="_blank" rel="noopener"><h3>${esc(t('glance.find'))}</h3><b>${esc(site.address.street)}<br>${esc(site.address.postal)} ${esc(site.address.city)}<br>${esc(t('country'))}</b></a>
<a href="mailto:${site.email}"><h3>${esc(t('glance.mail'))}</h3><b>${esc(site.email)}</b></a>
<a href="tel:${site.phone.intl}"><h3>${esc(t('glance.call'))}</h3><b>${esc(site.phone.intl)}</b></a>
</div>
</div>
<div class="card">
<h3 class="h3">${esc(t('form.title'))}</h3>
<form class="form" ${action} novalidate data-key="${esc(formKey || '')}" data-mailto="${site.email}">
${formKey ? `<input type="hidden" name="access_key" value="${esc(formKey)}"><input type="hidden" name="subject" value="MAMA PIZZA web"><input type="hidden" name="from_name" value="MAMA PIZZA web">` : ''}
<input type="checkbox" name="botcheck" class="sr-only" tabindex="-1" autocomplete="off" aria-hidden="true">
<div class="row2">${field(t, FIELDS[0])}${field(t, FIELDS[1])}</div>
<div class="row2">${field(t, FIELDS[2])}${field(t, FIELDS[3])}</div>
${field(t, FIELDS[4])}
<button class="btn btn-red send" type="submit">${icon('paper-plane-tilt')}${esc(t('form.send'))}</button>
<p class="done" role="status" hidden>${esc(t('form.ok'))}<small>${esc(t('form.ok2'))}</small></p>
<p class="fail" role="alert" hidden>${esc(t('form.fail'))}</p>
</form>
</div>
</div>
</section>`;
}
