import { useState, useEffect } from 'react';
import Seo from '../../../components/common/Seo';
import Loader from '../../../components/common/Loader';
import ErrorState from '../../../components/common/ErrorState';
import { useFetch } from '../../../hooks/useFetch';
import { settingsService } from '../../../services/settingsService';
import { useToast } from '../../../context/ToastContext';

export default function ContactInfoSettings() {
  const { data: settings, loading, error, reload, setData } = useFetch(() => settingsService.get(), []);
  const [local, setLocal] = useState(null);
  const [saving, setSaving] = useState(false);
  const toast = useToast();

  useEffect(() => {
    if (settings) setLocal(settings);
  }, [settings]);

  if (loading) return <Loader label="Loading contact settings…" />;
  if (error || !local) return <ErrorState message={error} onRetry={reload} />;

  function setContact(key, value) {
    setLocal((prev) => ({ ...prev, contactInfo: { ...prev.contactInfo, [key]: value } }));
  }
  function setSocial(key, value) {
    setLocal((prev) => ({ ...prev, contactInfo: { ...prev.contactInfo, socialLinks: { ...prev.contactInfo.socialLinks, [key]: value } } }));
  }
  function setSeo(key, value) {
    setLocal((prev) => ({ ...prev, seo: { ...prev.seo, [key]: value } }));
  }

  async function handleSave(section, payload) {
    setSaving(true);
    try {
      const updated = await settingsService.update(section, payload);
      setData(updated);
      toast.success('Saved');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="max-w-2xl">
      <Seo title="Contact & SEO Settings" />
      <h1 className="mb-6 font-serif text-2xl text-forest">Contact Information</h1>

      <div className="mb-8 flex flex-col gap-4 bg-white p-6 shadow-sm">
        <Field label="Address"><input className="input" value={local.contactInfo.address} onChange={(e) => setContact('address', e.target.value)} /></Field>
        <div className="grid grid-cols-2 gap-4">
          <Field label="Phone"><input className="input" value={local.contactInfo.phone} onChange={(e) => setContact('phone', e.target.value)} /></Field>
          <Field label="Email"><input className="input" type="email" value={local.contactInfo.email} onChange={(e) => setContact('email', e.target.value)} /></Field>
        </div>
        <Field label="Website"><input className="input" value={local.contactInfo.website} onChange={(e) => setContact('website', e.target.value)} /></Field>
        <Field label="Google Maps Embed URL">
          <input className="input" value={local.contactInfo.mapEmbedUrl} onChange={(e) => setContact('mapEmbedUrl', e.target.value)} placeholder="https://www.google.com/maps/embed?..." />
        </Field>
        <div className="grid grid-cols-3 gap-4">
          <Field label="Facebook"><input className="input" value={local.contactInfo.socialLinks?.facebook || ''} onChange={(e) => setSocial('facebook', e.target.value)} /></Field>
          <Field label="Instagram"><input className="input" value={local.contactInfo.socialLinks?.instagram || ''} onChange={(e) => setSocial('instagram', e.target.value)} /></Field>
          <Field label="Twitter / X"><input className="input" value={local.contactInfo.socialLinks?.twitter || ''} onChange={(e) => setSocial('twitter', e.target.value)} /></Field>
        </div>
        <button
          type="button"
          disabled={saving}
          onClick={() => handleSave('contactInfo', local.contactInfo)}
          className="self-start bg-forest px-6 py-2.5 text-xs font-semibold uppercase tracking-widest text-cream hover:bg-forest-mid disabled:opacity-60"
        >
          {saving ? 'Saving…' : 'Save Contact Info'}
        </button>
      </div>

      <h2 className="mb-4 font-serif text-xl text-forest">SEO Defaults</h2>
      <div className="flex flex-col gap-4 bg-white p-6 shadow-sm">
        <Field label="Default Meta Title"><input className="input" value={local.seo.metaTitle} onChange={(e) => setSeo('metaTitle', e.target.value)} /></Field>
        <Field label="Default Meta Description"><textarea className="input" rows={2} value={local.seo.metaDescription} onChange={(e) => setSeo('metaDescription', e.target.value)} /></Field>
        <button
          type="button"
          disabled={saving}
          onClick={() => handleSave('seo', local.seo)}
          className="self-start bg-forest px-6 py-2.5 text-xs font-semibold uppercase tracking-widest text-cream hover:bg-forest-mid disabled:opacity-60"
        >
          {saving ? 'Saving…' : 'Save SEO Defaults'}
        </button>
      </div>
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
