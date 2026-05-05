import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config({ path: path.join(path.dirname(fileURLToPath(import.meta.url)), '.env') });

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../frontend')));

app.get('/api/brief', async (req, res) => {
  try {
    const filePath = path.join(__dirname, 'data', 'brief.json');
    const raw = await fs.readFile(filePath, 'utf-8');
    const brief = JSON.parse(raw);
    res.json(brief);
  } catch (err) {
    res.status(503).json({ error: 'No brief available yet. Check back soon.' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
