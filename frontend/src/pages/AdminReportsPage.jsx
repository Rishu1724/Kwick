import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

const AdminReportsPage = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { user } = useAuth();

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      setLoading(true);
      const response = await api.get('/api/reports');
      setReports(response.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to load reports');
      setLoading(false);
    }
  };

  const updateReportStatus = async (reportId, status) => {
    try {
      await api.put(`/api/reports/${reportId}`, { status });
      // Update the report status in the local state
      setReports(reports.map(report => 
        report._id === reportId ? { ...report, status } : report
      ));
    } catch (err) {
      setError('Failed to update report status');
    }
  };

  const deleteReport = async (reportId) => {
    try {
      await api.delete(`/api/reports/${reportId}`);
      // Remove the report from the local state
      setReports(reports.filter(report => report._id !== reportId));
    } catch (err) {
      setError('Failed to delete report');
    }
  };

  if (loading) return <div>Loading reports...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="admin-reports">
      <h1>Admin Reports</h1>
      
      {reports.length === 0 ? (
        <p>No reports found.</p>
      ) : (
        <div className="reports-list">
          {reports.map((report) => (
            <div key={report._id} className="report-item">
              <div className="report-header">
                <h3>Report #{report._id.slice(-6)}</h3>
                <span className={`status ${report.status}`}>
                  {report.status}
                </span>
              </div>
              
              <div className="report-details">
                <p><strong>Reason:</strong> {report.reason}</p>
                {report.description && (
                  <p><strong>Description:</strong> {report.description}</p>
                )}
                <p><strong>Reported by:</strong> {report.reporterId.name}</p>
                <p><strong>Product:</strong> {report.productId.title}</p>
                <p><strong>Date:</strong> {new Date(report.createdAt).toLocaleDateString()}</p>
              </div>
              
              <div className="report-actions">
                <select 
                  value={report.status} 
                  onChange={(e) => updateReportStatus(report._id, e.target.value)}
                >
                  <option value="pending">Pending</option>
                  <option value="reviewed">Reviewed</option>
                  <option value="resolved">Resolved</option>
                  <option value="dismissed">Dismissed</option>
                </select>
                
                <button 
                  className="btn-danger" 
                  onClick={() => deleteReport(report._id)}
                >
                  Delete Report
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminReportsPage;