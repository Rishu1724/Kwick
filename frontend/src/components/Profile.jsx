import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import './Profile.css';

const Profile = () => {
  const { user, updateProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    location: {
      city: user?.location?.city || '',
      state: user?.location?.state || '',
      pincode: user?.location?.pincode || ''
    }
  });
  const [avatar, setAvatar] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(user?.avatar || null);
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
  
  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatar(file);
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      // Create form data to send both form fields and avatar
      const formDataToSend = new FormData();
      formDataToSend.append('name', formData.name);
      formDataToSend.append('email', formData.email);
      formDataToSend.append('phone', formData.phone);
      formDataToSend.append('location[city]', formData.location.city);
      formDataToSend.append('location[state]', formData.location.state);
      formDataToSend.append('location[pincode]', formData.location.pincode);
      if (avatar) {
        formDataToSend.append('avatar', avatar);
      }
      
      const response = await api.put('/api/users/profile', formDataToSend);
      
      // Update the auth context with the new user data
      updateProfile(response.data);
      setSuccess('Profile updated successfully!');
      setIsEditing(false);
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to update profile');
    }

    setLoading(false);
  };

  if (!user) return <div>Please log in to view your profile.</div>;

  return (
    <div className="profile">
      <h2>User Profile</h2>
      {error && <div className="alert alert-danger">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}
      
      {isEditing ? (
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Name:</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="form-group">
            <label>Email:</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="form-group">
            <label>Phone:</label>
            <input
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
            />
          </div>
          
          <div className="form-group">
            <label>City:</label>
            <input
              type="text"
              name="location.city"
              value={formData.location.city}
              onChange={handleChange}
            />
          </div>
          
          <div className="form-group">
            <label>State:</label>
            <input
              type="text"
              name="location.state"
              value={formData.location.state}
              onChange={handleChange}
            />
          </div>
          
          <div className="form-group">
            <label>Pincode:</label>
            <input
              type="text"
              name="location.pincode"
              value={formData.location.pincode}
              onChange={handleChange}
            />
          </div>
          
          <div className="form-group">
            <label>Avatar:</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleAvatarChange}
            />
            {avatarPreview && (
              <div className="avatar-preview">
                <img src={avatarPreview} alt="Avatar Preview" style={{width: '100px', height: '100px', borderRadius: '50%', objectFit: 'cover'}} />
              </div>
            )}
          </div>
          
          <div className="form-actions">
            <button type="submit" disabled={loading}>
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
            <button type="button" onClick={() => setIsEditing(false)}>
              Cancel
            </button>
          </div>
        </form>
      ) : (
        <div className="profile-view">
          {user.avatar && (
            <div className="avatar-section">
              <img src={user.avatar} alt="User Avatar" style={{width: '100px', height: '100px', borderRadius: '50%', objectFit: 'cover'}} />
            </div>
          )}
          <div className="profile-field">
            <strong>Name:</strong> {user.name}
          </div>
          <div className="profile-field">
            <strong>Email:</strong> {user.email}
          </div>
          <div className="profile-field">
            <strong>Role:</strong> 
            {user.role === 'renter' ? 'Equipment Renter' : 
             user.role === 'owner' ? 'Equipment Owner' : 
             'Both Renter and Owner'}
          </div>
          <div className="profile-field">
            <strong>Phone:</strong> {user.phone || 'Not provided'}
          </div>
          <div className="profile-field">
            <strong>Location:</strong> {user.location ? `${user.location.city}, ${user.location.state} ${user.location.pincode}` : 'Not provided'}
          </div>
          {user.ratingsReceived && (
            <div className="profile-field">
              <strong>Rating:</strong> {user.ratingsReceived.average ? user.ratingsReceived.average.toFixed(1) : 0}★ ({user.ratingsReceived.count} reviews)
            </div>
          )}
          {user.walletBalance >= 0 && (
            <div className="profile-field">
              <strong>Wallet Balance:</strong> ₹{user.walletBalance}
            </div>
          )}
          {user.loyaltyPoints >= 0 && (
            <div className="profile-field">
              <strong>Loyalty Points:</strong> {user.loyaltyPoints}
            </div>
          )}
          {user.subscriptionTier && (
            <div className="profile-field">
              <strong>Membership:</strong> {user.subscriptionTier.charAt(0).toUpperCase() + user.subscriptionTier.slice(1)}
            </div>
          )}
          <button className="btn-primary" onClick={() => setIsEditing(true)}>
            Edit Profile
          </button>
        </div>
      )}
    </div>
  );
};

export default Profile;