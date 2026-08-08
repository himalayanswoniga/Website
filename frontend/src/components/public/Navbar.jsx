import { useEffect, useState } from 'react';
import { Link, NavLink } from 'react-router-dom';

const NAV_LINKS = [
  { to: '/about', label: 'Our Story' },
  { to: '/products', label: 'Products' },
  { to: '/gallery', label: 'Gallery' },
  { to: '/blog', label: 'Blog' },
  { to: '/team', label: 'Team' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileOpen]);

  return (
    <>
      <nav className={`navbar${scrolled ? ' scrolled' : ''}`}>
        <Link to="/" className="navbar-logo">
          <img src="/legacy/logo.png" alt="Himalayan Swoniga Harvest" />
        </Link>
        <ul className="navbar-nav">
          {NAV_LINKS.map((link) => (
            <li key={link.to}>
              <NavLink to={link.to} className={({ isActive }) => (isActive ? 'active' : undefined)}>
                {link.label}
              </NavLink>
            </li>
          ))}
          <li>
            <Link to="/contact" className="nav-btn">Order Now</Link>
          </li>
        </ul>
        <button type="button" className="hamburger" aria-label="Open menu" onClick={() => setMobileOpen(true)}>
          <span /><span /><span />
        </button>
      </nav>

      <div className={`mobile-menu${mobileOpen ? ' open' : ''}`} id="mobileMenu">
        <button type="button" className="mobile-close" aria-label="Close menu" onClick={() => setMobileOpen(false)}>✕</button>
        {NAV_LINKS.map((link) => (
          <Link key={link.to} to={link.to} onClick={() => setMobileOpen(false)}>{link.label}</Link>
        ))}
        <Link to="/contact" className="m-btn" onClick={() => setMobileOpen(false)}>Order Now</Link>
      </div>
    </>
  );
}
