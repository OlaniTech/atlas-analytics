# Atlas Analytics — Decisions & Tradeoffs

This document explains why the frontend is built the way it is, and what would change at scale.

## Decisions

### A dedicated API adapter

All network access lives in `src/api.ts`. Components receive a plain `DashboardData` object and never call `fetch` themselves. This made the live integration a small change and made the adapter straightforward to unit test.

### Graceful fallback with an honest badge

GitHub Pages cannot host a Node API. Rather than build a site that breaks without a backend, Atlas bundles a small demo dataset and labels it **DEMO DATA**. When `VITE_API_BASE_URL` is set and the API responds, the badge changes to **LIVE API**. Presenting demo data as live would be misleading; hiding the live capability would undersell the full-stack work.

### Hand-built SVG charts

The chart and sparklines are plain SVG generated in React. No charting library means no extra dependency, a smaller bundle and full control over the visual style. The cost is limited interactivity — no zoom, brushing or accessible tooltips yet.

### Client-side workspace filtering

The filter is a simple array filter. It matches the demo dataset and Relay's segment labels, so live and demo modes behave identically. This is appropriate for a few rows, not for large datasets.

### No router or state library

The app is a single dashboard view. Adding a router, React Query or a store would add structure without solving a real problem at this scale. That changes as soon as there are multiple pages, server mutations or cached queries.

### Environment-driven configuration

`VITE_API_BASE_URL` and `VITE_API_KEY` are read through Vite's `import.meta.env`. A committed `.env.example` documents them; `.env` is ignored. The default key is a local demo value, never a production secret.

## Known limits

- No user authentication or per-workspace access control
- No refetching, polling or cache — data is loaded once on mount
- Network errors are logged and fall back, but there is no retry UI
- Chart tooltips are mouse-only; keyboard and screen-reader support is basic
- Segment values are illustrative, not real tenant data
- The Pages demo cannot show live data by design

## What I'd change at scale

1. **React Query** — caching, background refresh, retries and request deduplication.
2. **Real auth** — sign-in, scoped tokens and server-enforced workspace access; never trust a client-side filter.
3. **Server-side aggregation** — move grouping and filtering into the API with query parameters and pagination.
4. **Accessible visualisation** — keyboard-navigable chart points, text summaries and an alternative table view.
5. **Design system** — extract reusable components and tokens, add Storybook and visual regression tests.
6. **End-to-end tests** — Playwright covering live/demo modes, filtering and error states against a seeded API.
7. **Observability** — surface the API `request_id` in the UI so a failed load can be traced to a server log.
