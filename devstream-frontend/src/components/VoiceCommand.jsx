import { useState } from 'react';
import useVoiceRecognition from '@/hooks/useVoiceRecognition';
import { streamOpenAIResponse } from '@/services/streamOpenAIResponse';
import { useGlobalCodeStore } from '@/store/codeStore';
import { useFileStore } from '@/store/fileStore';
import { speakText } from '@/utils/speech';
import { explainCurrentFile } from '@/services/openaiExplainService';
import React from 'react';

function VoiceCommand() {
  const [listening, setListening] = useState(false);
  const [aiResponse, setAIResponse] = useState('');
  const { setCode } = useGlobalCodeStore();
  const { files, selectedFile, setExplanation } = useFileStore();

  const { startListening, stopListening } = useVoiceRecognition(async (finalText) => {
    setAIResponse('');
    setCode('');

    if (finalText.toLowerCase().includes('explain this file')) {
      const code = files[selectedFile];
      if (code) {
        speakText('Let me explain this file...');
        const explanation = await explainCurrentFile(selectedFile, code);
        setExplanation(selectedFile, explanation);
        setAIResponse(explanation);
        speakText(explanation);
      } else {
        const fallback = 'No file selected or the file is empty.';
        setAIResponse(fallback);
        speakText(fallback);
      }
    } else {
      await streamOpenAIResponse(finalText, (token) => {
        setAIResponse((prev) => prev + token);
        setCode((prev) => prev + token);
        speakText(token);
      });
    }
  });

  const toggle = () => {
    listening ? stopListening() : startListening();
    setListening(!listening);
  };

  return (
    <>
      <button
        onClick={toggle}
        className={`fixed bottom-6 right-6 w-16 h-16 rounded-full flex items-center justify-center shadow-lg ${
          listening ? 'bg-red-500' : 'bg-indigo-600'
        }`}
      >
        🎙️
      </button>
      {aiResponse && (
        <div className="fixed bottom-24 right-6 bg-white p-4 rounded shadow-md max-w-xs">
          <pre className="text-xs text-gray-800 whitespace-pre-wrap">{aiResponse}</pre>
        </div>
      )}
    </>
  );
}

export default VoiceCommand;
