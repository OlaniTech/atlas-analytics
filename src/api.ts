import { activity, metrics, series } from "./data";
import type { Activity, Metric, Series } from "./data";

export type DashboardData = {
  metrics: Metric[];
  series: Series[];
  activity: Activity[];
  source: "live" | "demo";
};

/**
 * When VITE_API_BASE_URL points at the Relay API, Atlas renders real aggregated
 * data. Otherwise it falls back to the bundled demo dataset so the GitHub Pages
 * build works without a backend.
 */
export async function loadDashboard(): Promise<DashboardData> {
  const base = import.meta.env.VITE_API_BASE_URL as string | undefined;
  if (!base) {
    return { metrics, series, activity, source: "demo" };
  }

  try {
    const res = await fetch(`${base.replace(/\/$/, "")}/v1/analytics/dashboard`, {
      headers: { Authorization: `Bearer ${import.meta.env.VITE_API_KEY ?? "rly_live_demo"}` },
    });
    if (!res.ok) throw new Error(`API returned ${res.status}`);
    const body = (await res.json()) as {
      metrics?: Metric[];
      series?: Series[];
      activity?: Activity[];
    };
    if (!body.metrics || !body.series || !body.activity) {
      throw new Error("Unexpected response shape");
    }
    return { metrics: body.metrics, series: body.series, activity: body.activity, source: "live" };
  } catch (error) {
    console.warn("Atlas could not reach the Relay API; using demo data.", error);
    return { metrics, series, activity, source: "demo" };
  }
}
