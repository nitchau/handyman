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

/** @deprecated Use BomItem instead */
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

// ── BOM Engine Enums ──────────────────────────────────────────────────

export enum SpaceType {
  BATHROOM = "bathroom",
  KITCHEN = "kitchen",
  BEDROOM = "bedroom",
  LIVING_ROOM = "living_room",
  GARAGE = "garage",
  BASEMENT = "basement",
  ATTIC = "attic",
  OUTDOOR = "outdoor",
  LAUNDRY = "laundry",
  OTHER = "other",
}

export enum AIAnalysisStatus {
  IDLE = "idle",
  UPLOADING = "uploading",
  ANALYZING = "analyzing",
  COMPLETE = "complete",
  ERROR = "error",
}

export enum ConfidenceTier {
  AI_ESTIMATE = "ai_estimate",
  PRO_VERIFIED = "pro_verified",
  COMMUNITY_VALIDATED = "community_validated",
}

export enum BomItemType {
  MATERIAL = "material",
  TOOL = "tool",
  SAFETY = "safety",
  CONSUMABLE = "consumable",
}

export enum Retailer {
  HOME_DEPOT = "home_depot",
  LOWES = "lowes",
  AMAZON = "amazon",
}

export enum VerificationStatus {
  UNVERIFIED = "unverified",
  PENDING = "pending",
  VERIFIED = "verified",
}

// ── BOM Engine Interfaces ─────────────────────────────────────────────

export interface RoomDimensions {
  length_ft: number;
  width_ft: number;
  height_ft: number;
}

export interface ProductPriceComparison {
  retailer: Retailer;
  price: number;
  url: string;
  in_stock: boolean;
}

export interface BomItem {
  id: string;
  name: string;
  type: BomItemType;
  quantity: number;
  unit: string;
  confidence: number;
  prices: ProductPriceComparison[];
  notes: string | null;
}

export interface BomToolRequirement {
  id: string;
  name: string;
  owned: boolean;
  rental_price_per_day: number | null;
  purchase_price: number | null;
}

export interface BomVerification {
  status: VerificationStatus;
  verified_by: string | null;
  verified_at: string | null;
  notes: string | null;
}

export interface BomProject {
  id: string;
  title: string;
  category_slug: string;
  space_type: SpaceType;
  description: string;
  dimensions: RoomDimensions | null;
  photo_urls: string[];
  confidence_tier: ConfidenceTier;
  confidence_score: number;
  items: BomItem[];
  tools: BomToolRequirement[];
  labor_hours_min: number;
  labor_hours_max: number;
  labor_cost_min: number;
  labor_cost_max: number;
  difficulty: "easy" | "moderate" | "hard";
  verification: BomVerification;
  created_at: string;
  updated_at: string;
}
