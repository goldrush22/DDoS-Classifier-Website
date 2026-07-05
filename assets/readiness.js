(function () {
  'use strict';

  const CONDITIONS = ['C0', 'C1', 'C2', 'C3', 'C4', 'C5', 'C6'];
  const ATTACKS = {
    DoS: ['C0', 'C1'],
    DDoS: ['C0', 'C2'],
    LDoS: ['C0', 'C1', 'C3'],
    LDDoS: ['C0', 'C2', 'C3'],
    EDoS_S: ['C0', 'C1', 'C4'],
    EDoS_D: ['C0', 'C2', 'C4'],
    DoW: ['C0', 'C1', 'C4', 'C5'],
    DDoW: ['C0', 'C2', 'C4', 'C5'],
    DoA: ['C0', 'C6']
  };

  const QUESTIONS = [
    {
      id: 'critical_online_service',
      label: 'How dependent is the business on the online service staying available?',
      conditions: ['C0'],
      weight: 2,
      options: [
        ['0', 'Not dependent / mostly offline'],
        ['1', 'Some dependency but manual fallback exists'],
        ['2', 'Important service with customer impact if slow'],
        ['3', 'Business-critical: outage directly affects revenue']
      ]
    },
    {
      id: 'ddos_protection',
      label: 'Is DDoS or traffic protection enabled through a CDN, provider, WAF, or managed service?',
      conditions: ['C1', 'C2'],
      weight: 3,
      reverse: true,
      options: [
        ['0', 'No / unknown'],
        ['1', 'Basic provider protection only'],
        ['2', 'WAF/CDN or rate limits configured'],
        ['3', 'Managed DDoS protection with tested rules']
      ]
    },
    {
      id: 'rate_limits',
      label: 'Are rate limits, connection limits, request size limits, and timeouts configured?',
      conditions: ['C1', 'C2', 'C3'],
      weight: 3,
      reverse: true,
      options: [
        ['0', 'No / unknown'],
        ['1', 'Some defaults only'],
        ['2', 'Configured for public endpoints'],
        ['3', 'Configured, tested, and monitored']
      ]
    },
    {
      id: 'cloud_budget',
      label: 'If cloud-hosted, are budgets, spend alerts, quotas, and autoscaling limits configured?',
      conditions: ['C4'],
      weight: 3,
      reverse: true,
      options: [
        ['0', 'No / unknown'],
        ['1', 'Basic invoice review only'],
        ['2', 'Budgets and alerts configured'],
        ['3', 'Budgets, quotas, anomaly alerts, and scaling guardrails configured']
      ]
    },
    {
      id: 'serverless_controls',
      label: 'If serverless/FaaS is used, are invocation limits, concurrency caps, and event-chain controls configured?',
      conditions: ['C5'],
      weight: 3,
      reverse: true,
      options: [
        ['0', 'No / unknown'],
        ['1', 'Basic defaults only'],
        ['2', 'Some function limits configured'],
        ['3', 'Concurrency, invocation, timeout, and event-chain controls configured']
      ]
    },
    {
      id: 'ai_usage_controls',
      label: 'If AI tools/APIs are used, are token caps, model-call limits, tool-call limits, and API-key controls configured?',
      conditions: ['C6'],
      weight: 3,
      reverse: true,
      options: [
        ['0', 'No / unknown'],
        ['1', 'Manual usage review only'],
        ['2', 'Some token or API limits configured'],
        ['3', 'Token, model, tool, budget, key, and agent controls configured']
      ]
    },
    {
      id: 'logs_available',
      label: 'Can the business collect the evidence D-ACT needs: PCAP/flow, cloud, serverless, and AI usage logs?',
      conditions: ['C0', 'C1', 'C2', 'C3', 'C4', 'C5', 'C6'],
      weight: 2,
      reverse: true,
      options: [
        ['0', 'No / unknown'],
        ['1', 'Some logs but not centralised'],
        ['2', 'Most required logs available'],
        ['3', 'Logs available, retained, and exportable']
      ]
    },
    {
      id: 'response_plan',
      label: 'Does the business have an incident response plan for slow service, outage, unexpected cloud spend, or AI quota exhaustion?',
      conditions: ['C0'],
      weight: 2,
      reverse: true,
      options: [
        ['0', 'No plan'],
        ['1', 'Informal plan only'],
        ['2', 'Written response checklist'],
        ['3', 'Written, tested, and roles assigned']
      ]
    }
  ];

  let currentReport = null;

  function $(id) { return document.getElementById(id); }

  function renderQuestions() {
    const form = $('readinessForm');
    form.innerHTML = QUESTIONS.map((q, idx) => `
      <fieldset class="question-card">
        <legend>${idx + 1}. ${q.label}</legend>
        <div class="option-grid">
          ${q.options.map(([value, label]) => `
            <label class="radio-tile">
              <input type="radio" name="${q.id}" value="${value}" ${value === '1' ? 'checked' : ''}>
              <span>${label}</span>
            </label>
          `).join('')}
        </div>
      </fieldset>
    `).join('');
  }

  function answerValue(id) {
    const checked = document.querySelector(`input[name="${id}"]:checked`);
    return checked ? Number(checked.value) : 0;
  }

  function generateReport() {
    const business = ($('businessName').value || 'Unnamed business').trim();
    const service = ($('mainService').value || 'online service').trim();
    let totalPossible = 0;
    let readinessPoints = 0;
    const conditionRisk = Object.fromEntries(CONDITIONS.map(c => [c, 0]));
    const missingControls = [];
    const answers = {};

    QUESTIONS.forEach(q => {
      const value = answerValue(q.id);
      answers[q.id] = value;
      totalPossible += q.weight * 3;
      readinessPoints += q.reverse ? value * q.weight : (3 - value) * q.weight;
      const exposureScore = q.reverse ? (3 - value) * q.weight : value * q.weight;
      q.conditions.forEach(c => { conditionRisk[c] += exposureScore; });
      if (q.reverse && value <= 1) missingControls.push(q.label);
      if (!q.reverse && value >= 2) missingControls.push('High online dependency: ' + q.label);
    });

    const riskScore = Math.round((readinessPoints / Math.max(1, totalPossible)) * 100);
    const readinessScore = 100 - riskScore;
    let band = 'High readiness';
    if (readinessScore < 40) band = 'Low readiness';
    else if (readinessScore < 70) band = 'Moderate readiness';

    const attackRisk = Object.entries(ATTACKS).map(([attack, conds]) => {
      const score = conds.reduce((sum, c) => sum + (conditionRisk[c] || 0), 0);
      return { attack, conditions: conds, score };
    }).sort((a, b) => b.score - a.score);

    const priorityActions = buildPriorityActions(answers, attackRisk, service);

    currentReport = {
      tool: 'D-ACT Readiness Assessment',
      business,
      service,
      generated_at: new Date().toISOString(),
      readiness_score: readinessScore,
      risk_score: riskScore,
      readiness_band: band,
      highest_exposure_classes: attackRisk.slice(0, 4),
      condition_risk: conditionRisk,
      priority_actions: priorityActions,
      missing_controls: missingControls,
      answers
    };

    renderReport(currentReport);
  }

  function buildPriorityActions(answers, attackRisk, service) {
    const actions = [];
    if (answers.ddos_protection <= 1) actions.push(`Enable provider/CDN/WAF DDoS protection for ${service} and document escalation contacts.`);
    if (answers.rate_limits <= 1) actions.push('Configure per-source and aggregate rate limits, connection limits, timeouts, and request-size limits.');
    if (answers.cloud_budget <= 1) actions.push('Set cloud budgets, spend alerts, scaling limits, and service quotas to reduce EDoS exposure.');
    if (answers.serverless_controls <= 1) actions.push('Apply serverless concurrency caps, invocation alarms, timeout limits, and event-chain controls.');
    if (answers.ai_usage_controls <= 1) actions.push('Apply AI token budgets, model-call limits, tool-call limits, API-key controls, and agent recursion limits.');
    if (answers.logs_available <= 1) actions.push('Enable exportable PCAP/flow, cloud billing, serverless invocation, and AI usage logs.');
    if (answers.response_plan <= 1) actions.push('Create a denial-attack response playbook with first-15-minute, first-hour, and first-day actions.');
    actions.push(`Review the highest exposure classes first: ${attackRisk.slice(0, 3).map(x => x.attack).join(', ')}.`);
    return actions.slice(0, 8);
  }

  function renderReport(report) {
    $('readinessResult').hidden = false;
    $('downloadReadiness').disabled = false;
    $('printReadiness').disabled = false;
    $('readinessSummary').textContent = `${report.business} depends on ${report.service}. The estimated readiness band is ${report.readiness_band}.`;
    $('readinessScoreCard').innerHTML = `<strong>${report.readiness_score}/100</strong><span>${report.readiness_band}</span><small>Higher is better</small>`;
    $('readinessMetricCards').innerHTML = `
      <div class="metric-card"><strong>${report.risk_score}/100</strong><span>Residual risk pressure</span></div>
      <div class="metric-card"><strong>${report.highest_exposure_classes[0].attack}</strong><span>Highest modelled exposure class</span></div>
      <div class="metric-card"><strong>${report.priority_actions.length}</strong><span>Priority actions generated</span></div>
    `;
    $('exposureChips').innerHTML = report.highest_exposure_classes.map(x => `<span class="attack-chip"><strong>${x.attack}</strong><small>${x.conditions.join(', ')} · score ${x.score}</small></span>`).join('');
    $('priorityActions').innerHTML = report.priority_actions.map(a => `<li>${a}</li>`).join('');
    $('conditionCoverage').innerHTML = CONDITIONS.map(c => `<div class="condition-tile"><strong>${c}</strong><span>Risk weight ${report.condition_risk[c]}</span></div>`).join('');
    $('readinessJson').textContent = JSON.stringify(report, null, 2);
    $('readinessResult').scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  function downloadReport() {
    if (!currentReport) return;
    const blob = new Blob([JSON.stringify(currentReport, null, 2)], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `dact-readiness-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(a.href);
  }

  document.addEventListener('DOMContentLoaded', () => {
    renderQuestions();
    $('generateReadiness').addEventListener('click', generateReport);
    $('downloadReadiness').addEventListener('click', downloadReport);
    $('printReadiness').addEventListener('click', () => window.print());
    $('resetReadiness').addEventListener('click', () => { renderQuestions(); $('readinessResult').hidden = true; currentReport = null; });
  });
})();
