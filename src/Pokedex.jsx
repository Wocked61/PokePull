import React from 'react';
import './Pokedex.css';
import backgroundImage from './assets/Pokedex_BG.png';


function Pokedex() {
  return (
    <div className="pokedex-container" style={{ 
      backgroundImage: `url(${backgroundImage})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      minHeight: '100vh',
      width: '100%',
    }}>
      <h1>Pokedex</h1>
      <p>Explore the world of Pokemon!</p>
    </div>
  );
}

export default Pokedex;