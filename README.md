# Himalayan Swoniga Harvest — Full-Stack Web Application

A production-ready, full-stack rebuild of the Himalayan Swoniga Harvest static site. Every editable
piece of content (products, categories, gallery, blog, team, testimonials, homepage sections, contact
info, and contact messages) now lives in MongoDB and is managed through a protected admin panel, while
the public site keeps the original look, palette, type, and animations.

## Table of Contents

1. [Tech Stack](#tech-stack)
2. [Project Structure](#project-structure)
3. [Prerequisites](#prerequisites)
4. [Local Setup](#local-setup)
5. [Environment Variables](#environment-variables)
6. [Seeding the Database](#seeding-the-database)
7. [Running Tests](#running-tests)
8. [API Overview](#api-overview)
9. [Deployment](#deployment)
10. [Security Notes](#security-notes)
11. [Known Deviations From the Original Spec](#known-deviations-from-the-original-spec)

---

## Tech Stack

| Layer | Choice |
|---|---|
| Frontend | React 19, Vite, React Router 7, Axios, Tailwind CSS |
| Backend | Node.js, Express |
| Database | MongoDB (Atlas free tier) via Mongoose |
| Auth | JWT + bcryptjs |
| Image uploads | Cloudinary (free tier) |
| Rich text editor | TipTap (React 19-compatible; react-quill was ruled out — unmaintained, breaks on modern React) |
| Testing | Vitest everywhere — React Testing Library on the frontend, Supertest + mongodb-memory-server on the backend |
| Frontend hosting | Netlify (free tier) |
| Backend hosting | Render (free tier) |

**Design decision — CSS.** The original static site's hand-written CSS (custom properties for the
palette, layout, animations) was ported almost verbatim into `frontend/src/styles/legacy.css` and is
used as-is by every public page, so the storefront is pixel-compatible with the original. Tailwind is
used for the admin panel, which is entirely new UI with no legacy design to match.

## Project Structure

```
frontend/
  src/
    components/
      common/     shared UI: Loader, ErrorState, EmptyState, Pagination, Seo, ToastContainer, ...
      public/     Navbar, Footer, HeroCanvas, Marquee, Reveal, ProductCard, ...
      admin/      Sidebar, Topbar, DataTable, ImageUploader, RichTextEditor, ...
    context/      AuthContext, ToastContext
    hooks/        useFetch, usePaginatedFetch
    layouts/      PublicLayout, AdminLayout
    pages/
      public/     Home, About, Products, ProductDetail, Gallery, Blog, BlogDetail, Team, Contact
      admin/      Login, Dashboard, and one folder per manageable resource
    services/     one thin file per API resource, all built on a shared axios instance
    styles/       legacy.css (ported original stylesheet)
  public/legacy/  logo.png and the original about-section photo, extracted from the static site

backend/
  config/         db.js (Mongoose connect), cloudinary.js
  models/         User, Product, Category, Blog, Gallery, Team, Testimonial, ContactMessage, SiteSettings
  middleware/     auth, errorHandler, rateLimiter, upload (multer), validateRequest
  controllers/    one per resource
  routes/         one per resource, mounted under /api/v1
  utils/          asyncHandler, ApiError, crudFactory, paginate, slugify, cloudinaryUpload, ...
  seed/           seedData.js + seed.js — migrates the original static content into MongoDB
  tests/          Vitest + Supertest, run against an in-memory MongoDB
```

## Prerequisites

- Node.js 20+
- A free [MongoDB Atlas](https://www.mongodb.com/atlas) cluster (or local MongoDB for dev)
- A free [Cloudinary](https://cloudinary.com) account
- npm

## Local Setup

```bash
# 1. Backend
cd backend
cp .env.example .env        # fill in MONGO_URI, JWT_SECRET, Cloudinary keys — see below
npm install
npm run seed                # populates the DB with the original site's content + one admin user
npm run dev                 # http://localhost:5000

# 2. Frontend (in a second terminal)
cd frontend
cp .env.example .env        # VITE_API_BASE_URL=http://localhost:5000/api/v1
npm install
npm run dev                 # http://localhost:5173
```

Visit `http://localhost:5173` for the public site and `http://localhost:5173/admin/login` for the
admin panel, using the `ADMIN_EMAIL` / `ADMIN_PASSWORD` you set in `backend/.env` before seeding.

## Environment Variables

### `backend/.env`

| Variable | Purpose |
|---|---|
| `PORT` | Port the Express server listens on (default 5000) |
| `NODE_ENV` | `development` / `production` / `test` |
| `MONGO_URI` | MongoDB Atlas (or local) connection string |
| `JWT_SECRET` | Long random string used to sign admin JWTs |
| `JWT_EXPIRES_IN` | Token lifetime, e.g. `2h` — this is what enforces admin session expiration |
| `CLOUDINARY_CLOUD_NAME` / `CLOUDINARY_API_KEY` / `CLOUDINARY_API_SECRET` | From your Cloudinary dashboard |
| `CLIENT_ORIGINS` | Comma-separated list of allowed frontend origins for CORS (local + Netlify URL) |
| `ADMIN_NAME` / `ADMIN_EMAIL` / `ADMIN_PASSWORD` | Used once by `npm run seed` to create the first admin user |

### `frontend/.env`

| Variable | Purpose |
|---|---|
| `VITE_API_BASE_URL` | Base URL of the backend API, **including** `/api/v1` |

**Local vs. Netlify env vars:** `frontend/.env` is only read by Vite during local `npm run dev` /
`npm run build`. It is never deployed. On Netlify, set the same variable (`VITE_API_BASE_URL`, pointed
at your Render URL + `/api/v1`) under **Site settings → Environment variables**, then trigger a deploy —
Vite bakes it into the build at build time, so changing it on Netlify always requires a redeploy.

## Seeding the Database

```bash
cd backend
npm run seed            # safe to re-run — categories/products upsert by slug, admin user is created once
npm run seed:destroy     # wipes products/categories/testimonials/settings first, then reseeds
```

The seed script migrates the original static site's content 1:1: the 6 products, 3 categories, the
"Our Story" copy and bullet points, the packaging/process/values sections, the one existing
testimonial, and the contact details. Product/gallery photos are **not** pre-populated with Cloudinary
URLs (no credentials exist at seed time) — upload real photos for each item from the admin panel after
your first deploy.

## Running Tests

```bash
cd backend && npm test     # Vitest + Supertest against an in-memory MongoDB — no real DB needed
cd frontend && npm test    # Vitest + React Testing Library
```

Test coverage is representative rather than exhaustive: backend auth + products routes (list,
pagination, create/slug-generation, 401 guards), and frontend Pagination, EmptyState/ErrorState, the
toast system, and a full Contact-form submission flow. Extending coverage to every CRUD endpoint and
every admin form is the natural next step if this becomes a team project.

## API Overview

All routes are versioned under `/api/v1`. Every response is `{ success, data, meta? }` on success or
`{ success: false, message, errors? }` on failure. List endpoints accept `page`, `limit`, `search`,
and `sort` query params and return `meta: { page, limit, total, totalPages }`.

| Resource | Base path | Public | Admin (JWT required) |
|---|---|---|---|
| Auth | `/auth` | `POST /login` | `GET /me`, `PUT /change-password` |
| Products | `/products` | `GET /`, `GET /:idOrSlug` | `POST /`, `PUT /:id`, `DELETE /:id`, `DELETE /:id/images/:imageId` |
| Categories | `/categories` | `GET /`, `GET /:id` | `POST /`, `PUT /:id`, `DELETE /:id` |
| Blogs | `/blogs` | `GET /` (published only), `GET /:idOrSlug` | same + `includeDrafts=true` |
| Gallery | `/gallery` | `GET /` | `POST /`, `PUT /:id`, `DELETE /:id` |
| Team | `/team` | `GET /` | `POST /`, `PUT /:id`, `DELETE /:id` |
| Testimonials | `/testimonials` | `GET /` | `POST /`, `PUT /:id`, `DELETE /:id` |
| Contact | `/contact` | `POST /` (submit) | `GET /`, `GET /:id`, `PATCH /:id/read`, `DELETE /:id` |
| Settings | `/settings` | `GET /` | `PUT /`, `POST /about-image` |
| Dashboard | `/dashboard` | — | `GET /` |

Image-upload endpoints (`products`, `blogs` featured image, `gallery`, `team` photo, `testimonials`
avatar, `settings/about-image`) accept `multipart/form-data`; every other write endpoint accepts JSON.

## Deployment

### Database — MongoDB Atlas

1. Create a free M0 cluster.
2. Add a database user and password.
3. Under Network Access, allow access from anywhere (`0.0.0.0/0`) — Render's free tier has no fixed IP.
4. Copy the connection string into `MONGO_URI`.

### Backend — Render

1. New **Web Service**, point it at this repo, root directory `backend`.
2. Build command: `npm install`. Start command: `npm start`.
3. Add all the `backend/.env` variables in Render's dashboard (a `backend/render.yaml` blueprint is
   included if you prefer `render blueprint` deploys).
4. After the first deploy, run `npm run seed` **once** — either via Render's shell, or by running it
   locally with `MONGO_URI` pointed at the Atlas cluster.

**Cold starts:** Render's free tier spins the service down after ~15 minutes of inactivity. The first
request after that takes 30–60s to wake it back up (subsequent requests are fast). This is expected —
either accept the delay, or set up a free uptime pinger (e.g. UptimeRobot hitting `/health` every 10
minutes) to keep it warm during business hours.

### Frontend — Netlify

1. New site from Git, root directory `frontend`.
2. Build command `npm run build`, publish directory `dist` — already set in `frontend/netlify.toml`.
3. SPA fallback for React Router is handled two ways (belt-and-suspenders): the `[[redirects]]` rule
   in `netlify.toml` and `frontend/public/_redirects`. Either alone is sufficient; both are included.
4. Set `VITE_API_BASE_URL` under **Site settings → Environment variables** to your Render URL +
   `/api/v1`, then trigger a deploy.
5. **Production branch:** `main`. Netlify's deploy previews work automatically for pull requests once
   the site is linked to the repo — no extra config needed beyond the `[context.deploy-preview]` block
   already in `netlify.toml`.

### CORS

`CLIENT_ORIGINS` on the backend must list your exact Netlify URL (and `http://localhost:5173` for
local dev). Update and redeploy the backend whenever the Netlify domain changes (e.g. after attaching
a custom domain).

## Security Notes

- Helmet, CORS allowlist, `express-mongo-sanitize`, and rate limiting (global + stricter on login and
  contact form submission) are applied at the app level.
- All admin write routes require a valid JWT (`protect` middleware); passwords are hashed with bcryptjs.
- Input is validated with `express-validator` on every write endpoint that accepts user input directly
  (auth, products, categories, blogs, contact).
- Blog content (authored via TipTap, rendered with `dangerouslySetInnerHTML` on the public blog page)
  is sanitized client-side with DOMPurify before rendering, as defense in depth.
- `npm audit` is clean on the backend. The frontend has one remaining **high** advisory
  (`GHSA-qwww-vcr4-c8h2`, react-router) — per the advisory itself, it "only affects your application
  if you are using the unstable RSC APIs." This app is a plain client-side SPA (`BrowserRouter`, no
  RSC/framework mode), so it doesn't apply; re-check this if you upgrade to a framework-mode setup.

## Known Deviations From the Original Spec

- **bcrypt → bcryptjs.** `bcrypt` requires a native build toolchain that's often painful on Windows;
  `bcryptjs` is a pure-JS drop-in with the same API, at no cost to security for this project's scale.
- **No separate `Gallery`/`Blog`/`Team` sections existed in the original static site** — it was a
  single-page site (Home/About/Products/Packaging/Process/Values/Contact only). Those three pages were
  designed from scratch to match the existing visual language (palette, type, card/eyebrow/rule
  patterns) rather than "converted," since there was nothing to convert.
- **Routing model.** The original was a single HTML page with anchor links. This rebuild uses real
  React Router routes (`/about`, `/products`, `/gallery`, `/blog`, `/team`, `/contact`) so each page can
  have its own SEO meta/OG tags and a friendly URL, per the brief's SEO requirements. The Home page
  still reassembles the original one-pager's sections (hero, about teaser, featured products, process,
  values, testimonial, CTA).
- **SEO tags** are set via a small hand-rolled `<Seo>` component (`frontend/src/components/common/Seo.jsx`)
  instead of `react-helmet-async`, to avoid any React 19 compatibility uncertainty from a third-party
  dependency for a ~20-line piece of functionality.
- **Test coverage is representative, not exhaustive** — see [Running Tests](#running-tests).
