class FXMLHttpRequest {
    constructor(errorLossAverage=0) {
        this.errorLossAverage=errorLossAverage;
        this.readyState = 0;
        this.status = 0;
        this.responseText = "";
        this.onreadystatechange = null;
        this.request = null;
    }

    open(type, url, sync) {
        this.request = {
            type: type,
            url: url,
            body: null,
            sync: sync
        };
        this.readyState = 1;
    }

    send(currentRequest, body = null) {
        this.request.body = body;
        this.readyState = 2;
        this.callOnReadyStateChange();
        send(currentRequest)
    }

    getResponse(serverResponse) {
        this.response = serverResponse;
        this.status =serverResponse.status;
        this.responseText = serverResponse.resultOfAction;
        this.readyState = 4;
        this.callOnReadyStateChange();
    }

    callOnReadyStateChange() {
        if (this.onreadystatechange) {
            this.onreadystatechange();
        }
    }
}
