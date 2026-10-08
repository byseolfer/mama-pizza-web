// Documento HTML completo: <head> con SEO, hreflang, Open Graph y JSON-LD.
import { LANGS } from '../lib/i18n.mjs';
import { restaurantLd, menuLd } from '../lib/schema.mjs';
import { esc, langPath } from './util.mjs';

const OG_LOCALE = { es: 'es_ES', cs: 'cs_CZ', de: 'de_DE', en: 'en_GB', fr: 'fr_FR', hr: 'hr_HR', it: 'it_IT', hu: 'hu_HU',
  nl: 'nl_NL', pl: 'pl_PL', pt: 'pt_PT', ro: 'ro_RO', ru: 'ru_RU', sk: 'sk_SK', tr: 'tr_TR', uk: 'uk_UA' };

const ld = (obj) => `<script type="application/ld+json">${JSON.stringify(obj).replace(/</g, '\\u003c')}</script>`;

export function pageShell({ lang, t, siteUrl, body, site, carta }) {
  const url = siteUrl + langPath(lang);
  const title = esc(t('title'));
  const desc = esc(site.metaDescription);
  const img = `${siteUrl}/assets/og.jpg`;
  const alternates = LANGS.map((l) => `<link rel="alternate" hreflang="${l}" href="${siteUrl}${langPath(l)}">`).join('\n')
    + `\n<link rel="alternate" hreflang="x-default" href="${siteUrl}/">`;
  const heroSet = [480, 960, 1600].map((w) => `/assets/img/pizza-${w}.avif ${w}w`).join(', ');
  return `<!doctype html>
<html lang="${lang}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>${title}</title>
<meta name="description" content="${desc}">
<link rel="canonical" href="${url}">
${alternates}
<meta name="theme-color" content="#121310">
<meta name="format-detection" content="telephone=no">
<link rel="icon" href="/assets/favicon.svg" type="image/svg+xml">
<meta property="og:type" content="restaurant.restaurant">
<meta property="og:site_name" content="${esc(site.name)}">
<meta property="og:title" content="${esc(site.name)}, Madrid">
<meta property="og:description" content="${desc}">
<meta property="og:url" content="${url}">
<meta property="og:image" content="${img}">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:locale" content="${OG_LOCALE[lang]}">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${title}">
<meta name="twitter:description" content="${desc}">
<meta name="twitter:image" content="${img}">
<meta name="geo.region" content="ES-MD">
<meta name="geo.placename" content="Madrid">
<meta name="geo.position" content="${site.geo.lat};${site.geo.lng}">
<meta name="ICBM" content="${site.geo.lat}, ${site.geo.lng}">
<meta property="restaurant:contact_info:street_address" content="${esc(site.address.street)}">
<meta property="restaurant:contact_info:locality" content="${esc(site.address.city)}">
<meta property="restaurant:contact_info:postal_code" content="${site.address.postal}">
<meta property="restaurant:contact_info:country_name" content="${esc(site.address.country)}">
<meta property="restaurant:contact_info:email" content="${site.email}">
<meta property="restaurant:contact_info:phone_number" content="${site.phone.intl}">
<meta property="restaurant:contact_info:website" content="${siteUrl}/">
<meta property="place:location:latitude" content="${site.geo.lat}">
<meta property="place:location:longitude" content="${site.geo.lng}">
<link rel="preload" href="/assets/fonts/archivo-latin.woff2" as="font" type="font/woff2" crossorigin>
<link rel="preload" as="image" type="image/avif" imagesrcset="${heroSet}" imagesizes="100vw" fetchpriority="high">
<link rel="stylesheet" href="/assets/site.css">
<script type="module" src="/assets/js/main.js"></script>
${ld(restaurantLd(site, siteUrl))}
${ld(menuLd(carta, siteUrl))}
</head>
<body>
${body}
</body>
</html>
`;
}
