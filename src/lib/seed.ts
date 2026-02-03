import fs from "node:fs/promises";
import path from "node:path";
import type { LodgingFixtureDb, LodgingOption, WeekendOption } from "./types";

export async function loadSeedOptions(): Promise<WeekendOption[]> {
  const seedPath = path.join(process.cwd(), "seed", "weekend-options.po1.json");
  const raw = await fs.readFile(seedPath, "utf-8");
  const parsed = JSON.parse(raw) as { options: WeekendOption[] };
  return parsed.options;
}

export async function loadLodgingFixtures(): Promise<LodgingFixtureDb> {
  const seedPath = path.join(process.cwd(), "seed", "lodging.fixtures.json");
  const raw = await fs.readFile(seedPath, "utf-8");
  return JSON.parse(raw) as LodgingFixtureDb;
}

export async function loadLodgingForTown(townName: string): Promise<LodgingOption[]> {
  const db = await loadLodgingFixtures();
  const key = Object.keys(db.towns).find((k) => k.toLowerCase() === townName.toLowerCase());
  return key ? db.towns[key] : [];
}
