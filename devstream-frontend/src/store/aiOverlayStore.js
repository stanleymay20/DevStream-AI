import { create } from 'zustand';

export const useAIOverlayStore = create((set) => ({
  targetSelector: null,
  message: null,

  showOverlay: (selector, message = '') => set({ targetSelector: selector, message }),
  clearOverlay: () => set({ targetSelector: null, message: null }),
}));
