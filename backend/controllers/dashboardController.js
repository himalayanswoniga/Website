import { asyncHandler } from '../utils/asyncHandler.js';
import { sendSuccess } from '../utils/apiResponse.js';
import Product from '../models/Product.js';
import Category from '../models/Category.js';
import Gallery from '../models/Gallery.js';
import Blog from '../models/Blog.js';
import ContactMessage from '../models/ContactMessage.js';
import Team from '../models/Team.js';
import Testimonial from '../models/Testimonial.js';

export const getDashboardStats = asyncHandler(async (req, res) => {
  const [
    totalProducts,
    totalCategories,
    totalGalleryImages,
    totalBlogs,
    publishedBlogs,
    totalMessages,
    unreadMessages,
    totalTeam,
    totalTestimonials,
    recentMessages,
    recentBlogs,
  ] = await Promise.all([
    Product.countDocuments(),
    Category.countDocuments(),
    Gallery.countDocuments(),
    Blog.countDocuments(),
    Blog.countDocuments({ status: 'published' }),
    ContactMessage.countDocuments(),
    ContactMessage.countDocuments({ isRead: false }),
    Team.countDocuments(),
    Testimonial.countDocuments(),
    ContactMessage.find().sort('-createdAt').limit(5).select('name email enquiryType isRead createdAt'),
    Blog.find().sort('-createdAt').limit(5).select('title status createdAt'),
  ]);

  sendSuccess(res, 200, {
    totals: {
      products: totalProducts,
      categories: totalCategories,
      galleryImages: totalGalleryImages,
      blogs: totalBlogs,
      publishedBlogs,
      messages: totalMessages,
      unreadMessages,
      team: totalTeam,
      testimonials: totalTestimonials,
    },
    recentActivity: {
      messages: recentMessages,
      blogs: recentBlogs,
    },
  });
});
