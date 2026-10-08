// Aviso legal: un <details> nativo (se ve y se abre sin JavaScript). Con JS, se convierte en un
// diálogo centrado al abrirse, y vuelve a su lugar en el pie al cerrarse.
function trapFocus(container, e) {
  if (e.key !== 'Tab') return;
  const items = container.querySelectorAll('button, a[href], select, input, textarea');
  if (!items.length) return;
  const first = items[0], last = items[items.length - 1];
  if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
  else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
}

export function initLegal() {
  const details = document.getElementById('legal-details');
  if (details) {
    const closeBtn = details.querySelector('[data-close-legal]');
    details.addEventListener('toggle', () => {
      details.classList.toggle('as-dialog', details.open);
      if (details.open) closeBtn?.focus();
    });
    closeBtn?.addEventListener('click', () => { details.open = false; details.querySelector('summary').focus(); });
    details.addEventListener('keydown', (e) => {
      if (!details.open) return;
      if (e.key === 'Escape') { details.open = false; details.querySelector('summary').focus(); return; }
      if (details.classList.contains('as-dialog')) trapFocus(details.querySelector('.legal-modal'), e);
    });
  }

  const cookies = document.getElementById('cookies-note');
  const cookiesBtn = document.querySelector('[data-open-cookies]');
  if (cookies && cookiesBtn) {
    cookiesBtn.addEventListener('click', () => { cookies.hidden = false; cookies.querySelector('button').focus(); });
    cookies.querySelector('[data-close-cookies]')?.addEventListener('click', () => { cookies.hidden = true; cookiesBtn.focus(); });
  }
}
