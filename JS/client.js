localStorage.setItem('allClients','[]');
localStorage.setItem('allAccounts','[]');
let currentUser = null;
localStorage.setItem('currentUser',null)
function startApplication() {
  const app = document.getElementById("app");
  const routes = { login: "loginTemplate", signup: "signInTemplate", main: "mainTemplate" };

  function render(route) {
    const template = document.getElementById(routes[route]);
    if (!template) return console.error("No such route:", route);
    app.innerHTML = "";
    app.appendChild(template.content.cloneNode(true));

    if (route === "login") {
      const signUpLink = document.getElementById("goToSignUpLink");
      if (signUpLink) {
        signUpLink.addEventListener("click", (e) => {
          e.preventDefault();
          navigate("signup");
        });
      }
    }

    if (route === "signup") {
      const loginLink = document.getElementById("goToLoginLink");
      if (loginLink) {
        loginLink.addEventListener("click", (e) => {
          e.preventDefault();
          navigate("login");
        });
      }
    }

    if (route === "main" && currentUser) {
      updateCurrentUserScreen();
    }
  }

  function navigate(route, replace = false) {
    if (route === "main" && !currentUser) {
      route = "login";
    }

    if (replace) {
      history.replaceState({ route }, "", `#${route}`);
    } else {
      history.pushState({ route }, "", `#${route}`);
    }
    render(route);
  }

  window.addEventListener("popstate", (event) => {
    const route = event.state?.route || "login";
    if ((route === "login" || route === "signup") && currentUser) {
      currentUser = null;
      localStorage.removeItem('currentUser');
      render(route);
      setTimeout(() => {
        history.replaceState({ route }, "", `#${route}`);
      }, 0);
      return;
    }
    if (route === "main" && !currentUser) {
      navigate("login", true);
      return;
    }
    render(route);
  });

  window.addEventListener("load", function () {
    const hash = window.location.hash;
    if (currentUser) {
      const route = "main";
      history.replaceState({ route }, "", `#${route}`);
      render(route);
    } else {
      const route = hash.slice(1) || "login";
      if (route !== "login" && route !== "signup") {
        history.replaceState({ route: "login" }, "", "#login");
        render("login");
      } else {
        history.replaceState({ route }, "", `#${route}`);
        render(route);
      }
    }
  });


  const currentUserData = localStorage.getItem('currentUser');
  if (currentUserData) {
    try {
      currentUser = JSON.parse(currentUserData);
    } catch (e) {
      localStorage.removeItem('currentUser');
    }
  }

  if (!window.performance || window.performance.navigation.type !== 1) {
    const initialRoute = currentUser ? "main" : "login";
    history.replaceState({ route: initialRoute }, "", `#${initialRoute}`);
    render(initialRoute);
  }

  
  window.navigate = navigate;
}

function signIn() {
  const fullName = document.getElementById("signInNameInput").value.trim();
  const idNumber = document.getElementById("signInIdInput").value.trim();
  const address = document.getElementById("signInAddressInput").value.trim();
  const password = document.getElementById("signInPasswordInput").value;

  if (!Validator.validateRequired(fullName, 'שם מלא') ||
    !Validator.validateRequired(idNumber, 'תעודת זהות') ||
    !Validator.validateRequired(address, 'כתובת') ||
    !Validator.validateRequired(password, 'סיסמה') ||
    !Validator.validateIdNumber(idNumber) ||
    !Validator.validatePassword(password)) {
    return;
  }

  let body = {
    fullName: fullName,
    idNumber: idNumber,
    address: address,
    password: password
  };

  let fxhr = new FXMLHttpRequest(0);
  fxhr.open('POST', `/api/auth/signIn//`, true);
  fxhr.onreadystatechange = function () {
    if (fxhr.readyState === 4) {
      if (fxhr.status === 200) {
        createBankAccount(fxhr.responseText.idNumber);
      } else {
        ErrorHandler.handleAuthError(fxhr.status);
      }
    }
  };
  fxhr.send(fxhr, body);
}

function updateCurrentUserScreen() {
  const currentUserName = document.getElementById('currenUserName');
  const currentUserBalance = document.getElementById('currentUserBalance');
  const LoanEligibilityAmount = document.getElementById('LoanEligibilityAmount');

  if (currentUserName) currentUserName.innerText = currentUser.accountNumber;
  if (currentUserBalance) {
    const balance = currentUser.balance;
    currentUserBalance.innerText = balance < 0 ? `-${Math.abs(balance)}₪` : `${balance}₪`;
  }
  if (LoanEligibilityAmount)
    if (currentUser.LoanEligibilityAmount)
      LoanEligibilityAmount.innerText = currentUser.LoanEligibilityAmount + "₪";
    else
      LoanEligibilityAmount.innerText = "0₪"
  localStorage.setItem('currentUser', JSON.stringify(currentUser));
}

function logout() {
  currentUser = null;
  localStorage.removeItem('currentUser');
  navigate("login");
}

function createBankAccount(clientId) {
  let fxhr = new FXMLHttpRequest();
  fxhr.open('POST', `/api/account/createAccount//`, true);
  fxhr.onreadystatechange = function () {
    if (fxhr.readyState === 4) {
      if (fxhr.status === 200) {
        currentUser = fxhr.responseText;
        showWelcomeMessage(currentUser.accountNumber);
        setTimeout(() => navigate("main"), 3000);
      } else {
        ErrorHandler.handleGenericError('שגיאה ביצירת החשבון');
      }
    }
  };

  fxhr.send(fxhr, clientId);
}

function logIn() {
  const idNumber = document.getElementById("loginIdInput").value.trim();
  const password = document.getElementById("loginPasswordInput").value;

  if (!Validator.validateRequired(idNumber, 'תעודת זהות') ||
    !Validator.validateRequired(password, 'סיסמה') ||
    !Validator.validateIdNumber(idNumber)) {
    return;
  }

  let body = {
    idNumber: idNumber,
    password: password
  };

  let fxhr = new FXMLHttpRequest();
  fxhr.open('POST', `/api/auth/logIn//`, true);
  fxhr.onreadystatechange = function () {
    if (fxhr.readyState === 4) {
      if (fxhr.status === 200) {
        getUser(fxhr.responseText.idNumber);
      } else {
        ErrorHandler.handleAuthError(fxhr.status);
      }
    }
  };
  fxhr.send(fxhr, body);
}

function getUser(id) {
  let fxhr = new FXMLHttpRequest();
  fxhr.open('GET', `/api/account/getUser/${id}`, true);
  fxhr.onreadystatechange = function () {
    if (fxhr.readyState === 4) {
      if (fxhr.status === 200) {
        currentUser = fxhr.responseText;
        navigate("main");
      } else {
        ErrorHandler.handleGenericError('שגיאה בטעינת נתוני המשתמש');
      }
    }
  };
  fxhr.send(fxhr, null);
}

function transferMoney() {
  const amount = parseFloat(document.getElementById('transferAmount').value);
  const accountNumber = document.getElementById('addresseeAccount').value;

  if (!Validator.validateAmount(amount) || !Validator.validateAccountNumber(accountNumber)) {
    return;
  }

  let fxhr = new FXMLHttpRequest();
  fxhr.open('PUT', `/api/account/transfer/${currentUser.idNumber}`, true);
  fxhr.onreadystatechange = function () {
    if (fxhr.readyState === 4) {
      if (fxhr.status === 200) {
        updateAmounts(fxhr);
        updateCurrentUserScreen();
        alert('ההעברה בוצעה בהצלחה');
        document.getElementById('transferAmount').value = '';
        document.getElementById('addresseeAccount').value = '';
      } else {
        ErrorHandler.handleTransactionError(fxhr.status);
      }
    }
  };

  let body = {
    amount: amount,
    accountNumber: accountNumber,
  };
  fxhr.send(fxhr, body);
}

function deposit() {
  const amount = parseFloat(document.getElementById('depositAmount').value);
  if (!Validator.validateAmount(amount)) {
    return;
  }

  let fxhr = new FXMLHttpRequest();
  fxhr.open('PUT', `/api/account/deposit/${currentUser.idNumber}`, true);
  fxhr.onreadystatechange = function () {
    if (fxhr.readyState === 4) {
      if (fxhr.status === 200) {
        updateAmounts(fxhr);
        updateCurrentUserScreen();
        alert('ההפקדה בוצעה בהצלחה');
        document.getElementById('depositAmount').value = '';
      } else {
        ErrorHandler.handleDepositError(fxhr.status);
      }
    }
  };

  let body = { amount: amount };
  fxhr.send(fxhr, body);
}

function withdraw() {
  const amount = parseFloat(document.getElementById('withdrawAmount').value);
  if (!Validator.validateAmount(amount)) {
    return;
  }

  let fxhr = new FXMLHttpRequest();
  fxhr.open('PUT', `/api/account/withdraw/${currentUser.idNumber}`, true);
  fxhr.onreadystatechange = function () {
    if (fxhr.readyState === 4) {
      if (fxhr.status === 200) {
        updateAmounts(fxhr);
        updateCurrentUserScreen();
        alert('המשיכה בוצעה בהצלחה');
        document.getElementById('withdrawAmount').value = '';
      } else {
        ErrorHandler.handleWithdrawError(fxhr.status);
      }
    }
  };

  let body = { amount: amount };
  fxhr.send(fxhr, body);
}

function updateAmounts(request) {
  if (request.responseText) {
    currentUser.balance = request.responseText.balance;
    currentUser.LoanEligibilityAmount = request.responseText.Eligible;
  }
}

function openAccountHistory() {
  let fxhr = new FXMLHttpRequest();
  fxhr.open('GET', `/api/account/getHistory/${currentUser.idNumber}`, true);
  fxhr.onreadystatechange = function () {
    if (fxhr.readyState === 4) {
      if (fxhr.status === 200) {
        const historyList = document.getElementById('openAccountHistoryList');
        if (fxhr.responseText && Array.isArray(fxhr.responseText)) {
          historyList.innerHTML = fxhr.responseText.join("<br>");
        } else {
          historyList.innerHTML = '<p>אין פעולות קודמות</p>';
        }
      } else {
        ErrorHandler.handleGenericError('שגיאה בטעינת ההיסטוריה');
      }
    }
  };
  fxhr.send(fxhr, null);
}

function deleteUser() {
  if (!confirm('האם אתה בטוח שברצונך למחוק את החשבון?')) {
    return;
  }

  let fxhr = new FXMLHttpRequest();
  fxhr.open('DELETE', `/api/auth/deleteUser/${currentUser.idNumber}`, true);
  fxhr.onreadystatechange = function () {
    if (fxhr.readyState === 4) {
      if (fxhr.status === 200) {
        deleteAccount(currentUser.idNumber);
      } else {
        ErrorHandler.handleGenericError('שגיאה במחיקת המשתמש');
      }
    }
  };

  fxhr.send(fxhr, currentUser.idNumber);
}

function deleteAccount(idNumber) {
  let fxhr = new FXMLHttpRequest();
  fxhr.open('DELETE', `/api/account/deleteUser/${idNumber}`, true);
  fxhr.onreadystatechange = function () {
    if (fxhr.readyState === 4) {
      if (fxhr.status === 200) {
        currentUser = null;
        localStorage.removeItem('currentUser');
        alert('החשבון נמחק בהצלחה');
        navigate("login");
      } else {
        ErrorHandler.handleGenericError('שגיאה במחיקת החשבון');
      }
    }
  };
  fxhr.send(fxhr, idNumber);
}

function showWelcomeMessage(accountNumber) {
  const template = document.getElementById('welcomeTemplate');
  const welcomeDiv = document.importNode(template.content, true);

  welcomeDiv.querySelector('.account-number').textContent = accountNumber;

  document.body.appendChild(welcomeDiv);

  const overlay = document.querySelector('.welcome-overlay');
  setTimeout(() => {
    overlay.classList.add('fade-out');
    setTimeout(() => {
      document.body.removeChild(overlay);
    }, 500);
  }, 2500);
}



// Clear user only on browser close, not on refresh
window.addEventListener('beforeunload', function (e) {
  if (e.clientY < 0) {
    localStorage.removeItem('currentUser');
  }
});

// Initialize the application
startApplication();