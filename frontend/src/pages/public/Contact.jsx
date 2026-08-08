import { useState } from 'react';
import Seo from '../../components/common/Seo';
import Loader from '../../components/common/Loader';
import { useFetch } from '../../hooks/useFetch';
import { settingsService } from '../../services/settingsService';
import { contactService } from '../../services/contactService';
import { useToast } from '../../context/ToastContext';

const ENQUIRY_TYPES = ['General Enquiry', 'Bulk / Wholesale Order', 'Retail Purchase', 'Custom Blend Request', 'Distribution Partnership'];

const EMPTY_FORM = { name: '', email: '', phone: '', enquiryType: '', message: '' };

export default function Contact() {
  const { data: settings, loading } = useFetch(() => settingsService.get(), []);
  const toast = useToast();
  const [form, setForm] = useState(EMPTY_FORM);
  const [submitting, setSubmitting] = useState(false);

  const update = (field) => (e) => setForm((prev) => ({ ...prev, [field]: e.target.value }));

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitting(true);
    try {
      await contactService.submit(form);
      toast.success("Enquiry sent — we'll be in touch soon!");
      setForm(EMPTY_FORM);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to send your message. Please try again.');
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) return <Loader label="Loading contact info…" />;

  const contact = settings?.contactInfo || {};

  return (
    <>
      <Seo title="Contact Us" description="Get in touch with Himalayan Swoniga Harvest for bulk orders, custom blends, or general enquiries." />

      <div className="page-hero">
        <span className="eyebrow">Get In Touch</span>
        <h1 className="section-title">Let's Work Together</h1>
      </div>

      <section className="contact-section">
        <div className="contact-grid">
          <div>
            <span className="eyebrow">Contact Information</span>
            <h3 className="section-title" style={{ fontSize: '1.9rem' }}>We'd love to<br /><em>hear from you.</em></h3>
            <div className="rule" />
            <div className="ci-list">
              {contact.address && (
                <div className="ci-item"><div className="ci-box">📍</div><div><p className="ci-label">Location</p><p className="ci-val">{contact.address}</p></div></div>
              )}
              {contact.phone && (
                <div className="ci-item"><div className="ci-box">📞</div><div><p className="ci-label">Phone</p><p className="ci-val">{contact.phone}</p></div></div>
              )}
              {contact.email && (
                <div className="ci-item"><div className="ci-box">📧</div><div><p className="ci-label">Email</p><p className="ci-val">{contact.email}</p></div></div>
              )}
              {contact.website && (
                <div className="ci-item"><div className="ci-box">🌐</div><div><p className="ci-label">Website</p><p className="ci-val">{contact.website}</p></div></div>
              )}
            </div>
            {contact.mapEmbedUrl && <iframe title="Location map" src={contact.mapEmbedUrl} className="map-embed" loading="lazy" />}
          </div>

          <form className="contact-form" onSubmit={handleSubmit}>
            <div className="form-row">
              <input type="text" placeholder="Your Full Name" required value={form.name} onChange={update('name')} />
              <input type="email" placeholder="Email Address" required value={form.email} onChange={update('email')} />
            </div>
            <input type="text" placeholder="Phone Number (optional)" value={form.phone} onChange={update('phone')} />
            <select required value={form.enquiryType} onChange={update('enquiryType')} className={form.enquiryType ? 'filled' : ''}>
              <option value="" disabled>Type of Enquiry</option>
              {ENQUIRY_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
            <textarea placeholder="Tell us about your requirements…" required value={form.message} onChange={update('message')} />
            <button type="submit" className="btn btn-dark" style={{ width: '100%', textAlign: 'center' }} disabled={submitting}>
              {submitting ? 'Sending…' : 'Send Enquiry'}
            </button>
          </form>
        </div>
      </section>
    </>
  );
}
