import React from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';

const Layout = ({ children, onLogout }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const showBack = location.pathname !== '/dashboard';

  return (
    <>
      <Navbar showBack={showBack} onBack={() => navigate(-1)} onLogout={onLogout} />
      <main style={{ minHeight: '80vh' }}>{children}</main>
      <Footer />
    </>
  );
};

export default Layout;
