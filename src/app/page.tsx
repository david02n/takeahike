import Link from "next/link";

function chip(label: string, mins: number, origin: string) {
  const href = `/options?origin=${encodeURIComponent(origin)}&maxDriveMins=${mins}`;
  return (
    <Link
      key={mins}
      href={href}
      style={{
        display: "inline-block",
        padding: "8px 12px",
        border: "1px solid #ddd",
        borderRadius: 999,
        marginRight: 8,
        textDecoration: "none",
      }}
    >
      {label}
    </Link>
  );
}

export default function Home() {
  const defaultOrigin = "PO1";
  return (
    <main style={{ maxWidth: 760, margin: "40px auto", padding: "0 16px" }}>
      <h1 style={{ fontSize: 28, marginBottom: 8 }}>Take a Hike</h1>
      <p style={{ marginTop: 0, color: "#444" }}>
        Plan a weekend hike with a weather backup.
      </p>

      <section
        style={{
          marginTop: 24,
          border: "1px solid #eee",
          borderRadius: 12,
          padding: 16,
        }}
      >
        <h2 style={{ fontSize: 16, marginTop: 0 }}>Setup</h2>

        <div style={{ display: "grid", gap: 12 }}>
          <div>
            <label htmlFor="origin" style={{ display: "block", fontSize: 12, color: "#555" }}>
              Origin postcode
            </label>
            <input
              id="origin"
              defaultValue={defaultOrigin}
              readOnly
              style={{
                width: "100%",
                padding: "10px 12px",
                border: "1px solid #ddd",
                borderRadius: 10,
              }}
            />
            <div style={{ fontSize: 12, color: "#666", marginTop: 6 }}>
              Week‑1 prototype: fixed to PO1 (Portsmouth).
            </div>
          </div>

          <div>
            <div style={{ fontSize: 12, color: "#555", marginBottom: 8 }}>Max drive time</div>
            <div>{[chip("2h", 120, defaultOrigin), chip("2.5h", 150, defaultOrigin), chip("3h", 180, defaultOrigin)]}</div>
          </div>

          <div style={{ fontSize: 12, color: "#555" }}>Trip</div>
          <div style={{ marginTop: -8 }}>Sat–Sun (1 night)</div>
        </div>
      </section>

      <section style={{ marginTop: 16 }}>
        <Link href={`/options?origin=${encodeURIComponent(defaultOrigin)}&maxDriveMins=120`}>
          Show weekend options →
        </Link>
      </section>
    </main>
  );
}
