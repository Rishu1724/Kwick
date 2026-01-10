import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-section">
          <h3>Kwick</h3>
          <p>Buy and sell items in your community</p>
        </div>
        
        <div className="footer-section">
          <h4>Quick Links</h4>
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/about">About</Link></li>
            <li><Link to="/contact">Contact</Link></li>
          </ul>
        </div>
        
        <div className="footer-section">
          <h4>Categories</h4>
          <ul>
            <li><Link to="/category/electronics">Electronics</Link></li>
            <li><Link to="/category/furniture">Furniture</Link></li>
            <li><Link to="/category/vehicles">Vehicles</Link></li>
          </ul>
        </div>
      </div>
      
      <div className="footer-bottom">
        <p>&copy; 2025 Kwick. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;