// src/store/codeStore.js
import { create } from 'zustand';

export const useGlobalCodeStore = create((set) => ({
  code: '',
  setCode: (newCode) => set({ code: newCode }),
  resetCode: () => set({ code: '' }),
}));
