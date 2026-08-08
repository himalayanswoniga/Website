import { useRef, useState, useEffect } from 'react';

/** File picker with preview, used by every admin form that uploads an image to Cloudinary via the backend. */
export default function ImageUploader({ label, currentUrl, onChange, multiple = false }) {
  const inputRef = useRef(null);
  const [previews, setPreviews] = useState(currentUrl ? [currentUrl] : []);
  const [userSelected, setUserSelected] = useState(false);

  // currentUrl often arrives after an async fetch (e.g. editing an existing
  // record), well after this component's initial mount — sync to it unless
  // the admin has already picked a replacement file in this session.
  useEffect(() => {
    if (!userSelected) setPreviews(currentUrl ? [currentUrl] : []);
  }, [currentUrl, userSelected]);

  function handleChange(e) {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    setUserSelected(true);
    setPreviews(files.map((f) => URL.createObjectURL(f)));
    onChange(multiple ? files : files[0]);
  }

  return (
    <div>
      {label && <label className="mb-1.5 block text-xs font-semibold uppercase tracking-widest text-text-muted">{label}</label>}
      <div className="flex flex-wrap items-center gap-3">
        {previews.map((src, i) => (
          <img key={i} src={src} alt="" className="h-20 w-20 object-cover" />
        ))}
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="border border-dashed border-forest/30 px-4 py-2 text-xs font-semibold uppercase tracking-widest text-forest hover:bg-cream-2"
        >
          {previews.length ? 'Change' : 'Upload'} Image{multiple ? 's' : ''}
        </button>
        <input ref={inputRef} type="file" accept="image/*" multiple={multiple} onChange={handleChange} className="hidden" />
      </div>
    </div>
  );
}
