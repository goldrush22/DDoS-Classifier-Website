(function () {
  'use strict';

  const CONDITIONS = {
    C0: 'Denial activity exists',
    C1: 'Single source',
    C2: 'Multiple sources',
    C3: 'Low-rate / stealthy',
    C4: 'Cloud-targeted',
    C5: 'Serverless-targeted',
    C6: 'AI-targeted'
  };

  const ATTACKS = {
    DoS: {
      label: 'DoS',
      name: 'Denial of Service',
      conditions: ['C0', 'C1'],
      sourceMode: 'single',
      flow: 'high',
      route: ['Direct service'],
      victim: 'Application / host service',
      meters: [{ label: 'Service pressure', value: 88 }, { label: 'Connection pressure', value: 82 }],
      summary: 'One source sends denial-relevant traffic directly to a victim service. No cloud, serverless, or AI-specific condition is required.'
    },
    DDoS: {
      label: 'DDoS',
      name: 'Distributed Denial of Service',
      conditions: ['C0', 'C2'],
      sourceMode: 'distributed',
      flow: 'high',
      route: ['Direct service'],
      victim: 'Application / network service',
      meters: [{ label: 'Ingress saturation', value: 95 }, { label: 'Service pressure', value: 86 }],
      summary: 'Multiple sources send denial-relevant traffic to the same victim. The defining source condition is C2 rather than C1.'
    },
    LDoS: {
      label: 'LDoS',
      name: 'Low-rate Denial of Service',
      conditions: ['C0', 'C1', 'C3'],
      sourceMode: 'single',
      flow: 'low',
      route: ['Direct service'],
      victim: 'Application / protocol state',
      meters: [{ label: 'Timing disruption', value: 78 }, { label: 'Volume visibility', value: 32 }],
      summary: 'One source sends slow or periodic denial traffic. The traffic volume is low, but the timing pattern can still degrade the service.'
    },
    LDDoS: {
      label: 'LDDoS',
      name: 'Low-rate Distributed Denial of Service',
      conditions: ['C0', 'C2', 'C3'],
      sourceMode: 'distributed',
      flow: 'low',
      route: ['Direct service'],
      victim: 'Application / protocol state',
      meters: [{ label: 'Distributed timing pressure', value: 82 }, { label: 'Per-source visibility', value: 28 }],
      summary: 'Multiple sources each send low-rate or periodic traffic. Individually the sources may look minor; collectively they produce denial pressure.'
    },
    EDoS_S: {
      label: 'EDoS_S',
      name: 'Single-source Economic Denial of Sustainability',
      conditions: ['C0', 'C1', 'C4'],
      sourceMode: 'single',
      flow: 'high',
      route: ['Cloud edge', 'Autoscaling layer'],
      victim: 'Cloud-hosted service',
      meters: [{ label: 'Cloud cost growth', value: 86 }, { label: 'Autoscaling pressure', value: 78 }],
      summary: 'One source triggers chargeable cloud-resource growth. The defining sustainability condition is C4; distribution is not required.'
    },
    EDoS_D: {
      label: 'EDoS_D',
      name: 'Distributed Economic Denial of Sustainability',
      conditions: ['C0', 'C2', 'C4'],
      sourceMode: 'distributed',
      flow: 'high',
      route: ['Cloud edge', 'Autoscaling layer'],
      victim: 'Cloud-hosted service',
      meters: [{ label: 'Cloud cost growth', value: 92 }, { label: 'Autoscaling pressure', value: 88 }],
      summary: 'Multiple sources trigger chargeable cloud-resource growth, combining distributed traffic with cloud economic sustainability harm.'
    },
    DoW: {
      label: 'DoW',
      name: 'Denial of Wallet',
      conditions: ['C0', 'C1', 'C4', 'C5'],
      sourceMode: 'single',
      flow: 'high',
      route: ['Cloud edge', 'Serverless functions'],
      victim: 'FaaS / serverless workload',
      meters: [{ label: 'Function invocations', value: 90 }, { label: 'Billing exposure', value: 88 }],
      summary: 'One source triggers cloud-hosted serverless execution and granular billing exposure. DoW extends single-source EDoS with C5.'
    },
    DDoW: {
      label: 'DDoW',
      name: 'Distributed Denial of Wallet',
      conditions: ['C0', 'C2', 'C4', 'C5'],
      sourceMode: 'distributed',
      flow: 'high',
      route: ['Cloud edge', 'Serverless functions'],
      victim: 'FaaS / serverless workload',
      meters: [{ label: 'Function invocations', value: 96 }, { label: 'Billing exposure', value: 94 }],
      summary: 'Multiple sources trigger serverless invocation and billing exposure, combining distributed denial with serverless cost amplification.'
    },
    DoA: {
      label: 'DoA',
      name: 'Denial of Artificial Intelligence',
      conditions: ['C0', 'C6'],
      sourceMode: 'single-ai',
      flow: 'ai',
      route: ['AI gateway', 'Model inference'],
      victim: 'AI model / inference platform',
      meters: [{ label: 'Token consumption', value: 88 }, { label: 'Model-call pressure', value: 84 }, { label: 'Tool/agent load', value: 76 }],
      summary: 'AI-targeted denial consumes tokens, inference, context, tool calls, model calls, multimodal generation, or agentic execution. C6 is the defining condition.'
    }
  };

  const CONDITION_ORDER = ['C0', 'C1', 'C2', 'C3', 'C4', 'C5', 'C6'];

  // Interim financial-impact coefficients.
  // These values are transparent educational defaults, not measured loss claims.
  // They can be replaced later with empirical research data without changing the simulator design.
  const FINANCIAL_MODEL = {
    DoS: {
      mode: 'availability',
      meteredAudPerMinute: 0,
      availabilityImpact: 0.70,
      unit: 'availability loss / service degradation minute',
      basis: 'Illustrative availability-loss coefficient. A direct single-source denial event is modelled as reducing the business value of the online service while the service is degraded.'
    },
    DDoS: {
      mode: 'availability',
      meteredAudPerMinute: 0,
      availabilityImpact: 0.95,
      unit: 'availability loss / outage minute',
      basis: 'Illustrative distributed availability-loss coefficient. Distributed traffic is modelled as causing severe online-service disruption or outage.'
    },
    LDoS: {
      mode: 'availability',
      meteredAudPerMinute: 0,
      availabilityImpact: 0.50,
      unit: 'low-rate degradation minute',
      basis: 'Illustrative low-rate loss coefficient. The service may remain reachable but lag, delay, and intermittent failure are modelled as reducing online profit by approximately half.'
    },
    LDDoS: {
      mode: 'availability',
      meteredAudPerMinute: 0,
      availabilityImpact: 0.65,
      unit: 'distributed low-rate degradation minute',
      basis: 'Illustrative distributed low-rate loss coefficient. Distributed timing pressure is modelled as causing broader degradation than a single-source low-rate pattern.'
    },
    EDoS_S: {
      mode: 'sustainability',
      meteredAudPerMinute: 100.00,
      availabilityImpact: 0.20,
      unit: 'autoscaling / cloud-resource minute',
      basis: 'Illustrative cloud sustainability cost coefficient. Autoscaling itself may not have an extra fee, but scaled compute, bandwidth, monitoring, and managed resources are billable.'
    },
    EDoS_D: {
      mode: 'sustainability',
      meteredAudPerMinute: 180.00,
      availabilityImpact: 0.30,
      unit: 'distributed autoscaling / cloud-resource minute',
      basis: 'Illustrative distributed cloud sustainability coefficient. Multiple sources are assumed to force greater elastic resource consumption and a higher chance of degraded user experience.'
    },
    DoW: {
      mode: 'sustainability',
      meteredAudPerMinute: 0.10,
      availabilityImpact: 0.10,
      unit: 'serverless billing minute',
      basis: 'Illustrative serverless Denial-of-Wallet coefficient. Serverless platforms commonly meter invocation, duration, memory, and downstream service use.'
    },
    DDoW: {
      mode: 'sustainability',
      meteredAudPerMinute: 0.35,
      availabilityImpact: 0.18,
      unit: 'distributed serverless billing minute',
      basis: 'Illustrative distributed Denial-of-Wallet coefficient. Distributed requests are assumed to increase invocation and event-chain pressure.'
    },
    DoA: {
      mode: 'sustainability',
      meteredAudPerMinute: 1.20,
      availabilityImpact: 0.15,
      unit: 'AI inference / token minute',
      basis: 'Illustrative AI-denial coefficient. AI platforms commonly meter model calls, token consumption, context, tools, and generated outputs.'
    }
  };

  const MITIGATION_MULTIPLIERS = {
    DoS: { block: 0.08, throttle: 0.30, harden: 0.45, scrub: 0.40, monitor: 0.82, generic: 0.60 },
    DDoS: { block: 0.35, throttle: 0.42, harden: 0.75, scrub: 0.18, monitor: 0.85, generic: 0.62 },
    LDoS: { block: 0.10, throttle: 0.35, harden: 0.38, scrub: 0.55, monitor: 0.70, generic: 0.60 },
    LDDoS: { block: 0.35, throttle: 0.40, harden: 0.45, scrub: 0.32, monitor: 0.72, generic: 0.60 },
    EDoS_S: { block: 0.10, throttle: 0.28, budget: 0.18, harden: 0.48, scrub: 0.42, monitor: 0.70, generic: 0.58 },
    EDoS_D: { block: 0.35, throttle: 0.36, budget: 0.20, harden: 0.55, scrub: 0.24, monitor: 0.72, generic: 0.58 },
    DoW: { block: 0.10, throttle: 0.30, budget: 0.24, serverless: 0.16, harden: 0.46, monitor: 0.72, generic: 0.58 },
    DDoW: { block: 0.36, throttle: 0.34, budget: 0.24, serverless: 0.18, scrub: 0.26, harden: 0.52, monitor: 0.74, generic: 0.58 },
    DoA: { block: 0.18, throttle: 0.30, budget: 0.24, ai: 0.16, harden: 0.44, monitor: 0.72, generic: 0.58 }
  };

  const DEFAULT_PROFILE = {
    name: "Mary's Cafe",
    amount: 160000,
    period: 'Yearly',
    onlineHourlyProfit: 90
  };

  let selectedAttack = 'DoS';
  let isPlaying = true;
  let packetTimer = null;
  let packetCounter = 0;
  let activeMitigation = null;
  let victimProfile = { ...DEFAULT_PROFILE };
  let financialState = {
    accumulatedGrossExposure: 0,
    accumulatedNetExposure: 0,
    accumulatedMeteredCost: 0,
    accumulatedAvailabilityLoss: 0,
    accumulatedAvoidedExposure: 0,
    simulatedEvents: 0,
    lastAttack: selectedAttack,
    lastEvent: null
  };

  const $ = (id) => document.getElementById(id);

  function escapeHtml(value) {
    return String(value)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  function getMitigationStrategy(key) {
    if (window.DactMitigations && typeof window.DactMitigations.getStrategy === 'function') {
      return window.DactMitigations.getStrategy(key);
    }
    return {
      title: `${key} mitigation`,
      className: key,
      conditions: ATTACKS[key]?.conditions || [],
      summary: 'Mitigation data could not be loaded.',
      immediate: [],
      technical: [],
      monitoring: []
    };
  }

  function formatCurrency(value, compact = false) {
    const numeric = Number.isFinite(value) ? value : 0;
    return new Intl.NumberFormat('en-AU', {
      style: 'currency',
      currency: 'AUD',
      notation: compact && Math.abs(numeric) >= 1000 ? 'compact' : 'standard',
      minimumFractionDigits: Math.abs(numeric) >= 100 ? 0 : 2,
      maximumFractionDigits: Math.abs(numeric) >= 100 ? 0 : 2
    }).format(numeric);
  }

  function formatNumber(value) {
    return new Intl.NumberFormat('en-AU', {
      maximumFractionDigits: 2
    }).format(Number.isFinite(value) ? value : 0);
  }

  function normaliseProfitToDaily(profile) {
    const amount = Math.max(0, Number(profile.amount) || 0);
    if (profile.period === 'Daily') return amount;
    if (profile.period === 'Monthly') return amount / 30.4375;
    return amount / 365;
  }

  function getProfileOnlineProfitPerHour() {
    return Math.max(0, Number(victimProfile.onlineHourlyProfit) || 0);
  }

  function getOnlineProfitPerMinute() {
    return getProfileOnlineProfitPerHour() / 60;
  }

  function getFinancialModel(attackKey) {
    return FINANCIAL_MODEL[attackKey] || {
      mode: 'none',
      meteredAudPerMinute: 0,
      availabilityImpact: 0,
      unit: 'not applicable',
      basis: 'No financial-impact model is applied to this class.'
    };
  }

  function estimatedEventsPerMinute(attack) {
    if (attack.flow === 'low' && attack.sourceMode === 'distributed') return 70;
    if (attack.flow === 'low') return 50;
    if (attack.flow === 'ai') return 140;
    if (attack.sourceMode === 'distributed') return 810;
    return 270;
  }

  function getMitigationMultiplier(attackKey, effect) {
    if (!effect) return 1;
    const attackMap = MITIGATION_MULTIPLIERS[attackKey] || {};
    return attackMap[effect] || attackMap.generic || 0.65;
  }

  function getCurrentFinancialRate() {
    const model = getFinancialModel(selectedAttack);
    const meteredPerMinute = Math.max(0, model.meteredAudPerMinute || 0);
    const availabilityPerMinute = getOnlineProfitPerMinute() * Math.max(0, model.availabilityImpact || 0);
    const grossPerMinute = meteredPerMinute + availabilityPerMinute;
    const multiplier = activeMitigation ? getMitigationMultiplier(selectedAttack, activeMitigation.effect) : 1;
    const netPerMinute = grossPerMinute * multiplier;
    return {
      mode: model.mode,
      meteredPerMinute,
      availabilityPerMinute,
      grossPerMinute,
      netPerMinute,
      avoidedPerMinute: Math.max(0, grossPerMinute - netPerMinute),
      multiplier,
      model
    };
  }

  function estimateCurrentEventFinancials() {
    const attack = ATTACKS[selectedAttack];
    const rate = getCurrentFinancialRate();
    const eventRate = estimatedEventsPerMinute(attack);
    const grossEvent = rate.grossPerMinute / Math.max(1, eventRate);
    const netEvent = rate.netPerMinute / Math.max(1, eventRate);
    return {
      ...rate,
      eventRate,
      grossEvent,
      netEvent,
      avoidedEvent: Math.max(0, grossEvent - netEvent)
    };
  }

  function resetFinancialState() {
    financialState = {
      accumulatedGrossExposure: 0,
      accumulatedNetExposure: 0,
      accumulatedMeteredCost: 0,
      accumulatedAvailabilityLoss: 0,
      accumulatedAvoidedExposure: 0,
      simulatedEvents: 0,
      lastAttack: selectedAttack,
      lastEvent: null
    };
    renderFinancialDashboard();
  }

  function recordFinancialEvent() {
    if (financialState.lastAttack !== selectedAttack) {
      resetFinancialState();
    }

    const event = estimateCurrentEventFinancials();
    const meteredShare = event.grossPerMinute > 0 ? event.meteredPerMinute / event.grossPerMinute : 0;
    const availabilityShare = event.grossPerMinute > 0 ? event.availabilityPerMinute / event.grossPerMinute : 0;

    financialState.accumulatedGrossExposure += event.grossEvent;
    financialState.accumulatedNetExposure += event.netEvent;
    financialState.accumulatedMeteredCost += event.netEvent * meteredShare;
    financialState.accumulatedAvailabilityLoss += event.netEvent * availabilityShare;
    financialState.accumulatedAvoidedExposure += event.avoidedEvent;
    financialState.simulatedEvents += 1;
    financialState.lastEvent = event;
    renderFinancialDashboard(event);
    return event;
  }

  function getVictimProfileFromInputs() {
    const period = $('victimProfitPeriod')?.value || 'Yearly';
    const allowedPeriod = ['Daily', 'Monthly', 'Yearly'].includes(period) ? period : 'Yearly';
    return {
      name: ($('victimBusinessName')?.value || 'Unnamed victim').trim() || 'Unnamed victim',
      amount: Math.max(0, Number($('victimProfitAmount')?.value || 0)),
      period: allowedPeriod,
      onlineHourlyProfit: Math.max(0, Number($('victimOnlineHourlyProfit')?.value || 0))
    };
  }

  function renderFinancialDashboard(lastEvent) {
    const panel = $('financialDashboard');
    if (!panel) return;

    const attack = ATTACKS[selectedAttack];
    const model = getFinancialModel(selectedAttack);
    const profitDaily = normaliseProfitToDaily(victimProfile);
    const normalisedProfitPerMinute = profitDaily / 1440;
    const onlineProfitPerHour = getProfileOnlineProfitPerHour();
    const onlineProfitPerMinute = getOnlineProfitPerMinute();
    const annualisedProfit = victimProfile.period === 'Yearly' ? victimProfile.amount : profitDaily * 365;
    const rate = getCurrentFinancialRate();
    const exposureRatio = onlineProfitPerMinute > 0 ? rate.netPerMinute / onlineProfitPerMinute : 0;
    const grossExposureRatio = onlineProfitPerMinute > 0 ? rate.grossPerMinute / onlineProfitPerMinute : 0;
    const profitEquivalentMinutes = onlineProfitPerMinute > 0 ? financialState.accumulatedNetExposure / onlineProfitPerMinute : 0;

    const modeLabel = model.mode === 'sustainability'
      ? 'metered sustainability + service-impact model'
      : model.mode === 'availability'
        ? 'availability-loss model'
        : 'no financial model active';

    const statusText = model.mode === 'sustainability'
      ? `${attack.label} is modelled as a sustainability-denial class. Running exposure combines metered resource cost with optional online-service degradation.`
      : `${attack.label} is modelled as an availability-denial class. Running exposure is estimated from the hourly online profit placed at risk by service outage, lag, or degradation.`;

    const mitigationText = activeMitigation
      ? `Active control: ${escapeHtml(activeMitigation.text)}. Remaining exposure multiplier: ${formatNumber(rate.multiplier)}.`
      : 'No mitigation control is currently selected. The simulator is showing unmitigated exposure.';

    panel.innerHTML = `
      <div class="financial-card victim-card">
        <span class="financial-kicker">Victim profile</span>
        <strong>${escapeHtml(victimProfile.name)}</strong>
        <small>${escapeHtml(victimProfile.period)} profit entered: ${formatCurrency(victimProfile.amount)}</small>
        <small>Normalised profit: ${formatCurrency(profitDaily)} per day / ${formatCurrency(normalisedProfitPerMinute)} per minute</small>
        <small>Online-service profit estimate: ${formatCurrency(onlineProfitPerHour)} per hour / ${formatCurrency(onlineProfitPerMinute)} per minute</small>
      </div>
      <div class="financial-card ${model.mode === 'sustainability' ? 'financial-active' : 'financial-availability'}">
        <span class="financial-kicker">Selected attack</span>
        <strong>${escapeHtml(attack.label)}</strong>
        <small>${escapeHtml(statusText)}</small>
        <small>${escapeHtml(model.unit)}; ${escapeHtml(modeLabel)}</small>
      </div>
      <div class="financial-card">
        <span class="financial-kicker">Exposure rate after controls</span>
        <strong>${formatCurrency(rate.netPerMinute)} / minute</strong>
        <small>Unmitigated exposure: ${formatCurrency(rate.grossPerMinute)} / minute</small>
        <small>Metered cost: ${formatCurrency(rate.meteredPerMinute)} / minute; availability loss: ${formatCurrency(rate.availabilityPerMinute)} / minute</small>
      </div>
      <div class="financial-card financial-impact">
        <span class="financial-kicker">Running simulated exposure</span>
        <strong>${formatCurrency(financialState.accumulatedNetExposure)}</strong>
        <small>${financialState.simulatedEvents} visualised packet/resource events${lastEvent ? `; last event ${formatCurrency(lastEvent.netEvent)}` : ''}</small>
        <small>Equivalent to ${formatNumber(profitEquivalentMinutes)} minute(s) of online-service profit for ${escapeHtml(victimProfile.name)}.</small>
      </div>
      <div class="financial-card financial-savings">
        <span class="financial-kicker">Exposure avoided by controls</span>
        <strong>${formatCurrency(financialState.accumulatedAvoidedExposure)}</strong>
        <small>${escapeHtml(mitigationText)}</small>
        <small>Current avoided exposure rate: ${formatCurrency(rate.avoidedPerMinute)} / minute</small>
      </div>
      <div class="financial-card">
        <span class="financial-kicker">Cost-to-profit pressure</span>
        <strong>${formatNumber(exposureRatio)}× online profit/minute</strong>
        <small>Unmitigated pressure would be ${formatNumber(grossExposureRatio)}× online profit/minute.</small>
        <small>Annualised profit basis: ${formatCurrency(annualisedProfit)}</small>
      </div>
      <div class="financial-card financial-basis">
        <span class="financial-kicker">Basis note</span>
        <small>${escapeHtml(model.basis)}</small>
        <small>These are editable educational coefficients, not empirical claims. They are designed to be replaced by future measured research values.</small>
      </div>
    `;
  }


  function calculateAttackExposure(attackKey, profile) {
    const attack = ATTACKS[attackKey];
    const model = getFinancialModel(attackKey);
    const onlineHourlyProfit = Math.max(0, Number(profile.onlineHourlyProfit) || 0);
    const onlineProfitPerMinute = onlineHourlyProfit / 60;
    const meteredPerMinute = Math.max(0, Number(model.meteredAudPerMinute) || 0);
    const availabilityPerMinute = onlineProfitPerMinute * Math.max(0, Number(model.availabilityImpact) || 0);
    const grossPerMinute = meteredPerMinute + availabilityPerMinute;
    const technical = getMitigationStrategy(attackKey).technical || [];
    const controls = technical.map((text) => {
      const effect = inferMitigationEffect(text, attackKey);
      const multiplier = getMitigationMultiplier(attackKey, effect);
      return { text, effect, multiplier, reduction: Math.max(0, 1 - multiplier) };
    }).sort((a, b) => a.multiplier - b.multiplier);
    const bestControl = controls[0] || { text: 'No technical control available in mitigation catalogue.', effect: 'generic', multiplier: 1, reduction: 0 };
    const mitigatedPerMinute = grossPerMinute * bestControl.multiplier;
    const avoidedPerMinute = Math.max(0, grossPerMinute - mitigatedPerMinute);
    const oneHour = grossPerMinute * 60;
    const eightHours = grossPerMinute * 480;
    const oneDay = grossPerMinute * 1440;
    const mitigatedOneHour = mitigatedPerMinute * 60;
    const onlineProfitPressure = onlineHourlyProfit > 0 ? oneHour / onlineHourlyProfit : 0;
    const dailyProfit = normaliseProfitToDaily(profile);
    const annualProfit = profile.period === 'Yearly' ? profile.amount : dailyProfit * 365;
    const eightHourAnnualPercent = annualProfit > 0 ? (eightHours / annualProfit) * 100 : 0;
    const mechanism = model.mode === 'sustainability'
      ? 'metered sustainability cost plus service-impact exposure'
      : model.mode === 'availability'
        ? 'lost or degraded online-service revenue'
        : 'no complete financial model';

    return {
      key: attackKey,
      label: attack.label,
      name: attack.name,
      conditions: attack.conditions,
      mode: model.mode,
      mechanism,
      meteredPerMinute,
      availabilityPerMinute,
      grossPerMinute,
      grossPerHour: oneHour,
      grossEightHours: eightHours,
      grossOneDay: oneDay,
      mitigatedPerMinute,
      mitigatedPerHour: mitigatedOneHour,
      avoidedPerMinute,
      avoidedPerHour: avoidedPerMinute * 60,
      onlineProfitPressure,
      eightHourAnnualPercent,
      bestControl,
      modelBasis: model.basis
    };
  }

  function severityLabel(row) {
    if (row.grossPerHour >= 5000 || row.onlineProfitPressure >= 10) return 'Extreme';
    if (row.grossPerHour >= 1000 || row.onlineProfitPressure >= 4) return 'Severe';
    if (row.grossPerHour >= 250 || row.onlineProfitPressure >= 1) return 'Material';
    if (row.grossPerHour > 0) return 'Moderate';
    return 'None';
  }

  function severityClass(row) {
    return `severity-${severityLabel(row).toLowerCase()}`;
  }

  function filenameSafe(value) {
    return String(value || 'victim')
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '') || 'victim';
  }

  function buildVictimExposureReportData(profile) {
    const attacks = Object.keys(ATTACKS).map((attackKey) => calculateAttackExposure(attackKey, profile));
    attacks.sort((a, b) => b.grossPerHour - a.grossPerHour);
    const dailyProfit = normaliseProfitToDaily(profile);
    const annualProfit = profile.period === 'Yearly' ? profile.amount : dailyProfit * 365;
    const onlineHourlyProfit = Math.max(0, Number(profile.onlineHourlyProfit) || 0);
    return {
      generatedAt: new Date().toISOString(),
      profile: {
        name: profile.name,
        amount: profile.amount,
        period: profile.period,
        onlineHourlyProfit,
        normalisedDailyProfit: dailyProfit,
        annualisedProfit: annualProfit
      },
      assumptions: {
        purpose: 'Educational denial attack exposure simulation. Values are not empirical loss claims.',
        availabilityModel: 'Availability attacks convert the estimated online-service profit per hour into loss exposure using attack-specific degradation coefficients.',
        sustainabilityModel: 'Sustainability attacks add interim metered-cost coefficients to the availability-impact component.',
        replacementNote: 'Interim coefficients can be replaced later with empirical research data without changing the simulator design.'
      },
      attacks
    };
  }

  function downloadExposureReportJson(report) {
    const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `dact-victim-exposure-report-${filenameSafe(report.profile.name)}.json`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  }

  function renderVictimExposureReport() {
    const panel = $('victimExposureReport');
    if (!panel) return;

    const report = buildVictimExposureReportData(victimProfile);
    const onlineHourly = report.profile.onlineHourlyProfit;
    const topThree = report.attacks.slice(0, 3);
    const attackRows = report.attacks.map((row, index) => {
      const conditions = row.conditions.map((c) => `<span class="condition-chip chip-on">${escapeHtml(c)}</span>`).join('');
      return `<tr>
        <td><strong>${index + 1}. ${escapeHtml(row.label)}</strong><small>${escapeHtml(row.name)}</small></td>
        <td>${conditions}</td>
        <td>${escapeHtml(row.mechanism)}</td>
        <td><strong>${formatCurrency(row.grossPerHour)}</strong><small>${formatCurrency(row.grossPerMinute)} / minute</small></td>
        <td><strong>${formatCurrency(row.grossEightHours)}</strong><small>${formatNumber(row.eightHourAnnualPercent)}% of annualised profit basis</small></td>
        <td><span class="severity-pill ${severityClass(row)}">${severityLabel(row)}</span><small>${formatNumber(row.onlineProfitPressure)}× online-service profit/hour</small></td>
        <td><strong>${formatNumber(row.bestControl.reduction * 100)}% reduction</strong><small>${escapeHtml(row.bestControl.text)}</small></td>
      </tr>`;
    }).join('');

    const topCards = topThree.map((row) => `<div class="exposure-risk-card ${severityClass(row)}">
      <span class="financial-kicker">Ranked risk</span>
      <strong>${escapeHtml(row.label)} — ${formatCurrency(row.grossPerHour)} / hour</strong>
      <small>${escapeHtml(row.mechanism)}</small>
      <small>Eight-hour scenario: ${formatCurrency(row.grossEightHours)}.</small>
      <small>Best listed control could reduce future simulated exposure by ${formatNumber(row.bestControl.reduction * 100)}%.</small>
    </div>`).join('');

    panel.hidden = false;
    panel.dataset.reportJson = JSON.stringify(report);
    panel.innerHTML = `
      <div class="exposure-report-header">
        <div>
          <span class="financial-kicker">Generated victim profile report</span>
          <h2>Denial attack exposure report for ${escapeHtml(report.profile.name)}</h2>
          <p>This report calculates simulated denial-exposure across all nine D-ACT attack classes. It is designed to make the financial risk of denial attacks visible to business users who may not realise that service disruption, lag, autoscaling, serverless invocation, or AI inference can translate into business loss.</p>
        </div>
        <div class="exposure-report-actions">
          <button id="downloadExposureReport" type="button" class="secondary">Download JSON report</button>
          <button id="printExposureReport" type="button" class="secondary">Print / save report</button>
        </div>
      </div>

      <div class="exposure-profile-summary">
        <div><span>Business</span><strong>${escapeHtml(report.profile.name)}</strong></div>
        <div><span>${escapeHtml(report.profile.period)} profit entered</span><strong>${formatCurrency(report.profile.amount)}</strong></div>
        <div><span>Annualised profit basis</span><strong>${formatCurrency(report.profile.annualisedProfit)}</strong></div>
        <div><span>Online-service profit estimate</span><strong>${formatCurrency(onlineHourly)} / hour</strong></div>
      </div>

      <div class="exposure-emphasis-box">
        <strong>Why this matters:</strong> denial attacks can harm a business in two financial ways. Availability attacks can reduce or remove revenue from an online service while users experience lag, failed orders, or outage. Sustainability attacks can also create pay-per-use exposure through cloud scaling, serverless invocation, or AI inference consumption. The figures below are educational simulations using transparent interim coefficients, not measured invoice claims.
      </div>

      <div class="exposure-risk-grid">${topCards}</div>

      <div class="exposure-table-wrap">
        <table class="exposure-report-table">
          <thead>
            <tr>
              <th>Attack</th>
              <th>Conditions</th>
              <th>Financial mechanism</th>
              <th>Simulated exposure / hour</th>
              <th>Eight-hour scenario</th>
              <th>Risk pressure</th>
              <th>Strongest listed mitigation effect</th>
            </tr>
          </thead>
          <tbody>${attackRows}</tbody>
        </table>
      </div>

      <div class="exposure-report-note">
        <strong>Interpretation:</strong> these calculations are designed for education and scenario modelling. They should be read as financial exposure indicators, not as actual losses. Replace the interim coefficients in <code>FINANCIAL_MODEL</code> with empirical research values when available.
      </div>
    `;

    $('downloadExposureReport')?.addEventListener('click', () => downloadExposureReportJson(report));
    $('printExposureReport')?.addEventListener('click', () => window.print());
  }

  function clearVictimExposureReport() {
    const panel = $('victimExposureReport');
    if (!panel) return;
    panel.hidden = true;
    panel.innerHTML = '';
    delete panel.dataset.reportJson;
  }

  function initAttackSelect() {
    const options = Object.entries(ATTACKS).map(([key, attack]) => {
      return `<option value="${escapeHtml(key)}">${escapeHtml(attack.label)} — ${escapeHtml(attack.name)}</option>`;
    }).join('');

    const selects = ['attackSelect', 'attackSelectInline']
      .map((id) => $(id))
      .filter(Boolean);

    const updateSelection = (value) => {
      selectedAttack = value;
      selects.forEach((select) => { select.value = selectedAttack; });
      activeMitigation = null;
      resetFinancialState();
      renderSimulator();
      restartPacketFlow();
    };

    selects.forEach((select) => {
      select.innerHTML = options;
      select.value = selectedAttack;
      select.addEventListener('change', () => updateSelection(select.value));
    });
  }

  function renderConditionStrip(attack) {
    const active = new Set(attack.conditions);
    const html = CONDITION_ORDER.map((condition) => {
      const isActive = active.has(condition);
      return `<div class="sim-condition-card ${isActive ? 'active' : 'inactive'}">
        <strong>${condition}</strong>
        <span>${isActive ? 'Active' : 'Absent'}</span>
        <small>${escapeHtml(CONDITIONS[condition])}</small>
      </div>`;
    }).join('');
    $('simConditionStrip').innerHTML = html;
  }

  function renderSideConditionChips(attack) {
    const active = new Set(attack.conditions);
    $('sideConditions').innerHTML = CONDITION_ORDER.map((condition) => {
      return `<span class="condition-chip ${active.has(condition) ? 'chip-on' : 'chip-off'}">${condition}</span>`;
    }).join('');
  }

  function renderAttackers(attack) {
    const cluster = $('attackerCluster');
    const count = attack.sourceMode === 'distributed' ? 8 : 1;
    const label = attack.sourceMode === 'distributed' ? 'bot/source' : (attack.sourceMode === 'single-ai' ? 'AI client' : 'source');
    cluster.className = `attacker-cluster ${attack.sourceMode}`;
    cluster.innerHTML = Array.from({ length: count }).map((_, index) => {
      return `<div class="attacker-node" style="--node-index:${index}">
        <span>${attack.sourceMode === 'distributed' ? index + 1 : '1'}</span>
        <small>${label}</small>
      </div>`;
    }).join('');
  }

  function renderPipeline(attack) {
    const stages = attack.route.map((stage) => {
      let icon = '●';
      if (/cloud/i.test(stage)) icon = '☁';
      if (/serverless|function/i.test(stage)) icon = 'λ';
      if (/AI|Model|inference/i.test(stage)) icon = '◈';
      if (/Direct/i.test(stage)) icon = '⇢';
      if (/Autoscaling/i.test(stage)) icon = '↟';
      return `<div class="pipeline-stage"><span>${icon}</span><strong>${escapeHtml(stage)}</strong></div>`;
    }).join('');
    $('pipelineStages').innerHTML = stages;
  }

  function mitigationReduction(effect) {
    const multiplier = getMitigationMultiplier(selectedAttack, effect);
    return Math.max(0.10, Math.min(1, multiplier + 0.10));
  }

  function renderVictim(attack) {
    $('victimVisual').innerHTML = `
      <div class="victim-icon">${attack.conditions.includes('C6') ? 'AI' : attack.conditions.includes('C5') ? 'λ' : attack.conditions.includes('C4') ? '☁' : 'V'}</div>
      <strong>${escapeHtml(attack.victim)}</strong>
      <small>Victim resource domain</small>
    `;
    $('resourceMeters').innerHTML = attack.meters.map((meter) => {
      const value = activeMitigation ? Math.max(12, Math.round(meter.value * mitigationReduction(activeMitigation.effect))) : meter.value;
      return `<div class="resource-meter">
        <div class="meter-label"><span>${escapeHtml(meter.label)}</span><strong>${value}%</strong></div>
        <div class="meter-track"><div class="meter-fill" style="width:${value}%"></div></div>
      </div>`;
    }).join('');
  }

  function inferMitigationEffect(text, attackKey) {
    const t = text.toLowerCase();
    if (/block|deny|access-control|captcha|challenge|restriction|blackhole|drop|suspension|revocation|disablement/.test(t)) return 'block';
    if (/rate|thrott|connection limit|per-source|quota|token bucket|usage limit|per-key|per-account|per-tenant/.test(t)) return 'throttle';
    if (/timeout|request body|keep-alive|queue|retry|circuit|graceful|harden|idempotency|deduplication|dead-letter|jitter/.test(t)) return 'harden';
    if (/scrub|cdn|anycast|upstream|sinkhole|filter|provider|waf|edge|bot|origin shielding|static offload|caching/.test(t)) return 'scrub';
    if (/budget|billing|spend|cost|autoscaling|scale|guardrail|ceiling|service quotas|consumption limits/.test(t)) return 'budget';
    if (/serverless|function|concurrency|invocation|cold start|event chain|faas|downstream/.test(t)) return 'serverless';
    if (/token|model|context|tool|agent|retrieval|multimodal|inference|recursion|watchdog|approval/.test(t) || attackKey === 'DoA') return 'ai';
    if (/monitor|alert|log|telemetry|dashboard|preserve|packet capture/.test(t)) return 'monitor';
    return 'generic';
  }

  function mitigationOverlayMarkup(effect) {
    const labels = {
      block: ['🛡', 'Access block / containment active'],
      throttle: ['⏱', 'Rate limiting / throttling active'],
      harden: ['⚙', 'Endpoint hardening stabilises queues, limits, and retry behaviour'],
      scrub: ['🧹', 'Traffic filtering / scrubbing layer active'],
      budget: ['💳', 'Cost guardrail / scaling limit active'],
      serverless: ['λ', 'Serverless concurrency and invocation caps active'],
      ai: ['◈', 'AI token, model-call, tool-call, or agent limit active'],
      monitor: ['⌁', 'Monitoring and alerting overlay active'],
      generic: ['✓', 'Defensive control applied']
    };
    const [icon, label] = labels[effect] || labels.generic;
    const rate = getCurrentFinancialRate();
    return `<div class="mitigation-shield"><span>${icon}</span><strong>${escapeHtml(label)}</strong><small>Simulated exposure now ${formatCurrency(rate.netPerMinute)} / minute</small><small>Estimated reduction: ${formatNumber((1 - rate.multiplier) * 100)}%</small></div>`;
  }

  function describeControlFinancialImpact(effect, attackKey) {
    const model = getFinancialModel(attackKey);
    const multiplier = getMitigationMultiplier(attackKey, effect);
    const reduction = Math.max(0, (1 - multiplier) * 100);
    const target = model.mode === 'sustainability' ? 'metered sustainability exposure' : 'availability-loss exposure';
    return `Simulated effect: reduces remaining ${target} to ${formatNumber(multiplier)}× (${formatNumber(reduction)}% reduction).`;
  }

  function scrollBackToSimulation() {
    const target = $('simScene') || document.querySelector('.simulator-main-panel');
    if (target && typeof target.scrollIntoView === 'function') {
      target.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }

  function renderMitigationPanel(attackKey) {
    const strategy = getMitigationStrategy(attackKey);
    $('sideMitigationTitle').textContent = strategy.title || `${attackKey} mitigation`;
    $('sideMitigationSummary').textContent = strategy.summary || '';
    $('sideClassification').textContent = strategy.className || attackKey;

    const renderList = (id, items) => {
      $(id).innerHTML = (items || []).map((item) => `<li>${escapeHtml(item)}</li>`).join('');
    };
    renderList('sideImmediate', strategy.immediate);
    renderList('sideMonitoring', strategy.monitoring);

    $('sideTechnicalControls').innerHTML = (strategy.technical || []).map((item, index) => {
      const effect = inferMitigationEffect(item, attackKey);
      const note = describeControlFinancialImpact(effect, attackKey);
      return `<button type="button" class="technical-control-button" data-index="${index}" data-effect="${effect}">
        <span>${escapeHtml(item)}</span>
        <small>${escapeHtml(note)}</small>
      </button>`;
    }).join('');

    document.querySelectorAll('.technical-control-button').forEach((button) => {
      button.addEventListener('click', () => {
        document.querySelectorAll('.technical-control-button').forEach((b) => b.classList.remove('selected'));
        button.classList.add('selected');
        activeMitigation = {
          text: button.querySelector('span')?.textContent || button.textContent,
          effect: button.dataset.effect || 'generic'
        };
        applyMitigationEffect();
        window.requestAnimationFrame(() => scrollBackToSimulation());
      });
    });
  }

  function applyMitigationEffect() {
    const scene = $('simScene');
    scene.classList.remove('mitigation-block', 'mitigation-throttle', 'mitigation-harden', 'mitigation-scrub', 'mitigation-budget', 'mitigation-serverless', 'mitigation-ai', 'mitigation-monitor', 'mitigation-generic');
    const effect = activeMitigation?.effect || 'generic';
    scene.classList.add(`mitigation-${effect}`);

    const overlay = $('mitigationOverlay');
    overlay.hidden = false;
    overlay.innerHTML = mitigationOverlayMarkup(effect);

    $('activeMitigationBox').hidden = false;
    $('activeMitigationText').textContent = `${activeMitigation.text} Current simulated exposure rate is ${formatCurrency(getCurrentFinancialRate().netPerMinute)} per minute.`;
    renderVictim(ATTACKS[selectedAttack]);
    renderFinancialDashboard();
  }

  function clearMitigationEffect() {
    activeMitigation = null;
    const scene = $('simScene');
    scene.classList.remove('mitigation-block', 'mitigation-throttle', 'mitigation-harden', 'mitigation-scrub', 'mitigation-budget', 'mitigation-serverless', 'mitigation-ai', 'mitigation-monitor', 'mitigation-generic');
    $('mitigationOverlay').hidden = true;
    $('mitigationOverlay').innerHTML = '';
    $('activeMitigationBox').hidden = true;
    document.querySelectorAll('.technical-control-button').forEach((button) => button.classList.remove('selected'));
    renderVictim(ATTACKS[selectedAttack]);
    renderFinancialDashboard();
  }

  function renderSimulator() {
    const attack = ATTACKS[selectedAttack];
    $('simAttackTitle').textContent = `${attack.label} — ${attack.name}`;
    $('simAttackSubtitle').textContent = attack.summary;
    $('simClassPill').textContent = attack.label;
    ['attackSelect', 'attackSelectInline'].forEach((id) => {
      const select = $(id);
      if (select) select.value = selectedAttack;
    });
    $('attackSummary').innerHTML = `<strong>${escapeHtml(attack.label)}:</strong> ${escapeHtml(attack.summary)}`;

    renderConditionStrip(attack);
    renderSideConditionChips(attack);
    renderAttackers(attack);
    renderPipeline(attack);
    renderVictim(attack);
    renderMitigationPanel(selectedAttack);

    if (!activeMitigation) {
      clearMitigationEffect();
    } else {
      applyMitigationEffect();
    }
    renderFinancialDashboard();
  }

  function createPacket() {
    const attack = ATTACKS[selectedAttack];
    const lane = $('packetLane');
    const eventFinancials = recordFinancialEvent();
    const packet = document.createElement('span');
    const sourceIndex = attack.sourceMode === 'distributed' ? packetCounter % 8 : 0;
    const laneIndex = attack.sourceMode === 'distributed' ? sourceIndex : (packetCounter % 3);
    const isLowRate = attack.flow === 'low';
    const isAi = attack.flow === 'ai';
    const effect = activeMitigation?.effect || 'none';

    let packetLabel = 'pkt';
    if (isAi) packetLabel = 'token';
    else if (attack.conditions.includes('C5')) packetLabel = 'invoke';
    else if (attack.conditions.includes('C4')) packetLabel = 'cost';

    packet.className = `sim-packet ${attack.flow} source-${sourceIndex} effect-${effect}`;
    packet.style.setProperty('--lane-y', `${18 + (laneIndex * 10)}%`);
    packet.style.setProperty('--packet-duration', `${isLowRate ? 3.9 : isAi ? 2.8 : 1.8}s`);
    packet.innerHTML = `<span>${escapeHtml(packetLabel)}</span><small>+${formatCurrency(eventFinancials.netEvent, true)}</small>`;
    packet.title = `Simulated event exposure: ${formatCurrency(eventFinancials.netEvent)}. Unmitigated event exposure: ${formatCurrency(eventFinancials.grossEvent)}.`;

    lane.appendChild(packet);
    packetCounter += 1;

    window.setTimeout(() => {
      if (packet && packet.parentNode) packet.parentNode.removeChild(packet);
    }, isLowRate ? 4400 : 3200);
  }

  function restartPacketFlow() {
    const lane = $('packetLane');
    lane.innerHTML = '';
    packetCounter = 0;
    if (packetTimer) window.clearInterval(packetTimer);
    if (!isPlaying) return;
    const attack = ATTACKS[selectedAttack];
    const interval = attack.flow === 'low' ? 1200 : attack.flow === 'ai' ? 420 : 220;
    packetTimer = window.setInterval(() => {
      const burst = attack.sourceMode === 'distributed' && attack.flow !== 'low' ? 3 : 1;
      for (let i = 0; i < burst; i += 1) createPacket();
    }, interval);
    createPacket();
  }

  function bindControls() {
    $('playPauseSimulator').addEventListener('click', () => {
      isPlaying = !isPlaying;
      $('playPauseSimulator').textContent = isPlaying ? 'Pause simulation' : 'Play simulation';
      restartPacketFlow();
    });
    $('resetMitigation').addEventListener('click', () => {
      clearMitigationEffect();
      restartPacketFlow();
    });

    const applyProfile = $('applyVictimProfile');
    if (applyProfile) {
      applyProfile.addEventListener('click', () => {
        victimProfile = getVictimProfileFromInputs();
        resetFinancialState();
        renderVictimExposureReport();
        window.setTimeout(() => {
          const reportPanel = $('victimExposureReport');
          if (reportPanel && !reportPanel.hidden) {
            reportPanel.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        }, 120);
      });
    }

    const resetFinancial = $('resetFinancialSimulation');
    if (resetFinancial) {
      resetFinancial.addEventListener('click', () => {
        resetFinancialState();
        clearVictimExposureReport();
      });
    }

    ['victimBusinessName', 'victimProfitAmount', 'victimProfitPeriod', 'victimOnlineHourlyProfit'].forEach((id) => {
      const el = $(id);
      if (el) {
        el.addEventListener('change', () => {
          victimProfile = getVictimProfileFromInputs();
          resetFinancialState();
          clearVictimExposureReport();
        });
      }
    });
  }

  function init() {
    initAttackSelect();
    bindControls();
    renderSimulator();
    restartPacketFlow();
  }

  document.addEventListener('DOMContentLoaded', init);
})();
