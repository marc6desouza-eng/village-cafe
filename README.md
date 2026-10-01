# ☕ VILLAGE CAFE — Café & Bakery
### Curtorim, Goa, India

A real, production-ready, full-stack web application with customer-facing storefront and full-featured Content Management System (CMS) and Table Reservation Engine.

Built with authentic visual and architectural fidelity to the real **Village Cafe** located at Carmel View, Curtorim, Goa.

---

## 📸 Reference Photography & Visual Identity

The design, color scheme, and typography directly mirror the physical café:
- **Façade & Signage**: Carmel View building, signature burgundy & gold oval crest branding (*Village Café & Bakery*), street front view.
- **Interiors**: Taupe/grey fluted wainscoting, comfortable cushioned seating with lime green & sunshine yellow accent tables.
- **Bakery & Counter**: Multi-tier illuminated glass bakery cases with fresh egg puffs, veg patties, sausage rolls, packaged tea biscuits, rusks, cakes, and Amul ice cream parlour.
- **Palette**: Warm Cream (`#FDFBF7`), Coffee Brown (`#7B4B32`), Deep Charcoal (`#111827`), Velvet Burgundy (`#7E1F2D`), Muted Sage (`#5F7A61`), and Warm Gold/Yellow (`#F59E0B`).

---

## 🛠️ Technology Stack

- **Frontend**:
  - React 18
  - Vite 5
  - Tailwind CSS 3 (custom brand palette & warm shadows)
  - React Router DOM v6
  - Lucide React Icons
  - Axios HTTP Client with JWT interceptors
- **Backend**:
  - Node.js & Express.js (RESTful API architecture)
  - Mongoose 8 / MongoDB & MongoDB Atlas support
  - Dual-mode data persistence: Native MongoDB / Atlas with automatic high-reliability JSON disk fallback (`backend/data/`) for zero-configuration local runs
  - JSON Web Tokens (`jsonwebtoken`) + `bcryptjs` password hashing
  - Multer for local persistent disk storage in `backend/uploads/`
  - Cloudinary persistent cloud image storage adapter
  - Helmet & CORS security middleware
- **Design & UX**:
  - 100% responsive across mobile (320px+), tablet, laptop, and 4K desktop
  - Live **OPEN NOW / CLOSED** indicator calculated in real-time from database opening hours
  - Search, multi-category filtering, dietary filters (Veg / Non-Veg), sorting
  - Full-screen lightbox photo viewer with keyboard navigation
  - Real table booking system with unique Reference ID generation (`VC-2026-XXXX`) and live customer booking tracker

---

## 🚀 Quick Start Guide

### Prerequisites
- Node.js (v18+ or v20+ or v24+)
- npm (v9+)
- *(Optional)* MongoDB Atlas connection URI or local MongoDB daemon
- *(Optional)* Cloudinary account credentials for cloud asset storage

### 1. Installation
In the project root directory (`village-cafe`):
```bash
npm run install-all
```
*This installs dependencies for both `backend` and `frontend` concurrently.*

### 2. Environment Configuration
Check `backend/.env` (pre-configured) or create from `.env.example`:
```env
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/village_cafe
JWT_SECRET=super_secret_jwt_key_village_cafe_goa_curtorim_2026
ADMIN_EMAIL=admin@villagecafe.goa
ADMIN_PASSWORD=VillageCafeGoa2026!
CORS_ORIGIN=http://localhost:3000,http://localhost:5173

# Optional: Cloudinary Credentials
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
```

### 3. Seed Database & Assets
Seed the admin account, default menu categories, signature delicacies, real cafe photos, and initial CMS content:
```bash
npm run seed
```

### 4. Launch Application
Run both backend API and frontend client with a single command:
```bash
npm run dev
```

- **Public Website**: [http://localhost:5173](http://localhost:5173) (or `http://localhost:3000`)
- **Admin CMS**: [http://localhost:5173/admin](http://localhost:5173/admin)
- **Backend Health Check**: [http://localhost:5000/api/health](http://localhost:5000/api/health)

---

## 🔐 Admin Dashboard & CMS Credentials

- **URL**: `/admin`
- **Email**: `admin@villagecafe.goa`
- **Password**: `VillageCafeGoa2026!`
*(Note: A convenient "Fill Credentials" button is provided on the admin login page for quick testing).*

### Admin Management Capabilities:
1. **Dashboard**: Live metrics (Menu counts, available items, pending bookings, today's arrivals, recent updates).
2. **Homepage CMS**: Hero headline, subtitle, buttons, introduction story, bakery and our space headers, reservation CTA text and image.
3. **About CMS**: Our story paragraphs, philosophy points, freshness guarantee, bakery details, and cafe experience narrative.
4. **Menu CMS**: Full CRUD (Create, Read, Update, Delete, Duplicate), price changes, availability toggle, Pure Veg toggle, Featured & Signature badges, display ordering.
5. **Categories CMS**: Manage category taxonomy with orphaned item protection.
6. **Gallery CMS**: Upload high-res photography (single or batch), categories (Café, Bakery, Food, Drinks, Ambience, Exterior), captions, alt text, and homepage highlights.
7. **Reservations Manager**: Searchable guest bookings table, date filter, status transitions (`PENDING`, `CONFIRMED`, `CANCELLED`, `COMPLETED`), manager notes, table assignment.
8. **Contact & Social CMS**: Physical address, primary and secondary phone numbers, email, Google Maps link, Instagram, and Facebook handles.
9. **Opening Hours CMS**: 7-day schedule with open/close toggles and custom timings; dynamically recalculates the live "OPEN NOW" badge.
10. **Site Settings CMS**: SEO title, meta descriptions, and OpenGraph social share imagery.
11. **Admin Profile**: Change display name, email, and password.

---

## 🌐 Public Website Routes

- `/` — Homepage (Hero, Story Intro, Featured Menu, Bakery Showcase, Ambience, Signature Items, Gallery Preview, Reservation CTA, Location & Hours)
- `/about` — Our Story, Philosophy, Freshness Standards, Bakery, and Café Experience
- `/menu` — Interactive Menu with live search, dynamic category pills, Veg/Non-Veg filter, sorting, and availability states
- `/gallery` — Categorized photo gallery with full-screen lightbox, arrow key navigation, and photo captions
- `/our-space` — Immersive architectural walkthrough of the real cafe spaces (Carmel View exterior, seating, counters, display cases)
- `/reservations` — Real-time booking form + "Track My Reservation" status lookup tool
- `/contact` — Location directions, interactive Google Map, weekly hours table, and direct inquiry form

---

## 📡 REST API Endpoints

### Authentication
- `POST /api/auth/login` — Authenticate admin & issue JWT
- `GET /api/auth/me` — Verify session and fetch current admin user
- `PUT /api/auth/profile` — Update admin name, email, or password

### Content & CMS
- `GET /api/content/homepage` — Public homepage CMS content
- `PUT /api/content/homepage` — Update homepage content (Protected)
- `GET /api/content/about` — Public about page CMS content
- `PUT /api/content/about` — Update about content (Protected)
- `GET /api/content/our-space` — Public our-space walkthrough content
- `PUT /api/content/our-space` — Update our-space content (Protected)

### Menu & Categories
- `GET /api/menu` — All menu items with category population
- `GET /api/menu/:id` — Specific menu item details
- `POST /api/menu` — Create new menu item (Protected)
- `POST /api/menu/:id/duplicate` — Duplicate item (Protected)
- `PUT /api/menu/:id` — Update menu item (Protected)
- `DELETE /api/menu/:id` — Delete menu item (Protected)
- `GET /api/categories` — All active menu categories
- `POST /api/categories` — Create category (Protected)
- `PUT /api/categories/:id` — Update category (Protected)
- `DELETE /api/categories/:id` — Delete category with orphan check (Protected)

### Gallery & Media
- `GET /api/gallery` — All gallery photos
- `POST /api/gallery` — Add gallery photo (Protected)
- `PUT /api/gallery/:id` — Update photo metadata (Protected)
- `DELETE /api/gallery/:id` — Delete photo (Protected)
- `POST /api/uploads/single` — Upload single image (Protected)
- `POST /api/uploads/multiple` — Upload multiple images (Protected)

### Reservations
- `POST /api/reservations` — Public booking request submission (generates Reference ID)
- `GET /api/reservations/lookup/:query` — Public booking status tracker by Ref ID or Phone
- `GET /api/reservations/dashboard-stats` — Admin dashboard KPI stats (Protected)
- `GET /api/reservations` — Filtered reservations list (Protected)
- `PATCH /api/reservations/:id/status` — Update booking status & notes (Protected)
- `DELETE /api/reservations/:id` — Remove reservation record (Protected)

### Settings & Operations
- `GET /api/settings/bootstrap` — Aggregated public site settings, hours, and live open status
- `GET /api/settings/hours` — Weekly opening schedule
- `PUT /api/settings/hours` — Update schedule (Protected)
- `GET /api/settings/contact` — Contact information
- `PUT /api/settings/contact` — Update contact information (Protected)
- `GET /api/settings/site` — SEO & Site metadata
- `PUT /api/settings/site` — Update metadata (Protected)

---

## ☁️ Deployment Guidelines

### 1. MongoDB Atlas
1. Create a free cluster on [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).
2. Create a database user and allow your server IP (or `0.0.0.0/0`).
3. Copy your connection string into `backend/.env`:
   ```env
   MONGODB_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/village_cafe?retryWrites=true&w=majority
   ```

### 2. Cloudinary (Optional Persistent Image Storage)
1. Sign up on [Cloudinary](https://cloudinary.com/).
2. Add your credentials in `backend/.env`:
   ```env
   CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret
   ```

### 3. Deploy Backend (Render / Railway / Heroku)
- Root Directory: `backend`
- Build Command: `npm install`
- Start Command: `node src/server.js`
- Set Environment Variables: `PORT`, `MONGODB_URI`, `JWT_SECRET`, `ADMIN_EMAIL`, `ADMIN_PASSWORD`, `CORS_ORIGIN`.

### 4. Deploy Frontend (Vercel / Netlify)
- Root Directory: `frontend`
- Build Command: `npm run build`
- Output Directory: `dist`
- Proxy / API Rewrite: Set `/api/:path*` to forward to your deployed backend URL.

---

## 📍 Village Cafe Curtorim, Goa
*Carmel View, Curtorim, Goa 403701, India*
- Freshly Baked Everyday
- Handcrafted Coffees & Shakes
- Authentic Savoury Puffs & Treats
