import fs from "node:fs/promises";
import path from "node:path";
import type { WeekendOption } from "./types";

export async function loadSeedOptions(): Promise<WeekendOption[]> {
  const seedPath = path.join(process.cwd(), "seed", "weekend-options.po1.json");
  const raw = await fs.readFile(seedPath, "utf-8");
  const parsed = JSON.parse(raw) as { options: WeekendOption[] };
  return parsed.options;
}
