import React from 'react';
import './App.css';

function App() {
  return (
    <div className="app-container">
      <h1>Welcome to PokéPull</h1>
      <p>This is the main PokéPull app page where you'll be able to view and open Pokémon card packs.</p>
      <div className="placeholder-content">
        <div className="placeholder-box">
          <h2>Featured Packs</h2>
          <p>Display featured card packs here</p>
        </div>
        <div className="placeholder-box">
          <h2>Recent Pulls</h2>
          <p>Show recent card pulls here</p>
        </div>
      </div>
    </div>
  );
}

export default App;