export const idlFactory = ({ IDL }) => {
  const LoanData = IDL.Record({
    'deposited_btc' : IDL.Nat64,
    'borrowed_iusd' : IDL.Nat64,
  });
  const LoanEvent = IDL.Record({
    'action' : IDL.Text,
    'user' : IDL.Principal,
    'timestamp' : IDL.Nat64,
    'amount' : IDL.Nat64,
  });
  return IDL.Service({
    'borrow_iusd' : IDL.Func([IDL.Nat64], [], []),
    'deposit_btc' : IDL.Func([IDL.Nat64], [], []),
    'get_loan' : IDL.Func([], [IDL.Opt(LoanData)], ['query']),
    'get_loan_history' : IDL.Func([], [IDL.Vec(LoanEvent)], ['query']),
    'repay_iusd' : IDL.Func([IDL.Nat64], [], []),
  });
};
export const init = ({ IDL }) => { return []; };
