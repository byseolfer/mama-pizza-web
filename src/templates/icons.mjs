// Icono del sprite /assets/icons.svg (generado por tools/icons.mjs).
import { esc } from './util.mjs';

export function icon(name, label) {
  const a11y = label ? `role="img" aria-label="${esc(label)}"` : 'aria-hidden="true" focusable="false"';
  return `<svg class="i i-${name}" ${a11y}><use href="/assets/icons.svg#${name}"></use></svg>`;
}

// Porción de pizza del logo (redibujo simple del logo original).
export const SLICE = `<svg class="slice" viewBox="0 0 40 40" aria-hidden="true" focusable="false">
<path d="M5 9.5C14 4 26 4 35 9.5L20.5 37.2a.6.6 0 0 1-1 0Z" fill="#F4B860"/>
<path d="M7.6 12.2C15.4 8 24.6 8 32.4 12.2L20 35.4Z" fill="#E1352B"/>
<circle cx="16" cy="15.5" r="2.4" fill="#8E1B14"/><circle cx="24.2" cy="16.8" r="2.1" fill="#8E1B14"/><circle cx="20" cy="24" r="2.2" fill="#8E1B14"/>
<path d="M5 9.5C14 4 26 4 35 9.5" fill="none" stroke="#C98A2E" stroke-width="2.4" stroke-linecap="round"/></svg>`;
