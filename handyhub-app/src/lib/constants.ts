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

export interface NavItem {
  label: string;
  href: string;
  icon: string;
}

export const DASHBOARD_NAV: Record<string, NavItem[]> = {
  diy_user: [
    { label: "Dashboard", href: "/dashboard", icon: "LayoutDashboard" },
    { label: "My Projects", href: "/dashboard/projects", icon: "FolderOpen" },
    { label: "My Plans", href: "/dashboard/plans", icon: "ClipboardList" },
    { label: "Plan a Project", href: "/plan", icon: "Lightbulb" },
    { label: "Tool Rentals", href: "/tools", icon: "Wrench" },
    { label: "Settings", href: "/dashboard/settings", icon: "Settings" },
  ],
  homeowner: [
    { label: "Dashboard", href: "/dashboard", icon: "LayoutDashboard" },
    { label: "My Projects", href: "/dashboard/projects", icon: "FolderOpen" },
    { label: "My Plans", href: "/dashboard/plans", icon: "ClipboardList" },
    { label: "Post a Project", href: "/dashboard/projects/new", icon: "PlusCircle" },
    { label: "Find a Contractor", href: "/search", icon: "Search" },
    { label: "Settings", href: "/dashboard/settings", icon: "Settings" },
  ],
  contractor: [
    { label: "Dashboard", href: "/dashboard", icon: "LayoutDashboard" },
    { label: "Find Work", href: "/dashboard/find-work", icon: "Briefcase" },
    { label: "My Projects", href: "/dashboard/projects", icon: "FolderOpen" },
    { label: "Settings", href: "/dashboard/settings", icon: "Settings" },
  ],
  admin: [
    { label: "Dashboard", href: "/dashboard", icon: "LayoutDashboard" },
    { label: "Users", href: "/dashboard/users", icon: "Users" },
    { label: "Projects", href: "/dashboard/projects", icon: "FolderOpen" },
    { label: "Settings", href: "/dashboard/settings", icon: "Settings" },
  ],
} as const;
