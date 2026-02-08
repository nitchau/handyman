// ── Enums ──────────────────────────────────────────────────────────────

export enum UserRole {
  DIY_USER = "diy_user",
  HOMEOWNER = "homeowner",
  CONTRACTOR = "contractor",
  DESIGNER = "designer",
  ADMIN = "admin",
}

export enum DesignerTier {
  CREATOR = "creator",
  VERIFIED = "verified",
  FEATURED = "featured",
}

export enum DesignStyle {
  MODERN = "modern",
  FARMHOUSE = "farmhouse",
  MID_CENTURY = "mid_century",
  SCANDINAVIAN = "scandinavian",
  INDUSTRIAL = "industrial",
  BOHEMIAN = "bohemian",
  COASTAL = "coastal",
  MINIMALIST = "minimalist",
  TRANSITIONAL = "transitional",
}

export enum RoomType {
  BATHROOM = "bathroom",
  KITCHEN = "kitchen",
  LIVING_ROOM = "living_room",
  BEDROOM = "bedroom",
  HOME_OFFICE = "home_office",
  DINING_ROOM = "dining_room",
  OUTDOOR = "outdoor",
  LAUNDRY = "laundry",
  NURSERY = "nursery",
  ENTRYWAY = "entryway",
}

export enum Difficulty {
  BEGINNER = "beginner",
  INTERMEDIATE = "intermediate",
  ADVANCED = "advanced",
}

export enum OrderStatus {
  NEW = "new",
  IN_PROGRESS = "in_progress",
  REVISION_REQUESTED = "revision_requested",
  SCHEDULED = "scheduled",
  COMPLETED = "completed",
  CANCELLED = "cancelled",
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

// ── Preview Types ─────────────────────────────────────────────────────

export type PreviewStatus = "idle" | "generating" | "complete" | "error";

export interface PreviewConversationTurn {
  role: "user" | "model";
  text?: string;
  imageDataUrl?: string;
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

// ── Design Gallery Types ────────────────────────────────────────────────

export interface DesignerProfile {
  id: string;
  user_id: string;
  name: string;
  avatar_url: string;
  cover_url: string;
  tier: DesignerTier;
  location: string;
  accepts_remote: boolean;
  bio: string;
  specialties: DesignStyle[];
  room_types: RoomType[];
  credentials: string;
  social_links: { platform: string; url: string }[];
  rating_avg: number;
  review_count: number;
  design_count: number;
  total_likes: number;
  years_on_platform: number;
  response_time_hours: number;
}

export interface ProductTag {
  id: string;
  name: string;
  brand: string;
  category: string;
  price: string;
  retailer: string;
  retailer_url: string;
  image_url: string;
  position_x: number;
  position_y: number;
}

export interface DesignIdea {
  id: string;
  title: string;
  description: string;
  photos: string[];
  before_photo: string | null;
  room_type: RoomType;
  style: DesignStyle;
  difficulty: Difficulty;
  diy_friendly: boolean;
  budget: number;
  designer: DesignerProfile;
  product_tags: ProductTag[];
  likes: number;
  saves: number;
  views: number;
  is_featured: boolean;
  tags: string[];
  tips: string[];
  created_at: string;
}

export interface DesignService {
  id: string;
  designer_id: string;
  title: string;
  description: string;
  delivery_days: string;
  revisions: number;
  price: number;
}

export interface DesignReview {
  id: string;
  client_name: string;
  client_avatar: string;
  rating: number;
  service_title: string;
  text: string;
  designer_reply: string | null;
  created_at: string;
}

// ── Designer Dashboard Types ──────────────────────────────────────────

export interface DesignerOrder {
  id: string;
  client_name: string;
  project_title: string;
  status: OrderStatus;
  due_date: string;
  amount: number;
}

export interface DesignerStatCard {
  label: string;
  value: string;
  trend: string;
  trendDirection: "up" | "down" | "neutral";
  iconBg: string;
  iconColor: string;
  icon: string;
}

export interface TopDesign {
  id: string;
  title: string;
  image_url: string;
  views: number;
  likes: number;
}

// ── Upload Wizard Types ───────────────────────────────────────────────

export interface UploadWizardState {
  step: 1 | 2 | 3;
  photos: string[];
  heroIndex: number;
  beforePhoto: string | null;
  title: string;
  description: string;
  roomType: RoomType;
  style: DesignStyle;
  difficulty: Difficulty;
  diyFriendly: boolean;
  budget: string;
  tags: string[];
  productTags: { name: string; brand: string; price: string; category: string; url: string }[];
}

// ── Booking Types ─────────────────────────────────────────────────────

export interface BookingFormState {
  roomType: RoomType;
  photos: string[];
  dimensions: { length: number; width: number; height: number };
  styleLikes: string[];
  styleDislikes: string[];
  budget: number;
  notes: string;
}

// ── Contractor Search / Profile Types ─────────────────────────────────

export interface ContractorListing {
  id: string;
  name: string;
  avatar_url: string;
  cover_url: string;
  verified: boolean;
  rating_avg: number;
  review_count: number;
  location: string;
  distance_miles: number;
  specialties: string[];
  hourly_rate: number;
  bio: string;
  years_experience: number;
  completion_rate: number;
  credentials: string[];
  availability: { day: string; hours: string }[];
  portfolio: { id: string; title: string; image_url: string; category: string; location: string; year: string }[];
}

export interface ContractorReview {
  id: string;
  client_initials: string;
  client_name: string;
  rating: number;
  text: string;
  date: string;
  location: string;
  reply: string | null;
}

// ── Messaging Types ──────────────────────────────────────────────────

export interface ChatConversation {
  id: string;
  name: string;
  avatar_url: string;
  last_message: string;
  timestamp: string;
  unread: number;
  online: boolean;
  badge: string | null;
}

export interface ChatMessage {
  id: string;
  sender: "user" | "contractor";
  text: string;
  timestamp: string;
  image_url?: string;
  quote?: {
    id: string;
    title: string;
    amount: number;
    image_url: string;
    description: string;
  };
}

export interface ChatProject {
  id: string;
  title: string;
  status: string;
  amount: number;
  service_request_id: string;
}

// ── Tool Rental Types ────────────────────────────────────────────────

export interface ToolListing {
  id: string;
  name: string;
  image_url: string;
  category: string;
  rating: number;
  distance_miles: number;
  price_per_day: number;
  available: boolean;
  available_date?: string;
}

export interface ToolCategory {
  id: string;
  label: string;
  icon: string;
}
