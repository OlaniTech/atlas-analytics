export type Metric = { label: string; value: string; change: string };
export type Series = { label: string; points: number[] };
export type Activity = { name: string; segment: string; value: number; status: "Live" | "Paused" };

export const metrics: Metric[] = [
  { label: "Active users", value: "24,810", change: "+12.4%" },
  { label: "Events / day", value: "1.42M", change: "+8.1%" },
  { label: "Conversion", value: "4.87%", change: "+0.6%" },
  { label: "Avg. session", value: "6m 12s", change: "-1.2%" },
];

export const series: Series[] = [
  { label: "This week", points: [32, 38, 35, 46, 52, 49, 61, 58, 67, 72, 69, 81] },
  { label: "Last week", points: [28, 31, 30, 36, 40, 43, 41, 48, 50, 54, 58, 60] },
];

export const activity: Activity[] = [
  { name: "North America", segment: "Enterprise", value: 8420, status: "Live" },
  { name: "Europe", segment: "Growth", value: 6180, status: "Live" },
  { name: "Asia Pacific", segment: "Enterprise", value: 5430, status: "Live" },
  { name: "Latin America", segment: "Starter", value: 2980, status: "Paused" },
];
