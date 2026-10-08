// Menú desplegable de la navegación en pantallas estrechas.
export function initNav() {
  const btn = document.querySelector('.burger');
  const panel = document.getElementById('nav-panel');
  if (!btn || !panel) return;
  const set = (open) => {
    btn.setAttribute('aria-expanded', String(open));
    panel.hidden = !open;
    if (open) panel.querySelector('a')?.focus();
  };
  btn.addEventListener('click', () => set(panel.hidden));
  panel.addEventListener('click', (e) => { if (e.target.closest('a')) set(false); });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !panel.hidden) { set(false); btn.focus(); }
  });
  document.addEventListener('click', (e) => {
    if (!panel.hidden && !panel.contains(e.target) && !btn.contains(e.target)) set(false);
  });
}
