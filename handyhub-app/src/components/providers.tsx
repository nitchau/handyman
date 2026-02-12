"use client";

import type { ReactNode } from "react";
import { ClerkProvider } from "@clerk/nextjs";
import { LanguageProvider } from "@/lib/i18n/language-context";
import { ChatWidget } from "@/components/handy/chat-widget";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <ClerkProvider>
      <LanguageProvider>
        {children}
        <ChatWidget />
      </LanguageProvider>
    </ClerkProvider>
  );
}
