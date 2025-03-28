// src/components/JarvisAssembler.jsx
import { useState } from 'react';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';

const generateFilesAsZip = async (filesObject) => {
  const zip = new JSZip();

  Object.entries(filesObject).forEach(([filePath, fileContent]) => {
    zip.file(filePath, fileContent);
  });

  const blob = await zip.generateAsync({ type: 'blob' });
  saveAs(blob, 'JARVIS-Generated-Files.zip');
};

function JarvisAssembler() {
  const [projectJSON, setProjectJSON] = useState('');
  const [parsedStructure, setParsedStructure] = useState(null);
  const [error, setError] = useState(null);

  const handleGenerate = async () => {
    try {
      const structure = JSON.parse(projectJSON);
      setParsedStructure(structure);
      setError(null);
      await generateFilesAsZip(structure);
    } catch (err) {
      console.error(err);
      setError('❌ Invalid JSON structure. Make sure you pasted a valid project structure.');
      setParsedStructure(null);
    }
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h2 className="text-2xl font-semibold text-indigo-700 mb-4">🧠 J.A.R.V.I.S. Assembler</h2>
      <textarea
        value={projectJSON}
        onChange={(e) => setProjectJSON(e.target.value)}
        placeholder="Paste JSON project structure here"
        className="w-full h-64 border border-gray-300 rounded p-4 font-mono text-sm mb-4 resize-none"
      />
      <button
        onClick={handleGenerate}
        className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
      >
        ⚡ Generate Files
      </button>
      {error && <p className="text-red-500 mt-2 font-medium">{error}</p>}
      {parsedStructure && (
        <div className="mt-6">
          <h3 className="text-xl font-bold mb-2">🗂 File Overview</h3>
          <ul className="list-disc pl-6 text-gray-800">
            {Object.keys(parsedStructure).map((filePath) => (
              <li key={filePath} className="mb-3">
                <span className="font-medium text-indigo-600">{filePath}</span>
                <pre className="bg-gray-100 p-3 mt-1 rounded text-xs whitespace-pre-wrap overflow-x-auto border border-gray-200">
                  {parsedStructure[filePath]}
                </pre>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default JarvisAssembler;
