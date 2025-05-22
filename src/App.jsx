import React from 'react';
import './App.css';
import backgroundImage from './assets/Box_Forest_background2.png';

function App() {
  return (
    <div style={{ 
      backgroundImage: `url(${backgroundImage})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      minHeight: '100vh'
    }}>

      <div className="App">
        <div className='button-container1'>
          <button className='button'>pull</button>
        </div>

      </div>
    </div>
  );
}

export default App;