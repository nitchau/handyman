import Link from "next/link";
import { Home, X } from "lucide-react";

export default function WizardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col bg-slate-50">
      {/* Minimal nav */}
      <header className="flex h-14 items-center justify-between border-b border-border bg-white px-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2">
          <Home className="size-5 text-primary" />
          <span className="text-lg font-bold tracking-tight text-primary">
            HandyHub
          </span>
        </Link>
        <Link
          href="/"
          className="flex items-center gap-1 text-sm text-slate-500 hover:text-slate-700"
        >
          <X className="size-4" />
          <span className="hidden sm:inline">Exit</span>
        </Link>
      </header>

      {/* Centered content */}
      <main className="flex flex-1 items-start justify-center px-4 py-10 sm:py-16">
        <div className="w-full max-w-2xl">{children}</div>
      </main>
    </div>
  );
}
