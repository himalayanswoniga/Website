export default function Loader({ label = 'Loading…', className = '' }) {
  return (
    <div className={`flex flex-col items-center justify-center gap-3 py-16 text-forest ${className}`} role="status" aria-live="polite">
      <span className="h-8 w-8 animate-spin rounded-full border-2 border-gold border-t-transparent" />
      <span className="text-xs font-semibold uppercase tracking-widest text-text-muted">{label}</span>
    </div>
  );
}
