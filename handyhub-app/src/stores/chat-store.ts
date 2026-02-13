import { create } from "zustand";
import type { ChatSession, ChatMessageRecord } from "@/types/database";

export interface ChatMessage {
  id: string;
  role: "user" | "model";
  content: string;
  timestamp: number;
}

interface PersistedChat {
  messages: ChatMessage[];
  messagesRemaining: number;
  rateLimitResetDate: string;
}

const STORAGE_KEY = "handy-chat";
const MAX_MESSAGES_PER_DAY = 20;
const MAX_STORED_MESSAGES = 50;

function getTodayDateString(): string {
  return new Date().toISOString().slice(0, 10);
}

function loadFromStorage(): PersistedChat | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

function saveToStorage(data: PersistedChat) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {
    // Storage full or unavailable
  }
}

interface ChatState {
  isOpen: boolean;
  isStreaming: boolean;
  messages: ChatMessage[];
  messagesRemaining: number;
  rateLimitResetDate: string;
  currentPage: string;
  greetingDismissed: boolean;
  greetingShownPages: Set<string>;
  hydrated: boolean;

  // Session & auth state
  sessionId: string | null;
  isAuthenticated: boolean;

  // History state
  isHistoryOpen: boolean;
  historyLoading: boolean;
  historySessions: ChatSession[];
  historyTotal: number;
  historyPage: number;
  selectedHistorySession: {
    session: ChatSession;
    messages: ChatMessageRecord[];
  } | null;

  toggleOpen: () => void;
  setOpen: (open: boolean) => void;
  setCurrentPage: (page: string) => void;
  addMessage: (message: ChatMessage) => void;
  appendToLastMessage: (token: string) => void;
  setStreaming: (streaming: boolean) => void;
  decrementMessages: () => void;
  clearMessages: () => void;
  dismissGreeting: () => void;
  markGreetingShown: (page: string) => void;
  hydrate: () => void;

  // Session & history actions
  initSession: (isAuthenticated: boolean) => void;
  toggleHistory: () => void;
  loadHistory: (page?: number) => Promise<void>;
  searchHistory: (query: string) => Promise<void>;
  viewHistorySession: (sessionId: string) => Promise<void>;
  closeHistorySession: () => void;
}

export const useChatStore = create<ChatState>((set, get) => ({
  isOpen: false,
  isStreaming: false,
  messages: [],
  messagesRemaining: MAX_MESSAGES_PER_DAY,
  rateLimitResetDate: getTodayDateString(),
  currentPage: "/",
  greetingDismissed: false,
  greetingShownPages: new Set(),
  hydrated: false,

  sessionId: null,
  isAuthenticated: false,

  isHistoryOpen: false,
  historyLoading: false,
  historySessions: [],
  historyTotal: 0,
  historyPage: 1,
  selectedHistorySession: null,

  toggleOpen: () => {
    const { isOpen } = get();
    set({ isOpen: !isOpen, greetingDismissed: true });
  },

  setOpen: (open) => set({ isOpen: open, greetingDismissed: true }),

  setCurrentPage: (page) => set({ currentPage: page }),

  addMessage: (message) => {
    const messages = [...get().messages, message];
    set({ messages });
    // Only persist to localStorage for anonymous users
    if (!get().isAuthenticated) {
      const state = get();
      saveToStorage({
        messages: messages.slice(-MAX_STORED_MESSAGES),
        messagesRemaining: state.messagesRemaining,
        rateLimitResetDate: state.rateLimitResetDate,
      });
    }
  },

  appendToLastMessage: (token) => {
    const messages = [...get().messages];
    const last = messages[messages.length - 1];
    if (last && last.role === "model") {
      messages[messages.length - 1] = {
        ...last,
        content: last.content + token,
      };
      set({ messages });
    }
  },

  setStreaming: (streaming) => set({ isStreaming: streaming }),

  decrementMessages: () => {
    const remaining = Math.max(0, get().messagesRemaining - 1);
    set({ messagesRemaining: remaining });
    // Only persist to localStorage for anonymous users
    if (!get().isAuthenticated) {
      const state = get();
      saveToStorage({
        messages: state.messages.slice(-MAX_STORED_MESSAGES),
        messagesRemaining: remaining,
        rateLimitResetDate: state.rateLimitResetDate,
      });
    }
  },

  clearMessages: () => {
    const { isAuthenticated } = get();
    set({ messages: [] });
    if (isAuthenticated) {
      // Start a fresh session
      set({ sessionId: crypto.randomUUID() });
    } else {
      const state = get();
      saveToStorage({
        messages: [],
        messagesRemaining: state.messagesRemaining,
        rateLimitResetDate: state.rateLimitResetDate,
      });
    }
  },

  dismissGreeting: () => set({ greetingDismissed: true }),

  markGreetingShown: (page) => {
    const pages = new Set(get().greetingShownPages);
    pages.add(page);
    set({ greetingShownPages: pages });
  },

  hydrate: () => {
    const stored = loadFromStorage();
    if (!stored) {
      set({ hydrated: true });
      return;
    }

    const today = getTodayDateString();
    if (stored.rateLimitResetDate !== today) {
      // New day — reset rate limit but keep messages
      set({
        messages: stored.messages,
        messagesRemaining: MAX_MESSAGES_PER_DAY,
        rateLimitResetDate: today,
        hydrated: true,
      });
      saveToStorage({
        messages: stored.messages,
        messagesRemaining: MAX_MESSAGES_PER_DAY,
        rateLimitResetDate: today,
      });
    } else {
      set({
        messages: stored.messages,
        messagesRemaining: stored.messagesRemaining,
        rateLimitResetDate: stored.rateLimitResetDate,
        hydrated: true,
      });
    }
  },

  // ── Session & History ─────────────────────────────────────

  initSession: (isAuthenticated) => {
    if (isAuthenticated) {
      // Fresh session for each visit; clear messages from previous session
      set({
        isAuthenticated: true,
        sessionId: crypto.randomUUID(),
        messages: [],
        messagesRemaining: MAX_MESSAGES_PER_DAY,
      });
    } else {
      set({ isAuthenticated: false, sessionId: null });
    }
  },

  toggleHistory: () => {
    const { isHistoryOpen } = get();
    if (!isHistoryOpen) {
      // Opening history — load first page
      set({ isHistoryOpen: true, selectedHistorySession: null });
      get().loadHistory(1);
    } else {
      set({ isHistoryOpen: false, selectedHistorySession: null });
    }
  },

  loadHistory: async (page = 1) => {
    set({ historyLoading: true });
    try {
      const res = await fetch(`/api/chat/history?page=${page}&limit=20`);
      if (!res.ok) throw new Error("Failed to load history");
      const json = await res.json();
      set({
        historySessions: json.data,
        historyTotal: json.meta.total,
        historyPage: page,
        historyLoading: false,
      });
    } catch {
      set({ historyLoading: false });
    }
  },

  searchHistory: async (query) => {
    set({ historyLoading: true });
    try {
      const res = await fetch(
        `/api/chat/history?q=${encodeURIComponent(query)}&page=1&limit=20`
      );
      if (!res.ok) throw new Error("Failed to search history");
      const json = await res.json();
      set({
        historySessions: json.data,
        historyTotal: json.meta.total,
        historyPage: 1,
        historyLoading: false,
      });
    } catch {
      set({ historyLoading: false });
    }
  },

  viewHistorySession: async (sessionId) => {
    set({ historyLoading: true });
    try {
      const res = await fetch(`/api/chat/history/${sessionId}`);
      if (!res.ok) throw new Error("Failed to load session");
      const json = await res.json();
      set({
        selectedHistorySession: {
          session: json.session,
          messages: json.messages,
        },
        historyLoading: false,
      });
    } catch {
      set({ historyLoading: false });
    }
  },

  closeHistorySession: () => {
    set({ selectedHistorySession: null });
  },
}));
