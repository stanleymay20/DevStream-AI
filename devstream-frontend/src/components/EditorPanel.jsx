import React from 'react';
import { Editor } from '@monaco-editor/react';
import { useFileStore } from '@/store/fileStore';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';

function EditorPanel() {
  const { files, selectedFile, setFileContent, explanations } = useFileStore();
  const code = typeof files[selectedFile] === 'string' ? files[selectedFile] : '';
  const explanation = explanations?.[selectedFile];

  const handleDownload = () => {
    if (!selectedFile) return;
    const blob = new Blob([code], { type: 'text/plain;charset=utf-8' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = selectedFile.replace(/\//g, '_');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDownloadAll = async () => {
    const zip = new JSZip();
    Object.entries(files).forEach(([path, content]) => {
      zip.file(path, content ?? '');
    });

    const blob = await zip.generateAsync({ type: 'blob' });
    saveAs(blob, 'DevStreamAI-Project.zip');
  };

  return (
    <div className="flex-grow p-6 bg-gray-50 overflow-auto h-[calc(100vh-170px)]">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-800">
          📝 Editing: {selectedFile || 'No file selected'}
        </h3>
        <div className="space-x-2">
          {selectedFile && code.trim?.() !== '' && (
            <button
              onClick={handleDownload}
              className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
            >
              Download {selectedFile.split('/').pop()}
            </button>
          )}
          <button
            onClick={handleDownloadAll}
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          >
            📦 Download All Files
          </button>
        </div>
      </div>

      <div className="h-full border border-gray-300 rounded-lg shadow-inner editor-container">
        {selectedFile ? (
          <Editor
            height="100%"
            defaultLanguage="javascript"
            value={code}
            onChange={(val) => {
              if (typeof val === 'string') {
                setFileContent(selectedFile, val);
              }
            }}
            theme="vs-dark"
          />
        ) : (
          <div className="p-8 text-center text-gray-500">
            👈 Select a file to start editing
          </div>
        )}
      </div>

      {explanation && (
        <div className="mt-4 p-4 bg-yellow-50 border-t border-yellow-300 text-sm text-gray-800 rounded">
          <strong>💡 AI Explanation:</strong> {explanation}
        </div>
      )}
    </div>
  );
}

export default EditorPanel;
