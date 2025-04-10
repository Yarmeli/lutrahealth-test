import { create } from "zustand";

export interface PatientStore {
	selectedPatientId: number | null;
	setSelectedPatientId: (id: number | null) => void;
	dialogStage: "view" | "booking";
	setDialogStage: (stage: "view" | "booking") => void;
}

export const usePatientStore = create<PatientStore>((set) => ({
	selectedPatientId: null,
	dialogStage: "view",
	setSelectedPatientId: (id) => set({ selectedPatientId: id }),
	setDialogStage: (stage) => set({ dialogStage: stage }),
}));
