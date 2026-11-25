import { useMemo, useState } from "react";
import { activity, metrics, series } from "./data";

function Sparkline({ points, color }: { points: number[]; color: string }) {
  const max = Math.max(...points);
  const min = Math.min(...points);
  const span = max - min || 1;
  const path = points
    .map((p, i) => `${i === 0 ? "M" : "L"} ${(i / (points.length - 1)) * 100} ${40 - ((p - min) / span) * 34}`)
    .join(" ");
  return (
    <svg viewBox="0 0 100 44" preserveAspectRatio="none" className="spark" aria-hidden>
      <path d={path} fill="none" stroke={color} strokeWidth="1.6" vectorEffect="non-scaling-stroke" />
    </svg>
  );
}

function Chart() {
  const [hover, setHover] = useState<number | null>(null);
  const all = series.flatMap((s) => s.points);
  const max = Math.max(...all) * 1.1;
  const toY = (v: number) => 200 - (v / max) * 180;
  return (
    <div className="chart-wrap">
      <div className="chart-head">
        <div>
          <p className="chart-title">Event volume</p>
          <p className="chart-sub">Aggregated across all active workspaces</p>
        </div>
        <div className="legend">
          {series.map((s, i) => (
            <span key={s.label}>
              <i style={{ background: i === 0 ? "var(--cyan)" : "var(--electric)" }} /> {s.label}
            </span>
          ))}
        </div>
      </div>
      <svg viewBox="0 0 600 220" className="chart" role="img" aria-label="Event volume over time">
        {[40, 80, 120, 160, 200].map((y) => (
          <line key={y} x1="0" y1={y} x2="600" y2={y} stroke="rgba(148,163,184,.12)" />
        ))}
        {series.map((s, si) => {
          const pts = s.points.map((p, i) => `${(i / (s.points.length - 1)) * 600},${toY(p)}`);
          return (
            <g key={s.label}>
              <polyline
                points={pts.join(" ")}
                fill="none"
                stroke={si === 0 ? "var(--cyan)" : "var(--electric)"}
                strokeWidth={si === 0 ? 2.5 : 1.8}
                strokeDasharray={si === 0 ? undefined : "6 5"}
                opacity={si === 0 ? 1 : 0.75}
              />
              {hover !== null && (
                <circle
                  cx={(hover / (s.points.length - 1)) * 600}
                  cy={toY(s.points[hover] ?? 0)}
                  r="4"
                  fill={si === 0 ? "var(--cyan)" : "var(--electric)"}
                />
              )}
            </g>
          );
        })}
        {series[0]?.points.map((_, i) => (
          <rect
            key={i}
            x={(i / (series[0].points.length - 1)) * 600 - 12}
            y="0"
            width="24"
            height="220"
            fill="transparent"
            onMouseEnter={() => setHover(i)}
            onMouseLeave={() => setHover(null)}
          />
        ))}
      </svg>
      {hover !== null && (
        <p className="chart-tip">
          Interval {hover + 1}: this week <b>{series[0]?.points[hover]}</b> · last week{" "}
          <b>{series[1]?.points[hover]}</b>
        </p>
      )}
    </div>
  );
}

export function App() {
  const [workspace, setWorkspace] = useState("All workspaces");
  const total = useMemo(() => activity.filter((a) => workspace === "All workspaces" || a.segment === workspace).reduce((n, a) => n + a.value, 0), [workspace]);
  return (
    <div className="app">
      <header className="topbar">
        <div className="brand">
          <span className="brand-mark">AT</span>
          <span className="brand-name">Atlas <b>Analytics</b></span>
        </div>
        <div className="topbar-right">
          <select value={workspace} onChange={(e) => setWorkspace(e.target.value)} aria-label="Workspace">
            <option>All workspaces</option>
            <option>Enterprise</option>
            <option>Growth</option>
            <option>Starter</option>
          </select>
          <span className="avatar">SO</span>
        </div>
      </header>
      <aside className="sidebar">
        <p className="nav-label">Workspace</p>
        {["Overview", "Reports", "Cohorts", "Events", "Audiences", "Settings"].map((n, i) => (
          <button key={n} className={`nav-item ${i === 0 ? "active" : ""}`}>{n}</button>
        ))}
        <div className="sidebar-foot">
          <span className="dot" /> Streaming live
        </div>
      </aside>
      <main className="main">
        <div className="page-head">
          <div>
            <p className="eyebrow">Analytics workspace</p>
            <h1>Overview</h1>
          </div>
          <p className="updated">Updated just now · {total.toLocaleString()} events in view</p>
        </div>
        <div className="metric-grid">
          {metrics.map((m) => (
            <div className="card metric" key={m.label}>
              <p className="metric-label">{m.label}</p>
              <p className="metric-value">{m.value}</p>
              <p className={`metric-change ${m.change.startsWith("-") ? "down" : ""}`}>{m.change} vs last period</p>
            </div>
          ))}
        </div>
        <div className="card"><Chart /></div>
        <div className="card table-card">
          <p className="chart-title">Segments</p>
          <table>
            <thead><tr><th>Region</th><th>Segment</th><th>Events</th><th>Status</th></tr></thead>
            <tbody>
              {activity.filter((a) => workspace === "All workspaces" || a.segment === workspace).map((a) => (
                <tr key={a.name}>
                  <td>{a.name}</td><td>{a.segment}</td><td>{a.value.toLocaleString()}</td>
                  <td><span className={`pill ${a.status.toLowerCase()}`}>{a.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
      <footer className="watermark"><span className="wm-mark">SY</span> SYFERON</footer>
    </div>
  );
}
