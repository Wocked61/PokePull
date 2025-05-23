import React, { useEffect, useState } from 'react';
import './Pokedex.css';
import backgroundImage from './assets/Pokedex_BG.png';

function Pokedex() {
  const [pokemon, setPokemon] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPokemon = async () => {
      const response = await fetch('https://pokeapi.co/api/v2/pokemon?limit=151');
      const data = await response.json();
      setPokemon(data.results);
      setLoading(false);
    };

    fetchPokemon();
  }, []);

  if (loading) {
    return <div>Loading Pokédex</div>;
  }

  return (
    <div className="pokedex-page">
      <div className="pokedex-background" style={{ 
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        width: '100%',
        minHeight: '100vh'
      }}>
      <div className="pokedex-container">
        <h1>Pokedex</h1>
        <p>Explore the world of Pokemon!</p>
        <div className='box'>
        <p></p>
        </div>
        <div className='button-container'>
        <button className='button'>Previous</button>
        <button className='button'>Next</button>
        </div>

      </div>
    </div>
    </div>
  );
}

export default Pokedex;