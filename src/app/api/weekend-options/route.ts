import { NextResponse } from "next/server";
import { loadSeedOptions } from "@/lib/seed";
import type { WeekendOptionsResponse } from "@/lib/types";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const origin = (url.searchParams.get("origin") || "PO1").toUpperCase();
  const maxDriveMins = Number(url.searchParams.get("maxDriveMins") || 120);

  const all = await loadSeedOptions();

  // Week-1: minimal gating only.
  const options = all.filter((o) => (o.drive.fromOriginMins ?? 9999) <= maxDriveMins);

  const res: WeekendOptionsResponse =
    options.length > 0
      ? {
          originLabel: origin,
          maxDriveMins,
          options,
          noResults: null,
        }
      : {
          originLabel: origin,
          maxDriveMins,
          options: [],
          noResults: {
            reason: "NO_WITHIN_DRIVE_TIME",
            suggestions: ["INCREASE_DRIVE_TIME"],
          },
        };

  return NextResponse.json(res);
}
