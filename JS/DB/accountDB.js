function getAllAccounts() {
    let allClientsData = localStorage.getItem('allAccounts');
    let allClientsArray = JSON.parse(allClientsData);
    if (!Array.isArray(allClientsArray))
        throw { status: 500 };
    return allClientsArray;
}
function getUserByAccountNumber(accountNumber, accountsArr) {
    let user = accountsArr.find(user => user.accountNumber === accountNumber);
    if (!user)
        throw { status: 404 }
    return user;
}
function getUserByIdNumber(id, accountsArr) {
    let user = accountsArr.find(user => user.idNumber === id);
    if (!user)
        throw { status: 404 }
    return user;
}

function changeBalance(account, amount, action) {
    if (action === "+") {
        account.balance += amount;
    } else if (action === "-") {
        account.balance -= amount;
    }
    else {
        throw { status: 400 };
    }
    return account.balance
}

function uptadeEligibleForLoanAmount(account) {
    if (account.balance < 0)
        account.LoanEligibilityAmount = 0;
    else
        account.LoanEligibilityAmount = Math.round(account.balance * 1.20);
    return account.LoanEligibilityAmount;
}

function updateAccountRecentAction(account, string){
 account.recentActions.push(string);
 return account.recentActions;
}
function setLocal(accounts) {
    localStorage.setItem('allAccounts', JSON.stringify(accounts));
}
function openAccount(id) {
    if (!id)
        throw { status: 400 };
    const accountArr = getAllAccounts();
    let account = {
        accountNumber: (100000 + accountArr.length + 1).toString(),
        idNumber: id,
        balance: 0,
        recentActions: [],
        LoanEligibilityAmount: 0
    }
    accountArr.push(account);
    setLocal(accountArr);
    return account
}
function deleteClientsAccount(idNumber) {
    const allClients = getAllAccounts();
    let updatedClientArr = allClients.filter(user => user.idNumber != idNumber);
    if (allClients == updatedClientArr)
        throw { status: 404 };
    setLocal(updatedClientArr);
}
