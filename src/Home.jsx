import React from 'react';
import './Home.css';


function Home() {
  return (
    <div className="home-container">
      <h1>Welcome to PokéPull</h1>
      <p>This is the Home PokéPull app page where</p>
      <div className="placeholder-content">

        <div className="placeholder-box" onClick={() => window.location.href = '/App#/App'}>
          <h2>Start Pulling</h2>
          <p>Spin for Pokemon here</p>
        </div>

        <div className="placeholder-box" onClick={() => window.location.href = '/App#/Pokedex'}>
          <h2>PokeDex</h2>
          <p>See all available Pokemon here</p>
        </div>

      </div>
    </div>

  );
}

export default Home;