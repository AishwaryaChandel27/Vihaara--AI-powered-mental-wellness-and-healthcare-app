# Vihaara — Journal, Mood and Wellness Companion

A React and Express wellness prototype for recording journal entries, tracking moods and requesting AI-assisted reflections. It combines browser-local records with server-side AI requests.

## What it implements

- Write journal entries and request reflections.
- Record moods and review insights.
- Chat with configurable tone and response length.
- Browse health-advice and mental-peace content, with bundled fallback responses.

## How it works

React pages use the local-storage helpers in `client/src/lib/storage.ts`. AI requests reach six Express handlers in `server/routes.ts`, which try OpenAI `gpt-4o`, then Gemini `gemini-1.5-flash`, then static fallback content. The user-storage adapter is in memory; the PostgreSQL schema does not make journals persist on a server.

## Current limitations

Content used in AI requests leaves the device and may be processed by external providers. Browser-local storage is not encryption. The OpenAI client is constructed before fallback checks, so a missing OpenAI key can prevent startup despite the intended key-free fallback. This is a wellness prototype, with no demonstrated clinical evaluation, access control or automated test suite.

## Run locally

The commands below were checked against source paths and manifests; application startup was not tested unless explicitly stated.
Use Node.js 20.11 or newer (the Vite configuration uses `import.meta.dirname`), npm, and a POSIX shell or WSL. Set the environment variables below in the launching process; these scripts do not explicitly load a `.env` file.

```bash
git clone --branch main https://github.com/AishwaryaChandel27/Vihaara--AI-powered-mental-wellness-and-healthcare-app.git
cd Vihaara--AI-powered-mental-wellness-and-healthcare-app
npm install
# Set provider environment variables before starting.
npm run dev
```
Open `http://localhost:5000` (or the configured port). Frontend and API are served by the same process.

Declared checks and build commands:

```bash
npm run check
npm run build
npm start
```
`check` is TypeScript checking, not an automated behavior test. `db:push` exists but is not needed for the active in-memory adapter; it requires a separately configured database. Production build commands do not establish that the application is ready for public deployment.

## Configuration

| Variable | Purpose / requirement |
| --- | --- |
| `OPENAI_API_KEY` | Required for the current client initialization and OpenAI calls |
| `GEMINI_API_KEY` | Optional secondary AI provider |

Use your own credentials. Never commit populated secret values.

## Usage

Open the journal, add a non-sensitive sample entry, and request an insight. Record a mood and try a chat message. Review Settings before clearing browser data, which removes locally stored records.

### Example request

```bash
curl -X POST http://localhost:5000/api/ai/analyze-journal \
  -H "Content-Type: application/json" \
  -d '{"content":"I enjoyed a quiet walk today."}'
```

Missing journal content returns HTTP 400. No API authentication middleware is present in the reviewed handlers. Provider requests may incur usage charges.

## API route index

Routes below are declared in [server/routes.ts](server/routes.ts). `:id` and similar segments are path parameters. Fields shown are read directly from request JSON; schema-validated routes also depend on [shared/schema.ts](shared/schema.ts). This is a source-level index, not a record of successful API calls.

| Method | Path | Body fields / contract source |
| --- | --- | --- |
| POST | `/api/ai/analyze-journal` | `content` |
| POST | `/api/ai/mood-insights` | `entries` |
| POST | `/api/ai/chat` | `messages`, `tone`, `responseLength` |
| POST | `/api/ai/health-advice` | `category`, `tone` |
| POST | `/api/ai/mental-peace` | `category`, `tone` |
| POST | `/api/ai/daily-tip` | `tone` |

The reviewed handlers do not establish an authenticated user boundary. Validate inputs and access control before exposing these routes beyond a local demonstration.

## Source map

| Path | Responsibility |
| --- | --- |
| [client/src/lib/storage.ts](client/src/lib/storage.ts) | Browser persistence |
| [client/src/lib/openai.ts](client/src/lib/openai.ts) | Client API requests |
| [server/routes.ts](server/routes.ts) | AI orchestration and validation |
| [server/fallback-content.ts](server/fallback-content.ts) | Static responses |

## Validation

Documentation was checked against the repository snapshot on 28 October 2026. No application test suite was run for this repository. Provider availability, browser behavior, builds and deployment are unverified.

## Demo capture

Suggested addition: a short recording of the usage workflow above, with synthetic inputs and visible limitations. No new screenshot or recording was produced in this audit.

## Contributing

Open an issue with reproduction steps or submit a focused pull request. Keep prototype behavior and future plans clearly distinguished, and include verification steps for changes.

## License

No license file was found. A manifest or older README license label does not replace an explicit license grant.

Maintained in [AishwaryaChandel27’s repositories](https://github.com/AishwaryaChandel27).
