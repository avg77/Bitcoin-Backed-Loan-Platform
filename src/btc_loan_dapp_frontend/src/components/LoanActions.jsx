import React, { useState, useEffect } from 'react';
import './LoanActions.css';
import initActors from './canisterConnection';
import { useAuth } from '../auth/AuthProvider';
import { Principal } from '@dfinity/principal';
import { canisterId as loanId } from '../../../declarations/loan_canister';

const LoanActions = () => {
  const [actors, setActors] = useState(null);
  const [amount, setAmount] = useState(0);
  const [status, setStatus] = useState('');
  const [btcBalance, setBtcBalance] = useState(null);
  const [iusdBalance, setIusdBalance] = useState(null);
  const { principal } = useAuth();

  useEffect(() => {
    initActors().then(setActors);
  }, []);

  const fetchBalances = async () => {
    if (!actors) return;

    const userPrincipal = Principal.fromText(principal);

    try {
      const btc = await actors.ckbtcActor.balance_of(userPrincipal);
      const iusd = await actors.iusdActor.balance_of(userPrincipal);
      setBtcBalance(Number(btc));
      setIusdBalance(Number(iusd));
    } catch (err) {
      console.error("Error fetching balances:", err);
    }
  };

  const handleAction = async (action) => {
    if (!actors) {
      setStatus("❌ Actors not initialized yet.");
      return;
    }

    try {
      const amt = BigInt(amount);
      if (!amt || amt <= 0n) throw new Error('Enter a valid amount');

      const userPrincipal = Principal.fromText(principal);

      if (action === 'mintBTC') {
        await actors.ckbtcActor.mint(userPrincipal, amt);
        setStatus(`✅ Minted ${amt} BTC`);
      } else if (action === 'deposit') {
        await actors.loanActor.deposit_btc(amt);
        setStatus(`✅ Deposited ${amt} BTC`);
      } else if (action === 'borrow') {
        await actors.loanActor.borrow_iusd(amt);
        await actors.iusdActor.mint(userPrincipal, amt);
        setStatus(`✅ Borrowed ${amt} iUSD`);
      } else if (action === 'repay') {
        const loanCanisterPrincipal = Principal.fromText(loanId);
        await actors.iusdActor.transfer(loanCanisterPrincipal, amt);
        await actors.loanActor.repay_iusd(amt);
        setStatus(`✅ Repaid ${amt} iUSD`);
      }

      // Refresh balances after action
      await fetchBalances();
    } catch (e) {
      setStatus(`❌ Error: ${e.message}`);
    }
  };

  useEffect(() => {
    if (actors) fetchBalances();
  }, [actors]);

  return (
    <div className="loan-actions-container">
      <h2>Loan Actions</h2>

      <div className="balance-info">
        <div className="balance-card">
          <span className="label">Your BTC Balance:</span>
          <span className="value">{btcBalance !== null ? `${btcBalance} BTC` : '...'}</span>
        </div>
        <div className="balance-card">
          <span className="label">Your iUSD Balance:</span>
          <span className="value">{iusdBalance !== null ? `${iusdBalance} iUSD` : '...'}</span>
        </div>
      </div>

      <div className="form-group">
        <label>Enter Amount</label>
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
      </div>

      <div className="loan-btns">
        <button onClick={() => handleAction('mintBTC')}>🪙 Mint BTC</button>
        <button onClick={() => handleAction('deposit')}>📥 Deposit BTC</button>
        <button onClick={() => handleAction('borrow')}>💳 Borrow iUSD</button>
        <button onClick={() => handleAction('repay')}>💰 Repay iUSD</button>
      </div>

      {status && <p className="status-message">{status}</p>}
    </div>
  );
};

export default LoanActions;

