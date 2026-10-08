// Carta "papel sobre madera con fotos" (propuestas/03-carta-pizarra.html, variante v15).
import { esc } from './util.mjs';
import { icon } from './icons.mjs';

export const eur = (p, cls = '') => `<span class="eur${cls ? ' ' + cls : ''}">${esc(p)}<span aria-hidden="true"> €</span></span>`;

// image-set() con type("...") lleva comillas dobles literales: hay que escaparlas (esc) antes de
// insertar el resultado en un atributo style="..." delimitado también por comillas dobles, o el
// HTML se corta en la primera comilla y el resto de la declaración (tamaño, posición) se pierde.
const imgSet = (name, w = 960) => `image-set(url(/assets/img/${name}-${w}.avif) type("image/avif"), url(/assets/img/${name}-${w}.webp) type("image/webp"))`;
const bgStyle = (decls) => esc(decls.join(';'));

function banner(s) {
  if (s.photo) {
    const style = bgStyle([`background-image:url(/assets/img/${s.photo.src}-960.webp)`, `background-image:${imgSet(s.photo.src)}`, `background-position:${s.photo.pos}`]);
    return `<div class="ban" role="img" aria-label="${esc(s.photo.alt)}" style="${style}"></div>`;
  }
  const style = bgStyle(['background-image:url(/assets/img/pizza-960.webp)', `background-image:${imgSet('pizza')}`, `background-size:${s.crop.size}`, `background-position:${s.crop.pos}`]);
  return `<div class="ban" aria-hidden="true" style="${style}"></div>`;
}

function item(s, i) {
  const price = s.sized ? `${eur(i.m)}${eur(i.f)}` : eur(i.p, 'one');
  const body = `<div class="ln"><span class="n">${esc(i.n)}</span><span class="dots" aria-hidden="true"></span>${price}</div>${i.d ? `<p class="d">${esc(i.d)}</p>` : ''}`;
  if (i.thumb) {
    return `<li class="has-thumb"><span class="thumb" aria-hidden="true" style="background-position:${i.thumb}"></span><div>${body}</div></li>`;
  }
  return `<li${i.s ? ' class="sup"' : ''}>${body}</li>`;
}

function section(s) {
  return `<section id="carta-${s.id}" class="cat" aria-labelledby="h-${s.id}">
${banner(s)}
<h3 id="h-${s.id}">${esc(s.title)}${s.sub ? `<small>${esc(s.sub)}</small>` : ''}</h3>
${s.note ? `<p class="note">${esc(s.note)}</p>` : ''}
${s.sized ? '<div class="colh" aria-hidden="true"><span>MEDIANA</span><span>FAMILIAR</span></div>' : ''}
<ul>${s.items.map((i) => item(s, i)).join('')}</ul>
</section>`;
}

export function renderCarta({ t, carta }) {
  const ing = carta.ingredients;
  const idx = [...carta.sections.map((s) => [s.id, s.label]), ['ing', 'Ingredientes']];
  return `<section id="menu" class="carta wood" aria-labelledby="h-menu">
<div class="cover" role="img" aria-label="Pizza recién horneada de MAMA PIZZA sobre mesa de madera"></div>
<header class="mh">
<p class="eyebrow">${esc(carta.slogan)}</p>
<h2 id="h-menu" class="h2"><span>${esc(t('sec.menu')[0])}</span><span>${esc(t('sec.menu')[1])}</span></h2>
<p class="pdfs">${icon('file-pdf')}
<a href="${carta.pdf.ing}" target="_blank" rel="noopener">Ingredientes</a>
<a href="${carta.pdf.menu}" target="_blank" rel="noopener">Menú</a>
<a href="${carta.pdf.por}" target="_blank" rel="noopener">Porciones</a></p>
</header>
<div class="offer"><b>${esc(carta.offer.title)}</b><p>${carta.offer.lines.map(esc).join(' ')}</p></div>
<div class="board">
<p class="stamp" aria-hidden="true">MAMA PIZZA</p>
${carta.sections.map(section).join('\n')}
<section id="carta-ing" class="cat ingl" aria-labelledby="h-ing">
<div class="ban" aria-hidden="true" style="${bgStyle(['background-image:url(/assets/img/pizza-960.webp)', `background-image:${imgSet('pizza')}`, `background-size:${ing.crop.size}`, `background-position:${ing.crop.pos}`])}"></div>
<h3 id="h-ing">${esc(ing.title)}</h3>
${ing.groups.map((g) => `<p><b>${esc(g.g)}</b>${g.i.map(esc).join(', ')}</p>`).join('')}
</section>
</div>
<div class="dock">
<div class="scrim" hidden></div>
<div class="sheet" id="carta-index" role="dialog" aria-modal="true" aria-label="${esc(t('ui.carta'))}" hidden>
<div class="grab" aria-hidden="true"></div><p class="sheet-t">${esc(t('ui.goTo'))}</p>
<nav>${idx.map(([id, l]) => `<a href="#carta-${id}">${esc(l)}</a>`).join('')}</nav>
</div>
<button type="button" class="fab" aria-expanded="false" aria-controls="carta-index" hidden>${icon('list-bullets')}<span>${esc(t('ui.carta'))}</span></button>
</div>
</section>`;
}
