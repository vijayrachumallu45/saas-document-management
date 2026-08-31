/**
 * Document helpers tests
 * Run: node tests/app.test.js
 */

const assert = require('assert');

// localStorage mock
const store = {};
global.localStorage = {
  getItem(key) { return store[key] || null; },
  setItem(key, value) { store[key] = String(value); },
  removeItem(key) { delete store[key]; },
  clear() { Object.keys(store).forEach(k => delete store[k]); }
};

const DOCS_KEY = 'docflow_documents';
const TRASH_KEY = 'docflow_trash';

function loadDocs() {
  try {
    return JSON.parse(localStorage.getItem(DOCS_KEY)) || [];
  } catch {
    return [];
  }
}

function saveDocs(docs) {
  localStorage.setItem(DOCS_KEY, JSON.stringify(docs));
}

function loadTrash() {
  try {
    return JSON.parse(localStorage.getItem(TRASH_KEY)) || [];
  } catch {
    return [];
  }
}

function saveTrash(items) {
  localStorage.setItem(TRASH_KEY, JSON.stringify(items));
}

function generateId() {
  return 'doc_' + Date.now() + '_' + Math.random().toString(36).slice(2, 8);
}

function formatSize(bytes) {
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
}

function detectType(name) {
  const ext = name.split('.').pop().toLowerCase();
  if (['pdf'].includes(ext)) return 'pdf';
  if (['doc', 'docx'].includes(ext)) return 'doc';
  if (['xls', 'xlsx', 'csv'].includes(ext)) return 'xls';
  if (['png', 'jpg', 'jpeg', 'gif', 'webp'].includes(ext)) return 'img';
  return 'other';
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

console.log('\nApp / Document helpers tests');
console.log('----------------------------');

test('loadDocs returns empty array when empty', () => {
  localStorage.clear();
  assert.deepStrictEqual(loadDocs(), []);
});

test('saveDocs + loadDocs roundtrip', () => {
  const docs = [
    { id: '1', name: 'Report.pdf', type: 'pdf', size: 1000, created: new Date().toISOString() }
  ];
  saveDocs(docs);
  const loaded = loadDocs();
  assert.strictEqual(loaded.length, 1);
  assert.strictEqual(loaded[0].name, 'Report.pdf');
});

test('generateId returns unique-looking ids', () => {
  const a = generateId();
  const b = generateId();
  assert.ok(a.startsWith('doc_'));
  assert.notStrictEqual(a, b);
});

test('formatSize works for bytes, KB, MB', () => {
  assert.strictEqual(formatSize(500), '500 B');
  assert.strictEqual(formatSize(2048), '2.0 KB');
  assert.strictEqual(formatSize(2 * 1024 * 1024), '2.0 MB');
});

test('detectType maps extensions correctly', () => {
  assert.strictEqual(detectType('file.pdf'), 'pdf');
  assert.strictEqual(detectType('notes.docx'), 'doc');
  assert.strictEqual(detectType('data.xlsx'), 'xls');
  assert.strictEqual(detectType('photo.jpg'), 'img');
  assert.strictEqual(detectType('readme.txt'), 'other');
});

test('trash save/load works', () => {
  const items = [{ id: 't1', name: 'deleted.pdf' }];
  saveTrash(items);
  assert.strictEqual(loadTrash().length, 1);
  assert.strictEqual(loadTrash()[0].name, 'deleted.pdf');
});

console.log(`\nResult: ${passed} passed, ${failed} failed\n`);
process.exit(failed > 0 ? 1 : 0);
// extra test note
// extra coverage note
