import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import SearchBar from './SearchBar';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <nav className="navbar">
      <div className="nav-brand">
        <Link to="/">Kwick</Link>
      </div>
      
      <button className="menu-toggle" onClick={toggleMenu}>
        ☰
      </button>
      
      <SearchBar />
      
      <div className={`nav-links ${menuOpen ? 'active' : ''}`}>
        <Link to="/" onClick={() => setMenuOpen(false)}>Home</Link>
        {user ? (
          <>
            {user.role === 'seller' || user.role === 'both' ? (
              <Link to="/seller/dashboard" onClick={() => setMenuOpen(false)}>Seller Dashboard</Link>
            ) : (
              <Link to="/buyer/dashboard" onClick={() => setMenuOpen(false)}>Buyer Dashboard</Link>
            )}
            {/* Admin link - in a real app, you would check for admin role */}
            {user.role === 'admin' && (
              <Link to="/admin" onClick={() => setMenuOpen(false)}>Admin</Link>
            )}
            <button onClick={() => { handleLogout(); setMenuOpen(false); }}>Logout</button>
          </>
        ) : (
          <>
            <Link to="/login" onClick={() => setMenuOpen(false)}>Login</Link>
            <Link to="/register" onClick={() => setMenuOpen(false)}>Register</Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;