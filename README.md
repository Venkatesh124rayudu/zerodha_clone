# Zerodha Clone — Multi-Application Trading Platform

A full-stack clone of the Zerodha trading platform, built as three separate applications:

| App | Folder | Port | What it does |
|---|---|---|---|
| Landing site | `front-end/` | 5173 | Public marketing pages, sign up and log in |
| Trading dashboard | `dashboard/` | 5174 | Authenticated dashboard: watchlist, orders, holdings, positions, charts |
| REST API | `backend/` | 8080 | Express + MongoDB API with JWT authentication and role-based access |

## Features

- **JWT authentication** — sign up / log in with bcrypt-hashed passwords; the token is stored in an
  httpOnly cookie shared by the landing site and the dashboard.
- **Role-based access control** — `user` and `admin` roles. API routes are protected with
  `requireAuth` and `requireRole("admin")` middleware; admins get an extra Admin page listing every
  user's orders and all registered users.
- **Per-user orders** — each order is linked to the user who placed it; users only see their own.
- **Global state with React Context API** — `AuthContext` holds the logged-in user and role across the
  dashboard; `GeneralContext` controls the buy-order window.
- **Portfolio analytics** — Chart.js bar and doughnut charts for holdings and the watchlist.
- **REST API** — Express.js with Mongoose models for holdings, positions, orders and users.

## Tech stack

React (Vite), React Router, Context API, Material-UI, Chart.js, Axios · Node.js, Express.js,
MongoDB (Mongoose), JWT, bcrypt, cookie-parser

## Running locally

Requires Node.js 20+ and a MongoDB database (local or MongoDB Atlas).

```bash
# 1. API
cd backend
cp .env.example .env      # then fill in MONGO_DB_URL and JWT_SECRET
npm install
npm run server

# 2. Landing site (new terminal)
cd front-end
npm install
npm run dev               # http://localhost:5173

# 3. Dashboard (new terminal)
cd dashboard
npm install
npm run dev               # http://localhost:5174
```

Open http://localhost:5173, sign up, and you are taken to the dashboard.
To get an admin account, add your email to `ADMIN_EMAILS` in `backend/.env` **before** signing up.

## API

| Method | Route | Access |
|---|---|---|
| POST | `/auth/signup`, `/auth/login`, `/auth/logout` | Public |
| GET | `/auth/me` | Logged in |
| GET | `/allHoldings`, `/allPositions` | Logged in |
| POST | `/newOrder` | Logged in |
| GET | `/Orders` | Logged in (own orders) |
| GET | `/admin/orders`, `/admin/users` | Admin only |
