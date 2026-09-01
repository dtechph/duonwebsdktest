# Duon Wayfinding Web SDK sample

Next.js sample that lists malls from the Duon backend and embeds the selected map
via `@dtechph/wayfinding-web`. Situm malls show origin/destination routing; kiosk malls
use the opaque iframe viewer.

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

| Route | Mode | Layout | What it shows |
|-------|------|--------|----------------|
| `/` | `embedded` | Full page | `DuonMallSelector` + `DuonMapView` filling the viewport. Situm malls include origin/destination routing. |
| `/embedded` | `embedded` | Controlled size | Map in a 480px card with a custom mall picker that calls `setActiveMall`. |
| `/iframe` | `iframe` | Full page | Same full-page layout, opaque viewer iframe with no routing chrome. |
| `/iframe/card` | `iframe` | Controlled size | Same 480px card layout as `/embedded`, opaque viewer iframe. |

```
useDuonMalls
  → DuonWayfinding.initialize({ platform: "web" })
  → DuonWayfinding.fetchMalls()
  → selector + DuonMapView
  → DuonWayfinding.endTelemetrySession() on unmount
```

SDK packages are linked to the local DuonSDK checkout so unpublished changes can be
tested here:

- `@dtechph/wayfinding-web` → `file:../../DuonCore/DuonSDK/packages/web`
- `@dtechph/wayfinding-core` → `file:../../DuonCore/DuonSDK/packages/core`

App code still imports only from `@dtechph/wayfinding-web`. After you publish, switch
those dependencies back to the npm versions.

Rebuild the SDK whenever you change it, then refresh this app:

```bash
npm run sdk:build
```

## Scripts

- `npm run dev` — Next.js development server
- `npm run build` — production build
- `npm start` — serve the production build
