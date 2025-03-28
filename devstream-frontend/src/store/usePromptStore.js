// src/store/usePromptStore.js
import { create } from 'zustand';

export const usePromptStore = create((set) => ({
  sendPrompt: null,
  setSendPrompt: (fn) => set({ sendPrompt: fn }),
}));
