// Utilidades de plantilla compartidas.
const MAP = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };
export const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => MAP[c]);

// Sustituye marcadores {time}, {day}, {dayLc} en un texto de interfaz.
export const fill = (text, vars) => text.replace(/\{(\w+)\}/g, (_, k) => (k in vars ? vars[k] : `{${k}}`));

// URL de la página de un idioma (es vive en la raíz).
export const langPath = (lang) => (lang === 'es' ? '/' : `/${lang}/`);
