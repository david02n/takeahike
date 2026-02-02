import { formatISODate } from "@/lib/date";
import SetupForm from "@/components/SetupForm";

export default function Home() {
  const defaultOrigin = "PO1";
  const defaultStartDate = formatISODate(new Date());

  return (
    <main style={{ maxWidth: 760, margin: "40px auto", padding: "0 16px" }}>
      <h1 style={{ fontSize: 28, marginBottom: 8 }}>Take a Hike</h1>
      <p style={{ marginTop: 0, color: "#444" }}>Plan a weekend hike with a weather backup.</p>

      <SetupForm defaultOrigin={defaultOrigin} defaultStartDate={defaultStartDate} />

      <section style={{ marginTop: 16, fontSize: 12, color: "#666" }}>
        Week‑1 prototype: options are curated; we’ll replace drive times + PT returns with live results next.
      </section>
    </main>
  );
}
