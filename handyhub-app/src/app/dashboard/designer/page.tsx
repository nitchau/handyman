"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Eye, Heart, TrendingUp, ClipboardList, DollarSign, MoreHorizontal, Plus, BarChart3, Pencil, ShoppingCart, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { DesignerStatCard, DesignerOrder, TopDesign } from "@/types/database";
import { OrderStatus } from "@/types/database";

const DESIGNER_ID = "00000000-0000-0000-0000-00000000dd01"; // TODO: use auth

const statusStyles: Record<string, { bg: string; dot: string; label: string }> = {
  [OrderStatus.IN_PROGRESS]: { bg: "bg-emerald-100 text-emerald-800", dot: "bg-emerald-500", label: "In Progress" },
  [OrderStatus.REVISION_REQUESTED]: { bg: "bg-amber-100 text-amber-800", dot: "bg-amber-500", label: "Revision Requested" },
  [OrderStatus.SCHEDULED]: { bg: "bg-blue-100 text-blue-800", dot: "bg-blue-500", label: "Scheduled" },
  [OrderStatus.NEW]: { bg: "bg-slate-100 text-slate-800", dot: "bg-slate-500", label: "New" },
  [OrderStatus.COMPLETED]: { bg: "bg-slate-100 text-slate-600", dot: "bg-slate-400", label: "Completed" },
  [OrderStatus.CANCELLED]: { bg: "bg-red-100 text-red-800", dot: "bg-red-500", label: "Cancelled" },
  requested: { bg: "bg-blue-100 text-blue-800", dot: "bg-blue-500", label: "Requested" },
  accepted: { bg: "bg-emerald-100 text-emerald-800", dot: "bg-emerald-500", label: "Accepted" },
  delivered: { bg: "bg-purple-100 text-purple-800", dot: "bg-purple-500", label: "Delivered" },
};

const iconMap: Record<string, React.ElementType> = {
  Eye,
  Heart,
  ClipboardList,
  DollarSign,
};

export default function DesignerDashboardPage() {
  const [designerName, setDesignerName] = useState("Designer");
  const [stats, setStats] = useState<DesignerStatCard[]>([]);
  const [orders, setOrders] = useState<DesignerOrder[]>([]);
  const [topDesigns, setTopDesigns] = useState<TopDesign[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(`/api/designer/dashboard?designer_id=${DESIGNER_ID}`);
        if (!res.ok) return;
        const { data } = await res.json();
        setDesignerName(data.designer_name ?? "Designer");
        setStats(data.stats ?? []);
        setOrders(data.orders ?? []);
        setTopDesigns(data.topDesigns ?? []);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="size-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Welcome */}
      <div>
        <h2 className="text-2xl font-bold text-slate-900">Welcome back, {designerName.split(" ")[0]}</h2>
        <p className="text-slate-500">Here is what is happening with your design studio today.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = iconMap[stat.icon] ?? Eye;
          return (
            <Card key={stat.label} className="group hover:border-emerald-200 transition-colors">
              <CardContent className="flex h-[140px] flex-col justify-between p-6">
                <div className="flex items-start justify-between">
                  <div className={cn("rounded-lg p-2", stat.iconBg)}>
                    <Icon className={cn("size-5", stat.iconColor)} />
                  </div>
                  {stat.trend && (
                    <span className="flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-sm font-medium text-emerald-600">
                      <TrendingUp className="size-3.5" /> {stat.trend}
                    </span>
                  )}
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-500">{stat.label}</p>
                  <h3 className="text-2xl font-bold text-slate-900">{stat.value}</h3>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Active Orders Table */}
      <Card>
        <div className="flex items-center justify-between border-b px-6 py-4">
          <h3 className="text-lg font-semibold text-slate-800">Recent Active Orders</h3>
          <Link href="/dashboard/orders" className="text-sm font-medium text-primary hover:text-emerald-700">
            View All
          </Link>
        </div>
        {orders.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600">
              <thead className="bg-slate-50 text-xs font-semibold uppercase text-slate-500">
                <tr>
                  <th className="px-6 py-4">Client</th>
                  <th className="px-6 py-4">Project</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Date</th>
                  <th className="px-6 py-4 text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {orders.map((order) => {
                  const style = statusStyles[order.status] ?? statusStyles[OrderStatus.NEW];
                  return (
                    <tr key={order.id} className="transition-colors hover:bg-slate-50">
                      <td className="px-6 py-4 font-medium text-slate-900">{order.client_name}</td>
                      <td className="px-6 py-4">{order.project_title}</td>
                      <td className="px-6 py-4">
                        <span className={cn("inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium", style.bg)}>
                          <span className={cn("size-1.5 rounded-full", style.dot)} />
                          {style.label}
                        </span>
                      </td>
                      <td className="px-6 py-4">{order.due_date}</td>
                      <td className="px-6 py-4 text-right font-medium">${order.amount.toFixed(2)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="px-6 py-8 text-center text-sm text-slate-400">
            No active orders yet. Share your designs to attract clients!
          </div>
        )}
      </Card>

      {/* Top Performing Designs */}
      <div className="space-y-4">
        <div className="flex items-end justify-between">
          <h3 className="text-lg font-bold text-slate-900">Top Performing Designs</h3>
          <Link href="/designs" className="flex items-center gap-1 text-sm font-medium text-slate-500 hover:text-primary">
            View All Designs &rarr;
          </Link>
        </div>
        {topDesigns.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-3">
            {topDesigns.map((design) => (
              <Link key={design.id} href={`/designs/${design.id}`}>
                <Card className="group overflow-hidden hover:shadow-md transition-shadow">
                  <div className="relative h-48 overflow-hidden bg-slate-200">
                    <Image
                      src={design.image_url}
                      alt={design.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 flex items-end bg-gradient-to-t from-black/60 to-transparent p-4 opacity-0 transition-opacity group-hover:opacity-100">
                      <p className="text-sm font-medium text-white">{design.title}</p>
                    </div>
                  </div>
                  <CardContent className="p-4">
                    <div className="mb-3 flex items-center justify-between">
                      <div className="flex items-center gap-4 text-sm text-slate-500">
                        <span className="flex items-center gap-1"><Eye className="size-4" /> {design.views >= 1000 ? `${(design.views / 1000).toFixed(1)}k` : design.views}</span>
                        <span className="flex items-center gap-1"><Heart className="size-4" /> {design.likes}</span>
                      </div>
                      <button className="text-slate-400 hover:text-primary" onClick={(e) => e.preventDefault()}>
                        <MoreHorizontal className="size-5" />
                      </button>
                    </div>
                    <Button variant="outline" className="w-full hover:bg-emerald-50 hover:text-emerald-700" onClick={(e) => e.preventDefault()}>
                      <BarChart3 className="mr-2 size-4" /> View Analytics
                    </Button>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="py-8 text-center text-sm text-slate-400">
              Upload your first design to start tracking performance!
            </CardContent>
          </Card>
        )}
      </div>

      {/* Bottom Row: Quick Actions + Commission Earnings */}
      <div className="grid gap-6 pb-8 lg:grid-cols-3">
        {/* Quick Actions */}
        <Card>
          <CardContent className="flex flex-col gap-4 p-6">
            <h3 className="text-lg font-bold text-slate-900">Quick Actions</h3>
            <Link href="/dashboard/upload">
              <Button className="w-full"><Plus className="mr-2 size-4" /> Upload New Idea</Button>
            </Link>
            <Link href="/dashboard/services/new">
              <Button variant="outline" className="w-full"><Pencil className="mr-2 size-4" /> Edit Services</Button>
            </Link>
            <Button variant="ghost" className="w-full text-slate-500 hover:text-primary">
              <BarChart3 className="mr-2 size-4" /> Full Analytics Report
            </Button>
          </CardContent>
        </Card>

        {/* Commission Earnings */}
        <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-slate-900 to-slate-800 p-6 text-white shadow-md lg:col-span-2">
          <div className="absolute -right-10 -top-10 size-64 rounded-full bg-emerald-500/10 blur-3xl" />
          <div className="relative z-10">
            <div className="mb-6 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
              <div>
                <h3 className="flex items-center gap-2 text-lg font-bold">
                  <ShoppingCart className="size-5 text-emerald-400" /> Commission Earnings
                </h3>
                <p className="mt-1 text-sm text-slate-400">From product clicks in your designs</p>
              </div>
              <button className="rounded-lg bg-slate-700 px-3 py-1.5 text-xs transition-colors hover:bg-slate-600">
                View Details
              </button>
            </div>
            <div className="grid grid-cols-1 items-end gap-6 sm:grid-cols-2">
              <div>
                <p className="mb-1 text-xs font-semibold uppercase text-slate-400">Estimated Commissions</p>
                <div className="flex items-baseline gap-2">
                  <h2 className="text-4xl font-bold">$127.40</h2>
                  <span className="flex items-center text-sm font-medium text-emerald-400">
                    <TrendingUp className="size-4" /> +15%
                  </span>
                </div>
                <p className="mt-2 text-xs text-slate-500">Pending payout for Feb 2026</p>
              </div>
              <div className="rounded-lg border border-slate-700 bg-slate-800/50 p-4">
                <p className="mb-2 text-xs font-medium text-slate-400">Top Performing Product</p>
                <div className="flex items-center gap-3">
                  <div className="flex size-10 items-center justify-center rounded bg-slate-700 text-slate-400">
                    <ShoppingCart className="size-5" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold">Velvet Green Sofa</p>
                    <p className="text-xs text-slate-400">42 clicks &middot; $12.50 earned</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
