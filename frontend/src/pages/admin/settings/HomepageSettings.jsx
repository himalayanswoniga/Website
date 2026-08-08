import { useState, useEffect } from 'react';
import Seo from '../../../components/common/Seo';
import Loader from '../../../components/common/Loader';
import ErrorState from '../../../components/common/ErrorState';
import ImageUploader from '../../../components/admin/ImageUploader';
import RepeatableList from '../../../components/admin/RepeatableList';
import { useFetch } from '../../../hooks/useFetch';
import { settingsService } from '../../../services/settingsService';
import { useToast } from '../../../context/ToastContext';

const TABS = ['Hero', 'About', 'Packaging', 'Process', 'Values', 'Call to Action'];

export default function HomepageSettings() {
  const { data: settings, loading, error, reload, setData } = useFetch(() => settingsService.get(), []);
  const [tab, setTab] = useState('Hero');
  const [saving, setSaving] = useState(false);
  const [local, setLocal] = useState(null);
  const toast = useToast();

  useEffect(() => {
    if (settings) setLocal(settings);
  }, [settings]);

  if (loading) return <Loader label="Loading homepage settings…" />;
  if (error || !local) return <ErrorState message={error} onRetry={reload} />;

  async function saveSection(section) {
    setSaving(true);
    try {
      const updated = await settingsService.update(section, local[section]);
      setData(updated);
      toast.success('Homepage updated');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save changes');
    } finally {
      setSaving(false);
    }
  }

  async function handleAboutImage(file) {
    if (!file) return;
    try {
      const updated = await settingsService.uploadAboutImage(file);
      setData(updated);
      setLocal(updated);
      toast.success('About image updated');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to upload image');
    }
  }

  function set(section, key, value) {
    setLocal((prev) => ({ ...prev, [section]: { ...prev[section], [key]: value } }));
  }

  return (
    <div className="max-w-3xl">
      <Seo title="Homepage Settings" />
      <h1 className="mb-6 font-serif text-2xl text-forest">Homepage Content</h1>

      <div className="mb-6 flex flex-wrap gap-2 border-b border-forest/10">
        {TABS.map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setTab(t)}
            className={`px-4 py-2 text-xs font-semibold uppercase tracking-widest ${tab === t ? 'border-b-2 border-gold text-forest' : 'text-text-muted'}`}
          >
            {t}
          </button>
        ))}
      </div>

      {tab === 'Hero' && (
        <SectionCard onSave={() => saveSection('hero')} saving={saving}>
          <Field label="Tag Line"><input className="input" value={local.hero.tag} onChange={(e) => set('hero', 'tag', e.target.value)} /></Field>
          <Field label="Headline"><input className="input" value={local.hero.title} onChange={(e) => set('hero', 'title', e.target.value)} /></Field>
          <Field label="Description"><textarea className="input" rows={3} value={local.hero.description} onChange={(e) => set('hero', 'description', e.target.value)} /></Field>
          <Field label="Stats">
            <RepeatableList
              items={local.hero.stats || []}
              fields={[{ key: 'value', label: 'Value (e.g. 100%)' }, { key: 'label', label: 'Label (e.g. Natural)' }]}
              onChange={(items) => set('hero', 'stats', items)}
              addLabel="+ Add Stat"
            />
          </Field>
        </SectionCard>
      )}

      {tab === 'About' && (
        <SectionCard onSave={() => saveSection('about')} saving={saving}>
          <Field label="Image">
            <ImageUploader currentUrl={local.about.image?.url} onChange={handleAboutImage} />
          </Field>
          <Field label="Established Year"><input className="input" value={local.about.establishedYear} onChange={(e) => set('about', 'establishedYear', e.target.value)} /></Field>
          <Field label="Title"><input className="input" value={local.about.title} onChange={(e) => set('about', 'title', e.target.value)} /></Field>
          <Field label="Body"><textarea className="input" rows={4} value={local.about.body} onChange={(e) => set('about', 'body', e.target.value)} /></Field>
          <Field label="Bullet Points">
            <RepeatableList
              items={(local.about.bullets || []).map((b) => ({ text: b }))}
              fields={[{ key: 'text', label: 'Bullet point' }]}
              onChange={(items) => set('about', 'bullets', items.map((i) => i.text))}
              addLabel="+ Add Bullet"
            />
          </Field>
        </SectionCard>
      )}

      {tab === 'Packaging' && (
        <SectionCard onSave={() => saveSection('packaging')} saving={saving}>
          <Field label="Title"><input className="input" value={local.packaging.title} onChange={(e) => set('packaging', 'title', e.target.value)} /></Field>
          <Field label="Body"><textarea className="input" rows={3} value={local.packaging.body} onChange={(e) => set('packaging', 'body', e.target.value)} /></Field>
          <Field label="Features">
            <RepeatableList
              items={local.packaging.features || []}
              fields={[{ key: 'icon', label: 'Icon' }, { key: 'title', label: 'Title' }, { key: 'body', label: 'Description' }]}
              onChange={(items) => set('packaging', 'features', items)}
              addLabel="+ Add Feature"
            />
          </Field>
          <Field label="CTA Title"><input className="input" value={local.packaging.ctaTitle} onChange={(e) => set('packaging', 'ctaTitle', e.target.value)} /></Field>
          <Field label="CTA Body"><input className="input" value={local.packaging.ctaBody} onChange={(e) => set('packaging', 'ctaBody', e.target.value)} /></Field>
        </SectionCard>
      )}

      {tab === 'Process' && (
        <SectionCard onSave={() => saveSection('process')} saving={saving}>
          <Field label="Title"><input className="input" value={local.process.title} onChange={(e) => set('process', 'title', e.target.value)} /></Field>
          <Field label="Steps">
            <RepeatableList
              items={local.process.steps || []}
              fields={[{ key: 'icon', label: 'Icon' }, { key: 'title', label: 'Title' }, { key: 'body', label: 'Description' }]}
              onChange={(items) => set('process', 'steps', items)}
              addLabel="+ Add Step"
            />
          </Field>
        </SectionCard>
      )}

      {tab === 'Values' && (
        <SectionCard onSave={() => saveSection('values')} saving={saving}>
          <Field label="Title"><input className="input" value={local.values.title} onChange={(e) => set('values', 'title', e.target.value)} /></Field>
          <Field label="Value Cards">
            <RepeatableList
              items={local.values.items || []}
              fields={[{ key: 'icon', label: 'Icon' }, { key: 'title', label: 'Title' }, { key: 'body', label: 'Description' }]}
              onChange={(items) => set('values', 'items', items)}
              addLabel="+ Add Value"
            />
          </Field>
        </SectionCard>
      )}

      {tab === 'Call to Action' && (
        <SectionCard onSave={() => saveSection('cta')} saving={saving}>
          <Field label="Title"><input className="input" value={local.cta.title} onChange={(e) => set('cta', 'title', e.target.value)} /></Field>
          <Field label="Body"><textarea className="input" rows={2} value={local.cta.body} onChange={(e) => set('cta', 'body', e.target.value)} /></Field>
          <Field label="Button Text"><input className="input" value={local.cta.buttonText} onChange={(e) => set('cta', 'buttonText', e.target.value)} /></Field>
          <Field label="Button Link"><input className="input" value={local.cta.buttonLink} onChange={(e) => set('cta', 'buttonLink', e.target.value)} /></Field>
        </SectionCard>
      )}
    </div>
  );
}

function SectionCard({ children, onSave, saving }) {
  return (
    <div className="flex flex-col gap-4 bg-white p-6 shadow-sm">
      {children}
      <button type="button" onClick={onSave} disabled={saving} className="self-start bg-forest px-6 py-2.5 text-xs font-semibold uppercase tracking-widest text-cream hover:bg-forest-mid disabled:opacity-60">
        {saving ? 'Saving…' : 'Save Section'}
      </button>
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
