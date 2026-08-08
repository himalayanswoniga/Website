import { Suspense, lazy } from 'react';
import { Routes, Route } from 'react-router-dom';
import PublicLayout from './layouts/PublicLayout';
import ProtectedRoute from './components/common/ProtectedRoute';
import Loader from './components/common/Loader';

import Home from './pages/public/Home';
import About from './pages/public/About';
import Products from './pages/public/Products';
import ProductDetail from './pages/public/ProductDetail';
import Gallery from './pages/public/Gallery';
import Blog from './pages/public/Blog';
import BlogDetail from './pages/public/BlogDetail';
import Team from './pages/public/Team';
import Contact from './pages/public/Contact';
import NotFound from './pages/public/NotFound';

// The admin panel (incl. TipTap) is lazy-loaded so public visitors never
// download it — only an authenticated admin visiting /admin pays that cost.
const AdminLayout = lazy(() => import('./layouts/AdminLayout'));
const Login = lazy(() => import('./pages/admin/Login'));
const Dashboard = lazy(() => import('./pages/admin/Dashboard'));
const ProductList = lazy(() => import('./pages/admin/products/ProductList'));
const ProductForm = lazy(() => import('./pages/admin/products/ProductForm'));
const CategoryList = lazy(() => import('./pages/admin/categories/CategoryList'));
const GalleryList = lazy(() => import('./pages/admin/gallery/GalleryList'));
const BlogList = lazy(() => import('./pages/admin/blogs/BlogList'));
const BlogForm = lazy(() => import('./pages/admin/blogs/BlogForm'));
const TeamList = lazy(() => import('./pages/admin/team/TeamList'));
const TestimonialList = lazy(() => import('./pages/admin/testimonials/TestimonialList'));
const HomepageSettings = lazy(() => import('./pages/admin/settings/HomepageSettings'));
const ContactInfoSettings = lazy(() => import('./pages/admin/settings/ContactInfoSettings'));
const MessageList = lazy(() => import('./pages/admin/messages/MessageList'));

export default function App() {
  return (
    <Routes>
      <Route element={<PublicLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/products" element={<Products />} />
        <Route path="/products/:slug" element={<ProductDetail />} />
        <Route path="/gallery" element={<Gallery />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/blog/:slug" element={<BlogDetail />} />
        <Route path="/team" element={<Team />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="*" element={<NotFound />} />
      </Route>

      <Route
        path="/admin/login"
        element={
          <Suspense fallback={<Loader label="Loading…" />}>
            <Login />
          </Suspense>
        }
      />
      <Route
        path="/admin"
        element={
          <ProtectedRoute>
            <Suspense fallback={<Loader label="Loading…" />}>
              <AdminLayout />
            </Suspense>
          </ProtectedRoute>
        }
      >
        <Route index element={<Dashboard />} />
        <Route path="products" element={<ProductList />} />
        <Route path="products/new" element={<ProductForm />} />
        <Route path="products/:id/edit" element={<ProductForm />} />
        <Route path="categories" element={<CategoryList />} />
        <Route path="gallery" element={<GalleryList />} />
        <Route path="blogs" element={<BlogList />} />
        <Route path="blogs/new" element={<BlogForm />} />
        <Route path="blogs/:id/edit" element={<BlogForm />} />
        <Route path="team" element={<TeamList />} />
        <Route path="testimonials" element={<TestimonialList />} />
        <Route path="homepage" element={<HomepageSettings />} />
        <Route path="contact-info" element={<ContactInfoSettings />} />
        <Route path="messages" element={<MessageList />} />
      </Route>
    </Routes>
  );
}
