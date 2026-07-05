# PersonaAI — Chai aur Code Style Coding Mentor Chatbot

PersonaAI is a persona-based coding mentor chatbot backend, inspired by the
teaching styles of two well-known Indian tech educators:

- **"Hitesh" Persona** — warm, humble, Hinglish-speaking mentor with a
  chai-fueled, beginner-friendly teaching style.
- **"Piyush" Persona** — sharp, direct, systems/architecture-focused
  full-stack engineering mentor.

The backend is built with **Express.js** and calls the **OpenAI Chat
Completions API** to generate persona-driven responses.

---

## Tech Stack

- Node.js (ES Modules)
- Express.js
- OpenAI Node SDK (`openai`)
- Vite (frontend dev server / static serving)
- dotenv (environment variable management)

---

## Prerequisites

- Node.js v18 or higher installed
- An OpenAI API key ([platform.openai.com](https://platform.openai.com))
- npm (comes with Node.js)

---

## Setup Instructions

### 1. Clone the repository

```bash
git clone https://github.com/YOUR_USERNAME/PersonaAi.git
cd PersonaAi
```

### 2. Install dependencies

```bash
npm install
```

This installs Express, the OpenAI SDK, Vite, dotenv, and any frontend
dependencies listed in `package.json`.

### 3. Configure environment variables

Create a `.env` file in the project root:

```
OPENAI_API_KEY=sk-your-openai-api-key-here
NODE_ENV=development
```

> **Never commit your `.env` file.** Make sure `.env` is listed in
> `.gitignore` before pushing to GitHub.

### 4. Run the development server

```bash
node server.js
```

By default, the server runs on:

```
http://localhost:3000
```

In development mode, Vite's middleware serves the frontend with hot
reload. In production (`NODE_ENV=production`), the server serves static
built files from the `/dist` folder.

### 5. Build for production (if applicable)

```bash
npm run build
NODE_ENV=production node server.js
```

---

## API Reference

### `GET /api/health`

Health check endpoint.

**Response:**
```json
{ "status": "ok", "time": "2026-07-05T12:00:00.000Z" }
```

### `POST /api/chat`

Send a message to a persona and receive a response.

**Request body:**
```json
{
  "persona": "hitesh",
  "messages": [
    { "sender": "user", "text": "How do closures work in JavaScript?" }
  ]
}
```

- `persona`: `"hitesh"` or `"piyush"`
- `messages`: array of prior conversation turns, each with a `sender`
  (`"user"` or `"model"`) and `text`

**Response:**
```json
{ "text": "Hanji! Bohot simple hai ji..." }
```

---

## Project Structure

```
PersonaAi/
├── server.js          # Express server + persona prompts + OpenAI integration
├── .env               # API keys (not committed)
├── .gitignore
├── package.json
├── src/               # Frontend source (Vite app)
└── dist/              # Production build output (generated)
```

---

## Notes

- Both personas are configured to always respond in modern, plain
  JavaScript (no TypeScript) in code examples, unless a user explicitly
  requests another language.
- Personas are inspired by public teaching styles and explicitly
  identify as AI assistants if asked directly — see `DOCUMENTATION.md`
  for the reasoning behind this design choice.