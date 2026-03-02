import React from 'react';
import { Link } from 'react-router-dom';
import FavoriteToggle from './FavoriteToggle';
import './EquipmentCard.css';

const EquipmentCard = ({ equipment, showFeaturedTag = false }) => {
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
    <Link to={`/equipment/${equipment._id}`} className="equipment-card-link">
      <div className="equipment-card-enhanced">
        <div className="equipment-image-container-enhanced">
          <img 
            src={equipment.images?.[0] || 'https://via.placeholder.com/300'} 
            alt={equipment.title} 
          />
          {showFeaturedTag ? <div className="featured-pill">Featured</div> : null}
          <FavoriteToggle 
            productId={equipment._id} 
            isFavorited={false} 
            onToggle={handleFavoriteToggle} 
            variant="heart"
          />
        </div>
        <div className="equipment-info-enhanced">
          <h3 className="equipment-title-enhanced">
            {equipment.title}
          </h3>
          <div className="equipment-subrow">
            <span className="equipment-rating">★ {equipment.averageRating > 0 ? equipment.averageRating.toFixed(1) : 'New'}</span>
            <span className="equipment-dot">•</span>
            <span className="equipment-location">{equipment.location?.city ? `${equipment.location.city}${equipment.location?.state ? `, ${equipment.location.state}` : ''}` : 'Location not specified'}</span>
          </div>

          <div className="equipment-price-row">
            <div className="equipment-price">
              ₹{dailyRate}<span className="equipment-price-unit">/day</span>
            </div>
            <div className="equipment-price-secondary">₹{weeklyRate}/week</div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default EquipmentCard;