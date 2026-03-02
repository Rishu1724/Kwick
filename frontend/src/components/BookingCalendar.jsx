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
  const [deliveryOption, setDeliveryOption] = useState('self_pickup');
  const [deliveryAddress, setDeliveryAddress] = useState({
    street: '',
    city: '',
    state: '',
    pincode: '',
    coordinates: null,
  });
  const [locLoading, setLocLoading] = useState(false);

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

  const captureLiveLocation = async () => {
    if (!('geolocation' in navigator)) {
      alert('Geolocation is not supported by this browser');
      return;
    }

    try {
      setLocLoading(true);
      const position = await new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
          timeout: 15000,
          maximumAge: 0,
        });
      });

      const lat = position.coords.latitude;
      const lng = position.coords.longitude;
      setDeliveryAddress((prev) => ({
        ...prev,
        coordinates: { lat, lng },
      }));
    } catch (e) {
      alert('Could not get your location. Please allow location access and try again.');
    } finally {
      setLocLoading(false);
    }
  };

  const confirmBooking = async () => {
    if (!user) {
      alert('Please login to complete booking');
      window.location.href = '/login';
      return;
    }
    
    try {
      // Create booking
      const coords = deliveryAddress.coordinates;
      const bookingData = {
        equipmentId,
        startDate,
        endDate,
        bookingType,
        totalAmount: totalCost,
        securityDeposit: 0, // Will be calculated based on equipment
        deliveryOption,
        deliveryAddress: {
          street: deliveryAddress.street,
          city: deliveryAddress.city,
          state: deliveryAddress.state,
          pincode: deliveryAddress.pincode,
          coordinates: coords ? [coords.lng, coords.lat] : undefined,
        },
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
      alert(`Payment captured. Your booking request has been created and is waiting for owner confirmation.

    Booking ID: ${bookingResponse.data.data._id}
    Payment ID: ${paymentResponse.data.data?.paymentId || 'N/A'}`);
      
      // Reset form
      setStartDate('');
      setEndDate('');
      setTotalCost(0);
      setShowPayment(false);
      setDeliveryOption('self_pickup');
      setDeliveryAddress({ street: '', city: '', state: '', pincode: '', coordinates: null });
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

            <div className="payment-extras">
              <h4>Pickup / Delivery</h4>
              <div className="payment-methods">
                <div className="payment-method">
                  <input
                    type="radio"
                    id="self_pickup"
                    name="delivery"
                    value="self_pickup"
                    checked={deliveryOption === 'self_pickup'}
                    onChange={() => setDeliveryOption('self_pickup')}
                  />
                  <label htmlFor="self_pickup">🚶 Self Pickup</label>
                </div>
                <div className="payment-method">
                  <input
                    type="radio"
                    id="home_delivery"
                    name="delivery"
                    value="home_delivery"
                    checked={deliveryOption === 'home_delivery'}
                    onChange={() => setDeliveryOption('home_delivery')}
                  />
                  <label htmlFor="home_delivery">🚚 Home Delivery</label>
                </div>
              </div>

              {deliveryOption === 'home_delivery' && (
                <div className="delivery-form">
                  <div className="form-group">
                    <label>Street</label>
                    <input
                      type="text"
                      value={deliveryAddress.street}
                      onChange={(e) => setDeliveryAddress((p) => ({ ...p, street: e.target.value }))}
                      placeholder="House no, street"
                    />
                  </div>
                  <div className="form-row">
                    <div className="form-group">
                      <label>City</label>
                      <input
                        type="text"
                        value={deliveryAddress.city}
                        onChange={(e) => setDeliveryAddress((p) => ({ ...p, city: e.target.value }))}
                        placeholder="City"
                      />
                    </div>
                    <div className="form-group">
                      <label>State</label>
                      <input
                        type="text"
                        value={deliveryAddress.state}
                        onChange={(e) => setDeliveryAddress((p) => ({ ...p, state: e.target.value }))}
                        placeholder="State"
                      />
                    </div>
                    <div className="form-group">
                      <label>Pincode</label>
                      <input
                        type="text"
                        value={deliveryAddress.pincode}
                        onChange={(e) => setDeliveryAddress((p) => ({ ...p, pincode: e.target.value }))}
                        placeholder="Pincode"
                      />
                    </div>
                  </div>

                  <div className="delivery-location">
                    <button className="btn-secondary" type="button" onClick={captureLiveLocation} disabled={locLoading}>
                      {locLoading ? 'Getting location…' : 'Use Live Location (GPS)'}
                    </button>
                    {deliveryAddress.coordinates ? (
                      <span className="delivery-location-ok">
                        ✓ GPS captured
                      </span>
                    ) : (
                      <span className="delivery-location-hint">Optional</span>
                    )}
                  </div>
                </div>
              )}
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