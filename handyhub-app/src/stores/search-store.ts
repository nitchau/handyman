import { create } from "zustand";
import type { ContractorSearchResult } from "@/types/database";

interface SearchState {
  center: { lat: number; lng: number } | null;
  address: string;
  category: string;
  sort: string;
  radius: number;
  minRating: number;
  results: ContractorSearchResult[];
  total: number;
  page: number;
  loading: boolean;
  selectedContractorId: string | null;

  setCenter: (center: { lat: number; lng: number } | null) => void;
  setAddress: (address: string) => void;
  setCategory: (category: string) => void;
  setSort: (sort: string) => void;
  setRadius: (radius: number) => void;
  setMinRating: (minRating: number) => void;
  setResults: (results: ContractorSearchResult[], total: number) => void;
  setPage: (page: number) => void;
  setLoading: (loading: boolean) => void;
  setSelectedContractorId: (id: string | null) => void;
  reset: () => void;
}

const initialState = {
  center: null,
  address: "",
  category: "",
  sort: "distance",
  radius: 25,
  minRating: 0,
  results: [],
  total: 0,
  page: 1,
  loading: false,
  selectedContractorId: null,
};

export const useSearchStore = create<SearchState>((set) => ({
  ...initialState,
  setCenter: (center) => set({ center }),
  setAddress: (address) => set({ address }),
  setCategory: (category) => set({ category }),
  setSort: (sort) => set({ sort }),
  setRadius: (radius) => set({ radius }),
  setMinRating: (minRating) => set({ minRating }),
  setResults: (results, total) => set({ results, total }),
  setPage: (page) => set({ page }),
  setLoading: (loading) => set({ loading }),
  setSelectedContractorId: (id) => set({ selectedContractorId: id }),
  reset: () => set(initialState),
}));
