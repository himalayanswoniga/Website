const DEFAULT_ITEMS = [
  'Sun-Dried & Machine-Dried', '100% Natural', 'Himalayan Sourced', 'No Preservatives',
  'Stone Ground', 'Farmer Direct', 'Est. 2026 · Kathmandu',
];

export default function Marquee({ items = DEFAULT_ITEMS }) {
  const loop = [...items, ...items];
  return (
    <div className="marquee-strip">
      <div className="marquee-inner">
        {loop.map((item, i) => (
          <span className="marquee-item" key={i}>
            <span className="marquee-dot" />{item}
          </span>
        ))}
      </div>
    </div>
  );
}
