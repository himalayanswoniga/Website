import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import Seo from '../../../components/common/Seo';
import Loader from '../../../components/common/Loader';
import ImageUploader from '../../../components/admin/ImageUploader';
import RichTextEditor from '../../../components/admin/RichTextEditor';
import { blogService } from '../../../services/blogService';
import { useToast } from '../../../context/ToastContext';

const EMPTY = { title: '', excerpt: '', content: '', tags: '', status: 'draft' };

export default function BlogForm() {
  const { id } = useParams();
  const isEdit = !!id;
  const navigate = useNavigate();
  const toast = useToast();

  const [form, setForm] = useState(EMPTY);
  const [featuredImage, setFeaturedImage] = useState(null);
  const [currentFeaturedImageUrl, setCurrentFeaturedImageUrl] = useState('');
  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!isEdit) return;
    blogService.get(id).then((post) => {
      setForm({
        title: post.title, excerpt: post.excerpt || '', content: post.content || '',
        tags: (post.tags || []).join(', '), status: post.status,
      });
      setCurrentFeaturedImageUrl(post.featuredImage?.url || '');
      setLoading(false);
    });
  }, [id, isEdit]);

  function update(field) {
    return (e) => setForm((prev) => ({ ...prev, [field]: e.target.value }));
  }

  async function save(status) {
    setSaving(true);
    try {
      const payload = { ...form, status };
      if (isEdit) {
        await blogService.update(id, payload, featuredImage);
        toast.success('Post updated');
      } else {
        await blogService.create(payload, featuredImage);
        toast.success('Post created');
      }
      navigate('/admin/blogs');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save post');
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <Loader label="Loading post…" />;

  return (
    <div className="max-w-3xl">
      <Seo title={isEdit ? 'Edit Post' : 'New Post'} />
      <h1 className="mb-6 font-serif text-2xl text-forest">{isEdit ? 'Edit Post' : 'New Post'}</h1>

      <form onSubmit={(e) => e.preventDefault()} className="flex flex-col gap-4 bg-white p-6 shadow-sm">
        <label className="block">
          <span className="mb-1.5 block text-xs font-semibold uppercase tracking-widest text-text-muted">Title</span>
          <input required value={form.title} onChange={update('title')} className="input" />
        </label>
        <label className="block">
          <span className="mb-1.5 block text-xs font-semibold uppercase tracking-widest text-text-muted">Excerpt</span>
          <textarea value={form.excerpt} onChange={update('excerpt')} className="input" rows={2} />
        </label>
        <label className="block">
          <span className="mb-1.5 block text-xs font-semibold uppercase tracking-widest text-text-muted">Content</span>
          <RichTextEditor content={form.content} onChange={(html) => setForm((prev) => ({ ...prev, content: html }))} />
        </label>
        <label className="block">
          <span className="mb-1.5 block text-xs font-semibold uppercase tracking-widest text-text-muted">Tags (comma-separated)</span>
          <input value={form.tags} onChange={update('tags')} className="input" placeholder="recipes, farming, nepal" />
        </label>

        <ImageUploader label="Featured Image" currentUrl={currentFeaturedImageUrl} onChange={setFeaturedImage} />

        <div className="mt-2 flex gap-3">
          <button type="button" disabled={saving} onClick={() => save('published')} className="bg-forest px-6 py-2.5 text-xs font-semibold uppercase tracking-widest text-cream hover:bg-forest-mid disabled:opacity-60">
            {saving ? 'Saving…' : 'Publish'}
          </button>
          <button type="button" disabled={saving} onClick={() => save('draft')} className="border border-forest px-6 py-2.5 text-xs font-semibold uppercase tracking-widest text-forest hover:bg-cream-2 disabled:opacity-60">
            Save as Draft
          </button>
          <Link to="/admin/blogs" className="px-6 py-2.5 text-xs font-semibold uppercase tracking-widest text-text-muted">Cancel</Link>
        </div>
      </form>
    </div>
  );
}
