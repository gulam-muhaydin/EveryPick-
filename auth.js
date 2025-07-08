// Simple authentication logic using localStorage

// Call this function to log in a user (save email)
function login(email) {
  localStorage.setItem('userEmail', email);
  window.dispatchEvent(new Event('user-auth-changed'));
}

// Call this function to log out a user
function logout() {
  localStorage.removeItem('userEmail');
  window.dispatchEvent(new Event('user-auth-changed'));
}

// Returns the logged-in user's email, or null if not logged in
function getCurrentUser() {
  return localStorage.getItem('userEmail');
}

// Make functions accessible globally
window.login = login;
window.logout = logout;
window.getCurrentUser = getCurrentUser;
