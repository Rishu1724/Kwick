# Kwick (SportRent / Sports Equipment Rental Platform) — Project Overview

## 1) Idea (What this project is)
Kwick is a MERN-stack web application for renting sports equipment (badminton, cricket, tennis, football, gym/cycling gear, etc.).

The platform connects **Equipment Owners** who list rentable gear with **Renters** who browse, favorite, message owners, and create bookings. It includes booking management, basic payment workflow scaffolding, reviews/ratings, reporting/moderation, and role-based dashboards.

> Note on naming/history: Several documents and some code paths still use "OLX Clone" / "classified ads" naming (e.g., `/api/products`), but the active implementation primarily revolves around **equipment rental** (`/api/equipment`, `/api/bookings`, `/api/payments`).

---

## 2) Core user roles
- **Renter**: browse equipment, book rentals, chat, wishlist/favorites, profile.
- **Owner**: list and manage equipment, view booking requests, analytics/earnings view, chat.
- **Both**: has access to both renter + owner areas.
- **Admin**: report moderation (admin role checks exist in backend and frontend).

---

## 3) Key features (implemented in code)
### Authentication & profile
- JWT-based login/register
- Role stored on user (`renter`, `owner`, `both`)
- Profile fetch/update (`/api/auth/me`, `/api/users/profile`)
- Avatar upload to Cloudinary

### Equipment listings
- Equipment CRUD
- Search/filter/sort/pagination via query params on `/api/equipment`
- Equipment by category
- Featured equipment (`/api/equipment/featured`)
- Owner-specific inventory (`/api/equipment/my`)
- Images upload via Cloudinary using Multer memory storage

### Booking system
- Create booking with start/end date, booking type, delivery option details
- Overlap checking for booking dates
- Booking lifecycle: `pending → confirmed → active → returned/cancelled`
- Extend booking, cancel booking, return equipment

### Payments (scaffolded)
- Create payment intent (creates a `Payment` record + sets booking to `confirmed`)
- Confirm payment (marks payment completed + booking active)
- Refund flow (updates payment to `refunded`)
- Webhook endpoint stub

### Chat / messaging
- Conversations list derived from messages
- Conversation messages
- Read/unread support

### Reviews and reports
- Reviews on equipment and seller
- Reports with admin-only moderation actions

---

## 4) Tech stack
### Backend
- Node.js + Express
- MongoDB + Mongoose
- JWT auth (`Authorization: Bearer <token>`)
- Multer memory uploads + Cloudinary
- express-async-handler
- Stripe/PayPal/Razorpay packages included (payments are currently simulated in controllers)

### Frontend
- React 18
- React Router
- Axios
- Context API for auth
- CSS modules/files (mixed styles; some Tailwind-like utility usage appears in `Home.jsx`)

---

## 5) Repository layout
```
Kwick/
  backend/
    config/
    controllers/
    middlewares/
    models/
    routes/
    services/
    utils/
    server.js
    package.json
  frontend/
    src/
      components/
      context/
      pages/
      services/
      utils/
    index.html
    vite.config.js
    package.json
  package.json (root)
```

---

## 6) How the app runs (local development)
### Prerequisites
- Node.js (v14+)
- MongoDB (local or Atlas)

### Install dependencies
From repo root:
```bash
npm run install:all
```

Or manually:
```bash
cd backend && npm install
cd ../frontend && npm install
```

### Environment variables
Create these files:

**backend/.env** (example)
```env
NODE_ENV=development
PORT=5007
MONGO_URI=mongodb://localhost:27017/kwick
JWT_SECRET=your_jwt_secret
JWT_EXPIRE=30d

# Cloudinary
CLOUDINARY_CLOUD_NAME=...
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...

# Email (optional)
EMAIL_HOST=...
EMAIL_PORT=...
EMAIL_USER=...
EMAIL_PASS=...
EMAIL_FROM=...

# Frontend origin (optional)
FRONTEND_URL=http://localhost:5174
```

**frontend/.env** (optional)
```env
VITE_API_URL=http://localhost:5007
```

### Start dev servers
From repo root:
```bash
npm run dev
```

This runs:
- backend: `npm run dev` inside `backend/`
- frontend: `npm run dev` inside `frontend/`

Typical URLs:
- Frontend: `http://localhost:5173` or `http://localhost:5174` (Vite may bump port)
- Backend API: `http://localhost:5007`

---

## 7) Backend API (routes as implemented)
Base path: `/api`

### Auth
- `POST /api/auth/register` (supports avatar upload: `multipart/form-data`, field name `avatar`)
- `POST /api/auth/login`
- `GET /api/auth/me` (protected)

### Users
- `GET /api/users/profile` (protected)
- `PUT /api/users/profile` (protected, supports avatar upload)

### Equipment
- `GET /api/equipment` (public; supports filters, sort, pagination)
- `POST /api/equipment` (protected; supports images upload)
- `GET /api/equipment/my` (protected)
- `GET /api/equipment/featured` (public)
- `GET /api/equipment/:id` (public)
- `PUT /api/equipment/:id` (protected)
- `DELETE /api/equipment/:id` (protected)
- `GET /api/equipment/:id/availability` (public)
- `POST /api/equipment/:id/images` (protected)
- `GET /api/equipment/category/:category` (public)

### Favorites
- `POST /api/favorites` (protected)
- `GET /api/favorites` (protected)
- `DELETE /api/favorites/:productId` (protected)

### Chats
All protected (router uses `protect`):
- `POST /api/chats`
- `GET /api/chats/conversations`
- `GET /api/chats/:conversationId`
- `PUT /api/chats/:messageId/read`

### Reviews
- `GET /api/reviews/equipment/:productId` (public)
- `GET /api/reviews/seller/:sellerId` (public)
- `POST /api/reviews` (protected)
- `PUT /api/reviews/:id` (protected)
- `DELETE /api/reviews/:id` (protected)

### Reports
All protected (admin checks happen in controller):
- `POST /api/reports`
- `GET /api/reports` (admin-only)
- `PUT /api/reports/:id` (admin-only)
- `DELETE /api/reports/:id` (admin-only)

### Bookings
All protected:
- `POST /api/bookings`
- `GET /api/bookings` (supports query `?role=owner` or renter default)
- `GET /api/bookings/:id`
- `PUT /api/bookings/:id`
- `POST /api/bookings/:id/cancel`
- `POST /api/bookings/:id/extend`
- `POST /api/bookings/:id/return`

### Payments
- `POST /api/payments/create-intent` (protected)
- `POST /api/payments/confirm` (protected)
- `GET /api/payments/history` (protected)
- `GET /api/payments/:id` (protected)
- `POST /api/payments/:id/refund` (protected)
- `POST /api/payments/webhook` (public stub)

---

## 8) Frontend navigation (routes)
- `/` Home
- `/login`, `/register`
- `/equipment` list
- `/equipment/:id` detail
- `/category/:category`
- `/search`
- `/renter/dashboard` (protected)
- `/owner/dashboard` (protected)
- `/admin`, `/admin/reports` (protected; additional admin gating in page)

---

## 9) Notes / known inconsistencies to be aware of
These don’t prevent understanding the project idea, but they matter if you’re polishing it:
- Some leftover “classified ads / products” code exists alongside “equipment” flows (example: frontend search uses `/api/products`, but backend does not currently register `/api/products` routes in `backend/server.js`).
- `Favorite` model references `Product` while favorites controller treats IDs as equipment.
- Several UI labels still say Kwick/OLX/SportRent/RentSport interchangeably.

---

## 10) Project status (practical)
- The project is runnable as a full-stack app with authentication, equipment browsing, chat, bookings, and payment scaffolding.
- Payments are currently simulated at controller level (gateway SDKs are installed but not fully wired).

---

## 11) Suggested next documentation additions (optional)
If you want this doc to become “official”, good follow-ups are:
- A single definitive naming decision (Kwick vs SportRent vs RentSport)
- A clear decision on whether `/api/products` is removed or reintroduced
- A single canonical `.env.example` for backend + frontend
