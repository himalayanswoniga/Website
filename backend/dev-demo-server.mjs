// Temporary local-demo runner: loads Cloudinary credentials from your own
// backend/.env (never read by anyone else) and spins up an in-memory
// MongoDB so the rest of the app works without needing a real Atlas URI yet.
// Not part of the deliverable — safe to delete.
import dotenv from 'dotenv';
dotenv.config(); // picks up CLOUDINARY_CLOUD_NAME / API_KEY / API_SECRET from backend/.env if present

import { MongoMemoryServer } from 'mongodb-memory-server';

process.env.NODE_ENV = 'development';
process.env.JWT_SECRET = 'local-demo-secret-not-for-production';
process.env.JWT_EXPIRES_IN = '2h';
process.env.CLIENT_ORIGINS = 'http://localhost:5173';
process.env.PORT = '5000';
process.env.ADMIN_EMAIL = 'admin@demo.com';
process.env.ADMIN_PASSWORD = 'demopassword123';

if (process.env.CLOUDINARY_CLOUD_NAME) {
  console.log(`Cloudinary configured for cloud "${process.env.CLOUDINARY_CLOUD_NAME}" — image uploads will work.`);
} else {
  console.log('No Cloudinary credentials found in backend/.env — image uploads will fail until you add them.');
}

const mongod = await MongoMemoryServer.create();
process.env.MONGO_URI = mongod.getUri('himalayan-swoniga-demo');

const { connectDB } = await import('./config/db.js');
await connectDB();

const { slugify } = await import('./utils/slugify.js');
const User = (await import('./models/User.js')).default;
const Category = (await import('./models/Category.js')).default;
const Product = (await import('./models/Product.js')).default;
const Testimonial = (await import('./models/Testimonial.js')).default;
const SiteSettings = (await import('./models/SiteSettings.js')).default;
const { categories, products, testimonials, siteSettings } = await import('./seed/seedData.js');

const categoryIdByName = {};
for (const cat of categories) {
  const slug = slugify(cat.name);
  const doc = await Category.create({ ...cat, slug });
  categoryIdByName[cat.name] = doc._id;
}
for (const product of products(categoryIdByName)) {
  await Product.create({ ...product, slug: slugify(product.name) });
}
await Testimonial.insertMany(testimonials);
await SiteSettings.create(siteSettings);
await User.create({ name: 'Demo Admin', email: process.env.ADMIN_EMAIL, password: process.env.ADMIN_PASSWORD, role: 'admin' });

console.log(`Demo admin login: ${process.env.ADMIN_EMAIL} / ${process.env.ADMIN_PASSWORD}`);

const { default: app } = await import('./app.js');
app.listen(process.env.PORT, () => console.log(`Demo API server on http://localhost:${process.env.PORT}`));
