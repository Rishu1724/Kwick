import React, { useState, useEffect } from 'react';
import api from '../services/api';
import EquipmentCard from './EquipmentCard';

const Wishlist = () => {
  const [wishlistItems, setWishlistItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchWishlist = async () => {
      try {
        const response = await api.get('/api/wishlist');
        setWishlistItems(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch wishlist');
        setLoading(false);
      }
    };

    fetchWishlist();
  }, []);

  const removeFromWishlist = async (equipmentId) => {
    try {
      await api.delete(`/api/wishlist/${equipmentId}`);
      setWishlistItems(wishlistItems.filter(item => item.equipmentId._id !== equipmentId));
    } catch (err) {
      setError('Failed to remove from wishlist');
    }
  };

  if (loading) return <p>Loading wishlist...</p>;
  if (error) return <p className="error">{error}</p>;

  return (
    <div className="wishlist">
      <h2>My Wishlist</h2>
      {wishlistItems.length === 0 ? (
        <p>You haven't added any equipment to your wishlist yet.</p>
      ) : (
        <div className="equipment-grid">
          {wishlistItems.map((item) => (
            <div key={item.equipmentId._id} className="wishlist-item">
              <EquipmentCard equipment={item.equipmentId} />
              <button 
                className="remove-wishlist" 
                onClick={() => removeFromWishlist(item.equipmentId._id)}
              >
                Remove from Wishlist
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Wishlist;