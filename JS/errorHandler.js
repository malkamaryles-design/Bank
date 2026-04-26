// Error handling functions
const ErrorHandler = {
  handleAuthError: (status) => {
    switch (status) {
      case 409:
        alert('משתמש כבר קיים במערכת');
        break;
      case 404:
        alert('משתמש לא נמצא');
        break;
      case 401:
        alert('סיסמה או מספר זהות שגויים');
        break;
      case 400:
        alert('נתונים לא תקינים');
        break;
      case 500:
        alert('שגיאת שרת');
        break;
      default:
        alert('שגיאה לא צפויה');
    }
  },

  handleTransactionError: (status) => {
    switch (status) {
      case 402:
        alert('אין מספיק כסף בחשבון');
        break;
      case 404:
        alert('חשבון יעד לא נמצא');
        break;
      case 400:
        alert('לא ניתן להעביר לחשבון שלך');
        break;
      case 500:
        alert('שגיאת שרת');
        break;
      default:
        alert('שגיאה בביצוע הפעולה');
    }
  },

  handleDepositError: (status) => {
    switch (status) {
      case 404:
        alert('חשבון לא נמצא');
        break;
      case 500:
        alert('שגיאת שרת');
        break;
      default:
        alert('שגיאה בהפקדה');
    }
  },

  handleWithdrawError: (status) => {
    switch (status) {
      case 402:
        alert('אין מספיק כסף בחשבון');
        break;
      case 404:
        alert('חשבון לא נמצא');
        break;
      case 500:
        alert('שגיאת שרת');
        break;
      default:
        alert('שגיאה במשיכה');
    }
  },

  handleGenericError: (message) => {
    alert(message || 'שגיאה כללית');
  }
};