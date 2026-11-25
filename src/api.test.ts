import { afterEach, describe, expect, it, vi } from "vitest";
import { loadDashboard } from "./api";
import { activity, metrics, series } from "./data";

const payload = {
  metrics: [{ label: "Live events", value: "42", change: "+live" }],
  series: [{ label: "Live", points: [1, 2, 3] }],
  activity: [{ name: "North America", segment: "Enterprise", value: 42, status: "Live" as const }],
};

afterEach(() => {
  vi.unstubAllEnvs();
  vi.unstubAllGlobals();
});

describe("loadDashboard", () => {
  it("uses bundled demo data when no API base URL is configured", async () => {
    vi.stubEnv("VITE_API_BASE_URL", "");
    const result = await loadDashboard();
    expect(result.source).toBe("demo");
    expect(result.metrics).toEqual(metrics);
    expect(result.series).toEqual(series);
    expect(result.activity).toEqual(activity);
  });

  it("fetches live aggregates with a bearer token when configured", async () => {
    vi.stubEnv("VITE_API_BASE_URL", "http://localhost:4000/");
    vi.stubEnv("VITE_API_KEY", "test_key");
    const fetchMock = vi.fn().mockResolvedValue({ ok: true, json: async () => payload });
    vi.stubGlobal("fetch", fetchMock);

    const result = await loadDashboard();
    expect(fetchMock).toHaveBeenCalledWith("http://localhost:4000/v1/analytics/dashboard", {
      headers: { Authorization: "Bearer test_key" },
    });
    expect(result.source).toBe("live");
    expect(result.metrics[0]?.label).toBe("Live events");
  });

  it("falls back to demo data when the API is unavailable", async () => {
    vi.stubEnv("VITE_API_BASE_URL", "http://localhost:4000");
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new Error("offline")));
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});

    const result = await loadDashboard();
    expect(result.source).toBe("demo");
    expect(result.metrics).toEqual(metrics);
    expect(warn).toHaveBeenCalled();
    warn.mockRestore();
  });

  it("falls back to demo data when the API returns an unexpected shape", async () => {
    vi.stubEnv("VITE_API_BASE_URL", "http://localhost:4000");
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ ok: true, json: async () => ({ metrics: [] }) }));
    vi.spyOn(console, "warn").mockImplementation(() => {});

    const result = await loadDashboard();
    expect(result.source).toBe("demo");
  });
});
