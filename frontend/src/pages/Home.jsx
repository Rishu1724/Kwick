import React from 'react';
import Categories from '../components/Categories';
import AllProducts from '../components/AllProducts';

const Home = () => {
  return (
    <div className="home">
      <header className="hero">
        <h1>Welcome to Kwick</h1>
        <p>Buy and sell items in your community</p>
      </header>
      
      <Categories />
      
      <AllProducts />
    </div>
  );
};

export default Home;