import Link from "next/link";
import type { PlanVariant, WeekendOptionsResponse, WeekendOption } from "@/lib/types";
import { headers } from "next/headers";

function getActivePlan(searchParams: Record<string, string | string[] | undefined>): PlanVariant {
  const raw = searchParams.plan;
  const v = (Array.isArray(raw) ? raw[0] : raw) ?? "A";
  return v === "B" ? "B" : "A";
}

function optionCard(opt: WeekendOption, origin: string, maxDriveMins: number, plan: PlanVariant) {
  const hike = plan === "A" ? opt.satHike.planA : opt.satHike.planB;
  const planHref = `/option/${encodeURIComponent(opt.id)}?origin=${encodeURIComponent(origin)}&maxDriveMins=${maxDriveMins}&plan=${plan}`;

  return (
    <div
      key={opt.id}
      style={{
        border: "1px solid #eee",
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
        <div>
          <div style={{ fontSize: 12, color: "#666" }}>{opt.area.name}</div>
          <div style={{ fontSize: 18, fontWeight: 600 }}>{opt.baseTown.name}</div>
        </div>
        <div style={{ textAlign: "right", fontSize: 12, color: "#444" }}>
          <div>{opt.drive.bandLabel} from {origin}</div>
          <div style={{ color: "#666" }}>≤ {maxDriveMins} mins</div>
        </div>
      </div>

      <div style={{ marginTop: 10, fontSize: 14 }}>
        <strong>Saturday ({plan === "A" ? "Plan A" : "Plan B"}):</strong> {hike.title}
      </div>
      <div style={{ marginTop: 6, fontSize: 13, color: "#444" }}>
        {hike.durationHours.toFixed(1)}h • ~{hike.distanceKm}km • {hike.difficulty.replace("_", "+")} • Mostly rural
      </div>

      <div style={{ marginTop: 10, fontSize: 12, color: "#555" }}>
        <strong>Sunday return:</strong> {opt.transportReturn.summary}
      </div>
      <div style={{ marginTop: 10 }}>
        <Link href={planHref}>View plan →</Link>
      </div>
    </div>
  );
}

export default async function OptionsPage({
  searchParams,
}: {
  searchParams: Record<string, string | string[] | undefined>;
}) {
  const origin = (Array.isArray(searchParams.origin) ? searchParams.origin[0] : searchParams.origin) ?? "PO1";
  const maxDriveMins = Number((Array.isArray(searchParams.maxDriveMins) ? searchParams.maxDriveMins[0] : searchParams.maxDriveMins) ?? 120);
  const plan = getActivePlan(searchParams);

  // Build an absolute URL for server-side fetches (works on Vercel + local).
  const h = await headers();
  const proto = h.get("x-forwarded-proto") ?? "http";
  const host = h.get("x-forwarded-host") ?? h.get("host") ?? "localhost:3000";
  const apiUrl = `${proto}://${host}/api/weekend-options?origin=${encodeURIComponent(origin)}&maxDriveMins=${maxDriveMins}`;

  const res = await fetch(apiUrl, { cache: "no-store" });
  const data = (await res.json()) as WeekendOptionsResponse;

  return (
    <main style={{ maxWidth: 760, margin: "40px auto", padding: "0 16px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", gap: 12, alignItems: "baseline" }}>
        <div>
          <h1 style={{ fontSize: 22, marginBottom: 6 }}>Weekend options</h1>
          <div style={{ fontSize: 12, color: "#666" }}>
            From {origin} • ≤ {maxDriveMins} mins • Sat–Sun (1 night)
          </div>
        </div>
        <Link href="/">Edit setup</Link>
      </div>

      <section style={{ marginTop: 16, padding: 12, border: "1px solid #eee", borderRadius: 12 }}>
        <div style={{ fontSize: 12, color: "#666" }}>Weather plan</div>
        <div style={{ marginTop: 8, display: "flex", gap: 8, flexWrap: "wrap" }}>
          <Link
            href={`/options?origin=${encodeURIComponent(origin)}&maxDriveMins=${maxDriveMins}&plan=A`}
            style={{
              padding: "8px 12px",
              border: "1px solid #ddd",
              borderRadius: 10,
              textDecoration: "none",
              background: plan === "A" ? "#111" : "transparent",
              color: plan === "A" ? "#fff" : "#111",
            }}
          >
            Plan A (good weather)
          </Link>
          <Link
            href={`/options?origin=${encodeURIComponent(origin)}&maxDriveMins=${maxDriveMins}&plan=B`}
            style={{
              padding: "8px 12px",
              border: "1px solid #ddd",
              borderRadius: 10,
              textDecoration: "none",
              background: plan === "B" ? "#111" : "transparent",
              color: plan === "B" ? "#fff" : "#111",
            }}
          >
            Plan B (poor weather)
          </Link>
          <div style={{ flexBasis: "100%", fontSize: 12, color: "#666", marginTop: 6 }}>
            Same base + transport plan. Saturday route changes based on weather.
          </div>
        </div>
      </section>

      <section style={{ marginTop: 16 }}>
        {data.noResults ? (
          <div style={{ padding: 16, border: "1px solid #f1c40f", borderRadius: 12 }}>
            <strong>No matches.</strong>
            <div style={{ marginTop: 8 }}>
              Nothing fits within {maxDriveMins} mins from {origin} with public-transport return. Try 150–180 mins.
            </div>
          </div>
        ) : (
          data.options.map((o) => optionCard(o, origin, maxDriveMins, plan))
        )}
      </section>

      <section style={{ marginTop: 16, fontSize: 12, color: "#666" }}>
        Constraints (Week‑1): Sat–Sun (1 night), 1 car, PT return (no taxis), target ~20km / 6h+.
      </section>
    </main>
  );
}
