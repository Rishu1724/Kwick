import React, { useState, useEffect } from 'react';
import api from '../services/api';
import EquipmentCard from './EquipmentCard';

const RecentEquipment = () => {
  const [equipment, setEquipment] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchRecentEquipment = async () => {
      try {
        setLoading(true);
        // Fetch latest equipment sorted by creation date
        const response = await api.get('/api/equipment?sort=-createdAt&limit=6');
        setEquipment(response.data.data || []);
        setLoading(false);
      } catch (err) {
        setError('Failed to load recent equipment');
        setLoading(false);
      }
    };

    fetchRecentEquipment();
  }, []);

  if (loading) return <div className="loading">Loading recent equipment...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="recent-equipment">
      <div className="section-header">
        <h2>Recently Added</h2>
        <p>Check out the newest equipment added to our platform</p>
      </div>
      
      {equipment.length === 0 ? (
        <p className="no-equipment">No recent equipment available at the moment.</p>
      ) : (
        <div className="equipment-grid">
          {equipment.map((item) => (
            <EquipmentCard key={item._id} equipment={item} />
          ))}
        </div>
      )}
    </div>
  );
};

export default RecentEquipment;