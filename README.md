# Emrays Trade Operations Platform — Frontend

> Next.js 16 frontend for the Emrays Vector Hub Platform.  
> Handles authentication UI, dashboard layout, and the customer inquiry form.

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [Tech Stack](#2-tech-stack)
3. [Project Structure](#3-project-structure)
4. [File-by-File Documentation](#4-file-by-file-documentation)
5. [Authentication & Session Flow](#5-authentication--session-flow)
6. [State Management](#6-state-management)
7. [API Communication Layer](#7-api-communication-layer)
8. [Routing Architecture](#8-routing-architecture)
9. [UI Design System](#9-ui-design-system)
10. [Setup & Running Locally](#10-setup--running-locally)
11. [Environment Variables](#11-environment-variables)
12. [Next Steps for Developers](#12-next-steps-for-developers)

---

## 1. Project Overview

This is the **Next.js 16 (App Router)** frontend for the Emrays Trade Operations Platform. It communicates exclusively with the Django REST API backend via cookie-based JWT authentication.

**What it currently does:**
- Full **login and signup** flow with password strength validation and eye-toggle
- **Session persistence** across page refreshes via `/api/auth/me` cookie check
- **Protected dashboard routes** — unauthenticated users are redirected to login
- **Customer Inquiry Form** — fully functional form that saves customer + inquiry data to the backend database with optional file attachments
- **Dashboard layout** — collapsible sidebar, sticky header with notifications + profile menu, and a spinner-based loading state during session validation
- **Role-aware UI** — user's role is displayed in the header (admin / manager / sales)

---

## 2. Tech Stack

| Technology | Version | Purpose |
|---|---|---|
| Next.js | 16.1.6 (Turbopack) | React framework with App Router |
| React | 19.2.3 | UI library |
| TypeScript | 5.x | Type safety |
| Tailwind CSS | 4.x | Utility-first CSS |
| Zustand | 5.x | Lightweight client state management |
| Framer Motion | 12.x | Animations and transitions |
| Lucide React | 0.575 | Icon library |
| Recharts | 3.x | Chart library (dashboard) |
| clsx + tailwind-merge | Latest | Conditional class merging utility |

---

## 3. Project Structure

```
frontend/
├── src/
│   ├── app/                        # Next.js App Router (all pages live here)
│   │   ├── layout.tsx              # Root layout — font loading, global CSS, hydration
│   │   ├── page.tsx                # Root route — redirects to /login
│   │   ├── globals.css             # Global Tailwind and CSS resets
│   │   │
│   │   ├── login/
│   │   │   └── page.tsx            # Login page (email OR username + eye toggle)
│   │   │
│   │   ├── signup/
│   │   │   └── page.tsx            # Signup page (username, name, email, password)
│   │   │
│   │   └── (dashboard)/            # Route group — all protected dashboard pages
│   │       ├── layout.tsx          # Dashboard layout: auth guard, sidebar, header
│   │       ├── dashboard/page.tsx  # Dashboard overview — stats and charts
│   │       ├── customer-inquiry/page.tsx  # Customer inquiry form (fully functional)
│   │       ├── inquiries/page.tsx  # Inquiry list (placeholder)
│   │       ├── users/page.tsx      # User management (placeholder)
│   │       ├── quotations/page.tsx # Quotation management (placeholder)
│   │       ├── orders/page.tsx     # Order tracking (placeholder)
│   │       ├── inventory/page.tsx  # Inventory (placeholder)
│   │       ├── indent-tracking/page.tsx  # Indent tracking (placeholder)
│   │       ├── reporting/page.tsx  # Reports (placeholder)
│   │       ├── notifications/page.tsx    # Notifications (placeholder)
│   │       ├── documents/page.tsx  # Documents (placeholder)
│   │       ├── settings/page.tsx   # Settings (placeholder)
│   │       └── help/page.tsx       # Help desk (placeholder)
│   │
│   ├── components/                 # Shared, reusable UI components
│   │   ├── Sidebar.tsx             # Collapsible navigation sidebar
│   │   ├── Header.tsx              # Top bar with search, notifications, profile menu
│   │   ├── StatCard.tsx            # Stats card widget for dashboard
│   │   └── DashboardCharts.tsx     # Recharts line + pie chart components
│   │
│   ├── lib/
│   │   ├── api.ts                  # Shared fetch wrapper (credentials, base URL)
│   │   └── utils.ts                # `cn()` helper (clsx + tailwind-merge)
│   │
│   └── store/
│       └── useStore.ts             # Zustand stores: useAuthStore + useUIStore
│
├── .env.local                      # Local environment variables (not committed)
├── .gitignore                      # Ignores node_modules, .next, .env files
├── next.config.ts                  # Next.js config (remote image patterns)
├── tsconfig.json                   # TypeScript config with @/ path alias
├── package.json                    # Dependencies and scripts
└── README.md                       # This file
```

---

## 4. File-by-File Documentation

### `src/app/layout.tsx` — Root Layout
**What it does:**
- Wraps every page in the `Outfit` Google Font from `next/font/google`.
- Sets the default page `<title>` and `<meta description>` for SEO.
- `suppressHydrationWarning` on `<body>` — prevents false React hydration errors caused by browser extensions (Grammarly, etc.) injecting attributes into the body tag.

---

### `src/app/page.tsx` — Root Route
Simply redirects the user to `/login`. No UI rendered.

---

### `src/app/login/page.tsx` — Login Page
**What it does:**
- Presents a login form accepting either an **email address or a username** in one field.
- Password field has a **show/hide eye toggle** (Eye / EyeOff from Lucide).
- On submit, calls `POST /api/auth/login/` via `apiFetch`.
- On success: stores user info in `useAuthStore`, navigates to `/dashboard`.
- On failure: displays a specific error message from the backend (`"No account found"`, `"Incorrect password"`, etc.).
- `isLoading` state disables the button and shows `"Signing in…"` during the request.
- Uses `framer-motion` for a subtle scale-in card animation.

**Key decisions:**
- The field is named `identifier` in local state but sent as `username` in the POST body — this matches the backend's expected field name in `LoginView`.

---

### `src/app/signup/page.tsx` — Signup Page
**What it does:**
- Collects: Username, Full Name (optional), Email, Password.
- **Client-side password validation** before hitting the API:
  - Minimum 9 characters
  - Must contain letters
  - Must contain at least one number
  - Must contain a special character (`@$!%*?&`)
- Password field has a **show/hide eye toggle**.
- On submit, calls `POST /api/auth/register/` via `apiFetch`.
- On success: shows a green "Account created!" banner, then redirects to `/login` after 1.5 seconds.
- On failure: parses field-level DRF errors and displays them (e.g., `"username: A user with that username already exists."`).

---

### `src/app/(dashboard)/layout.tsx` — Dashboard Layout (Protected)
**What it does:**
- Acts as the **authentication guard** for all dashboard routes.
- On mount, checks `isAuthenticated` from Zustand:
  - If `true` → renders immediately (user just logged in).
  - If `false` → calls `GET /api/auth/me/` to re-validate the session from the **HttpOnly cookie**.
    - ✅ Valid cookie → calls `login()` to restore Zustand state, renders the dashboard.
    - ❌ No cookie / expired → calls `logout()`, redirects to `/login`.
- Shows a **loading spinner** while the `/me` check is in-flight (prevents a flash of redirect).
- Renders the full dashboard shell: `<Sidebar>` + `<Header>` + `<main>{children}</main>`.
- Responds to `sidebarOpen` state from `useUIStore` to shift the `<main>` content with `ml-56` / `ml-14`.

**Why this matters:** Since `useAuthStore` is in-memory only (no localStorage), the session would be lost on every page refresh without this cookie check.

---

### `src/app/(dashboard)/customer-inquiry/page.tsx` — Customer Inquiry Form
**What it does:**
The most complex page — a fully functional data-entry form that saves to the database.

**Form Sections:**
1. **Contact Info** — Customer name (required), email (required), phone, company, lead source.
2. **Product Info** — Product name, quantity, trade terms (FOB/CIF/EXW), inquiry date, destination.
3. **Supporting Documents** — File attachment with client-side validation (max 5MB, allowed types: PDF/JPG/PNG/WebP/DOC/DOCX).
4. **Inquiry Details** — Type (product/service), status, priority (low/medium/high).
5. **Follow-up** — Next follow-up date + notes.
6. **Notes / Comments** — Free text fields for sales rep remarks.

**Submit Logic (Two-step API call):**
```
Step 1: POST /api/customers/ → Create/register the customer
         ↓ (gets customer.id)
Step 2: POST /api/inquiries/ → Create the inquiry linked to the customer
         (FormData for file upload support, not JSON)
```

**Key details:**
- All inputs are **controlled** (React state via a single `form` state object).
- A helper `set(field)` function returns an `onChange` handler for each field — avoids boilerplate.
- File upload uses `fetch` directly (not `apiFetch`) because `apiFetch` sets `Content-Type: application/json` which would break multipart boundaries.
- The **Clear** button resets the entire form and removes the selected file.
- Success banner auto-disappears after 4 seconds.

---

### `src/components/Sidebar.tsx` — Navigation Sidebar
**What it does:**
- Fixed left sidebar with all 13 navigation links.
- Controlled by `sidebarOpen` from `useUIStore` — toggles between `w-56` (expanded) and `w-14` (icon-only mode).
- Uses `usePathname()` to apply active styles to the current route.
- **Logout button** at the bottom:
  - Calls `POST /api/auth/logout/` (deletes HttpOnly cookies server-side).
  - Calls `logout()` on `useAuthStore` (clears client state).
  - `router.push('/login')` — clean navigation.

**Nav items defined:**
Dashboard, User Management, Inquiries, Customer Inquiry, Quotations, Indent Tracking, Orders, Inventory, Reporting, Notifications, Documents, Help Desk, Settings.

---

### `src/components/Header.tsx` — Top Bar
**What it does:**
- Global search input (UI only — not yet wired to an API).
- **Notification bell** — shows 3 hardcoded sample notifications in a dropdown. The count badge shows "3". Clicking outside closes it.
- **Profile menu** — shows user name + role from `useAuthStore`.
  - Displays avatar from `avatar.iran.liara.run` (external image service, configured in `next.config.ts`).
  - Dropdown: My Profile, Account Settings, Help Center, Log Out.
  - Log Out calls `POST /api/auth/logout/` + clears state + redirects.
- Uses `AnimatePresence` + `framer-motion` for dropdown enter/exit animations.
- Click-outside detection via `useRef` + `mousedown` event listener.

---

### `src/components/StatCard.tsx` — Dashboard Stat Card
A reusable widget that displays a metric with: icon, title, value, percentage trend (up/down), and optional color themes.

---

### `src/components/DashboardCharts.tsx` — Charts
Recharts-based chart components for the dashboard overview:
- **Line chart** — Monthly revenue or inquiry trend.
- **Pie chart** — Inquiry status breakdown.
All data is currently static/mock. Connect to real API data as database grows.

---

### `src/lib/api.ts` — API Fetch Wrapper
```typescript
apiFetch<T>(endpoint, options) → Promise<{ data: T | null; ok: boolean; status: number }>
```
A centralized fetch helper that:
- Prepends `NEXT_PUBLIC_API_URL` (from `.env.local`) to every endpoint.
- Always includes `credentials: 'include'` so HttpOnly cookies are sent with every request.
- Always sets `Content-Type: application/json` (can be overridden for file uploads).
- Catches network errors (server down) and returns `{ ok: false, status: 0 }` instead of throwing.

**Every page should use `apiFetch` for all API calls** (except multipart file uploads, which must use raw `fetch` with `FormData`).

---

### `src/lib/utils.ts` — Class Name Utility
```typescript
cn(...classes) → string
```
Combines `clsx` (conditional classes) with `tailwind-merge` (deduplicates conflicting Tailwind classes). Used everywhere in components.

---

### `src/store/useStore.ts` — Zustand State Stores

#### `useAuthStore`
```typescript
{ user, isAuthenticated, login(user), logout() }
```
- Stores the logged-in user's `{ id, name, email, role }`.
- **Intentionally NOT persisted to localStorage** — JWT tokens must never be stored in `localStorage` (XSS risk).
- On page refresh, the state is empty → `layout.tsx` restores it via the `/me` cookie check.

#### `useUIStore`
```typescript
{ sidebarOpen, toggleSidebar(), setSidebarOpen(bool) }
```
- Controls the sidebar collapsed/expanded state.
- Shared between `Sidebar.tsx` and `layout.tsx`.

---

## 5. Authentication & Session Flow

```
[User visits /dashboard]
        ↓
[layout.tsx] checks isAuthenticated (Zustand)
        ↓
  ┌─── true ──→ Render dashboard (just logged in)
  │
  └─── false ─→ GET /api/auth/me/ (sends HttpOnly cookie automatically)
                    ↓
            ┌─── 200 OK ──→ login(user) in Zustand → render dashboard
            └─── 401 ─────→ logout() → router.push('/login')

[User clicks Logout]
        ↓
POST /api/auth/logout/ → backend deletes cookies
        ↓
logout() in Zustand → cleared
        ↓
router.push('/login')
```

---

## 6. State Management

Zustand is used (not Redux, not Context API) because:
- It has a tiny bundle size.
- No boilerplate — define store as a function, use it as a hook.
- Easy to call outside React components (e.g., in route handlers).

No state is persisted to `localStorage` or `sessionStorage` to maintain security compliance.

---

## 7. API Communication Layer

All API calls go through `apiFetch` in `src/lib/api.ts`.

**Pattern used across pages:**
```typescript
const { data, ok, status } = await apiFetch<ResponseType>('/api/endpoint/', {
  method: 'POST',
  body: JSON.stringify(payload),
});

if (ok && data) {
  // success
} else if (status === 0) {
  setError('Server unreachable');
} else {
  setError(data?.error || 'Something went wrong');
}
```

**For file uploads** (multipart), use raw `fetch` with `FormData`:
```typescript
const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/inquiries/`, {
  method: 'POST',
  credentials: 'include',
  body: formData, // browser sets Content-Type with boundary automatically
});
```

---

## 8. Routing Architecture

Next.js App Router is used. Routes map directly to folder structure:

| URL | File |
|---|---|
| `/` | `src/app/page.tsx` → redirects to `/login` |
| `/login` | `src/app/login/page.tsx` |
| `/signup` | `src/app/signup/page.tsx` |
| `/dashboard` | `src/app/(dashboard)/dashboard/page.tsx` |
| `/customer-inquiry` | `src/app/(dashboard)/customer-inquiry/page.tsx` |
| `/inquiries` | `src/app/(dashboard)/inquiries/page.tsx` |
| `/users` | `src/app/(dashboard)/users/page.tsx` |

The `(dashboard)` folder is a **Route Group** — the parentheses mean it doesn't appear in the URL. It applies `src/app/(dashboard)/layout.tsx` to all pages inside it.

---

## 9. UI Design System

The app uses a consistent color palette defined in Tailwind classes:

| Token | Value | Used for |
|---|---|---|
| Primary | `#00A8BC` | Buttons, active states, accents |
| Primary Light | `#E6F7F9` | Sidebar background, page backgrounds |
| Primary Border | `#D1EEF2` | Sidebar borders |
| Dark Text | `#1A3B3E` | Headings, primary text |
| Secondary Text | `#5F7E82` | Labels, secondary info |
| Danger | `#F25C54` | Logout, error states |
| Warning | `#F2994A` | Notification badge |

**Typography:** `Outfit` (Google Font), loaded via `next/font/google` for zero layout shift.

**Animations:** Framer Motion is used for:
- Page card entrance (scale + opacity)
- Dropdown menus (y + scale + opacity)
- Error/success banners (y + opacity)

---

## 10. Setup & Running Locally

### Prerequisites
- Node.js 18+
- npm or yarn
- Backend API running at `http://localhost:8000`

### Steps

```bash
# 1. Clone the repo
git clone <frontend-repo-url>
cd frontend

# 2. Install dependencies
npm install

# 3. Create environment file
cp .env.local.example .env.local   # or create manually (see below)

# 4. Start development server
npm run dev
# App is now available at: http://localhost:3000
```

### If you get "Unable to acquire lock" error:
This means another `next dev` process is still running. Fix it with:
```powershell
# Windows
Get-Process node | Stop-Process -Force
Remove-Item -Recurse -Force .next
npm run dev
```

```bash
# Mac/Linux
pkill node
rm -rf .next
npm run dev
```

---

## 11. Environment Variables

Create `.env.local` in the `frontend/` root:

```env
# URL of the backend Django API server
NEXT_PUBLIC_API_URL=http://localhost:8000
```

> ⚠️ **Never commit `.env.local` to git.** It is listed in `.gitignore`.
>
> In production, change this to your deployed API URL (e.g., `https://api.emrays.com`).

---

## 12. Next Steps for Developers

### Pages to Implement (Placeholders Exist)
- [ ] `/inquiries` — List and search all submitted inquiries (fetch from `GET /api/inquiries/`)
- [ ] `/users` — User management for admin role (list, create, deactivate users)
- [ ] `/quotations` — Quotation creation and management
- [ ] `/orders` — Order and shipment tracking
- [ ] `/inventory` — Inventory management
- [ ] `/indent-tracking` — Indent workflow tracking
- [ ] `/reporting` — Analytics and reports
- [ ] `/notifications` — Real notification list from backend
- [ ] `/documents` — Document repository linked to inquiries
- [ ] `/settings` — User profile settings, password change
- [ ] `/reset-password` — Password reset confirmation page (linked from email)

### Features to Build
- [ ] Wire up global search in `Header.tsx` to a real search API
- [ ] Connect `StatCard.tsx` and `DashboardCharts.tsx` to real API data
- [ ] Notification count badge should fetch real unread count from the backend
- [ ] Profile picture upload
- [ ] Role-based sidebar — admin sees all links; sales only sees relevant ones (use `user.role` from `useAuthStore`)
- [ ] Proper 404 page
- [ ] Loading skeleton states instead of blank screens while fetching

### Code Quality
- [ ] Add React Query or SWR for data fetching with built-in caching/refetching
- [ ] Write component tests (Jest + React Testing Library)
- [ ] Add Storybook for component documentation
