import React from 'react';
import { Link } from 'react-router-dom';
import FavoriteToggle from './FavoriteToggle';

const EquipmentCard = ({ equipment }) => {
  // For now, we'll assume the equipment is not favorited
  // In a real app, you would check if the equipment is in the user's favorites
  const handleFavoriteToggle = (isFavorited) => {
    // Handle favorite toggle
    console.log(`Equipment ${equipment._id} is now ${isFavorited ? 'favorited' : 'unfavorited'}`);
  };

  // Calculate rental rates for display
  const dailyRate = equipment.dailyRate || equipment.price;
  const hourlyRate = equipment.hourlyRate || Math.round(dailyRate / 8);
  const weeklyRate = equipment.weeklyRate || dailyRate * 6;

  return (
    <div className="equipment-card-enhanced">
      <div className="equipment-image-container-enhanced">
        <img 
          src={equipment.images?.[0] || 'https://via.placeholder.com/300'} 
          alt={equipment.title} 
        />
        <FavoriteToggle 
          productId={equipment._id} 
          isFavorited={false} 
          onToggle={handleFavoriteToggle} 
        />
        <div className="rental-badge">
          {equipment.availability === 'available' ? 'Available' : 'Rented'}
        </div>
      </div>
      <div className="equipment-info-enhanced">
        <h3 className="equipment-title-enhanced">
          <Link to={`/equipment/${equipment._id}`}>{equipment.title}</Link>
        </h3>
        <p className="sport-category">{equipment.category}</p>
        <div className="pricing-info">
          <div className="rate">
            <span className="amount">${hourlyRate}</span>
            <span className="period">/hour</span>
          </div>
          <div className="rate">
            <span className="amount">${dailyRate}</span>
            <span className="period">/day</span>
          </div>
        </div>
        <p className="location-enhanced">
          <i className="location-icon">📍</i>
          {equipment.location?.city || 'Location not specified'}
        </p>
        <div className="equipment-meta">
          <span className="condition-badge">{equipment.condition}</span>
          <span className="rating">
            ⭐ {equipment.averageRating > 0 ? equipment.averageRating.toFixed(1) : 'New'}
          </span>
        </div>
      </div>
    </div>
  );
};

export default EquipmentCard;