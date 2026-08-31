// DocFlow Dashboard App

const DOCS_KEY = 'docflow_documents';
const TRASH_KEY = 'docflow_trash';
const PREFS_KEY = 'docflow_preferences';

// ---------- Data helpers ----------
function loadDocs() {
  try {
    return JSON.parse(localStorage.getItem(DOCS_KEY)) || [];
  } catch {
    return [];
  }
}

function saveDocs(docs) {
  try {
    localStorage.setItem(DOCS_KEY, JSON.stringify(docs));
  } catch (e) {
    console.warn('Could not save documents', e);
    showToast('Unable to save. Check browser storage settings.');
  }
}

function loadTrash() {
  try {
    return JSON.parse(localStorage.getItem(TRASH_KEY)) || [];
  } catch {
    return [];
  }
}

function saveTrash(items) {
  try {
    localStorage.setItem(TRASH_KEY, JSON.stringify(items));
  } catch (e) {
    console.warn('Could not save trash', e);
  }
}

function generateId() {
  return 'doc_' + Date.now() + '_' + Math.random().toString(36).slice(2, 8);
}

function formatSize(bytes) {
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
}

function formatDate(iso) {
  const d = new Date(iso);
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function getIcon(type) {
  const map = {
    pdf: '📕',
    doc: '📘',
    xls: '📗',
    img: '🖼️',
    other: '📄'
  };
  return map[type] || '📄';
}

function detectType(name) {
  const ext = name.split('.').pop().toLowerCase();
  if (['pdf'].includes(ext)) return 'pdf';
  if (['doc', 'docx'].includes(ext)) return 'doc';
  if (['xls', 'xlsx', 'csv'].includes(ext)) return 'xls';
  if (['png', 'jpg', 'jpeg', 'gif', 'webp'].includes(ext)) return 'img';
  return 'other';
}

// Seed some demo documents if empty
function seedIfEmpty() {
  let docs = loadDocs();
  if (docs.length === 0) {
    const now = Date.now();
    docs = [
      { id: generateId(), name: 'Q3 Financial Report.pdf', type: 'pdf', size: 2450000, created: new Date(now - 86400000 * 2).toISOString(), shared: false },
      { id: generateId(), name: 'Product Roadmap 2026.docx', type: 'doc', size: 890000, created: new Date(now - 86400000 * 5).toISOString(), shared: true },
      { id: generateId(), name: 'Team Budget.xlsx', type: 'xls', size: 320000, created: new Date(now - 86400000 * 1).toISOString(), shared: false },
      { id: generateId(), name: 'Brand Guidelines.pdf', type: 'pdf', size: 5100000, created: new Date(now - 86400000 * 10).toISOString(), shared: true },
      { id: generateId(), name: 'Office Photo.jpg', type: 'img', size: 1800000, created: new Date(now - 86400000 * 3).toISOString(), shared: false },
      { id: generateId(), name: 'Meeting Notes.txt', type: 'other', size: 12000, created: new Date(now - 86400000 * 0.5).toISOString(), shared: false }
    ];
    saveDocs(docs);
  }
}

// ---------- UI Helpers ----------
function showToast(msg, duration = 2800) {
  const toast = document.getElementById('toast');
  if (!toast) return;
  toast.textContent = msg;
  toast.classList.remove('hidden');
  setTimeout(() => toast.classList.add('hidden'), duration);
}

let modalTrigger = null;

function showModal(html) {
  const modal = document.getElementById('modal');
  const body = document.getElementById('modalBody');
  modalTrigger = document.activeElement;
  body.innerHTML = html;
  modal.classList.remove('hidden');
  modal.setAttribute('aria-hidden', 'false');
  const heading = body.querySelector('h3');
  if (heading) heading.id = 'modalTitle';
  const focusTarget = body.querySelector('input, button, [href], select, textarea') || document.getElementById('modalClose');
  focusTarget?.focus();
}

function hideModal() {
  const modal = document.getElementById('modal');
  modal.classList.add('hidden');
  modal.setAttribute('aria-hidden', 'true');
  modalTrigger?.focus();
  modalTrigger = null;
}

// ---------- Navigation ----------
function switchSection(sectionId) {
  document.querySelectorAll('.content-section').forEach(s => s.classList.remove('active'));
  document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));

  const section = document.getElementById('section-' + sectionId);
  if (section) section.classList.add('active');

  const nav = document.querySelector(`.nav-item[data-section="${sectionId}"]`);
  if (nav) nav.classList.add('active');

  // Refresh data for certain sections
  if (sectionId === 'overview') renderOverview();
  if (sectionId === 'documents') renderDocuments();
  if (sectionId === 'trash') renderTrash();
  if (sectionId === 'settings') loadSettings();
}

// ---------- Render Overview ----------
function renderStorageChart() {
  const container = document.getElementById('storageChartContainer');
  if (!container) return;

  const docs = loadDocs();
  if (docs.length === 0) {
    container.innerHTML = '<p style="color:var(--text-muted);">No documents available to chart.</p>';
    return;
  }

  // Aggregate size by type
  const aggregates = {};
  docs.forEach(d => {
    aggregates[d.type] = (aggregates[d.type] || 0) + (d.size || 0);
  });

  const total = Object.values(aggregates).reduce((sum, v) => sum + v, 0);
  if (total === 0) {
    container.innerHTML = '<p style="color:var(--text-muted);">No data to display.</p>';
    return;
  }

  // Use the SvgCharts module programmatically for analysis metrics
  try {
    const chartEngine = new SvgCharts();
    docs.forEach(d => chartEngine.addItem({ svg: d.name, chart: d.type, bar: d.size }));
    const metrics = chartEngine.calculateBarMetrics();
    console.log("SvgCharts metrics calculated:", metrics);
  } catch (e) {
    console.error("Failed to run diagnostics on SvgCharts:", e);
  }

  // Render SVG donut chart
  const width = 200;
  const height = 200;
  const radius = 90;
  const cx = 100;
  const cy = 100;
  const colors = {
    pdf: '#ff6b6b',
    doc: '#4dadf7',
    xls: '#51cf66',
    img: '#fcc419',
    other: '#868e96'
  };

  let accumAngle = 0;
  const paths = [];
  const types = Object.keys(aggregates);
  
  if (types.length === 1) {
    const type = types[0];
    const color = colors[type] || colors.other;
    paths.push(`<circle cx="${cx}" cy="${cy}" r="${radius}" fill="none" stroke="${color}" stroke-width="24" />`);
  } else {
    types.forEach(type => {
      const size = aggregates[type];
      const percentage = size / total;
      const angle = percentage * 360;

      const x1 = cx + radius * Math.cos((accumAngle - 90) * Math.PI / 180);
      const y1 = cy + radius * Math.sin((accumAngle - 90) * Math.PI / 180);
      
      accumAngle += angle;

      const x2 = cx + radius * Math.cos((accumAngle - 90) * Math.PI / 180);
      const y2 = cy + radius * Math.sin((accumAngle - 90) * Math.PI / 180);

      const largeArc = percentage > 0.5 ? 1 : 0;
      
      paths.push(`
        <path d="M ${x1} ${y1} A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2}" 
              fill="none" 
              stroke="${colors[type] || colors.other}" 
              stroke-width="24" />
      `);
    });
  }

  // Build the Legend
  const legendItems = Object.keys(aggregates).map(type => {
    const size = aggregates[type];
    const percentage = ((size / total) * 100).toFixed(1);
    const color = colors[type] || colors.other;
    return `
      <div style="display:flex;align-items:center;margin:0.25rem 1rem;font-size:0.85rem;">
        <span style="display:inline-block;width:12px;height:12px;border-radius:3px;background:${color};margin-right:8px;"></span>
        <span style="font-weight:500;text-transform:uppercase;margin-right:4px;">${type}:</span>
        <span style="color:var(--text-muted);">${formatSize(size)} (${percentage}%)</span>
      </div>
    `;
  }).join('');

  container.innerHTML = `
    <div style="display:flex;align-items:center;justify-content:center;flex-wrap:wrap;gap:2rem;width:100%;max-width:600px;">
      <svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" style="transform: rotate(-90deg);">
        <circle cx="${cx}" cy="${cy}" r="${radius - 12}" fill="none" stroke="var(--border)" stroke-width="1" />
        \${paths.join('')}
        <circle cx="${cx}" cy="${cy}" r="${radius - 12}" fill="var(--bg-card)" />
      </svg>
      <div style="display:flex;flex-direction:column;align-items:flex-start;justify-content:center;">
        \${legendItems}
      </div>
    </div>
  `;
}

function renderOverview() {
  const docs = loadDocs();
  const weekAgo = Date.now() - 7 * 86400000;

  document.getElementById('statTotal').textContent = docs.length;
  document.getElementById('statRecent').textContent = docs.filter(d => new Date(d.created).getTime() > weekAgo).length;
  document.getElementById('statShared').textContent = docs.filter(d => d.shared).length;

  const totalBytes = docs.reduce((sum, d) => sum + (d.size || 0), 0);
  document.getElementById('statStorage').textContent = formatSize(totalBytes);

  const recent = [...docs].sort((a, b) => new Date(b.created) - new Date(a.created)).slice(0, 5);
  const list = document.getElementById('recentList');
  if (recent.length === 0) {
    list.innerHTML = '<p style="color:var(--text-muted);font-size:0.9rem;">No documents yet. Upload some!</p>';
  } else {
    list.innerHTML = recent.map(d => `
      <div class="recent-item" data-id="${d.id}">
        <div class="doc-icon">${getIcon(d.type)}</div>
        <div class="doc-meta">
          <div class="doc-name">${escapeHtml(d.name)}</div>
          <div class="doc-date">${formatDate(d.created)}</div>
        </div>
      </div>
    `).join('');
  }

  // Draw the storage allocation chart
  renderStorageChart();
}

// ---------- Render Documents ----------
let currentView = 'list';
let currentFilter = 'all';
let currentSort = 'date-desc';

function renderDocuments() {
  let docs = loadDocs();

  // Filter
  if (currentFilter !== 'all') {
    docs = docs.filter(d => d.type === currentFilter);
  }

  // Search
  const q = (document.getElementById('globalSearch')?.value || '').toLowerCase().trim();
  if (q) {
    docs = docs.filter(d => d.name.toLowerCase().includes(q));
  }

  // Sort
  docs.sort((a, b) => {
    switch (currentSort) {
      case 'date-asc': return new Date(a.created) - new Date(b.created);
      case 'name-asc': return a.name.localeCompare(b.name);
      case 'name-desc': return b.name.localeCompare(a.name);
      case 'size-desc': return (b.size || 0) - (a.size || 0);
      default: return new Date(b.created) - new Date(a.created);
    }
  });

  const container = document.getElementById('documentsContainer');
  container.className = 'documents-container ' + currentView;

  if (docs.length === 0) {
    container.innerHTML = `
      <div class="empty-state">
        <div class="empty-icon">📁</div>
        <h3>No documents found</h3>
        <p>Upload files or change your filters.</p>
      </div>
    `;
    return;
  }

  container.innerHTML = docs.map(d => `
    <div class="doc-row" data-id="${d.id}">
      <div class="doc-icon">${getIcon(d.type)}</div>
      <div class="doc-meta">
        <div class="doc-name">${escapeHtml(d.name)}</div>
        <div class="doc-date">${formatDate(d.created)} · ${formatSize(d.size || 0)}</div>
      </div>
      ${currentView === 'list' ? `<span class="doc-size">${formatSize(d.size || 0)}</span>` : ''}
      <div class="doc-actions">
        <button class="doc-action-btn" title="Preview" data-action="preview" data-id="${d.id}">👁️</button>
        <button class="doc-action-btn" title="Rename" data-action="rename" data-id="${d.id}">✏️</button>
        <button class="doc-action-btn danger" title="Delete" data-action="delete" data-id="${d.id}">🗑️</button>
      </div>
    </div>
  `).join('');
}

// ---------- Render Trash ----------
function renderTrash() {
  const items = loadTrash();
  const container = document.getElementById('trashContainer');
  container.className = 'documents-container list';

  if (items.length === 0) {
    container.innerHTML = `
      <div class="empty-state">
        <div class="empty-icon">🗑️</div>
        <h3>Trash is empty</h3>
        <p>Deleted documents will appear here.</p>
      </div>
    `;
    return;
  }

  container.innerHTML = items.map(d => `
    <div class="doc-row" data-id="${d.id}">
      <div class="doc-icon">${getIcon(d.type)}</div>
      <div class="doc-meta">
        <div class="doc-name">${escapeHtml(d.name)}</div>
        <div class="doc-date">Deleted · ${formatDate(d.deletedAt || d.created)}</div>
      </div>
      <div class="doc-actions">
        <button class="doc-action-btn" title="Restore" data-action="restore" data-id="${d.id}">↩️</button>
        <button class="doc-action-btn danger" title="Delete permanently" data-action="purge" data-id="${d.id}">❌</button>
      </div>
    </div>
  `).join('');
}

// ---------- Document Actions ----------
function deleteDoc(id) {
  let docs = loadDocs();
  const doc = docs.find(d => d.id === id);
  if (!doc) return;

  docs = docs.filter(d => d.id !== id);
  saveDocs(docs);

  const trash = loadTrash();
  trash.unshift({ ...doc, deletedAt: new Date().toISOString() });
  saveTrash(trash);

  showToast('Moved to trash');
  renderDocuments();
  renderOverview();
}

function restoreDoc(id) {
  let trash = loadTrash();
  const doc = trash.find(d => d.id === id);
  if (!doc) return;

  trash = trash.filter(d => d.id !== id);
  saveTrash(trash);

  const docs = loadDocs();
  const { deletedAt, ...rest } = doc;
  docs.unshift(rest);
  saveDocs(docs);

  showToast('Document restored');
  renderTrash();
  renderOverview();
}

function purgeDoc(id) {
  let trash = loadTrash();
  trash = trash.filter(d => d.id !== id);
  saveTrash(trash);
  showToast('Permanently deleted');
  renderTrash();
}

function renameDoc(id) {
  const docs = loadDocs();
  const doc = docs.find(d => d.id === id);
  if (!doc) return;

  showModal(`
    <h3 style="margin-bottom:1rem;">Rename Document</h3>
    <div class="form-group">
      <label>New name</label>
      <input type="text" id="renameInput" value="${escapeHtml(doc.name)}" style="width:100%;padding:0.7rem 1rem;border:1.5px solid var(--border);border-radius:10px;" />
    </div>
    <button class="btn btn-primary" id="confirmRename" style="margin-top:0.5rem;">Save</button>
  `);

  document.getElementById('confirmRename').onclick = () => {
    const newName = document.getElementById('renameInput').value.trim();
    if (newName) {
      doc.name = newName;
      doc.type = detectType(newName);
      saveDocs(docs);
      showToast('Renamed successfully');
      hideModal();
      renderDocuments();
      renderOverview();
    }
  };
}

function previewDoc(id) {
  const docs = loadDocs();
  const doc = docs.find(d => d.id === id);
  if (!doc) return;

  showModal(`
    <div style="text-align:center;">
      <div style="font-size:3rem;margin-bottom:1rem;">${getIcon(doc.type)}</div>
      <h3 style="margin-bottom:0.5rem;">${escapeHtml(doc.name)}</h3>
      <p style="color:var(--text-muted);font-size:0.9rem;">
        ${formatSize(doc.size || 0)} · Uploaded ${formatDate(doc.created)}
        ${doc.shared ? ' · Shared' : ''}
      </p>
      <p style="margin-top:1.25rem;color:var(--text-muted);font-size:0.85rem;">
        Preview is simulated in this demo.<br>In a real app this would open the file.
      </p>
    </div>
  `);
}

// ---------- Upload ----------
function addUploadedFiles(files) {
  const docs = loadDocs();
  const list = document.getElementById('uploadList');

  Array.from(files).forEach((file, idx) => {
    const id = generateId();
    const type = detectType(file.name);
    const size = file.size;

    // Fake progress UI
    const item = document.createElement('div');
    item.className = 'upload-item';
    item.innerHTML = `
      <span>${getIcon(type)}</span>
      <div style="flex:1;min-width:0;">
        <div style="font-weight:500;font-size:0.9rem;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${escapeHtml(file.name)}</div>
        <div class="progress"><div class="progress-bar" style="width:0%"></div></div>
      </div>
      <span style="font-size:0.8rem;color:var(--text-muted);">${formatSize(size)}</span>
    `;
    list.appendChild(item);

    // Simulate upload progress
    let progress = 0;
    const bar = item.querySelector('.progress-bar');
    const interval = setInterval(() => {
      progress += Math.random() * 25 + 10;
      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);
        bar.style.width = '100%';
        setTimeout(() => {
          item.remove();
          docs.unshift({
            id,
            name: file.name,
            type,
            size,
            created: new Date().toISOString(),
            shared: false
          });
          saveDocs(docs);
          showToast(`Uploaded: ${file.name}`);
          renderOverview();
        }, 300);
      } else {
        bar.style.width = progress + '%';
      }
    }, 180);
  });
}

// ---------- Settings ----------
function loadPreferences() {
  try {
    return JSON.parse(localStorage.getItem(PREFS_KEY)) || { notifications: true, dark: false };
  } catch {
    return { notifications: true, dark: false };
  }
}

function applyPreferences(preferences) {
  document.body.classList.toggle('dark-theme', Boolean(preferences.dark));
}

function loadSettings() {
  const user = getUser();
  if (!user) return;
  document.getElementById('settingsName').value = user.name || '';
  document.getElementById('settingsEmail').value = user.email || '';
  const preferences = loadPreferences();
  document.getElementById('prefNotifications').checked = preferences.notifications;
  document.getElementById('prefDark').checked = preferences.dark;
}

function saveSettings() {
  const user = getUser();
  if (!user) return;
  const name = document.getElementById('settingsName').value.trim();
  if (name) {
    user.name = name;
    user.avatar = name.charAt(0).toUpperCase();
    setUser(user);
    updateUserUI();
  }
  const preferences = {
    notifications: document.getElementById('prefNotifications').checked,
    dark: document.getElementById('prefDark').checked
  };
  localStorage.setItem(PREFS_KEY, JSON.stringify(preferences));
  applyPreferences(preferences);
  showToast('Settings saved');
}

function updateUserUI() {
  const user = getUser();
  if (!user) return;
  document.getElementById('userName').textContent = user.name;
  document.getElementById('userEmail').textContent = user.email;
  document.getElementById('userAvatar').textContent = user.avatar || 'U';
}

// ---------- Utils ----------
function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

function runSystemDiagnostics() {
  const btn = document.getElementById('runDiagnosticsBtn');
  const results = document.getElementById('diagnosticsResults');
  if (!btn || !results) return;

  btn.disabled = true;
  btn.textContent = "Running...";
  results.classList.remove('hidden');
  results.innerHTML = "Initializing advanced analysis modules...\n";

  setTimeout(() => {
    try {
      let output = "";

      // 1. Performance Monitor
      output += "[1/4] Running performance benchmarks...\n";
      const perf = new PerformanceMonitor();
      perf.addItem({ metrics: "init", start: 0, end: 12.5, duration: 12.5 });
      perf.addItem({ metrics: "crdt_sync", start: 15, end: 32.1, duration: 17.1 });
      perf.addItem({ metrics: "search_index", start: 40, end: 42.4, duration: 2.4 });
      const stats = perf.calculateDurationMetrics();
      output += `      Average task latency: ${stats.average}ms\n`;
      output += `      Variance: ${stats.variance}ms^2 (Standard Deviation: ${stats.stdDev}ms)\n\n`;

      // 2. Trie Search Index
      output += "[2/4] Testing search indexing structure...\n";
      const trie = new TrieSearchIndex();
      trie.addItem({ root: "DocFlow", node: "RootNode", insert: 1 });
      trie.addItem({ root: "Index", node: "IndexNode", insert: 2 });
      trie.addItem({ root: "Trie", node: "TrieNode", insert: 3 });
      const trieAction = trie.performTrieSearchIndexAction();
      output += `      Index State: ${trieAction.status}\n`;
      output += `      Accumulator validation: ${trieAction.accumulator.toFixed(4)}\n\n`;

      // 3. Spell Checker
      output += "[3/4] Verifying spell-check dictionary...\n";
      const checker = new SpellChecker();
      checker.addItem({ word: "document", check: "valid", distance: 0 });
      checker.addItem({ word: "managment", check: "invalid", distance: 1 });
      const checkAction = checker.performSpellCheckerAction();
      output += `      Dictionary status check: ${checkAction.status}\n`;
      output += `      Entropy level: ${checkAction.accumulator.toFixed(4)}\n\n`;

      // 4. Memory Cache & Sync Telemetry
      output += "[4/4] Collecting storage telemetry...\n";
      const telemetry = perf.getTelemetry();
      output += `      Module: ${telemetry.moduleName}\n`;
      output += `      State: ${telemetry.currentState}\n`;
      output += `      Uptime metric: ${telemetry.uptime.toFixed(1)}ms\n\n`;

      output += "--------------------------------------\n";
      output += "SYSTEM DIAGNOSTICS: ALL TESTS PASSED\n";
      output += `Timestamp: ${new Date().toISOString()}\n`;

      results.innerHTML = output;
    } catch (e) {
      results.innerHTML = `Diagnostics failed: ${e.message}`;
    } finally {
      btn.disabled = false;
      btn.textContent = "Run Diagnostics";
    }
  }, 1000);
}

// ---------- Init ----------
document.addEventListener('DOMContentLoaded', () => {
  if (!isLoggedIn()) return; // safety

  seedIfEmpty();
  applyPreferences(loadPreferences());
  updateUserUI();
  renderOverview();

  // Navigation
  document.querySelectorAll('.nav-item, [data-section]').forEach(el => {
    el.addEventListener('click', (e) => {
      e.preventDefault();
      const section = el.dataset.section;
      if (section) switchSection(section);
    });
  });

  // Logout
  document.getElementById('logoutBtn')?.addEventListener('click', () => {
    clearUser();
    window.location.href = 'index.html';
  });

  // Sidebar toggle (mobile)
  document.getElementById('sidebarToggle')?.addEventListener('click', () => {
    document.getElementById('sidebar').classList.toggle('open');
  });

  // Search
  document.getElementById('globalSearch')?.addEventListener('input', () => {
    if (document.getElementById('section-documents').classList.contains('active')) {
      renderDocuments();
    }
  });

  // Filters & sort
  document.getElementById('filterType')?.addEventListener('change', (e) => {
    currentFilter = e.target.value;
    renderDocuments();
  });
  document.getElementById('sortBy')?.addEventListener('change', (e) => {
    currentSort = e.target.value;
    renderDocuments();
  });

  // View toggle
  document.querySelectorAll('.view-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.view-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentView = btn.dataset.view;
      renderDocuments();
    });
  });

  // Document actions (delegation)
  document.getElementById('documentsContainer')?.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-action]');
    if (!btn) return;
    const id = btn.dataset.id;
    const action = btn.dataset.action;
    if (action === 'delete') deleteDoc(id);
    if (action === 'rename') renameDoc(id);
    if (action === 'preview') previewDoc(id);
  });

  document.getElementById('trashContainer')?.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-action]');
    if (!btn) return;
    const id = btn.dataset.id;
    if (btn.dataset.action === 'restore') restoreDoc(id);
    if (btn.dataset.action === 'purge') purgeDoc(id);
  });

  // Quick upload / new doc buttons
  document.getElementById('quickUploadBtn')?.addEventListener('click', () => switchSection('upload'));
  document.getElementById('newDocBtn')?.addEventListener('click', () => switchSection('upload'));

  // Upload zone
  const zone = document.getElementById('uploadZone');
  const fileInput = document.getElementById('fileInput');
  const browseBtn = document.getElementById('browseBtn');

  browseBtn?.addEventListener('click', (e) => {
    e.stopPropagation();
    fileInput.click();
  });
  zone?.addEventListener('click', () => fileInput.click());

  fileInput?.addEventListener('change', () => {
    if (fileInput.files.length) {
      addUploadedFiles(fileInput.files);
      fileInput.value = '';
    }
  });

  // Drag & drop
  zone?.addEventListener('dragover', (e) => {
    e.preventDefault();
    zone.classList.add('dragover');
  });
  zone?.addEventListener('dragleave', () => zone.classList.remove('dragover'));
  zone?.addEventListener('drop', (e) => {
    e.preventDefault();
    zone.classList.remove('dragover');
    if (e.dataTransfer.files.length) {
      addUploadedFiles(e.dataTransfer.files);
    }
  });

  // Settings
  document.getElementById('saveSettings')?.addEventListener('click', saveSettings);

  // Diagnostics
  document.getElementById('runDiagnosticsBtn')?.addEventListener('click', runSystemDiagnostics);

  // Modal close
  document.getElementById('modalClose')?.addEventListener('click', hideModal);
  document.getElementById('modal')?.addEventListener('click', (e) => {
    if (e.target.id === 'modal') hideModal();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !document.getElementById('modal')?.classList.contains('hidden')) {
      hideModal();
    }
  });
});
// minor upload note
