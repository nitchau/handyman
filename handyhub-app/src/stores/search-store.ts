import { create } from "zustand";
import type { ContractorSearchResult } from "@/types/database";

type MobileView = "list" | "map";

interface SearchState {
  center: { lat: number; lng: number } | null;
  address: string;
  category: string;
  sort: string;
  radius: number;
  minRating: number;
  verifiedOnly: boolean;
  results: ContractorSearchResult[];
  total: number;
  page: number;
  loading: boolean;
  selectedContractorId: string | null;
  mobileView: MobileView;
  mapMoved: boolean;
  mapCenter: { lat: number; lng: number } | null;

  setCenter: (center: { lat: number; lng: number } | null) => void;
  setAddress: (address: string) => void;
  setCategory: (category: string) => void;
  setSort: (sort: string) => void;
  setRadius: (radius: number) => void;
  setMinRating: (minRating: number) => void;
  setVerifiedOnly: (verifiedOnly: boolean) => void;
  setResults: (results: ContractorSearchResult[], total: number) => void;
  setPage: (page: number) => void;
  setLoading: (loading: boolean) => void;
  setSelectedContractorId: (id: string | null) => void;
  setMobileView: (view: MobileView) => void;
  setMapMoved: (moved: boolean) => void;
  setMapCenter: (center: { lat: number; lng: number } | null) => void;
  reset: () => void;
}

const initialState = {
  center: null,
  address: "",
  category: "",
  sort: "distance",
  radius: 25,
  minRating: 0,
  verifiedOnly: false,
  results: [] as ContractorSearchResult[],
  total: 0,
  page: 1,
  loading: false,
  selectedContractorId: null,
  mobileView: "list" as MobileView,
  mapMoved: false,
  mapCenter: null,
};

export const useSearchStore = create<SearchState>((set) => ({
  ...initialState,
  setCenter: (center) => set({ center }),
  setAddress: (address) => set({ address }),
  setCategory: (category) => set({ category }),
  setSort: (sort) => set({ sort }),
  setRadius: (radius) => set({ radius }),
  setMinRating: (minRating) => set({ minRating }),
  setVerifiedOnly: (verifiedOnly) => set({ verifiedOnly }),
  setResults: (results, total) => set({ results, total }),
  setPage: (page) => set({ page }),
  setLoading: (loading) => set({ loading }),
  setSelectedContractorId: (id) => set({ selectedContractorId: id }),
  setMobileView: (mobileView) => set({ mobileView }),
  setMapMoved: (mapMoved) => set({ mapMoved }),
  setMapCenter: (mapCenter) => set({ mapCenter }),
  reset: () => set(initialState),
}));
