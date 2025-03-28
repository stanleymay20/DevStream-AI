// src/components/Sidebar.jsx
import { useFileStore } from '@/store/fileStore';
import { useAIOverlayStore } from '@/store/aiOverlayStore';
import { speakText } from '@/utils/speech';

function Sidebar() {
  const { files, selectedFile, selectFile } = useFileStore();
  const { showOverlay, clearOverlay } = useAIOverlayStore();

  const handleFileClick = (filePath) => {
    if (!filePath) return;

    selectFile(filePath);
    speakText(`Opening ${filePath}`);

    const id = `sidebar-item-${filePath.replace(/[/.]/g, '-')}`;
    showOverlay(`#${id}`, `Opening ${filePath}`);
    setTimeout(() => clearOverlay(), 4000);
  };

  return (
    <div className="w-64 bg-white border-r h-screen p-4 overflow-y-auto">
      <h2 className="text-lg font-bold text-indigo-700 mb-4">📁 Project Files</h2>
      {Object.keys(files).length > 0 ? (
        <ul className="space-y-1">
          {Object.keys(files).map((file) => (
            <li
              key={file}
              id={`sidebar-item-${file.replace(/[/.]/g, '-')}`}
              onClick={() => handleFileClick(file)}
              className={`cursor-pointer px-2 py-1 rounded hover:bg-indigo-50 ${
                selectedFile === file ? 'bg-indigo-100 font-semibold' : ''
              }`}
            >
              {file}
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-sm text-gray-500">No files available.</p>
      )}
    </div>
  );
}

export default Sidebar;
