import { useState } from 'react';
import Seo from '../../../components/common/Seo';
import DataTable from '../../../components/admin/DataTable';
import ConfirmDialog from '../../../components/common/ConfirmDialog';
import { usePaginatedFetch } from '../../../hooks/usePaginatedFetch';
import { categoryService } from '../../../services/categoryService';
import { useToast } from '../../../context/ToastContext';

const EMPTY = { name: '', description: '' };

export default function CategoryList() {
  const [page, setPage] = useState(1);
  const [form, setForm] = useState(EMPTY);
  const [editingId, setEditingId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [pendingDelete, setPendingDelete] = useState(null);
  const toast = useToast();
  const { items, meta, loading, error, reload } = usePaginatedFetch(categoryService.list, { page, limit: 10 }, [page]);

  function startEdit(cat) {
    setEditingId(cat._id);
    setForm({ name: cat.name, description: cat.description || '' });
  }

  function cancelEdit() {
    setEditingId(null);
    setForm(EMPTY);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    try {
      if (editingId) {
        await categoryService.update(editingId, form);
        toast.success('Category updated');
      } else {
        await categoryService.create(form);
        toast.success('Category created');
      }
      cancelEdit();
      reload();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save category');
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    try {
      await categoryService.remove(pendingDelete._id);
      toast.success('Category deleted');
      setPendingDelete(null);
      reload();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete category');
    }
  }

  return (
    <div>
      <Seo title="Manage Categories" />
      <h1 className="mb-6 font-serif text-2xl text-forest">Categories</h1>

      <form onSubmit={handleSubmit} className="mb-8 grid max-w-xl gap-3 bg-white p-5 shadow-sm sm:grid-cols-[1fr_1fr_auto]">
        <input required placeholder="Category name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="input" />
        <input placeholder="Description (optional)" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="input" />
        <div className="flex gap-2">
          <button type="submit" disabled={saving} className="flex-1 bg-forest px-4 py-2.5 text-xs font-semibold uppercase tracking-widest text-cream hover:bg-forest-mid">
            {editingId ? 'Update' : 'Add'}
          </button>
          {editingId && (
            <button type="button" onClick={cancelEdit} className="px-3 text-xs font-semibold uppercase tracking-widest text-text-muted">✕</button>
          )}
        </div>
      </form>

      <DataTable
        loading={loading}
        error={error}
        onRetry={reload}
        rows={items}
        meta={meta}
        onPageChange={setPage}
        emptyMessage="Add a category above."
        columns={[
          { key: 'name', label: 'Name', render: (c) => <span className="font-medium text-forest">{c.name}</span> },
          { key: 'description', label: 'Description', render: (c) => c.description || '—' },
          {
            key: 'actions',
            label: '',
            render: (c) => (
              <div className="flex gap-3 text-xs font-semibold uppercase tracking-widest">
                <button type="button" onClick={() => startEdit(c)} className="text-forest hover:text-gold">Edit</button>
                <button type="button" onClick={() => setPendingDelete(c)} className="text-red-600 hover:text-red-800">Delete</button>
              </div>
            ),
          },
        ]}
      />

      <ConfirmDialog
        open={!!pendingDelete}
        title="Delete category?"
        message={pendingDelete ? `"${pendingDelete.name}" will be permanently removed. Products in this category will keep it unset.` : ''}
        onConfirm={handleDelete}
        onCancel={() => setPendingDelete(null)}
      />
    </div>
  );
}
