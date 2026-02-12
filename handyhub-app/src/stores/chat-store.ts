import { create } from "zustand";

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

  toggleOpen: () => {
    const { isOpen } = get();
    set({ isOpen: !isOpen, greetingDismissed: true });
  },

  setOpen: (open) => set({ isOpen: open, greetingDismissed: true }),

  setCurrentPage: (page) => set({ currentPage: page }),

  addMessage: (message) => {
    const messages = [...get().messages, message];
    set({ messages });
    const state = get();
    saveToStorage({
      messages: messages.slice(-MAX_STORED_MESSAGES),
      messagesRemaining: state.messagesRemaining,
      rateLimitResetDate: state.rateLimitResetDate,
    });
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
    const state = get();
    saveToStorage({
      messages: state.messages.slice(-MAX_STORED_MESSAGES),
      messagesRemaining: remaining,
      rateLimitResetDate: state.rateLimitResetDate,
    });
  },

  clearMessages: () => {
    set({ messages: [] });
    const state = get();
    saveToStorage({
      messages: [],
      messagesRemaining: state.messagesRemaining,
      rateLimitResetDate: state.rateLimitResetDate,
    });
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
}));
