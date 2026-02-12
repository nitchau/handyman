"use client";

import { useCallback } from "react";
import { X, Trash2, Wrench } from "lucide-react";
import { usePathname } from "next/navigation";
import { useChatStore } from "@/stores";
import type { ChatMessage } from "@/stores/chat-store";
import { ChatMessages } from "./chat-messages";
import { ChatInput } from "./chat-input";

export function ChatPanel() {
  const isOpen = useChatStore((s) => s.isOpen);
  const setOpen = useChatStore((s) => s.setOpen);
  const addMessage = useChatStore((s) => s.addMessage);
  const appendToLastMessage = useChatStore((s) => s.appendToLastMessage);
  const setStreaming = useChatStore((s) => s.setStreaming);
  const decrementMessages = useChatStore((s) => s.decrementMessages);
  const clearMessages = useChatStore((s) => s.clearMessages);
  const messages = useChatStore((s) => s.messages);
  const pathname = usePathname();

  const handleSend = useCallback(
    async (text: string) => {
      const userMessage: ChatMessage = {
        id: crypto.randomUUID(),
        role: "user",
        content: text,
        timestamp: Date.now(),
      };
      addMessage(userMessage);
      decrementMessages();

      // Create empty model message for streaming
      const modelMessage: ChatMessage = {
        id: crypto.randomUUID(),
        role: "model",
        content: "",
        timestamp: Date.now(),
      };
      addMessage(modelMessage);
      setStreaming(true);

      try {
        // Build messages for API (just role + content)
        const allMessages = [...messages, userMessage].map((m) => ({
          role: m.role,
          content: m.content,
        }));

        const res = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            messages: allMessages,
            currentPage: pathname,
            userRole: "visitor",
          }),
        });

        if (!res.ok) {
          const err = await res.json().catch(() => ({ error: "Request failed" }));
          appendToLastMessage(err.error || "Something went wrong. Please try again.");
          setStreaming(false);
          return;
        }

        const reader = res.body?.getReader();
        if (!reader) {
          appendToLastMessage("No response received.");
          setStreaming(false);
          return;
        }

        const decoder = new TextDecoder();
        let buffer = "";

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split("\n");
          buffer = lines.pop() || "";

          for (const line of lines) {
            const trimmed = line.trim();
            if (!trimmed.startsWith("data: ")) continue;
            const data = trimmed.slice(6);
            if (data === "[DONE]") break;
            try {
              const parsed = JSON.parse(data);
              if (parsed.token) {
                appendToLastMessage(parsed.token);
              }
              if (parsed.error) {
                appendToLastMessage(parsed.error);
              }
            } catch {
              // Skip malformed chunks
            }
          }
        }
      } catch {
        appendToLastMessage("Network error. Please check your connection and try again.");
      } finally {
        setStreaming(false);
      }
    },
    [messages, pathname, addMessage, appendToLastMessage, setStreaming, decrementMessages]
  );

  return (
    <div
      className={`fixed bottom-24 right-4 z-50 flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl transition-all duration-300 ease-in-out sm:right-6 ${
        isOpen
          ? "pointer-events-auto translate-x-0 opacity-100"
          : "pointer-events-none translate-x-4 opacity-0"
      } h-[calc(100vh-8rem)] w-[calc(100vw-2rem)] sm:h-[600px] sm:w-[400px]`}
    >
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-200 bg-emerald-600 px-4 py-3">
        <div className="flex items-center gap-3">
          <div className="flex size-8 items-center justify-center rounded-full bg-white/20">
            <Wrench className="size-4 text-white" />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-white">Handy</h2>
            <p className="text-[11px] text-emerald-100">Online</p>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={clearMessages}
            className="rounded-lg p-1.5 text-white/70 transition-colors hover:bg-white/10 hover:text-white"
            title="Clear chat"
          >
            <Trash2 className="size-4" />
          </button>
          <button
            onClick={() => setOpen(false)}
            className="rounded-lg p-1.5 text-white/70 transition-colors hover:bg-white/10 hover:text-white"
            title="Close"
          >
            <X className="size-4" />
          </button>
        </div>
      </div>

      {/* Messages */}
      <ChatMessages />

      {/* Input */}
      <ChatInput onSend={handleSend} />
    </div>
  );
}
