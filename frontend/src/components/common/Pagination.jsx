export default function Pagination({ meta, onPageChange }) {
  const { page, totalPages } = meta;
  if (totalPages <= 1) return null;

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1).filter(
    (p) => p === 1 || p === totalPages || Math.abs(p - page) <= 1
  );

  return (
    <nav className="mt-10 flex items-center justify-center gap-2" aria-label="Pagination">
      <button
        type="button"
        disabled={page <= 1}
        onClick={() => onPageChange(page - 1)}
        className="px-3 py-1.5 text-xs font-semibold uppercase tracking-widest text-forest disabled:opacity-30"
      >
        Prev
      </button>
      {pages.map((p, i) => (
        <span key={p} className="flex items-center gap-2">
          {i > 0 && pages[i - 1] !== p - 1 && <span className="text-text-muted">…</span>}
          <button
            type="button"
            onClick={() => onPageChange(p)}
            aria-current={p === page ? 'page' : undefined}
            className={`h-8 w-8 text-xs font-semibold ${p === page ? 'bg-forest text-cream' : 'text-forest hover:bg-cream-2'}`}
          >
            {p}
          </button>
        </span>
      ))}
      <button
        type="button"
        disabled={page >= totalPages}
        onClick={() => onPageChange(page + 1)}
        className="px-3 py-1.5 text-xs font-semibold uppercase tracking-widest text-forest disabled:opacity-30"
      >
        Next
      </button>
    </nav>
  );
}
