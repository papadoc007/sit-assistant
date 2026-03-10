import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load .env manually before anything else
const envContent = readFileSync(join(__dirname, '.env'), 'utf-8');
for (const line of envContent.split('\n')) {
  const trimmed = line.trim();
  if (trimmed && !trimmed.startsWith('#')) {
    const eqIdx = trimmed.indexOf('=');
    if (eqIdx > 0) {
      process.env[trimmed.slice(0, eqIdx)] = trimmed.slice(eqIdx + 1);
    }
  }
}

import express from 'express';
import cors from 'cors';
import multer from 'multer';
import fs from 'fs';
import path from 'path';
import Anthropic from '@anthropic-ai/sdk';
import { SIT_SYSTEM_PROMPT, GUIDED_STEP_PROMPTS } from './sit-knowledge.js';

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json({ limit: '50mb' }));

const upload = multer({
  dest: 'uploads/',
  limits: { fileSize: 20 * 1024 * 1024 }
});

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

// Chat endpoint
app.post('/api/chat', async (req, res) => {
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
});

// File upload endpoint
app.post('/api/upload', upload.single('file'), async (req, res) => {
  try {
    const file = req.file;
    if (!file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const ext = path.extname(file.originalname).toLowerCase();

    if (['.jpg', '.jpeg', '.png', '.gif', '.webp'].includes(ext)) {
      const data = fs.readFileSync(file.path);
      const base64 = data.toString('base64');
      const mediaType = ext === '.jpg' || ext === '.jpeg' ? 'image/jpeg'
        : ext === '.png' ? 'image/png'
        : ext === '.gif' ? 'image/gif'
        : 'image/webp';

      fs.unlinkSync(file.path);
      res.json({
        type: 'image',
        data: base64,
        mediaType,
        fileName: file.originalname
      });
    } else if (ext === '.pdf') {
      // Dynamic import for pdf-parse (CommonJS module)
      const pdfParse = (await import('pdf-parse/lib/pdf-parse.js')).default;
      const data = fs.readFileSync(file.path);
      const pdf = await pdfParse(data);

      fs.unlinkSync(file.path);
      res.json({
        type: 'text',
        data: pdf.text,
        fileName: file.originalname
      });
    } else if (['.txt', '.md', '.csv'].includes(ext)) {
      const text = fs.readFileSync(file.path, 'utf-8');
      fs.unlinkSync(file.path);
      res.json({
        type: 'text',
        data: text,
        fileName: file.originalname
      });
    } else {
      fs.unlinkSync(file.path);
      res.status(400).json({ error: 'Unsupported file type' });
    }
  } catch (error) {
    console.error('Upload error:', error);
    if (req.file) {
      try { fs.unlinkSync(req.file.path); } catch {}
    }
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`SIT Server running on http://localhost:${PORT}`);
});
