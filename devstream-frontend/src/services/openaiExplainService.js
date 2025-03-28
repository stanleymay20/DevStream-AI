import { getAIResponse } from '@/services/openaiService';

export async function explainCurrentFile(filename, content) {
  const prompt = `
Explain the following file in simple terms.

File: ${filename}

\`\`\`
${content}
\`\`\`
`;

  const explanation = await getAIResponse(prompt);
  return explanation;
}
