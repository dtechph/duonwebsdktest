# Duon Wayfinding Web SDK sample

Next.js sample that lists malls from the Duon backend and embeds the selected map
via [`@dtechph/wayfinding-web`](https://www.npmjs.com/package/@dtechph/wayfinding-web).
This checkout uses the local `DuonCore/DuonSDK/packages/web` package so unpublished
analytics fixes are picked up. Situm malls show origin/destination routing; kiosk malls
use the opaque iframe viewer.

Embedded Situm maps report `poi_select`, `poi_category_selected` (with category **names**
resolved from the POI catalog), `search`, `route_request`, and `navigation_request`
automatically. Point-to-point routing is what CMS counts as “Most navigated POIs”.
Indoor positioning is not available in the browser.

Full integration guide: [Web docs](../../DuonCore/DuonSDK/docs/web) in the sibling DuonSDK
checkout. Iframe vs embedded vs origin/destination pathfinding:
[map render modes](../../DuonCore/DuonSDK/docs/web/map-modes.md).

## Prerequisites

1. A Map Viewer scoped API key from Duon
2. At least one mall assigned to that key

## Setup

```bash
cp .env.example .env.local
# Set NEXT_PUBLIC_DUON_API_URL and NEXT_PUBLIC_DUON_API_KEY

npm install
npm run dev
```

No GitHub access is required. This checkout depends on the local
`DuonCore/DuonSDK/packages/web` package so unpublished analytics fixes are picked
up. Change the dependency back to `@dtechph/wayfinding-web` from npm to install from
the registry only. `@dtechph/wayfinding-core` is a transitive dependency — import only
from `@dtechph/wayfinding-web`.

Open [http://localhost:3000](http://localhost:3000). If port 3000 is taken, Next.js
picks the next free port.

### Deeplink example

After you pick a mall and route, use the **Deeplink** panel to copy a shareable URL, or
open a link directly:

```text
http://localhost:3000/?mall=<buildingId-or-slug>&origin=<poiId>&destination=<poiId>
```

POI ids are Situm ids from the route picker or from `fetchPois()`. Embedded Situm malls
draw the path when both `origin` and `destination` are set.

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
| `/` | `embedded` | Full page | `DuonMallSelector` + `DuonMapView` filling the viewport. Situm malls include origin/destination routing. **Deeplink** panel: share URLs with `?mall=&origin=&destination=`. |
| `/embedded` | `embedded` | Controlled size | Map in a 480px card with a custom mall picker that calls `setActiveMall`. |
| `/iframe` | `iframe` | Full page | Same full-page layout, opaque viewer iframe with no routing chrome. |
| `/iframe/card` | `iframe` | Controlled size | Same 480px card layout as `/embedded`, opaque viewer iframe. |

```
useDuonMalls
  → DuonWayfinding.initialize({ platform: "web" })
  → DuonWayfinding.fetchMalls()
  → selector + DuonMapView(mall)
  → DuonWayfinding.endTelemetrySession() on unmount
```

SDK package: local `DuonCore/DuonSDK/packages/web` (`file:` in `package.json`).

## Scripts

- `npm run dev` — Next.js development server
- `npm run build` — production build
- `npm start` — serve the production build
