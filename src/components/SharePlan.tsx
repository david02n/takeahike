"use client";

import { useState } from "react";
import type { WeekendOption } from "@/lib/types";

export function SharePlanButton({
  option,
  originLabel,
  maxDriveMins,
  initialPlan,
}: {
  option: WeekendOption;
  originLabel: string;
  maxDriveMins: number;
  initialPlan: "A" | "B";
}) {
  const [slug, setSlug] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const shareUrl = slug ? `${window.location.origin}/plan/${slug}?plan=${initialPlan}` : null;

  async function create() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/plan", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ option, originLabel, maxDriveMins }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Failed to create plan");
      setSlug(data.slug);
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : String(e);
      setError(msg);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ marginTop: 12 }}>
      <button
        onClick={create}
        disabled={loading || !!slug}
        style={{
          padding: "10px 12px",
          borderRadius: 10,
          border: "1px solid #ddd",
          background: "#111",
          color: "#fff",
          cursor: loading || slug ? "default" : "pointer",
        }}
      >
        {slug ? "Share link created" : loading ? "Creating share link…" : "Create shareable plan link"}
      </button>

      {error ? <div style={{ marginTop: 8, color: "#b00020", fontSize: 12 }}>{error}</div> : null}

      {shareUrl ? (
        <div style={{ marginTop: 10 }}>
          <div style={{ fontSize: 12, color: "#666" }}>Share</div>
          <input
            readOnly
            value={shareUrl}
            style={{ width: "100%", padding: "10px 12px", border: "1px solid #ddd", borderRadius: 10 }}
            onFocus={(e) => e.currentTarget.select()}
          />
          <div style={{ fontSize: 12, color: "#666", marginTop: 6 }}>Copy this link to share.</div>
        </div>
      ) : null}
    </div>
  );
}
