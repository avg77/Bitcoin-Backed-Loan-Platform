export const idlFactory = ({ IDL }) => {
  return IDL.Service({
    'balance_of' : IDL.Func([IDL.Principal], [IDL.Nat64], ['query']),
    'mint' : IDL.Func([IDL.Principal, IDL.Nat64], [], []),
    'transfer' : IDL.Func(
        [IDL.Principal, IDL.Nat64],
        [IDL.Variant({ 'Ok' : IDL.Null, 'Err' : IDL.Text })],
        [],
      ),
  });
};
export const init = ({ IDL }) => { return []; };
