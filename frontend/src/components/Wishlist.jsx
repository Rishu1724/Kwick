import React, { useState, useEffect } from 'react';
import api from '../services/api';
import EquipmentCard from './EquipmentCard';
import './Wishlist.css';

const Wishlist = () => {
  const [wishlistItems, setWishlistItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchWishlist = async () => {
      try {
        const response = await api.get('/api/favorites');
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
      await api.delete(`/api/favorites/${equipmentId}`);
      setWishlistItems(wishlistItems.filter(item => item.productId._id !== equipmentId));
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
            <div key={item.productId._id} className="wishlist-item">
              <EquipmentCard equipment={item.productId} />
              <button 
                className="remove-wishlist" 
                onClick={() => removeFromWishlist(item.productId._id)}
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