// ── Site Config ────────────────────────────────────────────────────────

export const SITE = {
  name: "HandyHub",
  tagline: "Every Home Project Starts Here",
  description:
    "Plan it. Source it. Build it. — Whether you DIY or hire a pro.",
  url: "https://handyhub.com",
} as const;

// ── Roles ──────────────────────────────────────────────────────────────

export const ROLES = {
  diy_user: { label: "DIY Enthusiast", description: "I want to do it myself" },
  homeowner: {
    label: "Homeowner",
    description: "I need a contractor",
  },
  contractor: {
    label: "Contractor",
    description: "I'm a professional",
  },
  designer: {
    label: "Designer",
    description: "I create design inspiration",
  },
  admin: { label: "Admin", description: "Platform administrator" },
} as const;

// ── Categories ─────────────────────────────────────────────────────────

export const CATEGORIES = [
  { name: "Plumbing", slug: "plumbing", icon: "Wrench" },
  { name: "Electrical", slug: "electrical", icon: "Zap" },
  { name: "Painting", slug: "painting", icon: "Paintbrush" },
  { name: "Carpentry", slug: "carpentry", icon: "Hammer" },
  { name: "Roofing", slug: "roofing", icon: "Home" },
  { name: "Landscaping", slug: "landscaping", icon: "TreePine" },
  { name: "HVAC", slug: "hvac", icon: "Thermometer" },
  { name: "Flooring", slug: "flooring", icon: "Grid3x3" },
  { name: "Kitchen Remodel", slug: "kitchen-remodel", icon: "ChefHat" },
  { name: "Bathroom Remodel", slug: "bathroom-remodel", icon: "Bath" },
  { name: "General Handyman", slug: "general-handyman", icon: "HardHat" },
  { name: "Cleaning", slug: "cleaning", icon: "Sparkles" },
] as const;

// ── Dashboard Navigation ───────────────────────────────────────────────

export interface NavLink {
  label: string;
  href: string;
  icon: string;
}

export interface NavDivider {
  type: "divider";
}

export type NavItem = NavLink | NavDivider;

export const DASHBOARD_NAV: Record<string, NavItem[]> = {
  diy_user: [
    { label: "Dashboard", href: "/dashboard", icon: "LayoutDashboard" },
    { label: "My Projects", href: "/dashboard/projects", icon: "FolderOpen" },
    { label: "My Plans", href: "/dashboard/plans", icon: "ClipboardList" },
    { label: "Design Ideas", href: "/designs", icon: "Palette" },
    { label: "Plan a Project", href: "/plan", icon: "Lightbulb" },
    { label: "Tool Rentals", href: "/tools", icon: "Wrench" },
    { label: "Settings", href: "/dashboard/settings", icon: "Settings" },
  ],
  homeowner: [
    { label: "Dashboard", href: "/dashboard", icon: "LayoutDashboard" },
    { label: "My Projects", href: "/dashboard/projects", icon: "FolderOpen" },
    { label: "My Plans", href: "/dashboard/plans", icon: "ClipboardList" },
    { label: "Post a Project", href: "/dashboard/projects/new", icon: "PlusCircle" },
    { label: "Find a Contractor", href: "/contractors", icon: "Search" },
    { label: "Design Ideas", href: "/designs", icon: "Palette" },
    { label: "Tool Rentals", href: "/tools", icon: "Wrench" },
    { label: "Messages", href: "/dashboard/messages", icon: "MessageSquare" },
    { label: "Settings", href: "/dashboard/settings", icon: "Settings" },
  ],
  contractor: [
    { label: "Dashboard", href: "/dashboard", icon: "LayoutDashboard" },
    { label: "Find Work", href: "/dashboard/find-work", icon: "Briefcase" },
    { label: "My Projects", href: "/dashboard/projects", icon: "FolderOpen" },
    { label: "Messages", href: "/dashboard/messages", icon: "MessageSquare" },
    { label: "Settings", href: "/dashboard/settings", icon: "Settings" },
  ],
  designer: [
    { label: "Dashboard Home", href: "/dashboard", icon: "LayoutDashboard" },
    { label: "My Design Ideas", href: "/dashboard/designs", icon: "Palette" },
    { label: "Upload New Idea", href: "/dashboard/upload", icon: "PlusCircle" },
    { label: "My Services", href: "/dashboard/services", icon: "ShoppingBag" },
    { label: "Orders", href: "/dashboard/orders", icon: "ClipboardList" },
    { label: "Earnings", href: "/dashboard/earnings", icon: "DollarSign" },
    { label: "Analytics", href: "/dashboard/analytics", icon: "BarChart3" },
    { type: "divider" },
    { label: "Messages", href: "/dashboard/messages", icon: "MessageSquare" },
    { label: "Community", href: "/community", icon: "Users" },
    { type: "divider" },
    { label: "Settings", href: "/dashboard/settings", icon: "Settings" },
  ],
  admin: [
    { label: "Dashboard", href: "/dashboard", icon: "LayoutDashboard" },
    { label: "Users", href: "/dashboard/users", icon: "Users" },
    { label: "Projects", href: "/dashboard/projects", icon: "FolderOpen" },
    { label: "Settings", href: "/dashboard/settings", icon: "Settings" },
  ],
} as const;
