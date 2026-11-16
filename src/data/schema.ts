import { site, socials } from './site';
import { services } from './services';

const org = `${site.url}/#org`;

/** Business entity shown on every page, so search engines and AI tools can identify SkaleSeed. */
export const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': ['Organization', 'ProfessionalService'],
  '@id': org,
  name: site.name,
  alternateName: ['Skale Seed', 'Scale Seed', 'SkaleSeed Hyderabad'],
  url: site.url,
  logo: `${site.url}/icon-512.png`,
  image: `${site.url}/og-image.png`,
  description:
    'SkaleSeed is a web design, web app and digital marketing studio in Hyderabad, India. It builds websites, SaaS platforms and AI tools, and runs Meta ads, SEO and Instagram content for small and growing businesses.',
  slogan: 'See your website before you pay.',
  email: site.email,
  telephone: site.whatsappDisplay.replace(/\s/g, ''),
  currenciesAccepted: 'INR',
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'Hyderabad',
    addressRegion: 'Telangana',
    addressCountry: 'IN',
  },
  areaServed: [
    { '@type': 'City', name: 'Hyderabad' },
    { '@type': 'State', name: 'Telangana' },
    { '@type': 'Country', name: 'India' },
  ],
  contactPoint: {
    '@type': 'ContactPoint',
    contactType: 'sales',
    telephone: site.whatsappDisplay.replace(/\s/g, ''),
    email: site.email,
    availableLanguage: ['English', 'Telugu', 'Hindi'],
  },
  sameAs: socials.filter((s) => s.href.startsWith('https://www.instagram.com')).map((s) => s.href),
  knowsAbout: [
    'Website design',
    'Website development',
    'Digital marketing',
    'Web app development',
    'SaaS development',
    'AI agents and automation',
    'Search engine optimisation',
    'Local SEO',
    'Meta ads',
    'Instagram content',
  ],
  hasOfferCatalog: {
    '@type': 'OfferCatalog',
    name: 'SkaleSeed services',
    itemListElement: services.map((s) => ({
      '@type': 'Offer',
      itemOffered: { '@type': 'Service', name: s.title, description: s.summary, provider: { '@id': org } },
    })),
  },
};

export const websiteSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  '@id': `${site.url}/#website`,
  url: site.url,
  name: site.name,
  alternateName: ['Skale Seed', 'Scale Seed'],
  publisher: { '@id': org },
  inLanguage: 'en-IN',
};
