// src/components/AIOverlay.jsx
import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

function AIOverlay({ selector, message }) {
  const [position, setPosition] = useState(null);

  useEffect(() => {
    if (!selector) return setPosition(null);
    const el = document.querySelector(selector);
    if (!el) return setPosition(null);

    const rect = el.getBoundingClientRect();
    setPosition({
      top: rect.top + window.scrollY - 8,
      left: rect.left + window.scrollX - 8,
      width: rect.width,
      height: rect.height,
    });
  }, [selector]);

  if (!position) return null;

  return createPortal(
    <div
      className="absolute z-[9999] pointer-events-none"
      style={{
        top: position.top,
        left: position.left,
        width: position.width,
        height: position.height,
      }}
    >
      <div className="w-full h-full border-2 border-indigo-500 rounded-md animate-pulse relative">
        {message && (
          <div className="absolute -top-8 left-0 bg-indigo-600 text-white px-2 py-1 text-xs rounded shadow-lg">
            {message}
          </div>
        )}
      </div>
    </div>,
    document.body
  );
}

export default AIOverlay;
