import { create } from 'zustand';

const usePresentationStore = create((set) => ({
  currentStep: 0,
  maxSteps: 5,
  nextStep: () =>
    set((state) => ({
      currentStep: Math.min(state.currentStep + 1, state.maxSteps),
    })),
  prevStep: () =>
    set((state) => ({
      currentStep: Math.max(state.currentStep - 1, 0),
    })),
}));

export default usePresentationStore;

