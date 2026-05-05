# Zero-Day Morning

A daily cybersecurity briefing. One topic per day, one brief per morning. Could be a real breach, a CVE breakdown, a CTF technique, a piece of malware, a privilege escalation trick. Written to be read in about 20 minutes.

Live at **[zerodaymorning.dev](https://zerodaymorning.dev)**

---

## How it works

A cron job runs at 6am UTC every day. It calls the Anthropic API, generates a brief, and stores it in Redis. Everyone who visits the site that day reads the same issue. The previous day's brief gets archived automatically.

The archive page lets you filter by difficulty and search by keyword. Each brief links to its own URL by date.

## Stack

- Frontend: plain HTML, CSS, JavaScript
- Backend: Node.js serverless functions (Vercel)
- Storage: Upstash Redis
- AI: Anthropic API (claude-sonnet)
- Hosting: Vercel

## Project structure

```
zerodaymorning/
├── api/
│   ├── brief.js            # serves today's brief from Redis
│   ├── brief-by-date.js    # serves a specific past brief by date
│   ├── archive.js          # returns the list of all past briefs
│   └── generate.js         # generates a new brief and saves it
├── frontend/
│   ├── index.html          # main page
│   ├── archive.html        # archive page
│   └── favicon.svg
├── backend/
│   └── generate.js         # local generation script (for testing)
├── vercel.json
└── package.json
```

## Running locally

Clone the repo and install dependencies:

```bash
git clone https://github.com/albierbi/zerodaymorning
cd zerodaymorning
npm install
```

Create `backend/.env`:

```
ANTHROPIC_API_KEY=your-key-here
REDIS_URL=your-upstash-url
REDIS_TOKEN=your-upstash-token
GENERATE_SECRET=your-secret
```

Generate a brief locally:

```bash
npm run generate
```

Start the server:

```bash
npm start
```

Open `http://localhost:3000`.

## Triggering generation manually

```bash
curl -X POST https://zerodaymorning.dev/api/generate \
  -H "x-secret: your-secret"
```

The endpoint rate limits to one generation per 20 hours, so there's no risk of accidentally burning through API credits.

## Notes

Built as a first solo project. The goal was to ship something real with a proper backend, external APIs, persistent storage, and automated deployment. It also happens to be useful for learning cybersecurity.
