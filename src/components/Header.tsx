import React, { useState } from 'react';

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const headerStyle: React.CSSProperties = {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    zIndex: 100,
    padding: '1.5rem 0',
    background: 'rgba(5, 5, 5, 0.8)',
    backdropFilter: 'blur(10px)',
    borderBottom: '1px solid rgba(255,255,255,0.05)',
  };

  const navContainerStyle: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  };

  const logoStyle: React.CSSProperties = {
    fontSize: '1.5rem',
    fontWeight: 700,
    letterSpacing: '2px',
    textTransform: 'uppercase',
  };

  const navLinksStyle: React.CSSProperties = {
    display: 'flex',
    gap: '3rem',
    display: window.innerWidth > 768 ? 'flex' : 'none', // Simple responsive handling for now
  };

  const linkStyle: React.CSSProperties = {
    fontSize: '0.875rem',
    fontWeight: 500,
    letterSpacing: '1px',
    textTransform: 'uppercase',
  };

  return (
    <header style={headerStyle}>
      <div className="container" style={navContainerStyle}>
        <div style={logoStyle}>Ride3D</div>
        
        <nav style={navLinksStyle}>
          <a href="#home" style={linkStyle}>Home</a>
          <a href="#models" style={linkStyle}>Motorcycles</a>
          <a href="#compare" style={linkStyle}>Compare</a>
          <a href="#about" style={linkStyle}>About</a>
        </nav>

        {/* Mobile menu button placeholder */}
        <div style={{ display: window.innerWidth <= 768 ? 'block' : 'none', cursor: 'pointer' }}>
           MENU
        </div>
      </div>
    </header>
  );
};

export default Header;
