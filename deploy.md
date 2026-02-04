# Deploy (Frontend - Vercel)

## Requirements

- Node: 22.x

## Environment Variables (Vercel)

- VITE_USE_MOCK_API=true (deploy with mock data)

## Build

- Install: npm install
- Build: npm run build
- Output: dist/

## Vercel Settings (if monorepo)

- Root Directory: frontend
- Build Command: npm run build
- Output Directory: dist

## React Router refresh (deep links)

If refreshing `/wizard` or `/analysis` shows 404, add `vercel.json` rewrites:
{
"rewrites": [{ "source": "/(.*)", "destination": "/" }]
}
