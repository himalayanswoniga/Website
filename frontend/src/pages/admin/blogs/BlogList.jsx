import { useState } from 'react';
import { Link } from 'react-router-dom';
import Seo from '../../../components/common/Seo';
import DataTable from '../../../components/admin/DataTable';
import ConfirmDialog from '../../../components/common/ConfirmDialog';
import { usePaginatedFetch } from '../../../hooks/usePaginatedFetch';
import { blogService } from '../../../services/blogService';
import { useToast } from '../../../context/ToastContext';

export default function BlogList() {
  const [page, setPage] = useState(1);
  const [pendingDelete, setPendingDelete] = useState(null);
  const toast = useToast();
  const { items, meta, loading, error, reload } = usePaginatedFetch(blogService.listAdmin, { page, limit: 10 }, [page]);

  async function handleDelete() {
    try {
      await blogService.remove(pendingDelete._id);
      toast.success('Post deleted');
      setPendingDelete(null);
      reload();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete post');
    }
  }

  return (
    <div>
      <Seo title="Manage Blog" />
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <h1 className="font-serif text-2xl text-forest">Blog Posts</h1>
        <Link to="/admin/blogs/new" className="bg-forest px-5 py-2.5 text-xs font-semibold uppercase tracking-widest text-cream hover:bg-forest-mid">
          + New Post
        </Link>
      </div>

      <DataTable
        loading={loading}
        error={error}
        onRetry={reload}
        rows={items}
        meta={meta}
        onPageChange={setPage}
        emptyMessage="Write your first post."
        columns={[
          { key: 'title', label: 'Title', render: (b) => <span className="font-medium text-forest">{b.title}</span> },
          {
            key: 'status',
            label: 'Status',
            render: (b) => (
              <span className={`text-xs font-semibold uppercase ${b.status === 'published' ? 'text-forest-light' : 'text-text-muted'}`}>{b.status}</span>
            ),
          },
          { key: 'createdAt', label: 'Created', render: (b) => new Date(b.createdAt).toLocaleDateString() },
          {
            key: 'actions',
            label: '',
            render: (b) => (
              <div className="flex gap-3 text-xs font-semibold uppercase tracking-widest">
                <Link to={`/admin/blogs/${b._id}/edit`} className="text-forest hover:text-gold">Edit</Link>
                <button type="button" onClick={() => setPendingDelete(b)} className="text-red-600 hover:text-red-800">Delete</button>
              </div>
            ),
          },
        ]}
      />

      <ConfirmDialog
        open={!!pendingDelete}
        title="Delete post?"
        message={pendingDelete ? `"${pendingDelete.title}" will be permanently removed.` : ''}
        onConfirm={handleDelete}
        onCancel={() => setPendingDelete(null)}
      />
    </div>
  );
}
