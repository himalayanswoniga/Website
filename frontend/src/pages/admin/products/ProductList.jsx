import { useState } from 'react';
import { Link } from 'react-router-dom';
import Seo from '../../../components/common/Seo';
import DataTable from '../../../components/admin/DataTable';
import ConfirmDialog from '../../../components/common/ConfirmDialog';
import { usePaginatedFetch } from '../../../hooks/usePaginatedFetch';
import { productService } from '../../../services/productService';
import { useToast } from '../../../context/ToastContext';

export default function ProductList() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [pendingDelete, setPendingDelete] = useState(null);
  const toast = useToast();
  const { items, meta, loading, error, reload } = usePaginatedFetch(
    productService.list,
    { page, limit: 10, search: search || undefined },
    [page, search]
  );

  async function handleDelete() {
    try {
      await productService.remove(pendingDelete._id);
      toast.success('Product deleted');
      setPendingDelete(null);
      reload();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete product');
    }
  }

  return (
    <div>
      <Seo title="Manage Products" />
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <h1 className="font-serif text-2xl text-forest">Products</h1>
        <Link to="/admin/products/new" className="bg-forest px-5 py-2.5 text-xs font-semibold uppercase tracking-widest text-cream hover:bg-forest-mid">
          + Add Product
        </Link>
      </div>

      <input
        type="search"
        placeholder="Search products…"
        value={search}
        onChange={(e) => { setSearch(e.target.value); setPage(1); }}
        className="mb-4 w-full max-w-xs border border-forest/15 px-3 py-2 text-sm outline-none"
      />

      <DataTable
        loading={loading}
        error={error}
        onRetry={reload}
        rows={items}
        meta={meta}
        onPageChange={setPage}
        emptyMessage="Add your first product to get started."
        columns={[
          {
            key: 'name',
            label: 'Product',
            render: (p) => (
              <div className="flex items-center gap-3">
                {p.images?.[0]?.url ? (
                  <img src={p.images[0].url} alt="" className="h-10 w-10 object-cover" />
                ) : (
                  <span className="text-xl">{p.icon}</span>
                )}
                <span className="font-medium text-forest">{p.name}</span>
              </div>
            ),
          },
          { key: 'category', label: 'Category', render: (p) => p.category?.name || '—' },
          { key: 'tag', label: 'Tag' },
          { key: 'featured', label: 'Featured', render: (p) => (p.featured ? '⭐' : '') },
          { key: 'inStock', label: 'Stock', render: (p) => (p.inStock ? 'In Stock' : 'Out of Stock') },
          {
            key: 'actions',
            label: '',
            render: (p) => (
              <div className="flex gap-3 text-xs font-semibold uppercase tracking-widest">
                <Link to={`/admin/products/${p._id}/edit`} className="text-forest hover:text-gold">Edit</Link>
                <button type="button" onClick={() => setPendingDelete(p)} className="text-red-600 hover:text-red-800">Delete</button>
              </div>
            ),
          },
        ]}
      />

      <ConfirmDialog
        open={!!pendingDelete}
        title="Delete product?"
        message={pendingDelete ? `"${pendingDelete.name}" will be permanently removed.` : ''}
        onConfirm={handleDelete}
        onCancel={() => setPendingDelete(null)}
      />
    </div>
  );
}
