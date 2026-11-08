# Doggie Do's Pet Salon — Booking System V1 (Demo)

Dog booking system built for Doggie Do's Pet Salon, Huntsville, AL — family-owned since 2009, dogs only. Next.js (App Router, TypeScript) + MongoDB (Mongoose). Images live in code only, in `public/images/` — no S3, Cloudinary or any external image storage, and no image upload feature.

This is a demo build: the booking engine, slot logic and admin flow are the V1 system, rebranded end to end as Doggie Do's Pet Salon with its real details (address, phone, hours, family-owned since 2009, cage-free daycare, boarding in dog condos, groomers Lara, Diana and owner Bernie) plus demo data where the salon publishes none (fees, extra groomers, demo appointments). Fees shown are examples, not the salon's published prices.

## What is built (V1 scope)

**Dog-parent site:** Home, Services, Groomers (with "Next available"), About, Contact.
**Booking (login required):** pick a date → only groomers available on that date show → pick a groomer → only free slots show (time range + fee) → pick one of 15 dog services → **select your dog's breed** (dropdown of common breeds + free text for "Other") → optional notes → summary check screen with Edit → submit. Slot locks as Pending and the dog parent gets a booking ID (e.g. APT-101). Past dates and Sundays cannot be picked. A Call Salon button is always visible.
**My Bookings:** check status by booking ID / phone — Pending / Confirmed / Rejected / Completed / No-Show — with the dog's breed shown.
**Admin panel (`/admin`, admin login only):** Dashboard with today counts + red pending badge, filters (Today / Pending / Confirmed / All), search by name / phone / booking ID; Groomers CRUD; Availability per groomer per date (day off, leave date range, block a single slot); Appointments grouped by groomer, each showing the dog's breed; Confirm / Reject, then Send Msg to Client (enabled only after Confirm/Reject) which opens WhatsApp (`wa.me`) with the full message — groomer, date, time range, slot no., booking ID, service, breed, fee, "please arrive 10 mins early", salon address + Google Maps link — plus a Copy button; Mark Completed / No-Show; Dog Parents search by phone with past visits; Salon Settings.
**Admin alert:** every new booking creates a Notification record, shown on the admin dashboard and logged to the server console. No real WhatsApp API is integrated in V1.
**15 dog services:** Full Groom, Bath & Blow Dry, Haircut & Styling, Nail Trim (gentle Dremel grinding), De-shedding Treatment, Puppy's First Groom, Spa Bath, Breed Cut, Puppy Bath, Senior Dog Groom, Ear Cleaning, Teeth Cleaning, Paw Care, Cage-Free Daycare, Boarding (Dog Condos). Dogs only — no cat services anywhere.

## Slot logic

- One slot = one appointment per groomer. Enforced in the booking API (re-check before insert) **and** by a partial unique MongoDB index on `{doctorId, date, slotStart}` for statuses Pending / Confirmed / Completed. A Rejected booking frees the slot instantly.
- **Pending lock:** submitting a booking locks the slot as Pending and hides it from everyone else. A Pending booking holds its slot for 12 hours (`PENDING_HOLD_HOURS` in `lib/slots.ts`, `pendingExpiresAt` on the appointment); after that it is treated as expired and the slot is free again. If a dog parent abandons the form before submitting, no lock is created.
- **Availability filtering:** a groomer shows on the booking page for a date only if they are active, that weekday is in their `workingDays`, no `AvailabilityOverride` marks them off that date, and at least one slot is free (not blocked, not taken, not in the past).

## Tech decisions

- Dog grooming salon, not a clinic. Salon name is **Doggie Do's Pet Salon** everywhere.
- Next.js App Router + TypeScript, Tailwind CSS.
- MongoDB with Mongoose. Models in `models/`: User, Doctor (groomers — model name kept from the shared codebase), AvailabilityOverride, Appointment, Notification, ClinicSettings.
- Images in `public/images/` only — all real dog photos.
- Booking requires login (dog-parent signup/login). Admin has a separate login. Auth is bcryptjs + JWT in an httpOnly cookie; `middleware.ts` redirects unauthenticated users from `/book`, `/my-bookings`, `/admin` to `/login`, and API routes re-check the JWT and role.

## Setup

```bash
cd doggie-dos-pet-salon
cp .env.example .env.local   # set MONGODB_URI and JWT_SECRET
npm install
npm run seed                 # seeds Doggie Do's Pet Salon, 10 groomers, demo users, 3 demo appointments
npm run dev                  # http://localhost:3000
npm run build                # production build check
npm start
```

You need a running MongoDB. Local: `mongodb://localhost:27017/doggie-dos-pet-salon`. Or use MongoDB Atlas and paste its connection string as `MONGODB_URI`.

## Demo logins (seed defaults — change via env when seeding)

- **Admin:** `admin@doggiedos.example` / `Admin123!` (override with `SEED_ADMIN_PASSWORD=<redacted>
- **Dog parent:** `patient@demo.example` / `Patient123!` (override with `SEED_PATIENT_PASSWORD=<redacted>

Do not use these passwords in production. Change `JWT_SECRET` in `.env.local` to a long random string.

## Seed data — how it exercises the slot logic

10 groomers with different specialisations, fees ($25–$60), slot durations (30 / 45 / 60 mins) and working days — e.g. Senior Dog Care works Mon/Wed/Fri only, De-shedding Specialist and Breed Cut & Styling Tue/Thu/Sat only, others Mon–Sat. Sunday is closed for all. Real salon hours: Mon–Thu 7:30 AM–5:30 PM, Fri 7:30 AM–4:00 PM, Sat 9:00 AM–4:00 PM.
- The Senior Dog Care groomer is marked **off tomorrow** and the De-shedding Specialist's **11:00 slot tomorrow is blocked** — book for tomorrow and watch them disappear / lose that slot.
- Seeded appointments: APT-101 Pending (Lara, tomorrow 10:00, Full Groom, Golden Retriever), APT-102 Confirmed (Diana, tomorrow 09:00, Nail Trim, Doodle), APT-103 Completed (Lara, yesterday, Bath & Blow Dry, Golden Retriever). APT-101's slot is locked and hidden from other dog parents.

## Project structure

```
app/                    Pages (Home, Groomers, Services, About, Contact, Login, Signup, Book, My Bookings, Admin)
app/api/                Auth, groomers, availability, appointments, admin stats/dog-parents/settings, services
lib/                    mongodb.ts, auth.ts (JWT), slots.ts (slot generation + availability), whatsapp.ts, constants.ts, reasons.ts, services.ts (service image cards), breeds.ts (dog breed list)
models/                 User, Doctor (groomers), AvailabilityOverride, Appointment, Notification, ClinicSettings
components/             Navbar, AppointmentRow (Confirm/Reject → Send Msg to Client), Button (the ONE button component), Reveal (scroll-reveal)
scripts/seed.ts         Seeds Doggie Do's Pet Salon + 10 groomers + demo users + demo appointments
public/images/          Real dog photos in code only (hero, daycare, 6 service photos, 1 boarding photo, 10 groomer photos)
middleware.ts           Redirects unauthenticated users from /book, /my-bookings, /admin
```

## Going live — what still needs a real setup

- A real `MONGODB_URI` (Atlas or a hosted MongoDB) and a real `JWT_SECRET`.
- Hosting for the Next.js app (e.g. Vercel) + the salon's own domain.
- WhatsApp Business API (e.g. via Meta / Twilio) if the salon wants messages sent automatically without the admin tapping Send. V1 deliberately uses a `wa.me` link instead — free, no approval needed.
- Real salon details in Admin → Settings, and real groomer photos replacing the photos in `public/images/` (same filenames, or update the `photo` field).

## Design

- **Palette (defined once):** LIGHT and premium — warm ivory/cream backgrounds `#fff8ec`, sunny golden-yellow accent `#fbbf24` (from the salon's bright-yellow flyer), rich warm browns for text and small accents (`#92400e`, `#1c1410` for text only), soft peachy warmth. Bright and airy — no dark background sections anywhere. Palette lives in `tailwind.config.js` and CSS variables in `app/globals.css`.
- **One Button component (`components/Button.tsx`):** every button in the app — dog-parent site and admin — renders through it. All buttons are identical: 48px tall on desktop, 52px on mobile, same padding, radius and weight. Variants differ only in colour.
- **Navbar:** logo + Groomers / Services / About / Contact + Login only, plus a hamburger on mobile. Book a Session and Call Salon were removed from the navbar completely — booking lives in the hero and on the booking page, calling lives in the hero card, contact page and footer. The header can no longer overflow a 360px phone.
- **Real dog photos, stored in code:** real royalty-free dog photos in `public/images/` — hero, daycare, 6 service photos, 1 boarding photo and 10 groomer photos — rendered with `next/image`. No external image storage, no hotlinking at runtime.
- **Scroll animations (dog-parent side):** a small `Reveal` component (`components/Reveal.tsx`, IntersectionObserver) fades sections up on scroll with staggered cards, 150–300ms, respecting `prefers-reduced-motion`. Subtle only — no bouncing, no heavy parallax.
- **Services section:** image cards — photo on top, fee badge, title, description, duration, service chips and a Book button — not a plain white box with text.
- **Home:** hero with a real photo (image left on desktop, on top on mobile, text right / below), trust stats that fit on mobile (`grid-cols-3`, truncated values), trust strip, How booking works, services preview, groomers preview with real photos, why-choose-us with a daycare photo, praise-words section (the words Huntsville dog parents use — kind, gentle, patient — no invented quotes), and a deep-brown CTA band.
- **Responsive, mobile-first:** designed for 360px first. Headlines wrap (`text-4xl sm:text-5xl xl:text-6xl`, `leading-tight`, `break-words`) and never truncate. `overflow-x: clip` on html/body, chip rows scroll internally only. Tap targets min 44px. Desktop uses a `max-w-7xl` container so content fills 1280px/1440px properly.
- **Admin panel, same standard:** same palette, typography and Button component — sidebar on tablet/desktop, horizontal-scroll nav on mobile, stat cards, appointment cards with the same buttons. Not a plain table. Every admin page has the same designed header (eyebrow + title + subtitle), loading skeletons and designed empty states.

## NOT in V1 (deliberately)

No payments, no automatic reminders, no waitlist, no dog-parent self-service reschedule/cancel (viewing status only), no groomer login, no video consultation, no reports/Excel export.
