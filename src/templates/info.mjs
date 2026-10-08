// Ofertas, horarios, mapa, reserva, pago y servicios: "Cupones y cartel" (propuestas/04-info.html, opción b2).
import { formatRange } from '../lib/hours.mjs';
import { esc } from './util.mjs';
import { icon } from './icons.mjs';

const split = (pair) => `<span>${esc(pair[0])}</span><span>${esc(pair[1])}</span>`;

const coupon = (o, big, small, green) => `<article class="coupon${green ? ' g' : ''}">
<div class="main"><h3 class="h3">${esc(o.h3)}</h3><h4>${esc(o.h4)}</h4><p>${esc(o.p)}</p></div>
<div class="stub" aria-hidden="true"><div><b>${big}</b><small>${small}</small></div></div>
${icon('scissors')}
</article>`;

function hoursList(t, site) {
  const days = t('days');
  return `<ul class="hours">${site.hours.map((h, i) => `<li data-day="${h.day}"${h.open ? '' : ' class="off"'}><span>${esc(days[i])}</span> <span>${
    h.open ? formatRange(h.open, h.close, t('clock')) : esc(t('closed'))}</span></li>`).join('')}</ul>`;
}

const mapPicture = () => `<picture>
<source type="image/avif" srcset="/assets/img/map-640.avif 640w, /assets/img/map-1200.avif 1200w" sizes="(min-width: 760px) 50vw, 100vw">
<source type="image/webp" srcset="/assets/img/map-640.webp 640w, /assets/img/map-1200.webp 1200w" sizes="(min-width: 760px) 50vw, 100vw">
<img src="/assets/img/map-640.webp" alt="" width="1200" height="800" loading="lazy" decoding="async">
</picture>`;

export function renderInfo({ t, site }) {
  const liveText = {
    openNow: t('ui.openNow'), closedNow: t('ui.closedNow'), until: t('ui.until'), opensToday: t('ui.opensToday'),
    opensOn: t('ui.opensOn'), signOpen: t('ui.signOpen'), signClosed: t('ui.signClosed'), today: t('ui.today'), days: t('days')
  };
  return `<div class="info wood">
<section id="aboutUs" class="offers-wrap" aria-labelledby="h-about">
<h2 id="h-about" class="eyebrow">${esc(t('about'))}</h2>
<div class="coupons">${coupon(site.offers.lj, '2 x 1', 'Lun a Jue')}${coupon(site.offers.fs, '50%', 'Vie a Dom', true)}</div>
</section>
<section id="times" class="sign" aria-labelledby="h-times" data-hours='${esc(JSON.stringify(site.hours))}' data-text='${esc(JSON.stringify(liveText))}'>
<div class="top"><h2 id="h-times" class="h2">${split(t('sec.times'))}</h2><span class="flip" data-live hidden></span></div>
<p class="live-sub" aria-live="polite"></p>
${hoursList(t, site)}
</section>
<div class="two">
<section id="map" class="polaroid" aria-labelledby="h-map">
<div class="map">${mapPicture()}
<span class="pin" aria-hidden="true">${icon('map-pin')}</span>
<span class="osm">© OpenStreetMap</span>
<div class="consent"><small>${esc(t('map.ip'))}</small><a class="btn btn-red" data-consent data-embed="${esc(site.mapsEmbed)}" href="${esc(site.mapsSearch)}" target="_blank" rel="noopener">${icon('map-trifold')}${esc(t('map.show'))}</a></div>
</div>
<div class="cap"><h2 id="h-map" class="h3">${esc(t('sec.location'))}</h2><address>${esc(site.address.full)}</address></div>
</section>
<section id="reservation" class="wall" aria-labelledby="h-res">
<h2 id="h-res" class="h2">${split(t('sec.reserve'))}</h2>
<h3 class="tag">${esc(site.reserve.h3)}</h3>
<a class="tel" href="tel:${site.phone.intl}">${esc(site.phone.display)}</a>
<h4>${esc(site.reserve.h4)}</h4>
<p class="cta">${esc(site.reserve.p)}</p>
<a class="btn btn-red" href="tel:${site.phone.intl}">${icon('phone')}${esc(t('btn.reservation'))}</a>
<div class="stick">
<div id="payment"><h2>${esc(t('sec.payment').join(' '))}</h2>
<span style="--r:-2deg">${icon('money')}${esc(t('pay.cash'))}</span><span style="--r:2deg">${icon('credit-card')}${esc(site.payment[1])}</span></div>
<div id="services"><h2>${esc(t('sec.services').join(' '))}</h2>
<span style="--r:1.5deg">${icon('snowflake')}${esc(t('srv.ac'))}</span><span style="--r:-1.5deg">${icon('bag')}${esc(t('srv.takeaway'))}</span></div>
</div>
</section>
</div>
</div>`;
}
