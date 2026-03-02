import React, { useMemo, useState, useEffect } from 'react';
import api from '../services/api';
import { Link } from 'react-router-dom';

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fallbackIcons = useMemo(
    () => ({
      Badminton: '🏸',
      Cricket: '🏏',
      Tennis: '🎾',
      Football: '⚽',
      Cycling: '🚴',
      'Gym & Fitness': '🏋️',
      Swimming: '🏊',
      Basketball: '🏀',
    }),
    []
  );

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
    <div className="home-section-container">
      <div className="home-section-header">
        <div>
          <h2>Browse by Sport</h2>
          <p>Find equipment for your favorite sport</p>
        </div>
        <Link className="home-view-all" to="/equipment">
          View All →
        </Link>
      </div>

      <div className="home-category-row">
        {categories.map((category) => {
          const icon = category.icon || fallbackIcons[category.name] || '🏅';
          const itemCount = Array.isArray(category.subCategories)
            ? `${category.subCategories.length} types`
            : '';

          return (
            <Link
              to={`/category/${encodeURIComponent(category.name)}`}
              key={category._id}
              className="home-category-tile"
              aria-label={`Browse ${category.name}`}
            >
              <div className="home-category-icon">
                {typeof icon === 'string' && icon.startsWith('http') ? (
                  <img src={icon} alt="" />
                ) : (
                  <span>{icon}</span>
                )}
              </div>
              <div className="home-category-name">{category.name}</div>
              <div className="home-category-meta">{itemCount || 'Explore'}</div>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default Categories;