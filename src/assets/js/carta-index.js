// Botón "Carta": abre el índice de categorías (hoja inferior en móvil, panel en escritorio).
export function initCartaIndex() {
  const fab = document.querySelector('.carta .fab');
  const sheet = document.getElementById('carta-index');
  const scrim = document.querySelector('.carta .scrim');
  if (!fab || !sheet || !scrim) return;
  fab.hidden = false;

  const links = () => [...sheet.querySelectorAll('a')];
  const open = () => {
    sheet.hidden = false; scrim.hidden = false;
    fab.setAttribute('aria-expanded', 'true');
    links()[0]?.focus();
  };
  const close = (returnFocus = true) => {
    sheet.hidden = true; scrim.hidden = true;
    fab.setAttribute('aria-expanded', 'false');
    if (returnFocus) fab.focus();
  };

  fab.addEventListener('click', () => (sheet.hidden ? open() : close()));
  scrim.addEventListener('click', () => close());
  sheet.addEventListener('click', (e) => {
    const a = e.target.closest('a');
    if (!a) return;
    e.preventDefault();
    close(false);
    const target = document.querySelector(a.getAttribute('href'));
    const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
    target?.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
    target?.querySelector('h3')?.setAttribute('tabindex', '-1');
    target?.querySelector('h3')?.focus({ preventScroll: true });
  });
  sheet.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') { close(); return; }
    if (e.key !== 'Tab') return;
    const l = links();
    if (e.shiftKey && document.activeElement === l[0]) { e.preventDefault(); l[l.length - 1].focus(); }
    else if (!e.shiftKey && document.activeElement === l[l.length - 1]) { e.preventDefault(); l[0].focus(); }
  });
}
