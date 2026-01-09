import React, { useState } from 'react';
import api from '../services/api';
import ImageUpload from './ImageUpload';

const PostAdForm = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    price: '',
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
      formDataToSend.append('price', Number(formData.price));
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

      const response = await api.post('/api/products', formDataToSend);
      setSuccess('Product posted successfully!');
      // Reset form
      setFormData({
        title: '',
        description: '',
        category: '',
        price: '',
        condition: 'good',
        location: {
          city: '',
          state: '',
          pincode: ''
        }
      });
      setImages([]);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to post product');
    }

    setLoading(false);
  };

  return (
    <div className="post-ad-form">
      <h2>Post a New Ad</h2>
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
          <label>Category:</label>
          <input
            type="text"
            name="category"
            value={formData.category}
            onChange={handleChange}
            required
          />
        </div>
        
        <div className="form-group">
          <label>Price ($):</label>
          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleChange}
            required
          />
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
        
        <div className="form-group">
          <label>Images:</label>
          <ImageUpload onImageUpload={handleImageUpload} maxImages={5} useFormData={true} />
        </div>
        
        <button type="submit" disabled={loading}>
          {loading ? 'Posting...' : 'Post Ad'}
        </button>
      </form>
    </div>
  );
};

export default PostAdForm;