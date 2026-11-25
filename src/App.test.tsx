import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import { App } from "./App";
import { activity, metrics, series } from "./data";

afterEach(() => {
  cleanup();
  vi.unstubAllEnvs();
  vi.unstubAllGlobals();
});

describe("Atlas dashboard source", () => {
  it("shows a demo badge when no backend is configured", async () => {
    vi.stubEnv("VITE_API_BASE_URL", "");
    render(<App />);
    expect(await screen.findByText("DEMO DATA")).toBeTruthy();
    expect(screen.getByText("Demo mode")).toBeTruthy();
    expect(screen.getByText("Active users")).toBeTruthy();
  });

  it("shows a live badge and renders API aggregates when Relay is configured", async () => {
    vi.stubEnv("VITE_API_BASE_URL", "http://localhost:4000");
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({ metrics, series, activity }),
      }),
    );

    render(<App />);
    expect(await screen.findByText("LIVE API")).toBeTruthy();
    expect(screen.getByText("Streaming live")).toBeTruthy();
    expect(screen.getByText("North America")).toBeTruthy();
  });
});
