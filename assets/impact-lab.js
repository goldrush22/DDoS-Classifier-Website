(() => {
  const scenario = {
    durationMs: 30000,
    maxRelative: 0.18,
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
    speed: document.getElementById('impactSpeed'),
    progressText: document.getElementById('impactProgressText'),
    gridLines: document.getElementById('impactGridLines'),
    lines: document.getElementById('impactLines'),
    dots: document.getElementById('impactDots'),
    labels: document.getElementById('impactLabels'),
    legend: document.getElementById('impactLegend'),
    liveCards: document.getElementById('impactLiveCards')
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

  function x(progressValue) {
    return chart.left + (progressValue * chart.width);
  }

  function y(relativeImpact) {
    const clamped = Math.min(scenario.maxRelative, Math.max(0, relativeImpact));
    return chart.bottom - ((clamped / scenario.maxRelative) * chart.height);
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
    const ticks = [0, 0.03, 0.06, 0.09, 0.12, 0.15, 0.18];
    ticks.forEach((tick) => {
      const yy = y(tick);
      const line = makeSvg('line', { x1: chart.left, y1: yy, x2: chart.right, y2: yy, class: 'impact-grid-line' });
      const label = makeSvg('text', { x: 46, y: yy + 5, class: 'impact-tick-label' });
      label.textContent = pct(tick);
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
      label.textContent = series.shortLabel;
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
      coords.push(`${i === 0 ? 'M' : 'L'} ${x(p).toFixed(2)} ${y(series.finalImpact * p).toFixed(2)}`);
    }
    return coords.join(' ');
  }

  function update() {
    progress = Math.min(1, Math.max(0, progress));
    els.progressText.textContent = `${Math.round(progress * 100)}%`;
    scenario.series.forEach((series) => {
      const currentCost = series.finalCost * progress;
      const currentImpact = series.finalImpact * progress;
      const xx = x(progress);
      const yy = y(currentImpact);
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
      }
      if (card) {
        const costField = card.querySelector('[data-field="cost"]');
        const impactField = card.querySelector('[data-field="impact"]');
        if (costField) costField.textContent = money(currentCost);
        if (impactField) impactField.textContent = pct(currentImpact);
      }
    });
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
