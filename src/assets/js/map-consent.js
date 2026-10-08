// "Mostrar mapa": solo tras el clic se carga Google Maps (sin JS, el enlace abre Google Maps).
export function initMapConsent() {
  document.querySelectorAll('a[data-consent]').forEach((a) => {
    a.addEventListener('click', (e) => {
      e.preventDefault();
      const map = a.closest('.map');
      const iframe = document.createElement('iframe');
      iframe.src = a.dataset.embed;
      iframe.title = a.closest('section')?.querySelector('address')?.textContent || 'Google Maps';
      iframe.loading = 'lazy';
      iframe.referrerPolicy = 'no-referrer-when-downgrade';
      iframe.allowFullscreen = true;
      map.querySelector('.consent')?.remove();
      map.appendChild(iframe);
    });
  });
}
