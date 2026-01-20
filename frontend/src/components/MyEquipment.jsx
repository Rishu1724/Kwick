import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import EquipmentCard from './EquipmentCard';

const MyEquipment = () => {
  const { user } = useAuth();
  const [equipment, setEquipment] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchMyEquipment = async () => {
      try {
        setLoading(true);
        // Fetch equipment owned by current user
        const response = await api.get(`/api/products?sellerId=${user._id}`);
        // Transform product data to equipment format
        const equipmentData = response.data.products.map(product => ({
          ...product,
          dailyRate: product.price,
          hourlyRate: Math.round(product.price / 8),
          weeklyRate: product.price * 6,
          availability: 'available',
          ownerId: product.sellerId
        }));
        setEquipment(equipmentData);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch your equipment');
        setLoading(false);
      }
    };

    if (user) {
      fetchMyEquipment();
    }
  }, [user]);

  if (loading) return <p>Loading your equipment...</p>;
  if (error) return <p className="error">{error}</p>;

  return (
    <div className="my-equipment">
      <h2>My Equipment Listings ({equipment.length})</h2>
      {equipment.length === 0 ? (
        <div className="no-equipment">
          <p>You haven't listed any equipment yet.</p>
          <p>Click "Add New Equipment" to get started!</p>
        </div>
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

export default MyEquipment;