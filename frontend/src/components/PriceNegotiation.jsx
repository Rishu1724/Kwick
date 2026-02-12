import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import Modal from './Modal';
import api from '../services/api';

const PriceNegotiation = ({ productId, currentPrice }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [offerPrice, setOfferPrice] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const { user } = useAuth();

  const handleNegotiatePrice = () => {
    if (!user) {
      window.location.href = '/login';
      return;
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setOfferPrice('');
    setMessage('');
    setSuccess(false);
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      // Send the offer to the backend API
      const response = await api.post('/api/negotiations', {
        productId,
        offerPrice: parseFloat(offerPrice),
        message,
        buyerId: user._id
      });
      
      if (response.data.success) {
        setSuccess(true);
        
        // Close modal after 2 seconds
        setTimeout(() => {
          handleCloseModal();
        }, 2000);
      } else {
        setError(response.data.message || 'Failed to submit offer');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit offer. Please try again.');
    }
    
    setLoading(false);
  };

  return (
    <>
      <button className="btn-secondary" onClick={handleNegotiatePrice}>
        Negotiate Price
      </button>
      
      <Modal 
        isOpen={isModalOpen} 
        onClose={handleCloseModal} 
        title="Negotiate Price"
      >
        {success ? (
          <div className="success-message">
            <h3>Offer Sent!</h3>
            <p>Your offer has been sent to the seller.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Current Price: ${currentPrice}</label>
            </div>
            
            <div className="form-group">
              <label htmlFor="offerPrice">Your Offer:</label>
              <input
                type="number"
                id="offerPrice"
                value={offerPrice}
                onChange={(e) => setOfferPrice(e.target.value)}
                min="1"
                max={currentPrice}
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="message">Message (optional):</label>
              <textarea
                id="message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Add a message to support your offer..."
              />
            </div>
            
            {error && <div className="alert alert-danger">{error}</div>}
            
            <div className="form-actions">
              <button 
                type="button" 
                className="btn-secondary" 
                onClick={handleCloseModal}
              >
                Cancel
              </button>
              <button type="submit" disabled={loading}>
                {loading ? 'Sending...' : 'Send Offer'}
              </button>
            </div>
          </form>
        )}
      </Modal>
    </>
  );
};

export default PriceNegotiation;