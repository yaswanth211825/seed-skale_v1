// One search-friendly page per service at /services/<slug>.
// Copy is written for the way people search ("website design company in Hyderabad",
// "SaaS development company", "digital marketing agency Hyderabad") without stuffing.
// No prices and no invented numbers.

export type ServicePage = {
  slug: string;
  serviceId: 'websites' | 'web-apps' | 'ai' | 'marketing' | 'content';
  /** <title>, kept under ~65 characters */
  title: string;
  description: string;
  label: string;
  h1: string;
  accent: string;
  lede: string;
  /** schema.org Service name and alternate names people search for */
  schemaName: string;
  keywords: string[];
  intro: string[];
  includes: { title: string; text: string }[];
  forWho: string[];
  proof?: string;
  faq: { q: string; a: string }[];
};

export const areas = [
  'HITEC City',
  'Madhapur',
  'Gachibowli',
  'Kondapur',
  'Kukatpally',
  'Banjara Hills',
  'Jubilee Hills',
  'Ameerpet',
  'Secunderabad',
  'LB Nagar',
];

export const servicePages: ServicePage[] = [
  {
    slug: 'website-design',
    serviceId: 'websites',
    title: 'Website Design & Development Company in Hyderabad | SkaleSeed',
    description:
      'SkaleSeed designs and builds fast, mobile-friendly business websites in Hyderabad, with SEO basics, WhatsApp enquiries and your own domain. See a free demo before you pay.',
    label: 'Website design · Hyderabad',
    h1: 'Website design and development',
    accent: 'in Hyderabad.',
    lede: 'Clean, fast, mobile-first websites for local businesses, startups and professionals. You see a free demo page with your name on it before you pay.',
    schemaName: 'Website design and development',
    keywords: ['website design Hyderabad', 'website development company Hyderabad', 'web design agency', 'business website', 'website making'],
    intro: [
      'Most customers look you up on their phone before they call, visit or order. Your website is where they decide. We design and build websites that load quickly, look right on every phone and make it easy to contact you, with WhatsApp, call and directions one tap away.',
      'Every site is designed and coded by our own team in Hyderabad. No page-builder templates that look like everyone else, and no slow plugins. You get a site that is ready for Google from day one and simple to update.',
    ],
    includes: [
      { title: 'Custom design', text: 'A look made for your business, your colours and your photos, not a recycled template.' },
      { title: 'Mobile first', text: 'Built for phones first, then tablets and laptops, so it works where your customers are.' },
      { title: 'SEO ready', text: 'Clean code, page titles, Google Business links, sitemap and structured data set up at launch.' },
      { title: 'WhatsApp enquiries', text: 'Enquiry forms and WhatsApp buttons that send leads straight to your phone.' },
      { title: 'Your own domain', text: 'Your domain and hosting are in your name. You own the site.' },
      { title: 'Fast and secure', text: 'HTTPS, quick loading and good Core Web Vitals, which Google rewards.' },
    ],
    forWho: ['Shops, restaurants and cafés', 'Clinics, salons and studios', 'Interior designers and builders', 'Consultants and professionals', 'Startups that need a launch site', 'Manufacturers and B2B suppliers'],
    proof: 'sunrise-interiors',
    faq: [
      { q: 'How do I get a website made for my business in Hyderabad?', a: 'Tell us what you do on the contact form or WhatsApp. We make a free demo page with your business name so you can see the direction first. If you like it, we build the full site with your photos and details and put it live on your own domain.' },
      { q: 'Do you build websites with WordPress or custom code?', a: 'We build with modern, lightweight code so the site is fast and secure. If you need to edit content yourself, we set up a simple way to do it.' },
      { q: 'Will my website show up on Google?', a: 'Every site launches with the technical SEO basics: titles, descriptions, sitemap, structured data and Search Console. Ranking higher for competitive searches takes ongoing SEO, which we also offer.' },
      { q: 'Can you redesign my existing website?', a: 'Yes. We can redesign an existing site, keep what works, move your content over and make it faster and easier to use on phones.' },
      { q: 'Do you work only with businesses in Hyderabad?', a: 'We are based in Hyderabad and work with businesses across Telangana, Andhra Pradesh, the rest of India and abroad. Everything can be done online over WhatsApp and calls.' },
    ],
  },
  {
    slug: 'saas-development',
    serviceId: 'web-apps',
    title: 'Custom Web App & SaaS Development Company in Hyderabad | SkaleSeed',
    description:
      'SkaleSeed builds custom web apps, SaaS platforms, dashboards, booking and ordering systems in Hyderabad, from first sketch to production, with payments and APIs.',
    label: 'Web apps & SaaS · Hyderabad',
    h1: 'Custom web app and SaaS development',
    accent: 'in Hyderabad.',
    lede: 'Platforms, portals, dashboards and ordering systems, built for speed and real users. From the first sketch to production, by one team.',
    schemaName: 'Custom web application and SaaS development',
    keywords: ['SaaS development company Hyderabad', 'custom web app development', 'SaaS builders', 'MVP development', 'dashboard development'],
    intro: [
      'When spreadsheets, WhatsApp groups and manual work start slowing you down, a custom web app can run that part of the business for you. We design and build web applications and SaaS products that do one job very well, then grow with you.',
      'We have built copy-trading SaaS, campus ordering platforms, learning platforms and AI-powered tools. We work in short, visible steps, so you can see and use the product early instead of waiting months for a big reveal.',
    ],
    includes: [
      { title: 'MVP for startups', text: 'A focused first version you can put in front of real users quickly, then improve.' },
      { title: 'SaaS platforms', text: 'Multi-user products with sign-in, roles, subscriptions and admin panels.' },
      { title: 'Ordering and booking', text: 'Online orders, appointments, queues and payments for local businesses.' },
      { title: 'Dashboards and portals', text: 'Internal tools, client portals and reports that replace scattered spreadsheets.' },
      { title: 'APIs and payments', text: 'Payment gateways, WhatsApp, email and third-party integrations.' },
      { title: 'Hosting and support', text: 'Deployment, monitoring and improvements after launch.' },
    ],
    forWho: ['Startup founders building an MVP', 'Businesses replacing manual work', 'Colleges and training institutes', 'Traders and fintech teams', 'Agencies needing a white-label build', 'Companies needing internal tools'],
    proof: 'zerox',
    faq: [
      { q: 'What is the difference between a website and a web app?', a: 'A website mainly shows information about your business. A web app lets people do things: sign in, order, book, pay, track or manage data. Many businesses start with a website and add a web app when they need it.' },
      { q: 'Can you build an MVP for my startup idea?', a: 'Yes. We help you decide the smallest useful version, build it, and put it in front of real users so you learn quickly before spending more.' },
      { q: 'Who owns the code and data?', a: 'You do. The product, the code and your customer data belong to your business.' },
      { q: 'Do you provide support after the app goes live?', a: 'Yes. We can host, monitor and keep improving the product after launch, or hand it over to your own team.' },
      { q: 'How do I start a SaaS project with SkaleSeed?', a: 'Share your idea on the contact form or WhatsApp. We discuss the problem, suggest a first version and show you a demo before the full build.' },
    ],
  },
  {
    slug: 'ai-automation',
    serviceId: 'ai',
    title: 'AI Chatbots, Voice Assistants & Automation in Hyderabad | SkaleSeed',
    description:
      'SkaleSeed builds AI chatbots, website voice assistants, AI lead generation agents and workflow automation for businesses in Hyderabad, in English, Telugu and Hindi.',
    label: 'AI & automation · Hyderabad',
    h1: 'AI assistants and automation',
    accent: 'for your business.',
    lede: 'Assistants that answer customers any time, agents that find new ones, and automation that removes repetitive work. In English, Telugu and Hindi.',
    schemaName: 'AI chatbot, voice assistant and business automation development',
    keywords: ['AI chatbot development Hyderabad', 'AI automation agency', 'AI voice assistant for website', 'WhatsApp automation', 'AI agents'],
    intro: [
      'Customers ask the same questions every day: timings, prices, availability, location. An AI assistant on your website or WhatsApp can answer them instantly, any time, and pass serious enquiries to you.',
      'We also build AI agents that find and qualify new leads, and automation that connects your forms, sheets, CRM and messages so routine work happens on its own. Everything is set up around how your business already works.',
    ],
    includes: [
      { title: 'Website chat and voice assistants', text: 'Answer visitors by text or voice, trained on your own services and FAQs.' },
      { title: 'Multilingual', text: 'Assistants that can reply in English, Telugu and Hindi.' },
      { title: 'AI lead generation', text: 'Agents that find high-intent prospects and start personalised outreach.' },
      { title: 'Workflow automation', text: 'Forms, sheets, CRM, email and WhatsApp connected so data moves without copy-paste.' },
      { title: 'AI search readiness', text: 'Make your business easy for ChatGPT, Gemini and Perplexity to find and recommend.' },
      { title: 'Safe hand-off', text: 'The assistant hands complex questions to a real person on your team.' },
    ],
    forWho: ['Businesses getting many repeat questions', 'Real estate and property teams', 'Clinics and service businesses', 'Sales teams that need more leads', 'Teams buried in manual data entry', 'Education and training providers'],
    proof: 'propatrade',
    faq: [
      { q: 'Can an AI chatbot answer my customers in Telugu or Hindi?', a: 'Yes. We build assistants that can understand and reply in English, Telugu and Hindi, based on your own business information.' },
      { q: 'Will the AI assistant give wrong answers?', a: 'We train it on your own services, FAQs and policies, limit what it is allowed to answer, and set it to hand anything uncertain to a person.' },
      { q: 'What business tasks can be automated?', a: 'Common ones are enquiry follow-ups, lead capture into sheets or a CRM, appointment reminders, order updates and reports. We look at your daily work and pick what saves the most time.' },
      { q: 'How do I get my business recommended by ChatGPT and Google AI?', a: 'Clear, structured information about your business on your website and across the web helps AI tools understand and mention you. Our guide on getting recommended by AI covers the steps, and we can set it up for you.' },
    ],
  },
  {
    slug: 'digital-marketing',
    serviceId: 'marketing',
    title: 'Digital Marketing Agency in Hyderabad: SEO & Meta Ads | SkaleSeed',
    description:
      'SkaleSeed is a digital marketing agency in Hyderabad for local SEO, Google ranking, Facebook and Instagram ads and AI search. Your ad accounts stay in your name.',
    label: 'Digital marketing · Hyderabad',
    h1: 'Digital marketing and SEO',
    accent: 'in Hyderabad.',
    lede: 'We get you found on Google and in AI answers, and run Facebook and Instagram ads that bring real enquiries. Your accounts stay yours.',
    schemaName: 'Digital marketing, SEO and Meta ads',
    keywords: ['digital marketing agency Hyderabad', 'digital marketing company in Hyderabad', 'SEO services Hyderabad', 'local SEO', 'Meta ads agency', 'Facebook and Instagram ads'],
    intro: [
      'People in Hyderabad search for businesses like yours every day: "near me", "best in Kondapur", "price", "reviews". Digital marketing puts you in front of them at that moment, on Google, on Instagram and in AI assistants.',
      'We focus on what brings enquiries: a strong Google Business Profile, local and technical SEO, and Meta ads with clear targeting and tracking. You get simple reports that show calls, messages and leads, not just likes.',
    ],
    includes: [
      { title: 'Local SEO', text: 'Google Business Profile, local listings, reviews and location pages so you show up in "near me" searches.' },
      { title: 'Technical SEO', text: 'Speed, structure, schema and Search Console fixes that help Google read your site.' },
      { title: 'Meta ads', text: 'Facebook and Instagram campaigns planned, run and tuned for enquiries.' },
      { title: 'AI search readiness', text: 'Make your business easy for ChatGPT, Gemini and Perplexity to recommend.' },
      { title: 'Tracking and reports', text: 'Google Analytics and conversion tracking, with plain-language monthly reports.' },
      { title: 'Your accounts', text: 'Ad accounts, pages and analytics stay in your name. No lock-in.' },
    ],
    forWho: ['Local shops and services', 'Restaurants and cafés', 'Clinics and wellness', 'Real estate and interiors', 'Coaching and training institutes', 'B2B manufacturers and suppliers'],
    proof: 'elastomech',
    faq: [
      { q: 'What does a digital marketing agency in Hyderabad do?', a: 'It helps people find and choose your business online. For us that means SEO so you appear on Google, Meta ads on Facebook and Instagram, AI search readiness, and tracking so you can see which efforts bring enquiries.' },
      { q: 'How long does SEO take to show results?', a: 'Local SEO changes such as a complete Google Business Profile can help within weeks. Ranking for competitive searches usually takes a few months of steady work.' },
      { q: 'Do I need a website to run Facebook and Instagram ads?', a: 'Not always, ads can send people to WhatsApp or Instagram. A fast landing page usually gives better tracking and more enquiries, so we often build one alongside the ads.' },
      { q: 'Will I own my ad account and data?', a: 'Yes. Ad accounts, pages, Google Business Profile and analytics are set up in your name. We work inside them with your permission.' },
      { q: 'Can you help my business rank on Google Maps?', a: 'Yes. We set up and improve your Google Business Profile, categories, photos, reviews and local citations, which drive Google Maps rankings.' },
    ],
  },
  {
    slug: 'instagram-marketing',
    serviceId: 'content',
    title: 'Instagram Marketing & Reels Content in Hyderabad | SkaleSeed',
    description:
      'SkaleSeed plans, shoots and edits Instagram reels and content for businesses in Hyderabad, with account setup and content plans that bring in messages.',
    label: 'Instagram content · Hyderabad',
    h1: 'Instagram reels and content',
    accent: 'that bring in messages.',
    lede: 'Reels planned, shot and edited for your business, so your page looks alive and people message you.',
    schemaName: 'Instagram marketing and reels content creation',
    keywords: ['Instagram marketing Hyderabad', 'social media marketing agency Hyderabad', 'reels shoot and editing', 'content creation', 'social media management'],
    intro: [
      'Before many customers visit, they check your Instagram. A page with regular, good-looking reels tells them you are active and worth visiting. A page that stopped posting months ago does the opposite.',
      'We plan what to post, shoot reels at your location and edit them in a style that suits your business. Content works hand in hand with your website and ads, so attention turns into messages.',
    ],
    includes: [
      { title: 'Content plans', text: 'A simple monthly plan of reels and posts around your offers, seasons and questions customers ask.' },
      { title: 'Reels shot and edited', text: 'On-location shoots and fast, clean edits with captions and music.' },
      { title: 'Account setup', text: 'Profile, bio, highlights and links set up so visitors know what to do next.' },
      { title: 'Works with ads', text: 'Best-performing reels can be boosted with Meta ads to reach more nearby people.' },
    ],
    forWho: ['Cafés, restaurants and bakeries', 'Salons, studios and gyms', 'Boutiques and shops', 'Interior designers and builders', 'Coaches and educators', 'New businesses launching locally'],
    faq: [
      { q: 'Do you shoot reels at our location in Hyderabad?', a: 'Yes. We plan the shoot, come to your location in Hyderabad, and edit the reels for you.' },
      { q: 'How often should a business post on Instagram?', a: 'Consistency matters more than volume. A few good reels every week is a strong start for most local businesses.' },
      { q: 'Can Instagram really bring customers to a local business?', a: 'Yes, when the content shows what you offer clearly and makes it easy to message or visit. Combining reels with a website and targeted ads works best.' },
    ],
  },
];

export const pageFor = (serviceId: string) => servicePages.find((p) => p.serviceId === serviceId);
