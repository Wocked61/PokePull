import React, { useState, useEffect } from 'react';
import './Collections.css';
import backgroundImage from './assets/Collection_BG.png';

const Collections = () => {
  return (
    <div className="home-background" style={{ 
      backgroundImage: `url(${backgroundImage})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      width: '100%',
      minHeight: '77vh'
    }}></div>
  );
}

export default Collections;