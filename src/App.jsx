// todo
// add consumable items that can increase shiny chance
// add consumable items that can get cards
// add a limit
// upgrades to increase currency gain
// search bar for pokedex
// dropdown for pokemon types
// dropdown for pokemon


import React, { useEffect, useState } from 'react';
import './App.css';
import backgroundImage from './assets/Box_Forest_background2.png';
import pokeBall from './assets/pokeball.png';
import ultraBall from './assets/ultraball.png';
import yippeeSound from './assets/yippee.mp3';
import pokeballBounce from './assets/PokeballBounce.mp3';

function App() {
    const [currentPokemonId, setCurrentPokemonId] = useState(null);
    const [isShiny, setIsShiny] = useState(false);
    const [pokemonData, setPokemonData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [cooldown, setCooldown] = useState(false);
    const [pokeballs, setPokeballs] = useState(() => {
      const saved = localStorage.getItem('pokeballs');
      return saved ? parseFloat(saved) : 10;
    });
    const [ultraBalls, setUltraBalls] = useState(() => {
      const saved = localStorage.getItem('ultraBalls');
      return saved ? parseFloat(saved) : 0;
    });
    const [pokeballUpgrade, setPokeballUpgrade] = useState(() => {
      const saved = localStorage.getItem('pokeballUpgrade');
      return saved ? parseInt(saved) : 0; // 0 = base (1 per 5s), 1-4 = upgrade levels
    });

    const [sound] = useState(() => new Audio(yippeeSound));

    const pokeballsPerInterval = 1 + pokeballUpgrade;
    
    const upgradeCost = 100 + (pokeballUpgrade * 200);
    
    const isMaxUpgrade = pokeballUpgrade >= 4;

    useEffect(() => {
      const interval = setInterval(() => {
        setPokeballs(prevPokeballs => {
          const newAmount = prevPokeballs + pokeballsPerInterval;
          localStorage.setItem('pokeballs', newAmount.toString());
          return newAmount;
        });
      }, 5000); // 5000 = 5 seconds

      return () => clearInterval(interval);
    }, [pokeballsPerInterval]);

    useEffect(() => {
      localStorage.setItem('pokeballs', pokeballs.toString());
    }, [pokeballs]);

    useEffect(() => {
      localStorage.setItem('ultraBalls', ultraBalls.toString());
    }, [ultraBalls]);

    useEffect(() => {
      localStorage.setItem('pokeballUpgrade', pokeballUpgrade.toString());
    }, [pokeballUpgrade]);

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

    function buyUltraBall() {
      if (pokeballs >= 200) {
        setPokeballs(prevPokeballs => prevPokeballs - 200);
        setUltraBalls(prevUltraBalls => prevUltraBalls + 1);
      }
    }

    function buyPokeballUpgrade() {
      if (pokeballs >= upgradeCost && !isMaxUpgrade) {
        setPokeballs(prevPokeballs => prevPokeballs - upgradeCost);
        setPokeballUpgrade(prevUpgrade => prevUpgrade + 1);
      }
    }

    function pullPokemon(useUltraBall = false) {
      const cost = useUltraBall ? 1 : 1;
      const currency = useUltraBall ? ultraBalls : pokeballs;
      
      if (cooldown || currency < cost) return;

      setCooldown(true);
      
      if (useUltraBall) {
        setUltraBalls(prevUltraBalls => prevUltraBalls - 1);
      } else {
        setPokeballs(prevPokeballs => prevPokeballs - 1);
      }
      
      const newRandomInt = getRandomIntInclusive(1, 1025);
      const shinyChance = useUltraBall ? 0.05 : 0.01; // 5% vs 1%
      const Shiny = Math.random() < shinyChance;

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


  return (
    <div 
      className="app-background"
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >

      <div className="App">
        {/* Currency display */}
        <div className="currency-display">
          <div className="currency-item">
            <img 
              src={pokeBall} 
              alt="Pokeball" 
              className="currency-icon"
            />
            {pokeballs.toFixed(1)} Pokéballs
          </div>
          <div className="currency-item">
            <img 
              src={ultraBall} 
              alt="Ultra Ball" 
              className="currency-icon"
            />
            {ultraBalls.toFixed(1)} Ultra Balls
          </div>
          <div className="generation-rate">
            rate : {pokeballsPerInterval} Pokéballs/5s
          </div>
        </div>

        {/* Upgrade buttons */}
        <div className="upgrade-container">
          <button 
            onClick={buyUltraBall}
            disabled={pokeballs < 200}
            className="buy-ultra-ball-btn"
          >
            Buy Ultra Ball (200 
            <img 
              src={pokeBall} 
              alt="Pokeball" 
              className="small-icon"
            />
            )
          </button>
          
          <button 
            onClick={buyPokeballUpgrade}
            disabled={pokeballs < upgradeCost || isMaxUpgrade}
            className="upgrade-btn"
          >
            {isMaxUpgrade ? 'Max Upgrade!' : 
             `Upgrade Rate (${upgradeCost} `}
            {!isMaxUpgrade && (
              <img 
                src={pokeBall} 
                alt="Pokeball" 
                className="small-icon"
              />
            )}
            {!isMaxUpgrade && ')'}
          </button>
        </div>

        <div className='box'>
          {loading ? (
            <div className='loading'>Loading...</div>
          ) : pokemonData ? (
            <>
              <img className='pokemon-image'
                src={isShiny 
                  ? pokemonData?.sprites?.front_shiny || `https://pokeapi.co/media/sprites/pokemon/shiny/${currentPokemonId}.png`
                  : pokemonData?.sprites?.front_default || `https://pokeapi.co/media/sprites/pokemon/${currentPokemonId}.png`
                } 
                alt={`${isShiny ? 'Shiny ' : ''}${pokemonData?.name || 'Pokemon'} ${currentPokemonId}`} 
              />
              <div className="pokemon-info">
                <h3>{pokemonData.name} {isShiny && '✨'}</h3>
                <p>#{pokemonData.id}</p>
                <p>Type: {pokemonData.types.map(type => type.type.name).join(', ')}</p>
              </div>
            </>
          ) : (
            <div className="no-pokemon">
              <p>Press a pull button to catch a Pokémon!</p>
            </div>
          )}
        </div>
        <div className='button-container1'>
          <button 
            className='button pull-button regular' 
            onClick={() => pullPokemon(false)} 
            disabled={loading || cooldown || pokeballs < 1}
            style={{ opacity: pokeballs < 1 ? 0.5 : 1 }}
          >
            {loading ? 'Pulling...' : 
             cooldown ? 'Cooldown...' : 
             pokeballs < 1 ? 'Need Pokéballs!' : 
             <>
               Pull (1 
               <img 
                 src={pokeBall} 
                 alt="Pokeball" 
                 className="button-icon"
               />
               ) - 1% Shiny
             </>}
          </button>
          
          <button 
            className='button pull-button ultra' 
            onClick={() => pullPokemon(true)} 
            disabled={loading || cooldown || ultraBalls < 1}
            style={{ opacity: ultraBalls < 1 ? 0.5 : 1 }}
          >
            {loading ? 'Pulling...' : 
             cooldown ? 'Cooldown...' : 
             ultraBalls < 1 ? 'Need Ultra Balls!' : 
             <>
               Ultra Pull (1 
               <img 
                 src={ultraBall} 
                 alt="Ultra Ball" 
                 className="button-icon"
               />
               ) - 5% Shiny
             </>}
          </button>
        </div>

      </div>
    </div>
  );
}

export default App;