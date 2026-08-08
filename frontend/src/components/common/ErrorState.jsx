export default function ErrorState({ message = 'Something went wrong.', onRetry }) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-16 text-center">
      <p className="text-sm text-text-muted">{message}</p>
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="border border-forest px-5 py-2 text-xs font-semibold uppercase tracking-widest text-forest transition hover:bg-forest hover:text-cream"
        >
          Try Again
        </button>
      )}
    </div>
  );
}
