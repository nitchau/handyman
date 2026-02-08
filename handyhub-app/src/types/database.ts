// ── Enums ──────────────────────────────────────────────────────────────

export enum UserRole {
  DIY_USER = "diy_user",
  HOMEOWNER = "homeowner",
  CONTRACTOR = "contractor",
  ADMIN = "admin",
}

export enum VerificationTier {
  NEW = "new",
  ID_VERIFIED = "id_verified",
  BACKGROUND_CHECKED = "background_checked",
  FULLY_VERIFIED = "fully_verified",
}

export enum ProjectStatus {
  DRAFT = "draft",
  POSTED = "posted",
  IN_PROGRESS = "in_progress",
  COMPLETED = "completed",
  CANCELLED = "cancelled",
}

export enum MilestoneStatus {
  PENDING = "pending",
  IN_PROGRESS = "in_progress",
  COMPLETED = "completed",
  PAID = "paid",
}

// ── Interfaces ─────────────────────────────────────────────────────────

export interface UserProfile {
  id: string;
  clerk_id: string;
  email: string;
  first_name: string;
  last_name: string;
  avatar_url: string | null;
  role: UserRole;
  phone: string | null;
  zip_code: string | null;
  onboarding_completed: boolean;
  created_at: string;
  updated_at: string;
}

export interface Contractor {
  id: string;
  user_id: string;
  business_name: string;
  bio: string | null;
  years_experience: number;
  hourly_rate: number | null;
  service_radius_miles: number;
  verification_tier: VerificationTier;
  license_number: string | null;
  insurance_verified: boolean;
  rating_avg: number;
  review_count: number;
  latitude: number | null;
  longitude: number | null;
  created_at: string;
  updated_at: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  icon_name: string;
  description: string;
  created_at: string;
}

export interface ContractorSkill {
  id: string;
  contractor_id: string;
  category_id: string;
  created_at: string;
}

export interface Project {
  id: string;
  user_id: string;
  title: string;
  description: string;
  category_id: string;
  status: ProjectStatus;
  budget_min: number | null;
  budget_max: number | null;
  zip_code: string;
  photos: string[];
  ai_plan_json: Record<string, unknown> | null;
  assigned_contractor_id: string | null;
  created_at: string;
  updated_at: string;
}

export interface Milestone {
  id: string;
  project_id: string;
  title: string;
  description: string | null;
  amount: number;
  status: MilestoneStatus;
  order: number;
  due_date: string | null;
  completed_at: string | null;
  created_at: string;
}

export interface BOMItem {
  id: string;
  project_id: string;
  name: string;
  quantity: number;
  unit: string;
  estimated_price: number | null;
  retailer_url: string | null;
  category: string;
  notes: string | null;
  created_at: string;
}
