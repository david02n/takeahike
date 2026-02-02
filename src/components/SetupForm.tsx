"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

function chip(label: string, mins: number, params: { origin: string; startDate: string }) {
  const href = `/options?origin=${encodeURIComponent(params.origin)}&maxDriveMins=${mins}&startDate=${encodeURIComponent(
    params.startDate,
  )}`;
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

export default function SetupForm({ defaultOrigin, defaultStartDate }: { defaultOrigin: string; defaultStartDate: string }) {
  const router = useRouter();
  const [origin, setOrigin] = useState(defaultOrigin);
  const [startDate, setStartDate] = useState(defaultStartDate);

  const originUpper = useMemo(() => origin.trim().toUpperCase(), [origin]);

  function go(maxDriveMins: number) {
    router.push(
      `/options?origin=${encodeURIComponent(originUpper)}&maxDriveMins=${maxDriveMins}&startDate=${encodeURIComponent(
        startDate,
      )}`,
    );
  }

  return (
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
            value={origin}
            onChange={(e) => setOrigin(e.target.value)}
            inputMode="text"
            autoCapitalize="characters"
            spellCheck={false}
            style={{
              width: "100%",
              padding: "10px 12px",
              border: "1px solid #ddd",
              borderRadius: 10,
            }}
          />
          <div style={{ fontSize: 12, color: "#666", marginTop: 6 }}>Week‑1 prototype: UK postcodes (roughly).</div>
        </div>

        <div>
          <label htmlFor="startDate" style={{ display: "block", fontSize: 12, color: "#555" }}>
            Trip start date
          </label>
          <input
            id="startDate"
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            style={{
              width: "100%",
              padding: "10px 12px",
              border: "1px solid #ddd",
              borderRadius: 10,
            }}
          />
          <div style={{ fontSize: 12, color: "#666", marginTop: 6 }}>We’ll use this for Sunday return + weather later.</div>
        </div>

        <div>
          <div style={{ fontSize: 12, color: "#555", marginBottom: 8 }}>Max drive time</div>
          <div>
            {[chip("2h", 120, { origin: originUpper, startDate }), chip("2.5h", 150, { origin: originUpper, startDate }), chip("3h", 180, { origin: originUpper, startDate })]}
          </div>
          <div style={{ marginTop: 10, display: "flex", gap: 8, flexWrap: "wrap" }}>
            <button
              type="button"
              onClick={() => go(120)}
              style={{ padding: "10px 12px", borderRadius: 10, border: "1px solid #ddd", background: "#111", color: "#fff" }}
            >
              Show options (2h) →
            </button>
            <button
              type="button"
              onClick={() => go(150)}
              style={{ padding: "10px 12px", borderRadius: 10, border: "1px solid #ddd", background: "transparent" }}
            >
              2.5h
            </button>
            <button
              type="button"
              onClick={() => go(180)}
              style={{ padding: "10px 12px", borderRadius: 10, border: "1px solid #ddd", background: "transparent" }}
            >
              3h
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
