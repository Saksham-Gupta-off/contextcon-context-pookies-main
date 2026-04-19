type Slice = { label: string; share: number };

const PALETTE = ["#c56432", "#8a3d18", "#2f6b3a", "#b08400", "#5d5547", "#7c5b3a", "#3a5e7e"];

export default function DiversificationDonut({
  title,
  slices,
}: {
  title: string;
  slices: Slice[];
}) {
  const filtered = slices.filter((s) => s.share > 0);
  const total = filtered.reduce((sum, s) => sum + s.share, 0) || 1;
  const radius = 60;
  const circ = 2 * Math.PI * radius;

  const cumulative: number[] = [];
  filtered.reduce((sum, slice, idx) => {
    cumulative[idx] = sum;
    return sum + slice.share;
  }, 0);

  return (
    <div style={{ display: "grid", gap: "0.5rem" }}>
      <div className="eyebrow">{title}</div>
      <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
        <svg viewBox="0 0 160 160" width={140} height={140}>
          <circle cx={80} cy={80} r={radius} fill="transparent" stroke="var(--subtle)" strokeWidth={18} />
          {filtered.length === 0 && (
            <text x={80} y={86} textAnchor="middle" fontSize={11} fill="var(--muted-foreground)">
              no data
            </text>
          )}
          {filtered.map((slice, idx) => {
            const fraction = slice.share / total;
            const dash = circ * fraction;
            const offset = -circ * (cumulative[idx] / total);
            return (
              <circle
                key={slice.label}
                cx={80}
                cy={80}
                r={radius}
                fill="transparent"
                stroke={PALETTE[idx % PALETTE.length]}
                strokeWidth={18}
                strokeDasharray={`${dash} ${circ}`}
                strokeDashoffset={offset}
                transform="rotate(-90 80 80)"
              />
            );
          })}
        </svg>
        <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "grid", gap: "0.3rem", fontSize: "0.85rem" }}>
          {filtered.length === 0 ? (
            <li style={{ color: "var(--muted-foreground)" }}>No invest cheques.</li>
          ) : (
            filtered.map((s, idx) => (
              <li key={s.label} style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
                <span
                  style={{
                    width: 10,
                    height: 10,
                    background: PALETTE[idx % PALETTE.length],
                    borderRadius: 2,
                  }}
                />
                <span>{s.label}</span>
                <span style={{ marginLeft: "auto", color: "var(--muted-foreground)", fontFamily: "JetBrains Mono, monospace" }}>
                  {Math.round((s.share / total) * 100)}%
                </span>
              </li>
            ))
          )}
        </ul>
      </div>
    </div>
  );
}
