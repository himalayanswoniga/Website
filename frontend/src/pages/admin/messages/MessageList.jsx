import { useState } from 'react';
import Seo from '../../../components/common/Seo';
import DataTable from '../../../components/admin/DataTable';
import ConfirmDialog from '../../../components/common/ConfirmDialog';
import { usePaginatedFetch } from '../../../hooks/usePaginatedFetch';
import { contactService } from '../../../services/contactService';
import { useToast } from '../../../context/ToastContext';

export default function MessageList() {
  const [page, setPage] = useState(1);
  const [filter, setFilter] = useState('all');
  const [expanded, setExpanded] = useState(null);
  const [pendingDelete, setPendingDelete] = useState(null);
  const toast = useToast();
  const { items, meta, loading, error, reload } = usePaginatedFetch(
    contactService.list,
    { page, limit: 15, isRead: filter === 'all' ? undefined : filter === 'read' },
    [page, filter]
  );

  async function toggleRead(message) {
    try {
      await contactService.markRead(message._id, !message.isRead);
      reload();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update message');
    }
  }

  async function handleDelete() {
    try {
      await contactService.remove(pendingDelete._id);
      toast.success('Message deleted');
      setPendingDelete(null);
      reload();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete message');
    }
  }

  return (
    <div>
      <Seo title="Contact Messages" />
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <h1 className="font-serif text-2xl text-forest">Contact Messages</h1>
        <div className="flex gap-2">
          {['all', 'unread', 'read'].map((f) => (
            <button
              key={f}
              type="button"
              onClick={() => { setFilter(f); setPage(1); }}
              className={`px-4 py-1.5 text-xs font-semibold uppercase tracking-widest ${filter === f ? 'bg-forest text-cream' : 'border border-forest/20 text-forest'}`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      <DataTable
        loading={loading}
        error={error}
        onRetry={reload}
        rows={items}
        meta={meta}
        onPageChange={setPage}
        emptyMessage="No messages yet."
        columns={[
          {
            key: 'name',
            label: 'From',
            render: (m) => (
              <div>
                <p className={`font-medium ${m.isRead ? 'text-text' : 'text-forest'}`}>{!m.isRead && <span className="mr-1.5 inline-block h-2 w-2 rounded-full bg-red-500" />}{m.name}</p>
                <p className="text-xs text-text-muted">{m.email}</p>
              </div>
            ),
          },
          { key: 'enquiryType', label: 'Type' },
          { key: 'createdAt', label: 'Received', render: (m) => new Date(m.createdAt).toLocaleDateString() },
          {
            key: 'message',
            label: 'Message',
            render: (m) => (
              <button type="button" onClick={() => setExpanded(expanded === m._id ? null : m._id)} className="max-w-xs text-left text-text-muted hover:text-forest">
                {expanded === m._id ? m.message : `${m.message.slice(0, 60)}${m.message.length > 60 ? '…' : ''}`}
              </button>
            ),
          },
          {
            key: 'actions',
            label: '',
            render: (m) => (
              <div className="flex gap-3 text-xs font-semibold uppercase tracking-widest">
                <button type="button" onClick={() => toggleRead(m)} className="text-forest hover:text-gold">
                  Mark {m.isRead ? 'Unread' : 'Read'}
                </button>
                <button type="button" onClick={() => setPendingDelete(m)} className="text-red-600 hover:text-red-800">Delete</button>
              </div>
            ),
          },
        ]}
      />

      <ConfirmDialog
        open={!!pendingDelete}
        title="Delete message?"
        message={pendingDelete ? `Message from "${pendingDelete.name}" will be permanently removed.` : ''}
        onConfirm={handleDelete}
        onCancel={() => setPendingDelete(null)}
      />
    </div>
  );
}
