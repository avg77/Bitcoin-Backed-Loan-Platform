import React, { useEffect, useState } from "react";
import "./LoanHistory.css";
import initActors from './canisterConnection';


const LoanHistory = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchHistory() {
      try {
        const { loanActor } = await initActors();
        const data = await loanActor.get_loan_history();
        setHistory(data);
      } catch (error) {
        console.error("Failed to fetch loan history:", error);
      }
      setLoading(false);
    }
    fetchHistory();
  }, []);

  return (
    <section className="loan-history-container">
      <h2>Loan History</h2>
      {loading ? (
        <p className="loading-text">Loading history...</p>
      ) : history.length === 0 ? (
        <p className="empty-text">No loan activity found.</p>
      ) : (
        <ul className="history-list">
          {history.map(({ action, amount, timestamp }, index) => {
            const date = new Date(Number(timestamp) / 1_000_000);
            return (
              <li key={index} className="history-item slide-in delay-1">
                <div className="history-action">{action.replace(/_/g, " ").toUpperCase()}</div>
                <div className="history-amount">{amount.toLocaleString()}</div>
                <div className="history-date">{date.toLocaleString()}</div>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
};

export default LoanHistory;
