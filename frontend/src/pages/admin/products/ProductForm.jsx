import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import Seo from '../../../components/common/Seo';
import Loader from '../../../components/common/Loader';
import ImageUploader from '../../../components/admin/ImageUploader';
import { productService } from '../../../services/productService';
import { categoryService } from '../../../services/categoryService';
import { useToast } from '../../../context/ToastContext';

const EMPTY = { name: '', icon: '🌿', shortDescription: '', description: '', category: '', tag: '', price: '', inStock: true, featured: false, order: 0 };

export default function ProductForm() {
  const { id } = useParams();
  const isEdit = !!id;
  const navigate = useNavigate();
  const toast = useToast();

  const [form, setForm] = useState(EMPTY);
  const [images, setImages] = useState(null);
  const [existingImages, setExistingImages] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    categoryService.list({ all: 'true' }).then((res) => setCategories(Array.isArray(res) ? res : []));
  }, []);

  useEffect(() => {
    if (!isEdit) return;
    productService.get(id).then((p) => {
      setForm({
        name: p.name, icon: p.icon || '🌿', shortDescription: p.shortDescription || '', description: p.description || '',
        category: p.category?._id || '', tag: p.tag || '', price: p.price ?? '', inStock: p.inStock, featured: p.featured, order: p.order || 0,
      });
      setExistingImages(p.images || []);
      setLoading(false);
    });
  }, [id, isEdit]);

  async function removeExistingImage(imageId) {
    try {
      const updated = await productService.deleteImage(id, imageId);
      setExistingImages(updated.images || []);
      toast.success('Photo removed');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to remove photo');
    }
  }

  function update(field) {
    return (e) => {
      const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
      setForm((prev) => ({ ...prev, [field]: value }));
    };
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = { ...form, price: form.price === '' ? undefined : form.price };
      if (isEdit) {
        await productService.update(id, payload, images);
        toast.success('Product updated');
      } else {
        await productService.create(payload, images);
        toast.success('Product created');
      }
      navigate('/admin/products');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save product');
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <Loader label="Loading product…" />;

  return (
    <div className="max-w-2xl">
      <Seo title={isEdit ? 'Edit Product' : 'Add Product'} />
      <h1 className="mb-6 font-serif text-2xl text-forest">{isEdit ? 'Edit Product' : 'Add Product'}</h1>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4 bg-white p-6 shadow-sm">
        <Field label="Name">
          <input required value={form.name} onChange={update('name')} className="input" />
        </Field>
        <div className="grid grid-cols-2 gap-4">
          <Field label="Emoji Icon (fallback if no photo)">
            <input value={form.icon} onChange={update('icon')} className="input" />
          </Field>
          <Field label="Tag (e.g. Bestseller, New)">
            <input value={form.tag} onChange={update('tag')} className="input" />
          </Field>
        </div>
        <Field label="Category">
          <select value={form.category} onChange={update('category')} className="input">
            <option value="">No category</option>
            {categories.map((c) => <option key={c._id} value={c._id}>{c.name}</option>)}
          </select>
        </Field>
        <Field label="Short Description (shown on cards)">
          <textarea value={form.shortDescription} onChange={update('shortDescription')} className="input" rows={2} />
        </Field>
        <Field label="Full Description (shown on product page)">
          <textarea value={form.description} onChange={update('description')} className="input" rows={4} />
        </Field>
        <div className="grid grid-cols-2 gap-4">
          <Field label="Price (NPR, optional)">
            <input type="number" min="0" value={form.price} onChange={update('price')} className="input" />
          </Field>
          <Field label="Display Order">
            <input type="number" value={form.order} onChange={update('order')} className="input" />
          </Field>
        </div>
        <div className="flex gap-6">
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={form.inStock} onChange={update('inStock')} /> In Stock
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={form.featured} onChange={update('featured')} /> Featured on Homepage
          </label>
        </div>

        {isEdit && existingImages.length > 0 && (
          <div>
            <span className="mb-1.5 block text-xs font-semibold uppercase tracking-widest text-text-muted">Current Photos</span>
            <div className="flex flex-wrap gap-3">
              {existingImages.map((img) => (
                <div key={img.publicId} className="relative">
                  <img src={img.url} alt="" className="h-20 w-20 object-cover" />
                  <button
                    type="button"
                    onClick={() => removeExistingImage(img.publicId)}
                    aria-label="Remove photo"
                    className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-red-600 text-xs text-white hover:bg-red-700"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
        <ImageUploader label="Add Product Photos" multiple onChange={setImages} />

        <div className="mt-2 flex gap-3">
          <button type="submit" disabled={saving} className="bg-forest px-6 py-2.5 text-xs font-semibold uppercase tracking-widest text-cream hover:bg-forest-mid disabled:opacity-60">
            {saving ? 'Saving…' : 'Save Product'}
          </button>
          <Link to="/admin/products" className="px-6 py-2.5 text-xs font-semibold uppercase tracking-widest text-forest">Cancel</Link>
        </div>
      </form>
    </div>
  );
}

function Field({ label, children }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-semibold uppercase tracking-widest text-text-muted">{label}</span>
      {children}
    </label>
  );
}
