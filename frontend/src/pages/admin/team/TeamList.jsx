import { useState } from 'react';
import Seo from '../../../components/common/Seo';
import DataTable from '../../../components/admin/DataTable';
import ConfirmDialog from '../../../components/common/ConfirmDialog';
import ImageUploader from '../../../components/admin/ImageUploader';
import { usePaginatedFetch } from '../../../hooks/usePaginatedFetch';
import { teamService } from '../../../services/teamService';
import { useToast } from '../../../context/ToastContext';

const EMPTY = { name: '', designation: '', bio: '', facebook: '', instagram: '', linkedin: '' };

export default function TeamList() {
  const [page, setPage] = useState(1);
  const [form, setForm] = useState(EMPTY);
  const [photo, setPhoto] = useState(null);
  const [currentPhotoUrl, setCurrentPhotoUrl] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [pendingDelete, setPendingDelete] = useState(null);
  const toast = useToast();
  const { items, meta, loading, error, reload } = usePaginatedFetch(teamService.list, { page, limit: 10, sort: 'order' }, [page]);

  function startEdit(member) {
    setEditingId(member._id);
    setForm({
      name: member.name, designation: member.designation, bio: member.bio || '',
      facebook: member.socialLinks?.facebook || '', instagram: member.socialLinks?.instagram || '', linkedin: member.socialLinks?.linkedin || '',
    });
    setCurrentPhotoUrl(member.photo?.url || '');
    setPhoto(null);
  }

  function cancelEdit() {
    setEditingId(null);
    setForm(EMPTY);
    setPhoto(null);
    setCurrentPhotoUrl('');
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    try {
      if (editingId) {
        await teamService.update(editingId, form, photo);
        toast.success('Team member updated');
      } else {
        await teamService.create(form, photo);
        toast.success('Team member added');
      }
      cancelEdit();
      reload();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save team member');
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    try {
      await teamService.remove(pendingDelete._id);
      toast.success('Team member removed');
      setPendingDelete(null);
      reload();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete team member');
    }
  }

  return (
    <div>
      <Seo title="Manage Team" />
      <h1 className="mb-6 font-serif text-2xl text-forest">Team</h1>

      <form onSubmit={handleSubmit} className="mb-8 flex flex-col gap-3 bg-white p-5 shadow-sm sm:max-w-2xl">
        <div className="grid gap-3 sm:grid-cols-2">
          <input required placeholder="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="input" />
          <input required placeholder="Designation" value={form.designation} onChange={(e) => setForm({ ...form, designation: e.target.value })} className="input" />
        </div>
        <textarea placeholder="Short bio" value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })} className="input" rows={2} />
        <div className="grid gap-3 sm:grid-cols-3">
          <input placeholder="Facebook URL" value={form.facebook} onChange={(e) => setForm({ ...form, facebook: e.target.value })} className="input" />
          <input placeholder="Instagram URL" value={form.instagram} onChange={(e) => setForm({ ...form, instagram: e.target.value })} className="input" />
          <input placeholder="LinkedIn URL" value={form.linkedin} onChange={(e) => setForm({ ...form, linkedin: e.target.value })} className="input" />
        </div>
        <ImageUploader label="Photo" currentUrl={currentPhotoUrl} onChange={setPhoto} />
        <div className="flex gap-2">
          <button type="submit" disabled={saving} className="bg-forest px-6 py-2.5 text-xs font-semibold uppercase tracking-widest text-cream hover:bg-forest-mid">
            {editingId ? 'Update' : 'Add'} Member
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
        emptyMessage="Add your first team member above."
        columns={[
          {
            key: 'name',
            label: 'Member',
            render: (m) => (
              <div className="flex items-center gap-3">
                {m.photo?.url ? <img src={m.photo.url} alt="" className="h-10 w-10 rounded-full object-cover" /> : <span className="text-xl">👤</span>}
                <div>
                  <p className="font-medium text-forest">{m.name}</p>
                  <p className="text-xs text-text-muted">{m.designation}</p>
                </div>
              </div>
            ),
          },
          {
            key: 'actions',
            label: '',
            render: (m) => (
              <div className="flex gap-3 text-xs font-semibold uppercase tracking-widest">
                <button type="button" onClick={() => startEdit(m)} className="text-forest hover:text-gold">Edit</button>
                <button type="button" onClick={() => setPendingDelete(m)} className="text-red-600 hover:text-red-800">Delete</button>
              </div>
            ),
          },
        ]}
      />

      <ConfirmDialog open={!!pendingDelete} title="Remove team member?" onConfirm={handleDelete} onCancel={() => setPendingDelete(null)} />
    </div>
  );
}
