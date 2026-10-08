// Selector de idioma del pie: navega a la URL del idioma elegido.
export function initLang() {
  document.querySelector('[data-lang-select]')?.addEventListener('change', (e) => {
    location.href = e.target.value;
  });
}
