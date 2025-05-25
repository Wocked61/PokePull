import React from 'react';
import './App.css';
import backgroundImage from './assets/Box_Forest_background2.png';

function App() {

    function getRandomIntInclusive(min, max) {
      min = Math.ceil(min);
      max = Math.floor(max);
      return Math.floor(Math.random() * (max - min + 1)) + min;
    }
    
    let randomInt = getRandomIntInclusive(1, 1025);
    console.log(randomInt);

    function pullPokemon() {
      let randomInt = getRandomIntInclusive(1, 1025);
      console.log(`Pulling Pokémon with ID: ${randomInt}`);
    }

  return (
    <div style={{ 
      backgroundImage: `url(${backgroundImage})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      minHeight: '74vh'
    }}>

      <div className="App">
        <div className='button-container1'>
          <button className='button' onClick={() => pullPokemon()}>pull</button>
        </div>

      </div>
    </div>
  );
}

export default App;