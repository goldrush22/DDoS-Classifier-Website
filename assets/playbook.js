(function () {
  'use strict';

  const ATTACKS = ['DoS', 'DDoS', 'LDoS', 'LDDoS', 'EDoS_S', 'EDoS_D', 'DoW', 'DDoW', 'DoA'];
  let currentPlaybook = null;
  function $(id) { return document.getElementById(id); }

  function init() {
    $('pbAttack').innerHTML = ATTACKS.map(a => `<option value="${a}">${a}</option>`).join('');
    $('pbAttack').value = 'DDoS';
    $('generatePlaybook').addEventListener('click', generate);
    $('downloadPlaybook').addEventListener('click', download);
    $('printPlaybook').addEventListener('click', () => window.print());
  }

  function mitigationFor(attack) {
    const cat = window.DactMitigations || {};
    return cat[attack] || cat.DoS || { summary: 'Apply containment, rate controls, evidence preservation, and monitoring.', technical: [], immediate: [], monitoring: [] };
  }

  function generate() {
    const business = $('pbBusiness').value.trim() || 'the business';
    const businessType = $('pbBusinessType').value;
    const attack = $('pbAttack').value;
    const service = $('pbService').value.trim() || 'the affected online service';
    const symptom = $('pbSymptom').value;
    const severity = $('pbSeverity').value;
    const mitigation = mitigationFor(attack);

    const symptomText = {
      slow: 'service degradation or customer-facing lag',
      offline: 'service outage or intermittent unavailability',
      bill: 'unexpected metered-cost or billing exposure',
      quota: 'AI quota, token balance, or API-limit exhaustion',
      unknown: 'an unresolved denial-like incident requiring investigation'
    }[symptom];

    const sustainability = ['EDoS_S', 'EDoS_D', 'DoW', 'DDoW', 'DoA'].includes(attack);
    const distributed = ['DDoS', 'LDDoS', 'EDoS_D', 'DDoW'].includes(attack);
    const lowRate = ['LDoS', 'LDDoS'].includes(attack);

    const first15 = [
      `Confirm whether ${service} is slow, offline, unexpectedly expensive, or quota-limited.`,
      `Preserve the first evidence: timestamps, screenshots, provider alerts, invoices, logs, and customer reports.`,
      distributed ? 'Check whether traffic or requests are coming from multiple sources, accounts, clients, or regions.' : 'Identify whether one dominant source, account, API key, process, or client is responsible.',
      sustainability ? 'Check cloud, serverless, or AI usage dashboards for spend, invocation, token, model-call, or scaling spikes.' : 'Check request rate, connection count, latency, error rate, CPU, memory, queue depth, and bandwidth.',
      `Assign one person to technical containment and one person to customer/business communication for ${business}.`
    ];

    const firstHour = [
      ...mitigation.immediate.slice(0, 3),
      lowRate ? 'Analyse timing and periodicity, not just total packet or request volume.' : 'Compare current request/resource volume against the normal baseline.',
      sustainability ? 'Apply emergency spend controls, quotas, rate limits, function limits, token limits, or provider-side caps.' : 'Apply emergency blocking, rate limiting, CDN/WAF rules, provider mitigation, or endpoint throttling.',
      `Record the business impact on ${businessType}: affected service, start time, customer impact, and estimated financial exposure.`
    ];

    const firstDay = [
      ...mitigation.technical.slice(0, 3),
      ...mitigation.monitoring.slice(0, 2),
      'Review whether the incident response process worked and update rules, limits, logging, and escalation contacts.',
      'Prepare a short incident report including timeline, conditions identified, attack class, controls applied, and residual risk.'
    ];

    const evidence = [
      'PCAP or flow/request logs covering the incident window.',
      'Source IP, account, API key, client, endpoint, and user-agent evidence where available.',
      sustainability ? 'Cloud billing, autoscaling, serverless invocation, AI usage, token, model-call, or quota records.' : 'Latency, request rate, error rate, connection count, and resource-saturation metrics.',
      'Provider alerts, invoices, customer reports, screenshots, and internal incident notes.',
      'Before-and-after evidence showing the effect of mitigation controls.'
    ];

    const comms = [
      `Tell staff that ${service} is experiencing ${symptomText}.`,
      'Give customers a simple status message without technical speculation.',
      'Provide a fallback process where possible: phone orders, manual bookings, email forms, static page, or alternate payment path.',
      'Record customer complaints or failed transactions for post-incident impact estimation.'
    ];

    const controls = mitigation.technical.concat(mitigation.monitoring).slice(0, 8);

    currentPlaybook = {
      tool: 'D-ACT Incident Response Playbook Generator',
      generated_at: new Date().toISOString(),
      business,
      business_type: businessType,
      attack,
      service,
      symptom: symptomText,
      severity,
      first_15_minutes: first15,
      first_hour: firstHour,
      first_day: firstDay,
      evidence_to_preserve: evidence,
      communications: comms,
      recommended_controls: controls
    };
    render(currentPlaybook);
  }

  function render(pb) {
    $('playbookResult').hidden = false;
    $('downloadPlaybook').disabled = false;
    $('printPlaybook').disabled = false;
    $('playbookTitle').textContent = `${pb.attack} incident response playbook`;
    $('playbookIntro').textContent = `${pb.business} reports ${pb.symptom} affecting ${pb.service}. Severity is ${pb.severity}.`;
    $('playbookBadge').innerHTML = `<strong>${pb.attack}</strong><span>${pb.severity.toUpperCase()}</span><small>${pb.business_type}</small>`;
    $('pbFirst15').innerHTML = pb.first_15_minutes.map(x => `<li>${x}</li>`).join('');
    $('pbFirstHour').innerHTML = pb.first_hour.map(x => `<li>${x}</li>`).join('');
    $('pbFirstDay').innerHTML = pb.first_day.map(x => `<li>${x}</li>`).join('');
    $('pbEvidence').innerHTML = pb.evidence_to_preserve.map(x => `<li>${x}</li>`).join('');
    $('pbComms').innerHTML = pb.communications.map(x => `<li>${x}</li>`).join('');
    $('pbControls').innerHTML = pb.recommended_controls.map(x => `<li>${x}</li>`).join('');
    $('playbookJson').textContent = JSON.stringify(pb, null, 2);
    $('playbookResult').scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  function download() {
    if (!currentPlaybook) return;
    const blob = new Blob([JSON.stringify(currentPlaybook, null, 2)], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `dact-playbook-${currentPlaybook.attack}-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(a.href);
  }

  document.addEventListener('DOMContentLoaded', init);
})();
