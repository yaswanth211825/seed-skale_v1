export const site = {
  name: 'SkaleSeed',
  url: 'https://www.skaleseed.com',
  tagline: 'Websites, web apps and marketing for growing businesses',
  location: 'Hyderabad, Telangana',
  whatsapp: '919515647977',
  whatsappDisplay: '+91 95156 47977',
  email: 'skaleseed@gmail.com',
  formEndpoint: 'https://formspree.io/f/xaeerobd',
};

export const nav = [
  { label: 'Services', href: '/services' },
  { label: 'Work', href: '/work' },
  { label: 'How it works', href: '/how-it-works' },
  { label: 'Blog', href: '/blog' },
  { label: 'Ask AI', href: '/ask-ai' },
];

export const cta = { label: 'Get a free demo', href: '/contact' };

export const whatsappLink = (message = 'Hi SkaleSeed, I would like to talk about my business.') =>
  `https://wa.me/${site.whatsapp}?text=${encodeURIComponent(message)}`;

export type SocialId = 'whatsapp' | 'instagram' | 'email' | 'linkedin' | 'youtube' | 'x' | 'facebook';

/** Live profiles link out; the rest open the coming-soon page for that network. */
export const socials: { id: SocialId; label: string; href: string; external: boolean }[] = [
  { id: 'whatsapp', label: 'WhatsApp', href: whatsappLink(), external: true },
  { id: 'instagram', label: 'Instagram', href: 'https://www.instagram.com/skaleseed', external: true },
  { id: 'email', label: 'Email', href: `mailto:${site.email}`, external: false },
  { id: 'linkedin', label: 'LinkedIn', href: '/coming-soon?on=linkedin', external: false },
  { id: 'youtube', label: 'YouTube', href: '/coming-soon?on=youtube', external: false },
  { id: 'x', label: 'X', href: '/coming-soon?on=x', external: false },
  { id: 'facebook', label: 'Facebook', href: '/coming-soon?on=facebook', external: false },
];
