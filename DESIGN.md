# HandyHub Design System

> Generated from Stitch projects `12385649108249240626` (Landing Page) and `16885425470418793566` (Design System).
> Last updated: 2026-02-07

---

## Brand Identity

| Attribute | Value |
|-----------|-------|
| **Platform** | Home improvement project enablement (DIY + hire contractors) |
| **Personality** | Trustworthy, modern, approachable, clean |
| **Design references** | Thumbtack (clean/minimal), Airbnb (trust), Pinterest (discovery) |
| **Tagline** | "Every Home Project Starts Here" |
| **Sub-tagline** | "Plan it. Source it. Build it. — Whether you DIY or hire a pro." |

---

## Color Palette

### Primary

| Token | Hex | Tailwind | Usage |
|-------|-----|----------|-------|
| `primary` | `#059669` | `emerald-600` | Buttons, links, active states, logo |
| `primary-dark` | `#047857` | `emerald-700` | Hover states, active, gradients |
| `primary-light` | `#D1FAE5` | `emerald-100` | Subtle backgrounds, badges, callout boxes |
| `primary-50` | `#ECFDF5` | `emerald-50` | Selected card tints, sidebar active bg |

### Secondary & Neutrals

| Token | Hex | Tailwind | Usage |
|-------|-----|----------|-------|
| `secondary` | `#334155` | `slate-700` | Headings, body text, nav links |
| `text-primary` | `#1E293B` | `slate-800` | Large headings, bold emphasis |
| `text-secondary` | `#64748B` | `slate-500` | Subtitles, descriptions, helper text |
| `text-muted` | `#94A3B8` | `slate-400` | Captions, timestamps, placeholders |
| `border` | `#E2E8F0` | `slate-200` | Input borders, card borders, dividers |
| `surface` | `#F8FAFC` | `slate-50` | Page backgrounds, section backgrounds |
| `card` | `#FFFFFF` | `white` | Cards, containers, modals, nav bar |

### Accent & Semantic

| Token | Hex | Tailwind | Usage |
|-------|-----|----------|-------|
| `accent-warm` | `#F59E0B` | `amber-500` | Star ratings, warnings, "NEW" badges |
| `accent-red` | `#EF4444` | `red-500` | Errors, destructive actions, disputes |
| `success` | `#22C55E` | `green-500` | Verified badges, completed states, "in stock" |
| `info` | `#3B82F6` | `blue-500` | Informational badges, "ID Verified" tier |
| `orange` | `#F97316` | `orange-500` | Home Depot branding, external retailer CTAs |

### Verification Tier Colors

| Tier | Badge Color | Icon |
|------|-------------|------|
| New | `slate-300` bg / `slate-600` text | Gray circle |
| ID Verified | `blue-500` bg / white text | Blue circle |
| Background Checked | `green-500` bg / white text | Green shield |
| Fully Verified | `green-500` bg / white text | Green shield + star |

---

## Typography

**Font Family:** [Inter](https://fonts.google.com/specimen/Inter) (Google Fonts)

| Level | Size | Weight | Tracking | Line Height | Color |
|-------|------|--------|----------|-------------|-------|
| H1 | 36–44px | Bold (700) | Tight (-0.025em) | 1.2 | `slate-800` |
| H2 | 28px | Bold (700) | Tight | 1.3 | `slate-800` |
| H3 | 22px | Semibold (600) | Normal | 1.4 | `slate-800` |
| H4 | 18–20px | Semibold (600) | Normal | 1.4 | `slate-800` |
| Body | 16px | Regular (400) | Normal | 1.6 | `slate-700` |
| Body Small | 14px | Medium (500) | Normal | 1.5 | `slate-500` |
| Caption | 12–13px | Regular (400) | Normal | 1.4 | `slate-400` |
| Label | 11px | Medium (500) | Wide (0.05em), Uppercase | 1.0 | `slate-400` |

### Heading Usage Conventions

- **Page titles:** H1 (36px on desktop, 28px on mobile)
- **Section headers:** H2 (28px) — e.g., "How It Works", "My Active Projects"
- **Card titles:** H3 (22px) or H4 (18–20px)
- **Wizard step titles:** H2 inside card containers

---

## Spacing & Layout

### Spacing Scale

| Token | Value | Usage |
|-------|-------|-------|
| `xs` | 4px | Inline icon gaps |
| `sm` | 8px | Badge padding, tight gaps |
| `md` | 12–16px | Card gaps, filter chip gaps, list item spacing |
| `lg` | 20–24px | Card internal padding, section gaps |
| `xl` | 32px | Page padding, main content margins |
| `2xl` | 40px | Wizard card internal padding |
| `3xl` | 60–100px | Hero section vertical padding |

### Layout Patterns

| Pattern | Specification |
|---------|---------------|
| **Page max-width** | 1440px (desktop), 390px (mobile) |
| **Content max-width** | 1200px centered with auto margins |
| **Wizard card max-width** | 700–800px centered |
| **Sidebar width** | 240px fixed |
| **Top nav height** | 56px |
| **Card grid gap** | 16–24px |
| **Split view** | 60/40 (map/list) or 62/38 (main/sidebar) |

### Breakpoints

| Breakpoint | Width | Usage |
|------------|-------|-------|
| Mobile | 390px | Single column, stacked tiles, hamburger nav |
| Desktop | 1280–1440px | Multi-column, sidebar nav, split views |

---

## Component Library

### Buttons

| Variant | Background | Text | Border | Usage |
|---------|-----------|------|--------|-------|
| **Primary** | `emerald-600` | White | None | Main CTAs: "Get Started", "Start Planning", "Approve" |
| **Secondary / Outlined** | White | `emerald-600` | `emerald-600` 1.5px | Secondary CTAs: "Learn More", "Find a Pro", "View Profile" |
| **Ghost** | Transparent | `emerald-600` | None | Tertiary actions: "Cancel", text links |
| **Destructive** | `red-500` | White | None | Danger actions: "Delete Project", "Open Dispute" |
| **External/Retailer** | `orange-500` | White | None | Affiliate links: "Reserve on HomeDepot.com" |

**Button specs:** `rounded-lg` (8px), medium padding (`px-6 py-3`), `font-medium`, subtle shadow on primary.

### Cards

| Property | Value |
|----------|-------|
| Background | `#FFFFFF` (white) |
| Border radius | `rounded-xl` (12px) |
| Shadow | `shadow-sm` (0 1px 2px rgba(0,0,0,0.05)) |
| Padding | 24–32px internal |
| Border (optional) | `slate-200` for subtle, `emerald-600` for emphasis |

**Card variants:**
- **Standard card** — White, shadow-sm, rounded-xl
- **Selected card** — Emerald border (2px), emerald-50 tint, checkmark indicator
- **Emphasized card** — Emerald left/top border (3–4px), optional badge
- **CTA card** — Emerald gradient background (`#059669` to `#047857`), white text
- **Warning card** — Amber-50 bg, amber-500 left border (4px)
- **Info card** — Emerald-50 bg, emerald icon, emerald-700 text

### Badges / Pills

All badges: `rounded-full`, small (`px-3 py-1`), `text-xs` or `text-sm` `font-medium`.

| Badge | Background | Text | Usage |
|-------|-----------|------|-------|
| Category | `emerald-100` | `emerald-700` | "Bathroom", "Plumbing" |
| Category (alt) | `blue-100` | `blue-600` | "Electrical" |
| Verified | `green-500` | White | "Verified" with checkmark |
| Pending | `amber-500` | White | "Pending" |
| Pro Member | `emerald-600` | White | "Pro Member" with star |
| NEW | `amber-500` | White | Projects < 24hrs old |
| AI-Scoped | `emerald-600` outlined | `emerald-600` | "AI-Scoped" with checkmark |
| Most Popular | `emerald-600` | White | Featured tile emphasis |
| Save Money | `amber-500` | White | Cost-saving option highlight |
| Best Price | `green-500` | White | Cheapest rental/price |
| Closest | `blue-500` | White | Nearest location |
| Skill Level | `amber-500` | White | "INTERMEDIATE", "BEGINNER" |
| Status: In Progress | `emerald-600` | White | Active project status |
| Status: Completed | `green-500` | White | Finished milestone |
| FREE | `emerald-600` | White | Launch pricing indicator |

### Form Inputs

| State | Border | Ring | Label | Helper Text |
|-------|--------|------|-------|------------|
| Default | `slate-200` | None | `slate-700` above | `slate-400` |
| Focus | `emerald-500` | `ring-2 ring-emerald-500/20` | `emerald-600` | — |
| Error | `red-500` | `ring-2 ring-red-500/20` | `red-600` | `red-500` below |
| Disabled | `slate-100` bg | None | `slate-300` | Reduced opacity |

**Input specs:** `rounded-lg` (8px), `px-4 py-3`, 16px font, `slate-800` text.

### Navigation

#### Top Navigation Bar (Public Pages)
- White background, subtle bottom shadow (`shadow-sm`)
- Height: 56px, sticky
- Left: HandyHub logo (bold `emerald-600` + home icon)
- Right: Text links in `slate-700`, primary CTA button ("Get Started Free")
- Mobile: Hamburger menu icon replaces right-side links

#### Sidebar Navigation (Dashboard/App Pages)
- Width: 240px, fixed, white background, right border
- Logo at top with 24px padding
- Nav items: Icon + text, 14px medium, 12px vertical padding
- Active state: `emerald-50` background, `emerald-700` text, 3px emerald left border
- Section dividers with uppercase 11px `slate-400` labels
- User profile at bottom with avatar + name + role

### Progress Indicators

#### Step Progress Bar (Wizards)
- Horizontal connected circles with labels below
- **Completed:** Emerald filled circle + white checkmark, emerald label
- **Active:** Emerald filled circle + white number, emerald bold label
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

### Milestone Timeline (Escrow)
- Vertical emerald line connecting circle nodes
- **Completed:** Emerald circle + white checkmark, muted card
- **In Progress:** Emerald circle + pulsing ring, emerald-bordered card (active)
- **Pending:** Gray empty circle, muted/low-contrast card

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
│      │ (slate-50 bg, 32px pad)  │
│      │                          │
└──────┴──────────────────────────┘
```

### Wizard Pages
```
┌─────────────────────────────────┐
│ Top Nav (minimal: logo + exit)  │
├─────────────────────────────────┤
│ Page Title + Subtitle (centered)│
│ Step Progress Bar (centered)    │
├─────────────────────────────────┤
│ ┌─────────────────────────┐     │
│ │ White Card (700-800px)  │     │
│ │ Form content            │     │
│ │ Back / Next buttons     │     │
│ └─────────────────────────┘     │
│         (slate-50 bg)           │
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

### Two-Column Content (Main + Sidebar)
```
┌─────────────────────────────────┐
│ Top Nav + Project Header        │
├─────────────────────┬───────────┤
│                     │           │
│ Main Content (62%)  │ Sidebar   │
│ Timeline / Table    │  (38%)   │
│                     │ Summary  │
│                     │ Actions  │
├─────────────────────┴───────────┤
│ Sticky Action Bar (optional)    │
└─────────────────────────────────┘
```

---

## Screen Inventory

### Project: HandyHub Landing Page (`12385649108249240626`)

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
      },
      maxWidth: {
        wizard: '800px',
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
| Navigation | `Home`, `Search`, `Bell`, `Settings`, `Menu`, `ChevronDown` |
| Projects | `Hammer`, `Wrench`, `HardHat`, `PaintBucket`, `Ruler` |
| Actions | `Camera`, `Upload`, `Download`, `Share`, `Bookmark`, `ExternalLink` |
| Status | `Check`, `CheckCircle`, `Clock`, `AlertTriangle`, `XCircle` |
| Commerce | `DollarSign`, `CreditCard`, `ShoppingCart`, `Tag` |
| Communication | `MessageSquare`, `Phone`, `Mail` |
| Users | `User`, `Users`, `Shield`, `ShieldCheck`, `Star` |
| Maps | `MapPin`, `Map`, `Navigation` |

---

## Interaction Patterns

### Hover States
- **Buttons:** Darken by one shade (emerald-600 -> emerald-700)
- **Cards:** Subtle shadow increase (`shadow-sm` -> `shadow-md`)
- **Links:** Underline on hover
- **Nav items:** `slate-100` background

### Selection States
- **Cards:** 2px emerald border + emerald-50 background tint + checkmark icon
- **Radio options:** Filled emerald circle with white inner dot
- **Toggle switches:** Emerald track when ON, slate-200 when OFF
- **Filter chips:** Emerald filled + white text when active

### Loading States
- **Milestone in progress:** Subtle pulsing emerald ring around node
- **Skeleton screens:** `slate-100` animated shimmer blocks
- **Buttons loading:** Spinner icon replacing text, disabled state

### Mobile Adaptations
- Top nav collapses to logo + hamburger
- Multi-column grids become single-column stacked
- Horizontal card rows become vertical stacks
- Sidebar nav becomes slide-out drawer
- Sticky bottom CTA bar with full-width button
- "How It Works" steps become horizontal scroll cards
- Trust strip becomes 2x2 grid

---

## AI Provider

| Provider | Usage |
|----------|-------|
| **Google Gemini** | Server-side AI features: project planning, materials list generation, cost estimation, contractor matching |
| **Nano Banana (Gemini)** | Client-side / lightweight AI tasks |

> **Note:** No OpenAI APIs are used in this project. All AI capabilities are powered by Google Gemini and Nano Banana.

---

## Stitch Project References

- **Main project:** `projects/12385649108249240626` — 14 screens
- **Design system:** `projects/16885425470418793566` — Style guide reference
- **Stitch MCP endpoint:** `https://stitch.googleapis.com/mcp`

All screens are viewable and editable in [Google Stitch](https://stitch.withgoogle.com).
