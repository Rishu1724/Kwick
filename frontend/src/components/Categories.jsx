import React, { useMemo, useState, useEffect } from 'react';
import api from '../services/api';
import { Link } from 'react-router-dom';

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const localCategoryImages = useMemo(() => {
    // Any image dropped into `src/assets/categories/` can override emoji icons.
    // Example filenames: `badminton.png`, `cricket.jpg`.
    const modules = import.meta.glob('../assets/categories/*.{png,jpg,jpeg,webp,svg}', {
      eager: true,
      import: 'default'
    });

    const byBaseName = {};
    Object.entries(modules).forEach(([path, src]) => {
      const file = path.split('/').pop() || '';
      const base = file.replace(/\.[^.]+$/, '').toLowerCase();
      if (base) byBaseName[base] = src;
    });
    return byBaseName;
  }, []);

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
          const localIcon = localCategoryImages[String(category.name || '').toLowerCase()];
          const icon = category.icon || localIcon || fallbackIcons[category.name] || '🏅';
          const isImageSrc =
            typeof icon === 'string' &&
            (icon.startsWith('http') || icon.startsWith('/') || icon.startsWith('data:') || icon.startsWith('blob:'));
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
              <div className={`home-category-icon ${isImageSrc ? 'photo' : ''}`.trim()}>
                {isImageSrc ? (
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