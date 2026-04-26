// Validation functions
const Validator = {
  validateRequired: (value, fieldName) => {
    if (!value || !value.trim()) {
      alert(`יש למלא את השדה: ${fieldName}`);
      return false;
    }
    return true;
  },

  validateIdNumber: (idNumber) => {
    if (idNumber.length !== 9 || !/^\d+$/.test(idNumber)) {
      alert('תעודת זהות לא תקינה');
      return false;
    }
    return true;
  },

  validatePassword: (password) => {
    if (password.length < 8 || !/[A-Z]/.test(password) || !/[a-z]/.test(password) || !/[0-9]/.test(password) || !/[!@#$%&*]/.test(password)) {
      alert('סיסמה לא תקינה - חייבת להכיל לפחות 8 תווים, אות גדולה, אות קטנה, מספר וסימן מיוחד');
      return false;
    }
    return true;
  },

  validateAmount: (amount) => {
    if (!amount || amount <= 0) {
      alert('יש להזין סכום חיובי');
      return false;
    }
    return true;
  },

  validateAccountNumber: (accountNumber) => {
    if (!accountNumber) {
      alert('יש להזין מספר חשבון יעד');
      return false;
    }
    if (accountNumber.length !== 6 || !/^\d+$/.test(accountNumber)) {
      alert('מספר חשבון לא תקין - חייב להיות באורך 6 תווים ולכלול רק ספרות');
      return false;
    }
    return true;
  }
};