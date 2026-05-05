import { Redis } from '@upstash/redis';

const redis = new Redis({
  url: process.env.REDIS_URL,
  token: process.env.REDIS_TOKEN
});

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  const { date } = req.query;
  if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return res.status(400).json({ error: 'Invalid date format. Use YYYY-MM-DD.' });
  }
  try {
    const data = await redis.get(`brief:${date}`);
    if (!data) return res.status(404).json({ error: 'No brief found for this date.' });
    const brief = typeof data === 'string' ? JSON.parse(data) : data;
    res.json(brief);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch brief.' });
  }
}
