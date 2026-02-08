# HandyHub Design System

> Generated from Stitch projects `12385649108249240626` (Landing Page Hero), `285471699692326575` (Design System Foundation), and `17240377485517129722` (Landing Page + Gallery + Designer flows).
> Last updated: 2026-02-08

---

## Brand Identity

| Attribute | Value |
|-----------|-------|
| **Platform** | Home improvement project enablement (DIY + hire contractors + design inspiration) |
| **Personality** | Trustworthy, modern, approachable, clean |
| **Design references** | Thumbtack (clean/minimal), Airbnb (trust), Pinterest (discovery/gallery) |
| **Tagline** | "Every Home Project Starts Here" |
| **Sub-tagline** | "Plan it. Source it. Build it. — Whether you DIY or hire a pro." |

### User Types & Their Flows

| User Type | Primary Dashboard | Key Screens |
|-----------|-------------------|-------------|
| **DIY Homeowner** | DIY Dashboard (sidebar nav) | BOM Engine, Price Comparison, Tool Rentals, Design Gallery |
| **Interior Designer** | Designer Dashboard (sidebar nav) | Portfolio Management, Upload Wizard, Orders, Earnings |
| **Contractor** | Contractor Dashboard (sidebar nav) | Find Work Feed, Project Tracker, Milestones |
| **Visitor** | Landing Page (top nav) | Landing Page, Design Gallery (public), Designer Profiles |

---

## Color Palette

### Primary

| Token | Hex | Tailwind | Usage |
|-------|-----|----------|-------|
| `primary` | `#059669` | `emerald-600` | Buttons, links, active states, logo, sparkline charts |
| `primary-dark` | `#047857` | `emerald-700` | Hover states, active, gradients, badge text on light bg |
| `primary-light` | `#D1FAE5` | `emerald-100` | Subtle backgrounds, category badges, style pills, designer badges |
| `primary-50` | `#ECFDF5` | `emerald-50` | Selected card tints, sidebar active bg, inspiration banner bg |

### Secondary & Neutrals

| Token | Hex | Tailwind | Usage |
|-------|-----|----------|-------|
| `secondary` | `#334155` | `slate-700` | Headings, body text, nav links |
| `text-primary` | `#1E293B` | `slate-800` | Large headings, bold emphasis, card titles |
| `text-secondary` | `#64748B` | `slate-500` | Subtitles, descriptions, helper text, star rating text |
| `text-muted` | `#94A3B8` | `slate-400` | Captions, timestamps, placeholders, "Updated 2 days ago" |
| `border` | `#E2E8F0` | `slate-200` | Input borders, card borders, dividers, inactive filter chips |
| `surface` | `#F8FAFC` | `slate-50` | Page backgrounds, section backgrounds, trust strips, stats bars |
| `card` | `#FFFFFF` | `white` | Cards, containers, modals, nav bar, sidebar |

### Accent & Semantic

| Token | Hex | Tailwind | Usage |
|-------|-----|----------|-------|
| `accent-warm` | `#F59E0B` | `amber-500` | Star ratings, warnings, "NEW" badges, Featured designer gold |
| `accent-red` | `#EF4444` | `red-500` | Errors, destructive actions, disputes, notification dots |
| `success` | `#22C55E` | `green-500` | Verified badges, completed states, "in stock", "In Progress" |
| `info` | `#3B82F6` | `blue-500` | Informational badges, "ID Verified" tier, "Scheduled" status |
| `orange` | `#F97316` | `orange-500` | Home Depot branding, external retailer CTAs |

### Contractor Verification Tiers

| Tier | Badge Color | Icon |
|------|-------------|------|
| New | `slate-200` bg / `slate-600` text | 🔘 Gray circle |
| ID Verified | `blue-100` bg / `blue-700` text | 🔵 Blue circle |
| Background Checked | `green-100` bg / `green-700` text | 🟢 Green shield |
| Fully Verified | `green-500` bg / white text | 🟢✨ Green shield + glow |

### Designer Tier Badges

| Tier | Badge Color | Icon | Meaning |
|------|-------------|------|---------|
| Creator | `slate-100` bg / `slate-700` text | 🎨 | Community member, no verification |
| Verified Designer | `emerald-100` bg / `emerald-700` text | 🎨✓ | Identity + portfolio verified |
| Featured Designer | `amber-100` bg / `amber-700` text, subtle gold border | 🎨⭐ | Staff-picked, top quality |

### AI Confidence Tier Badges

| Tier | Badge Color | Usage |
|------|-------------|-------|
| High (80%+) | `blue-100` bg / `blue-700` text | "High (92%)" — strong AI confidence |
| Medium (60–79%) | `amber-100` bg / `amber-700` text | "Medium (75%)" — moderate confidence |
| Low (<60%) | `red-100` bg / `red-700` text | "Low (45%)" — low confidence, needs review |

### Order Status Colors

| Status | Badge Color | Usage |
|--------|-------------|-------|
| In Progress | `green-100` bg / `green-700` text | 🟢 Active work |
| Revision Requested | `amber-100` bg / `amber-700` text | 🟡 Needs changes |
| Scheduled | `blue-100` bg / `blue-700` text | 🔵 Upcoming appointment |
| Completed | `green-500` bg / white text | Done |
| Cancelled | `red-100` bg / `red-700` text | Cancelled by either party |

---

## Typography

**Font Family:** [Inter](https://fonts.google.com/specimen/Inter) (Google Fonts)

| Level | Size | Weight | Tracking | Line Height | Color |
|-------|------|--------|----------|-------------|-------|
| H1 | 36–48px | Bold (700) | Tight (-0.025em) | 1.2 | `slate-800` |
| H2 | 28–30px | Bold (700) | Tight | 1.3 | `slate-800` |
| H3 | 22–24px | Semibold (600) | Normal | 1.4 | `slate-800` |
| H4 | 18–20px | Semibold (600) | Normal | 1.4 | `slate-800` |
| Body | 16px | Regular (400) | Normal | 1.6 | `slate-700` |
| Body Small | 14px | Medium (500) | Normal | 1.5 | `slate-500` |
| Caption | 12–13px | Regular (400) | Normal | 1.4 | `slate-400` |
| Label | 11px | Medium (500) | Wide (0.05em), Uppercase | 1.0 | `slate-400` |
| Stat Value | 24–32px | Bold (700) | Normal | 1.2 | `slate-800` or `emerald-600` |
| Price | 20–28px | Bold (700) | Normal | 1.2 | `emerald-600` |

### Heading Usage Conventions

- **Page titles:** H1 (48px hero on desktop, 28px on mobile, 36px standard pages)
- **Section headers:** H2 (28px) — e.g., "How It Works", "Active Projects", "Work with Sarah"
- **Card titles:** H3 (22px) or H4 (18–20px)
- **Wizard step titles:** H2 (24px) inside card containers
- **Gallery card titles:** 14px bold, max 2 lines with ellipsis on mobile
- **Stat card values:** 32px bold for dashboard metrics
- **Prices:** 20–28px bold emerald for service/product pricing

---

## Spacing & Layout

### Spacing Scale

| Token | Value | Usage |
|-------|-------|-------|
| `xs` | 4px | Inline icon gaps |
| `sm` | 8px | Badge padding, tight gaps, masonry grid gap (mobile) |
| `md` | 12–16px | Card gaps, filter chip gaps, list item spacing, masonry gap (desktop) |
| `lg` | 20–24px | Card internal padding, section gaps, row spacing |
| `xl` | 32px | Page padding, main content margins, card internal padding |
| `2xl` | 40px | Wizard card internal padding |
| `3xl` | 60–100px | Hero section vertical padding |

### Layout Patterns

| Pattern | Specification |
|---------|---------------|
| **Page max-width** | 1440px (desktop), 390px (mobile) |
| **Content max-width** | 1200px centered with auto margins |
| **Wizard card max-width** | 700–800px centered |
| **Booking form max-width** | 900px centered (60/40 split) |
| **Sidebar width** | 240px fixed |
| **Top nav height** | 56px (desktop), 48px (mobile) |
| **Bottom tab bar height** | 64px + safe area padding |
| **Card grid gap** | 16–24px (desktop), 8–12px (mobile) |
| **Masonry columns** | 4 columns (desktop gallery), 3 columns (desktop profile portfolio), 2 columns (mobile) |
| **Split view** | 60/40 (map/list, content/sidebar, booking form/summary) |
| **Cover photo height** | 280px (desktop profile), 180px (mobile profile) |
| **Hero photo height** | 65–70vh (design detail), 60vh (mobile detail) |

### Breakpoints

| Breakpoint | Width | Usage |
|------------|-------|-------|
| Mobile | 390px | Single column, stacked tiles, hamburger nav, bottom tab bar |
| Desktop | 1280–1440px | Multi-column, sidebar nav, split views, masonry grids |

---

## Component Library

### Buttons

| Variant | Background | Text | Border | Usage |
|---------|-----------|------|--------|-------|
| **Primary** | `emerald-600` | White | None | Main CTAs: "Get Started", "Start Planning", "Place Order", "Publish Design" |
| **Secondary / Outlined** | White | `emerald-600` | `emerald-600` 1.5px | Secondary CTAs: "Learn More", "Find a Pro", "Follow", "Message" |
| **Ghost** | Transparent | `emerald-600` | None | Tertiary actions: "Cancel", text links, "Skip" |
| **Destructive** | `red-500` | White | None | Danger actions: "Delete Project", "Open Dispute" |
| **External/Retailer** | `orange-500` | White | None | Affiliate links: "Reserve on HomeDepot.com" |
| **Affiliate** | `emerald-600` | White | None | "Buy at Lowe's →", "Buy →" small pills on product cards |

**Button specs:** `rounded-lg` (8px), medium padding (`px-6 py-3`), `font-medium`, subtle shadow on primary. Full-width in cards on mobile. Min height 44px for touch targets.

### Cards

| Property | Value |
|----------|-------|
| Background | `#FFFFFF` (white) |
| Border radius | `rounded-xl` (12px) |
| Shadow | `shadow-sm` (0 1px 2px rgba(0,0,0,0.05)) |
| Shadow hover | `shadow-md` (on gallery cards, clickable cards) |
| Padding | 20–32px internal |
| Border (optional) | `slate-200` for subtle, `emerald-600` for emphasis |

**Card variants:**
- **Standard card** — White, shadow-sm, rounded-xl
- **Selected card** — Emerald border (2px), emerald-50 tint, checkmark indicator
- **Emphasized card** — Emerald left/top border (3–4px), optional badge ("Most Popular")
- **CTA card** — Emerald gradient background (`#059669` to `#047857`), white text
- **Warning card** — Amber-50 bg, amber-500 left border (4px)
- **Info card** — Emerald-50 bg, emerald icon, emerald-700 text
- **Featured card** — Gold/amber top border (2px), subtle amber-50 tint (for Featured designer designs)
- **Gallery/Masonry card** — Photo-dominant (80%+ of card height), minimal text area below
- **Stat card** — White, shadow-sm, label + large bold value + trend indicator + sparkline
- **Service card** — White, shadow-sm, title + description + delivery info + price + CTA button
- **Shopping list card** — White, emerald left border (4px), sticky, product rows with "Buy →" pills
- **Before/After card** — Gallery card with emerald "Before/After" pill badge on photo

### Gallery / Masonry Cards

Photo-dominant cards used in the Design Inspiration Gallery and designer portfolios:

| Property | Desktop | Mobile |
|----------|---------|--------|
| Columns | 4 (gallery) / 3 (profile portfolio) | 2 |
| Gap | 16px | 8px |
| Photo ratio | Variable (portrait/square/landscape mix) | Variable |
| Corner radius | `rounded-xl` (12px) | `rounded-xl` |
| Shadow | `shadow-sm`, `shadow-md` on hover | `shadow-sm` |
| Heart button | Visible on hover (dark overlay) | Always visible (top-right, white circle 32px) |
| Text area padding | 12px | 8px |

**Gallery card content (below photo):**
- Row 1: Designer avatar (24px) + name (12px) + tier badge pill
- Row 2: Title (14px bold, max 2 lines mobile) + budget
- Row 3: Tiny category pills (10px) + stats (heart/bookmark counts, muted)

### Product Tag Dots (Design Detail Page)

Interactive shoppable dots overlaid on design photos:

| Property | Value |
|----------|-------|
| Dot size | 12px circle (desktop), 10px (mobile) |
| Color | White with subtle glow/pulse animation |
| Active state | Larger (16px) with emerald ring |
| Popover | White card, shadow-md, rounded-lg |
| Popover content | Product thumbnail + name + brand + retailer + price + "Buy →" button + close "✕" |

### Badges / Pills

All badges: `rounded-full`, small (`px-3 py-1`), `text-xs` or `text-sm` `font-medium`.

| Badge | Background | Text | Usage |
|-------|-----------|------|-------|
| Category | `emerald-100` | `emerald-700` | "Bathroom", "Kitchen", "Plumbing" |
| Category (neutral) | `slate-100` | `slate-700` | "Plumbing", "Outdoor" (neutral context) |
| Style | `emerald-100` | `emerald-700` | "Farmhouse", "Modern", "Scandinavian" |
| Verified | `green-500` | White | "Verified" with checkmark |
| Pending | `amber-100` | `amber-700` | "Pending" |
| Pro Member | `emerald-600` | White | "Pro Member" with star |
| NEW | `amber-500` | White | Projects < 24hrs old |
| AI-Scoped | `emerald-600` outlined | `emerald-600` | "AI-Scoped" with checkmark |
| Most Popular | `emerald-600` | White | Featured tile emphasis |
| Save Money | `amber-500` | White | Cost-saving option highlight |
| Best Price | `green-500` | White | Cheapest rental/price |
| Closest | `blue-500` | White | Nearest location |
| Skill Level | `amber-100` | `amber-700` | "Intermediate", "Beginner", "Advanced" |
| DIY Friendly | `green-100` | `green-700` | "✓ DIY Friendly" |
| Budget | `slate-100` | `slate-700` | "💰 ~$2,800" |
| Before/After | `emerald-600` | White | "Before/After" on photo top-left |
| Status: In Progress | `green-100` | `green-700` | Active project or order |
| Status: Revision | `amber-100` | `amber-700` | Revision requested |
| Status: Scheduled | `blue-100` | `blue-700` | Upcoming appointment |
| Status: Completed | `green-500` | White | Finished milestone |
| FREE | `emerald-600` | White | Launch pricing indicator |
| Difficulty: Beginner | `green-100` | `green-700` | Community project difficulty |
| Difficulty: Intermediate | `amber-100` | `amber-700` | Community project difficulty |
| Difficulty: Advanced | `red-100` | `red-700` | Community project difficulty |

### Filter Chips (Horizontal Scrollable)

Used in Design Gallery, designer portfolios, and room type selectors:

| State | Background | Text | Border |
|-------|-----------|------|--------|
| Active/Selected | `emerald-600` | White | None |
| Inactive | `slate-100` | `slate-600` | None |
| Avoided (negative) | `red-100` | `red-600` | None |

**Chip specs:** `rounded-full`, `px-4 py-2`, `text-sm font-medium`. Horizontal scroll with no wrap. Grouped by category (Row 1: room type, Row 2: style, Row 3: inline controls).

### Form Inputs

| State | Border | Ring | Label | Helper Text |
|-------|--------|------|-------|------------|
| Default | `slate-200` | None | `slate-700` above | `slate-400` |
| Focus | `emerald-500` | `ring-2 ring-emerald-500/20` | `emerald-600` | — |
| Error | `red-500` | `ring-2 ring-red-500/20` | `red-600` | `red-500` below |
| Disabled | `slate-100` bg | None | `slate-300` | Reduced opacity |

**Input specs:** `rounded-lg` (8px), `px-4 py-3`, 16px font, `slate-800` text, 44px height.

**Textarea specs:** Same border/focus styling, 4–5 visible lines, with optional character count bottom-right.

**Dropdowns:** Same styling as inputs, `ChevronDown` icon right-aligned, `slate-400`.

**Toggle switch:** Emerald track when ON (24px wide pill), `slate-200` track when OFF, white circle thumb.

**Budget slider:** Emerald track (filled portion), `slate-200` track (unfilled), white circle thumb, tooltip above thumb showing value.

### Drag-and-Drop Upload Zones

| Property | Value |
|----------|-------|
| Border | Dashed 2px `emerald-300` |
| Background | `emerald-50` |
| Border radius | `rounded-xl` (large zone) or `rounded-lg` (small zone) |
| Height | 280px (primary photo upload), 100–140px (secondary/optional) |
| Icon | Camera/Upload-cloud, 48px, `emerald-400` |
| Text | "Drag photos here or click to upload" (semibold) + file requirements (muted) |
| Thumbnails after upload | 60–80px squares, `rounded-lg`, star badge on hero, "✕" remove button |

### Navigation

#### Top Navigation Bar (Public Pages)
- White background, subtle bottom shadow (`shadow-sm`)
- Height: 56px (desktop), 48px (mobile), sticky
- Left: HandyHub logo (bold `emerald-600` + home icon)
- Right: Text links in `slate-700`, primary CTA button ("Get Started Free")
- Mobile: Hamburger menu icon replaces right-side links

#### Sidebar Navigation (Dashboard/App Pages)
- Width: 240px, fixed, white background, right border
- Logo at top with 24px padding
- Nav items: Icon + text, 14px medium, 12px vertical padding
- Active state: `emerald-50` background, `emerald-700` text, 3px emerald left border
- Section dividers with uppercase 11px `slate-400` labels (e.g., "Need a hand?")
- Notification dot: 6px red circle on "Messages" item

**DIY Sidebar Nav Items:**
📋 Plan a Project | 🔨 My DIY Projects | 🤖 AI Assistant | 🛒 Find Best Prices | 🔧 Rent Tools Nearby | 🎨 Design Ideas | 👥 Community | --- "Need a hand?" | 👷 Hire a Pro | --- | 💬 Messages | ⚙️ Settings

**Designer Sidebar Nav Items:**
🏠 Dashboard | 🎨 My Design Ideas | ➕ Upload New Idea | 🛍️ My Services | 📋 Orders | 💰 Earnings | 📊 Analytics | --- | 💬 Messages | 👥 Community | --- | ⚙️ Settings

#### Mobile Bottom Tab Bar
- White background, subtle top shadow, 64px height + safe area
- 5 equal-width tabs: icon (20px) above label (11px)
- Active tab: `emerald-600` icon + text, optional dot indicator above icon
- Inactive tabs: `slate-400`

**Gallery bottom tabs:** 🏠 Home | 🎨 Designs | 📋 Plan | 🔧 Tools | 👤 Profile

#### Mobile Top Bar (Detail Pages)
- 48px height, white bg, subtle bottom border
- Left: "←" back arrow (`slate-700`)
- Center: Page title (15–17px semibold)
- Right: Context-specific icon (search 🔍, more "...", filter sliders)

#### Mobile Bottom Sticky Action Bar
- White bg, subtle top shadow, safe area padding
- Full-width button(s), 16px horizontal padding
- Single CTA: Full-width emerald button ("Get Started Free")
- Dual CTA: 60/40 split ("🛒 Shop Products" emerald filled / "💬 Hire Designer" outlined)

### Progress Indicators

#### Step Progress Bar (Wizards)
- Horizontal connected circles with labels below
- **Completed:** Emerald filled circle + white checkmark, emerald label
- **Active:** Emerald filled circle + white number (slightly larger), emerald bold label
- **Pending:** Gray empty circle + gray number, `slate-400` label
- **Connecting lines:** Emerald solid (completed), gray dashed (pending)

#### Progress Bars (Projects)
- Height: 8px, `rounded-full`
- Track: `slate-100`
- Fill: `emerald-600`
- Percentage label right-aligned, 12px `slate-400`

#### Confidence Bars (AI Results)
- Same as progress bars but indicate AI confidence percentage
- Color: emerald for 80%+, amber for 60–79%, red for <60%

### Sparkline Charts (Dashboard Stat Cards)
- ~60px wide, 20px tall
- Emerald line (`emerald-500`), thin stroke
- 7 data points, upward trend
- No axis labels, grid, or background — pure mini chart

### Star Ratings
- 5 star icons in a row
- Filled stars: `amber-500`
- Empty stars: `slate-200`
- Rating number (bold) + "(N reviews)" text beside stars

### Review Components

| Element | Style |
|---------|-------|
| Overall rating | Large number (36–40px bold) + 5 emerald stars + "(N reviews)" |
| Rating breakdown | Horizontal bar chart: 5★ to 1★, emerald bars proportional to count |
| Individual review | Avatar (32px) + name + stars + time ago + service pill + text |
| Designer reply | Indented with designer avatar, lighter background |

### Cover Photo + Profile Photo (Designer Profile)

| Property | Desktop | Mobile |
|----------|---------|--------|
| Cover height | 280px | 180px |
| Cover overlay | Dark gradient at bottom (transparent → rgba(0,0,0,0.6)) |
| Profile photo size | 96px circle, 4px white border | 72px circle, 3px white border |
| Profile photo position | Bottom-left, overlapping cover by 48px | Center, overlapping by 36px |
| Action buttons on cover | "Hire" + "Message" overlaid bottom-right | Below profile info, full width |

### Milestone Timeline (Escrow)
- Vertical emerald line connecting circle nodes
- **Completed:** Emerald circle + white checkmark, muted card
- **In Progress:** Emerald circle + pulsing ring, emerald-bordered card (active)
- **Pending:** Gray empty circle, muted/low-contrast card

### Tab Navigation (Profile/Detail Pages)
- White background, subtle bottom border, sticky
- Equal-width tabs: text only
- Active: `emerald-600` text + 2px emerald bottom border
- Inactive: `slate-500` text

---

## Page Templates

### Public Pages (no auth)
```
┌─────────────────────────────────┐
│ Top Nav Bar (sticky, white)     │
├─────────────────────────────────┤
│ Hero Section (gradient bg)      │
├─────────────────────────────────┤
│ Content Sections                │
├─────────────────────────────────┤
│ Trust Strip (slate-50 bg)       │
└─────────────────────────────────┘
```

### Dashboard Pages (authenticated)
```
┌──────┬──────────────────────────┐
│      │ Top Bar (search + notifs)│
│ Side ├──────────────────────────┤
│ bar  │                          │
│ 240px│ Main Content Area        │
│      │ (slate-50 bg, 24px pad)  │
│      │                          │
└──────┴──────────────────────────┘
```

### Wizard Pages
```
┌──────┬──────────────────────────┐
│      │ Top Bar (breadcrumb)     │
│ Side ├──────────────────────────┤
│ bar  │                          │
│      │ ┌────────────────────┐   │
│      │ │ Step Indicator     │   │
│      │ │ White Card (800px) │   │
│      │ │ Form content       │   │
│      │ │ Back / Next btns   │   │
│      │ └────────────────────┘   │
│      │      (slate-50 bg)       │
└──────┴──────────────────────────┘
```

### Masonry Gallery (Design Inspiration)
```
┌──────┬──────────────────────────┐
│      │ Page Title + Upload Btn  │
│ Side ├──────────────────────────┤
│ bar  │ Filter Bar (sticky)      │
│      │ Room │ Style │ Controls  │
│      ├──────────────────────────┤
│      │ ┌──┬──┬──┬──┐           │
│      │ │  │  │  │  │ Masonry   │
│      │ │  │  │  │  │ 4-col     │
│      │ │  │  │  │  │ 16px gap  │
│      │ └──┴──┴──┴──┘           │
│      │ Loading more...          │
│      │           [+ FAB]        │
└──────┴──────────────────────────┘
```

### Design Detail (Shoppable)
```
┌──────┬──────────────────────────┐
│      │ Hero Photo (70vh)        │
│ Side │ [product dots] [♥][🔖]  │
│ bar  ├──────────────────────────┤
│      │ Designer Bar (avatar+CTA)│
│      ├─────────────────┬────────┤
│      │                 │        │
│      │ Content (60%)   │Shopping│
│      │ Title, pills    │List   │
│      │ Description     │(40%)  │
│      │ Design tips     │Sticky │
│      │                 │Products│
│      ├─────────────────┴────────┤
│      │ Services Section         │
│      │ Related Designs Scroll   │
└──────┴──────────────────────────┘
```

### Designer Profile
```
┌──────┬──────────────────────────┐
│      │ Cover Photo (280px)      │
│ Side │ [Avatar overlapping]     │
│ bar  ├──────────────────────────┤
│      │ Profile Info + Stats Bar │
│      ├──────────────────────────┤
│      │ Tabs: Portfolio│Svc│Rev │
│      ├─────────────────┬────────┤
│      │                 │        │
│      │ Tab Content     │ Sticky │
│      │ (70%)           │ CTA    │
│      │ Masonry/Cards   │ (30%) │
│      │                 │        │
└──────┴─────────────────┴────────┘
```

### Booking / Focused Form
```
┌─────────────────────────────────┐
│ Top Nav (logo, minimal)         │
│ Breadcrumb                      │
├──────────────────┬──────────────┤
│                  │              │
│ Booking Form     │ Order Summary│
│ (60%)            │ (40%)        │
│ Photos, prefs    │ Sticky card  │
│ Budget, notes    │ Price + CTA  │
│                  │ Trust badges │
├──────────────────┴──────────────┤
│ "Sarah responds in ~2 hours"    │
└─────────────────────────────────┘
```

### Split View (Map + List)
```
┌─────────────────────────────────┐
│ Top Nav + Sub-header            │
├──────────────────┬──────────────┤
│                  │              │
│ Map View (60%)   │ Results List │
│ + search overlay │   (40%)     │
│ + filter chips   │ scrollable  │
│                  │              │
├──────────────────┴──────────────┤
│ Bottom CTA Banner               │
└─────────────────────────────────┘
```

### Mobile: Stacked Detail
```
┌────────────────────┐
│ ← Title        ... │ Fixed top bar
├────────────────────┤
│                    │
│ Hero Photo (60vh)  │
│ [dots] [♥][🔖]    │
│                    │
├────────────────────┤
│ Designer Row       │
│ Title + Pills      │
│ Description...     │
│   "Read more"      │
│ Accordion Sections │
│ Services Scroll    │
│ Related Scroll     │
│                    │
├────────────────────┤
│ [Shop] [Hire]      │ Sticky bottom bar
└────────────────────┘
```

### Mobile: Gallery
```
┌────────────────────┐
│ ← Design Ideas  🔍 │ Fixed top bar
├────────────────────┤
│ Filter pills scroll│ Sticky
├────────────────────┤
│ ┌────┬────┐        │
│ │    │    │ 2-col  │
│ │    │    │ masonry│
│ │    ├────┤ 8px    │
│ ├────┤    │ gap    │
│ │    │    │        │
│ └────┴────┘        │
│  Loading more...   │
├────────────────────┤
│ 🏠 🎨 📋 🔧 👤    │ Bottom tabs
└────────────────────┘
```

---

## Screen Inventory

### Project: HandyHub Landing Page Hero (`12385649108249240626`)

| Screen | Title | Device | Dimensions |
|--------|-------|--------|-----------|
| `5ea651...` | Landing Page Hero | Desktop | 2560 x 2776 |
| `ae1194...` | Mobile Home Screen | Mobile | 780 x 1986 |
| `c5e759...` | Design System Style Guide | Desktop | 2560 x 5476 |
| `66a1d2...` | Minimalist Landing Page | Desktop | 2560 x 3818 |
| `bc9832...` | Mobile Landing Page | Mobile | 780 x 3904 |
| `ea72c9...` | Planning Wizard: Step 1 | Desktop | 2560 x 2516 |
| `587bec...` | Planning Wizard: Step 1 (Desktop) | Desktop | 2560 x 2600 |
| `5ffba0...` | AI Project Plan & Materials List | Desktop | 2560 x 2988 |
| `e2f7bb...` | Find Verified Contractors | Desktop | 2560 x 3040 |
| `bb5043...` | Tool Rental Aggregator | Desktop | 2560 x 2048 |
| `1e0487...` | DIY User Dashboard | Desktop | 2560 x 2048 |
| `663bb2...` | Post Project - Step 2 (Type) | Desktop | 2560 x 2658 |
| `581e41...` | Pro: Find Work Feed | Desktop | 2560 x 2048 |
| `7cd5f2...` | Project Milestone Tracker | Desktop | 2560 x 2738 |

### Project: HandyHub Design System Foundation (`285471699692326575`)

| Screen | Title | Device | Dimensions |
|--------|-------|--------|-----------|
| `4df6e6...` | Design System Foundation | Desktop | 2560 x 4632 |

### Project: HandyHub Landing Page (`17240377485517129722`)

| Screen | Title | Device | Flow |
|--------|-------|--------|------|
| 1 | Landing Page | Desktop | Marketing |
| 2 | Landing Page | Mobile | Marketing |
| 3 | DIY User Dashboard | Desktop | DIY User |
| 4 | Design Inspiration Gallery | Desktop | Design Gallery |
| 5 | Design Inspiration Gallery | Mobile | Design Gallery |
| 6 | Design Idea Detail Page | Desktop | Design Gallery |
| 7 | Design Idea Detail Page | Mobile | Design Gallery |
| 8 | Designer Profile Page | Desktop | Designer |
| 9 | Designer Profile Page | Mobile | Designer |
| 10 | Designer Dashboard | Desktop | Designer |
| 11 | Upload Design Wizard | Desktop | Designer |
| 12 | Service Booking Page | Desktop | Design Gallery |

### Project: HandyHub Design System (`16885425470418793566`)

| Property | Value |
|----------|-------|
| Theme Color | `#059467` (emerald) |
| Font | Inter |
| Roundness | 12px |
| Color Mode | Light |

---

## Tailwind CSS Configuration

```js
// tailwind.config.js
const config = {
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: '#059669',  // emerald-600
          dark: '#047857',     // emerald-700
          light: '#D1FAE5',    // emerald-100
          50: '#ECFDF5',       // emerald-50
        },
        surface: '#F8FAFC',    // slate-50
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        card: '12px',  // rounded-xl
        button: '8px', // rounded-lg
        badge: '9999px', // rounded-full
      },
      boxShadow: {
        card: '0 1px 3px rgba(0, 0, 0, 0.05), 0 1px 2px rgba(0, 0, 0, 0.03)',
        'card-hover': '0 4px 6px rgba(0, 0, 0, 0.07), 0 2px 4px rgba(0, 0, 0, 0.04)',
      },
      maxWidth: {
        wizard: '800px',
        booking: '900px',
        content: '1200px',
      },
    },
  },
};
```

---

## Icon System

**Library:** [Lucide Icons](https://lucide.dev/) (thin, consistent 1.5px stroke)

### Commonly Used Icons

| Context | Icons |
|---------|-------|
| Navigation | `Home`, `Search`, `Bell`, `Settings`, `Menu`, `ChevronDown`, `ArrowLeft` |
| Projects | `Hammer`, `Wrench`, `HardHat`, `PaintBucket`, `Ruler` |
| Actions | `Camera`, `Upload`, `Download`, `Share`, `Bookmark`, `ExternalLink`, `Plus` |
| Status | `Check`, `CheckCircle`, `Clock`, `AlertTriangle`, `XCircle` |
| Commerce | `DollarSign`, `CreditCard`, `ShoppingCart`, `Tag`, `Package` |
| Communication | `MessageSquare`, `Phone`, `Mail` |
| Users | `User`, `Users`, `Shield`, `ShieldCheck`, `Star` |
| Maps | `MapPin`, `Map`, `Navigation` |
| Gallery | `Heart`, `Bookmark`, `Share2`, `Eye`, `Palette`, `Sparkles` |
| Designer | `Palette`, `Image`, `Layers`, `PenTool`, `Sliders` |
| Analytics | `BarChart2`, `TrendingUp`, `Activity` |

---

## Interaction Patterns

### Hover States
- **Buttons:** Darken by one shade (emerald-600 -> emerald-700)
- **Cards:** Subtle shadow increase (`shadow-sm` -> `shadow-md`)
- **Gallery cards:** Dark overlay (20% opacity) with heart, bookmark, "View Design →" actions
- **Links:** Underline on hover
- **Nav items:** `slate-100` background

### Selection States
- **Cards:** 2px emerald border + emerald-50 background tint + checkmark icon
- **Radio options:** Filled emerald circle with white inner dot
- **Toggle switches:** Emerald track when ON, slate-200 when OFF
- **Filter chips:** Emerald filled + white text when active
- **Style preference chips (booking):** Emerald-100 bg + checkmark when liked, red-100 bg + "✕" when avoided

### Loading States
- **Milestone in progress:** Subtle pulsing emerald ring around node
- **Skeleton screens:** `slate-100` animated shimmer blocks
- **Buttons loading:** Spinner icon replacing text, disabled state
- **Infinite scroll:** Small emerald spinner + "Loading more designs..." centered text
- **Product tag dots:** Subtle white pulse animation on photo

### Expandable/Collapsible Patterns
- **"Read more...":** Truncate to 3 lines, emerald link to expand full text
- **Accordion sections:** Header with chevron "▾", collapsed by default, content slides down
- **Shopping list:** Collapsed header shows item count + total, expanded shows full product list
- **"Show N more ▾":** Inline link to reveal remaining items in a list

### Mobile Adaptations
- Top nav collapses to logo + hamburger (public) or "← Title ..." (detail)
- Multi-column grids become 2-column masonry (gallery) or single-column (cards)
- Horizontal card rows become horizontal scroll (peek next card at 70–75% width)
- Sidebar nav becomes slide-out drawer or is replaced by bottom tab bar
- Sticky bottom CTA bar with full-width button(s)
- "How It Works" steps become horizontal scroll cards
- Trust strip becomes 2x2 grid
- Cover photo reduces from 280px to 180px
- Profile photo reduces from 96px to 72px, centered instead of left-aligned
- Gallery hover actions (heart, bookmark) become always-visible on mobile
- Description text becomes expandable ("Read more...") to save vertical space
- Tab content scrolls independently below sticky tab bar

---

## AI Provider

| Provider | Usage |
|----------|-------|
| **Google Gemini** | Server-side AI features: project planning, materials list generation, cost estimation, contractor matching |
| **Nano Banana (Gemini)** | Client-side / lightweight AI tasks |

> **Note:** No OpenAI APIs are used in this project. All AI capabilities are powered by Google Gemini and Nano Banana.

---

## Stitch Project References

- **Original screens:** `projects/12385649108249240626` — 14 screens (landing, BOM, contractors, tools)
- **Design system foundation:** `projects/285471699692326575` — 1 screen (style guide reference)
- **Gallery + Designer flows:** `projects/17240377485517129722` — 12 screens (landing, gallery, detail, profiles, dashboards, booking)
- **Legacy design system:** `projects/16885425470418793566` — Style guide reference
- **Stitch MCP endpoint:** `https://stitch.googleapis.com/mcp`

All screens are viewable and editable in [Google Stitch](https://stitch.withgoogle.com).
