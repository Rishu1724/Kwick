import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const IconSearch = (props) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false" {...props}>
    <circle cx="11" cy="11" r="7" />
    <path d="M21 21l-4.3-4.3" />
  </svg>
);

const IconHeart = (props) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false" {...props}>
    <path d="M20.8 4.6c-1.6-1.6-4.3-1.6-5.9 0L12 7.5 9.1 4.6c-1.6-1.6-4.3-1.6-5.9 0s-1.6 4.3 0 5.9L12 19.3l8.8-8.8c1.6-1.6 1.6-4.3 0-5.9z" />
  </svg>
);

const IconChat = (props) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false" {...props}>
    <path d="M21 15a4 4 0 0 1-4 4H8l-5 3V7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4z" />
  </svg>
);

const IconMenu = (props) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false" {...props}>
    <path d="M4 6h16" />
    <path d="M4 12h16" />
    <path d="M4 18h16" />
  </svg>
);

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const getMessagesLink = () => {
    if (!user) return '/login';
    if (user.role === 'admin') return '/admin';
    if (user.role === 'owner') return '/owner/dashboard?tab=messages';
    if (user.role === 'both') return '/owner/dashboard?tab=messages';
    return '/renter/dashboard?tab=messages';
  };

  const getRoleBadge = () => {
    const role = user?.role;
    if (!role) return null;
    if (role === 'admin') return { label: 'Admin', className: 'admin' };
    if (role === 'both') return { label: 'Owner • Renter', className: 'both' };
    if (role === 'owner') return { label: 'Owner', className: 'owner' };
    return { label: 'Renter', className: 'renter' };
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <nav className="navbar">
      <div className="nav-left">
        <div className="nav-brand">
          <Link to="/" className="nav-brand-link" onClick={() => setMenuOpen(false)}>
            <span className="nav-brand-mark">K</span>
            <span className="nav-brand-name">Kwick</span>
          </Link>
        </div>

        <button className="menu-toggle" onClick={toggleMenu} aria-label="Toggle menu">
          <IconMenu className="nav-icon" />
        </button>
      </div>

      <div className={`nav-links ${menuOpen ? 'active' : ''}`}>
        <NavLink to="/" onClick={() => setMenuOpen(false)}>Home</NavLink>
        <NavLink to="/equipment" onClick={() => setMenuOpen(false)}>Browse Equipment</NavLink>
        <NavLink to="/equipment" onClick={() => setMenuOpen(false)}>Categories</NavLink>
      </div>

      <div className="nav-actions">
        <Link className="nav-icon-btn" to="/equipment" aria-label="Search" onClick={() => setMenuOpen(false)}>
          <IconSearch className="nav-icon" />
        </Link>
        <Link className="nav-icon-btn" to={user ? '/renter/dashboard' : '/login'} aria-label="Favorites" onClick={() => setMenuOpen(false)}>
          <IconHeart className="nav-icon" />
        </Link>
        <Link className="nav-icon-btn" to={getMessagesLink()} aria-label="Messages" onClick={() => setMenuOpen(false)}>
          <IconChat className="nav-icon" />
        </Link>

        {user ? (
          <>
            {(() => {
              const badge = getRoleBadge();
              return badge ? (
                <span className={`nav-role-badge ${badge.className}`.trim()} aria-label={`Logged in as ${badge.label}`}>
                  {badge.label}
                </span>
              ) : null;
            })()}
            {user.role === 'admin' ? (
              <Link className="nav-auth-btn" to="/admin" onClick={() => setMenuOpen(false)}>Admin</Link>
            ) : (
              <Link
                className="nav-auth-btn"
                to={user.role === 'owner' || user.role === 'both' ? '/owner/dashboard' : '/renter/dashboard'}
                onClick={() => setMenuOpen(false)}
              >
                Account
              </Link>
            )}
            <button className="nav-auth-btn" onClick={() => { handleLogout(); setMenuOpen(false); }}>Logout</button>
          </>
        ) : (
          <Link className="nav-auth-btn" to="/login" onClick={() => setMenuOpen(false)}>Sign In</Link>
        )}

        <Link
          className="nav-cta"
          to={user && (user.role === 'owner' || user.role === 'both') ? '/owner/dashboard' : '/register'}
          onClick={() => setMenuOpen(false)}
        >
          List Equipment
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;