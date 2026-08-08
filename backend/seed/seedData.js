// Content migrated 1:1 from the original static index.html so the database
// isn't empty on first run. Product/gallery photos aren't seeded with real
// Cloudinary images (no credentials at seed time) — the admin panel is used
// to attach real photos after the first deploy; icons/text seed immediately usable content.

export const categories = [
  { name: 'Spice Powders', description: 'Sun-dried and machine-dried highland spice powders.' },
  { name: 'Tea & Herb Blends', description: 'Hand-selected dried herb and tea blends.' },
  { name: 'Bulk & Custom', description: 'Wholesale, distributor, and custom-blend orders.' },
];

export const products = (categoryIdByName) => [
  {
    name: 'Garlic Powder',
    icon: '🧄',
    shortDescription: 'Intensely aromatic Himalayan garlic — sun-dried and finely milled. No salt, no fillers, pure garlic.',
    category: categoryIdByName['Spice Powders'],
    tag: 'Bestseller',
    featured: true,
    order: 1,
  },
  {
    name: 'Ginger Powder',
    icon: '🫚',
    shortDescription: 'Warm, spicy highland ginger — dual-dried for consistent flavour. Perfect for cooking and wellness.',
    category: categoryIdByName['Spice Powders'],
    tag: 'Available Now',
    featured: true,
    order: 2,
  },
  {
    name: 'Lapsi Powder',
    icon: '🍑',
    shortDescription: "Nepal's signature hog plum — naturally sour, sun-dried and powdered. Rooted in tradition.",
    category: categoryIdByName['Spice Powders'],
    tag: 'Signature',
    featured: true,
    order: 3,
  },
  {
    name: 'Soothing Tea Blend',
    icon: '🌿',
    shortDescription: 'Hand-selected dried herbs blended for calm and restful sleep. Relax and unwind naturally.',
    category: categoryIdByName['Tea & Herb Blends'],
    tag: 'New',
    order: 4,
  },
  {
    name: 'Dried Herb Mixes',
    icon: '🌾',
    shortDescription: 'Seasonal mountain herb blends — turmeric, fenugreek, coriander and more — pure and clean.',
    category: categoryIdByName['Tea & Herb Blends'],
    tag: 'Seasonal',
    order: 5,
  },
  {
    name: 'Bulk & Custom Orders',
    icon: '📦',
    shortDescription: 'Supplying restaurants, retailers, and distributors. Contact us for bulk pricing and custom blends.',
    category: categoryIdByName['Bulk & Custom'],
    tag: 'Enquire',
    order: 6,
  },
];

export const testimonials = [
  {
    name: 'Early Customer',
    location: 'Kathmandu',
    quote: "The garlic powder from Himalayan Swoniga Harvest is unlike anything I've used — intensely aromatic, pure, and clearly made with real care. You can taste the difference immediately.",
    featured: true,
    order: 1,
  },
];

export const siteSettings = {
  hero: {
    tag: 'Kathmandu, Nepal · Est. 2026',
    title: 'Pure Spices from the Heart of the Himalayas',
    description: 'Sun-dried and machine-dried to perfection. Garlic, ginger, lapsi and more — sourced from Nepal\'s highland farms, ground pure without additives or preservatives.',
    stats: [
      { label: 'Natural', value: '100%' },
      { label: 'Products', value: '6+' },
      { label: 'Additives', value: 'Zero' },
      { label: 'Established', value: '2026' },
    ],
  },
  about: {
    title: "From Nepal's Highlands to Your Kitchen",
    body: "Himalayan Swoniga Harvest was born from a deep respect for Nepal's centuries-old farming traditions. We source garlic, ginger, lapsi, and other highland crops directly from trusted local farmers — and process them using both natural sun-drying and modern machine drying to guarantee consistent quality year-round.",
    bullets: [
      'Direct partnerships with highland farmers across Nepal',
      'Dual-process drying — sun-dried and machine-dried for year-round consistency',
      'Fine-milled to preserve full flavour, aroma, and nutrition',
      'Zero artificial additives, colours, or preservatives',
    ],
    establishedYear: '2026',
  },
  packaging: {
    title: 'Simple. Honest. Eco-Friendly.',
    body: 'Our kraft stand-up resealable pouches protect freshness while staying environmentally responsible. Every pack is clearly labelled — because transparency is part of what we sell.',
    features: [
      { icon: '♻️', title: 'Eco-Friendly Kraft', body: 'Resealable stand-up pouches made from responsibly sourced kraft paper — biodegradable and sustainable.' },
      { icon: '🔒', title: 'Airtight Freshness', body: 'Zipper-lock seal keeps your spices fresh and aromatic for months after opening.' },
      { icon: '🏷️', title: 'Clear Labelling', body: 'Product name, tagline, ingredients, and contact printed clearly — no hidden surprises inside.' },
      { icon: '🪟', title: 'Transparent Window', body: 'A clear window lets you see the product inside before you open it — full visual honesty.' },
      { icon: '📐', title: 'Multiple Sizes', body: 'Available in retail and bulk pack sizes — suitable for household use and wholesale supply.' },
      { icon: '🎨', title: 'Custom Branding', body: 'Custom labelling available for wholesale buyers and private label requirements.' },
    ],
    ctaTitle: 'Need bulk packaging?',
    ctaBody: 'We supply retailers, restaurants, and distributors across Nepal and beyond.',
  },
  process: {
    title: 'From Farm to Your Table',
    steps: [
      { icon: '🌱', title: 'Highland Harvest', body: 'Crops harvested at peak freshness from our partner highland farms across Nepal.' },
      { icon: '☀️', title: 'Dual Drying', body: 'Traditional sun-drying and modern machine drying — both methods, best of both worlds.' },
      { icon: '⚙️', title: 'Fine Milling', body: 'Dried ingredients carefully milled into fine powder, preserving aroma, colour, and nutrients.' },
      { icon: '📦', title: 'Sealed & Shipped', body: 'Packed fresh into resealable kraft pouches — pure, clean, and ready for your kitchen.' },
    ],
  },
  values: {
    title: 'Rooted in Values',
    items: [
      { icon: '🏔️', title: 'Himalayan Origin', body: 'Every ingredient traced to specific highland farms in Nepal — genuine provenance, every batch.' },
      { icon: '🌿', title: 'Chemical Free', body: 'No pesticides, no fumigants, no artificial treatment — we source clean and process clean.' },
      { icon: '🤝', title: 'Farmer First', body: 'Fair prices paid directly to our farmers — no middlemen, supporting rural livelihoods in Nepal.' },
      { icon: '📋', title: 'Full Transparency', body: "What's on the label is all that's in the pack. No hidden additives, no fine print surprises." },
    ],
  },
  cta: {
    title: "Let's Work Together",
    body: "Whether you're a retailer, restaurant, distributor, or home customer — reach out for bulk orders, custom blends, or general enquiries.",
    buttonText: 'Contact Us',
    buttonLink: '/contact',
  },
  contactInfo: {
    address: 'Kathmandu, Nepal',
    phone: '+977 9802311111',
    email: 'info@himalayaswonigaharvest.com',
    website: 'himalayaswonigaharvest.com',
    mapEmbedUrl: '',
    socialLinks: { facebook: '', instagram: '', twitter: '' },
  },
  seo: {
    metaTitle: 'Himalayan Swoniga Harvest — Pure Mountain Spices from Nepal',
    metaDescription: "Sun-dried and machine-dried Himalayan garlic, ginger, lapsi and herb powders — sourced directly from Nepal's highland farmers.",
    ogImage: '',
  },
};
