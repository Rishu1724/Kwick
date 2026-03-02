import React, { useMemo, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

const BookingCalendar = ({ equipmentId, ownerId, hourlyRate, dailyRate, variant = 'default' }) => {
  const { user } = useAuth();
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [bookingType, setBookingType] = useState('daily');
  const [totalCost, setTotalCost] = useState(0);
  const [showPayment, setShowPayment] = useState(false);

  const isCompact = useMemo(() => variant === 'compact', [variant]);

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
    
    if (!startDate || !endDate) {
      alert('Please select both start and end dates');
      return;
    }
    
    // Show payment options
    setShowPayment(true);
  };

  const confirmBooking = async () => {
    if (!user) {
      alert('Please login to complete booking');
      window.location.href = '/login';
      return;
    }
    
    try {
      // Create booking
      const bookingData = {
        equipmentId,
        startDate,
        endDate,
        bookingType,
        totalAmount: totalCost,
        securityDeposit: 0 // Will be calculated based on equipment
      };
      
      const bookingResponse = await api.post('/api/bookings', bookingData);
      
      // Create payment intent
      const paymentData = {
        bookingId: bookingResponse.data.data._id,
        amount: totalCost,
        paymentMethod: document.querySelector('input[name="payment"]:checked')?.value || 'upi'
      };
      
      const paymentResponse = await api.post('/api/payments/create-intent', paymentData);
      
      // For demo purposes, we'll simulate payment confirmation
      // In a real app, this would redirect to payment gateway
      alert(`Booking confirmed! Total paid: ₹${totalCost.toFixed(2)}

Your booking ID: ${bookingResponse.data.data._id}

Payment ID: ${paymentResponse.data.data?.paymentId || 'N/A'}`);
      
      // Reset form
      setStartDate('');
      setEndDate('');
      setTotalCost(0);
      setShowPayment(false);
    } catch (error) {
      console.error('Booking error:', error);
      alert('Failed to create booking. Please try again.');
    }
  };

  return (
    <div className="booking-calendar">
      {isCompact ? null : <h3>Booking Information</h3>}
      
      <div className="booking-form">
        {isCompact ? null : (
          <div className="form-group">
            <label>Booking Type:</label>
            <select value={bookingType} onChange={handleBookingTypeChange}>
              <option value="hourly">Hourly (₹{hourlyRate}/hr)</option>
              <option value="daily">Daily (₹{dailyRate}/day)</option>
              <option value="weekly">Weekly (₹{dailyRate * 6}/week)</option>
            </select>
          </div>
        )}
        
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
            <h4>Total Cost: ₹{totalCost.toFixed(2)}</h4>
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
        
        {showPayment && (
          <div className="payment-options">
            <h4>Select Payment Method</h4>
            <div className="payment-methods">
              <div className="payment-method">
                <input 
                  type="radio" 
                  id="upi" 
                  name="payment" 
                  value="upi"
                  defaultChecked
                />
                <label htmlFor="upi">💳 UPI (Paytm, PhonePe, Google Pay)</label>
              </div>
              <div className="payment-method">
                <input 
                  type="radio" 
                  id="netbanking" 
                  name="payment" 
                  value="netbanking"
                />
                <label htmlFor="netbanking">🏦 Net Banking</label>
              </div>
              <div className="payment-method">
                <input 
                  type="radio" 
                  id="card" 
                  name="payment" 
                  value="card"
                />
                <label htmlFor="card">💳 Credit/Debit Card</label>
              </div>
              <div className="payment-method">
                <input 
                  type="radio" 
                  id="cod" 
                  name="payment" 
                  value="cod"
                />
                <label htmlFor="cod">💵 Cash on Delivery</label>
              </div>
            </div>
            
            <div className="payment-actions">
              <button 
                className="btn-secondary" 
                onClick={() => setShowPayment(false)}
              >
                Back
              </button>
              <button 
                className="btn-primary" 
                onClick={confirmBooking}
              >
                Confirm Payment (₹{totalCost.toFixed(2)})
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookingCalendar;