// src/components/ChatStream.jsx
import React from 'react';
import { useEffect, useRef, useState } from 'react';
import { streamOpenAIResponse } from '@/services/streamOpenAIResponse';
import { useFileStore } from '@/store/fileStore';
import { useAIOverlayStore } from '@/store/aiOverlayStore';
import { speakText } from '@/utils/speech';

function ChatStream() {
  const [messages, setMessages] = useState([]);
  const [currentResponse, setCurrentResponse] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const bottomRef = useRef(null);
  const { selectedFile, setFileContent } = useFileStore();
  const { showOverlay, clearOverlay } = useAIOverlayStore();

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, currentResponse]);

  useEffect(() => {
    showOverlay('input[name="prompt"]', 'Start by typing your request here...');
    speakText('Start by typing your request here...');
    const timer = setTimeout(() => clearOverlay(), 5000);
    return () => clearTimeout(timer);
  }, [clearOverlay, showOverlay]);

  const handleUserPrompt = async (prompt) => {
    setMessages((prev) => [...prev, { role: 'user', content: prompt }]);
    setCurrentResponse('');
    setIsStreaming(true);

    let fullResponse = '';
    let spoken = false;

    await streamOpenAIResponse(prompt, (token) => {
      fullResponse += token;
      setCurrentResponse(fullResponse);
      setFileContent(selectedFile, (prev = '') => prev + token);

      if (!spoken) {
        speakText(`I'm updating ${selectedFile}`);
        showOverlay('.editor-container', `Updating ${selectedFile}`);
        setTimeout(() => clearOverlay(), 4000);
        spoken = true;
      }

      speakText(token);
    });

    setMessages((prev) => [...prev, { role: 'assistant', content: fullResponse }]);
    setCurrentResponse('');
    setIsStreaming(false);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const prompt = event.target.elements.prompt.value;
    handleUserPrompt(prompt);
    event.target.reset();
  };

  return (
    <div className="fixed bottom-0 left-64 right-0 bg-white border-t shadow-md z-50">
      <div className="max-h-64 overflow-y-auto px-6 pt-4 space-y-2 text-sm">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`p-3 rounded-md w-fit max-w-[90%] ${
              msg.role === 'user'
                ? 'bg-indigo-100 text-indigo-900 self-start'
                : 'bg-gray-200 text-gray-800 self-end ml-auto'
            }`}
          >
            <p>
              <strong>{msg.role === 'user' ? 'User' : 'AI'}:</strong> {msg.content}
            </p>
          </div>
        ))}

        {isStreaming && (
          <div className="p-3 rounded-md bg-gray-100 text-gray-600 animate-pulse max-w-[90%] self-end ml-auto">
            <p>
              <strong>AI:</strong> {currentResponse}
            </p>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      <form
        onSubmit={handleSubmit}
        className="flex items-center gap-2 px-6 py-4 border-t bg-white"
      >
        <input
          type="text"
          name="prompt"
          placeholder="Type your message..."
          className="flex-grow p-2 border border-gray-300 rounded-md"
          required
        />
        <button
          type="submit"
          className="p-2 px-4 bg-indigo-600 text-white rounded hover:bg-indigo-700"
        >
          Send
        </button>
      </form>
    </div>
  );
}

export default ChatStream;
