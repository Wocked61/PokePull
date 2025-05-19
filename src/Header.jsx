import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Header.css';
import logo from './assets/PokePull_Logo.png';

function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  const getPageTitle = () => {
    switch (location.pathname) {
      case '/':
        return 'Home';
      case '/App':
        return 'PokéPull';
      case '/Pokedex':
        return 'Pokédex';
      default:
        return 'Home';
    }
  };

  const toggleMenu = () => {
    setMenuOpen((prev) => !prev);
  };

  return (
    <header className="navbar">
      <div className="logo">
        <Link to="/">
          <img src={logo} alt="logo" />
          <h1> - {getPageTitle()} </h1>
        </Link>
      </div>
      <button
        className="toggle_btn"
        onClick={toggleMenu}
        aria-label="Toggle Navigation"
      >
        ☰
      </button>
      <ul className={`menu ${menuOpen ? "open" : ""}`}>
        <li><Link to="/">Home</Link></li>
        <li><Link to="/App">PokéPull</Link></li>
        <li><Link to="/Pokedex">Pokédex</Link></li>
      </ul>
    </header>
  );
}

export default Header;