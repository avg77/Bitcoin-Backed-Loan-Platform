import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Navbar.css';

const Navbar = ({ showBack, onBack, onLogout }) => {
  const location = useLocation();

  return (
    <nav className="navbar">
      <div className="nav-left">
        <Link to="/dashboard" className="logo">BTC Collateral Hub</Link>
        <div className="nav-links">
          <Link to="/dashboard" className={location.pathname === '/dashboard' ? 'active' : ''}>Dashboard</Link>
          <Link to="/loan-actions" className={location.pathname === '/loan-actions' ? 'active' : ''}>Loan Actions</Link>
          <Link to="/loan-history" className={location.pathname === '/loan-history' ? 'active' : ''}>Loan History</Link>
        </div>
      </div>

      <div className="nav-right">
        {showBack && <button className="back-btn" onClick={onBack}>← Back</button>}
        <button className="logout-btn" onClick={onLogout}>Logout</button>
      </div>
    </nav>
  );
};

export default Navbar;
