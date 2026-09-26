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
| Hosting | Netlify (free tier) — static site and the Express API as one Netlify Function, same origin |
| Alternative API hosting | Render (free tier) — `backend/render.yaml` blueprint, if you prefer a long-running server |

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

netlify/
  functions/      api.mjs — wraps the Express app as a same-origin serverless function

backend/
  config/         db.js (Mongoose connect + cached serverless connect), cloudinary.js
  models/         User, Product, Category, Blog, Gallery, Team, Testimonial, ContactMessage, SiteSettings
  middleware/     auth, errorHandler, rateLimiter, upload (multer), validateRequest
  controllers/    one per resource
  routes/         one per resource, mounted under /api/v1
  utils/          asyncHandler, ApiError, crudFactory, paginate, slugify, cloudinaryUpload, ...
  seed/           seedData.js + seed.js — migrates the original static content into MongoDB
                  seedContentRouter.js — read-only API over that same content, served when
                  MONGO_URI is unset so the storefront works before the DB exists
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
npm install
npm run dev                 # http://localhost:5173 — no .env needed
```

The frontend needs no `.env` for local work: it calls the relative `/api/v1`, and Vite's dev server
proxies that to `http://localhost:5000` (override with `DEV_API_PROXY` if your API runs elsewhere).

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
| `VITE_API_BASE_URL` | Only for a **separately hosted** API. Leave unset on Netlify — the bundled function serves `/api/v1` on the site's own origin. |
| `DEV_API_PROXY` | Dev-server proxy target, default `http://localhost:5000`. Local only. |

**Local vs. Netlify env vars:** `frontend/.env` is only read by Vite during local `npm run dev` /
`npm run build`; it is never deployed. Anything the deployed site needs belongs under **Site
settings → Environment variables** on Netlify. Note that `VITE_*` values are baked into the bundle
at build time, so changing one there always requires a redeploy — unlike the backend's `MONGO_URI`
and `CLOUDINARY_*`, which the function reads at runtime.

**The build refuses to ship an unreachable API URL.** `vite build` accepts exactly two valid
configurations: `VITE_API_BASE_URL` unset with `netlify/functions/api.mjs` present (same-origin API),
or `VITE_API_BASE_URL` set to an `https://` URL ending in `/api/v1` (separate API host). Anything else
fails the build with an explanation.

This exists because the value is inlined at build time. With it unset, the old fallback quietly
produced a production bundle that called `http://localhost:5000`, so every visitor got
`Network Error` and nothing in the build output said so. To build against a local API on purpose,
use `ALLOW_LOCAL_API_BUILD=1 npm run build`.

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

The site and its API deploy together to Netlify from a single `git push`: the Vite build
produces `frontend/dist`, and `netlify/functions/api.mjs` wraps the same Express app in
`backend/` as a serverless function mounted on the site's own origin.

Because the API answers on the same origin as the pages, there is no separate API host to
manage, no CORS allowlist to keep in sync, and no `VITE_API_BASE_URL` to set — the frontend
just calls the relative `/api/v1`.

### Going live without a database yet

The function checks for `MONGO_URI` at startup. If it is missing, it serves
`backend/seed/seedContentRouter.js` instead of the database-backed routes: a read-only API
returning the same content `npm run seed` would load, in the same response envelope.

That means **the public storefront works on a fresh deploy with zero configuration.** Products,
categories, testimonials and every homepage section render from the built-in content. What
stays disabled until a database exists:

| Feature | Behaviour without `MONGO_URI` |
|---|---|
| Public storefront | Fully working, from built-in content |
| Gallery / Blog / Team | Empty-state pages (nothing was ever seeded for them) |
| Contact form | `503` telling the visitor to email or call instead |
| Admin panel | `503` on login — content is read-only until the DB is wired up |

`GET /health` reports which mode it is in, and every response carries an `X-Data-Source`
header of `seed` or `database`:

```bash
curl https://himalayanswonigaharvest.com/health
# {"success":true,"message":"API is running","dataSource":"seed"}
```

### Netlify setup

1. **Set the site's Base directory to empty (the repo root).** Site settings → Build & deploy
   → Build settings. This is the one manual step — `netlify.toml` lives at the repo root now,
   and Netlify only reads the one inside the base directory. Everything else comes from that
   file: build command, publish directory, functions directory, and the `/api/*` rewrite.
2. Production branch: whichever branch you deploy from. Deploy previews work automatically.
3. Push. The build runs `npm run build` at the root, which installs both workspaces and
   builds the frontend; Netlify then bundles `netlify/functions/api.mjs` with esbuild.

### Adding the database — MongoDB Atlas

1. Create a free M0 cluster at [mongodb.com/atlas](https://www.mongodb.com/atlas).
2. Add a database user and password.
3. Under Network Access, allow access from anywhere (`0.0.0.0/0`) — serverless functions have
   no fixed IP.
4. Put the connection string in `backend/.env` locally and run `npm run seed` once to populate
   the cluster and create the first admin user.
5. Add `MONGO_URI`, `JWT_SECRET` and the three `CLOUDINARY_*` values under **Site settings →
   Environment variables** on Netlify, then redeploy.
6. Confirm the switch: `curl https://<your-site>/health` should now report
   `"dataSource":"database"`.

Nothing in the frontend changes between the two modes — the same deploy serves seed content
before step 5 and live content after it.

### Alternative: a long-running API on Render

`backend/render.yaml` is still included if you would rather run the API as a normal server:
root directory `backend`, build `npm install`, start `npm start`. In that setup you must also:

- set `CLIENT_ORIGINS` on Render to every origin the site is served from, comma-separated:
  `https://himalayanswonigaharvest.com,https://www.himalayanswonigaharvest.com,http://localhost:5173`
  (trailing slashes and casing are normalised; an unlisted origin gets a `403` naming itself)
- set `VITE_API_BASE_URL` on Netlify to `https://<service>.onrender.com/api/v1` and redeploy
  with the cache cleared
- accept that Render's free tier sleeps after ~15 minutes idle, so the first request after a
  quiet period takes 30–60s (an UptimeRobot ping on `/health` keeps it warm)

### Deployment checklist

1. Netlify Base directory is empty, so the root `netlify.toml` is the one in effect.
2. `curl https://<your-site>/health` returns `success: true` and the `dataSource` you expect.
3. `curl https://<your-site>/api/v1/settings` returns JSON, not HTML. HTML means the `/api/*`
   rewrite is not active and the SPA fallback swallowed the request.
4. The browser network tab shows requests to your own domain, never `localhost`.
5. Once Atlas is wired up: `dataSource` reads `database`, and admin login works.


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
