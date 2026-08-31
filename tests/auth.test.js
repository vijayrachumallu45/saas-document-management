/**
 * Simple auth helper tests (no external test framework required)
 * Run: node tests/auth.test.js
 */

const assert = require('assert');

// Minimal localStorage mock for Node
const store = {};
global.localStorage = {
  getItem(key) { return store[key] || null; },
  setItem(key, value) { store[key] = String(value); },
  removeItem(key) { delete store[key]; },
  clear() { Object.keys(store).forEach(k => delete store[k]); }
};

// Load auth helpers by evaluating the core functions
const AUTH_KEY = 'docflow_user';

function getUser() {
  try {
    const data = localStorage.getItem(AUTH_KEY);
    return data ? JSON.parse(data) : null;
  } catch {
    return null;
  }
}

function setUser(user) {
  localStorage.setItem(AUTH_KEY, JSON.stringify(user));
}

function clearUser() {
  localStorage.removeItem(AUTH_KEY);
}

function isLoggedIn() {
  return !!getUser();
}

// ---------- Tests ----------
let passed = 0;
let failed = 0;

function test(name, fn) {
  try {
    fn();
    console.log('  ✓', name);
    passed++;
  } catch (e) {
    console.error('  ✗', name);
    console.error('   ', e.message);
    failed++;
  }
}

console.log('\nAuth tests');
console.log('----------');

test('getUser returns null when empty', () => {
  localStorage.clear();
  assert.strictEqual(getUser(), null);
});

test('setUser + getUser roundtrip', () => {
  const user = { email: 'test@example.com', name: 'Test User', avatar: 'T' };
  setUser(user);
  const loaded = getUser();
  assert.strictEqual(loaded.email, 'test@example.com');
  assert.strictEqual(loaded.name, 'Test User');
  assert.strictEqual(loaded.avatar, 'T');
});

test('isLoggedIn is true after setUser', () => {
  assert.strictEqual(isLoggedIn(), true);
});

test('clearUser logs out', () => {
  clearUser();
  assert.strictEqual(getUser(), null);
  assert.strictEqual(isLoggedIn(), false);
});

test('getUser handles invalid JSON gracefully', () => {
  localStorage.setItem(AUTH_KEY, '{bad json');
  assert.strictEqual(getUser(), null);
});

console.log(`\nResult: ${passed} passed, ${failed} failed\n`);
process.exit(failed > 0 ? 1 : 0);
