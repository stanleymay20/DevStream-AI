import React from 'react';
import FileExplorer from './components/FileExplorer';
import EditorPanel from './components/EditorPanel';
import ChatStream from './components/ChatStream';
import VoiceCommand from './components/VoiceCommand';
import AIOverlay from './components/AIOverlay';
import TourManager from './components/TourManager';

function App() {
  return (
    <div className="flex h-screen w-screen bg-gray-100 text-gray-900">
      <FileExplorer />
      <main className="flex flex-col flex-grow relative overflow-hidden">
        <EditorPanel />
        <ChatStream />
        <VoiceCommand />
        <AIOverlay />
        <TourManager /> 
      </main>
    </div>
  );
}

export default App;
