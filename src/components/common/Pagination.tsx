export default function Pagination({ page, pages, onChange }) {
  return (
    <nav className="pagination no-print" aria-label="Pagination">
      <span>Pagination:</span>
      <button type="button" onClick={() => onChange(page - 1)} disabled={page <= 1} aria-label="Previous page">‹</button>
      {Array.from({ length: pages }, (_, i) => i + 1).map((n) => (
        <button key={n} type="button" onClick={() => onChange(n)} aria-current={n === page ? "page" : undefined}>{n}</button>
      ))}
      <button type="button" onClick={() => onChange(page + 1)} disabled={page >= pages} aria-label="Next page">›</button>
    </nav>
  );
}
