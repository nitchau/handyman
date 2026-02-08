import { create } from "zustand";
import type {
  AIAnalysisStatus,
  BomProject,
  RoomDimensions,
} from "@/types";

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

  setStep: (step: number) => void;
  nextStep: () => void;
  prevStep: () => void;
  setProjectData: (data: Partial<BomState["projectData"]>) => void;
  addMedia: (files: File[]) => void;
  removeMedia: (index: number) => void;
  setDimensions: (dims: RoomDimensions | null) => void;
  setAnalysisStatus: (status: AIAnalysisStatus) => void;
  setResult: (result: BomProject) => void;
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
    });
  },
}));
