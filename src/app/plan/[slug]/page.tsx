import Link from "next/link";
import type { PlanVariant, RouteReference, WeekendOption } from "@/lib/types";
import { headers } from "next/headers";

type PlanSnapshot = {
  option: WeekendOption;
  originLabel: string;
  maxDriveMins: number;
};

function getPlanVariant(searchParams: Record<string, string | string[] | undefined>): PlanVariant {
  const raw = searchParams.plan;
  const v = (Array.isArray(raw) ? raw[0] : raw) ?? "A";
  return v === "B" ? "B" : "A";
}

function routeSourceLabel(sourceType: string) {
  switch (sourceType) {
    case "OS":
      return "Ordnance Survey";
    case "ALLTRAILS":
      return "AllTrails";
    case "KOMOOT":
      return "Komoot";
    case "NATIONAL_PARK":
      return "National Park";
    case "NATIONAL_TRAILS":
      return "National Trails";
    case "NATIONAL_TRUST":
      return "National Trust";
    case "FORESTRY_ENGLAND":
      return "Forestry England";
    case "JURASSIC_COAST":
      return "Jurassic Coast";
    case "COMMUNITY":
      return "Community";
    case "BLOG":
      return "Blog";
    default:
      return "Other";
  }
}

export default async function PlanSlugPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Record<string, string | string[] | undefined>;
}) {
  const { slug } = await params;
  const plan = getPlanVariant(searchParams);

  const h = await headers();
  const proto = h.get("x-forwarded-proto") ?? "https";
  const host = h.get("x-forwarded-host") ?? h.get("host") ?? "localhost:3000";

  const planUrl = `${proto}://${host}/api/plan/${encodeURIComponent(slug)}`;
  const payload = (await (await fetch(planUrl, { cache: "no-store" })).json()) as PlanSnapshot;

  // Payload shape is our stored snapshot. In MVP we store the whole option.
  const opt = payload.option;
  const origin = payload.originLabel ?? "PO1";
  const maxDriveMins = payload.maxDriveMins ?? 120;

  const hike = plan === "A" ? opt.satHike.planA : opt.satHike.planB;

  return (
    <main style={{ maxWidth: 760, margin: "40px auto", padding: "0 16px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", gap: 12, alignItems: "baseline" }}>
        <div>
          <h1 style={{ fontSize: 22, marginBottom: 6 }}>Weekend plan: {opt.baseTown.name}</h1>
          <div style={{ fontSize: 12, color: "#666" }}>
            From {origin} • {opt.drive.bandLabel} • Sat–Sun (1 night)
          </div>
        </div>
        <Link href={`/options?origin=${encodeURIComponent(origin)}&maxDriveMins=${maxDriveMins}&plan=${plan}`}>Back</Link>
      </div>

      <section style={{ marginTop: 16, padding: 12, border: "1px solid #eee", borderRadius: 12 }}>
        <div style={{ fontSize: 12, color: "#666" }}>Weather plan</div>
        <div style={{ marginTop: 8, display: "flex", gap: 8, flexWrap: "wrap" }}>
          <Link
            href={`/plan/${encodeURIComponent(slug)}?plan=A`}
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
            href={`/plan/${encodeURIComponent(slug)}?plan=B`}
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

      <section style={{ marginTop: 16, border: "1px solid #eee", borderRadius: 12, padding: 16 }}>
        <h2 style={{ fontSize: 16, marginTop: 0 }}>Saturday route</h2>
        <div style={{ fontSize: 15, fontWeight: 600 }}>{hike.title}</div>
        <div style={{ marginTop: 6, fontSize: 13, color: "#444" }}>
          {hike.durationHours.toFixed(1)}h • ~{hike.distanceKm}km • {hike.difficulty.replace("_", "+")}
        </div>

        <h3 style={{ fontSize: 14, marginTop: 16 }}>Route references</h3>
        <div style={{ fontSize: 12, color: "#666", marginBottom: 8 }}>
          Use these links for navigation and the latest trail notes.
        </div>
        <ul>
          {hike.routeReferences.map((r: RouteReference, idx: number) => (
            <li key={idx} style={{ marginBottom: 8 }}>
              <a href={r.url} target="_blank" rel="noreferrer">
                {r.title}
              </a>{" "}
              <span style={{ fontSize: 12, color: "#666" }}>
                ({routeSourceLabel(r.sourceType)}){r.note ? ` — ${r.note}` : ""}
              </span>
            </li>
          ))}
        </ul>
        <div style={{ fontSize: 12, color: "#666", marginTop: 8 }}>
          Routes and conditions can change—always check local guidance. Community links may be unverified.
        </div>
      </section>

      <section style={{ marginTop: 16, border: "1px solid #eee", borderRadius: 12, padding: 16 }}>
        <h2 style={{ fontSize: 16, marginTop: 0 }}>Sunday return-to-car (no taxis)</h2>
        <div style={{ fontSize: 13, color: "#444" }}>{opt.transportReturn.summary}</div>
        <ol style={{ marginTop: 10 }}>
          {opt.transportReturn.steps.map((s: string, idx: number) => (
            <li key={idx} style={{ marginBottom: 6 }}>
              {s}
            </li>
          ))}
        </ol>
        <div style={{ fontSize: 12, color: "#666", marginTop: 8 }}>
          Check the latest timetables with the operator before you set off.
        </div>
      </section>

      <section style={{ marginTop: 16, border: "1px solid #eee", borderRadius: 12, padding: 16 }}>
        <h2 style={{ fontSize: 16, marginTop: 0 }}>Where to stay</h2>
        <div style={{ fontSize: 12, color: "#666", marginBottom: 10 }}>
          You’ll search and book on Google/partner sites. Prices and availability are shown there.
        </div>
        <ul>
          {opt.stayLinks.map((l, idx: number) => (
            <li key={idx} style={{ marginBottom: 10 }}>
              <a href={l.googleHotelUrl} target="_blank" rel="noreferrer">
                Search hotels on Google ({l.townName})
              </a>{" "}
              <span style={{ fontSize: 12, color: "#666" }}>— opens in a new tab</span>
            </li>
          ))}
        </ul>
      </section>

      <section style={{ marginTop: 16 }}>
        <div style={{ fontSize: 12, color: "#666" }}>Share</div>
        <input
          readOnly
          value={`${proto}://${host}/plan/${encodeURIComponent(slug)}?plan=${plan}`}
          style={{ width: "100%", padding: "10px 12px", border: "1px solid #ddd", borderRadius: 10 }}
        />
        <div style={{ fontSize: 12, color: "#666", marginTop: 6 }}>Copy this link to share.</div>
      </section>
    </main>
  );
}
