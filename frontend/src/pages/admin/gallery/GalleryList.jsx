import { useState } from 'react';
import Seo from '../../../components/common/Seo';
import Loader from '../../../components/common/Loader';
import ErrorState from '../../../components/common/ErrorState';
import EmptyState from '../../../components/common/EmptyState';
import Pagination from '../../../components/common/Pagination';
import ConfirmDialog from '../../../components/common/ConfirmDialog';
import ImageUploader from '../../../components/admin/ImageUploader';
import { usePaginatedFetch } from '../../../hooks/usePaginatedFetch';
import { galleryService } from '../../../services/galleryService';
import { useToast } from '../../../context/ToastContext';

const EMPTY = { title: '', category: 'General' };

export default function GalleryList() {
  const [page, setPage] = useState(1);
  const [form, setForm] = useState(EMPTY);
  const [image, setImage] = useState(null);
  const [currentImageUrl, setCurrentImageUrl] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [pendingDelete, setPendingDelete] = useState(null);
  const toast = useToast();
  const { items, meta, loading, error, reload } = usePaginatedFetch(galleryService.list, { page, limit: 12 }, [page]);

  function startEdit(item) {
    setEditingId(item._id);
    setForm({ title: item.title || '', category: item.category || 'General' });
    setCurrentImageUrl(item.image.url);
    setImage(null);
  }

  function cancelEdit() {
    setEditingId(null);
    setForm(EMPTY);
    setImage(null);
    setCurrentImageUrl('');
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!editingId && !image) return toast.error('Please choose an image');
    setSaving(true);
    try {
      if (editingId) {
        await galleryService.update(editingId, form, image);
        toast.success('Photo updated');
      } else {
        await galleryService.create(form, image);
        toast.success('Photo added to gallery');
      }
      cancelEdit();
      reload();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save photo');
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    try {
      await galleryService.remove(pendingDelete._id);
      toast.success('Photo deleted');
      setPendingDelete(null);
      reload();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete photo');
    }
  }

  return (
    <div>
      <Seo title="Manage Gallery" />
      <h1 className="mb-6 font-serif text-2xl text-forest">Gallery</h1>

      <form onSubmit={handleSubmit} className="mb-8 flex flex-col gap-3 bg-white p-5 shadow-sm sm:max-w-xl">
        <div className="grid gap-3 sm:grid-cols-2">
          <input placeholder="Title (optional)" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="input" />
          <input placeholder="Category (e.g. Harvest, Packaging)" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="input" />
        </div>
        <ImageUploader currentUrl={currentImageUrl} onChange={setImage} />
        <div className="flex gap-2">
          <button type="submit" disabled={saving} className="self-start bg-forest px-6 py-2.5 text-xs font-semibold uppercase tracking-widest text-cream hover:bg-forest-mid disabled:opacity-60">
            {saving ? 'Saving…' : editingId ? 'Update Photo' : 'Add Photo'}
          </button>
          {editingId && <button type="button" onClick={cancelEdit} className="px-4 text-xs font-semibold uppercase tracking-widest text-text-muted">Cancel</button>}
        </div>
      </form>

      {loading && <Loader />}
      {!loading && error && <ErrorState message={error} onRetry={reload} />}
      {!loading && !error && items.length === 0 && <EmptyState icon="🖼️" title="No photos yet" message="Add one above." />}
      {!loading && !error && items.length > 0 && (
        <>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {items.map((item) => (
              <div key={item._id} className="group relative aspect-square overflow-hidden bg-white shadow-sm">
                <img src={item.image.url} alt={item.title} className="h-full w-full object-cover" />
                <div className="absolute inset-0 flex items-end gap-2 bg-charcoal/0 p-2 opacity-0 transition group-hover:bg-charcoal/40 group-hover:opacity-100">
                  <button
                    type="button"
                    onClick={() => startEdit(item)}
                    className="bg-white px-3 py-1 text-xs font-semibold uppercase tracking-widest text-forest"
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => setPendingDelete(item)}
                    className="bg-white px-3 py-1 text-xs font-semibold uppercase tracking-widest text-red-600"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
          <Pagination meta={meta} onPageChange={setPage} />
        </>
      )}

      <ConfirmDialog
        open={!!pendingDelete}
        title="Delete photo?"
        onConfirm={handleDelete}
        onCancel={() => setPendingDelete(null)}
      />
    </div>
  );
}
