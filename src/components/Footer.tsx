import React from 'react';

const Footer: React.FC = () => {
  const footerStyle: React.CSSProperties = {
    padding: '4rem 0',
    backgroundColor: 'var(--color-surface)',
    borderTop: '1px solid var(--color-border)',
  };

  const contentStyle: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: '2rem',
  };

  const logoStyle: React.CSSProperties = {
    fontSize: '1.25rem',
    fontWeight: 700,
    letterSpacing: '2px',
    textTransform: 'uppercase',
  };

  const linksStyle: React.CSSProperties = {
    display: 'flex',
    gap: '2rem',
  };

  return (
    <footer style={footerStyle}>
      <div className="container" style={contentStyle}>
        <div style={logoStyle}>Ride3D &copy; {new Date().getFullYear()}</div>
        <div style={linksStyle}>
          <a href="#" className="text-muted">Privacy Policy</a>
          <a href="#" className="text-muted">Terms of Service</a>
          <a href="#" className="text-muted">Contact</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
