import React, { useEffect, useState } from "react";
import './Dashboard.css';
import initActors from "./canisterConnection";
import { Principal } from "@dfinity/principal"; 

const Dashboard = ({ principal, onLogout }) => {
  const [actors, setActors] = useState(null);
  const [loan, setLoan] = useState(null);
  const [btcBalance, setBtcBalance] = useState(0);
  const [iusdBalance, setIusdBalance] = useState(0);
  const [price, setPrice] = useState(0);

  const shortPrincipal = principal ? `${principal.slice(0, 5)}...${principal.slice(-5)}` : "";
  const principalObj = Principal.fromText(principal);

  useEffect(() => {
    initActors().then(({ loanActor, ckbtcActor, iusdActor, oracleActor }) => {
      setActors({ loanActor, ckbtcActor, iusdActor, oracleActor });
    });
  }, []);

  useEffect(() => {
    if (!actors) return;

    async function fetchData() {
      try {
        const [loanData, btc, iusd, btcPrice] = await Promise.all([
          actors.loanActor.get_loan(),
          actors.ckbtcActor.balance_of(principalObj),
          actors.iusdActor.balance_of(principalObj),
          actors.oracleActor.get_price()
        ]);

        setLoan(loanData[0]);
        setBtcBalance(Number(btc));
        setIusdBalance(Number(iusd));
        setPrice(Number(btcPrice));

      } catch (err) {
        console.error("Failed to fetch dashboard data:", err);
      }
    }

    fetchData();
  }, [actors, principal]);

  if (!actors) return <div className="loading-text">Loading dashboard...</div>;

  return (
    <main className="dashboard-container">
      <h2 className="dashboard-title">👋 Welcome, {shortPrincipal}</h2>

      <div className="loan-actions-button-wrapper">
        <a className="navigate-button" href="/loan-actions">➕ Loan Actions</a>
        <a className="navigate-button" href="/loan-history">📜 Loan History</a>
        <button className="logout-button" onClick={onLogout}>🚪 Logout</button>
      </div>

      <div className="cards-wrapper">
        <div className="card slide-in delay-1">
          <h3>💹 Live BTC Price</h3>
          <p>₹ {(price / 100).toLocaleString()}</p>
        </div>

        <div className="card slide-in delay-2">
          <h3>🧾 Your Balances</h3>
          <p>BTC: {btcBalance}</p>
          <p>iUSD: {iusdBalance}</p>
        </div>

        <div className="card slide-in delay-3">
          <h3>🏦 Your Loan</h3>
          {loan ? (
  <>
    <p>Deposited BTC: {(Number(loan.deposited_btc))} BTC</p>
    <p>Borrowed iUSD: {(Number(loan.borrowed_iusd))} iUSD</p>
  </>
) : <p>No loan data</p>}

        </div>
      </div>
    </main>
  );
};

export default Dashboard;

