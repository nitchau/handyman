import { create } from "zustand";
import type { UserProfile, UserRole } from "@/types";

interface UserState {
  profile: UserProfile | null;
  isLoaded: boolean;
  setProfile: (profile: UserProfile | null) => void;
  setLoaded: (loaded: boolean) => void;
  role: () => UserRole | null;
}

export const useUserStore = create<UserState>((set, get) => ({
  profile: null,
  isLoaded: false,
  setProfile: (profile) => set({ profile }),
  setLoaded: (loaded) => set({ isLoaded: loaded }),
  role: () => get().profile?.role ?? null,
}));
