const accountServerInstance = new accountServer();
const authServerInstance = new dataServer();
function send(request) {
  if (request.errorLossAverage) {
    let num = Math.random() * 10
    if (num > 0 && num < request.errorLossAverage* 10) {
      console.log("error-no return")
      return;
    }
   
  }
  let delay = Math.random() * 1000 + 500;
  setTimeout(() => {
    let response = null;
    if (request.request.url.startsWith('/api/account')) {
      response = accountServerInstance.handle(request.request);
    } else if (request.request.url.startsWith('/api/auth')) {
      response = authServerInstance.handle(request.request);
    } else {
      response = { status: 404, responseText: 'Unknown endpoint' };
    }
    request.getResponse(response);

  }, delay);

}
