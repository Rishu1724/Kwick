import React, { useState } from 'react';
import api from '../services/api';
import ImageUpload from './ImageUpload';

const AddEquipmentForm = ({ onClose }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    dailyRate: '',
    hourlyRate: '',
    weeklyRate: '',
    condition: 'good',
    location: {
      city: '',
      state: '',
      pincode: ''
    }
  });
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Handle nested location fields
    if (name.startsWith('location.')) {
      const locationField = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        location: {
          ...prev.location,
          [locationField]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleImageUpload = (imageData) => {
    setImages(imageData);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      // Create form data to send both form fields and images
      const formDataToSend = new FormData();
      
      // Append form data fields
      formDataToSend.append('title', formData.title);
      formDataToSend.append('description', formData.description);
      formDataToSend.append('category', formData.category);
      formDataToSend.append('dailyRate', Number(formData.dailyRate));
      formDataToSend.append('hourlyRate', Number(formData.hourlyRate));
      formDataToSend.append('weeklyRate', Number(formData.weeklyRate));
      formDataToSend.append('condition', formData.condition);
      formDataToSend.append('location[city]', formData.location.city);
      formDataToSend.append('location[state]', formData.location.state);
      formDataToSend.append('location[pincode]', formData.location.pincode);
      
      // Append image files if they exist
      if (Array.isArray(images) && images.length > 0) {
        images.forEach((image, index) => {
          if (image instanceof File) {
            formDataToSend.append('images', image);
          }
        });
      }

      // Use products API endpoint
      const response = await api.post('/api/products', formDataToSend);
      setSuccess('Equipment listed successfully!');
      
      // Reset form
      setFormData({
        title: '',
        description: '',
        category: '',
        dailyRate: '',
        hourlyRate: '',
        weeklyRate: '',
        condition: 'good',
        location: {
          city: '',
          state: '',
          pincode: ''
        }
      });
      setImages([]);
      
      // Close form after 2 seconds
      setTimeout(() => {
        onClose();
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to list equipment');
    }

    setLoading(false);
  };

  return (
    <div className="add-equipment-form">
      <h2>Add New Equipment</h2>
      {error && <div className="alert alert-danger">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Title:</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
          />
        </div>
        
        <div className="form-group">
          <label>Description:</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
          />
        </div>
        
        <div className="form-group">
          <label>Category (Sport):</label>
          <input
            type="text"
            name="category"
            value={formData.category}
            onChange={handleChange}
            required
            placeholder="e.g., Tennis, Football, Cycling"
          />
        </div>
        
        <div className="pricing-section">
          <h3>Pricing Options</h3>
          <div className="form-row">
            <div className="form-group">
              <label>Hourly Rate ($):</label>
              <input
                type="number"
                name="hourlyRate"
                value={formData.hourlyRate}
                onChange={handleChange}
                min="0"
                step="0.01"
              />
            </div>
            
            <div className="form-group">
              <label>Daily Rate ($):</label>
              <input
                type="number"
                name="dailyRate"
                value={formData.dailyRate}
                onChange={handleChange}
                required
                min="0"
                step="0.01"
              />
            </div>
            
            <div className="form-group">
              <label>Weekly Rate ($):</label>
              <input
                type="number"
                name="weeklyRate"
                value={formData.weeklyRate}
                onChange={handleChange}
                min="0"
                step="0.01"
              />
            </div>
          </div>
        </div>
        
        <div className="form-group">
          <label>Condition:</label>
          <select
            name="condition"
            value={formData.condition}
            onChange={handleChange}
          >
            <option value="new">New</option>
            <option value="like-new">Like New</option>
            <option value="good">Good</option>
            <option value="fair">Fair</option>
            <option value="poor">Poor</option>
          </select>
        </div>
        
        <div className="location-section">
          <h3>Location</h3>
          <div className="form-row">
            <div className="form-group">
              <label>City:</label>
              <input
                type="text"
                name="location.city"
                value={formData.location.city}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="form-group">
              <label>State:</label>
              <input
                type="text"
                name="location.state"
                value={formData.location.state}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="form-group">
              <label>Pincode:</label>
              <input
                type="text"
                name="location.pincode"
                value={formData.location.pincode}
                onChange={handleChange}
                required
              />
            </div>
          </div>
        </div>
        
        <div className="form-group">
          <label>Images:</label>
          <ImageUpload onImageUpload={handleImageUpload} maxImages={5} useFormData={true} />
        </div>
        
        <div className="form-actions">
          <button type="button" className="btn-secondary" onClick={onClose}>
            Cancel
          </button>
          <button type="submit" disabled={loading}>
            {loading ? 'Listing...' : 'List Equipment'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddEquipmentForm;