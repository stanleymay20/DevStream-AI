import { create } from 'zustand';

export const useGlobalCodeStore = create((set) => ({
  code: '',
  setCode: (code) => set({ code }),
}));
