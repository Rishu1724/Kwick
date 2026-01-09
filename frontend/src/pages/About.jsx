import React from 'react';

const About = () => {
  return (
    <div className="about">
      <h1>About OLX Clone</h1>
      <p>
        OLX Clone is a classified ads marketplace where users can buy and sell items in their community.
        Our platform connects buyers and sellers in a simple and efficient way.
      </p>
      
      <h2>Our Mission</h2>
      <p>
        Our mission is to make buying and selling items as easy and accessible as possible.
        We aim to create a trusted platform where users can find great deals and sell their items quickly.
      </p>
      
      <h2>How It Works</h2>
      <div className="how-it-works">
        <div className="step">
          <h3>1. Register</h3>
          <p>Create an account as a buyer or seller</p>
        </div>
        <div className="step">
          <h3>2. Browse or Post</h3>
          <p>Browse listings or post your own items</p>
        </div>
        <div className="step">
          <h3>3. Connect</h3>
          <p>Connect with other users to make deals</p>
        </div>
      </div>
    </div>
  );
};

export default About;