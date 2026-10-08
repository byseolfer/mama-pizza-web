// Compone el cuerpo completo de la página a partir de las secciones (orden: spec §2).
import { renderHero, renderMobileBar } from './hero.mjs';
import { renderCarta } from './carta.mjs';
import { renderInfo } from './info.mjs';
import { renderContacto } from './contacto.mjs';
import { renderFooter } from './footer.mjs';

export function renderBody(ctx) {
  return `<a class="sr-only" href="#menu">${ctx.t('ui.ourMenu')}</a>
${renderHero(ctx)}
<main>
${renderCarta(ctx)}
${renderInfo(ctx)}
${renderContacto(ctx)}
</main>
${renderFooter(ctx)}
${renderMobileBar(ctx)}`;
}
