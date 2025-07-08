
// Navbar dropdown logic
const accountBtn = document.querySelector('.account-btn');
document.addEventListener('DOMContentLoaded', function() {
  const accountBtn = document.querySelector('.account-btn');
  const accountDropdown = document.querySelector('.account-dropdown');
  const navbarAccount = document.querySelector('.navbar-account');
  const hamburgerBtn = document.querySelector('.navbar-hamburger');
  const linksContainer = document.querySelector('.navbar-links-container');
  const closeBtn = document.querySelector('.navbar-close');

  if (!accountBtn || !accountDropdown || !navbarAccount) {
    console.error('Navbar: Required elements missing.');
    return;
  }

  function renderAccountDropdown() {
    // Always use the global function from auth.js
    const getCurrentUser = window.getCurrentUser;
    const userEmail = getCurrentUser ? getCurrentUser() : null;
    if (userEmail) {
      accountDropdown.innerHTML = `
        <div class="account-email">${userEmail}</div>
        <button class="logout-btn" id="logout-link">Logout</button>
      `;
      const logoutLink = accountDropdown.querySelector('#logout-link');
      if (logoutLink) {
        logoutLink.addEventListener('click', function(e) {
          e.preventDefault();
          if (window.logout) window.logout();
          // UI will update via event listener, no need to call renderAccountDropdown here
        });
      }
    } else {
      accountDropdown.innerHTML = `
        <button id="signup-btn">Sign Up</button>
        <button id="login-btn">Login</button>
      `;
      const signupBtn = accountDropdown.querySelector('#signup-btn');
      const loginBtn = accountDropdown.querySelector('#login-btn');
      if (signupBtn) {
        signupBtn.addEventListener('click', function() {
          window.location.href = 'signup.html';
        });
      }
      if (loginBtn) {
        loginBtn.addEventListener('click', function() {
          window.location.href = 'login.html';
        });
      }
    }
  }

  // Initial render
  renderAccountDropdown();
  // Re-render on storage change (multi-tab)
  window.addEventListener('storage', function(e) {
    if (e.key === 'userEmail') renderAccountDropdown();
  });
  // Re-render on custom auth event (login, signup, logout)
  window.addEventListener('user-auth-changed', renderAccountDropdown);

  // Dropdown open/close logic
  accountBtn.addEventListener('click', function(e) {
    e.stopPropagation();
    navbarAccount.classList.toggle('open');
  });

  document.addEventListener('click', function(e) {
    if (
      navbarAccount &&
      !accountBtn.contains(e.target) &&
      !accountDropdown.contains(e.target)
    ) {
      navbarAccount.classList.remove('open');
    }
    if (
      linksContainer &&
      hamburgerBtn &&
      !linksContainer.contains(e.target) &&
      !hamburgerBtn.contains(e.target)
    ) {
      linksContainer.classList.remove('open');
    }
  });

  window.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
      navbarAccount.classList.remove('open');
      linksContainer && linksContainer.classList.remove('open');
    }
  });

  // Hamburger menu logic
  if (hamburgerBtn && linksContainer) {
    hamburgerBtn.addEventListener('click', function(e) {
      e.stopPropagation();
      linksContainer.classList.toggle('open');
    });
  }
  if (closeBtn && linksContainer) {
    closeBtn.addEventListener('click', function(e) {
      e.stopPropagation();
      linksContainer.classList.remove('open');
    });
  }
});

// (No code below this line)
