"use client";

import { Bell, Search } from "lucide-react";
import { UserButton } from "@clerk/nextjs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function TopBar() {
  return (
    <header className="flex h-14 items-center justify-between border-b border-border bg-white px-6">
      {/* Search */}
      <div className="relative max-w-md flex-1">
        <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
        <Input
          placeholder="Search projects, contractors..."
          className="pl-9"
        />
      </div>

      {/* Right actions */}
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="size-4" />
          <span className="sr-only">Notifications</span>
        </Button>
        <UserButton
          afterSignOutUrl="/"
          appearance={{
            elements: { avatarBox: "size-8" },
          }}
        />
      </div>
    </header>
  );
}
