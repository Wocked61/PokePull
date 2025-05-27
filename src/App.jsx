// todo
// add currency to the pull button
// regular pokemon give 0.5
// shiny pokemon give 100
// can use currency to buy pulls
// add consumable items that can increase shiny chance
// add consumable items that can get cards
// add a limit
// base currency is 10
// every 5 seconds you get 1 currency
// upgrades to increase currency gain
// search bar for pokedex
// dropdown for pokemon types
// dropdown for pokemon


import React, { useEffect, useState } from 'react';
import './App.css';
import backgroundImage from './assets/Box_Forest_background2.png';
import pokeBall from './assets/pokeball.png';
import yippeeSound from './assets/yippee.mp3';

function App() {
    const [currentPokemonId, setCurrentPokemonId] = useState(() => getRandomIntInclusive(1, 1025));
    const [isShiny, setIsShiny] = useState(false);
    const [pokemonData, setPokemonData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [cooldown, setCooldown] = useState(false);
    const [pokeballs, setPokeballs] = useState(() => {
      const saved = localStorage.getItem('pokeballs');
      return saved ? parseFloat(saved) : 10;
    });

    const [sound] = useState(() => new Audio(yippeeSound));


    useEffect(() => {
      const interval = setInterval(() => {
        setPokeballs(prevPokeballs => {
          const newAmount = prevPokeballs + 1;
          localStorage.setItem('pokeballs', newAmount.toString());
          return newAmount;
        });
      }, 5000); // 5000 = 5 seconds

      return () => clearInterval(interval);
    }, []);

    useEffect(() => {
      localStorage.setItem('pokeballs', pokeballs.toString());
    }, [pokeballs]);

    function playSound() {
      sound.currentTime = 0;
      sound.volume = 0.5;
      

      const playPromise = sound.play();
      
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            console.log("Sound played successfully");
          })
          .catch((error) => {
            console.error("Sound play error:", error);
          });
      }
    }

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

    function savePokemonToCollection(pokemon, isShiny) {
      const collectedPokemon = JSON.parse(localStorage.getItem('collectedPokemon')) || [];
      
      const pokemonEntry = {
        id: pokemon.id,
        name: pokemon.name,
        sprite: isShiny ? pokemon.sprites.front_shiny : pokemon.sprites.front_default,
        isShiny: isShiny,
        dateCaught: new Date().toISOString(),
        types: pokemon.types.map(type => type.type.name)
      };

      const existingIndex = collectedPokemon.findIndex(p => 
        p.id === pokemon.id && p.isShiny === isShiny
      );

      if (existingIndex !== -1) {
        collectedPokemon[existingIndex].count = (collectedPokemon[existingIndex].count || 1) + 1;
      } else {
        pokemonEntry.count = 1;
        collectedPokemon.push(pokemonEntry);
      }

      localStorage.setItem('collectedPokemon', JSON.stringify(collectedPokemon));
    }

    function pullPokemon() {
      if (cooldown || pokeballs < 1) return;

      setCooldown(true);
      
      setPokeballs(prevPokeballs => prevPokeballs - 1);
      
      const newRandomInt = getRandomIntInclusive(1, 1025);
      const Shiny = Math.random() < 0.01;

      setCurrentPokemonId(newRandomInt);
      setIsShiny(Shiny);
      fetchPokemonData(newRandomInt);
      

      if (Shiny) {
        playSound();
        setPokeballs(prevPokeballs => prevPokeballs + 100); // 100 pokeballs for shiny
        console.log(`Shiny Pokémon pulled with ID: ${newRandomInt} - Gained 100 pokeballs!`);
      } else {
        console.log(`Regular Pokémon pulled with ID: ${newRandomInt}`);
      }

      setTimeout(() => {
        setCooldown(false);
      }, 500);
    }

    useEffect(() => {
      if (pokemonData) {
        savePokemonToCollection(pokemonData, isShiny);
      }
    }, [pokemonData, isShiny]);

    useEffect(() => {
      fetchPokemonData(currentPokemonId);
    }, []);

  return (
    <div style={{ 
      backgroundImage: `url(${backgroundImage})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      minHeight: '77vh'
    }}>

      <div className="App">
        {/* Currency display */}
        <div className="currency-display" style={{
          position: 'absolute',
          top: '20px',
          right: '20px',
          background: 'rgba(0, 0, 0, 0.8)',
          color: 'white',
          padding: '10px 15px',
          borderRadius: '10px',
          fontSize: '18px',
          fontWeight: 'bold',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          <img 
            src={pokeBall} 
            alt="Pokeball" 
            style={{
              width: '20px',
              height: '20px',
              borderRadius: '50%'
            }}
          />
          {pokeballs.toFixed(1)} Pokéballs
        </div>

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
                  <h3>{pokemonData.name} {isShiny && '✨'}</h3>
                  <p>#{pokemonData.id}</p>
                  <p>Type: {pokemonData.types.map(type => type.type.name).join(', ')}</p>
                </div>
              )}
            </>
          )}
        </div>
        <div className='button-container1'>
          <button 
            className='button' 
            onClick={pullPokemon} 
            disabled={loading || cooldown || pokeballs < 1}
            style={{
              opacity: pokeballs < 1 ? 0.5 : 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px'
            }}
          >
            {loading ? 'Pulling...' : 
             cooldown ? 'Cooldown...' : 
             pokeballs < 1 ? 'Need Pokéballs!' : 
             <>
               Pull (1 
               <img 
                 src={pokeBall} 
                 alt="Pokeball" 
                 style={{
                   width: '16px',
                   height: '16px',
                   borderRadius: '50%',
                   marginLeft: '4px'
                 }}
               />
               )
             </>}
          </button>
        </div>

      </div>
    </div>
  );
}

export default App;