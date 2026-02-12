"use client";

import { useState, useRef, type KeyboardEvent } from "react";
import { Send } from "lucide-react";
import { useChatStore } from "@/stores";

interface ChatInputProps {
  onSend: (message: string) => void;
}

export function ChatInput({ onSend }: ChatInputProps) {
  const [input, setInput] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const isStreaming = useChatStore((s) => s.isStreaming);
  const messagesRemaining = useChatStore((s) => s.messagesRemaining);

  const canSend = input.trim().length > 0 && !isStreaming && messagesRemaining > 0;

  function handleSend() {
    if (!canSend) return;
    onSend(input.trim());
    setInput("");
    inputRef.current?.focus();
  }

  function handleKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  return (
    <div className="border-t border-slate-200 bg-white px-4 py-3">
      <div className="flex items-center gap-2">
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={
            messagesRemaining <= 0
              ? "Daily limit reached"
              : "Ask Handy anything..."
          }
          disabled={isStreaming || messagesRemaining <= 0}
          className="flex-1 rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm text-slate-800 placeholder:text-slate-400 focus:border-emerald-400 focus:outline-none focus:ring-1 focus:ring-emerald-400 disabled:opacity-50"
        />
        <button
          onClick={handleSend}
          disabled={!canSend}
          className="flex size-9 shrink-0 items-center justify-center rounded-full bg-emerald-600 text-white transition-colors hover:bg-emerald-700 disabled:opacity-40 disabled:hover:bg-emerald-600"
        >
          <Send className="size-4" />
        </button>
      </div>
      <div className="mt-2 flex items-center justify-between px-1 text-xs text-slate-400">
        <span>{messagesRemaining} messages remaining today</span>
        <a
          href="mailto:support@handyhub.com"
          className="text-emerald-600 hover:underline"
        >
          Contact support
        </a>
      </div>
    </div>
  );
}
