import React, { useState, useEffect } from 'react';
import './Collections.css';
import backgroundImage from './assets/Collection_BG.png';

const Collections = () => {
  const [collectedPokemon, setCollectedPokemon] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const pokemonPerPage = 50;
  const totalPokemon = 1025;

  useEffect(() => {
    loadCollectedPokemon();
  }, []);

  const loadCollectedPokemon = () => {
    try {
      const saved = localStorage.getItem('collectedPokemon');
      if (saved) {
        setCollectedPokemon(JSON.parse(saved));
      }
    } catch (error) {
      console.error('Error loading collected Pokémon:', error);
    } finally {
      setLoading(false);
    }
  };

  const clearCollection = () => {
    if (window.confirm('Are you sure you want to clear your entire collection?')) {
      localStorage.removeItem('collectedPokemon');
      setCollectedPokemon([]);
    }
  };

  const renderPokemonGrid = () => {
    const startIndex = (currentPage - 1) * pokemonPerPage;
    const endIndex = startIndex + pokemonPerPage;
    const pokemonGrid = [];

    for (let i = startIndex; i < endIndex && i < totalPokemon; i++) {
      const pokemonId = i + 1;

      
      const regularPokemon = collectedPokemon.find(p => p.id === pokemonId && !p.isShiny);
      const shinyPokemon = collectedPokemon.find(p => p.id === pokemonId && p.isShiny);
      
      pokemonGrid.push(
        <div key={pokemonId} className="pokemon-collection-box">
          <div className="pokemon-number">#{pokemonId.toString().padStart(3, '0')}</div>
          
          {regularPokemon || shinyPokemon ? (
            <div className="pokemon-variants">
              {/* Regular version */}
              <div className="pokemon-variant">
                {regularPokemon ? (
                  <>
                    <img 
                      src={regularPokemon.sprite} 
                      alt={regularPokemon.name}
                      className="pokemon-sprite"
                    />
                    <div className="pokemon-count">x{regularPokemon.count}</div>
                  </>
                ) : (
                  <div className="uncaught-slot">
                    <div className="uncaught-sprite"></div>
                  </div>
                )}
              </div>
              
              {/* Shiny version */}
              <div className="pokemon-variant shiny">
                {shinyPokemon ? (
                  <>
                    <img 
                      src={shinyPokemon.sprite} 
                      alt={`Shiny ${shinyPokemon.name}`}
                      className="pokemon-sprite shiny-sprite"
                    />
                    <div className="pokemon-count shiny-count">✨x{shinyPokemon.count}</div>
                  </>
                ) : (
                  <div className="uncaught-slot shiny-slot">
                    <div className="uncaught-sprite"></div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="pokemon-variants">
              <div className="pokemon-variant">
                <div className="uncaught-slot">
                  <div className="uncaught-sprite"></div>
                </div>
              </div>
              <div className="pokemon-variant">
                <div className="uncaught-slot shiny-slot">
                  <div className="uncaught-sprite"></div>
                </div>
              </div>
            </div>
          )}
          
          <div className="pokemon-name">
            {regularPokemon?.name || shinyPokemon?.name || `Unknown #${pokemonId}`}
          </div>
        </div>
      );
    }

    return pokemonGrid;
  };

  const totalPages = Math.ceil(totalPokemon / pokemonPerPage);
  const totalCaught = collectedPokemon.length;
  const uniquePokemon = [...new Set(collectedPokemon.map(p => p.id))].length;
  const shinyCount = collectedPokemon.filter(p => p.isShiny).length;

  if (loading) {
    return <div className="loading">Loading collection...</div>;
  }

  return (
    <div className="collections-page" style={{ 
      backgroundImage: `url(${backgroundImage})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      minHeight: '77vh'
    }}>
      <div className="collections-container">
        <div className="collections-header">
          <h1 className="page-title">My Collection</h1>
          <div className="collection-stats">
            <div className="stat">
              <span>Total Caught: {totalCaught}</span>
            </div>
            <div className="stat">
              <span>Unique Pokémon: {uniquePokemon}/{totalPokemon}</span>
            </div>
            <div className="stat">
              <span>Shinies: ✨{shinyCount}</span>
            </div>
          </div>
          <button className="clear-collection-btn" onClick={clearCollection}>
            Clear Collection
          </button>
        </div>

        <div className="pokemon-collection-grid">
          {renderPokemonGrid()}
        </div>

        <div className="pagination">
          <button 
            className="button" 
            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
          >
            Previous
          </button>
          <span className="page-info">
            Page {currentPage} of {totalPages}
          </span>
          <button 
            className="button" 
            onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default Collections;