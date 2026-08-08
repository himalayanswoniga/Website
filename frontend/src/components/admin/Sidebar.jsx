import { NavLink } from 'react-router-dom';

const LINKS = [
  { to: '/admin', label: 'Dashboard', icon: '📊', end: true },
  { to: '/admin/products', label: 'Products', icon: '🧄' },
  { to: '/admin/categories', label: 'Categories', icon: '🗂️' },
  { to: '/admin/gallery', label: 'Gallery', icon: '🖼️' },
  { to: '/admin/blogs', label: 'Blog', icon: '📝' },
  { to: '/admin/team', label: 'Team', icon: '🤝' },
  { to: '/admin/testimonials', label: 'Testimonials', icon: '💬' },
  { to: '/admin/homepage', label: 'Homepage', icon: '🏠' },
  { to: '/admin/contact-info', label: 'Contact Info', icon: '📇' },
  { to: '/admin/messages', label: 'Messages', icon: '✉️' },
];

export default function Sidebar({ open, onClose }) {
  return (
    <>
      {open && <div className="fixed inset-0 z-40 bg-charcoal/50 lg:hidden" onClick={onClose} />}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 transform bg-forest text-cream transition-transform lg:translate-x-0 ${open ? 'translate-x-0' : '-translate-x-full'}`}
      >
        <div className="flex items-center gap-3 px-6 py-5 border-b border-white/10">
          <img src="/legacy/logo.png" alt="" className="h-10 w-10 rounded-full object-cover" />
          <span className="font-serif text-lg">HSH Admin</span>
        </div>
        <nav className="flex flex-col gap-1 p-3">
          {LINKS.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.end}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded px-3 py-2.5 text-sm transition ${isActive ? 'bg-white/10 text-gold-light font-semibold' : 'text-cream/80 hover:bg-white/5'}`
              }
            >
              <span aria-hidden="true">{link.icon}</span>
              {link.label}
            </NavLink>
          ))}
        </nav>
      </aside>
    </>
  );
}
