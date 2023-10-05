export function isNameValid(f_name) {
  const pattern = /^[A-Za-z]+$/;

  return pattern.test(f_name) && f_name.length >= 2;
}

export function isUsmIDValid(id) {
  const pattern = /^\d{8}$/;

  // Check if the input matches the pattern
  return pattern.test(id);
}

export function isAgeValid(age) {
  let maxAge = 150;
  let minAge = 14;
  age = Number(age);

  // Check if age is a number and within the specified range
  return !isNaN(age) && age >= minAge && age <= maxAge;
}

export function isValidPhoneNumber(phoneNumber) {
  // Define a regular expression pattern for a U.S. phone number
  const pattern = /^\d{10}$/; // Matches exactly 10 digits

  // Use the test() method to check if the phoneNumber matches the pattern
  return pattern.test(phoneNumber);
}

export function isValidAddress(address) {
  const pattern = /^[A-Za-z0-9\s\.,#-]+$/;
  return pattern.test(address);
}

export function isValidEmail(email) {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/; // Basic email validation regex
  return emailRegex.test(email);
}

export function isValidPassword(password) {
  // Check if the password is at least 6 characters long
  if (password.length < 6) {
    return false;
  }

  // Use regular expressions to check for at least one letter and one number
  const letterPattern = /[a-zA-Z]/;
  const numberPattern = /[0-9]/;
  return letterPattern.test(password) && numberPattern.test(password);
}
