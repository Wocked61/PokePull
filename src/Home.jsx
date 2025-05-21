import React from 'react';
import { Link } from 'react-router-dom';
import './Home.css';
import backgroundImage from './assets/Home_BG!.png';

function Home() {
  return (
    <div className="home-page">
      <div className="home-background" style={{ 
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        width: '100%',
        minHeight: '100vh'
      }}>
      
      <div className="home-container">
        <div className='placeholder-box-title'>
        <h1>Welcome to PokéPull</h1>
        <p>This is the Home PokéPull app page</p>
        </div>
        <div className="placeholder-content">
          <Link to="/App" className="link-no-style">
            <div className="placeholder-box">
              <h2>Start Pulling</h2>
              <p>Spin for Pokemon here</p>
            </div>
          </Link>
          
          <Link to="/Pokedex" className="link-no-style">
            <div className="placeholder-box">
              <h2>PokeDex</h2>
              <p>See all available Pokemon here</p>
            </div>
          </Link>
        </div>
      </div>
    </div>
    </div>
  );
}

export default Home;