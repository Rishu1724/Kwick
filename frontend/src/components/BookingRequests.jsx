import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import './BookingRequests.css';

const BookingRequests = () => {
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [expandedId, setExpandedId] = useState(null);

  const fetchBookingRequests = async () => {
    try {
      setLoading(true);
      setError('');
      // Get bookings where current user is the owner (server-filtered)
      const response = await api.get('/api/bookings', { params: { role: 'owner' } });
      setBookings(response.data.data || []);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch booking requests');
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchBookingRequests();
    }
  }, [user]);

  const handleAcceptRequest = async (bookingId) => {
    try {
      await api.put(`/api/bookings/${bookingId}`, { status: 'confirmed' });
      await fetchBookingRequests();
    } catch (err) {
      console.error('Error accepting booking:', err);
    }
  };

  const handleRejectRequest = async (bookingId) => {
    try {
      // Reject = cancel booking (keep it in DB + release equipment)
      await api.put(`/api/bookings/${bookingId}`, { status: 'cancelled' });
      await fetchBookingRequests();
    } catch (err) {
      console.error('Error rejecting booking:', err);
    }
  };

  if (loading) return <p>Loading booking requests...</p>;
  if (error) return <p className="error">{error}</p>;

  const getMapsLink = (booking) => {
    const coords = booking?.deliveryAddress?.coordinates;
    if (!Array.isArray(coords) || coords.length !== 2) return null;
    const [lng, lat] = coords;
    if (typeof lat !== 'number' || typeof lng !== 'number') return null;
    return `https://www.google.com/maps?q=${lat},${lng}`;
  };

  return (
    <div className="booking-requests">
      <h2>Booking Requests ({bookings.length})</h2>
      {bookings.length === 0 ? (
        <p>No booking requests at this time.</p>
      ) : (
        <div className="bookings-list">
          {bookings.map((booking) => (
            <div key={booking._id} className="booking-request-card">
              <div className="booking-header">
                <h3>{booking.equipmentId?.title}</h3>
                <span className="booking-status" style={{ backgroundColor: booking.status === 'pending' ? '#FF9800' : booking.status === 'confirmed' ? '#4CAF50' : '#f44336' }}>
                  {booking.status}
                </span>
              </div>
              <div className="booking-details">
                <p><strong>Renter:</strong> {booking.renterId?.name || 'Unknown'}</p>
                <p><strong>Dates:</strong> {new Date(booking.startDate).toLocaleDateString()} - {new Date(booking.endDate).toLocaleDateString()}</p>
                <p><strong>Type:</strong> {booking.bookingType}</p>
                <p><strong>Total:</strong> ₹{booking.totalAmount}</p>
                <p><strong>Security Deposit:</strong> ₹{booking.securityDeposit}</p>
                <p><strong>Delivery:</strong> {booking.deliveryOption ? booking.deliveryOption.replace('_', ' ') : 'self pickup'}</p>
                {getMapsLink(booking) && (
                  <p>
                    <strong>Live Location:</strong>{' '}
                    <a href={getMapsLink(booking)} target="_blank" rel="noreferrer">Open in Maps</a>
                  </p>
                )}
              </div>
              <div className="booking-actions">
                {booking.status === 'pending' && (
                  <>
                    <button className="btn-success" onClick={() => handleAcceptRequest(booking._id)}>Confirm</button>
                    <button className="btn-danger" onClick={() => handleRejectRequest(booking._id)}>Reject</button>
                  </>
                )}
                {booking.status === 'confirmed' && (
                  <button className="btn-secondary" onClick={() => setExpandedId(prev => prev === booking._id ? null : booking._id)}>
                    {expandedId === booking._id ? 'Hide Details' : 'View Details'}
                  </button>
                )}
              </div>


              {expandedId === booking._id && (
                <div className="booking-details" style={{ marginTop: 10, borderTop: '1px solid #eee', paddingTop: 10 }}>
                  <p><strong>Equipment:</strong> {booking.equipmentId?.title || '—'}</p>
                  <p><strong>Renter Email:</strong> {booking.renterId?.email || '—'}</p>
                  <p><strong>Owner Email:</strong> {booking.ownerId?.email || '—'}</p>
                  {booking.deliveryOption === 'home_delivery' && (
                    <p><strong>Delivery Address:</strong> {[booking.deliveryAddress?.street, booking.deliveryAddress?.city, booking.deliveryAddress?.state, booking.deliveryAddress?.pincode].filter(Boolean).join(', ') || '—'}</p>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default BookingRequests;