import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

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
          ☰
        </button>
      </div>

      <div className={`nav-links ${menuOpen ? 'active' : ''}`}>
        <NavLink to="/" onClick={() => setMenuOpen(false)}>Home</NavLink>
        <NavLink to="/equipment" onClick={() => setMenuOpen(false)}>Browse Equipment</NavLink>
        <NavLink to="/equipment" onClick={() => setMenuOpen(false)}>Categories</NavLink>
      </div>

      <div className="nav-actions">
        <Link className="nav-icon-btn" to="/equipment" aria-label="Search" onClick={() => setMenuOpen(false)}>⌕</Link>
        <Link className="nav-icon-btn" to={user ? '/renter/dashboard' : '/login'} aria-label="Favorites" onClick={() => setMenuOpen(false)}>♡</Link>
        <Link className="nav-icon-btn" to={user ? '/renter/dashboard' : '/login'} aria-label="Messages" onClick={() => setMenuOpen(false)}>💬</Link>

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