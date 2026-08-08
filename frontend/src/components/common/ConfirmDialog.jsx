export default function ConfirmDialog({ open, title = 'Are you sure?', message, onConfirm, onCancel, confirmLabel = 'Delete' }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[1200] flex items-center justify-center bg-charcoal/50 px-4" role="dialog" aria-modal="true">
      <div className="w-full max-w-sm bg-white p-6">
        <h3 className="font-serif text-xl text-forest">{title}</h3>
        {message && <p className="mt-2 text-sm text-text-muted">{message}</p>}
        <div className="mt-6 flex justify-end gap-3">
          <button type="button" onClick={onCancel} className="px-4 py-2 text-xs font-semibold uppercase tracking-widest text-forest">
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="bg-charcoal px-4 py-2 text-xs font-semibold uppercase tracking-widest text-cream hover:bg-red-700"
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
