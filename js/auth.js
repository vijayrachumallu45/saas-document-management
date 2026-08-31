// DocFlow — Simple client-side auth (demo only)
// Uses localStorage. No backend, no real security.

const AUTH_KEY = 'docflow_user';

function getUser() {
  try {
    const data = localStorage.getItem(AUTH_KEY);
    return data ? JSON.parse(data) : null;
  } catch (e) {
    console.warn('Could not read user from localStorage', e);
    return null;
  }
}

function setUser(user) {
  try {
    localStorage.setItem(AUTH_KEY, JSON.stringify(user));
  } catch (e) {
    console.warn('Could not save user (private mode / quota?)', e);
    alert('Unable to save login. Please allow localStorage or disable private browsing.');
  }
}

function clearUser() {
  try {
    localStorage.removeItem(AUTH_KEY);
  } catch (e) {
    console.warn('Could not clear user', e);
  }
}

function isLoggedIn() {
  return !!getUser();
}

function isDashboardPage() {
  const path = (window.location.pathname || '').toLowerCase();
  const href = (window.location.href || '').toLowerCase();
  return path.endsWith('dashboard.html') || href.includes('dashboard.html');
}

// Protect dashboard — redirect to login if not authenticated
if (isDashboardPage() && !isLoggedIn()) {
  window.location.replace('index.html');
}

// ---------- DOM Ready ----------
document.addEventListener('DOMContentLoaded', () => {
  const loginForm = document.getElementById('loginForm');
  const registerForm = document.getElementById('registerForm');
  const showRegister = document.getElementById('showRegister');
  const showLogin = document.getElementById('showLogin');
  const loginSection = document.getElementById('login-form');
  const registerSection = document.getElementById('register-form');

  if (showRegister && loginSection && registerSection) {
    showRegister.addEventListener('click', (e) => {
      e.preventDefault();
      loginSection.classList.add('hidden');
      registerSection.classList.remove('hidden');
    });
  }

  if (showLogin && loginSection && registerSection) {
    showLogin.addEventListener('click', (e) => {
      e.preventDefault();
      registerSection.classList.add('hidden');
      loginSection.classList.remove('hidden');
    });
  }

  if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const emailEl = document.getElementById('email');
      const passEl = document.getElementById('password');
      if (!emailEl || !passEl) return;

      const email = emailEl.value.trim();
      const password = passEl.value;

      if (!email || !password) {
        alert('Please enter email and password');
        return;
      }

      // Demo: accept any credentials
      const rawName = email.split('@')[0] || 'User';
      const name = rawName.replace(/[._-]/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
      const user = {
        email,
        name: name || 'User',
        avatar: (name.charAt(0) || 'U').toUpperCase()
      };
      setUser(user);
      window.location.href = 'dashboard.html';
    });
  }

  if (registerForm) {
    registerForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const nameEl = document.getElementById('reg-name');
      const emailEl = document.getElementById('reg-email');
      const passEl = document.getElementById('reg-password');
      if (!nameEl || !emailEl || !passEl) return;

      const name = nameEl.value.trim();
      const email = emailEl.value.trim();
      const password = passEl.value;

      if (!name || !email || !password) {
        alert('Please fill all fields');
        return;
      }

      const user = {
        email,
        name,
        avatar: (name.charAt(0) || 'U').toUpperCase()
      };
      setUser(user);
      window.location.href = 'dashboard.html';
    });
  }
});
