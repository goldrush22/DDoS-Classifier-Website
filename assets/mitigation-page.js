/* D-ACT mitigation strategies page */
(function () {
  'use strict';

  function escapeHtml(str) {
    return String(str).replace(/[&<>'"]/g, ch => ({
      '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;'
    }[ch]));
  }

  function conditionChip(c) {
    return `<span class="condition-chip chip-on">${escapeHtml(c)}</span>`;
  }

  function list(items) {
    return `<ul>${(items || []).map(item => `<li>${escapeHtml(item)}</li>`).join('')}</ul>`;
  }

  function render() {
    const root = document.getElementById('mitigationGrid');
    if (!root || typeof DactMitigations === 'undefined') return;

    const order = ['DoS', 'DDoS', 'LDoS', 'LDDoS', 'EDoS_S', 'EDoS_D', 'DoW', 'DDoW', 'DoA', 'Unclassified'];
    const data = DactMitigations.MITIGATION_STRATEGIES;

    root.innerHTML = order.map(key => {
      const s = data[key];
      const conditions = (s.conditions || []).length ? s.conditions.map(conditionChip).join('') : '<span class="class-pill pill-neutral">No complete rule</span>';
      return `
        <article class="mitigation-card" id="${escapeHtml(key)}">
          <div class="example-card-top">
            <div>
              <h3>${escapeHtml(s.title)}</h3>
              <p class="example-title">Classification: <strong>${escapeHtml(s.className)}</strong></p>
            </div>
            <span class="class-pill ${key === 'Unclassified' ? 'pill-neutral' : ''}">${escapeHtml(s.className)}</span>
          </div>
          <div class="condition-chips">${conditions}</div>
          <p>${escapeHtml(s.summary)}</p>
          <div class="mitigation-step-grid">
            <section>
              <h4>1. Immediate triage</h4>
              ${list(s.immediate)}
            </section>
            <section>
              <h4>2. Technical controls</h4>
              ${list(s.technical)}
            </section>
            <section>
              <h4>3. Monitoring and follow-up</h4>
              ${list(s.monitoring)}
            </section>
          </div>
        </article>`;
    }).join('');
  }

  document.addEventListener('DOMContentLoaded', render);
})();
