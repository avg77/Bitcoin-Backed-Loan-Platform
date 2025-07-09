import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';
import type { IDL } from '@dfinity/candid';

export interface LoanData { 'deposited_btc' : bigint, 'borrowed_iusd' : bigint }
export interface LoanEvent {
  'action' : string,
  'user' : Principal,
  'timestamp' : bigint,
  'amount' : bigint,
}
export type User = Principal;
export interface _SERVICE {
  'borrow_iusd' : ActorMethod<[bigint], undefined>,
  'deposit_btc' : ActorMethod<[bigint], undefined>,
  'get_loan' : ActorMethod<[], [] | [LoanData]>,
  'get_loan_history' : ActorMethod<[], Array<LoanEvent>>,
  'repay_iusd' : ActorMethod<[bigint], undefined>,
}
export declare const idlFactory: IDL.InterfaceFactory;
export declare const init: (args: { IDL: typeof IDL }) => IDL.Type[];
