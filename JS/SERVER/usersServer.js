class dataServer {
    constructor() {

    }
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
        try {
            switch (actionType) {
                case "signIn":
                    let result = this.checkSignIn(request);
                    return { status: 200, resultOfAction: result }
                case "logIn":
                    let loginResult = this.checkLoginDetails(request.body);
                    return { status: 200, resultOfAction: loginResult }
                    case "deleteUser":
                        deleteClient(request.body);
                        return { status: 200}
                default:
                    throw { status: 404 };
            }
        }
        catch (error) {
            return { status: error.status || 500 };
        }
    }
    checkSignIn(request) {
        let currentUserAccountNumber = getClientByID(request.body.idNumber);
        if (currentUserAccountNumber == null) {
            addClient(request.body);
            return { name: request.body.fullName, idNumber: request.body.idNumber }
        }
        else
            throw { status: 409 };

    }
    checkLoginDetails(details) {
        let checkClient = getClientByID(details.idNumber);
        if (!checkClient)
            throw { status: 404 };
        else if (checkClient.idNumber == details.idNumber && checkClient.password == details.password)
            return { idNumber: details.idNumber, name: checkClient.fullName };
        else
            throw { status: 401 };
    }
}