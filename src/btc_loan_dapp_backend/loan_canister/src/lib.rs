use ic_cdk::api::caller;
use ic_cdk_macros::*;
use candid::{CandidType, Deserialize, Principal};
use std::collections::HashMap;
use std::cell::RefCell;

#[derive(Hash, Eq, PartialEq, Debug, CandidType, Deserialize, Clone)]
struct User {
    id: Principal,
}

#[derive(Default, CandidType, Deserialize, Clone)]
struct LoanData {
    deposited_btc: u64,
    borrowed_iusd: u64,
}

#[derive(CandidType, Deserialize, Clone)]
struct LoanEvent {
    user: Principal,
    action: String,
    amount: u64,
    timestamp: u64,
}

thread_local! {
    static LOANS: RefCell<HashMap<User, LoanData>> = RefCell::new(HashMap::new());
    static LOAN_HISTORY: RefCell<Vec<LoanEvent>> = RefCell::new(Vec::new());
}

fn record_event(user: Principal, action: &str, amount: u64) {
    let event = LoanEvent {
        user,
        action: action.to_string(),
        amount,
        timestamp: ic_cdk::api::time(),
    };
    LOAN_HISTORY.with(|hist| hist.borrow_mut().push(event));
}

#[update]
fn deposit_btc(amount: u64) {
    let user = User { id: caller() };
    LOANS.with(|loans| {
        let mut loans = loans.borrow_mut();
        let entry = loans.entry(user.clone()).or_default();
        entry.deposited_btc += amount;
    });
    record_event(caller(), "deposit_btc", amount);
}

#[update]
fn borrow_iusd(amount: u64) {
    let user = User { id: caller() };
    LOANS.with(|loans| {
        let mut loans = loans.borrow_mut();
        let entry = loans.entry(user.clone()).or_default();
        entry.borrowed_iusd += amount;
    });
    record_event(caller(), "borrow_iusd", amount);
}

#[update]
fn repay_iusd(amount: u64) {
    let user = User { id: caller() };
    LOANS.with(|loans| {
        let mut loans = loans.borrow_mut();
        if let Some(entry) = loans.get_mut(&user) {
            if entry.borrowed_iusd >= amount {
                entry.borrowed_iusd -= amount;
            }
        }
    });
    record_event(caller(), "repay_iusd", amount);
}

#[query]
fn get_loan() -> Option<LoanData> {
    let user = User { id: caller() };
    LOANS.with(|loans| loans.borrow().get(&user).cloned())
}

#[query]
fn get_loan_history() -> Vec<LoanEvent> {
    let user = caller();
    LOAN_HISTORY.with(|hist| {
        hist.borrow()
            .iter()
            .filter(|e| e.user == user)
            .cloned()
            .collect()
    })
}
