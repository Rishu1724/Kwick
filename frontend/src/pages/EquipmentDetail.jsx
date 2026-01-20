import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import api from '../services/api';
import ContactOwner from '../components/ContactOwner';
import ReportEquipment from '../components/ReportEquipment';
import ReviewList from '../components/Reviews/ReviewList';
import BookingCalendar from '../components/BookingCalendar';
import SocialShare from '../components/SocialShare';

const EquipmentDetail = () => {
  const { id } = useParams();
  const [equipment, setEquipment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchEquipment = async () => {
      try {
        // Use products API but transform to equipment format
        const response = await api.get(`/api/products/${id}`);
        // Transform product data to equipment format
        const equipmentData = {
          ...response.data,
          dailyRate: response.data.price,
          hourlyRate: Math.round(response.data.price / 8),
          weeklyRate: response.data.price * 6,
          availability: 'available',
          ownerId: response.data.sellerId
        };
        setEquipment(equipmentData);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch equipment details');
        setLoading(false);
      }
    };

    fetchEquipment();
  }, [id]);

  if (loading) return <div className="loading">Loading equipment details...</div>;
  if (error) return <div className="error">{error}</div>;
  if (!equipment) return <div>Equipment not found</div>;

  // Calculate rates
  const dailyRate = equipment.dailyRate || equipment.price;
  const hourlyRate = equipment.hourlyRate || Math.round(dailyRate / 8);
  const weeklyRate = equipment.weeklyRate || dailyRate * 6;

  return (
    <div className="equipment-detail">
      <div className="equipment-gallery">
        {equipment.images && equipment.images.map((image, index) => (
          <img 
            key={index} 
            src={image} 
            alt={`${equipment.title} ${index + 1}`} 
            className={index === 0 ? 'main-image' : 'thumbnail'}
          />
        ))}
      </div>
      
      <div className="equipment-info">
        <div className="info-header">
          <h1>{equipment.title}</h1>
          <div className="pricing-display">
            <div className="rates">
              <div className="rate-option">
                <span className="rate-amount">₹{hourlyRate}</span>
                <span className="rate-period">per hour</span>
              </div>
              <div className="rate-option">
                <span className="rate-amount">₹{dailyRate}</span>
                <span className="rate-period">per day</span>
              </div>
              <div className="rate-option">
                <span className="rate-amount">₹{weeklyRate}</span>
                <span className="rate-period">per week</span>
              </div>
            </div>
          </div>
        </div>

        <p className="description">{equipment.description}</p>
        
        <div className="equipment-specs">
          <div className="spec-group">
            <h3>Details</h3>
            <div className="specs">
              <div className="spec-item">
                <span className="label">Sport:</span>
                <span className="value">{equipment.category}</span>
              </div>
              <div className="spec-item">
                <span className="label">Condition:</span>
                <span className="value condition-value">{equipment.condition}</span>
              </div>
              <div className="spec-item">
                <span className="label">Owner:</span>
                <span className="value">{equipment.ownerId?.name || 'Unknown'}</span>
              </div>
              <div className="spec-item">
                <span className="label">Location:</span>
                <span className="value">{equipment.location?.city || 'Not specified'}</span>
              </div>
              <div className="spec-item">
                <span className="label">Availability:</span>
                <span className={`value availability-${equipment.availability}`}>
                  {equipment.availability === 'available' ? '✅ Available' : '❌ Currently Rented'}
                </span>
              </div>
              {equipment.averageRating > 0 && (
                <div className="spec-item">
                  <span className="label">Rating:</span>
                  <span className="value">
                    ⭐ {equipment.averageRating.toFixed(1)}/5.0
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="booking-section">
          <h3>Book This Equipment</h3>
          <BookingCalendar 
            equipmentId={equipment._id} 
            ownerId={equipment.ownerId?._id}
            hourlyRate={hourlyRate}
            dailyRate={dailyRate}
          />
        </div>

        <div className="equipment-actions">
          <ContactOwner 
            ownerId={equipment.ownerId?._id} 
            equipmentId={equipment._id} 
          />
          <ReportEquipment equipmentId={equipment._id} />
        </div>
      </div>
      
      <div className="equipment-reviews">
        <ReviewList 
          equipmentId={equipment._id} 
          ownerId={equipment.ownerId?._id} 
        />
      </div>
      
      <div className="equipment-share">
        <SocialShare 
          url={window.location.href} 
          title={equipment.title} 
        />
      </div>
    </div>
  );
};

export default EquipmentDetail;