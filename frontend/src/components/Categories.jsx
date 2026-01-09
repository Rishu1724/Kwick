import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { Link } from 'react-router-dom';

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
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

    fetchCategories();
  }, []);

  if (loading) return <p>Loading categories...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="categories">
      <h2>Browse Categories</h2>
      <div className="category-grid">
        {categories.map((category) => (
          <Link to={`/category/${category.name}`} key={category._id} className="category-card-link">
            <div className="category-card">
              <h3>{category.name}</h3>
              {category.icon && <img src={category.icon} alt={category.name} />}
              {category.subCategories && category.subCategories.length > 0 && (
                <ul>
                  {category.subCategories.map((subCategory, index) => (
                    <li key={index}>{subCategory}</li>
                  ))}
                </ul>
              )}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Categories;