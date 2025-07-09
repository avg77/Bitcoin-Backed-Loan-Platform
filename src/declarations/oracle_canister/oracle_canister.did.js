export const idlFactory = ({ IDL }) => {
  return IDL.Service({
    'get_price' : IDL.Func([], [IDL.Nat64], ['query']),
    'set_price' : IDL.Func([IDL.Nat64], [], []),
  });
};
export const init = ({ IDL }) => { return []; };
