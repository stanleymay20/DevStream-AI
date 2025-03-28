// src/services/openaiService.js
export async function getAIResponse(prompt) {
    const response = await fetch('http://localhost:3001/api/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ prompt }),
    });
  
    const data = await response.json();
    return data.text || '';
  }
  