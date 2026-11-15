// Project facts. Amiron Technology projects come from the amirontech.com/#/work case studies.
import type { ImageMetadata } from 'astro';
import zeroxImg from '../assets/work/zerox.png';
import classverseImg from '../assets/work/classverse.png';
import elastomechImg from '../assets/work/elastomech.png';
import propatradeImg from '../assets/work/propatrade.png';
import sunriseImg from '../assets/work/sunrise.png';
import leadAgentImg from '../assets/work/ai-lead-agent.jpg';

export type Category = 'Web apps' | 'Websites' | 'AI and automation';

export interface Project {
  slug: string;
  name: string;
  sector: string;
  category: Category;
  /** One line for cards. */
  summary: string;
  /** Live site, when the client allows linking. */
  liveUrl?: string;
  /** Shown instead of a link when the product is not public. */
  statusNote?: string;
  /** The headline of the case study page: the problem in the client's words. */
  hook: string;
  /** What it felt like before. Two or three short paragraphs. */
  story: string[];
  /** Pain points, one line each. */
  pains: string[];
  solution: string;
  features: string[];
  outcome: string;
  results: string[];
  stack: string[];
  stats?: { value: number; prefix?: string; suffix: string; label: string }[];
  highlight?: string;
  /** Closing line above the contact button. */
  similar: string;
  image?: ImageMetadata;
  imageKind?: 'screenshot' | 'photo';
}

export const projects: Project[] = [
  {
    slug: 'elastomech',
    name: 'ElastoMech',
    sector: 'Manufacturing · Industrial safety',
    category: 'Websites',
    summary: 'Product catalogue and inquiry platform for a rubber and safety manufacturer with 39+ years of expertise.',
    liveUrl: 'https://www.elastomech.in/',
    hook: 'Forty years of expertise, and big buyers still could not see it.',
    story: [
      'ElastoMech had spent decades mastering custom rubber parts and industrial safety products. Their factory could make almost anything a client imagined. But online, they looked like any small supplier.',
      'Large industrial buyers judge a vendor before they ever pick up the phone. When they could not find specifications, compliance documents or proof of past work, they quietly moved on to someone who looked more established. Every one of those missed searches was a contract that never started.',
      'The sales team felt it too. They spent hours explaining the same technical details over email, while real opportunities slipped away.',
    ],
    pains: [
      'Hard-won expertise was invisible to new buyers',
      'Complex specifications were explained again and again by hand',
      'Large clients chose competitors who simply looked more credible online',
    ],
    solution:
      'We built a professional industrial platform that presents their full catalogue with technical specification sheets, compliance documents, 3D product views and a configurator for custom requirements. Every page leads to an inquiry, by WhatsApp or email, straight to the sales team.',
    features: [
      'Interactive product catalogue with 3D visualisations',
      'Technical specification sheets and compliance documents',
      'Custom product configurator for client requirements',
      'Industry case studies and applications',
      'WhatsApp and email inquiry system wired to sales',
    ],
    outcome: 'Traffic up 180%, leads up 250%, and 15+ major industrial clients in the first quarter.',
    results: [
      'Website traffic increased by 180%',
      'Lead generation improved by 250%',
      '15+ major industrial clients connected in the first quarter',
      'Sales cycle shortened by 35% with better product information',
      'International inquiries from global manufacturers',
    ],
    stack: ['React', 'Next.js', 'Three.js', 'Node.js', 'Tailwind CSS'],
    stats: [
      { value: 250, suffix: '%', prefix: '+', label: 'more leads' },
      { value: 15, suffix: '+', label: 'industrial clients in Q1' },
    ],
    highlight: 'A traditional manufacturer started winning large clients online.',
    similar: 'Is your expertise bigger than your online presence?',
    image: elastomechImg,
    imageKind: 'screenshot',
  },
  {
    slug: 'propatrade',
    name: 'PropaTrade',
    sector: 'Fintech · Trading education',
    category: 'AI and automation',
    summary: 'A multilingual AI voice assistant built into the website that answers any question about programs.',
    liveUrl: 'https://propatrade.com/',
    hook: 'Visitors were curious, then confused, then gone.',
    story: [
      'PropaTrade runs trading research and evaluation programs. The offering is rich, and that was the problem. New visitors landed on long pages and FAQs, felt overwhelmed, and left before they understood what was on offer.',
      'Beginners in particular felt out of their depth. They had simple questions but did not want to look foolish asking them, so they did not ask at all. Meanwhile the support team answered the same basic questions all day.',
      'Curiosity is fragile. If someone cannot get a clear answer in the moment, that interest rarely comes back.',
    ],
    pains: [
      'Information overload drove first-time visitors away',
      'Beginners hesitated to ask basic questions',
      'Support spent hours repeating the same answers',
    ],
    solution:
      'We built an AI voice assistant directly into the website, trained on PropaTrade’s own content. Visitors simply talk and get instant spoken answers, in their own language, about programs, plans, learning paths and trading concepts.',
    features: [
      'Talk naturally and get spoken answers instantly',
      'Understands and replies in any language',
      'Explains trading programs in simple words for beginners',
      'Answers questions on company, programs, plans and learning paths',
      'Tells users about new and upcoming offerings',
    ],
    outcome: 'Longer sessions, fewer repetitive support questions, and more confident first-time visitors.',
    results: [
      'Average session duration increased significantly',
      'Repetitive support questions reduced',
      'Visitors understood offerings much faster',
      'Beginners felt more confident exploring programs',
      'An always-available virtual sales and support representative',
    ],
    stack: ['Web Speech API', 'Gemini Pro', 'Vapi', 'n8n', 'Knowledge base indexing'],
    highlight: 'Visitors talk to the site and get answers instantly, in their own language.',
    similar: 'Do your visitors leave before they understand what you offer?',
    image: propatradeImg,
    imageKind: 'screenshot',
  },
  {
    slug: 'classverse',
    name: 'ClassVerse',
    sector: 'Tech education',
    category: 'Websites',
    summary: 'Learning platform for AI, low-code and no-code courses, with workshop booking and career support.',
    liveUrl: 'https://www.class-verse.com/',
    hook: 'Great courses, but students could not see why to choose them.',
    story: [
      'ClassVerse teaches AI, low-code and no-code development through workshops, certified courses and internships. The teaching was strong. The website did not show it.',
      'Prospective students compare many options online. When schedules were hard to find, outcomes were unclear and booking took effort, they assumed the program was smaller or less serious than it really was, and signed up elsewhere.',
      'For an education brand, doubt is the enemy. A student who is not sure will always wait.',
    ],
    pains: [
      'Course value and career outcomes were unclear',
      'Workshop schedules and booking took too much effort',
      'Students compared options and chose more polished competitors',
    ],
    solution:
      'We designed and built a complete education platform: an interactive course catalogue with clear curricula, live workshop scheduling with calendar integration, online booking and payment, career support information, and student success stories.',
    features: [
      'Workshop booking and registration system',
      'Course catalogue with detailed curricula',
      'Student success stories and testimonials',
      'Career support and placement information',
      'Live workshop scheduling with calendar integration',
    ],
    outcome: 'Enrolment up 300%, workshop attendance up 85%, and 15+ new courses launched in six months.',
    results: [
      'Student enrolment increased by 300%',
      'Workshop attendance improved by 85%',
      '15+ new course offerings launched within six months',
      'Higher course completion through clear learning paths',
    ],
    stack: ['React', 'Next.js', 'Tailwind CSS', 'Calendar API', 'Payments'],
    stats: [
      { value: 300, suffix: '%', prefix: '+', label: 'student enrolment' },
      { value: 85, suffix: '%', prefix: '+', label: 'workshop attendance' },
    ],
    highlight: 'Clear courses and easy booking turned visitors into students.',
    similar: 'Are people interested in your offer, but not signing up?',
    image: classverseImg,
    imageKind: 'screenshot',
  },
  {
    slug: 'sunrise-interiors',
    name: 'Sunrise Interiors',
    sector: 'Interior design · Markapur',
    category: 'Websites',
    summary: 'A portfolio website that shows the owner’s interior work and brings client enquiries straight to WhatsApp.',
    liveUrl: 'https://sunriseinteriors.org/',
    hook: 'Beautiful homes, seen only by people who already knew them.',
    story: [
      'Sunrise Interiors has designed 120+ homes across Markapur, Ongole, Cumbum and Hyderabad over six years: living rooms, modular kitchens, bedrooms and bathrooms. Every finished project was proof of real talent.',
      'But that proof lived on phones and in word of mouth. A family searching for an interior designer had no way to see the work, judge the quality or feel confident enough to call. Talent that cannot be seen cannot be chosen.',
      'Interiors are a trust purchase. People want to see what you have done before they let you into their home.',
    ],
    pains: [
      'Years of finished projects were not visible online',
      'New clients could not judge quality before calling',
      'Enquiries depended only on word of mouth',
    ],
    solution:
      'We built a fast, image-led portfolio website that puts the owner’s work front and centre, organised by room and by project, with a WhatsApp button on every page so an interested family can message in one tap. The site is built for search, so people looking for interior designers in Andhra Pradesh and Telangana can find it.',
    features: [
      'Full-screen project showcase and portfolio',
      'Services by room: living, kitchen, bedroom, bathroom',
      'WhatsApp enquiries from every page',
      'SEO for interior design searches in Andhra Pradesh and Telangana',
      'Blog and YouTube links to build trust',
    ],
    outcome: 'The work is now one search away, and interested families can message the owner in one tap.',
    results: [
      '120+ completed projects presented in one place',
      'Client enquiries go straight to WhatsApp',
      'Search-ready for interior design in Andhra Pradesh and Telangana',
    ],
    stack: ['Website', 'Local SEO', 'WhatsApp integration'],
    highlight: 'Six years of finished homes, finally visible to new clients.',
    similar: 'Is your best work hidden in your phone’s gallery?',
    image: sunriseImg,
    imageKind: 'screenshot',
  },
  {
    slug: 'zerox',
    name: 'ZeroX',
    sector: 'Campus services · NIT Warangal',
    category: 'Web apps',
    summary: 'Queue-free stationery and printing for a whole campus, ordered online.',
    statusNote: 'This platform has since been taken down by the campus administration.',
    hook: 'Students were losing hours in queues during exams.',
    story: [
      'At NIT Warangal, printing an assignment or buying stationery meant standing in a long line, often during the most stressful weeks of the semester. Limited hours and manual processing made it worse.',
      'Every minute in a queue was a minute not spent studying. Students were frustrated, and the service provider was overwhelmed, handling everything by hand with no view of stock or demand.',
    ],
    pains: [
      'Long queues at peak hours and during exams',
      'Manual processing and limited service hours',
      'No live view of stock, so items ran out',
    ],
    solution:
      'We built ZeroX: web and mobile ordering for every stationery item and print job. Students upload documents, choose options, pay through Razorpay and collect with an OTP. Admins and the service provider get live inventory, order tracking and reporting.',
    features: [
      'Online ordering for stationery and printing',
      'Document upload for PDF, Word and PPT with print options',
      'Real-time inventory with reorder alerts',
      'Razorpay payments and OTP pickup',
      'Role-based dashboards and analytics',
    ],
    outcome: '800+ active users and 600+ orders in the first week. Physical queues disappeared.',
    results: [
      '800+ active users in the first week',
      '600+ orders processed in the first week',
      'Waiting time cut from hours to minutes',
      'Service provider efficiency up 300%',
    ],
    stack: ['React', 'Node.js', 'MongoDB', 'Express', 'Razorpay'],
    stats: [
      { value: 800, suffix: '+', label: 'users in week one' },
      { value: 600, suffix: '+', label: 'orders in week one' },
    ],
    highlight: 'Students stopped queuing. Orders went online in the very first week.',
    similar: 'Are your customers waiting in line for something they could order online?',
    image: zeroxImg,
    imageKind: 'screenshot',
  },
  {
    slug: 'tradingfloor',
    name: 'TradingFloor',
    sector: 'Fintech · Copy trading',
    category: 'Web apps',
    summary: 'Copy-trading SaaS for futures and options that mirrors one strategy across every client account at once.',
    statusNote: 'A private platform used by the client for his own customers, so there is no public link.',
    hook: 'One strategy, dozens of accounts, and seconds that cost money.',
    story: [
      'A trading educator and YouTuber had clients who wanted to follow his futures and options strategy exactly. Placing the same order across every client account by hand was slow, and in trading, a few seconds of delay can turn a profit into a loss.',
      'Third-party copy-trading platforms existed, but they charged recurring subscriptions that kept eating into returns, and he had no control over how they worked.',
    ],
    pains: [
      'Manual order placement across many accounts was too slow',
      'Delays meant clients got worse prices than the strategy',
      'Monthly fees on platforms like MyAlgoMate kept adding up',
    ],
    solution:
      'We built TradingFloor, a custom copy-trading SaaS. When he places a trade, the engine executes the same order for all his clients simultaneously, replicating the strategy exactly and fast, on infrastructure he owns.',
    features: [
      'One trade replicated across every client account at once',
      'Built for futures and options',
      'Low-latency order execution',
      'Client account management for the trader',
      'No recurring third-party platform subscription',
    ],
    outcome: 'Strategies replicate across all clients in one action, with no monthly platform subscription.',
    results: [
      'Every client order executes simultaneously',
      'Strategy replication without manual effort',
      'No recurring third-party platform fees',
    ],
    stack: ['Custom SaaS', 'Broker APIs', 'Low-latency execution'],
    similar: 'Paying monthly for software that should be yours?',
  },
  {
    slug: 'ai-lead-agent',
    name: 'AI lead agent',
    sector: 'SaaS · B2B growth',
    category: 'AI and automation',
    summary: 'An AI agent that finds people already looking for a product and starts the conversation.',
    statusNote: 'Built as an internal sales tool, so there is no public link.',
    hook: 'The right customers were out there, talking about the problem.',
    story: [
      'For SaaS businesses, the hardest part is not selling. It is finding the people who need you right now. Those buyers are scattered across LinkedIn, Reddit, Google Maps and Meta, describing their pain in their own words.',
      'Generic ads miss them, and manual outreach is slow and inconsistent. Sales teams end up chasing cold leads who were never going to buy, which is exhausting and expensive.',
    ],
    pains: [
      'High-intent buyers were hidden across many platforms',
      'Generic ads reached the wrong people',
      'Sales teams wasted time on unqualified leads',
    ],
    solution:
      'We built a product-aware AI agent that understands the company’s offerings, scans platforms for real buying signals, and sends personal, context-aware outreach on the brand’s behalf. Warm leads are routed straight to sales or a booking flow.',
    features: [
      'Deep understanding of the company’s products and use cases',
      'Intent detection on LinkedIn, Reddit and communities',
      'Customer discovery across Google Maps, Meta and search',
      'Personalised, context-aware outreach',
      'Warm leads routed to sales and booking',
    ],
    outcome: 'Warmer leads, faster connections and less time spent on unqualified prospects.',
    results: [
      'Higher-quality leads instead of cold traffic',
      'Faster customer–company connections',
      'Sales teams focused only on warm, qualified leads',
      'Scalable acquisition without adding headcount',
    ],
    stack: ['Gemini Pro', 'Intent detection', 'CRM integration', 'n8n'],
    similar: 'Is your sales team chasing people who will never buy?',
    image: leadAgentImg,
    imageKind: 'photo',
  },
];

export const categories: ('All' | Category)[] = ['All', 'Web apps', 'Websites', 'AI and automation'];
