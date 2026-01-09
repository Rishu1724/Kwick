import React from 'react';
import Categories from '../components/Categories';
import FeaturedProducts from '../components/FeaturedProducts';

const Home = () => {
  return (
    <div className="home">
      <header className="hero">
        <h1>Welcome to Kwick</h1>
        <p>Buy and sell items in your community</p>
      </header>
      
      <Categories />
      
      <FeaturedProducts />
    </div>
  );
};

export default Home;