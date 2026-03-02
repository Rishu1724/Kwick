import React, { useState, useEffect } from 'react';
import api from '../services/api';
import EquipmentCard from './EquipmentCard';
import { Link } from 'react-router-dom';

const FeaturedEquipment = () => {
  const [equipment, setEquipment] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchFeaturedEquipment = async () => {
      try {
        setLoading(true);
        const response = await api.get('/api/equipment/featured');
        const equipmentData = response.data.data || [];
        setEquipment(equipmentData);
        setLoading(false);
      } catch (err) {
        setError('Failed to load featured equipment');
        setLoading(false);
      }
    };

    fetchFeaturedEquipment();
  }, []);

  if (loading) return <div className="loading">Loading featured equipment...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="home-section-container">
      <div className="home-section-header">
        <div>
          <h2>Featured Equipment</h2>
          <p>Hand-picked premium gear from top-rated owners</p>
        </div>
        <Link className="home-view-all" to="/equipment">
          View All →
        </Link>
      </div>
      
      {equipment.length === 0 ? (
        <p className="no-featured">No featured equipment available at the moment.</p>
      ) : (
        <div className="equipment-grid">
          {equipment.slice(0, 6).map((item) => (
            <EquipmentCard key={item._id} equipment={item} showFeaturedTag={true} />
          ))}
        </div>
      )}
    </div>
  );
};

export default FeaturedEquipment;