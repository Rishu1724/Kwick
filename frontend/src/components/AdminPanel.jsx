import React, { useState, useEffect } from 'react';
import api from '../services/api';

const AdminPanel = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [newCategory, setNewCategory] = useState({
    name: '',
    icon: '',
    subCategories: ''
  });

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await api.get('/api/categories');
      setCategories(response.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch categories');
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewCategory(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCreateCategory = async (e) => {
    e.preventDefault();
    try {
      const categoryData = {
        ...newCategory,
        subCategories: newCategory.subCategories.split(',').map(item => item.trim()).filter(item => item)
      };
      
      await api.post('/api/categories', categoryData);
      setNewCategory({ name: '', icon: '', subCategories: '' });
      fetchCategories(); // Refresh the category list
    } catch (err) {
      setError('Failed to create category');
    }
  };

  const handleDeleteCategory = async (categoryId) => {
    try {
      await api.delete(`/api/categories/${categoryId}`);
      fetchCategories(); // Refresh the category list
    } catch (err) {
      setError('Failed to delete category');
    }
  };

  if (loading) return <p>Loading categories...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="admin-panel">
      <h2>Admin Panel</h2>
      
      <div className="admin-section">
        <h3>Create New Category</h3>
        <form onSubmit={handleCreateCategory}>
          <div className="form-group">
            <label>Category Name:</label>
            <input
              type="text"
              name="name"
              value={newCategory.name}
              onChange={handleInputChange}
              required
            />
          </div>
          
          <div className="form-group">
            <label>Icon URL:</label>
            <input
              type="text"
              name="icon"
              value={newCategory.icon}
              onChange={handleInputChange}
            />
          </div>
          
          <div className="form-group">
            <label>Subcategories (comma separated):</label>
            <input
              type="text"
              name="subCategories"
              value={newCategory.subCategories}
              onChange={handleInputChange}
              placeholder="e.g., smartphones, laptops, tablets"
            />
          </div>
          
          <button type="submit">Create Category</button>
        </form>
      </div>
      
      <div className="admin-section">
        <h3>Existing Categories</h3>
        <div className="category-list">
          {categories.map((category) => (
            <div key={category._id} className="category-item">
              <div className="category-info">
                <h4>{category.name}</h4>
                {category.icon && <img src={category.icon} alt={category.name} className="category-icon" />}
                {category.subCategories && category.subCategories.length > 0 && (
                  <p>Subcategories: {category.subCategories.join(', ')}</p>
                )}
              </div>
              <button 
                className="btn-danger"
                onClick={() => handleDeleteCategory(category._id)}
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;