// src/components/FileExplorer.jsx
import React, { useState } from 'react';
import { useFileStore } from '@/store/fileStore';
import { Plus, Trash2 } from 'lucide-react';

function FileExplorer() {
  const { files, selectedFile, selectFile, addFile, deleteFile } = useFileStore();
  const [newFileName, setNewFileName] = useState('');

  const handleAddFile = () => {
    const trimmedName = newFileName.trim();
    if (trimmedName && !files[trimmedName]) {
      addFile(trimmedName, '');
      setNewFileName('');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleAddFile();
    }
  };

  return (
    <div className="w-64 h-full border-r bg-white shadow-sm p-4 overflow-auto">
      <h2 className="text-lg font-bold mb-4 text-indigo-700">📁 Files</h2>

      {Object.keys(files).length > 0 ? (
        <ul className="space-y-2">
          {Object.keys(files).map((filePath) => (
            <li
              key={filePath}
              className={`flex justify-between items-center p-2 rounded cursor-pointer ${
                filePath === selectedFile ? 'bg-indigo-100 text-indigo-800 font-semibold' : 'hover:bg-gray-100'
              }`}
            >
              <span onClick={() => selectFile(filePath)} className="truncate w-full pr-2">
                {filePath}
              </span>
              <Trash2
                size={16}
                className="text-red-400 hover:text-red-600 flex-shrink-0"
                onClick={() => deleteFile(filePath)}
              />
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-sm text-gray-500">No files yet. Add one below 👇</p>
      )}

      <div className="mt-6 flex items-center space-x-2">
        <input
          type="text"
          value={newFileName}
          onChange={(e) => setNewFileName(e.target.value)}
          onKeyDown={handleKeyPress}
          placeholder="e.g., src/utils.js"
          className="flex-grow p-1 text-sm border rounded"
        />
        <button
          onClick={handleAddFile}
          className="bg-indigo-600 text-white p-1 rounded hover:bg-indigo-700"
          title="Add File"
        >
          <Plus size={18} />
        </button>
      </div>
    </div>
  );
}

export default FileExplorer;
