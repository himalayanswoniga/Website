import Loader from '../common/Loader';
import ErrorState from '../common/ErrorState';
import EmptyState from '../common/EmptyState';
import Pagination from '../common/Pagination';

/**
 * Generic admin list table: columns = [{ key, label, render? }], rows = array of records.
 * Handles the loading/error/empty states every admin list needs.
 */
export default function DataTable({ columns, rows, loading, error, onRetry, meta, onPageChange, emptyMessage = 'No records yet.' }) {
  if (loading) return <Loader label="Loading…" />;
  if (error) return <ErrorState message={error} onRetry={onRetry} />;
  if (!rows.length) return <EmptyState icon="📄" title="Nothing here yet" message={emptyMessage} />;

  return (
    <div>
      <div className="overflow-x-auto bg-white shadow-sm">
        <table className="w-full min-w-[600px] text-left text-sm">
          <thead>
            <tr className="border-b border-forest/10 text-xs font-semibold uppercase tracking-wider text-text-muted">
              {columns.map((col) => (
                <th key={col.key} className="px-4 py-3">{col.label}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row._id} className="border-b border-forest/5 last:border-0 hover:bg-cream-2/50">
                {columns.map((col) => (
                  <td key={col.key} className="px-4 py-3 align-middle">
                    {col.render ? col.render(row) : row[col.key]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {meta && onPageChange && <Pagination meta={meta} onPageChange={onPageChange} />}
    </div>
  );
}
