import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import Modal from './Modal';
import ChatWindow from './Chat/ChatWindow';
import api from '../services/api';

const ContactSeller = ({ sellerId, productId }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const { user } = useAuth();

  const handleContactSeller = () => {
    if (!user) {
      window.location.href = '/login';
      return;
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setMessage('');
    setSuccess(false);
    setError('');
  };

  const handleOpenChat = () => {
    setIsModalOpen(false);
    setIsChatOpen(true);
  };

  const handleCloseChat = () => {
    setIsChatOpen(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      // Send message to the backend
      await api.post('/api/chats', { receiverId: sellerId, productId, message });
      
      setSuccess(true);
      setMessage('');
      
      // Close modal after 2 seconds
      setTimeout(() => {
        handleCloseModal();
      }, 2000);
    } catch (err) {
      setError('Failed to send message. Please try again.');
    }
    
    setLoading(false);
  };

  return (
    <>
      <button className="btn-primary" onClick={handleContactSeller}>
        Contact Seller
      </button>
      
      <Modal 
        isOpen={isModalOpen} 
        onClose={handleCloseModal} 
        title="Contact Seller"
      >
        {success ? (
          <div className="success-message">
            <h3>Message Sent!</h3>
            <p>Your message has been sent to the seller.</p>
            <button className="btn-primary" onClick={handleOpenChat}>
              Open Chat
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Message:</label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                required
                placeholder="Enter your message to the seller..."
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
                {loading ? 'Sending...' : 'Send Message'}
              </button>
            </div>
          </form>
        )}
      </Modal>
      
      {isChatOpen && (
        <ChatWindow 
          productId={productId} 
          sellerId={sellerId} 
          onClose={handleCloseChat} 
        />
      )}
    </>
  );
};

export default ContactSeller;