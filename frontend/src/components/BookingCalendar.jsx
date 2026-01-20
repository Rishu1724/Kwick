import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

const BookingCalendar = ({ equipmentId, ownerId, hourlyRate, dailyRate }) => {
  const { user } = useAuth();
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [bookingType, setBookingType] = useState('daily');
  const [totalCost, setTotalCost] = useState(0);

  const calculateCost = () => {
    if (!startDate || !endDate) return 0;
    
    const start = new Date(startDate);
    const end = new Date(endDate);
    const days = Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;
    
    switch (bookingType) {
      case 'hourly':
        return days * 8 * hourlyRate; // Assuming 8 hours per day
      case 'daily':
        return days * dailyRate;
      case 'weekly':
        return Math.ceil(days / 7) * (dailyRate * 6); // Weekly rate
      default:
        return days * dailyRate;
    }
  };

  const handleStartDateChange = (e) => {
    setStartDate(e.target.value);
    const cost = calculateCost();
    setTotalCost(cost);
  };

  const handleEndDateChange = (e) => {
    setEndDate(e.target.value);
    const cost = calculateCost();
    setTotalCost(cost);
  };

  const handleBookingTypeChange = (e) => {
    setBookingType(e.target.value);
    const cost = calculateCost();
    setTotalCost(cost);
  };

  const handleBookNow = () => {
    if (!user) {
      alert('Please login to book equipment');
      window.location.href = '/login';
      return;
    }
    
    if (!startDate || !endDate) {
      alert('Please select both start and end dates');
      return;
    }
    
    // In a real app, this would make an API call to create the booking
    alert(`Booking confirmed! Total cost: $${totalCost}`);
  };

  return (
    <div className="booking-calendar">
      <h3>Booking Information</h3>
      
      <div className="booking-form">
        <div className="form-group">
          <label>Booking Type:</label>
          <select value={bookingType} onChange={handleBookingTypeChange}>
            <option value="hourly">Hourly (${hourlyRate}/hr)</option>
            <option value="daily">Daily (${dailyRate}/day)</option>
            <option value="weekly">Weekly (${dailyRate * 6}/week)</option>
          </select>
        </div>
        
        <div className="date-selection">
          <div className="form-group">
            <label>Start Date:</label>
            <input
              type="date"
              value={startDate}
              onChange={handleStartDateChange}
              min={new Date().toISOString().split('T')[0]}
            />
          </div>
          
          <div className="form-group">
            <label>End Date:</label>
            <input
              type="date"
              value={endDate}
              onChange={handleEndDateChange}
              min={startDate || new Date().toISOString().split('T')[0]}
            />
          </div>
        </div>
        
        {totalCost > 0 && (
          <div className="cost-summary">
            <h4>Total Cost: ${totalCost.toFixed(2)}</h4>
            <p>Includes taxes and fees</p>
          </div>
        )}
        
        <button 
          className="btn-primary book-now-btn"
          onClick={handleBookNow}
          disabled={!startDate || !endDate}
        >
          Book Now
        </button>
      </div>
    </div>
  );
};

export default BookingCalendar;