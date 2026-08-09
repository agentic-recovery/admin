<div align="center">

# 🛡️ Agentic Recovery — Admin Dashboard

### Internal moderation and analytics panel — approve or block providers and customers, and monitor the platform at a glance.

<img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nextjs/nextjs-original.svg" height="45" alt="Next.js" />
<img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg" height="45" alt="React" />
<img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg" height="45" alt="TypeScript" />
<img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/redux/redux-original.svg" height="45" alt="Redux" />
<img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tailwindcss/tailwindcss-original.svg" height="45" alt="Tailwind CSS" />

<br><br>

![Next.js](https://img.shields.io/badge/Next.js-14-000000?style=for-the-badge&logo=next.js&logoColor=white)
![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Redux Toolkit](https://img.shields.io/badge/Redux_Toolkit-2-764ABC?style=for-the-badge&logo=redux&logoColor=white)
![Recharts](https://img.shields.io/badge/Recharts-2-8884d8?style=for-the-badge)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)

</div>

---

## 📑 Table of Contents

- [Overview](#-overview)
- [Tech Stack](#-tech-stack)
- [Design System](#-design-system)
- [Project Structure](#-project-structure)
- [App Routes](#-app-routes)
- [Getting Started](#-getting-started)
- [Security Note](#-security-note)
- [Part of a Bigger System](#-part-of-a-bigger-system)

---

## 🔎 Overview

The internal control panel for platform operators: review and approve newly registered recovery providers, moderate or block bad actors (providers and customers), and keep an eye on platform-wide stats — all backed by the [`server`](https://github.com/agentic-recovery/server) `/api/admin/*` endpoints.

---

## 🛠 Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 14 (App Router) |
| UI | React 18 + TypeScript |
| State | Redux Toolkit + React Redux |
| Charts | Recharts |
| Styling | Tailwind CSS (light/dark theme via CSS variables) |
| Animation | Framer Motion |
| Icons | Lucide React |

---

## 🎨 Design System

Shares the dashboard suite's design language, with a built-in **light/dark theme toggle** driven by CSS custom properties:

| Token | Dark | Light |
|-------|------|-------|
| Background | `#060610` | `#F0F0FA` |
| Accent — indigo | `#5B5BD6` | `#5B5BD6` |
| Accent — cyan | `#06B6D4` | `#0891B2` |
| Accent — violet | `#8B5CF6` | `#7C3AED` |

**Typography:** Plus Jakarta Sans (display), Outfit (body), IBM Plex Mono (mono/labels).

---

## 📁 Project Structure

```
app/
├── layout.tsx                              # Root layout (noindex/nofollow — kept out of search engines)
├── page.tsx                                 # Entry point
├── globals.css                               # Theme tokens (light/dark), fonts
├── admin-portal-access-xyz/
│   ├── login/page.tsx                          # Admin login
│   └── register/page.tsx                        # Admin registration
└── admin/
    ├── dashboard/page.tsx                         # Stats overview + charts
    ├── providers/
    │   ├── page.tsx                                  # Provider list — approve/reject/block
    │   └── [id]/page.tsx                                # Provider detail view
    └── customers/page.tsx                                # Customer list — block/unblock

components/admin/
├── AdminLayout.tsx        # Sidebar + topbar wrapper for authenticated admin pages
├── ConfirmModal.tsx        # Reusable confirm/deny dialog (used for approve/block/delete actions)
└── Toast.tsx                # Notification toasts

store/
├── index.ts                # Redux store setup
└── Provider.tsx              # Redux <Provider> wrapper for the app
```

---

## 🧭 App Routes

| Route | Description |
|-------|-------------|
| `/admin-portal-access-xyz/login` | Admin sign-in |
| `/admin-portal-access-xyz/register` | Admin registration |
| `/admin/dashboard` | Platform stats overview with charts |
| `/admin/providers` | Provider list — approve, reject, block, unblock, delete |
| `/admin/providers/:id` | Single provider detail & moderation actions |
| `/admin/customers` | Customer list — block, unblock, delete |

---

## ⚙️ Getting Started

```bash
git clone https://github.com/agentic-recovery/admin.git
cd admin
npm install
```

Create a `.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000
```

```bash
npm run dev
```

Open [http://localhost:3002](http://localhost:3002) — this app runs on **port 3002** by default (`next dev -p 3002`) so it can run alongside the other frontends.

```bash
npm run build   # production build
npm start        # serve the production build (also on port 3002)
```

---

## 🔒 Security Note

The admin routes live under `/admin-portal-access-xyz/*` and `/admin/*`, and the layout sets `robots: "noindex, nofollow"` to keep the panel out of search engines. That's obscurity, not access control — the real protection is the `protectAdmin` / `isAdmin` middleware on every `/api/admin/*` endpoint in the backend, which is what actually stops unauthorized access. Worth mentioning if this comes up in an interview: it shows you know the difference between "hidden" and "secured."

---

## 🔗 Part of a Bigger System

This admin panel is one of four frontends built on the shared [`server`](https://github.com/agentic-recovery/server) API:

| Repo | Role |
|------|------|
| [`web`](https://github.com/agentic-recovery/web) | Public marketing landing page |
| [`client`](https://github.com/agentic-recovery/client) | Provider dashboard (jobs, pricing, availability) |
| **`admin`** (this repo) | Internal admin panel (moderation, stats) |
| [`profile`](https://github.com/agentic-recovery/profile) | Public read-only provider profile page |

---

<div align="center">

Built as part of an MSc Computer Science final project.

</div>
