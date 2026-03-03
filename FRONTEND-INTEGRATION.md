# Frontend Integration Guide

This doc explains how the frontend should call the backend APIs, what to send, and what to expect back. It is designed so the frontend can be built independently and later switched to the real base URL.

## Base URL

- Production: `https://skill-gap-visualizer-backend.vercel.app`
- Local (if running locally): set via your frontend env (e.g. `VITE_API_BASE` or `NEXT_PUBLIC_API_BASE`)

All endpoints are under `/api/*`.

## Warm-up (reduce cold start)

Call this once on page load or when the user opens the file picker:

- `GET /api/health`

If the user sits idle for a long time (1–3 minutes), call it again right before the first real API call. You do **not** need a continuous interval ping.

## API Flow (recommended)

1. User selects file → parse resume into `resumeText` (string)
2. `POST /api/extract` → receive structured extraction
3. (Optional) Let user edit `extractedSkills` / `inferredSkills`
4. `POST /api/analyze-resume` → receive score + insights

## Endpoint: GET /api/health

**Purpose**: liveness check and warm-up.

Success (200):

```json
{
  "status": "ok",
  "timestamp": "2026-02-24T12:34:56.000Z",
  "version": "9044ff6"
}
```

If method is not GET, returns 405 with error envelope.

## Endpoint: POST /api/extract

**Purpose**: extract structured signals from raw resume text.

Request:

```json
{
  "resumeText": "...",
  "turnstileToken": "..."
}
```

Constraints:

- `resumeText` required
- max length: 30,000 chars

Success (200, shape only):

```json
{
  "extractedSkills": [{ "skill": "javascript" }],
  "inferredSkills": [
    { "skill": "Frontend Framework", "source": "Detected keyword \"react\"..." }
  ],
  "experienceYears": null,
  "educationLevel": "Bachelor's",
  "tools": ["Git", "Vite"],
  "projects": ["Inventory Dashboard"],
  "rawSummary": "Frontend developer with experience in React and tooling.",
  "extractionSource": "openai"
}
```

Shape notes:

- `matches.matchedSkills[]`: `{ skill: string, category: string, type: "explicit" }`
- `matches.weakSignals[]`: `{ skill: string, category: string, type: "weak-signal" }`
- `matches.missingSkills[]`: `{ skill: string, category: string }`
- `analysis.categoryScores[]`: `{ category, score, possible, percentage, skills[] }`
- `analysis.categoryScores[].skills[]`: `{ skillName, matchType, score, possible }`
- `analysis.insights[]`: `{ category, score, possible, percentage, level }`
- `analysis.strengthWeakness.strengths[]`: `{ category, skill, type }`
- `analysis.strengthWeakness.weaknesses[]`: `{ category, skill, type }`
- `analysis.strengthWeakness.criticalGaps[]`: `{ category, skill, type }`
- `analysis.recommendations[]`: string
- Arrays may be empty depending on the input.

Notes:

- `extractionSource` is `openai` or `fallback`
- Arrays may be empty
- `experienceYears` may be `null`
- `turnstileToken` is required only when Turnstile is enabled

## Endpoint: POST /api/analyze-resume

**Purpose**: score resume against benchmark and return insights.

Request (minimum):

```json
{
  "resumeText": "...",
  "extractedSkills": [{ "skill": "react" }],
  "inferredSkills": [
    { "skill": "Frontend Framework", "source": "Detected keyword react" }
  ],
  "role": "react",
  "level": "junior",
  "companyType": "unicorn",
  "experienceYears": 0
}
```

Supported combinations (current):

- `react / junior / unicorn`
- `react / senior / unicorn`

Constraints:

- `resumeText` required, max 100,000 chars
- `extractedSkills` and `inferredSkills` keys are required (can be empty arrays)
- arrays max 1000 items each
- skill/source strings max 500 chars

Success (200, shape only):

```json
{
  "metadata": {
    "role": "react",
    "level": "junior",
    "companyType": "unicorn",
    "experienceYears": 0
  },
  "matches": {
    "matchedSkills": [
      { "skill": "React", "category": "Frontend", "type": "explicit" }
    ],
    "weakSignals": [
      { "skill": "Hooks", "category": "Frontend", "type": "weak-signal" }
    ],
    "missingSkills": [{ "skill": "Testing", "category": "Quality" }]
  },
  "analysis": {
    "finalScore": 75.5,
    "categoryScores": [],
    "insights": [],
    "strengthWeakness": {
      "strengths": [],
      "weaknesses": [],
      "criticalGaps": []
    },
    "atsReadiness": {
      "score": 10,
      "total": 20,
      "percentage": 0.5,
      "matchedKeywords": [],
      "missingKeywords": []
    },
    "recommendations": []
  }
}
```

## Error Handling (all endpoints)

Errors are always:

```json
{ "error": { "code": "...", "message": "...", "details": {} } }
```

Common status codes:

- `400 VALIDATION_ERROR` (missing or invalid input)
- `400 BAD_REQUEST` (invalid skill array shape)
- `405 METHOD_NOT_ALLOWED` (wrong method; includes `Allow` header)
- `413 PAYLOAD_TOO_LARGE` (resumeText too long)
- `500 INTERNAL_ERROR`

Edge rate limiting note:
- If rate limiting is enforced at the Vercel edge, the response body may **not** follow the standard error schema. Frontend should always check HTTP status codes (e.g., `429`) first.

CAPTCHA note:
- When Turnstile is enabled, the frontend must include a `turnstileToken` with `/api/extract`. The backend will verify it and reject invalid or missing tokens.
- The frontend uses the **Turnstile Site Key** (public). The backend uses the **Turnstile Secret Key** (private).
- If Turnstile verification fails, show a user-friendly message (e.g., “Please complete verification and try again.”).

CORS note:
- No frontend changes are required as long as the frontend origin is in the backend allowlist.
- If you see a browser CORS error, ensure the frontend domain is included in `CORS_ALLOWED_ORIGINS` on the backend.

Frontend should display a readable message and log `error.details` for debugging.

## Frontend Notes

- Always send both `extractedSkills` and `inferredSkills` keys to `/api/analyze-resume` (even if empty arrays).
- The LLM output is not guaranteed to be semantically perfect, but the JSON structure is stable.
- If the user edits skills in the UI, send the edited arrays as-is.

## Example flow (pseudo)

```js
await fetch(`${API_BASE}/api/health`).catch(() => {});

const extract = await post(`${API_BASE}/api/extract`, { resumeText });

const analyze = await post(`${API_BASE}/api/analyze-resume`, {
  resumeText,
  extractedSkills: extract.extractedSkills,
  inferredSkills: extract.inferredSkills,
  role: "react",
  level: "junior",
  companyType: "unicorn",
});
```
