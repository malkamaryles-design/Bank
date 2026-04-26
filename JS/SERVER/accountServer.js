
class accountServer {
    constructor() { }
    splitUrlParts(url) {
        let urlParts = url.split('/');
        return urlParts;
    }

    handle(request) {
        if (!request.url) {
            throw { status: 400 };
        }
        const urlParts = this.splitUrlParts(request.url);
        const actionType = urlParts[3]
        const currentUserAccountNumber = urlParts[4];
        try {
            switch (request.type) {

                case 'PUT':
                    let putResult = this.handlePutActions(request, currentUserAccountNumber, actionType);
                    return putResult;

                case "GET":
                    let getResult = this.handleGetActions(actionType, currentUserAccountNumber);
                    return getResult;

                case "POST":
                    let postResult = openAccount(request.body);
                    return { status: 200, resultOfAction: postResult };

                case "DELETE":
                    deleteClientsAccount(currentUserAccountNumber);
                    return { status: 200 }

                default:
                    throw { status: 405 };
            }
        }
        catch (error) {
            return { status: error.status || 500 };
        }
    }

    handleGetActions(actionType, idOrAccountNumber) {
        const accountsArr = getAllAccounts();
        switch (actionType) {
            case 'getHistory': {
                const account = getUserByIdNumber(idOrAccountNumber, accountsArr);
                return { status: 200, resultOfAction: account.recentActions };
            }
            case 'getUser': {
                const user = getUserByIdNumber(idOrAccountNumber, accountsArr);
                return { status: 200, resultOfAction: user };
            }
            default:
                throw { status: 400 };
        }
    }

    handlePutActions(request, accountNumber, action) {

        const amount = parseInt(request.body.amount, 10);
        const accountsArr = getAllAccounts();
        const currentAccount = getUserByIdNumber(accountNumber, accountsArr);
        if (!currentAccount)
            throw { status: 404 };

        let updatedBalance = null;
        let updatedEligible = null;
        let response;

        switch (action) {
            case "transfer":
                const addresseeAccount = getUserByAccountNumber(request.body.accountNumber, accountsArr);
                if (currentAccount == addresseeAccount)
                    throw { status: 400 };
                if (addresseeAccount == null)
                    throw { status: 404 };
                if (currentAccount.balance - amount < -20000)
                    throw { status: 402 };
                updatedBalance = changeBalance(currentAccount, amount, '-');
                updatedEligible = uptadeEligibleForLoanAmount(currentAccount)
                updateAccountRecentAction(currentAccount, `העברה של ${amount}₪ לחשבון ${addresseeAccount.accountNumber}`);
                changeBalance(addresseeAccount, amount, '+');
                uptadeEligibleForLoanAmount(addresseeAccount)
                updateAccountRecentAction(addresseeAccount, `קבלת העברה של ${amount}₪ מחשבון ${currentAccount.accountNumber}`);
                setLocal(accountsArr);
                response = { balance: updatedBalance, Eligible: updatedEligible };
                return { status: 200, resultOfAction: response };
            case "deposit":
                updatedBalance = changeBalance(currentAccount, amount, '+');
                updatedEligible = uptadeEligibleForLoanAmount(currentAccount);
                updateAccountRecentAction(currentAccount, `הפקדה של ${amount}₪`);
                setLocal(accountsArr);
                response = { balance: updatedBalance, Eligible: updatedEligible };
                return { status: 200, resultOfAction: response };
            case "withdraw":
                if (currentAccount.balance - amount < -20000)
                   throw { status: 402 };
                updatedBalance = changeBalance(currentAccount, amount, '-');
                updatedEligible = uptadeEligibleForLoanAmount(currentAccount)
                updateAccountRecentAction(currentAccount, `משיכה של ${amount}₪`);
                setLocal(accountsArr);
                response = { balance: updatedBalance, Eligible: updatedEligible };
                return { status: 200, resultOfAction: response };
            default:
                throw { status: 400 };

        }

    }


    getAccountHistory(accountNumber) {
        const accountsArr = getAllAccounts();
        const currentAccountHistory = getUserByIdNumber(accountNumber, accountsArr);//other key in local?
        return { status: 200, resultOfAction: currentAccountHistory };
    }
}

