// Pie en ticket de caja, con selector de idioma (propuestas/05-contacto-pie.html, combinación c23).
import { LANGS } from '../lib/i18n.mjs';
import { esc, langPath } from './util.mjs';
import { icon } from './icons.mjs';

const navItems = (t) => [
  ['#menu', t('nav.menu')], ['#map', t('nav.location')], ['#times', t('nav.times')], ['#payment', t('nav.payment')],
  ['#aboutUs', t('nav.about')], ['#services', t('nav.services')], ['#contact', t('nav.contact')], ['#reservation', t('nav.reservation')]
];

const SOCIAL_ICONS = { tripadvisor: 'tripadvisor', facebook: 'facebook' };

// <details> nativo: el aviso legal se ve y se abre sin JavaScript. JS lo mejora a diálogo centrado (legal.js).
function legalModal(t, site) {
  const rows = site.legal.map(([k, v], i) => `<dt>${esc(t('legal.labels')[i] ?? k)}</dt><dd>${esc(v)}</dd>`).join('');
  return `<details class="legal-details" id="legal-details">
<summary data-open-legal>${esc(t('foot.legal'))}</summary>
<div class="box legal-modal">
<button type="button" class="x" data-close-legal aria-label="${esc(t('ui.close'))}">${icon('x')}</button>
<h2 class="h3">${esc(t('foot.legal'))}</h2>
<dl>${rows}</dl>
</div>
</details>`;
}

export function renderFooter({ t, site, lang, dicts }) {
  const langName = (l) => dicts[l]?.langName || l;
  return `<footer class="site-foot wood" aria-labelledby="h-foot">
<div class="ticketwrap">
<div class="ticket">
<h2 id="h-foot" class="tw">${esc(site.name)}</h2>
<p class="ts">${esc(site.address.street)}<br>${esc(site.address.postal)} ${esc(site.address.city)}<br>${esc(t('country'))}</p>
<hr>
<a class="ln" href="tel:${site.phone.intl}"><span>${esc(t('glance.call'))}</span><span>${esc(site.phone.display)}</span></a>
<a class="ln" href="mailto:${site.email}"><span>${esc(t('glance.mail'))}</span><span>${esc(site.email)}</span></a>
<hr>
<p class="grp">${esc(t('nav.menu'))}</p>
<nav aria-label="${esc(t('nav.menu'))}">${navItems(t).map(([h, l]) => `<a href="${h}">${esc(l)}</a>`).join('')}</nav>
<hr>
<div class="soc">
<a href="${esc(site.social.tripadvisor)}" target="_blank" rel="noopener" aria-label="tripAdvisor">${icon(SOCIAL_ICONS.tripadvisor)}</a>
<a href="${esc(site.social.facebook)}" target="_blank" rel="noopener" aria-label="facebook">${icon(SOCIAL_ICONS.facebook)}</a>
</div>
<hr>
<p class="lg">
<a href="#legal-details">${esc(t('foot.legal'))}</a>
<a href="${esc(site.privacyUrl)}" target="_blank" rel="noopener">${esc(t('foot.privacy'))}</a>
<button type="button" data-open-cookies>${esc(t('foot.cookies'))}</button>
</p>
<hr>
<label class="lang"><span>${esc(t('ui.language'))}</span>
<select aria-label="${esc(t('ui.language'))}" data-lang-select>
${LANGS.map((l) => `<option value="${langPath(l)}"${l === lang ? ' selected' : ''}>${esc(langName(l))}</option>`).join('')}
</select></label>
<div class="bar" aria-hidden="true"></div>
<p class="thx">© 2026 ${esc(site.name)}</p>
</div>
</div>
${legalModal(t, site)}
<div class="cookies-note" id="cookies-note" hidden><div class="box"><p>${esc(t('ui.cookiesInfo'))}</p><button type="button" data-close-cookies>${esc(t('ui.close'))}</button></div></div>
</footer>`;
}
