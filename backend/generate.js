import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { Redis } from '@upstash/redis';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '.env') });

const redis = new Redis({ url: process.env.REDIS_URL, token: process.env.REDIS_TOKEN });

async function generate() {
  console.log(`[${new Date().toISOString()}] Generating brief...`);

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': process.env.ANTHROPIC_API_KEY,
      'anthropic-version': '2023-06-01'
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-5',
      max_tokens: 4000,
      system: systemPrompt,
      messages: [{ role: 'user', content: "Generate today's cybersecurity brief." }]
    })
  });

  const data = await response.json();
  const raw = data.content[0].text;
  const clean = raw.replace(/```json|```/g, '').trim();
  const brief = JSON.parse(clean);
  brief.generatedAt = new Date().toISOString();

  await redis.set('brief:current', JSON.stringify(brief));
  console.log(`[${new Date().toISOString()}] Brief saved to Redis: "${brief.title}"`);
}

generate().catch(err => {
  console.error('Generation failed:', err);
  process.exit(1);
});
