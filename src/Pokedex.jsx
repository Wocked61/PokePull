import React, { useEffect, useState } from 'react';
import './Pokedex.css';
import backgroundImage from './assets/Pokedex_BG.png';

function Pokedex() {
  const [pokemon, setPokemon] = useState([]);
  const [pokemonDetails, setPokemonDetails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [pokemonPerPage] = useState(20);

  useEffect(() => {
    const fetchPokemon = async () => {
      try {
        const response = await fetch('https://pokeapi.co/api/v2/pokedex/1/');
        if (!response.ok) {
          console.error('Failed to fetch Pokédex');
          setLoading(false);
          return;
        }
        const data = await response.json();
        setPokemon(data.pokemon_entries);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching Pokemon:', error);
        setLoading(false);
      }
    };

    fetchPokemon();
  }, []);

  useEffect(() => {
    const fetchPokemonDetails = async () => {
      if (pokemon.length === 0) return;
      
      setLoading(true);
      try {
        const startIndex = (currentPage - 1) * pokemonPerPage;
        const endIndex = startIndex + pokemonPerPage;
        const currentPokemon = pokemon.slice(startIndex, endIndex);

        const pokemonDetailsPromises = currentPokemon.map(async (entry) => {
          const pokemonResponse = await fetch(entry.pokemon_species.url.replace('pokemon-species', 'pokemon'));
          const pokemonData = await pokemonResponse.json();
          return {
            id: pokemonData.id,
            name: pokemonData.name,
            sprite: pokemonData.sprites.front_default,
            entry_number: entry.entry_number
          };
        });
        
        const details = await Promise.all(pokemonDetailsPromises);
        setPokemonDetails(details);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching Pokemon details:', error);
        setLoading(false);
      }
    };

    fetchPokemonDetails();
  }, [pokemon, currentPage, pokemonPerPage]);

  const totalPages = Math.ceil(pokemon.length / pokemonPerPage);

  const handlePrevious = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  if (loading) {
    return <div>Loading Pokédex...</div>;
  }

  return (
    <div className="pokedex-page">
      <div className="pokedex-background" style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        minHeight: '74vh',
        width: '100%'
      }}>
        <div className="pokedex-container">
          <h1>Pokedex</h1>
          <p>Explore the world of Pokemon!</p>
          
          <div className="pokemon-grid">
            {pokemonDetails.map((pokemon) => (
              <div key={pokemon.id} className="pokemon-box">
                <div className="pokemon-number">#{pokemon.entry_number.toString().padStart(3, '0')}</div>
                <img 
                  src={pokemon.sprite} 
                  alt={pokemon.name}
                  className="pokemon-sprite"
                />
                <div className="pokemon-name">{pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)}</div>
              </div>
            ))}
          </div>

          <div className='button-container'>
            <button 
              className='button' 
              onClick={handlePrevious}
              disabled={currentPage === 1}
            >
              Previous
            </button>
            <span className="page-info">
              Page {currentPage} of {totalPages}
            </span>
            <button 
              className='button' 
              onClick={handleNext}
              disabled={currentPage === totalPages}
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Pokedex;