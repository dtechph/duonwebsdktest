# Duon Wayfinding Web SDK sample

Next.js sample that lists malls from the Duon backend and embeds the selected map
via the published npm package `@dtechph/wayfinding-web`.

This follows the DuonSDK web getting-started guide (`DuonSDK/docs/web`). Indoor
positioning is not available in the browser.

## Prerequisites

1. A Map Viewer scoped API key from Duon (CMS → SDK Keys)
2. At least one mall assigned to that key

## Setup

```bash
cp .env.example .env.local
# Set NEXT_PUBLIC_DUON_API_URL and NEXT_PUBLIC_DUON_API_KEY

npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). If port 3000 is taken, Next.js
picks the next free port.

### Environment

| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_DUON_API_URL` | Duon backend base URL. No trailing path required. |
| `NEXT_PUBLIC_DUON_API_KEY` | SDK key with **Map Viewer** scope |

These `NEXT_PUBLIC_` values are inlined into the browser bundle. That is expected
for this key — it can only read assigned malls and write analytics.

## Samples

| Route | What it shows |
|-------|----------------|
| `/` | Full-page map. `DuonMallSelector` + `DuonMapView` filling the viewport. |
| `/embedded` | Map in a smaller card (`style={{ height: 480 }}`) with a custom mall picker that calls `setActiveMall`. |

```
useDuonMalls
  → DuonWayfinding.initialize({ platform: "web" })
  → DuonWayfinding.fetchMalls()
  → selector + DuonMapView
  → DuonWayfinding.endTelemetrySession() on unmount
```

SDK package: `@dtechph/wayfinding-web` (npm). `@dtechph/wayfinding-core` is pulled
in automatically — do not import it directly.

## Scripts

- `npm run dev` — Next.js development server
- `npm run build` — production build
- `npm start` — serve the production build
