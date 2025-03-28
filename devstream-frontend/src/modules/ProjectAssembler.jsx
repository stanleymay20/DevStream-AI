// src/modules/ProjectAssembler.jsx
import { useState } from 'react';
import { generateProjectFiles } from '../utils/projectGenerator';

export default function ProjectAssembler() {
  const [projectName, setProjectName] = useState('');
  const [blueprintJSON, setBlueprintJSON] = useState('');
  const [log, setLog] = useState('');

  const handleGenerate = () => {
    try {
      const blueprint = JSON.parse(blueprintJSON);
      generateProjectFiles(blueprint);
      setLog(`✅ ${Object.keys(blueprint).length} files generated successfully.`);
    } catch (err) {
      console.error(err);
      setLog('❌ Invalid JSON. Please check your blueprint.');
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-4">
      <h2 className="text-xl font-bold text-indigo-700">Project Assembler</h2>

      <input
        type="text"
        placeholder="Project Name"
        className="w-full px-4 py-2 border rounded shadow"
        value={projectName}
        onChange={(e) => setProjectName(e.target.value)}
      />

      <textarea
        rows="12"
        className="w-full p-4 border rounded shadow text-sm font-mono"
        placeholder={`{
  "App.jsx": "import React from \\"react\\";\nexport default function App() { return <div>Hello</div> }",
  "components/Header.jsx": "export default function Header() { return <h1>Header</h1> }"
}`}
        value={blueprintJSON}
        onChange={(e) => setBlueprintJSON(e.target.value)}
      />

      <button
        className="px-6 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
        onClick={handleGenerate}
      >
        Generate Project
      </button>

      {log && <p className="text-sm text-gray-700 mt-2">{log}</p>}
    </div>
  );
}
