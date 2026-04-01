import { IncomingForm } from 'formidable';
import fs from 'fs';
import path from 'path';

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const form = new IncomingForm({
    maxFileSize: 20 * 1024 * 1024,
    keepExtensions: true,
  });

  try {
    const [fields, files] = await form.parse(req);
    const file = files.file?.[0];

    if (!file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const ext = path.extname(file.originalFilename || '').toLowerCase();

    if (['.jpg', '.jpeg', '.png', '.gif', '.webp'].includes(ext)) {
      const data = fs.readFileSync(file.filepath);
      const base64 = data.toString('base64');
      const mediaType = ext === '.jpg' || ext === '.jpeg' ? 'image/jpeg'
        : ext === '.png' ? 'image/png'
        : ext === '.gif' ? 'image/gif'
        : 'image/webp';

      fs.unlinkSync(file.filepath);
      return res.json({
        type: 'image',
        data: base64,
        mediaType,
        fileName: file.originalFilename
      });
    } else if (ext === '.pdf') {
      const pdfParse = (await import('pdf-parse/lib/pdf-parse.js')).default;
      const data = fs.readFileSync(file.filepath);
      const pdf = await pdfParse(data);

      fs.unlinkSync(file.filepath);
      return res.json({
        type: 'text',
        data: pdf.text,
        fileName: file.originalFilename
      });
    } else if (['.txt', '.md', '.csv'].includes(ext)) {
      const text = fs.readFileSync(file.filepath, 'utf-8');
      fs.unlinkSync(file.filepath);
      return res.json({
        type: 'text',
        data: text,
        fileName: file.originalFilename
      });
    } else {
      fs.unlinkSync(file.filepath);
      return res.status(400).json({ error: 'Unsupported file type' });
    }
  } catch (error) {
    console.error('Upload error:', error);
    return res.status(500).json({ error: error.message });
  }
}
