import { NextResponse } from "next/server";
import { loadLodgingForTown } from "@/lib/seed";
import type { LodgingSearchResponse } from "@/lib/types";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const town = url.searchParams.get("town") || "";
  const checkIn = url.searchParams.get("checkIn") || "";
  const nights = Number(url.searchParams.get("nights") || 2);
  const guests = Number(url.searchParams.get("guests") || 2);

  if (!town) {
    return NextResponse.json({ error: "Missing town" }, { status: 400 });
  }
  if (!checkIn) {
    return NextResponse.json({ error: "Missing checkIn" }, { status: 400 });
  }

  const all = await loadLodgingForTown(town);

  // v0: fixtures already contain totals; in later versions we’ll compute totals from checkIn/nights/guests.
  const options = all
    .slice()
    .sort((a, b) => a.price.total - b.price.total)
    .slice(0, 5);

  const res: LodgingSearchResponse = {
    townName: town,
    checkIn,
    nights,
    guests,
    options,
  };

  return NextResponse.json(res);
}
