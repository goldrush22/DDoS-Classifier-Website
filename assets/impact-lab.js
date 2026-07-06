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
        css: 'series-small-sustainability'
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
        css: 'series-small-availability'
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
        css: 'series-large-sustainability'
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
        css: 'series-large-availability'
      }
    ]
  };

  const els = {
    startPause: document.getElementById('impactStartPause'),
    reset: document.getElementById('impactReset'),
    modeToggle: document.getElementById('impactModeToggle'),
    speed: document.getElementById('impactSpeed'),
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
    dataExplanation: document.getElementById('impactDataExplanation'),
    chartTitle: document.getElementById('impactChartTitle'),
    chartDesc: document.getElementById('impactChartDesc')
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
  const pathEls = new Map();
  const dotEls = new Map();
  const labelEls = new Map();
  const cardEls = new Map();

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

  function x(progressValue) {
    return chart.left + (progressValue * chart.width);
  }

  function activeMax() {
    return mode === 'financial' ? scenario.maxFinancial : scenario.maxRelative;
  }

  function seriesValue(series, currentProgress = progress) {
    return (mode === 'financial' ? series.finalCost : series.finalImpact) * currentProgress;
  }

  function finalSeriesValue(series) {
    return mode === 'financial' ? series.finalCost : series.finalImpact;
  }

  function formatActiveValue(value) {
    return mode === 'financial' ? money(value) : pct(value);
  }

  function y(value) {
    const clamped = Math.min(activeMax(), Math.max(0, value));
    return chart.bottom - ((clamped / activeMax()) * chart.height);
  }

  function makeSvg(name, attrs = {}) {
    const el = document.createElementNS('http://www.w3.org/2000/svg', name);
    for (const [key, value] of Object.entries(attrs)) {
      el.setAttribute(key, value);
    }
    return el;
  }

  function gridTicks() {
    if (mode === 'financial') {
      return [0, 600000, 1200000, 1800000, 2400000, 3000000, 3600000];
    }
    return [0, 0.03, 0.06, 0.09, 0.12, 0.15, 0.18];
  }

  function buildGrid() {
    if (!els.gridLines) return;
    els.gridLines.innerHTML = '';
    gridTicks().forEach((tick) => {
      const yy = y(tick);
      const line = makeSvg('line', {
        x1: chart.left,
        y1: yy,
        x2: chart.right,
        y2: yy,
        class: 'impact-grid-line'
      });
      const label = makeSvg('text', {
        x: mode === 'financial' ? 16 : 46,
        y: yy + 5,
        class: 'impact-tick-label'
      });
      label.textContent = formatActiveValue(tick);
      els.gridLines.appendChild(line);
      els.gridLines.appendChild(label);
    });
  }

  function buildSeries() {
    if (!els.lines || !els.dots || !els.labels || !els.legend || !els.liveCards) return;
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
      label.textContent = series.shortLabel;
      els.lines.appendChild(path);
      els.dots.appendChild(dot);
      els.labels.appendChild(label);
      pathEls.set(series.id, path);
      dotEls.set(series.id, dot);
      labelEls.set(series.id, label);

      const legendItem = document.createElement('div');
      legendItem.className = 'impact-legend-item';
      legendItem.innerHTML = `<span class="impact-legend-swatch ${series.css}"></span><span>${series.shortLabel}</span><small>${series.rating}</small>`;
      els.legend.appendChild(legendItem);

      const card = document.createElement('article');
      card.className = `impact-live-card ${series.css}`;
      card.innerHTML = `
        <div class="impact-card-topline"><span>${series.label}</span><strong>${series.rating}</strong></div>
        <div class="impact-card-money" data-field="cost">${money(0)}</div>
        <div class="impact-card-metrics">
          <span>Relative impact: <strong data-field="impact">0%</strong></span>
          <span data-mode-field>Graph value: <strong data-field="active-value">${formatActiveValue(0)}</strong></span>
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
      coords.push(`${i === 0 ? 'M' : 'L'} ${x(p).toFixed(2)} ${y(finalSeriesValue(series) * p).toFixed(2)}`);
    }
    return coords.join(' ');
  }

  function updateCopy() {
    if (els.modeToggle) {
      els.modeToggle.textContent = mode === 'relative' ? 'Show financial impact' : 'Show relative impact';
      els.modeToggle.setAttribute('aria-pressed', mode === 'financial' ? 'true' : 'false');
    }
    if (els.yAxisLabel) {
      els.yAxisLabel.textContent = mode === 'relative' ? 'relative impact' : 'financial impact (AUD)';
    }
    if (els.modeKicker) {
      els.modeKicker.textContent = mode === 'relative' ? 'Relative impact mode' : 'Financial impact mode';
    }
    if (els.graphExplanation) {
      els.graphExplanation.innerHTML = mode === 'relative'
        ? 'Four trajectories are plotted together using the relative impact ratio <code>I(t)=C(t)/P</code>. The values update as the scenario plays.'
        : 'Four trajectories are plotted using direct cumulative dollar loss. This view shows the flat figures: $15,000, $1,800, $15,000, and $3,600,000.';
    }
    if (els.dataExplanation) {
      els.dataExplanation.textContent = mode === 'relative'
        ? 'Each card shows the running cumulative cost, relative impact, and final scenario value.'
        : 'Each card shows the direct dollar loss while preserving the relative-impact context for comparison.';
    }
    if (els.chartTitle) {
      els.chartTitle.textContent = mode === 'relative'
        ? 'Relative impact of denial and sustainability attacks by victim scale'
        : 'Financial impact of denial and sustainability attacks by victim scale';
    }
    if (els.chartDesc) {
      els.chartDesc.textContent = mode === 'relative'
        ? 'Animated relative-impact line graph showing small and large business attack outcomes.'
        : 'Animated financial-impact line graph showing direct cumulative dollar losses for each scenario.';
    }
  }

  function update() {
    progress = Math.min(1, Math.max(0, progress));
    if (els.progressText) els.progressText.textContent = `${Math.round(progress * 100)}%`;
    scenario.series.forEach((series) => {
      const currentCost = series.finalCost * progress;
      const currentImpact = series.finalImpact * progress;
      const currentActive = seriesValue(series, progress);
      const xx = x(progress);
      const yy = y(currentActive);
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
        label.setAttribute('x', Math.min(xx + 12, chart.right - 160));
        label.setAttribute('y', Math.max(chart.top + 18, yy - 12));
        label.textContent = `${series.shortLabel} ${formatActiveValue(currentActive)}`;
      }
      if (card) {
        const costField = card.querySelector('[data-field="cost"]');
        const impactField = card.querySelector('[data-field="impact"]');
        const activeField = card.querySelector('[data-field="active-value"]');
        const modeField = card.querySelector('[data-mode-field]');
        if (costField) costField.textContent = money(currentCost);
        if (impactField) impactField.textContent = pct(currentImpact);
        if (activeField) activeField.textContent = formatActiveValue(currentActive);
        if (modeField) modeField.firstChild.textContent = mode === 'relative' ? 'Graph value: ' : 'Graph value: ';
      }
    });
  }

  function setMode(nextMode) {
    mode = nextMode === 'financial' ? 'financial' : 'relative';
    updateCopy();
    buildGrid();
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
      setMode(mode === 'relative' ? 'financial' : 'relative');
    });
  }

  function init() {
    updateCopy();
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
