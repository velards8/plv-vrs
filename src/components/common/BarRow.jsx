// type: "minor" | "major"
export default function BarRow({ label, value, max, type }) {
  const pct = max ? Math.round((value / max) * 100) : 0;
  return (
    <div className="bar-row">
      <span>{label}</span>
      <div className="bar-track" role="img" aria-label={`${label}: ${value}`}>
        <div className={`bar-fill ${type}`} style={{ width: `${pct}%` }} />
      </div>
      <strong>{value}</strong>
    </div>
  );
}
