import React from 'react';
import './Pokedex.css';
import backgroundImage from './assets/Pokedex_BG.png';

function Pokedex() {
  return (
    <div className="pokedex-page">
      <div className="pokedex-background" style={{ 
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        width: '100%',
        minHeight: '100vh',
        position: 'absolute',
        top: 0,
        left: 0,
        zIndex: -1,
      }}></div>
      <div className="pokedex-container">
        <h1>Pokedex</h1>
        <p>Explore the world of Pokemon!</p>
      </div>
    </div>
  );
}

export default Pokedex;