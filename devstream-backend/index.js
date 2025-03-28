const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const fetch = require('node-fetch');

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.post('/api/generate', async (req, res) => {
  const { prompt } = req.body;

  if (!prompt) {
    return res.status(400).json({ error: 'Prompt is required' });
  }

  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');

  try {
    const openaiRes = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4',
        messages: [{ role: 'user', content: prompt }],
        stream: true,
      }),
    });

    const reader = openaiRes.body.getReader();
    const decoder = new TextDecoder();

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      const chunk = decoder.decode(value);
      const lines = chunk.split('\n').filter(line => line.trim() !== '');

      for (const line of lines) {
        if (line.startsWith('data:')) {
          const data = line.replace('data: ', '');
          if (data === '[DONE]') break;

          const parsed = JSON.parse(data);
          const content = parsed?.choices?.[0]?.delta?.content;
          if (content) {
            res.write(`data: ${content}\n\n`);
          }
        }
      }
    }

    res.end();
  } catch (error) {
    console.error('Streaming error:', error);
    res.write(`data: [ERROR]: ${error.message}\n\n`);
    res.end();
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`🔥 DevStream Backend running on port ${PORT}`));
