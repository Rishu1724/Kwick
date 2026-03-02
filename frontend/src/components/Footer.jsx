import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-section">
          <h3>Kwick</h3>
          <p>Rent premium sports gear from trusted local owners.</p>
        </div>
        
        <div className="footer-section">
          <h4>For Renters</h4>
          <ul>
            <li><Link to="/equipment">Browse Equipment</Link></li>
            <li><Link to="/renter/dashboard">My Rentals</Link></li>
            <li><Link to="/login">Sign In</Link></li>
          </ul>
        </div>
        
        <div className="footer-section">
          <h4>For Owners</h4>
          <ul>
            <li><Link to="/owner/dashboard">Owner Dashboard</Link></li>
            <li><Link to="/register">List Equipment</Link></li>
            <li><Link to="/contact">Support</Link></li>
          </ul>
        </div>

        <div className="footer-section">
          <h4>Company</h4>
          <ul>
            <li><Link to="/about">About</Link></li>
            <li><Link to="/contact">Contact</Link></li>
          </ul>
        </div>
      </div>
      
      <div className="footer-bottom">
        <p>&copy; 2026 Kwick. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;