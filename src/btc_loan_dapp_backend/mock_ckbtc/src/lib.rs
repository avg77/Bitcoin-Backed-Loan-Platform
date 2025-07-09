use ic_cdk::api::caller;
use ic_cdk_macros::*;
use candid::{CandidType, Deserialize, Principal};
use std::cell::RefCell;
use std::collections::HashMap;

type Tokens = u64;

thread_local! {
    static BALANCES: RefCell<HashMap<Principal, Tokens>> = RefCell::new(HashMap::new());
}

#[update]
fn mint(to: Principal, amount: Tokens) {
    BALANCES.with(|b| {
        let mut balances = b.borrow_mut();
        let bal = balances.entry(to).or_insert(0);
        *bal += amount;
    });
}

#[update]
fn transfer(to: Principal, amount: Tokens) -> Result<(), String> {
    let from = caller();
    BALANCES.with(|b| {
        let mut balances = b.borrow_mut();
        let sender_balance = balances.entry(from).or_insert(0);
        if *sender_balance < amount {
            return Err("Insufficient balance".to_string());
        }
        *sender_balance -= amount;
        let receiver_balance = balances.entry(to).or_insert(0);
        *receiver_balance += amount;
        Ok(())
    })
}

#[query]
fn balance_of(user: Principal) -> Tokens {
    BALANCES.with(|b| *b.borrow().get(&user).unwrap_or(&0))
}
