import dotenv from 'dotenv';
dotenv.config();

import mongoose from 'mongoose';
import { connectDB } from '../config/db.js';
import { slugify } from '../utils/slugify.js';
import User from '../models/User.js';
import Category from '../models/Category.js';
import Product from '../models/Product.js';
import Testimonial from '../models/Testimonial.js';
import SiteSettings from '../models/SiteSettings.js';
import { categories, products, testimonials, siteSettings } from './seedData.js';

const DESTROY = process.argv.includes('--destroy');

async function run() {
  await connectDB();

  if (DESTROY) {
    await Promise.all([
      Category.deleteMany(),
      Product.deleteMany(),
      Testimonial.deleteMany(),
      SiteSettings.deleteMany(),
    ]);
    console.log('Cleared products, categories, testimonials, and settings.');
  }

  // Categories (upsert by slug so re-running the script is safe)
  const categoryIdByName = {};
  for (const cat of categories) {
    const slug = slugify(cat.name);
    const doc = await Category.findOneAndUpdate(
      { slug },
      { ...cat, slug },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
    categoryIdByName[cat.name] = doc._id;
  }
  console.log(`Seeded ${categories.length} categories.`);

  // Products
  for (const product of products(categoryIdByName)) {
    const slug = slugify(product.name);
    await Product.findOneAndUpdate(
      { slug },
      { ...product, slug },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
  }
  console.log(`Seeded ${products(categoryIdByName).length} products.`);

  // Testimonials — only insert if the collection is empty, since testimonials have no natural unique key
  if ((await Testimonial.countDocuments()) === 0) {
    await Testimonial.insertMany(testimonials);
    console.log(`Seeded ${testimonials.length} testimonial(s).`);
  }

  // Site settings singleton
  const existingSettings = await SiteSettings.findOne();
  if (!existingSettings) {
    await SiteSettings.create(siteSettings);
    console.log('Seeded site settings.');
  }

  // First admin user
  const adminEmail = (process.env.ADMIN_EMAIL || 'admin@himalayanswonigaharvest.com').toLowerCase();
  const existingAdmin = await User.findOne({ email: adminEmail });
  if (!existingAdmin) {
    await User.create({
      name: process.env.ADMIN_NAME || 'Admin',
      email: adminEmail,
      password: process.env.ADMIN_PASSWORD || 'change-this-password',
      role: 'admin',
    });
    console.log(`Created admin user: ${adminEmail}`);
  } else {
    console.log('Admin user already exists, skipping.');
  }

  await mongoose.connection.close();
  console.log('Seed complete.');
}

run().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
