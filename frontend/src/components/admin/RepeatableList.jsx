/**
 * Editable list of small objects (e.g. process steps, value cards) — used
 * across the Homepage settings form wherever the content model is an array.
 */
export default function RepeatableList({ items, fields, onChange, addLabel = '+ Add Item' }) {
  function updateItem(index, key, value) {
    const next = [...items];
    next[index] = { ...next[index], [key]: value };
    onChange(next);
  }

  function removeItem(index) {
    onChange(items.filter((_, i) => i !== index));
  }

  function addItem() {
    const blank = Object.fromEntries(fields.map((f) => [f.key, '']));
    onChange([...items, blank]);
  }

  return (
    <div className="flex flex-col gap-3">
      {items.map((item, index) => (
        <div key={index} className="flex items-start gap-2 border border-forest/10 p-3">
          <div className="grid flex-1 gap-2" style={{ gridTemplateColumns: `repeat(${fields.length}, 1fr)` }}>
            {fields.map((f) => (
              <input
                key={f.key}
                placeholder={f.label}
                value={item[f.key] || ''}
                onChange={(e) => updateItem(index, f.key, e.target.value)}
                className="input"
              />
            ))}
          </div>
          <button type="button" onClick={() => removeItem(index)} className="px-2 py-2 text-xs font-semibold text-red-600 hover:text-red-800">✕</button>
        </div>
      ))}
      <button type="button" onClick={addItem} className="self-start text-xs font-semibold uppercase tracking-widest text-gold hover:text-forest">
        {addLabel}
      </button>
    </div>
  );
}
