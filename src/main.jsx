import React from 'react';
import ReactDOM from 'react-dom/client';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import App from './App.jsx';
import Header from './Header.jsx';
import Footer from './Footer.jsx';
import './index.css';


const Home = () => <div>Home Page</div>;
const Pokedex = () => <div>Pokédex Page</div>;

function MainApp() {
  return (
    <HashRouter>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/App" element={<App />} />
        <Route path="/Pokedex" element={<Pokedex />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
      <Footer />
    </HashRouter>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <MainApp />
  </React.StrictMode>
);