import React from "react";
import { FaFacebookF, FaInstagram, FaXTwitter, FaGithub } from "react-icons/fa6";
import "./Footer.css";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-grid">
        <div className="footer-section">
          <h3>BTCollat</h3>
          <p>Secure your BTC and borrow iUSD instantly. A blockchain-powered decentralized loan solution.</p>
        </div>

        <div className="footer-section">
          <h4>Navigation</h4>
          <ul>
            <li><a href="/dashboard">Dashboard</a></li>
            <li><a href="/loan-actions">Loan Actions</a></li>
            <li><a href="/loan-history">Loan History</a></li>
          </ul>
        </div>

        <div className="footer-section">
          <h4>Follow Us</h4>
          <div className="social-icons">
            <a href="#"><FaFacebookF /></a>
            <a href="#"><FaInstagram /></a>
            <a href="#"><FaXTwitter /></a>
            <a href="#"><FaGithub /></a>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        &copy; {new Date().getFullYear()} BTCollat. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
