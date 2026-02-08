"use client";

import Link from "next/link";
import { useState } from "react";
import { Home, Menu, X } from "lucide-react";
import {
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
} from "@clerk/nextjs";
import { Button } from "@/components/ui/button";

const navLinks = [
  { label: "Design Ideas", href: "/designs" },
  { label: "How It Works", href: "#how-it-works" },
  { label: "For Pros", href: "#for-pros" },
  { label: "Price Comparison", href: "#pricing" },
];

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-white">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <Home className="size-5 text-primary" />
          <span className="text-xl font-bold tracking-tight text-primary">
            HandyHub
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-slate-700 transition-colors hover:text-primary"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Desktop actions */}
        <div className="hidden items-center gap-4 md:flex">
          <SignedOut>
            <SignInButton>
              <button className="text-sm font-medium text-slate-700 hover:text-primary cursor-pointer">
                Sign In
              </button>
            </SignInButton>
            <SignUpButton>
              <Button size="sm">Get Started Free</Button>
            </SignUpButton>
          </SignedOut>
          <SignedIn>
            <Link
              href="/dashboard"
              className="text-sm font-medium text-slate-700 hover:text-primary"
            >
              Dashboard
            </Link>
            <UserButton />
          </SignedIn>
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? (
            <X className="size-6 text-slate-700" />
          ) : (
            <Menu className="size-6 text-slate-700" />
          )}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="border-t border-border bg-white px-4 pb-4 pt-2 md:hidden">
          <nav className="flex flex-col gap-3">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-slate-700"
                onClick={() => setMobileOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <hr className="border-border" />
            <SignedOut>
              <SignInButton>
                <button className="text-sm font-medium text-slate-700 text-left cursor-pointer">
                  Sign In
                </button>
              </SignInButton>
              <SignUpButton>
                <Button size="sm" className="w-full">
                  Get Started Free
                </Button>
              </SignUpButton>
            </SignedOut>
            <SignedIn>
              <Link
                href="/dashboard"
                className="text-sm font-medium text-slate-700"
                onClick={() => setMobileOpen(false)}
              >
                Dashboard
              </Link>
              <div className="pt-1">
                <UserButton />
              </div>
            </SignedIn>
          </nav>
        </div>
      )}
    </header>
  );
}
