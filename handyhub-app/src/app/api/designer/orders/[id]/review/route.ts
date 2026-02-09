import { NextRequest, NextResponse } from "next/server";

interface RouteContext {
  params: Promise<{ id: string }>;
}

// POST /api/designer/orders/[id]/review — Client submits review
export async function POST(req: NextRequest, { params }: RouteContext) {
  const { id } = await params;
  const body = await req.json();

  if (!body.rating || body.rating < 1 || body.rating > 5) {
    return NextResponse.json(
      { error: "rating is required and must be 1-5" },
      { status: 400 }
    );
  }

  const review = {
    order_id: id,
    rating: body.rating,
    review_text: body.review_text ?? null,
    created_at: new Date().toISOString(),
  };

  console.log("[mock] Review submitted for order", id, "— rating:", body.rating);
  return NextResponse.json({ data: review }, { status: 201 });
}
