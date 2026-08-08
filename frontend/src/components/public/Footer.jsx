import { Link } from 'react-router-dom';
import { useFetch } from '../../hooks/useFetch';
import { settingsService } from '../../services/settingsService';

export default function Footer() {
  const { data: settings } = useFetch(() => settingsService.get(), []);
  const contact = settings?.contactInfo;
  const year = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer-top">
        <div className="footer-brand">
          <img src="/legacy/logo.png" alt="Himalayan Swoniga Harvest" />
          <p>Pure Himalayan spice powders — sun-dried, machine-dried, and fine-milled with zero additives. Est. {settings?.about?.establishedYear || '2026'}, Kathmandu, Nepal.</p>
        </div>
        <div className="footer-col">
          <h4>Explore</h4>
          <ul>
            <li><Link to="/products">Products</Link></li>
            <li><Link to="/gallery">Gallery</Link></li>
            <li><Link to="/blog">Blog</Link></li>
            <li><Link to="/team">Team</Link></li>
          </ul>
        </div>
        <div className="footer-col">
          <h4>Company</h4>
          <ul>
            <li><Link to="/about">Our Story</Link></li>
            <li><Link to="/contact">Get in Touch</Link></li>
          </ul>
        </div>
        <div className="footer-col">
          <h4>Contact</h4>
          <ul>
            {contact?.email && <li><a href={`mailto:${contact.email}`}>{contact.email}</a></li>}
            {contact?.phone && <li><a href={`tel:${contact.phone}`}>{contact.phone}</a></li>}
            {contact?.socialLinks?.facebook && <li><a href={contact.socialLinks.facebook} target="_blank" rel="noreferrer">Facebook</a></li>}
            {contact?.socialLinks?.instagram && <li><a href={contact.socialLinks.instagram} target="_blank" rel="noreferrer">Instagram</a></li>}
          </ul>
        </div>
      </div>
      <div className="footer-bottom">
        <p>© {year} Himalayan Swoniga Harvest · Kathmandu, Nepal · All rights reserved.</p>
        <p>Pure · Natural · Himalayan</p>
      </div>
    </footer>
  );
}
