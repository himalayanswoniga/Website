export default function StatCard({ label, value, icon }) {
  return (
    <div className="flex items-center gap-4 bg-white p-5 shadow-sm">
      <span className="text-2xl">{icon}</span>
      <div>
        <p className="font-serif text-2xl text-forest">{value}</p>
        <p className="text-xs font-semibold uppercase tracking-widest text-text-muted">{label}</p>
      </div>
    </div>
  );
}
