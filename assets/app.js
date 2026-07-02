/* D-ACT static web interface */
(function () {
  'use strict';

  const conditionOrder = ['C0', 'C1', 'C2', 'C3', 'C4', 'C5', 'C6'];
  const selectors = {
    pcap: document.getElementById('pcapFiles'),
    flow: document.getElementById('flowFiles'),
    cloud: document.getElementById('cloudFiles'),
    serverless: document.getElementById('serverlessFiles'),
    ai: document.getElementById('aiFiles')
  };

  const state = {
    files: {
      pcap: [],
      flow: [],
      cloud: [],
      serverless: [],
      ai: []
    },
    result: null
  };

  function $(id) { return document.getElementById(id); }

  function fileListSummary(files) {
    if (!files || files.length === 0) return 'No files selected';
    return Array.from(files).map(f => `${f.name} (${formatBytes(f.size)})`).join(', ');
  }

  function formatBytes(bytes) {
    if (!Number.isFinite(bytes)) return '0 B';
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  }

  function updateFileLists() {
    for (const key of Object.keys(selectors)) {
      const out = $(`${key}List`);
      if (out) out.textContent = fileListSummary(state.files[key]);
    }
  }

  function detectTabularKind(fileName) {
    const lower = fileName.toLowerCase();
    if (lower.endsWith('.json')) return 'json';
    if (lower.endsWith('.xlsx') || lower.endsWith('.xls')) return 'excel';
    return 'csv';
  }

  function readAsText(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(String(reader.result || ''));
      reader.onerror = () => reject(reader.error || new Error(`Unable to read ${file.name}`));
      reader.readAsText(file);
    });
  }

  function readAsArrayBuffer(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = () => reject(reader.error || new Error(`Unable to read ${file.name}`));
      reader.readAsArrayBuffer(file);
    });
  }

  async function readTabularFile(file) {
    const kind = detectTabularKind(file.name);
    if (kind === 'json') {
      return DactCore.parseJsonTable(await readAsText(file));
    }
    if (kind === 'excel') {
      if (typeof XLSX === 'undefined') {
        throw new Error('Excel parsing requires SheetJS. Use CSV/JSON, or enable the CDN script in index.html.');
      }
      const buffer = await readAsArrayBuffer(file);
      const workbook = XLSX.read(buffer, { type: 'array' });
      const firstSheet = workbook.SheetNames[0];
      if (!firstSheet) return [];
      return XLSX.utils.sheet_to_json(workbook.Sheets[firstSheet], { defval: '' });
    }
    return DactCore.parseCsv(await readAsText(file));
  }

  async function collectInputs() {
    const inputs = {
      pcapRecords: [],
      flowRows: [],
      cloudRows: [],
      serverlessRows: [],
      aiRows: []
    };

    const notes = [];

    for (const file of state.files.pcap) {
      const buffer = await readAsArrayBuffer(file);
      const records = DactCore.parsePcap(buffer);
      inputs.pcapRecords.push(...records);
      notes.push(`Parsed ${records.length} IPv4 records from ${file.name}.`);
    }

    const tabularTargets = [
      ['flow', 'flowRows'],
      ['cloud', 'cloudRows'],
      ['serverless', 'serverlessRows'],
      ['ai', 'aiRows']
    ];

    for (const [key, target] of tabularTargets) {
      for (const file of state.files[key]) {
        const rows = await readTabularFile(file);
        inputs[target].push(...rows);
        notes.push(`Parsed ${rows.length} rows from ${file.name}.`);
      }
    }

    return { inputs, notes };
  }

  function setStatus(message, type = 'info') {
    const status = $('status');
    status.textContent = message;
    status.className = `status ${type}`;
  }

  function nodeStatusClass(condition, observed) {
    return observed.has(condition) ? 'present' : 'absent';
  }

  function renderConditions(result) {
    const observed = new Set(result.observed_conditions || []);

    for (const c of conditionOrder) {
      const nodeEls = document.querySelectorAll(`[data-condition="${c}"]`);
      nodeEls.forEach(el => {
        el.classList.remove('present', 'absent', 'neutral');
        el.classList.add(nodeStatusClass(c, observed));
      });
    }

    const list = $('conditionList');
    list.innerHTML = '';
    for (const c of conditionOrder) {
      const li = document.createElement('li');
      li.className = observed.has(c) ? 'condition-present' : 'condition-absent';
      const label = observed.has(c) ? 'IDENTIFIED' : 'NOT IDENTIFIED';
      li.innerHTML = `<strong>${c}</strong> — ${label}<br><span>${DactCore.CONDITIONS[c]}</span>`;
      list.appendChild(li);
    }
  }

  function renderAttackClasses(result) {
    const primary = result.primary_classification;
    const inherited = new Set(result.inherited_or_secondary_classes || []);
    document.querySelectorAll('[data-class]').forEach(el => {
      const name = el.getAttribute('data-class');
      el.classList.remove('class-primary', 'class-secondary', 'class-inactive');
      if (name === primary) el.classList.add('class-primary');
      else if (inherited.has(name)) el.classList.add('class-secondary');
      else el.classList.add('class-inactive');
    });
  }

  function renderFeatures(features) {
    const tbody = $('featureTableBody');
    tbody.innerHTML = '';
    const entries = Object.entries(features || {}).sort((a, b) => a[0].localeCompare(b[0]));
    for (const [key, value] of entries) {
      const tr = document.createElement('tr');
      const val = typeof value === 'number' ? Number(value.toFixed ? value.toFixed(4) : value) : value;
      tr.innerHTML = `<td>${escapeHtml(key)}</td><td>${escapeHtml(String(val))}</td>`;
      tbody.appendChild(tr);
    }
  }

  function renderResult(result, notes) {
    state.result = result;
    renderConditions(result);
    renderAttackClasses(result);
    renderFeatures(result.features);

    $('primaryClassification').textContent = result.primary_classification || 'Unclassified';
    $('identifiedConditions').textContent = (result.observed_conditions || []).join(', ') || 'None';
    $('absentConditions').textContent = (result.absent_conditions || []).join(', ') || 'None';
    $('secondaryClasses').textContent = (result.inherited_or_secondary_classes || []).join(', ') || 'None';
    $('explanation').textContent = result.explanation || '';
    $('parseNotes').innerHTML = notes.map(n => `<li>${escapeHtml(n)}</li>`).join('');
    $('jsonOutput').textContent = JSON.stringify(result, null, 2);

    $('resultsPanel').hidden = false;
    $('downloadResult').disabled = false;
  }

  function escapeHtml(str) {
    return String(str).replace(/[&<>'"]/g, ch => ({
      '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;'
    }[ch]));
  }

  function resetView() {
    state.result = null;
    conditionOrder.forEach(c => {
      document.querySelectorAll(`[data-condition="${c}"]`).forEach(el => {
        el.classList.remove('present', 'absent');
        el.classList.add('neutral');
      });
    });
    document.querySelectorAll('[data-class]').forEach(el => {
      el.classList.remove('class-primary', 'class-secondary');
      el.classList.add('class-inactive');
    });
    $('resultsPanel').hidden = true;
    $('downloadResult').disabled = true;
    setStatus('Ready. Upload evidence files and run the classifier.', 'info');
  }

  async function runClassifier() {
    try {
      setStatus('Reading files and running D-ACT in the browser...', 'info');
      const { inputs, notes } = await collectInputs();
      const result = DactCore.analyse(inputs);
      renderResult(result, notes);
      setStatus('Classification complete. Conditions and taxonomy tree have been updated.', 'success');
    } catch (err) {
      console.error(err);
      setStatus(`Error: ${err.message || err}`, 'error');
    }
  }

  function downloadResult() {
    if (!state.result) return;
    const blob = new Blob([JSON.stringify(state.result, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'dact_result.json';
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  }

  function wireFileInput(key) {
    selectors[key].addEventListener('change', ev => {
      state.files[key] = Array.from(ev.target.files || []);
      updateFileLists();
    });
  }

  function clearAll() {
    for (const key of Object.keys(selectors)) {
      state.files[key] = [];
      selectors[key].value = '';
    }
    updateFileLists();
    resetView();
  }

  function init() {
    for (const key of Object.keys(selectors)) wireFileInput(key);
    $('runClassifier').addEventListener('click', runClassifier);
    $('clearAll').addEventListener('click', clearAll);
    $('downloadResult').addEventListener('click', downloadResult);
    updateFileLists();
    resetView();
  }

  document.addEventListener('DOMContentLoaded', init);
})();
