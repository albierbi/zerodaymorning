import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { Redis } from '@upstash/redis';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '.env') });

const redis = new Redis({ url: process.env.REDIS_URL, token: process.env.REDIS_TOKEN });

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../frontend')));

app.get('/api/brief', async (req, res) => {
  try {
    const data = await redis.get('brief:current');
    if (!data) return res.status(503).json({ error: 'No brief available yet.' });
    const brief = typeof data === 'string' ? JSON.parse(data) : data;
    res.json(brief);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch brief.' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
