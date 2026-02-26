# Skill Gap Visualizer

Frontend app that lets you upload a resume, extract skills, and benchmark against a target role to get strengths, gaps, and a personalized improvement plan.

## Features
- Resume upload (PDF/DOCX/TXT) and text extraction
- Review/edit extracted and inferred skills
- Benchmark by role, level, and company type
- Analysis view with strengths, weaknesses, and priorities

## Tech Stack
- React 19 + Vite
- Tailwind CSS
- React Router

## Setup
```bash
npm install
npm run dev
```

## Environment
Create a `.env` file (or use `.env.example`):
```
VITE_USE_MOCK_API=true
```

## Scripts
```bash
npm run dev
npm run build
npm run preview
npm run lint
```

## Notes
- When `VITE_USE_MOCK_API=false`, the app expects backend endpoints at:
  - `POST /api/extract`
  - `POST /api/analyze-resume`
