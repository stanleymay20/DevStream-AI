// src/components/ProjectBuilder.jsx
import { useEffect, useState } from 'react';
import { getAIResponse } from '../services/openaiService';
import { generateProjectFromBlueprint } from '../utils/projectGenerator';

function ProjectBuilder() {
  const [blueprint, setBlueprint] = useState(null);
  const [status, setStatus] = useState('Waiting for command...');

  useEffect(() => {
    const command = localStorage.getItem('devstream-command');
    if (command) {
      handleGenerate(command);
      localStorage.removeItem('devstream-command');
    }
  }, []);

  const handleGenerate = async (prompt) => {
    setStatus('🧠 Generating project...');
    const response = await getAIResponse(prompt);

    try {
      const parsed = JSON.parse(response);
      setBlueprint(parsed);
      await generateProjectFromBlueprint(parsed);
      setStatus('✅ Project generated successfully.');
    } catch (err) {
      console.error('Error parsing blueprint:', err);
      setStatus('❌ Failed to generate project. Invalid blueprint.');
    }
  };

  return (
    <div className="p-6 bg-white shadow rounded mt-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold text-indigo-600 mb-3">📦 Project Builder</h2>
      <p className="text-sm text-gray-700 mb-4">{status}</p>
      {blueprint && (
        <div className="bg-gray-50 border rounded p-4">
          <h3 className="text-sm font-semibold text-gray-800 mb-2">📐 Blueprint</h3>
          <pre className="text-xs bg-gray-100 p-3 rounded overflow-x-auto border border-gray-200">
            {JSON.stringify(blueprint, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}

export default ProjectBuilder;
