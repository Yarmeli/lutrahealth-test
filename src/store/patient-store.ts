import { create } from "zustand";

interface PatientStore {
  selectedPatientId: number | null;
  setSelectedPatientId: (id: number | null) => void;
}

export const usePatientStore = create<PatientStore>((set) => ({
  selectedPatientId: null,
  setSelectedPatientId: (id) => set({ selectedPatientId: id }),
})); 