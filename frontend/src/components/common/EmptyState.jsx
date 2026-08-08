export default function EmptyState({ title = 'Nothing here yet', message = '', icon = '📭' }) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 py-16 text-center">
      <span className="text-3xl opacity-60">{icon}</span>
      <p className="font-serif text-xl text-forest">{title}</p>
      {message && <p className="max-w-sm text-sm text-text-muted">{message}</p>}
    </div>
  );
}
