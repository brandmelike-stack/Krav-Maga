# 360 Degree Secure — PRD

## Original Problem Statement
Bold, tactical marketing website for 360 Degree Secure — a professional safety, self-defense, Krav Maga, and law enforcement training brand founded by Anjan Gogoi. Lead-capture focused (enquiries + free trial requests) with a protected admin dashboard to manage workshops, enquiries, gallery, and content without a developer.

## User Choices (this build)
- Scope: Full public website + working enquiry forms + admin dashboard
- Auth: JWT email/password (Bearer token in localStorage — platform ingress forces ACAO:* which breaks cookie CORS)
- Accent: Amber/tactical gold (#FFC107); brand logo adds red/black
- Assets: Real logo + 6 real training photos provided by user and integrated
- Email/SMS (Resend/Twilio): intentionally deferred

## Architecture
- Frontend: React 19 + Tailwind + framer-motion + lenis (smooth scroll) + react-fast-marquee, React Router. Design: dark tactical (#0A0A0A), Bebas Neue headings + Inter body, grain overlay, tactical grid, sharp edges, crosshair hover marks.
- Backend: FastAPI, all routes under /api. JWT (PyJWT) + bcrypt. Admin + content + workshops + gallery seeded on startup.
- DB: MongoDB collections: users, enquiries, workshops, gallery, content_blocks.
- Auth: POST /api/auth/login returns {user, token}; axios interceptor sends Authorization: Bearer. get_current_user supports Bearer + cookie.

## User Personas
- Individuals seeking self-defense (men, women, teens, students)
- Corporates (workplace/travel/executive safety)
- Law enforcement / military / security agencies
- Educational institutions

## Implemented (2026-08-11)
- Public pages: Home (kinetic masked hero over real training photo, marquee, specializations bento grid, upcoming workshops from API, numbered manifesto, CTA band), About, Krav Maga (curriculum, batch timings, free-trial form), Workshops (corporate/combat tabs + form), Law Enforcement (capabilities, stats parallax, institutional form), Founder (Anjan Gogoi with real photo), Gallery (real photos, bento grid), Contact (details + form)
- 4 enquiry types (free_trial, corporate, institutional, general) → POST /api/enquiries (public)
- Admin: JWT login, dashboard with stat counts, enquiries (status new/contacted/converted/closed, CSV export, delete), workshops CRUD + publish toggle, gallery add/delete (URL), content block editor
- Brand: uploaded logo processed into dark-theme version (/logo-dark.png); favicon + meta title/description set
- Testing: backend 22/22 pytest passed; frontend E2E 100% passed

## Backlog / Remaining
- P1: Resend email notifications (admin + auto-reply) and Twilio SMS on new enquiry
- P1: Object storage for gallery uploads (currently URL-based)
- P2: Testimonials showcase (schema-ready), content block wiring into public hero/about/founder (currently static copy)
- P2: SEO polish (sitemap, OG images), analytics
- P3: Workshop booking + payments, batch calendar, multi-language, WhatsApp notifications, brute-force lockout on login

## Next Tasks
- Wire Resend + Twilio when credentials available
- Replace remaining stock imagery with client-provided media as supplied
