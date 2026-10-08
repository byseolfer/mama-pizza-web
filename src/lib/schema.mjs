// Datos estructurados schema.org (JSON-LD) a partir de content/site.json y content/carta.json.
const DAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const price = (p) => p.replace(',', '.');

export function restaurantLd(site, siteUrl) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Restaurant',
    '@id': `${siteUrl}/#restaurant`,
    name: site.name,
    url: `${siteUrl}/`,
    image: `${siteUrl}/assets/og.jpg`,
    telephone: site.phone.intl,
    email: site.email,
    servesCuisine: 'Pizza',
    priceRange: '€',
    paymentAccepted: 'Cash, VISA',
    acceptsReservations: true,
    hasMenu: `${siteUrl}/#menu`,
    hasMap: site.mapsSearch,
    address: {
      '@type': 'PostalAddress',
      streetAddress: site.address.street,
      postalCode: site.address.postal,
      addressLocality: site.address.city,
      addressRegion: 'Madrid',
      addressCountry: 'ES'
    },
    geo: { '@type': 'GeoCoordinates', latitude: site.geo.lat, longitude: site.geo.lng },
    openingHoursSpecification: site.hours.filter((h) => h.open).map((h) => ({
      '@type': 'OpeningHoursSpecification', dayOfWeek: DAY_NAMES[h.day], opens: h.open, closes: h.close
    })),
    sameAs: [site.social.tripadvisor, site.social.facebook]
  };
}

const offer = (name, p) => ({ '@type': 'Offer', ...(name ? { name } : {}), price: price(p), priceCurrency: 'EUR' });

export function menuLd(carta, siteUrl) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Menu',
    '@id': `${siteUrl}/#menu`,
    name: 'MAMA PIZZA',
    inLanguage: 'es',
    hasMenuSection: carta.sections.map((s) => ({
      '@type': 'MenuSection',
      name: s.title,
      ...(s.note ? { description: s.note } : {}),
      hasMenuItem: s.items.filter((i) => !i.s).map((i) => ({
        '@type': 'MenuItem',
        name: i.n,
        ...(i.d ? { description: i.d } : {}),
        offers: s.sized ? [offer('MEDIANA', i.m), offer('FAMILIAR', i.f)] : [offer(null, i.p)]
      }))
    }))
  };
}
