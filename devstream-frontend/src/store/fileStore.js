import { create } from 'zustand';

const LOCAL_KEY = 'devstream-files';

export const useFileStore = create((set, get) => {
  const saved = localStorage.getItem(LOCAL_KEY);
  const initialFiles = saved ? JSON.parse(saved) : {
    'src/App.jsx': '// Start building your app...',
  };

  return {
    files: initialFiles,
    selectedFile: Object.keys(initialFiles)[0],
    explanations: {},

    setFileContent: (filePath, content) => {
      set((state) => {
        const updated = {
          ...state.files,
          [filePath]: content,
        };
        localStorage.setItem(LOCAL_KEY, JSON.stringify(updated));
        return { files: updated };
      });
    },

    selectFile: (filePath) => {
      if (get().files[filePath]) {
        set({ selectedFile: filePath });
      }
    },

    addFile: (filePath, content = '') => {
      set((state) => {
        const updated = {
          ...state.files,
          [filePath]: content,
        };
        localStorage.setItem(LOCAL_KEY, JSON.stringify(updated));
        return {
          files: updated,
          selectedFile: filePath,
        };
      });
    },

    deleteFile: (filePath) => {
      const { files, selectedFile } = get();
      const updated = { ...files };
      delete updated[filePath];
      const nextFile = Object.keys(updated)[0] || null;
      localStorage.setItem(LOCAL_KEY, JSON.stringify(updated));
      set({
        files: updated,
        selectedFile: filePath === selectedFile ? nextFile : selectedFile,
      });
    },

    setExplanation: (filePath, explanation) => {
      set((state) => ({
        explanations: {
          ...state.explanations,
          [filePath]: explanation,
        },
      }));
    },
  };
});
