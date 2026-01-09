import React, { useState } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

const FavoriteToggle = ({ productId, isFavorited, onToggle }) => {
  const [favorited, setFavorited] = useState(isFavorited);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  const handleToggle = async () => {
    // If user is not logged in, redirect to login page
    if (!user) {
      window.location.href = '/login';
      return;
    }

    setLoading(true);
    try {
      if (favorited) {
        // Remove from favorites
        await api.delete(`/api/favorites/${productId}`);
      } else {
        // Add to favorites
        await api.post('/api/favorites', { productId });
      }
      
      setFavorited(!favorited);
      onToggle(!favorited);
    } catch (err) {
      console.error('Failed to toggle favorite:', err);
    }
    setLoading(false);
  };

  return (
    <button 
      className={`favorite-toggle ${favorited ? 'favorited' : ''}`}
      onClick={handleToggle}
      disabled={loading}
    >
      {favorited ? '★' : '☆'}
    </button>
  );
};

export default FavoriteToggle;