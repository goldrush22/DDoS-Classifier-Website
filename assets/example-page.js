/* D-ACT example use case page */
(function () {
  'use strict';

  const CONDITIONS = ['C0', 'C1', 'C2', 'C3', 'C4', 'C5', 'C6'];
  const examples = window.DACT_EXAMPLE_CORPUS || [];
  const state = { currentResult: null };

  function $(id) { return document.getElementById(id); }

  function escapeHtml(str) {
    return String(str).replace(/[&<>'"]/g, ch => ({
      '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;'
    }[ch]));
  }

  function formatBytes(bytes) {
    if (!Number.isFinite(bytes)) return '0 B';
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  }

  function classLabel(name) {
    if (name === 'Unclassified') return 'No denial detected';
    if (name === 'EDoS_S') return 'EDoSₛ';
    if (name === 'EDoS_D') return 'EDoSᴅ';
    return name.replaceAll('_', ' ');
  }

  function fileKindBadge(kind) {
    const map = {
      pcap: 'PCAP', cloud: 'Cloud', serverless: 'Serverless', ai: 'AI',
      flow: 'Flow', expected: 'Expected', result: 'Result', readme: 'README', other: 'File'
    };
    return map[kind] || 'File';
  }

  function scenarioPlainTitle(s) {
    if (s.attackClass === 'Unclassified') return 'Negative-control example';
    return `${classLabel(s.attackClass)} reproducibility example`;
  }

  function populateFilters() {
    const filter = $('classFilter');
    const classes = Array.from(new Set(examples.map(s => s.attackClass))).sort((a, b) => a.localeCompare(b));
    for (const c of classes) {
      const opt = document.createElement('option');
      opt.value = c;
      opt.textContent = classLabel(c);
      filter.appendChild(opt);
    }
  }

  function renderExamples() {
    const filter = $('classFilter').value;
    const query = $('exampleSearch').value.trim().toLowerCase();
    const grid = $('exampleGrid');
    grid.innerHTML = '';

    const visible = examples.filter(s => {
      const matchesClass = filter === 'all' || s.attackClass === filter;
      const haystack = [s.id, s.label, s.attackClass, s.notes, s.plainEnglish, ...(s.expectedConditions || [])].join(' ').toLowerCase();
      return matchesClass && (!query || haystack.includes(query));
    });

    if (visible.length === 0) {
      grid.innerHTML = '<div class="notice">No examples match the current filter.</div>';
      return;
    }

    for (const s of visible) {
      const card = document.createElement('article');
      card.className = 'example-card';
      const inputFiles = s.files.filter(f => ['pcap', 'cloud', 'serverless', 'ai', 'flow'].includes(f.kind));
      const supportingFiles = s.files.filter(f => !['pcap', 'cloud', 'serverless', 'ai', 'flow'].includes(f.kind));
      const conditionChips = CONDITIONS.map(c => {
        const active = (s.expectedConditions || []).includes(c);
        return `<span class="condition-chip ${active ? 'chip-on' : 'chip-off'}">${c}</span>`;
      }).join('');
      const filesHtml = [...inputFiles, ...supportingFiles].map(f => `
        <li>
          <span><span class="file-kind">${escapeHtml(fileKindBadge(f.kind))}</span> ${escapeHtml(f.name)} <small>${formatBytes(f.size)}</small></span>
          <span class="file-actions">
            <button class="mini secondary" data-preview-path="${escapeHtml(f.path)}" data-preview-kind="${escapeHtml(f.kind)}" data-preview-name="${escapeHtml(f.name)}">Preview</button>
            <a class="mini button" href="${escapeHtml(f.path)}" download>Download</a>
          </span>
        </li>`).join('');
      card.innerHTML = `
        <div class="example-card-top">
          <div>
            <h3>${escapeHtml(s.id.replaceAll('_', ' '))}</h3>
            <p class="example-title">${escapeHtml(scenarioPlainTitle(s))}</p>
          </div>
          <span class="class-pill ${s.attackClass === 'Unclassified' ? 'pill-neutral' : ''}">${escapeHtml(classLabel(s.attackClass))}</span>
        </div>
        <p>${escapeHtml(s.plainEnglish || s.notes || '')}</p>
        <div class="condition-chips">${conditionChips}</div>
        <div class="example-actions">
          <button data-run-example="${escapeHtml(s.id)}">Run example in browser</button>
          <a class="button secondary" href="${escapeHtml(s.folder)}" title="Open scenario folder">Open folder</a>
        </div>
        <details class="file-details" open>
          <summary>Files in this example</summary>
          <ul class="example-file-list">${filesHtml}</ul>
        </details>
      `;
      grid.appendChild(card);
    }
  }

  async function fetchArrayBuffer(path) {
    const res = await fetch(path);
    if (!res.ok) throw new Error(`Unable to load ${path} (${res.status})`);
    return await res.arrayBuffer();
  }

  async function fetchText(path) {
    const res = await fetch(path);
    if (!res.ok) throw new Error(`Unable to load ${path} (${res.status})`);
    return await res.text();
  }

  function detectTabularKind(path) {
    const lower = path.toLowerCase();
    if (lower.endsWith('.json')) return 'json';
    if (lower.endsWith('.xlsx') || lower.endsWith('.xls')) return 'excel';
    return 'csv';
  }

  async function readTabularFromPath(path) {
    const kind = detectTabularKind(path);
    if (kind === 'json') return DactCore.parseJsonTable(await fetchText(path));
    if (kind === 'excel') {
      if (typeof XLSX === 'undefined') throw new Error('Excel preview requires SheetJS.');
      const buffer = await fetchArrayBuffer(path);
      const workbook = XLSX.read(buffer, { type: 'array' });
      const firstSheet = workbook.SheetNames[0];
      if (!firstSheet) return [];
      return XLSX.utils.sheet_to_json(workbook.Sheets[firstSheet], { defval: '' });
    }
    return DactCore.parseCsv(await fetchText(path));
  }

  async function runExample(id) {
    const scenario = examples.find(s => s.id === id);
    if (!scenario) return;
    const inputs = { pcapRecords: [], flowRows: [], cloudRows: [], serverlessRows: [], aiRows: [] };
    const filesUsed = [];

    for (const f of scenario.files) {
      if (!['pcap', 'cloud', 'serverless', 'ai', 'flow'].includes(f.kind)) continue;
      filesUsed.push(f);
      if (f.kind === 'pcap') {
        const records = DactCore.parsePcap(await fetchArrayBuffer(f.path));
        inputs.pcapRecords.push(...records);
      } else if (f.kind === 'cloud') {
        inputs.cloudRows.push(...await readTabularFromPath(f.path));
      } else if (f.kind === 'serverless') {
        inputs.serverlessRows.push(...await readTabularFromPath(f.path));
      } else if (f.kind === 'ai') {
        inputs.aiRows.push(...await readTabularFromPath(f.path));
      } else if (f.kind === 'flow') {
        inputs.flowRows.push(...await readTabularFromPath(f.path));
      }
    }

    const result = DactCore.analyse(inputs);
    state.currentResult = result;
    renderRunResult(scenario, result, filesUsed);
    $('exampleRunPanel').hidden = false;
    $('exampleRunPanel').scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  function renderRunResult(scenario, result, filesUsed) {
    const observed = new Set(result.observed_conditions || []);
    $('runScenarioName').textContent = scenario.id.replaceAll('_', ' ');
    $('runPrimaryClass').textContent = classLabel(result.primary_classification || 'Unclassified');
    $('runExpectedClass').textContent = classLabel(scenario.attackClass);
    $('runIdentified').textContent = (result.observed_conditions || []).join(', ') || 'None';
    $('runAbsent').textContent = (result.absent_conditions || []).join(', ') || 'None';
    $('runExplanation').textContent = result.explanation || '';
    $('runFilesUsed').innerHTML = filesUsed.map(f => `<li>${escapeHtml(f.role)}: <code>${escapeHtml(f.name)}</code></li>`).join('');
    $('runJsonOutput').textContent = JSON.stringify(result, null, 2);

    $('runConditionStrip').innerHTML = CONDITIONS.map(c => `
      <div class="condition-status-card ${observed.has(c) ? 'status-present' : 'status-absent'}">
        <strong>${c}</strong>
        <span>${observed.has(c) ? 'Identified' : 'Not identified'}</span>
        <small>${escapeHtml(DactCore.CONDITIONS[c])}</small>
      </div>`).join('');
  }

  function textPreview(title, text, maxChars = 12000) {
    const trimmed = text.length > maxChars ? text.slice(0, maxChars) + '\n\n[Preview truncated]' : text;
    $('previewMeta').textContent = title;
    $('previewContent').textContent = trimmed;
    $('filePreviewPanel').hidden = false;
    $('filePreviewPanel').scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  async function previewFile(path, kind, name) {
    if (kind === 'pcap') {
      const records = DactCore.parsePcap(await fetchArrayBuffer(path));
      const sources = new Set(records.map(r => r.src_ip).filter(Boolean));
      const destinations = new Set(records.map(r => r.dst_ip).filter(Boolean));
      const timestamps = records.map(r => r.timestamp).filter(v => Number.isFinite(v)).sort((a, b) => a - b);
      const duration = timestamps.length >= 2 ? (timestamps[timestamps.length - 1] - timestamps[0]) : 0;
      const firstRows = records.slice(0, 12).map((r, i) => ({
        n: i + 1,
        timestamp: Number(r.timestamp || 0).toFixed(6),
        src_ip: r.src_ip,
        dst_ip: r.dst_ip,
        protocol: r.protocol,
        src_port: r.src_port,
        dst_port: r.dst_port,
        length: r.length
      }));
      textPreview(`${name} — PCAP metadata preview`, JSON.stringify({
        file: name,
        preview_type: 'Classic Ethernet/IPv4 PCAP metadata',
        parsed_ipv4_records: records.length,
        unique_sources: sources.size,
        unique_destinations: destinations.size,
        duration_seconds: Number(duration.toFixed(6)),
        first_records: firstRows
      }, null, 2));
      return;
    }

    if (kind === 'expected' || kind === 'result' || name.toLowerCase().endsWith('.json')) {
      const text = await fetchText(path);
      try {
        textPreview(`${name} — JSON preview`, JSON.stringify(JSON.parse(text), null, 2));
      } catch (_) {
        textPreview(`${name} — text preview`, text);
      }
      return;
    }

    if (kind === 'readme' || name.toLowerCase().endsWith('.md') || name.toLowerCase().endsWith('.csv') || name.toLowerCase().endsWith('.txt')) {
      textPreview(`${name} — text preview`, await fetchText(path));
      return;
    }

    if (name.toLowerCase().endsWith('.xlsx') || name.toLowerCase().endsWith('.xls')) {
      const rows = await readTabularFromPath(path);
      textPreview(`${name} — Excel first-sheet preview`, JSON.stringify(rows.slice(0, 40), null, 2));
      return;
    }

    textPreview(`${name} — preview unavailable`, 'This file type cannot be previewed as text in the browser. Use Download to inspect it locally.');
  }

  function wireEvents() {
    $('classFilter').addEventListener('change', renderExamples);
    $('exampleSearch').addEventListener('input', renderExamples);
    $('closePreview').addEventListener('click', () => { $('filePreviewPanel').hidden = true; });

    document.addEventListener('click', async ev => {
      const runId = ev.target && ev.target.getAttribute && ev.target.getAttribute('data-run-example');
      if (runId) {
        ev.preventDefault();
        try { await runExample(runId); }
        catch (err) { alert(`Unable to run example: ${err.message || err}`); }
        return;
      }
      const previewPath = ev.target && ev.target.getAttribute && ev.target.getAttribute('data-preview-path');
      if (previewPath) {
        ev.preventDefault();
        const kind = ev.target.getAttribute('data-preview-kind') || 'other';
        const name = ev.target.getAttribute('data-preview-name') || previewPath;
        try { await previewFile(previewPath, kind, name); }
        catch (err) { alert(`Unable to preview file: ${err.message || err}`); }
      }
    });
  }

  function init() {
    populateFilters();
    renderExamples();
    wireEvents();
  }

  document.addEventListener('DOMContentLoaded', init);
})();
