(() => {
  const scenario = {
    durationMs: 30000,
    maxRelative: 0.18,
    maxFinancial: 3600000,
    series: [
      {
        id: 'small-sustainability',
        label: 'Small business — sustainability attack',
        shortLabel: 'Small sustainability',
        finalCost: 15000,
        annualProfit: 90000,
        finalImpact: 15000 / 90000,
        rating: 'Very high impact',
        type: 'sustainability',
        css: 'series-small-sustainability',
        financialLabelOffset: -30,
        relativeLabelOffset: -8
      },
      {
        id: 'small-availability',
        label: 'Small business — availability attack',
        shortLabel: 'Small availability',
        finalCost: 1800,
        annualProfit: 90000,
        finalImpact: 1800 / 90000,
        rating: 'Moderate impact',
        type: 'availability',
        css: 'series-small-availability',
        financialLabelOffset: 38,
        relativeLabelOffset: 18
      },
      {
        id: 'large-sustainability',
        label: 'Large business — sustainability attack',
        shortLabel: 'Large sustainability',
        finalCost: 15000,
        annualProfit: 50000000,
        finalImpact: 15000 / 50000000,
        rating: 'Trivial impact',
        type: 'sustainability',
        css: 'series-large-sustainability',
        financialLabelOffset: 8,
        relativeLabelOffset: 30
      },
      {
        id: 'large-availability',
        label: 'Large business — availability attack',
        shortLabel: 'Large availability',
        finalCost: 3600000,
        annualProfit: 50000000,
        finalImpact: 3600000 / 50000000,
        rating: 'Very high impact',
        type: 'availability',
        css: 'series-large-availability',
        financialLabelOffset: -8,
        relativeLabelOffset: -8
      }
    ]
  };

  const els = {
    startPause: document.getElementById('impactStartPause'),
    reset: document.getElementById('impactReset'),
    speed: document.getElementById('impactSpeed'),
    modeToggle: document.getElementById('impactModeToggle'),
    progressText: document.getElementById('impactProgressText'),
    gridLines: document.getElementById('impactGridLines'),
    lines: document.getElementById('impactLines'),
    dots: document.getElementById('impactDots'),
    labels: document.getElementById('impactLabels'),
    legend: document.getElementById('impactLegend'),
    liveCards: document.getElementById('impactLiveCards'),
    yAxisLabel: document.getElementById('impactYAxisLabel'),
    modeKicker: document.getElementById('impactModeKicker'),
    graphExplanation: document.getElementById('impactGraphExplanation'),
    dataExplanation: document.getElementById('impactDataExplanation')
  };

  const chart = {
    left: 90,
    right: 860,
    top: 55,
    bottom: 445,
    width: 770,
    height: 390
  };

  let progress = 0;
  let running = true;
  let mode = 'relative';
  let lastFrame = null;
  let pathEls = new Map();
  let dotEls = new Map();
  let labelEls = new Map();
  let cardEls = new Map();

  function money(value) {
    return new Intl.NumberFormat('en-AU', {
      style: 'currency',
      currency: 'AUD',
      maximumFractionDigits: value >= 10000 ? 0 : 2
    }).format(value);
  }

  function pct(value) {
    return `${(value * 100).toFixed(value < 0.001 ? 3 : 2)}%`;
  }

  function impactValue(series, progressValue) {
    return mode === 'financial'
      ? series.finalCost * progressValue
      : series.finalImpact * progressValue;
  }

  function maxY() {
    return mode === 'financial' ? scenario.maxFinancial : scenario.maxRelative;
  }

  function formatAxis(value) {
    if (mode === 'financial') {
      if (value >= 1000000) return `$${(value / 1000000).toFixed(value % 1000000 === 0 ? 0 : 1)}m`;
      if (value >= 1000) return `$${(value / 1000).toFixed(value % 1000 === 0 ? 0 : 1)}k`;
      return money(value);
    }
    return pct(value);
  }

  function formatModeValue(series, progressValue = 1) {
    return mode === 'financial'
      ? money(series.finalCost * progressValue)
      : pct(series.finalImpact * progressValue);
  }

  function x(progressValue) {
    return chart.left + (progressValue * chart.width);
  }

  function y(value) {
    const clamped = Math.min(maxY(), Math.max(0, value));
    return chart.bottom - ((clamped / maxY()) * chart.height);
  }

  function makeSvg(name, attrs = {}) {
    const el = document.createElementNS('http://www.w3.org/2000/svg', name);
    for (const [key, value] of Object.entries(attrs)) {
      el.setAttribute(key, value);
    }
    return el;
  }

  function buildGrid() {
    els.gridLines.innerHTML = '';
    const ticks = mode === 'financial'
      ? [0, 600000, 1200000, 1800000, 2400000, 3000000, 3600000]
      : [0, 0.03, 0.06, 0.09, 0.12, 0.15, 0.18];
    ticks.forEach((tick) => {
      const yy = y(tick);
      const line = makeSvg('line', { x1: chart.left, y1: yy, x2: chart.right, y2: yy, class: 'impact-grid-line' });
      const label = makeSvg('text', { x: mode === 'financial' ? 30 : 46, y: yy + 5, class: 'impact-tick-label' });
      label.textContent = formatAxis(tick);
      els.gridLines.appendChild(line);
      els.gridLines.appendChild(label);
    });
  }

  function buildSeries() {
    els.lines.innerHTML = '';
    els.dots.innerHTML = '';
    els.labels.innerHTML = '';
    els.legend.innerHTML = '';
    els.liveCards.innerHTML = '';
    pathEls.clear();
    dotEls.clear();
    labelEls.clear();
    cardEls.clear();

    scenario.series.forEach((series) => {
      const path = makeSvg('path', { class: `impact-series-line ${series.css}`, d: '' });
      const dot = makeSvg('circle', { class: `impact-series-dot ${series.css}`, r: 7, cx: x(0), cy: y(0) });
      const label = makeSvg('text', { class: `impact-series-label ${series.css}`, x: x(0) + 12, y: y(0) - 8 });
      label.textContent = `${series.shortLabel} (${formatModeValue(series)})`;
      els.lines.appendChild(path);
      els.dots.appendChild(dot);
      els.labels.appendChild(label);
      pathEls.set(series.id, path);
      dotEls.set(series.id, dot);
      labelEls.set(series.id, label);

      const legendItem = document.createElement('div');
      legendItem.className = 'impact-legend-item';
      legendItem.innerHTML = `<span class="impact-legend-swatch ${series.css}"></span><strong>${series.shortLabel}</strong><small>${series.rating}</small>`;
      els.legend.appendChild(legendItem);

      const card = document.createElement('article');
      card.className = `impact-live-card ${series.css}`;
      card.innerHTML = `
        <div class="impact-card-topline"><span>${series.label}</span><strong>${series.rating}</strong></div>
        <div class="impact-card-money" data-field="cost">${money(0)}</div>
        <div class="impact-card-metrics">
          <span>Relative impact: <strong data-field="impact">0%</strong></span>
          <span>Graph value: <strong data-field="modeValue">0%</strong></span>
          <span>Final cost: <strong>${money(series.finalCost)}</strong></span>
          <span>Annual profit base: <strong>${money(series.annualProfit)}</strong></span>
        </div>
      `;
      els.liveCards.appendChild(card);
      cardEls.set(series.id, card);
    });
  }

  function linePath(series, currentProgress) {
    const steps = Math.max(2, Math.ceil(currentProgress * 80));
    const coords = [];
    for (let i = 0; i <= steps; i++) {
      const p = currentProgress * (i / steps);
      coords.push(`${i === 0 ? 'M' : 'L'} ${x(p).toFixed(2)} ${y(impactValue(series, p)).toFixed(2)}`);
    }
    return coords.join(' ');
  }

  function updateModeCopy() {
    const financial = mode === 'financial';
    if (els.modeToggle) els.modeToggle.textContent = financial ? 'Show relative impact' : 'Show financial impact';
    if (els.yAxisLabel) els.yAxisLabel.textContent = financial ? 'financial impact ($)' : 'relative impact';
    if (els.modeKicker) els.modeKicker.textContent = financial ? 'Financial impact mode' : 'Relative impact mode';
    if (els.graphExplanation) {
      els.graphExplanation.innerHTML = financial
        ? 'Four trajectories are plotted as direct cumulative financial loss in Australian dollars. This shows the flat cost figures used in the scenario: $15,000, $1,800, $15,000, and $3,600,000.'
        : 'Four trajectories are plotted together using the relative impact ratio <code>I(t)=C(t)/P</code>. This shows why the same dollar cost can be severe for a small business and trivial for a large organisation.';
    }
    if (els.dataExplanation) {
      els.dataExplanation.textContent = financial
        ? 'Each card shows running dollar loss and the equivalent relative impact against annual profit.'
        : 'Each card shows the running cumulative cost, relative impact, and final scenario value.';
    }
  }

  function update() {
    progress = Math.min(1, Math.max(0, progress));
    els.progressText.textContent = `${Math.round(progress * 100)}%`;
    updateModeCopy();
    scenario.series.forEach((series) => {
      const currentCost = series.finalCost * progress;
      const currentImpact = series.finalImpact * progress;
      const currentGraphValue = impactValue(series, progress);
      const xx = x(progress);
      const yy = y(currentGraphValue);
      const path = pathEls.get(series.id);
      const dot = dotEls.get(series.id);
      const label = labelEls.get(series.id);
      const card = cardEls.get(series.id);
      if (path) path.setAttribute('d', linePath(series, progress));
      if (dot) {
        dot.setAttribute('cx', xx);
        dot.setAttribute('cy', yy);
      }
      if (label) {
        label.setAttribute('x', Math.min(xx + 12, chart.right - 230));
        const labelOffset = mode === 'financial' ? (series.financialLabelOffset || -12) : (series.relativeLabelOffset || -12);
        label.setAttribute('y', Math.max(chart.top + 18, Math.min(chart.bottom - 10, yy + labelOffset)));
        label.textContent = `${series.shortLabel} (${formatModeValue(series, progress)})`;
      }
      if (card) {
        const costField = card.querySelector('[data-field="cost"]');
        const impactField = card.querySelector('[data-field="impact"]');
        const modeValueField = card.querySelector('[data-field="modeValue"]');
        if (costField) costField.textContent = money(currentCost);
        if (impactField) impactField.textContent = pct(currentImpact);
        if (modeValueField) modeValueField.textContent = mode === 'financial' ? money(currentCost) : pct(currentImpact);
      }
    });
  }

  function rebuildForMode() {
    buildGrid();
    buildSeries();
    update();
  }

  function tick(timestamp) {
    if (lastFrame === null) lastFrame = timestamp;
    const delta = timestamp - lastFrame;
    lastFrame = timestamp;
    if (running && progress < 1) {
      const speed = Number(els.speed?.value || 1);
      progress += (delta / scenario.durationMs) * speed;
      if (progress >= 1) {
        progress = 1;
        running = false;
        if (els.startPause) els.startPause.textContent = 'Replay';
      }
      update();
    }
    window.requestAnimationFrame(tick);
  }

  function bindEvents() {
    els.startPause?.addEventListener('click', () => {
      if (progress >= 1) {
        progress = 0;
        running = true;
        els.startPause.textContent = 'Pause';
        update();
        return;
      }
      running = !running;
      els.startPause.textContent = running ? 'Pause' : 'Resume';
    });
    els.reset?.addEventListener('click', () => {
      progress = 0;
      running = false;
      if (els.startPause) els.startPause.textContent = 'Start';
      update();
    });
    els.modeToggle?.addEventListener('click', () => {
      mode = mode === 'relative' ? 'financial' : 'relative';
      rebuildForMode();
    });
  }

  function init() {
    buildGrid();
    buildSeries();
    bindEvents();
    update();
    window.requestAnimationFrame(tick);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
