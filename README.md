# Atlas Analytics

A multi-tenant analytics workspace demo built by **SYFERON**. It shows how scattered operational data can be presented as clear, shareable decisions: KPI cards, an interactive event-volume chart, and segment-level reporting with workspace filters.

![Atlas Analytics preview](docs/preview.svg)

## Run locally

```cmd
set "PATH=C:\Program Files\nodejs;%PATH%"
cd projects\atlas-analytics
npm install
npm run dev
```

Open the URL Vite prints (default `http://localhost:5173`).

## Build

```cmd
npm run build
```

## Stack

React 19 · TypeScript · Vite 8 · hand-built SVG charts (no chart dependency).

## Part of the SYFERON portfolio

This repository is one of four projects published alongside the SYFERON site:

- Atlas Analytics — analytics workspace
- Relay API Platform — versioned API platform
- Sentinel Recon Toolkit — authorized security-assessment automation
- Signal Threat Intelligence — threat-intelligence correlation dashboard

All demos carry the SYFERON watermark.

## License

MIT — see [LICENSE](./LICENSE).
