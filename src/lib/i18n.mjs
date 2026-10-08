// Textos de interfaz por idioma (solo build). Los diccionarios son planos: { "nav.menu": "Menú", ... }.
import { readFileSync } from 'node:fs';

export const LANGS = ['es', 'cs', 'de', 'en', 'fr', 'hr', 'it', 'hu', 'nl', 'pl', 'pt', 'ro', 'ru', 'sk', 'tr', 'uk'];

export function loadI18n(dir) {
  const base = dir instanceof URL ? dir : new URL(`file://${dir.endsWith('/') ? dir : dir + '/'}`);
  return Object.fromEntries(LANGS.map((l) => [l, JSON.parse(readFileSync(new URL(`${l}.json`, base), 'utf8'))]));
}

export function makeT(dicts, lang) {
  return (key) => {
    const own = dicts[lang]?.[key];
    if (own !== undefined && own !== null && own !== '') return own;
    const es = dicts.es?.[key];
    if (es === undefined) throw new Error(`Clave de interfaz inexistente: ${key}`);
    return es;
  };
}
