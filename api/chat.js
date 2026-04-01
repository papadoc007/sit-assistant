import Anthropic from '@anthropic-ai/sdk';
import { SIT_SYSTEM_PROMPT, GUIDED_STEP_PROMPTS } from '../sit-knowledge.js';

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { messages, guidedStep, selectedTool } = req.body;

    let systemPrompt = SIT_SYSTEM_PROMPT;
    if (guidedStep && GUIDED_STEP_PROMPTS[guidedStep]) {
      systemPrompt += '\n\n' + GUIDED_STEP_PROMPTS[guidedStep];
    }
    if (selectedTool) {
      systemPrompt += `\n\nהמשתמש בחר להפעיל את הכלי: ${selectedTool}. הדרך אותו בהפעלת כלי זה בלבד.`;
    }

    const response = await client.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 4096,
      system: systemPrompt,
      messages: messages.map(m => ({
        role: m.role,
        content: m.content
      }))
    });

    const text = response.content
      .filter(b => b.type === 'text')
      .map(b => b.text)
      .join('');

    res.json({ response: text });
  } catch (error) {
    console.error('Chat error:', error);
    res.status(500).json({ error: error.message });
  }
}
