import { Redis } from '@upstash/redis';

const redis = new Redis({
  url: process.env.REDIS_URL,
  token: process.env.REDIS_TOKEN
});

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  try {
    const data = await redis.get('brief:current');
    if (!data) return res.status(503).json({ error: 'No brief available yet.' });
    const brief = typeof data === 'string' ? JSON.parse(data) : data;
    res.json(brief);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch brief.' });
  }
}
