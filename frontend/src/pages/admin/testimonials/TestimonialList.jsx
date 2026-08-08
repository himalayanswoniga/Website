import { useState } from 'react';
import Seo from '../../../components/common/Seo';
import DataTable from '../../../components/admin/DataTable';
import ConfirmDialog from '../../../components/common/ConfirmDialog';
import ImageUploader from '../../../components/admin/ImageUploader';
import { usePaginatedFetch } from '../../../hooks/usePaginatedFetch';
import { testimonialService } from '../../../services/testimonialService';
import { useToast } from '../../../context/ToastContext';

const EMPTY = { name: '', location: '', quote: '', rating: 5, featured: false };

export default function TestimonialList() {
  const [page, setPage] = useState(1);
  const [form, setForm] = useState(EMPTY);
  const [avatar, setAvatar] = useState(null);
  const [currentAvatarUrl, setCurrentAvatarUrl] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [pendingDelete, setPendingDelete] = useState(null);
  const toast = useToast();
  const { items, meta, loading, error, reload } = usePaginatedFetch(testimonialService.list, { page, limit: 10 }, [page]);

  function startEdit(t) {
    setEditingId(t._id);
    setForm({ name: t.name, location: t.location || '', quote: t.quote, rating: t.rating, featured: t.featured });
    setCurrentAvatarUrl(t.avatar?.url || '');
    setAvatar(null);
  }

  function cancelEdit() {
    setEditingId(null);
    setForm(EMPTY);
    setAvatar(null);
    setCurrentAvatarUrl('');
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    try {
      if (editingId) {
        await testimonialService.update(editingId, form, avatar);
        toast.success('Testimonial updated');
      } else {
        await testimonialService.create(form, avatar);
        toast.success('Testimonial added');
      }
      cancelEdit();
      reload();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save testimonial');
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    try {
      await testimonialService.remove(pendingDelete._id);
      toast.success('Testimonial deleted');
      setPendingDelete(null);
      reload();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete testimonial');
    }
  }

  return (
    <div>
      <Seo title="Manage Testimonials" />
      <h1 className="mb-6 font-serif text-2xl text-forest">Testimonials</h1>

      <form onSubmit={handleSubmit} className="mb-8 flex flex-col gap-3 bg-white p-5 shadow-sm sm:max-w-2xl">
        <div className="grid gap-3 sm:grid-cols-2">
          <input required placeholder="Customer name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="input" />
          <input placeholder="Location" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} className="input" />
        </div>
        <textarea required placeholder="Quote" value={form.quote} onChange={(e) => setForm({ ...form, quote: e.target.value })} className="input" rows={3} />
        <div className="flex items-center gap-6">
          <label className="flex items-center gap-2 text-sm">
            Rating
            <select value={form.rating} onChange={(e) => setForm({ ...form, rating: Number(e.target.value) })} className="input w-auto">
              {[5, 4, 3, 2, 1].map((r) => <option key={r} value={r}>{r} ★</option>)}
            </select>
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={form.featured} onChange={(e) => setForm({ ...form, featured: e.target.checked })} /> Feature on homepage
          </label>
        </div>
        <ImageUploader label="Avatar (optional)" currentUrl={currentAvatarUrl} onChange={setAvatar} />
        <div className="flex gap-2">
          <button type="submit" disabled={saving} className="bg-forest px-6 py-2.5 text-xs font-semibold uppercase tracking-widest text-cream hover:bg-forest-mid">
            {editingId ? 'Update' : 'Add'}
          </button>
          {editingId && <button type="button" onClick={cancelEdit} className="px-4 text-xs font-semibold uppercase tracking-widest text-text-muted">Cancel</button>}
        </div>
      </form>

      <DataTable
        loading={loading}
        error={error}
        onRetry={reload}
        rows={items}
        meta={meta}
        onPageChange={setPage}
        emptyMessage="Add your first testimonial above."
        columns={[
          { key: 'name', label: 'Name', render: (t) => <span className="font-medium text-forest">{t.name}</span> },
          { key: 'quote', label: 'Quote', render: (t) => <span className="line-clamp-2 text-text-muted">{t.quote}</span> },
          { key: 'featured', label: 'Featured', render: (t) => (t.featured ? '⭐' : '') },
          {
            key: 'actions',
            label: '',
            render: (t) => (
              <div className="flex gap-3 text-xs font-semibold uppercase tracking-widest">
                <button type="button" onClick={() => startEdit(t)} className="text-forest hover:text-gold">Edit</button>
                <button type="button" onClick={() => setPendingDelete(t)} className="text-red-600 hover:text-red-800">Delete</button>
              </div>
            ),
          },
        ]}
      />

      <ConfirmDialog open={!!pendingDelete} title="Delete testimonial?" onConfirm={handleDelete} onCancel={() => setPendingDelete(null)} />
    </div>
  );
}
