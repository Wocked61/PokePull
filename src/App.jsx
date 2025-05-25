import React, { useEffect, useState } from 'react';
import './App.css';
import backgroundImage from './assets/Box_Forest_background2.png';

function App() {
    const [currentPokemonId, setCurrentPokemonId] = useState(() => getRandomIntInclusive(1, 1025));
    const [isShiny, setIsShiny] = useState(false);
    const [pokemonData, setPokemonData] = useState(null);
    const [loading, setLoading] = useState(false);

    function getRandomIntInclusive(min, max) {
      min = Math.ceil(min);
      max = Math.floor(max);
      return Math.floor( Math.random() * (max - min + 1)) + min;
    }

    async function fetchPokemonData(id) {
      try {
        setLoading(true);
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
        const data = await response.json();
        setPokemonData(data);
      } catch (error) {
        console.error('Error fetching Pokemon data:', error);
      } finally {
        setLoading(false);
      }
    }

    function pullPokemon() {
      const newRandomInt = getRandomIntInclusive(1, 1025);
      const Shiny = Math.random() < 0.01;
      
      setCurrentPokemonId(newRandomInt);
      setIsShiny(Shiny);
      fetchPokemonData(newRandomInt);
      
      if (Shiny) {
        console.log(`Shiny Pokémon pulled with ID: ${newRandomInt}`);
      } else {
        console.log(`Regular Pokémon pulled with ID: ${newRandomInt}`);
      }
    }

    // Fetch initial Pokemon data
    useEffect(() => {
      fetchPokemonData(currentPokemonId);
    }, []);

  return (
    <div style={{ 
      backgroundImage: `url(${backgroundImage})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      minHeight: '74vh'
    }}>

      <div className="App">
        <div className='box'>
          {loading ? (
            <div className='loading'>Loading...</div>
          ) : (
            <>
              <img className='pokemon-image'
                src={isShiny 
                  ? pokemonData?.sprites?.front_shiny || `https://pokeapi.co/media/sprites/pokemon/shiny/${currentPokemonId}.png`
                  : pokemonData?.sprites?.front_default || `https://pokeapi.co/media/sprites/pokemon/${currentPokemonId}.png`
                } 
                alt={`${isShiny ? 'Shiny ' : ''}${pokemonData?.name || 'Pokemon'} ${currentPokemonId}`} 
              />
              {pokemonData && (
                <div className="pokemon-info">
                  <h3>{pokemonData.name}</h3>
                  <p>#{pokemonData.id}</p>
                  <p>Type: {pokemonData.types.map(type => type.type.name).join(', ')}</p>
                </div>
              )}
            </>
          )}
        </div>
        <div className='button-container1'>
          <button className='button' onClick={pullPokemon} disabled={loading}>
            {loading ? 'Pulling...' : 'pull'}
          </button>
        </div>

      </div>
    </div>
  );
}

export default App;