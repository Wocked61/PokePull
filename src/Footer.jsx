import React from 'react';
import './Footer.css';

function Footer() {
    return (
        <footer className="footer">
            <div className="footer-container">
                <div className='footer-content'>
                    <p className="footer-text"></p>
                </div>

                <div className="footer-content">
                    <p className="footer-text">This is a fan project and is not affiliated with Nintendo or The Pokémon Company.</p>
                    <p className="footer-text">Pokémon and Pokémon character names are trademarks of Nintendo.</p>
                    <p className="footer-text"></p>
                    <p className="footer-text">Powered by <a href="https://pokeapi.co/" target="_blank" rel="noopener noreferrer">PokéAPI</a></p>
                    <p className="footer-text">&copy; {new Date().getFullYear()} PokéPull. All rights reserved.</p>                    
                </div>
            </div>
        </footer>
    );
}

export default Footer;