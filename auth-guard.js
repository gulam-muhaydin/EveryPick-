// auth-guard.js
// Redirects to login page if user is not logged in
(function() {
  if (!localStorage.getItem('userEmail')) {
    // Save current page to redirect after login/signup
    const current = encodeURIComponent(window.location.pathname.replace(/^\//, ''));
    window.location.href = 'login.html?redirect=' + current;
  }
})();
