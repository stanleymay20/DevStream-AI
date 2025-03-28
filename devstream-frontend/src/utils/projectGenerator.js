// src/utils/projectGenerator.js

/**
 * Generate project files based on a blueprint object.
 * The blueprint should be in the form:
 * {
 *   "App.jsx": "file content here",
 *   "components/Header.jsx": "file content here",
 *   ...
 * }
 */
import { useFileStore } from '@/store/fileStore';

export const generateProjectFiles = async (blueprint) => {
  try {
    const files = Object.entries(blueprint);

    for (const [filePath, content] of files) {
      await saveFile(filePath, content);
    }

    return { success: true, message: `${files.length} files generated.` };
  } catch (error) {
    console.error('Project Generation Error:', error);
    return { success: false, error: error.message };
  }
};

// Mock save function (writes to Zustand store)
const saveFile = async (path, content) => {
  const { addFile } = useFileStore.getState();
  addFile(path, content);
  console.log(`[SAVE] ${path} =>\n${content}\n`);
  return new Promise((resolve) => setTimeout(resolve, 100));
};
