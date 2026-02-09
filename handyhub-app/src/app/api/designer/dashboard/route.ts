import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/server";

// GET /api/designer/dashboard?designer_id=...
// Returns aggregated stats, recent orders, and top designs for a designer
export async function GET(req: NextRequest) {
  const designerId = req.nextUrl.searchParams.get("designer_id");
  if (!designerId) {
    return NextResponse.json({ error: "designer_id is required" }, { status: 400 });
  }

  // Fetch designer profile for aggregate counts
  const { data: profile } = await supabaseAdmin
    .from("designer_profiles")
    .select("display_name, total_ideas_posted, total_likes, rating_avg, review_count")
    .eq("id", designerId)
    .single();

  // Fetch all design ideas to compute view/like totals from live data
  const { data: ideas } = await supabaseAdmin
    .from("design_ideas")
    .select("id, title, primary_photo_url, view_count, like_count, save_count")
    .eq("designer_id", designerId)
    .eq("is_published", true)
    .order("view_count", { ascending: false });

  const totalViews = (ideas ?? []).reduce((sum, d) => sum + (d.view_count ?? 0), 0);
  const totalLikes = (ideas ?? []).reduce((sum, d) => sum + (d.like_count ?? 0), 0);

  // Fetch active orders (not completed/cancelled/refunded)
  const { data: orders } = await supabaseAdmin
    .from("designer_orders")
    .select("id, status, price_agreed, designer_payout, client_notes, created_at, updated_at, service:designer_services!service_id(title), client:users_profile!client_id(first_name, last_name)")
    .eq("designer_id", designerId)
    .in("status", ["requested", "accepted", "in_progress", "revision_requested", "delivered"])
    .order("created_at", { ascending: false })
    .limit(10);

  // Fetch completed orders this month for earnings
  const monthStart = new Date();
  monthStart.setDate(1);
  monthStart.setHours(0, 0, 0, 0);

  const { data: completedOrders } = await supabaseAdmin
    .from("designer_orders")
    .select("designer_payout")
    .eq("designer_id", designerId)
    .eq("status", "completed")
    .gte("completed_at", monthStart.toISOString());

  const monthlyEarnings = (completedOrders ?? []).reduce(
    (sum, o) => sum + (Number(o.designer_payout) || 0),
    0
  );

  // Build stats
  const activeOrderCount = (orders ?? []).length;

  const stats = [
    {
      label: "Portfolio Views",
      value: totalViews.toLocaleString(),
      trend: "",
      trendDirection: "neutral" as const,
      iconBg: "bg-emerald-50",
      iconColor: "text-emerald-600",
      icon: "Eye",
    },
    {
      label: "Total Likes",
      value: totalLikes.toLocaleString(),
      trend: "",
      trendDirection: "neutral" as const,
      iconBg: "bg-purple-50",
      iconColor: "text-purple-600",
      icon: "Heart",
    },
    {
      label: "Active Orders",
      value: String(activeOrderCount),
      trend: "",
      trendDirection: "neutral" as const,
      iconBg: "bg-blue-50",
      iconColor: "text-blue-600",
      icon: "ClipboardList",
    },
    {
      label: "Earnings This Month",
      value: `$${monthlyEarnings.toFixed(2)}`,
      trend: "",
      trendDirection: "neutral" as const,
      iconBg: "bg-amber-50",
      iconColor: "text-amber-600",
      icon: "DollarSign",
    },
  ];

  // Build orders list
  const ordersList = (orders ?? []).map((o) => {
    const clientRaw = o.client;
    const client = Array.isArray(clientRaw) ? clientRaw[0] as { first_name: string; last_name: string } | undefined : clientRaw as { first_name: string; last_name: string } | null;
    const serviceRaw = o.service;
    const service = Array.isArray(serviceRaw) ? serviceRaw[0] as { title: string } | undefined : serviceRaw as { title: string } | null;
    return {
      id: o.id,
      client_name: client ? `${client.first_name} ${client.last_name?.charAt(0)}.` : "Client",
      project_title: service?.title ?? "Order",
      status: o.status,
      due_date: new Date(o.updated_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
      amount: Number(o.price_agreed) || 0,
    };
  });

  // Top 3 designs by views
  const topDesigns = (ideas ?? []).slice(0, 3).map((d) => ({
    id: d.id,
    title: d.title,
    image_url: d.primary_photo_url,
    views: d.view_count ?? 0,
    likes: d.like_count ?? 0,
  }));

  return NextResponse.json({
    data: {
      designer_name: profile?.display_name ?? "Designer",
      stats,
      orders: ordersList,
      topDesigns,
    },
  });
}
