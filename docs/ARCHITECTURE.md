# Atlas Analytics — Architecture

## Purpose

Atlas is a React + TypeScript analytics workspace: KPI cards, an interactive SVG event-volume chart and a filterable segment table. It is the frontend half of a full-stack pair with [Relay API Platform](https://github.com/OlaniTech/relay-api-platform).

## System shape

```
                 VITE_API_BASE_URL set?
                    │           │
                  yes          no
                    │           │
        GET /v1/analytics/dashboard   bundled demo data
        Bearer VITE_API_KEY            (src/data.ts)
                    │           │
                    └─────┬─────┘
                          ▼
                  src/api.ts  →  DashboardData
                  { metrics, series, activity, source }
                          ▼
                      src/App.tsx
              header badge · KPI cards · SVG chart · table
```

## Data adapter

`src/api.ts` is the only place that knows about the network. `loadDashboard()`:

1. Reads `VITE_API_BASE_URL` at call time.
2. If unset, returns the bundled arrays from `src/data.ts` with `source: "demo"`.
3. If set, fetches `${base}/v1/analytics/dashboard` with `Authorization: Bearer <VITE_API_KEY>`.
4. Validates that `metrics`, `series` and `activity` are present.
5. On any failure, logs a warning and falls back to demo data with `source: "demo"`.

This keeps the UI unchanged whether data is live or bundled, and makes the failure path explicit rather than crashing the page.

## UI structure

- `Sparkline` — small inline SVG trend per metric card
- `Chart` — 600×220 SVG polyline chart with hover crosshair and tooltip
- `App` — workspace filter, data loading, header badge, tables and footer watermark

The workspace filter runs client-side over `activity.segment`. Relay returns `Enterprise`, `Growth` and `Starter` segments so live data works with the same filter as the demo data.

## Source states

| State | Condition | Header badge | Sidebar |
| --- | --- | --- | --- |
| Live | API reachable and valid | `LIVE API` | Streaming live |
| Demo | No URL, or API failed | `DEMO DATA` | Demo mode |

The badge prevents a viewer from mistaking bundled data for live data.

## Testing

- `src/api.test.ts` — demo fallback, live fetch with bearer header, network failure fallback, malformed response fallback
- `src/App.test.tsx` — renders demo badge and live badge with a stubbed `fetch`, and confirms API rows appear

Vitest runs in jsdom; `vi.stubEnv` switches `VITE_API_BASE_URL` between cases. Tests do not need a running backend.

## Deployment

GitHub Actions runs `npm test`, then `npm run build`, then deploys `dist` to GitHub Pages. The Pages build has no env vars, so it always shows **DEMO DATA**. Running locally with `.env` copied from `.env.example` connects it to Relay and shows **LIVE API**.

Relay must allow cross-origin requests from the Vite dev server; it sets permissive CORS headers for this local-demo purpose.
