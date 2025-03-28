import React from 'react';

function TranscriptionDisplay({ transcript }) {
  if (!transcript) return null;

  return (
    <div className="fixed bottom-24 left-6 bg-white text-gray-800 p-4 rounded shadow-md max-w-md">
      <p className="text-sm whitespace-pre-wrap">{transcript}</p>
    </div>
  );
}

export default TranscriptionDisplay;
