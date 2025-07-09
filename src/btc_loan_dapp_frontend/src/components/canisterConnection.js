import { Actor, HttpAgent } from '@dfinity/agent';
import { idlFactory as loanIdl, canisterId as loanId } from '../../../declarations/loan_canister';
import { idlFactory as ckbtcIdl, canisterId as ckbtcId } from '../../../declarations/mock_ckbtc';
import { idlFactory as iusdIdl, canisterId as iusdId } from '../../../declarations/mock_iusd';
import { idlFactory as oracleIdl, canisterId as oracleId } from '../../../declarations/oracle_canister';

const agent = new HttpAgent();

async function initActors() {
  if (process.env.DFX_NETWORK === 'local' || process.env.NODE_ENV !== 'production') {
    await agent.fetchRootKey();
  }

  const loanActor = Actor.createActor(loanIdl, {
    agent,
    canisterId: loanId,
  });

  const ckbtcActor = Actor.createActor(ckbtcIdl, {
    agent,
    canisterId: ckbtcId,
  });

  const iusdActor = Actor.createActor(iusdIdl, {
    agent,
    canisterId: iusdId,
  });

  const oracleActor = Actor.createActor(oracleIdl, {
    agent,
    canisterId: oracleId,
  });

  return { loanActor, ckbtcActor, iusdActor, oracleActor };
}

export default initActors;
