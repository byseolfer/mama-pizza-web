// Cabecera + hero "Cinemático nocturno", cinta de ofertas y barra fija móvil.
import { esc } from './util.mjs';
import { icon, SLICE } from './icons.mjs';

export const picture = (name, alt, { sizes = '100vw', cls = '', priority = false } = {}) => {
  const set = (ext) => [480, 960, 1600].map((w) => `/assets/img/${name}-${w}.${ext} ${w}w`).join(', ');
  return `<picture class="${cls}">
<source type="image/avif" srcset="${set('avif')}" sizes="${sizes}">
<source type="image/webp" srcset="${set('webp')}" sizes="${sizes}">
<img src="/assets/img/${name}-960.webp" alt="${esc(alt)}" width="1600" height="1067" ${priority ? 'fetchpriority="high"' : 'loading="lazy"'} decoding="async">
</picture>`;
};

const navItems = (t) => [
  ['#menu', t('nav.menu')], ['#map', t('nav.location')], ['#times', t('nav.times')],
  ['#aboutUs', t('nav.about')], ['#contact', t('nav.contact')]
];

const telBtn = (t, site, cls) => `<a class="btn btn-red ${cls}" href="tel:${site.phone.intl}">${icon('phone')}${esc(t('btn.reservation'))}</a>`;

export function renderHero({ t, site, carta }) {
  const links = navItems(t).map(([h, l]) => `<li><a href="${h}">${esc(l)}</a></li>`).join('');
  const offers = [site.offers.lj.p, site.offers.fs.p, site.offers.lj.h4].map((o) => `<span>${esc(o)}</span>`).join('');
  return `<header id="home" class="hero">
${picture('pizza', 'Pizza recién horneada con tomate cherry, aceitunas negras y albahaca en MAMA PIZZA, pizzería en Villaverde, Madrid', { cls: 'hero-bg', priority: true })}
<nav class="nav" aria-label="${esc(t('nav.menu'))}">
<a class="logo" href="#home">${SLICE}<span>${esc(site.name)}</span></a>
<ul class="nav-links">${links}</ul>
${telBtn(t, site, 'nav-cta')}
<button class="burger" type="button" aria-expanded="false" aria-controls="nav-panel" aria-label="${esc(t('ui.openMenu'))}">${icon('list')}</button>
</nav>
<div id="nav-panel" class="nav-panel" hidden>
<ul>${links}</ul>
${telBtn(t, site, '')}
</div>
<div class="copy">
<h1><span>MAMA</span> <span>PIZZA</span></h1>
<h2 class="welcome">${esc(site.welcome)}</h2>
<p class="sub">${esc(carta.slogan)} ${esc(carta.slogan2)}</p>
<div class="ctas">${telBtn(t, site, '')}<a class="btn btn-glass" href="#menu">${esc(t('ui.ourMenu'))}</a></div>
</div>
</header>
<div class="ticker" role="region" aria-label="${esc(site.offers.lj.h3)} / ${esc(site.offers.fs.h3)}">
<div class="track"><div class="group">${offers}</div><div class="group" aria-hidden="true">${offers}</div></div>
</div>`;
}

export function renderMobileBar({ t, site }) {
  return `<nav class="m-bar" aria-label="${esc(t('btn.reservation'))}">
<a class="m-call" href="tel:${site.phone.intl}">${icon('phone')}${esc(t('btn.reservation'))}</a>
<a class="m-menu" href="#menu">${icon('book-open-text')}${esc(t('nav.menu'))}</a>
</nav>`;
}
