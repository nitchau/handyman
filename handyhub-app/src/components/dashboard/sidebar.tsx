"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";
import { DASHBOARD_NAV } from "@/lib/constants";
import { getIcon } from "@/lib/get-icon";

// Phase 1: hardcoded role — Phase 2 will read from Clerk/user store
const MOCK_ROLE = "diy_user";

export function Sidebar() {
  const pathname = usePathname();
  const navItems = DASHBOARD_NAV[MOCK_ROLE] ?? [];

  return (
    <aside className="flex h-screen w-60 flex-col border-r border-border bg-white">
      {/* Logo */}
      <div className="flex h-14 items-center gap-2 border-b border-border px-5">
        <Link href="/" className="flex items-center gap-2">
          <Home className="size-5 text-primary" />
          <span className="text-lg font-bold tracking-tight text-primary">
            HandyHub
          </span>
        </Link>
      </div>

      {/* Nav links */}
      <nav className="flex-1 overflow-y-auto px-3 py-4">
        <ul className="space-y-1">
          {navItems.map((item) => {
            const Icon = getIcon(item.icon);
            const isActive =
              pathname === item.href ||
              (item.href !== "/dashboard" && pathname.startsWith(item.href));

            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                    isActive
                      ? "bg-primary/10 text-primary"
                      : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                  )}
                >
                  <Icon className="size-4 shrink-0" />
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Bottom sign-out (placeholder) */}
      <div className="border-t border-border p-3">
        <button className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900">
          <LogOut className="size-4" />
          Sign Out
        </button>
      </div>
    </aside>
  );
}
