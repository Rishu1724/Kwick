import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import './BookingRequests.css';

const BookingRequests = () => {
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchBookingRequests = async () => {
      try {
        // Get bookings where current user is the owner
        const response = await api.get(`/api/bookings`);
        const ownerBookings = response.data.data.filter(booking => 
          booking.ownerId._id === user._id || booking.ownerId === user._id
        );
        setBookings(ownerBookings);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch booking requests');
        setLoading(false);
      }
    };

    if (user) {
      fetchBookingRequests();
    }
  }, [user]);

  const handleAcceptRequest = async (bookingId) => {
    try {
      await api.put(`/api/bookings/${bookingId}`, { status: 'confirmed' });
      // Refresh the list
      const response = await api.get(`/api/bookings`);
      const ownerBookings = response.data.data.filter(booking => 
        booking.ownerId._id === user._id || booking.ownerId === user._id
      );
      setBookings(ownerBookings);
    } catch (err) {
      console.error('Error accepting booking:', err);
    }
  };

  const handleRejectRequest = async (bookingId) => {
    try {
      await api.delete(`/api/bookings/${bookingId}`);
      // Refresh the list
      const response = await api.get(`/api/bookings`);
      const ownerBookings = response.data.data.filter(booking => 
        booking.ownerId._id === user._id || booking.ownerId === user._id
      );
      setBookings(ownerBookings);
    } catch (err) {
      console.error('Error rejecting booking:', err);
    }
  };

  if (loading) return <p>Loading booking requests...</p>;
  if (error) return <p className="error">{error}</p>;

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
              </div>
              <div className="booking-actions">
                {booking.status === 'pending' && (
                  <>
                    <button className="btn-success" onClick={() => handleAcceptRequest(booking._id)}>Accept</button>
                    <button className="btn-danger" onClick={() => handleRejectRequest(booking._id)}>Reject</button>
                  </>
                )}
                {booking.status === 'confirmed' && (
                  <button className="btn-secondary">View Details</button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default BookingRequests;