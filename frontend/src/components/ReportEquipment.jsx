import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import Modal from './Modal';

const ReportEquipment = ({ equipmentId }) => {
  const navigate = useNavigate();

  const reportReasons = useMemo(
    () => [
      { value: 'inappropriate_content', label: 'Inappropriate content' },
      { value: 'fraudulent_ad', label: 'Fraudulent listing / scam' },
      { value: 'duplicate_ad', label: 'Duplicate listing' },
      { value: 'wrong_category', label: 'Wrong category' },
      { value: 'other', label: 'Other' },
    ],
    []
  );

  const [isOpen, setIsOpen] = useState(false);
  const [reason, setReason] = useState(reportReasons[0]?.value || 'other');
  const [description, setDescription] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (!isOpen) {
      setError('');
      setSuccess('');
    }
  }, [isOpen]);

  const openModal = () => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    setIsOpen(true);
  };

  const closeModal = () => {
    if (submitting) return;
    setIsOpen(false);
  };

  const submitReport = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!equipmentId) {
      setError('Missing equipment id. Please refresh and try again.');
      return;
    }

    if (!reason) {
      setError('Please select a reason.');
      return;
    }

    try {
      setSubmitting(true);
      await api.post('/api/reports', {
        productId: equipmentId,
        reason,
        description: description?.trim() || undefined,
      });
      setSuccess('Thanks — your report has been submitted.');
      setDescription('');
    } catch (err) {
      const message =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        'Failed to submit report. Please try again.';
      setError(message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <button className="btn-report" onClick={openModal}>
        Report Equipment
      </button>

      <Modal isOpen={isOpen} onClose={closeModal} title="Report this equipment">
        <form onSubmit={submitReport}>
          {error ? <div className="alert alert-danger">{error}</div> : null}
          {success ? <div className="alert-success">{success}</div> : null}

          <div className="form-group">
            <label htmlFor="report-reason">Reason</label>
            <select
              id="report-reason"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              disabled={submitting}
            >
              {reportReasons.map((r) => (
                <option key={r.value} value={r.value}>
                  {r.label}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="report-description">Description (optional)</label>
            <textarea
              id="report-description"
              className="report-textarea"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              maxLength={500}
              placeholder="Add any helpful context (max 500 characters)"
              disabled={submitting}
            />
          </div>

          <div className="action-buttons">
            <button type="button" className="btn-secondary" onClick={closeModal} disabled={submitting}>
              Cancel
            </button>
            <button type="submit" className="btn-primary" disabled={submitting}>
              {submitting ? 'Submitting...' : 'Submit Report'}
            </button>
          </div>
        </form>
      </Modal>
    </>
  );
};

export default ReportEquipment;