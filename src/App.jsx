// todo
// add consumable items that can increase shiny chance
// add consumable items that can get cards
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
import ultraballBounce from './assets/ultraBallSound.mp3';

function App() {
    const [currentPokemonId, setCurrentPokemonId] = useState(null);
    const [isShiny, setIsShiny] = useState(false);
    const [pokemonData, setPokemonData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [cooldown, setCooldown] = useState(false);
    const [collectedPokemon, setCollectedPokemon] = useState([]);
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
      return saved ? parseInt(saved) : 0;
    });
    const [luckIncenseActive, setLuckIncenseActive] = useState(false);
    const [luckIncenseTimeLeft, setLuckIncenseTimeLeft] = useState(0);

    const [sound] = useState(() => new Audio(yippeeSound));
    const [pullSound] = useState(() => new Audio(pokeballBounce));
    const [ultraPullSound] = useState(() => new Audio(ultraballBounce));

    const pokeballsPerInterval = 1 + pokeballUpgrade;
    const upgradeCost = 100 + (pokeballUpgrade * 200);
    const isMaxUpgrade = pokeballUpgrade >= 4;

    // Luck Incense timer effect
    useEffect(() => {
      let timer;
      if (luckIncenseActive && luckIncenseTimeLeft > 0) {
        timer = setInterval(() => {
          setLuckIncenseTimeLeft(prev => {
            if (prev <= 1) {
              setLuckIncenseActive(false);
              return 0;
            }
            return prev - 1;
          });
        }, 1000);
      }
      return () => clearInterval(timer);
    }, [luckIncenseActive, luckIncenseTimeLeft]);

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
      }
    };

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

    function playPullSound() {
      pullSound.currentTime = 0;
      pullSound.volume = 0.7;
      
      const playPromise = pullSound.play();
      
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            console.log("Pull sound played successfully");
          })
          .catch((error) => {
            console.error("Pull sound play error:", error);
          });
      }
    }

    function playUltraPullSound() {
      ultraPullSound.currentTime = 0;
      ultraPullSound.volume = 0.7;
      
      const playPromise = ultraPullSound.play();
      
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            console.log("Ultra pull sound played successfully");
          })
          .catch((error) => {
            console.error("Ultra pull sound play error:", error);
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
      setCollectedPokemon(collectedPokemon); // Update state
    }

    // Calculate collection stats
    const totalPokemon = 1025;
    const uniquePokemon = [...new Set(collectedPokemon.map(p => p.id))].length;
    const shinyCount = collectedPokemon.filter(p => p.isShiny).length;
    const completionPercentage = ((uniquePokemon / totalPokemon) * 100).toFixed(1);
    const shinyPercentage = ((shinyCount / totalPokemon) * 100).toFixed(1);

    function buyLuckIncense() {
      if (pokeballs >= 200 && !luckIncenseActive) {
        setPokeballs(prevPokeballs => prevPokeballs - 200);
        setLuckIncenseActive(true);
        setLuckIncenseTimeLeft(60); // 60 seconds = 1 minute
      }
    }

    function buyUltraBall() {
      if (pokeballs >= 100) {
        setPokeballs(prevPokeballs => prevPokeballs - 100);
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
      
      // Play appropriate pull sound
      if (useUltraBall) {
        playUltraPullSound();
      } else {
        playPullSound();
      }
      
      if (useUltraBall) {
        setUltraBalls(prevUltraBalls => prevUltraBalls - 1);
      } else {
        setPokeballs(prevPokeballs => prevPokeballs - 1);
      }
      
      const newRandomInt = getRandomIntInclusive(1, 1025);
      // Apply luck incense bonus (double shiny rate)
      let baseShinyChance = useUltraBall ? 0.05 : 0.01;
      const shinyChance = luckIncenseActive ? baseShinyChance * 2 : baseShinyChance;
      const Shiny = Math.random() < shinyChance;

      setCurrentPokemonId(newRandomInt);
      setIsShiny(Shiny);
      fetchPokemonData(newRandomInt);

      if (Shiny) {
        playSound();
        setPokeballs(prevPokeballs => prevPokeballs + 100);
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

    // Format time for display
    const formatTime = (seconds) => {
      const mins = Math.floor(seconds / 60);
      const secs = seconds % 60;
      return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    return (
      <div 
        className="app-background"
        style={{ backgroundImage: `url(${backgroundImage})` }}
      >

        {/* Collection Progress Display */}
        <div className="collection-progress">
          <div className="progress-header">
            <h3>Collection Progress</h3>
          </div>
          <div className="progress-stats">
            <div className="progress-stat">
              <span className="stat-label">Unique Pokémon:</span>
              <span className="stat-value">{uniquePokemon}/{totalPokemon}</span>
            </div>
            <div className="progress-stat">
              <span className="stat-label">Completion:</span>
              <span className="stat-value">{completionPercentage}%</span>
            </div>
            <div className="progress-stat">
              <span className="stat-label">Shinies:</span>
              <span className="stat-value">✨{shinyCount}</span>
            </div>
          </div>
          
          {/* Regular Progress Bar */}
          <div className="progress-bar-container">
            <div className="progress-bar">
              <div 
                className="progress-fill"
                style={{ width: `${completionPercentage}%` }}
              ></div>
            </div>
            <span className="progress-percentage">{completionPercentage}%</span>
          </div>

          {/* Shiny Progress Bar */}
          <div className="progress-bar-container shiny-container">
            <div className="progress-bar">
              <div 
                className="progress-fill-shiny"
                style={{ width: `${shinyPercentage}%` }}
              ></div>
            </div>
            <span className="progress-percentage shiny-text">{shinyPercentage}%</span>
          </div>
        </div>

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
            {luckIncenseActive && (
              <div className="luck-incense-status">
                🍀 Luck Active: {formatTime(luckIncenseTimeLeft)}
              </div>
            )}
          </div>

          {/* Upgrade buttons */}
          <div className="upgrade-container">
            <button 
              onClick={buyUltraBall}
              disabled={pokeballs < 100}
              className="buy-ultra-ball-btn"
            >
              Buy Ultra Ball (100 
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

            <button 
              onClick={buyLuckIncense}
              disabled={pokeballs < 200 || luckIncenseActive}
              className="luck-incense-btn"
            >
              {luckIncenseActive ? 'Luck Active!' : 'Luck Incense (200 '}
              {!luckIncenseActive && (
                <img 
                  src={pokeBall} 
                  alt="Pokeball" 
                  className="small-icon"
                />
              )}
              {!luckIncenseActive && ')'}
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
                 ) - {luckIncenseActive ? '2%' : '1%'} Shiny
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
                 ) - {luckIncenseActive ? '10%' : '5%'} Shiny
               </>}
            </button>
          </div>

        </div>
      </div>
    );
}

export default App;