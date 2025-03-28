// src/services/streamOpenAIResponse.js

/**
 * Streams AI response from the backend and emits each token using onToken callback.
 *
 * @param {string} prompt - The user input prompt to send to the backend.
 * @param {function} onToken - Callback invoked with each received token.
 */
export async function streamOpenAIResponse(prompt, onToken) {
  const response = await fetch('http://localhost:3001/api/generate', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ prompt }),
  });

  if (!response.ok || !response.body) {
    throw new Error('Failed to connect to backend stream');
  }

  const data = await response.json();
if (data?.text) {
  onToken(data.text); // If your server just returns one full string
}

  const decoder = new TextDecoder();
  const reader = response.body.getReader();
  let done = false;

  while (!done) {
    const { value, done: doneReading } = await reader.read();
    done = doneReading;

    const chunk = decoder.decode(value, { stream: true });

    const lines = chunk.split('\n').filter((line) => line.trim() !== '');

    for (const line of lines) {
      if (line.startsWith('data:')) {
        const jsonStr = line.replace(/^data:\s*/, '').trim();
      
        try {
          const parsed = JSON.parse(jsonStr);
          if (parsed.text && onToken) {
            onToken(parsed.text); // adjust depending on your payload shape
          }
        } catch (err) {
          console.warn('[WARN] Failed to parse chunk:', jsonStr);
          console.error(err);
        }
      }
      
    }
  }
}
