import mongoose from 'mongoose';

// Singleton document (there is always exactly one) holding every editable
// chunk of the homepage plus site-wide contact info, so the admin panel
// has one place to manage "Homepage Management" + "Contact Information".
const siteSettingsSchema = new mongoose.Schema(
  {
    hero: {
      tag: { type: String, default: "Kathmandu, Nepal · Est. 2026" },
      title: { type: String, default: 'Pure Spices from the Heart of the Himalayas' },
      description: { type: String, default: '' },
      stats: [
        {
          _id: false,
          label: String,
          value: String,
        },
      ],
    },
    about: {
      title: { type: String, default: "From Nepal's Highlands to Your Kitchen" },
      body: { type: String, default: '' },
      bullets: { type: [String], default: [] },
      image: {
        url: { type: String, default: '' },
        publicId: { type: String, default: '' },
      },
      establishedYear: { type: String, default: '2026' },
    },
    packaging: {
      title: { type: String, default: 'Simple. Honest. Eco-Friendly.' },
      body: { type: String, default: '' },
      features: [
        { _id: false, icon: String, title: String, body: String },
      ],
      ctaTitle: { type: String, default: 'Need bulk packaging?' },
      ctaBody: { type: String, default: '' },
    },
    process: {
      title: { type: String, default: 'From Farm to Your Table' },
      steps: [
        { _id: false, icon: String, title: String, body: String },
      ],
    },
    values: {
      title: { type: String, default: 'Rooted in Values' },
      items: [
        { _id: false, icon: String, title: String, body: String },
      ],
    },
    cta: {
      title: { type: String, default: "Let's Work Together" },
      body: { type: String, default: '' },
      buttonText: { type: String, default: 'Contact Us' },
      buttonLink: { type: String, default: '/contact' },
    },
    contactInfo: {
      address: { type: String, default: 'Kathmandu, Nepal' },
      phone: { type: String, default: '' },
      email: { type: String, default: '' },
      website: { type: String, default: '' },
      mapEmbedUrl: { type: String, default: '' },
      socialLinks: {
        facebook: { type: String, default: '' },
        instagram: { type: String, default: '' },
        twitter: { type: String, default: '' },
      },
    },
    seo: {
      metaTitle: { type: String, default: 'Himalayan Swoniga Harvest — Pure Mountain Spices from Nepal' },
      metaDescription: { type: String, default: '' },
      ogImage: { type: String, default: '' },
    },
  },
  { timestamps: true }
);

export default mongoose.model('SiteSettings', siteSettingsSchema);
