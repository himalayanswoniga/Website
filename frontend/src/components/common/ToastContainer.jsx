import { useToastList } from '../../context/ToastContext';

const STYLES = {
  success: 'bg-forest text-cream border-gold',
  error: 'bg-charcoal text-cream border-red-400',
  info: 'bg-cream text-forest border-forest/20',
};

export default function ToastContainer() {
  const { toasts, dismiss } = useToastList();

  return (
    <div className="fixed bottom-6 right-6 z-[1100] flex w-80 flex-col gap-2">
      {toasts.map((t) => (
        <div
          key={t.id}
          role="alert"
          className={`flex items-start justify-between gap-3 border-l-4 px-4 py-3 text-sm shadow-lg ${STYLES[t.type] || STYLES.info}`}
        >
          <span>{t.message}</span>
          <button type="button" onClick={() => dismiss(t.id)} aria-label="Dismiss" className="shrink-0 opacity-70 hover:opacity-100">
            ✕
          </button>
        </div>
      ))}
    </div>
  );
}
