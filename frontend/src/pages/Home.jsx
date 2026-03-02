import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Categories from '../components/Categories';
import FeaturedEquipment from '../components/FeaturedEquipment';
import api from '../services/api';

const Home = () => {
  const [q, setQ] = useState('');
  const [stats, setStats] = useState(null);
  const [popular, setPopular] = useState([]);
  const navigate = useNavigate();

  const onHeroSearch = (e) => {
    e.preventDefault();
    if (!q.trim()) return;
    navigate(`/search?q=${encodeURIComponent(q.trim())}`);
  };

  React.useEffect(() => {
    let cancelled = false;

    const load = async () => {
      try {
        const [statsRes, categoriesRes] = await Promise.all([
          api.get('/api/stats/home'),
          api.get('/api/categories')
        ]);
        if (!cancelled) {
          setStats(statsRes.data?.data || null);
          const categories = Array.isArray(categoriesRes.data) ? categoriesRes.data : [];
          setPopular(categories.slice(0, 3).map((c) => String(c?.name || '')).filter(Boolean));
        }
      } catch {
        if (!cancelled) {
          setStats(null);
          setPopular([]);
        }
      }
    };

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  const formatStat = (value) => {
    if (value === null || value === undefined) return '—';
    const n = Number(value);
    if (Number.isNaN(n)) return '—';
    return n.toLocaleString();
  };

  return (
    <div className="home-page">
      <section className="home-hero">
        <div className="home-hero-overlay" />
        <div className="home-hero-container">
          <div className="home-hero-content">
            <h1 className="home-hero-title">
              Rent Premium
              <span className="home-hero-accent"> Sports Gear</span>
              <br />
              Near You
            </h1>
            <p className="home-hero-subtitle">
              Access top-quality equipment for any sport without the commitment of buying. From cricket bats to mountain bikes —
              rent it all on Kwick.
            </p>

            <form className="home-hero-search" onSubmit={onHeroSearch}>
              <div className="home-hero-search-icon">⌕</div>
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                type="text"
                placeholder="Search for equipment..."
                aria-label="Search for equipment"
              />
              <button type="submit">Search</button>
            </form>

            <div className="home-hero-popular">
              <span className="home-hero-popular-label">Popular:</span>
              {popular.map((name) => (
                <button
                  key={name}
                  type="button"
                  className="home-chip"
                  onClick={() => navigate(`/search?q=${encodeURIComponent(name)}`)}
                >
                  {name}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="home-stats">
        <div className="home-stats-container">
          <div className="home-stat">
            <div className="home-stat-value">{formatStat(stats?.activeListings)}</div>
            <div className="home-stat-label">Active Listings</div>
          </div>
          <div className="home-stat">
            <div className="home-stat-value">{formatStat(stats?.happyRenters)}</div>
            <div className="home-stat-label">Happy Renters</div>
          </div>
          <div className="home-stat">
            <div className="home-stat-value">{formatStat(stats?.citiesCovered)}</div>
            <div className="home-stat-label">Cities Covered</div>
          </div>
          <div className="home-stat">
            <div className="home-stat-value">{formatStat(stats?.equipmentOwners)}</div>
            <div className="home-stat-label">Equipment Owners</div>
          </div>
        </div>
      </section>

      <section className="home-section">
        <Categories />
      </section>

      <section className="home-section home-section-muted">
        <FeaturedEquipment />
      </section>

      <section className="home-section">
        <div className="home-section-container">
          <div className="home-section-header center">
            <h2>How Kwick Works</h2>
            <p>Three simple steps to get playing</p>
          </div>

          <div className="home-steps">
            <div className="home-step">
              <div className="home-step-icon">⌕</div>
              <h3>Find Your Gear</h3>
              <p>Browse thousands of listings or search for the exact equipment you need.</p>
            </div>
            <div className="home-step">
              <div className="home-step-icon">⏱</div>
              <h3>Book &amp; Pay</h3>
              <p>Select your rental dates, chat with the owner, and confirm your booking securely.</p>
            </div>
            <div className="home-step">
              <div className="home-step-icon">★</div>
              <h3>Play &amp; Return</h3>
              <p>Pick up or get it delivered, enjoy your sport, and return when you’re done.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="home-cta">
        <div className="home-cta-container">
          <div className="home-cta-shield">🛡</div>
          <h2>Rent with Confidence</h2>
          <p>Every booking is protected. Verified owners, secure payments, and quality-checked equipment.</p>
          <div className="home-cta-actions">
            <button className="btn-primary" onClick={() => navigate('/equipment')}>Start Browsing</button>
            <button className="btn-secondary" onClick={() => navigate('/register')}>List Your Equipment</button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;