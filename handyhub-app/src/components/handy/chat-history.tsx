"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { ArrowLeft, Search, MessageSquare, Loader2 } from "lucide-react";
import { useChatStore } from "@/stores";

function formatDate(dateStr: string): string {
  const d = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - d.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7) return `${diffDays} days ago`;
  return d.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: d.getFullYear() !== now.getFullYear() ? "numeric" : undefined,
  });
}

export function ChatHistory() {
  const historySessions = useChatStore((s) => s.historySessions);
  const historyLoading = useChatStore((s) => s.historyLoading);
  const selectedHistorySession = useChatStore((s) => s.selectedHistorySession);
  const toggleHistory = useChatStore((s) => s.toggleHistory);
  const loadHistory = useChatStore((s) => s.loadHistory);
  const searchHistory = useChatStore((s) => s.searchHistory);
  const viewHistorySession = useChatStore((s) => s.viewHistorySession);
  const closeHistorySession = useChatStore((s) => s.closeHistorySession);
  const historyTotal = useChatStore((s) => s.historyTotal);
  const historyPage = useChatStore((s) => s.historyPage);

  const [searchQuery, setSearchQuery] = useState("");
  const debounceRef = useRef<ReturnType<typeof setTimeout>>(undefined);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const handleSearch = useCallback(
    (value: string) => {
      setSearchQuery(value);
      clearTimeout(debounceRef.current);
      debounceRef.current = setTimeout(() => {
        if (value.trim()) {
          searchHistory(value.trim());
        } else {
          loadHistory(1);
        }
      }, 300);
    },
    [searchHistory, loadHistory]
  );

  useEffect(() => {
    return () => clearTimeout(debounceRef.current);
  }, []);

  // Scroll to bottom when viewing a session
  useEffect(() => {
    if (selectedHistorySession) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [selectedHistorySession]);

  // ── Viewing a specific session ──
  if (selectedHistorySession) {
    const { session, messages } = selectedHistorySession;
    return (
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Session header */}
        <div className="flex items-center gap-2 border-b border-slate-100 px-3 py-2">
          <button
            onClick={closeHistorySession}
            className="rounded-lg p-1 text-slate-500 hover:bg-slate-100 hover:text-slate-700"
          >
            <ArrowLeft className="size-4" />
          </button>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium text-slate-800">
              {session.title || "Untitled chat"}
            </p>
            <p className="text-[11px] text-slate-400">
              {formatDate(session.created_at)} · {session.message_count} messages
            </p>
          </div>
        </div>

        {/* Read-only messages */}
        <div className="flex-1 overflow-y-auto px-4 py-3">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`mb-3 flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed ${
                  msg.role === "user"
                    ? "bg-slate-100 text-slate-800"
                    : "bg-emerald-50 text-slate-700"
                }`}
              >
                <p className="whitespace-pre-wrap">{msg.content}</p>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </div>
    );
  }

  // ── Session list ──
  const totalPages = Math.ceil(historyTotal / 20);

  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-2 border-b border-slate-100 px-3 py-2">
        <button
          onClick={toggleHistory}
          className="rounded-lg p-1 text-slate-500 hover:bg-slate-100 hover:text-slate-700"
        >
          <ArrowLeft className="size-4" />
        </button>
        <h3 className="text-sm font-semibold text-slate-800">Chat History</h3>
      </div>

      {/* Search */}
      <div className="border-b border-slate-100 px-3 py-2">
        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            placeholder="Search past conversations..."
            className="w-full rounded-lg border border-slate-200 bg-slate-50 py-1.5 pl-8 pr-3 text-sm text-slate-700 placeholder:text-slate-400 focus:border-emerald-300 focus:outline-none focus:ring-1 focus:ring-emerald-300"
          />
        </div>
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto">
        {historyLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="size-5 animate-spin text-emerald-500" />
          </div>
        ) : historySessions.length === 0 ? (
          <div className="px-4 py-12 text-center text-sm text-slate-400">
            {searchQuery ? "No matching conversations found" : "No chat history yet"}
          </div>
        ) : (
          <>
            {historySessions.map((session) => (
              <button
                key={session.id}
                onClick={() => viewHistorySession(session.id)}
                className="flex w-full items-start gap-3 border-b border-slate-50 px-4 py-3 text-left transition-colors hover:bg-slate-50"
              >
                <div className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-full bg-emerald-50">
                  <MessageSquare className="size-3.5 text-emerald-600" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-slate-700">
                    {session.title || "Untitled chat"}
                  </p>
                  <p className="mt-0.5 text-[11px] text-slate-400">
                    {formatDate(session.created_at)} · {session.message_count} messages
                  </p>
                </div>
              </button>
            ))}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 border-t border-slate-100 px-3 py-2">
                <button
                  disabled={historyPage <= 1}
                  onClick={() => loadHistory(historyPage - 1)}
                  className="rounded px-2 py-1 text-xs text-slate-500 hover:bg-slate-100 disabled:opacity-40"
                >
                  Previous
                </button>
                <span className="text-xs text-slate-400">
                  {historyPage} / {totalPages}
                </span>
                <button
                  disabled={historyPage >= totalPages}
                  onClick={() => loadHistory(historyPage + 1)}
                  className="rounded px-2 py-1 text-xs text-slate-500 hover:bg-slate-100 disabled:opacity-40"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
