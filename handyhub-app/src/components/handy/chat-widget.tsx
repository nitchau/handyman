"use client";

import { useEffect, useState, useCallback } from "react";
import { MessageCircle, X } from "lucide-react";
import { usePathname } from "next/navigation";
import { useChatStore } from "@/stores";
import { ChatPanel } from "./chat-panel";

const PAGE_GREETINGS: Record<string, string> = {
  "/": "Welcome to HandyHub! Need help finding a contractor or planning a project?",
  "/designs": "Browsing designs? I can help you find the perfect style for your space!",
  "/contractors": "Looking for a pro? I can help you know what questions to ask!",
  "/plan": "Planning a project? I can help you figure out if it's DIY-friendly!",
  "/tools": "Exploring our tools? Ask me which one is right for your project!",
  "/dashboard": "Need help with your dashboard? I'm here to help!",
};

function getGreeting(pathname: string): string {
  for (const [path, greeting] of Object.entries(PAGE_GREETINGS)) {
    if (path === "/" && pathname === "/") return greeting;
    if (path !== "/" && pathname.startsWith(path)) return greeting;
  }
  return "Hi! I'm Handy, your home improvement assistant. How can I help?";
}

export function ChatWidget() {
  const isOpen = useChatStore((s) => s.isOpen);
  const toggleOpen = useChatStore((s) => s.toggleOpen);
  const hydrate = useChatStore((s) => s.hydrate);
  const hydrated = useChatStore((s) => s.hydrated);
  const setCurrentPage = useChatStore((s) => s.setCurrentPage);
  const greetingDismissed = useChatStore((s) => s.greetingDismissed);
  const dismissGreeting = useChatStore((s) => s.dismissGreeting);
  const greetingShownPages = useChatStore((s) => s.greetingShownPages);
  const markGreetingShown = useChatStore((s) => s.markGreetingShown);
  const pathname = usePathname();

  const [showGreeting, setShowGreeting] = useState(false);

  // Hydrate chat state from localStorage on mount
  useEffect(() => {
    hydrate();
  }, [hydrate]);

  // Track current page
  useEffect(() => {
    setCurrentPage(pathname);
  }, [pathname, setCurrentPage]);

  // Proactive greeting logic
  const pageKey = pathname.split("?")[0];

  const handleDismissGreeting = useCallback(() => {
    setShowGreeting(false);
    dismissGreeting();
  }, [dismissGreeting]);

  useEffect(() => {
    if (isOpen || greetingDismissed || greetingShownPages.has(pageKey)) {
      setShowGreeting(false);
      return;
    }

    const showTimer = setTimeout(() => {
      setShowGreeting(true);
      markGreetingShown(pageKey);
    }, 2000);

    return () => clearTimeout(showTimer);
  }, [pageKey, isOpen, greetingDismissed, greetingShownPages, markGreetingShown]);

  // Auto-dismiss greeting after 8s
  useEffect(() => {
    if (!showGreeting) return;
    const timer = setTimeout(() => setShowGreeting(false), 8000);
    return () => clearTimeout(timer);
  }, [showGreeting]);

  if (!hydrated) return null;

  return (
    <>
      <ChatPanel />

      {/* Greeting bubble */}
      {showGreeting && !isOpen && (
        <div className="fixed bottom-24 right-4 z-50 max-w-[280px] sm:right-6">
          <div className="relative rounded-2xl bg-white p-3 text-sm text-slate-700 shadow-lg ring-1 ring-slate-200">
            <button
              onClick={handleDismissGreeting}
              className="absolute -right-1.5 -top-1.5 flex size-5 items-center justify-center rounded-full bg-slate-200 text-slate-500 hover:bg-slate-300"
            >
              <X className="size-3" />
            </button>
            {getGreeting(pathname)}
          </div>
          {/* Arrow pointing to FAB */}
          <div className="mr-5 flex justify-end">
            <div className="size-3 -translate-y-px rotate-45 bg-white ring-1 ring-slate-200 [clip-path:polygon(100%_0,100%_100%,0_100%)]" />
          </div>
        </div>
      )}

      {/* FAB */}
      <button
        onClick={toggleOpen}
        className={`fixed bottom-6 right-4 z-50 flex size-14 items-center justify-center rounded-full shadow-lg transition-all duration-200 hover:scale-105 sm:right-6 ${
          isOpen
            ? "bg-slate-700 text-white hover:bg-slate-800"
            : "bg-emerald-600 text-white hover:bg-emerald-700"
        }`}
        title={isOpen ? "Close Handy" : "Chat with Handy"}
      >
        {isOpen ? <X className="size-6" /> : <MessageCircle className="size-6" />}
      </button>
    </>
  );
}
