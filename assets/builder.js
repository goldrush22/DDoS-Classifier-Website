(function () {
  'use strict';

  const CONDITION_TEXT = {
    C0: 'Denial activity exists',
    C1: 'Single source',
    C2: 'Multiple sources',
    C3: 'Low-rate / stealthy',
    C4: 'Cloud-targeted',
    C5: 'Serverless-targeted',
    C6: 'AI-targeted'
  };
  const CONDITION_ORDER = ['C0', 'C1', 'C2', 'C3', 'C4', 'C5', 'C6'];

  const ATTACKS = {
    DoS: { label: 'DoS', name: 'Denial of Service', conditions: ['C0', 'C1'], sourceMode: 'single', route: ['Direct service'], flow: 'high', colour: '#2f6fed' },
    DDoS: { label: 'DDoS', name: 'Distributed Denial of Service', conditions: ['C0', 'C2'], sourceMode: 'distributed', route: ['Direct service'], flow: 'high', colour: '#7c4dff' },
    LDoS: { label: 'LDoS', name: 'Low-rate Denial of Service', conditions: ['C0', 'C1', 'C3'], sourceMode: 'single', route: ['Timing-sensitive service'], flow: 'low', colour: '#0f9f6e' },
    LDDoS: { label: 'LDDoS', name: 'Low-rate Distributed Denial of Service', conditions: ['C0', 'C2', 'C3'], sourceMode: 'distributed', route: ['Timing-sensitive service'], flow: 'low', colour: '#16a1a6' },
    EDoS_S: { label: 'EDoS_S', name: 'Single-source Economic Denial of Sustainability', conditions: ['C0', 'C1', 'C4'], sourceMode: 'single', route: ['Cloud edge', 'Autoscaling layer'], flow: 'cost', colour: '#e88322' },
    EDoS_D: { label: 'EDoS_D', name: 'Distributed Economic Denial of Sustainability', conditions: ['C0', 'C2', 'C4'], sourceMode: 'distributed', route: ['Cloud edge', 'Autoscaling layer'], flow: 'cost', colour: '#dc5b1f' },
    DoW: { label: 'DoW', name: 'Denial of Wallet', conditions: ['C0', 'C1', 'C4', 'C5'], sourceMode: 'single', route: ['Cloud edge', 'Serverless function'], flow: 'wallet', colour: '#b46812' },
    DDoW: { label: 'DDoW', name: 'Distributed Denial of Wallet', conditions: ['C0', 'C2', 'C4', 'C5'], sourceMode: 'distributed', route: ['Cloud edge', 'Serverless function'], flow: 'wallet', colour: '#a63d1c' },
    DoA: { label: 'DoA', name: 'Denial of Artificial Intelligence', conditions: ['C0', 'C6'], sourceMode: 'ai', route: ['AI gateway', 'Model inference'], flow: 'ai', colour: '#c83dba' }
  };

  const TAXONOMY_RULES = {
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

  const ACTORS = [
    { id: 'single-attacker', label: 'Single attacker', icon: '🧑‍💻', conditions: ['C1'] },
    { id: 'botnet', label: 'Distributed sources', icon: '🕸️', conditions: ['C2'] },
    { id: 'low-rate', label: 'Low-rate timing', icon: '⏱️', conditions: ['C3'] },
    { id: 'cloud', label: 'Cloud autoscaling', icon: '☁️', conditions: ['C4'] },
    { id: 'serverless', label: 'Serverless functions', icon: 'λ', conditions: ['C4', 'C5'] },
    { id: 'ai', label: 'AI inference', icon: '🤖', conditions: ['C6'] }
  ];

  const CONTROL_CATALOGUE = [
    { id: 'block', label: 'Block or isolate offending source', effect: 'Stops most flow from known sources.', multiplier: 0.18, keywords: ['blocking', 'source containment'] },
    { id: 'rate-limit', label: 'Apply rate limits and throttling', effect: 'Slows packet/request flow.', multiplier: 0.38, keywords: ['rate limits', 'throttling'] },
    { id: 'scrub', label: 'Use CDN/WAF/scrubbing protection', effect: 'Filters hostile traffic before it reaches the victim.', multiplier: 0.30, keywords: ['CDN', 'WAF', 'scrubbing'] },
    { id: 'harden', label: 'Harden timeouts, queues and request limits', effect: 'Makes the victim less sensitive to degradation.', multiplier: 0.48, keywords: ['timeouts', 'queue limits'] },
    { id: 'budget', label: 'Set cloud budgets, quotas and spend alerts', effect: 'Caps sustainability exposure.', multiplier: 0.26, keywords: ['budgets', 'quotas'] },
    { id: 'serverless-cap', label: 'Set function concurrency and invocation caps', effect: 'Limits function billing amplification.', multiplier: 0.22, keywords: ['serverless', 'concurrency'] },
    { id: 'ai-cap', label: 'Set AI token, model-call and tool-call caps', effect: 'Limits AI inference exhaustion.', multiplier: 0.20, keywords: ['AI', 'tokens'] },
    { id: 'monitor', label: 'Enable monitoring and evidence capture', effect: 'Does not stop the flow alone, but improves detection and response.', multiplier: 0.72, keywords: ['monitoring', 'logs'] }
  ];

  const state = {
    lanes: [],
    activeLaneId: null,
    playing: true,
    victim: "Mary's Cafe",
    victimPosition: { x: null, y: null },
    nextLaneId: 1
  };

  const el = {};

  document.addEventListener('DOMContentLoaded', init);

  function init() {
    cacheElements();
    buildPalettes();
    bindEvents();
    addLaneFromTemplate('DoS');
    addLaneFromTemplate('DoA');
    render();
  }

  function cacheElements() {
    Object.assign(el, {
      victimName: document.getElementById('builderVictimName'),
      victimLabel: document.getElementById('builderVictimLabel'),
      templateSelect: document.getElementById('builderTemplateSelect'),
      activeLaneSelect: document.getElementById('activeLaneSelect'),
      conditionPalette: document.getElementById('conditionPalette'),
      actorPalette: document.getElementById('actorPalette'),
      controlPalette: document.getElementById('controlPalette'),
      laneStack: document.getElementById('builderLaneStack'),
      canvas: document.getElementById('builderCanvas'),
      victimNode: document.getElementById('builderVictimNode'),
      summary: document.getElementById('builderScenarioSummary'),
      combinedRisk: document.getElementById('combinedRisk'),
      activeClasses: document.getElementById('activeClasses'),
      controlsActiveCount: document.getElementById('controlsActiveCount'),
      conditionStrip: document.getElementById('globalConditionStrip'),
      laneExplanation: document.getElementById('laneExplanation'),
      toast: document.getElementById('builderToast')
    });
  }

  function buildPalettes() {
    el.templateSelect.innerHTML = Object.entries(ATTACKS).map(([key, attack]) =>
      `<option value="${key}">${attack.label} — ${attack.name}</option>`
    ).join('');

    el.conditionPalette.innerHTML = CONDITION_ORDER.map(c =>
      `<button class="builder-chip condition-builder-chip" draggable="true" data-kind="condition" data-condition="${c}" title="${CONDITION_TEXT[c]}"><strong>${c}</strong><span>${CONDITION_TEXT[c]}</span></button>`
    ).join('');

    el.actorPalette.innerHTML = ACTORS.map(a =>
      `<button class="builder-chip actor-builder-chip" draggable="true" data-kind="actor" data-actor="${a.id}"><strong>${a.icon}</strong><span>${a.label}</span></button>`
    ).join('');

    el.controlPalette.innerHTML = CONTROL_CATALOGUE.map(c =>
      `<button class="builder-control-chip" draggable="true" data-kind="control" data-control="${c.id}"><strong>${c.label}</strong><span>${c.effect}</span></button>`
    ).join('');
  }

  function bindEvents() {
    document.getElementById('addTemplateLane').addEventListener('click', () => addLaneFromTemplate(el.templateSelect.value));
    document.getElementById('addBlankLane').addEventListener('click', () => addBlankLane());
    document.getElementById('clearBuilder').addEventListener('click', resetBuilder);
    document.getElementById('toggleAnimation').addEventListener('click', toggleAnimation);
    document.getElementById('exportScenario').addEventListener('click', exportScenario);
    el.victimName.addEventListener('input', () => { state.victim = el.victimName.value.trim() || 'Victim service'; render(); });
    el.activeLaneSelect.addEventListener('change', () => { state.activeLaneId = Number(el.activeLaneSelect.value); render(); });

    document.addEventListener('click', (event) => {
      const conditionButton = event.target.closest('[data-condition]');
      if (conditionButton && conditionButton.dataset.kind === 'condition') toggleConditionOnActiveLane(conditionButton.dataset.condition);
      const actorButton = event.target.closest('[data-actor]');
      if (actorButton) applyActorToActiveLane(actorButton.dataset.actor);
      const controlButton = event.target.closest('[data-control]');
      if (controlButton && controlButton.classList.contains('builder-control-chip')) applyControlToActiveLane(controlButton.dataset.control);
      const laneSelect = event.target.closest('[data-lane-select]');
      if (laneSelect) { state.activeLaneId = Number(laneSelect.dataset.laneSelect); render(); }
      const laneRemove = event.target.closest('[data-lane-remove]');
      if (laneRemove) { removeLane(Number(laneRemove.dataset.laneRemove)); }
      const laneClear = event.target.closest('[data-lane-clear]');
      if (laneClear) { clearLane(Number(laneClear.dataset.laneClear)); }
      const laneControl = event.target.closest('[data-lane-control]');
      if (laneControl) { applyControlToLane(Number(laneControl.dataset.laneControl), laneControl.dataset.controlId); }
    });

    document.addEventListener('dragstart', (event) => {
      const item = event.target.closest('[draggable="true"]');
      if (!item) return;
      event.dataTransfer.setData('text/plain', JSON.stringify(item.dataset));
    });

    el.laneStack.addEventListener('dragover', (event) => {
      if (event.target.closest('.builder-drop-zone')) event.preventDefault();
    });

    el.laneStack.addEventListener('drop', (event) => {
      const zone = event.target.closest('.builder-drop-zone');
      if (!zone) return;
      event.preventDefault();
      let data = null;
      try { data = JSON.parse(event.dataTransfer.getData('text/plain')); } catch { return; }
      const laneId = Number(zone.dataset.dropLane);
      if (data.condition) addConditionToLane(laneId, data.condition);
      if (data.actor) applyActorToLane(laneId, data.actor);
      if (data.control) applyControlToLane(laneId, data.control);
    });

    makeDraggable(el.victimNode);
  }

  function addLaneFromTemplate(key) {
    const attack = ATTACKS[key] || ATTACKS.DoS;
    const lane = {
      id: state.nextLaneId++,
      name: `${attack.label} lane`,
      conditions: [...attack.conditions],
      actors: inferActorsFromConditions(attack.conditions),
      controls: [],
      colour: attack.colour
    };
    state.lanes.push(lane);
    state.activeLaneId = lane.id;
    render();
    toast(`Added ${attack.label} lane.`);
  }

  function addBlankLane() {
    const lane = { id: state.nextLaneId++, name: 'Custom lane', conditions: [], actors: [], controls: [], colour: '#3451b2' };
    state.lanes.push(lane);
    state.activeLaneId = lane.id;
    render();
    toast('Added blank custom lane.');
  }

  function resetBuilder() {
    state.lanes = [];
    state.activeLaneId = null;
    state.nextLaneId = 1;
    addLaneFromTemplate('DoS');
    toast('Sandbox reset.');
  }

  function removeLane(id) {
    state.lanes = state.lanes.filter(l => l.id !== id);
    if (state.activeLaneId === id) state.activeLaneId = state.lanes[0]?.id || null;
    render();
  }

  function clearLane(id) {
    const lane = getLane(id);
    if (!lane) return;
    lane.conditions = [];
    lane.actors = [];
    lane.controls = [];
    render();
  }

  function getLane(id = state.activeLaneId) { return state.lanes.find(l => l.id === id); }

  function addConditionToLane(id, condition) {
    const lane = getLane(id); if (!lane) return;
    if (!lane.conditions.includes(condition)) lane.conditions.push(condition);
    lane.conditions.sort((a, b) => CONDITION_ORDER.indexOf(a) - CONDITION_ORDER.indexOf(b));
    lane.actors = Array.from(new Set([...lane.actors, ...inferActorsFromConditions(lane.conditions)]));
    render();
  }

  function toggleConditionOnActiveLane(condition) {
    const lane = getLane(); if (!lane) return;
    if (lane.conditions.includes(condition)) lane.conditions = lane.conditions.filter(c => c !== condition);
    else lane.conditions.push(condition);
    lane.conditions.sort((a, b) => CONDITION_ORDER.indexOf(a) - CONDITION_ORDER.indexOf(b));
    lane.actors = Array.from(new Set([...lane.actors, ...inferActorsFromConditions(lane.conditions)]));
    render();
  }

  function applyActorToActiveLane(actorId) { const lane = getLane(); if (lane) applyActorToLane(lane.id, actorId); }
  function applyActorToLane(id, actorId) {
    const lane = getLane(id); if (!lane) return;
    const actor = ACTORS.find(a => a.id === actorId); if (!actor) return;
    actor.conditions.forEach(c => { if (!lane.conditions.includes(c)) lane.conditions.push(c); });
    if (!lane.actors.includes(actorId)) lane.actors.push(actorId);
    lane.conditions.sort((a, b) => CONDITION_ORDER.indexOf(a) - CONDITION_ORDER.indexOf(b));
    render();
  }

  function applyControlToActiveLane(controlId) { const lane = getLane(); if (lane) applyControlToLane(lane.id, controlId); }
  function applyControlToLane(id, controlId) {
    const lane = getLane(id); if (!lane) return;
    if (!lane.controls.includes(controlId)) lane.controls.push(controlId);
    render();
    document.getElementById('attackCanvasPanel')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    toast('Defensive control applied to the simulation lane.');
  }

  function inferActorsFromConditions(conditions) {
    const actors = [];
    if (conditions.includes('C2')) actors.push('botnet');
    if (conditions.includes('C1')) actors.push('single-attacker');
    if (conditions.includes('C3')) actors.push('low-rate');
    if (conditions.includes('C4')) actors.push('cloud');
    if (conditions.includes('C5')) actors.push('serverless');
    if (conditions.includes('C6')) actors.push('ai');
    return actors;
  }

  function classify(conditions) {
    const observed = new Set(conditions);
    const matches = Object.entries(TAXONOMY_RULES)
      .filter(([, required]) => required.every(c => observed.has(c)))
      .sort((a, b) => b[1].length - a[1].length || a[0].localeCompare(b[0]));
    return matches[0]?.[0] || 'Unclassified';
  }

  function inheritedClasses(conditions, primary) {
    const observed = new Set(conditions);
    return Object.entries(TAXONOMY_RULES)
      .filter(([name, required]) => name !== primary && required.every(c => observed.has(c)))
      .map(([name]) => name);
  }

  function flowIntensity(lane) {
    const primary = classify(lane.conditions);
    const base = ['DDoS','EDoS_D','DDoW','LDDoS'].includes(primary) ? 92 : ['LDoS'].includes(primary) ? 46 : ['DoA'].includes(primary) ? 70 : 78;
    const multiplier = lane.controls.reduce((m, id) => m * (CONTROL_CATALOGUE.find(c => c.id === id)?.multiplier || 0.65), 1);
    return Math.max(6, Math.round(base * multiplier));
  }

  function riskForLane(lane) {
    if (classify(lane.conditions) === 'Unclassified') return 0;
    let risk = 24 + lane.conditions.length * 10;
    if (lane.conditions.includes('C2')) risk += 10;
    if (lane.conditions.includes('C4')) risk += 12;
    if (lane.conditions.includes('C5')) risk += 10;
    if (lane.conditions.includes('C6')) risk += 13;
    lane.controls.forEach(() => risk *= 0.72);
    return Math.min(100, Math.round(risk));
  }

  function render() {
    renderSelectors();
    renderGlobalStatus();
    renderLanes();
    renderExplanation();
    el.victimLabel.textContent = state.victim;
  }

  function renderSelectors() {
    el.activeLaneSelect.innerHTML = state.lanes.map(l => `<option value="${l.id}" ${l.id===state.activeLaneId?'selected':''}>Lane ${l.id}: ${classify(l.conditions)}</option>`).join('');
  }

  function renderGlobalStatus() {
    const conditionSet = new Set(state.lanes.flatMap(l => l.conditions));
    const classes = Array.from(new Set(state.lanes.map(l => classify(l.conditions)).filter(c => c !== 'Unclassified')));
    const totalControls = state.lanes.reduce((n,l)=>n+l.controls.length,0);
    const risk = state.lanes.length ? Math.min(100, Math.round(state.lanes.reduce((n,l)=>n+riskForLane(l),0) / Math.max(1, state.lanes.length))) : 0;
    el.combinedRisk.textContent = `${risk}%`;
    el.activeClasses.textContent = classes.length ? classes.join(', ') : 'None';
    el.controlsActiveCount.textContent = String(totalControls);
    el.summary.textContent = state.lanes.length ? `${state.lanes.length} visual lane(s) aimed at ${state.victim}. ${classes.length ? 'Detected class composition: '+classes.join(', ') : 'No complete denial class yet.'}` : 'No lanes yet.';
    el.conditionStrip.innerHTML = CONDITION_ORDER.map(c => `<span class="builder-condition-pill ${conditionSet.has(c)?'active':'absent'}"><strong>${c}</strong> ${CONDITION_TEXT[c]}</span>`).join('');
  }

  function renderLanes() {
    if (!state.lanes.length) { el.laneStack.innerHTML = '<div class="builder-empty">Add an attack lane to begin.</div>'; return; }
    el.laneStack.innerHTML = state.lanes.map(lane => laneTemplate(lane)).join('');
  }

  function laneTemplate(lane) {
    const primary = classify(lane.conditions);
    const attack = ATTACKS[primary] || null;
    const isActive = lane.id === state.activeLaneId;
    const distributed = lane.conditions.includes('C2');
    const lowRate = lane.conditions.includes('C3');
    const intensity = flowIntensity(lane);
    const nodes = routeNodes(lane);
    const controls = lane.controls.map(id => CONTROL_CATALOGUE.find(c=>c.id===id)?.label || id);
    const packetCount = distributed ? 7 : 4;
    return `<article class="builder-lane ${isActive?'active':''}" style="--lane-colour:${attack?.colour || lane.colour}; --flow-intensity:${intensity}%;">
      <div class="builder-lane-head">
        <button type="button" data-lane-select="${lane.id}" class="lane-title">Lane ${lane.id}: ${primary}</button>
        <div class="lane-actions">
          <button type="button" class="secondary tiny" data-lane-clear="${lane.id}">Clear lane</button>
          <button type="button" class="secondary tiny" data-lane-remove="${lane.id}">Remove</button>
        </div>
      </div>
      <div class="builder-drop-zone" data-drop-lane="${lane.id}">
        <div class="source-stack ${distributed?'distributed':''}">
          ${sourceIcons(distributed, lane.conditions.includes('C6'))}
          <small>${distributed ? 'Multiple sources' : lane.conditions.includes('C6') ? 'AI/API actor' : 'Single source'}</small>
        </div>
        <div class="lane-flow ${lowRate?'low-rate-flow':''}">
          ${nodes.map((n,i)=>`<span class="route-node route-${n.kind}">${n.icon}<small>${n.label}</small></span>${i<nodes.length-1?'<span class="route-arrow">→</span>':''}`).join('')}
          <div class="packet-track ${state.playing?'playing':'paused'} ${lowRate?'low-rate':''}">
            ${Array.from({length:packetCount},(_,i)=>`<span class="builder-packet packet-${i+1}">${packetLabel(primary)}</span>`).join('')}
          </div>
        </div>
        <div class="target-mini"><span>🎯</span><strong>${escapeHtml(state.victim)}</strong><small>Shared victim</small></div>
      </div>
      <div class="builder-lane-footer">
        <div class="mini-condition-row">${CONDITION_ORDER.map(c => `<button type="button" class="mini-condition ${lane.conditions.includes(c)?'on':'off'}" data-lane-select="${lane.id}" title="${CONDITION_TEXT[c]}">${c}</button>`).join('')}</div>
        <div class="lane-meter"><span style="width:${intensity}%"></span></div>
        <div class="lane-controls-applied">${controls.length ? 'Controls: '+controls.join(' • ') : 'No defensive controls applied.'}</div>
      </div>
    </article>`;
  }

  function routeNodes(lane) {
    const nodes = [];
    if (lane.conditions.includes('C4')) nodes.push({ kind:'cloud', icon:'☁️', label:'Cloud' });
    if (lane.conditions.includes('C5')) nodes.push({ kind:'serverless', icon:'λ', label:'Serverless' });
    if (lane.conditions.includes('C6')) nodes.push({ kind:'ai', icon:'🤖', label:'AI' });
    if (!nodes.length) nodes.push({ kind:'service', icon:'🌐', label:'Service' });
    return nodes;
  }

  function sourceIcons(distributed, ai) {
    if (distributed) return '<span>🧑‍💻</span><span>💻</span><span>📱</span><span>🖥️</span><span>🤖</span>';
    return ai ? '<span>🤖</span>' : '<span>🧑‍💻</span>';
  }

  function packetLabel(primary) {
    if (['EDoS_S','EDoS_D'].includes(primary)) return '$';
    if (['DoW','DDoW'].includes(primary)) return 'λ';
    if (primary === 'DoA') return 'tok';
    if (['LDoS','LDDoS'].includes(primary)) return 'slow';
    return 'pkt';
  }

  function renderExplanation() {
    const lane = getLane();
    if (!lane) { el.laneExplanation.innerHTML = '<p class="helper">Add or select a lane.</p>'; return; }
    const primary = classify(lane.conditions);
    const inherited = inheritedClasses(lane.conditions, primary);
    const strategy = (window.DactMitigations && window.DactMitigations[primary]) || null;
    const controls = relevantControls(primary, lane);
    el.laneExplanation.innerHTML = `
      <div class="builder-explain-card">
        <h3>Active lane classification</h3>
        <div class="builder-class-badge">${primary}</div>
        <p>${attackSummary(primary, lane.conditions)}</p>
        <p><strong>Conditions:</strong> ${lane.conditions.length ? lane.conditions.map(c=>`<code>${c}</code>`).join(' ') : 'No conditions selected.'}</p>
        <p><strong>Inherited classes:</strong> ${inherited.length ? inherited.join(', ') : 'None'}</p>
      </div>
      <div class="builder-explain-card">
        <h3>Suggested controls for this lane</h3>
        <p>${strategy ? strategy.summary : 'Select a complete condition set to receive attack-specific mitigation guidance.'}</p>
        <div class="builder-suggested-controls">
          ${controls.map(c => `<button type="button" data-lane-control="${lane.id}" data-control-id="${c.id}" class="builder-control-apply ${lane.controls.includes(c.id)?'applied':''}"><strong>${c.label}</strong><span>${lane.controls.includes(c.id) ? 'Applied to this lane' : c.effect}</span></button>`).join('')}
        </div>
      </div>
      <div class="builder-explain-card">
        <h3>How to modify the attack</h3>
        <ul>
          <li>Click or drag condition chips into the active lane.</li>
          <li>Add another lane to model concurrent attacks against the same victim.</li>
          <li>Click a technical control to reduce the simulated flow pressure.</li>
          <li>Drag the victim node around the canvas to rearrange the visual scene.</li>
        </ul>
      </div>`;
  }

  function attackSummary(primary, conditions) {
    if (ATTACKS[primary]) return ATTACKS[primary].name + ' is formed by ' + TAXONOMY_RULES[primary].join(', ') + '.';
    if (!conditions.includes('C0')) return 'Add C0 to establish that denial-relevant activity exists.';
    return 'The current condition set is incomplete or contradictory. Add source, rate, cloud, serverless, or AI conditions to complete a denial class.';
  }

  function relevantControls(primary, lane) {
    const set = new Set(['monitor']);
    if (lane.conditions.includes('C1')) { set.add('block'); set.add('rate-limit'); }
    if (lane.conditions.includes('C2')) { set.add('scrub'); set.add('rate-limit'); }
    if (lane.conditions.includes('C3')) { set.add('harden'); set.add('monitor'); }
    if (lane.conditions.includes('C4')) { set.add('budget'); set.add('scrub'); }
    if (lane.conditions.includes('C5')) { set.add('serverless-cap'); set.add('budget'); }
    if (lane.conditions.includes('C6')) { set.add('ai-cap'); set.add('rate-limit'); }
    if (primary === 'Unclassified') { set.add('rate-limit'); set.add('harden'); }
    return CONTROL_CATALOGUE.filter(c => set.has(c.id));
  }

  function toggleAnimation() {
    state.playing = !state.playing;
    document.getElementById('toggleAnimation').textContent = state.playing ? 'Pause animation' : 'Resume animation';
    render();
  }

  function exportScenario() {
    const payload = {
      tool: 'D-ACT Build Your Own Attack visual sandbox',
      victim: state.victim,
      generatedAt: new Date().toISOString(),
      lanes: state.lanes.map(l => ({
        id: l.id,
        conditions: l.conditions,
        primaryClassification: classify(l.conditions),
        inheritedClasses: inheritedClasses(l.conditions, classify(l.conditions)),
        actors: l.actors,
        controls: l.controls,
        risk: riskForLane(l)
      }))
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'dact-built-attack-scenario.json';
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  }

  function makeDraggable(node) {
    let dragging = false, offsetX = 0, offsetY = 0;
    node.addEventListener('pointerdown', (event) => {
      dragging = true;
      node.setPointerCapture(event.pointerId);
      const rect = node.getBoundingClientRect();
      offsetX = event.clientX - rect.left;
      offsetY = event.clientY - rect.top;
    });
    node.addEventListener('pointermove', (event) => {
      if (!dragging) return;
      const canvasRect = el.canvas.getBoundingClientRect();
      const x = Math.max(10, Math.min(canvasRect.width - node.offsetWidth - 10, event.clientX - canvasRect.left - offsetX));
      const y = Math.max(10, Math.min(canvasRect.height - node.offsetHeight - 10, event.clientY - canvasRect.top - offsetY));
      node.style.left = x + 'px';
      node.style.top = y + 'px';
      node.style.right = 'auto';
      node.style.transform = 'none';
    });
    node.addEventListener('pointerup', () => { dragging = false; });
  }

  function toast(message) {
    el.toast.textContent = message;
    el.toast.hidden = false;
    clearTimeout(toast._timer);
    toast._timer = setTimeout(() => { el.toast.hidden = true; }, 2400);
  }

  function escapeHtml(value) {
    return String(value).replace(/[&<>"']/g, char => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;' }[char]));
  }
})();
