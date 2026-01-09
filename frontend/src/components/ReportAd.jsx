import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import Modal from './Modal';
import api from '../services/api';

const ReportAd = ({ productId }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [reason, setReason] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const { user } = useAuth();

  const handleReportAd = () => {
    if (!user) {
      window.location.href = '/login';
      return;
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setReason('');
    setDescription('');
    setSuccess(false);
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      // Send report to the backend
      await api.post('/api/reports', { productId, reason, description });
      
      setSuccess(true);
      
      // Close modal after 2 seconds
      setTimeout(() => {
        handleCloseModal();
      }, 2000);
    } catch (err) {
      setError('Failed to submit report. Please try again.');
    }
    
    setLoading(false);
  };

  return (
    <>
      <button className="report-ad" onClick={handleReportAd}>
        Report Ad
      </button>
      
      <Modal 
        isOpen={isModalOpen} 
        onClose={handleCloseModal} 
        title="Report Ad"
      >
        {success ? (
          <div className="success-message">
            <h3>Report Submitted!</h3>
            <p>Thank you for reporting this ad. Our team will review it shortly.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Reason for reporting:</label>
              <select
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                required
              >
                <option value="">Select a reason</option>
                <option value="inappropriate_content">Inappropriate content</option>
                <option value="fraudulent_ad">Suspected fraud</option>
                <option value="duplicate_ad">Duplicate ad</option>
                <option value="wrong_category">Wrong category</option>
                <option value="other">Other</option>
              </select>
            </div>
            
            {reason === 'other' && (
              <div className="form-group">
                <label>Additional details:</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Please provide more details about your report..."
                  maxLength="500"
                />
                <div className="char-count">
                  {description.length}/500
                </div>
              </div>
            )}
            
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
                {loading ? 'Submitting...' : 'Submit Report'}
              </button>
            </div>
          </form>
        )}
      </Modal>
    </>
  );
};

export default ReportAd;