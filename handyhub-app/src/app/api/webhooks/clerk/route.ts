import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { Webhook } from "svix";
import { supabaseAdmin } from "@/lib/supabase/server";

// Clerk webhook event types we handle
type ClerkEventType =
  | "user.created"
  | "user.updated"
  | "user.deleted";

interface ClerkEmailAddress {
  email_address: string;
  id: string;
}

interface ClerkUserData {
  id: string;
  email_addresses: ClerkEmailAddress[];
  primary_email_address_id: string;
  first_name: string | null;
  last_name: string | null;
  image_url: string | null;
  phone_numbers: { phone_number: string }[];
  public_metadata: Record<string, unknown>;
  unsafe_metadata: Record<string, unknown>;
}

interface ClerkWebhookEvent {
  type: ClerkEventType;
  data: ClerkUserData;
}

export async function POST(req: Request) {
  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;
  if (!WEBHOOK_SECRET) {
    console.error("Missing CLERK_WEBHOOK_SECRET");
    return NextResponse.json(
      { error: "Server misconfigured" },
      { status: 500 }
    );
  }

  // Verify the webhook signature
  const headerPayload = await headers();
  const svixId = headerPayload.get("svix-id");
  const svixTimestamp = headerPayload.get("svix-timestamp");
  const svixSignature = headerPayload.get("svix-signature");

  if (!svixId || !svixTimestamp || !svixSignature) {
    return NextResponse.json(
      { error: "Missing svix headers" },
      { status: 400 }
    );
  }

  const body = await req.text();
  const wh = new Webhook(WEBHOOK_SECRET);

  let event: ClerkWebhookEvent;
  try {
    event = wh.verify(body, {
      "svix-id": svixId,
      "svix-timestamp": svixTimestamp,
      "svix-signature": svixSignature,
    }) as ClerkWebhookEvent;
  } catch (err) {
    console.error("Webhook signature verification failed:", err);
    return NextResponse.json(
      { error: "Invalid signature" },
      { status: 400 }
    );
  }

  const { type, data } = event;

  try {
    switch (type) {
      case "user.created":
        await handleUserCreated(data);
        break;
      case "user.updated":
        await handleUserUpdated(data);
        break;
      case "user.deleted":
        await handleUserDeleted(data);
        break;
      default:
        console.log(`[webhook] Unhandled event type: ${type}`);
    }
  } catch (err) {
    console.error(`[webhook] Error handling ${type}:`, err);
    return NextResponse.json(
      { error: "Webhook handler failed" },
      { status: 500 }
    );
  }

  return NextResponse.json({ received: true });
}

// ── Handlers ──────────────────────────────────────────────────────────

function getPrimaryEmail(data: ClerkUserData): string {
  const primary = data.email_addresses.find(
    (e) => e.id === data.primary_email_address_id
  );
  return primary?.email_address ?? data.email_addresses[0]?.email_address ?? "";
}

async function handleUserCreated(data: ClerkUserData) {
  const email = getPrimaryEmail(data);
  const role = (data.public_metadata?.role as string) ?? "homeowner";

  const { error } = await supabaseAdmin.from("users_profile").insert({
    clerk_id: data.id,
    email,
    first_name: data.first_name ?? "",
    last_name: data.last_name ?? "",
    avatar_url: data.image_url,
    role,
    phone: data.phone_numbers?.[0]?.phone_number ?? null,
    onboarding_completed: false,
  });

  if (error) {
    // Duplicate clerk_id means the user already exists — treat as update
    if (error.code === "23505") {
      console.log("[webhook] User already exists, updating:", data.id);
      await handleUserUpdated(data);
      return;
    }
    throw error;
  }

  console.log("[webhook] Created user profile:", data.id, email, role);
}

async function handleUserUpdated(data: ClerkUserData) {
  const email = getPrimaryEmail(data);
  const role = (data.public_metadata?.role as string) ?? undefined;

  const updates: Record<string, unknown> = {
    email,
    first_name: data.first_name ?? "",
    last_name: data.last_name ?? "",
    avatar_url: data.image_url,
    phone: data.phone_numbers?.[0]?.phone_number ?? null,
  };

  // Only update role if explicitly set in publicMetadata
  if (role) {
    updates.role = role;
  }

  const { error } = await supabaseAdmin
    .from("users_profile")
    .update(updates)
    .eq("clerk_id", data.id);

  if (error) throw error;
  console.log("[webhook] Updated user profile:", data.id);
}

async function handleUserDeleted(data: ClerkUserData) {
  const { error } = await supabaseAdmin
    .from("users_profile")
    .delete()
    .eq("clerk_id", data.id);

  if (error) throw error;
  console.log("[webhook] Deleted user profile:", data.id);
}
