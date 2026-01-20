import React, { useState, useEffect } from 'react';
import api from '../services/api';
import EquipmentCard from './EquipmentCard';

const FeaturedEquipment = () => {
  const [equipment, setEquipment] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchFeaturedEquipment = async () => {
      try {
        setLoading(true);
        const response = await api.get('/api/equipment?featured=true&pageNumber=1');
        setEquipment(response.data.equipment || []);
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
    <div className="featured-equipment">
      <div className="section-header">
        <h2>Featured Equipment</h2>
        <p>Premium gear handpicked for quality and performance</p>
      </div>
      
      {equipment.length === 0 ? (
        <p className="no-featured">No featured equipment available at the moment.</p>
      ) : (
        <div className="equipment-grid">
          {equipment.slice(0, 6).map((item) => (
            <EquipmentCard key={item._id} equipment={item} />
          ))}
        </div>
      )}
      
      <div className="browse-all">
        <button className="btn-primary">Browse All Equipment</button>
      </div>
    </div>
  );
};

export default FeaturedEquipment;