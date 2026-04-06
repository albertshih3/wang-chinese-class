# Wang Teacher Chinese Classroom — Complete Project Plan

> **Stack lock:** Next.js 16 (App Router) · Tailwind CSS · shadcn/ui · Sanity.io · Clerk · next-intl · Resend · Vercel
> **Budget:** ~$20/year (domain only — all services on free tiers)
> **Last updated:** 2026-04-06

---

## 1. Site Architecture

| Route | Page Name | Access | Purpose |
|---|---|---|---|
| `/` | Landing / Home | Public | Hero, teacher intro teaser, CTA to consultation form, active announcement banners |
| `/about` | About the Teacher | Public | Full bio, headshot, teaching philosophy, credentials |
| `/faq` | FAQ | Public | Accordion of common questions for prospective families |
| `/contact` | Consultation Request | Public | Inquiry form (no self-registration); triggers Resend notification to stakeholder |
| `/classes` | Class Schedule | **Authenticated** | Full schedule (Sat/Sun 9 AM–12 PM), Zoom links, Google Classroom link |
| `/[locale]/*` | All of the above | Same as above | next-intl wraps every route; locale prefix (`/zh-TW/`, `/zh-CN/`) added for non-default locales |
| `/sign-in` | Sign In | Public (redirects if authed) | Clerk-hosted or embedded sign-in component |
| `/studio` | Sanity Studio | **Developer only** (not linked in nav) | CMS editing interface; deploy separately or at `/studio` behind Vercel password protection |

**Access summary:**
- **Public visitor:** `/`, `/about`, `/faq`, `/contact`, `/sign-in`
- **Authenticated parent:** all of the above + `/classes`
- `/studio` is never linked in the public nav; access via direct URL by stakeholder only

---

## 2. Component Map

### `/` — Landing / Home
- `AnnouncementBanner` *(custom)* — fetches active banners from Sanity, dismissible
- `HeroSection` *(custom)* — headline, subheadline, CTA button → `/contact`
- `TeacherTeaserCard` *(custom)* — headshot thumbnail + 1-sentence bio + link to `/about`
- `Button` (shadcn) — primary CTA
- `Badge` (shadcn) — grade level tags if displayed in hero

### `/about` — About the Teacher
- `TeacherBio` *(custom)* — full headshot, bio text pulled from Sanity
- `Separator` (shadcn)
- `AspectRatio` (shadcn) — wraps headshot image for consistent sizing

### `/faq` — FAQ
- `Accordion`, `AccordionItem`, `AccordionTrigger`, `AccordionContent` (shadcn) — one item per FAQ entry from Sanity
- `AnnouncementBanner` *(custom)* — shared across public pages

### `/contact` — Consultation Request Form
- `ConsultationForm` *(custom)* — controlled form with validation
- `Input`, `Textarea`, `Label`, `Select` (shadcn) — form fields
- `Button` (shadcn) — submit
- `Alert` (shadcn) — success / error state after submission
- `FormField`, `FormItem`, `FormMessage` (shadcn Form primitives via react-hook-form)

### `/classes` — Class Schedule (authenticated)
- `ProtectedRoute` *(custom wrapper)* — Clerk `auth()` guard; redirects to `/sign-in` if unauthenticated
- `ClassScheduleTable` *(custom)* — static schedule rendered as a table or card list
- `ZoomLinkCard` *(custom)* — displays Zoom link (stored as env var or Sanity field)
- `ExternalLink` + `Button` (shadcn) — Google Classroom link
- `Card`, `CardHeader`, `CardContent` (shadcn) — container for schedule items
- `AnnouncementBanner` *(custom)* — shown to authenticated users too

### Shared / Layout Components
- `SiteHeader` *(custom)* — logo placeholder, nav links, language toggle, Clerk `UserButton`
- `SiteFooter` *(custom)* — minimal: name placeholder, copyright year
- `LanguageToggle` *(custom)* — `Select` or `DropdownMenu` (shadcn) with EN / 繁中 / 简中
- `ClerkUserButton` — Clerk's built-in component, included in header
- `ThemeProvider` — optional dark mode toggle (low priority)

---

## 3. Sanity CMS Schema Designs

### `announcement` — Announcement Banner
| Field Name | Type | Description |
|---|---|---|
| `title` | string | Internal label for the stakeholder (not shown on site) |
| `message` | text | The banner copy displayed to visitors |
| `expiresAt` | datetime | Banner auto-hides after this date/time |
| `isActive` | boolean | Manual on/off toggle; false = hidden even before expiry |
| `severity` | string (enum) | `info` \| `warning` \| `success` — controls banner color |

### `faq` — FAQ Entry
| Field Name | Type | Description |
|---|---|---|
| `question` | string | The question text shown in the accordion trigger |
| `answer` | text (block content) | Rich-text answer (bold, links allowed) |
| `order` | number | Integer for manual sort ordering |
| `isPublished` | boolean | Hide draft entries without deleting them |

### `teacherBio` — Teacher Profile (singleton)
| Field Name | Type | Description |
|---|---|---|
| `name` | string | Teacher's display name (used site-wide) |
| `headshot` | image | Profile photo with alt text field |
| `shortBio` | text | 1–2 sentence teaser used on the landing page |
| `fullBio` | block content | Full rich-text bio for the `/about` page |
| `credentials` | array of string | List of qualifications/certifications |

### `classSchedule` — Schedule Entry (optional, use if schedule may change)
| Field Name | Type | Description |
|---|---|---|
| `dayOfWeek` | string (enum) | `Saturday` \| `Sunday` |
| `startTime` | string | e.g., `9:00 AM` |
| `endTime` | string | e.g., `12:00 PM` |
| `gradeRange` | string | e.g., `K–3`, `4–5` |
| `notes` | text | Optional note (e.g., "Holiday break — no class") |
| `isActive` | boolean | Show/hide this slot without deleting |

> **Note:** If the schedule is truly static and changes are developer tasks, skip this schema and hardcode the schedule. Only add it to Sanity if the stakeholder needs to update it themselves.

### `siteSettings` — Global Settings (singleton)
| Field Name | Type | Description |
|---|---|---|
| `siteName` | string | Display name — swap here when final brand arrives |
| `contactEmail` | string | Stakeholder's notification email |
| `googleClassroomUrl` | url | The Google Classroom invite/join link |
| `zoomLink` | url | Recurring Zoom meeting URL for classes |
| `sampleClassVideoUrl` | url | Optional YouTube/Vimeo embed URL |

---

## 4. Clerk Auth Architecture

### Plain-English Summary
Clerk handles all login/logout. Prospective visitors browse freely. Once a family is approved, the stakeholder sends them a Clerk invitation. They click the link, create a password, and gain access to the `/classes` page. No one can self-register.

### Recommended Clerk Feature: **Invitations API**
Use Clerk's **Invitations** feature (available on free tier). Workflow:

1. Stakeholder logs into the Clerk Dashboard.
2. Goes to **Users → Invitations → Create Invitation**.
3. Enters the parent's email address and clicks Send.
4. Parent receives an email with a magic link → clicks → lands on `/sign-in` with a pre-filled token → creates their account.
5. Account is created. Clerk assigns them a `role: parent` metadata tag (set via Clerk Dashboard or a post-signup webhook).
6. `/classes` page checks `auth()` server-side; if no session, redirect to `/sign-in`.

### What each visitor sees

| Visitor Type | Accessible Pages | Auth State |
|---|---|---|
| Prospective parent (not invited) | `/`, `/about`, `/faq`, `/contact` | Unauthenticated |
| Invited parent (has account) | All pages including `/classes` | Authenticated via Clerk session |
| Stakeholder | All pages + Sanity Studio | Authenticated (separate Sanity login) |

### Implementation Notes
- Use `clerkMiddleware()` in `middleware.ts` to protect `/classes` and any future authenticated routes.
- Public routes explicitly listed: `['/','/(about|faq|contact|sign-in)(.*)', '/api/consultation']`
- No Clerk Organization needed for this scale — simple user-level auth is sufficient.
- **Disable** "Allow sign-ups" in Clerk Dashboard settings → Users can only join via invitation link. This enforces the invite-only model without any code.

---

## 5. next-intl i18n Structure

### Locale Configuration
```
/messages
  en.json        ← English (default)
  zh-TW.json     ← Traditional Chinese
  zh-CN.json     ← Simplified Chinese
```

### Translation Namespaces

Each locale file is divided into namespaces (top-level keys):

| Namespace | Contents |
|---|---|
| `nav` | Navigation link labels, language toggle labels |
| `home` | Hero headline, subheadline, CTA button text |
| `about` | Page title, section headings |
| `faq` | Page title, static UI strings (not FAQ content — that lives in Sanity) |
| `contact` | Form labels, placeholders, validation messages, success/error alerts |
| `classes` | Schedule page title, column headers, Zoom/Classroom link labels |
| `banner` | Dismiss button label, ARIA labels |
| `auth` | Sign-in page title, prompts |
| `footer` | Copyright text, tagline |
| `common` | Shared strings: "Loading…", "Back", date formats |

> **Sanity content** (FAQ questions/answers, bio, announcements) is NOT translated through next-intl. If multilingual CMS content is needed in the future, Sanity's localization plugin handles that separately. For launch, English-only CMS content is acceptable.

### Language Toggle — Component-Level
- `LanguageToggle` component uses next-intl's `useRouter` and `usePathname` hooks.
- On selection, calls `router.replace(pathname, { locale: selectedLocale })` — swaps locale prefix in the URL without a full page reload.
- Current locale is read from `useLocale()` to mark the active option.
- Toggle renders as a `DropdownMenu` (shadcn) in the `SiteHeader` with three items: `English`, `繁體中文`, `简体中文`.
- The component is rendered in the root layout so it appears on every page.

### File Handoff for Stakeholder
- Stakeholder (or a translator) edits only the `.json` files in `/messages`.
- Each key maps 1:1 to its English counterpart — no code knowledge needed.
- Add a `TRANSLATION_GUIDE.md` in `/messages` explaining the key structure in plain English.

---

## 6. Resend Email Flow

### Flow Diagram

```
Parent fills /contact form
        │
        ▼
Client-side validation (react-hook-form + zod)
        │
        ▼
POST /api/consultation  (Next.js Route Handler)
        │
        ▼
Server validates input (zod schema — re-validates server-side)
        │
        ├─ Invalid → 400 response → form shows error Alert
        │
        ▼
Resend SDK: sendEmail()
  ├─ to: STAKEHOLDER_EMAIL (env var)
  ├─ from: noreply@[verified-domain]
  ├─ subject: "New Consultation Request – [Parent Name]"
  └─ body: see template below
        │
        ▼
200 response → form shows success Alert
"Thank you! We'll be in touch soon."
```

### Email Template Structure (React Email or plain HTML)

**Subject:** `New Consultation Request – {parentName}`

**Body:**
```
A new consultation request was submitted on {date} at {time}.

PARENT INFORMATION
  Name:   {parentName}
  Email:  {parentEmail}
  Phone:  {parentPhone}

CHILD INFORMATION
  Name:         {childName}
  Grade Level:  {childGrade}

MESSAGE
  {optionalMessage or "No message provided."}

---
Reply directly to this email to contact the family.
Reply-To header is set to {parentEmail}.
```

### Key Implementation Details
- **Route Handler:** `app/api/consultation/route.ts` — POST only, no GET.
- **`Reply-To` header** set to the parent's email so stakeholder can reply directly from their inbox.
- **Rate limiting:** Add a simple in-memory or Upstash Redis rate limit (1 submission per IP per 10 minutes) to prevent spam — the 3k/month Resend free tier is finite.
- **Env vars needed:** `RESEND_API_KEY`, `STAKEHOLDER_EMAIL`, `RESEND_FROM_ADDRESS`
- No Resend "template" feature needed — render the email inline in the route handler using a plain string or the `@react-email/components` package.

### What is NOT sent
- No confirmation email to the parent (keeps it simple; stakeholder follows up manually).
- No data is stored in a database — the email IS the record. If persistence is needed later, add a Sanity `inquirySubmission` document type.

---

## 7. Notification / Banner System

### How the Stakeholder Uses It (Plain English)
Sanity is the website's control panel for content. Think of it like a Google Doc that's connected to the website. The stakeholder logs into `sanity.io/manage`, opens the "Announcements" section, and fills out a short form: the message text, when it should stop showing, and whether it's currently on or off. No code changes, no developer needed.

### Day-to-Day Workflow
1. Log into Sanity Studio (`/studio` or `sanity.io/manage`).
2. Click **Announcements → + New**.
3. Fill in: Message, Expiry Date, Active toggle, Severity (Info / Warning / Success).
4. Click **Publish**.
5. Banner appears on the site within ~60 seconds (Next.js ISR revalidation).
6. To remove early: toggle **Active** to off and republish. Or wait for the expiry date.

### Banner Component Behavior
- **Sticky at the top** of the page, above the main navigation.
- **Dismissible per session** — dismiss button sets a `sessionStorage` flag keyed by the banner's Sanity document ID. Refreshing the page re-shows it; closing the browser tab clears the dismissal (acceptable for announcements).
- **Color-coded by severity:**
  - `info` → blue (`bg-blue-50 border-blue-200`)
  - `warning` → amber (`bg-amber-50 border-amber-200`)
  - `success` → green (`bg-green-50 border-green-200`)
- **Multiple active banners** render as a stacked list, most recent first.
- **Auto-hidden server-side** if `isActive === false` OR `expiresAt < now` — the component receives an already-filtered list from the Sanity query; no client-side date math needed.
- Component: `AnnouncementBanner` wraps shadcn `Alert` + `AlertDescription` + a dismiss `Button` with an X icon.

### Data Fetching
- Sanity GROQ query in a server component: `*[_type == "announcement" && isActive == true && expiresAt > now()] | order(_createdAt desc)`
- Rendered in the root layout so it appears on every page without per-page duplication.
- Next.js `revalidate = 60` (ISR) keeps the banner fresh without a full rebuild.

---

## 8. Google Classroom Integration Strategy

### Honest Assessment
Full automatic sync between Clerk and Google Classroom is **not feasible on the free tier** without significant custom engineering. Google Classroom's API requires OAuth 2.0 with elevated scopes and a Google Workspace for Education account. There is no webhook that fires when a student is added to Classroom.

### Options Ranked by Implementation Effort

| Option | How It Works | Effort | Limitations |
|---|---|---|---|
| **A — Manual (Recommended)** | Stakeholder invites families to Clerk AND Google Classroom separately. Two-step process, both take ~1 minute each. | Minimal | No automation. Human error possible (one list gets out of sync). Acceptable at this scale (<20 families). |
| **B — Semi-automated via Zapier/Make** | A Zap triggers when stakeholder adds a row to a Google Sheet → sends Clerk invitation via Clerk API. Classroom still manual. | Low | Requires Zapier free plan. Adds a third tool. Classroom side still manual. |
| **C — Custom webhook + Classroom API** | Clerk post-signup webhook → Lambda/Edge Function → calls Google Classroom API to add student to course. | High | Requires Google Workspace for Education (not free). Classroom API has strict OAuth flow. Not worth it at this scale. |

**Recommendation for launch:** Option A. Document the two-step checklist for the stakeholder. Revisit Option B after 6 months if the manual process proves burdensome.

### What the Website Does (Regardless of Option)
- After login, `/classes` shows a prominent button: **"Open Google Classroom"** linking to the `googleClassroomUrl` stored in the `siteSettings` Sanity document.
- No deep embedding. No grade sync. No roster pull. Link only.

---

## 9. Payment Platform Options

> **Note to stakeholder:** This is a decision table, not a recommendation. The right choice depends on whether you want the simplest setup or the lowest fees at higher volume. Review and decide.

| Platform | Transaction Fee | Monthly Fee | Setup Complexity | Notes |
|---|---|---|---|---|
| **PayPal** | 3.49% + $0.49 per transaction | $0 | Low — most families already have an account | Fees are high. On a $150/month tuition, you lose ~$5.72 per payment. PayPal.Me link requires no website integration. |
| **Stripe** | 2.9% + $0.30 per transaction | $0 | Medium — requires API integration or Stripe Payment Links | Lower rate than PayPal. Stripe Payment Links require no code — just a link. Families don't need a Stripe account. |
| **Zelle (status quo)** | $0 | $0 | None — already in use | Zero fees. No website integration needed. Limitation: only works with US bank accounts; some families may not have Zelle access. |

**Other zero-fee options to consider:**
- **Venmo** (personal): $0 for bank-funded payments, 3% for credit card. Similar to Zelle; no website integration.
- **Square Payment Links**: 2.6% + $0.10 per swipe / 3.5% + $0.15 for keyed-in. No monthly fee. Generates a shareable link.

**For website integration (if desired):** Stripe Payment Links or Square require no code changes — just a button linking to an external checkout URL stored in `siteSettings`. Full embedded checkout is out of scope for Phase 1.

---

## 10. Phased Build Roadmap

### Phase 1 — Deployable MVP (Weeks 1–3)
**Goal:** Live public site with core pages and working contact form.

**Deliverables:**
- [x] Next.js project initialized with App Router, Tailwind, shadcn/ui
- [x] `SiteHeader` and `SiteFooter` with placeholder name/logo
- [x] `/` landing page (static content, placeholder bio)
- [x] `/about` page (static content)
- [x] `/faq` page (hardcoded accordion — Sanity not yet wired)
- [x] `/contact` consultation form + `/api/consultation` route handler
- [x] Resend integration — stakeholder receives email on form submission
- [ ] Vercel deployment with environment variables set
- [ ] Custom domain connected
- [x] next-intl scaffolding — EN locale only, other locales stubbed

**Checkpoint:** Stakeholder reviews live URL, fills out the contact form, and confirms they receive the email.

---

### Phase 2 — Auth + Protected Schedule (Weeks 4–5)
**Goal:** Enrolled families can sign in and view class details.

**Deliverables:**
- [ ] Clerk installed and configured (invitations-only, sign-ups disabled)
- [ ] `clerkMiddleware()` protecting `/classes`
- [ ] `/sign-in` page with Clerk `<SignIn />` component
- [ ] `/classes` page with static schedule, Zoom link, Google Classroom link
- [ ] `SiteHeader` updated with `<UserButton />` (shows avatar when signed in)
- [ ] Stakeholder trained on sending Clerk invitations
- [ ] Test: stakeholder sends invitation to a test email → invite flow works end-to-end

**Checkpoint:** Stakeholder logs in, views `/classes`, and confirms they can send an invite to a test family.

---

### Phase 3 — CMS Integration (Weeks 6–8)
**Goal:** Stakeholder can update content without developer involvement.

**Deliverables:**
- [ ] Sanity project created and schemas defined (`announcement`, `faq`, `teacherBio`, `siteSettings`)
- [ ] Sanity Studio deployed (at `/studio` or `sanity.io/manage`)
- [ ] `/about` page pulls bio + headshot from Sanity
- [ ] `/faq` page pulls FAQ entries from Sanity (ordered by `order` field)
- [ ] `AnnouncementBanner` fetches live announcements from Sanity (ISR)
- [ ] `siteSettings` drives site name display, Zoom link, Classroom link
- [ ] Stakeholder walkthrough: create a banner, edit a FAQ, update bio
- [ ] TRANSLATION_GUIDE.md written for `/messages` locale files

**Checkpoint:** Stakeholder creates a test banner in Sanity and sees it appear on the live site within 2 minutes.

---

### Phase 4 — i18n + Polish (Weeks 9–11)
**Goal:** Full multilingual support and production-ready quality.

**Deliverables:**
- [ ] next-intl fully wired for `en`, `zh-TW`, `zh-CN`
- [ ] All static UI strings moved into locale `.json` files
- [ ] `LanguageToggle` component functional in header
- [ ] Translation review — stakeholder provides or reviews zh-TW / zh-CN strings
- [ ] Full responsive QA on mobile (iOS Safari, Android Chrome)
- [ ] Lighthouse audit — target 90+ on Performance, Accessibility, SEO
- [ ] Optional: sample class video embed on `/about` or `/`
- [ ] Final favicon, Open Graph image, `<title>` / `<meta>` tags set
- [ ] Stakeholder walkthrough: full site review in all three languages

**Checkpoint:** Final stakeholder sign-off. Site is production-ready.

---

## 11. Vercel Deployment & Maintenance Plan

### CI/CD Setup
- **Repository:** GitHub (private repo recommended).
- **Vercel project** connected to the GitHub repo via Vercel's GitHub integration.
- **Auto-deploy:** Every push to `main` triggers a production deployment.
- **Preview deployments:** Every pull request gets its own preview URL — useful for reviewing changes before going live.
- **Branch strategy:** `main` = production. `development` = staging/work-in-progress.

### Environment Variables
All secrets managed in Vercel Dashboard → Project → Settings → Environment Variables. Never committed to the repository.

| Variable | Used By | Where to Get It |
|---|---|---|
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | Clerk (client-side) | Clerk Dashboard → API Keys |
| `CLERK_SECRET_KEY` | Clerk (server-side) | Clerk Dashboard → API Keys |
| `RESEND_API_KEY` | Resend email | Resend Dashboard → API Keys |
| `STAKEHOLDER_EMAIL` | Resend — notification target | Set to stakeholder's email address |
| `RESEND_FROM_ADDRESS` | Resend — sender | e.g., `noreply@yourdomain.com` (must be verified in Resend) |
| `NEXT_PUBLIC_SANITY_PROJECT_ID` | Sanity (client-side) | Sanity project settings |
| `NEXT_PUBLIC_SANITY_DATASET` | Sanity (client-side) | `production` |
| `SANITY_API_TOKEN` | Sanity (server-side reads, if needed) | Sanity → API → Tokens |

**Local development:** Copy these into `.env.local` (gitignored).

### Monthly Maintenance Routine (~2 hours/month)
This is the complete developer checklist for ongoing maintenance:

1. **Dependency audit** (~30 min): Run `npm outdated`. Update patch and minor versions. Check for Next.js or Clerk breaking changes before updating major versions.
2. **Vercel function logs review** (~15 min): Check for 500 errors on `/api/consultation`. Confirm emails are still sending.
3. **Sanity check** (~10 min): Confirm no expired banners are still marked `isActive`. Ping stakeholder for any content updates needed.
4. **Clerk user review** (~10 min): Remove users for families who have left. Send invites for newly enrolled families if stakeholder hasn't done it.
5. **Deploy if needed** (~15 min): Push any accumulated dependency updates to a preview branch, verify, then merge to `main`.

**Total:** ~1.5–2 hours/month under normal conditions.

### Free Tier Limits to Watch
| Service | Free Tier Limit | Risk at This Scale |
|---|---|---|
| Vercel | 100 GB bandwidth/month | Very low risk — static site with minimal assets |
| Clerk | 10,000 monthly active users | No risk — ~20 families max |
| Resend | 3,000 emails/month | No risk — ~5–10 consultation submissions/month expected |
| Sanity | 10 GB bandwidth, 1M API calls/month | No risk — low-traffic site |

---

## 12. Placeholder Strategy

### The Problem
The final site name and logo are not yet decided. The design must not require a developer to make 20 changes when the real brand arrives.

### Where Placeholders Live

| Placeholder | Current Value | Where It Lives | What Changes at Launch |
|---|---|---|---|
| Site name (display) | `"Wang Teacher Chinese Classroom"` | `siteSettings.siteName` in Sanity | Stakeholder edits in Sanity — no code change |
| Site name (HTML `<title>`) | Reads from `siteSettings.siteName` via Sanity | `app/layout.tsx` metadata | Automatic — updates when Sanity value changes |
| Logo image | Text fallback or placeholder SVG | `SiteHeader` component — `LOGO_PLACEHOLDER` constant | Developer swaps one image file and removes the constant |
| Favicon | Generic icon | `app/favicon.ico` | Developer replaces one file |
| Open Graph image | Generic placeholder | `public/og-image.png` | Developer replaces one file |
| Color scheme | Neutral (slate/indigo — brand-agnostic) | Tailwind config CSS variables | Developer updates 3–4 CSS custom properties in `globals.css` |

### Logo Component Design
```
SiteHeader
  └─ LogoLockup (custom component)
       ├─ If LOGO_SRC env var is set → renders <Image src={LOGO_SRC} />
       └─ Else → renders <span className="font-bold text-xl">{siteName}</span>
```

Setting `NEXT_PUBLIC_LOGO_SRC` in Vercel environment variables to a hosted image URL is the only change needed to activate the real logo — no code deployment required.

### Brand Swap Checklist (when final identity arrives)
- [ ] Upload logo to `/public/logo.svg` (or Sanity media library)
- [ ] Set `NEXT_PUBLIC_LOGO_SRC` in Vercel env vars (or update the image path)
- [ ] Replace `public/favicon.ico` and `public/og-image.png`
- [ ] Update `siteSettings.siteName` in Sanity (if name changes)
- [ ] Update Tailwind CSS custom properties: `--color-primary`, `--color-primary-foreground`, `--color-accent` in `globals.css`
- [ ] Redeploy (automatic on push to `main`)

**Total brand swap effort:** ~1 hour for a developer. Zero effort for the stakeholder on the name change.

---

*End of plan. Each phase ends with a stakeholder checkpoint. Build phases are sequential; do not start Phase 2 until Phase 1 is signed off.*
