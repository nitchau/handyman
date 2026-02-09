import { create } from "zustand";
import type {
  AIAnalysisStatus,
  BomProject,
  PreviewConversationTurn,
  PreviewStatus,
  RoomDimensions,
} from "@/types";

export interface DesignReference {
  designId: string;
  designTitle: string;
  designStyle: string;
  roomType: string;
  budgetTier: string;
  estimatedCost: number | null;
  primaryPhotoUrl: string;
  mediaUrls: string[];
  designerId: string;
  designerName: string;
  productTags: Array<{
    productName: string;
    productBrand: string | null;
    productCategory: string;
    estimatedPrice: number;
    retailerName: string | null;
    quantityNeeded: string | null;
  }>;
}

interface BomState {
  currentStep: number;
  projectData: {
    category_slug: string;
    space_type: string;
    description: string;
  };
  mediaFiles: File[];
  mediaPreviews: string[];
  dimensions: RoomDimensions | null;
  analysisStatus: AIAnalysisStatus;
  result: BomProject | null;
  error: string | null;
  previewImage: string | null;
  previewDescription: string | null;
  previewHistory: PreviewConversationTurn[];
  previewStatus: PreviewStatus;
  previewError: string | null;
  designReference: DesignReference | null;

  setStep: (step: number) => void;
  nextStep: () => void;
  prevStep: () => void;
  setProjectData: (data: Partial<BomState["projectData"]>) => void;
  addMedia: (files: File[]) => void;
  removeMedia: (index: number) => void;
  setDimensions: (dims: RoomDimensions | null) => void;
  setAnalysisStatus: (status: AIAnalysisStatus) => void;
  setResult: (result: BomProject) => void;
  setError: (error: string | null) => void;
  setPreviewImage: (url: string | null) => void;
  setPreviewDescription: (desc: string | null) => void;
  addPreviewTurn: (turn: PreviewConversationTurn) => void;
  setPreviewStatus: (status: PreviewStatus) => void;
  setPreviewError: (error: string | null) => void;
  resetPreview: () => void;
  setDesignReference: (ref: DesignReference | null) => void;
  reset: () => void;
}

const initialProjectData = {
  category_slug: "",
  space_type: "",
  description: "",
};

export const useBomStore = create<BomState>((set, get) => ({
  currentStep: 0,
  projectData: { ...initialProjectData },
  mediaFiles: [],
  mediaPreviews: [],
  dimensions: null,
  analysisStatus: "idle" as AIAnalysisStatus,
  result: null,
  error: null,
  previewImage: null,
  previewDescription: null,
  previewHistory: [],
  previewStatus: "idle" as PreviewStatus,
  previewError: null,
  designReference: null,

  setStep: (step) => set({ currentStep: step }),
  nextStep: () => set({ currentStep: get().currentStep + 1 }),
  prevStep: () => set({ currentStep: Math.max(0, get().currentStep - 1) }),

  setProjectData: (data) =>
    set({ projectData: { ...get().projectData, ...data } }),

  addMedia: (files) => {
    const newPreviews = files.map((f) => URL.createObjectURL(f));
    set({
      mediaFiles: [...get().mediaFiles, ...files],
      mediaPreviews: [...get().mediaPreviews, ...newPreviews],
    });
  },

  removeMedia: (index) => {
    const previews = [...get().mediaPreviews];
    URL.revokeObjectURL(previews[index]);
    previews.splice(index, 1);

    const files = [...get().mediaFiles];
    files.splice(index, 1);

    set({ mediaFiles: files, mediaPreviews: previews });
  },

  setDimensions: (dims) => set({ dimensions: dims }),
  setAnalysisStatus: (status) => set({ analysisStatus: status }),
  setResult: (result) => set({ result }),
  setError: (error) => set({ error }),

  setPreviewImage: (url) => set({ previewImage: url }),
  setPreviewDescription: (desc) => set({ previewDescription: desc }),
  addPreviewTurn: (turn) =>
    set({ previewHistory: [...get().previewHistory, turn] }),
  setPreviewStatus: (status) => set({ previewStatus: status }),
  setPreviewError: (error) => set({ previewError: error }),
  resetPreview: () =>
    set({
      previewImage: null,
      previewDescription: null,
      previewHistory: [],
      previewStatus: "idle" as PreviewStatus,
      previewError: null,
    }),

  setDesignReference: (ref) => set({ designReference: ref }),

  reset: () => {
    // Revoke all object URLs before resetting
    get().mediaPreviews.forEach((url) => URL.revokeObjectURL(url));
    set({
      currentStep: 0,
      projectData: { ...initialProjectData },
      mediaFiles: [],
      mediaPreviews: [],
      dimensions: null,
      analysisStatus: "idle" as AIAnalysisStatus,
      result: null,
      error: null,
      previewImage: null,
      previewDescription: null,
      previewHistory: [],
      previewStatus: "idle" as PreviewStatus,
      previewError: null,
      designReference: null,
    });
  },
}));
