import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/server";
import { quoteRequestSchema } from "@/lib/validations/quote";
import { sendQuoteNotification } from "@/lib/resend";

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function POST(req: NextRequest, { params }: RouteContext) {
  const { id } = await params;

  // 1. Parse & validate body
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const result = quoteRequestSchema.safeParse(body);
  if (!result.success) {
    return NextResponse.json(
      { error: "Validation failed", issues: result.error.flatten().fieldErrors },
      { status: 400 }
    );
  }

  const { description, timeline, zip_code, sender_name, sender_email } =
    result.data;

  // 2. Verify contractor exists & fetch email server-side
  const { data: contractor, error: contractorErr } = await supabaseAdmin
    .from("contractors")
    .select(
      `
      id,
      business_name,
      users_profile!contractors_user_id_fkey (
        first_name,
        email
      )
    `
    )
    .eq("id", id)
    .single();

  if (contractorErr || !contractor) {
    return NextResponse.json(
      { error: "Contractor not found" },
      { status: 404 }
    );
  }

  // 3. Insert quote request
  const { error: insertErr } = await supabaseAdmin
    .from("quote_requests")
    .insert({
      contractor_id: id,
      description,
      timeline,
      zip_code,
      sender_name: sender_name || null,
      sender_email: sender_email || null,
    });

  if (insertErr) {
    return NextResponse.json(
      { error: "Failed to save quote request" },
      { status: 500 }
    );
  }

  // 4. Send email notification (non-blocking — failure doesn't fail the request)
  const profile = contractor.users_profile as unknown as {
    first_name: string;
    email: string;
  };

  if (profile.email) {
    try {
      await sendQuoteNotification({
        contractorEmail: profile.email,
        contractorName:
          contractor.business_name || profile.first_name,
        description,
        timeline,
        zipCode: zip_code,
        senderName: sender_name || undefined,
        senderEmail: sender_email || undefined,
      });
    } catch {
      // Email failure is non-critical — quote is already saved
      console.error("Failed to send quote notification email");
    }
  }

  return NextResponse.json({ success: true }, { status: 201 });
}
