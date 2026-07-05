# D-ACT Denial Attack Simulator — Financial Profile Extension Validation

This validation note documents the financial-profile extension added to `simulator.html` and `assets/simulator.js`.

## Implemented features

- Victim/business name input.
- Profit amount input.
- Profit-period selector restricted to `Daily`, `Monthly`, and `Yearly`.
- Normalisation of the selected profit figure to daily and per-minute profit.
- Sustainability-impact dashboard shown on the simulator page.
- Interim editable cost coefficients for:
  - `EDoS_S`
  - `EDoS_D`
  - `DoW`
  - `DDoW`
  - `DoA`
- No direct sustainability-cost coefficient for:
  - `DoS`
  - `DDoS`
  - `LDoS`
  - `LDDoS`
- Running simulated exposure updates when visualised packet/resource events are generated.
- Clicked mitigation controls reduce the active cost coefficient using transparent multipliers.
- Reset button clears the running simulated exposure.

## Important research framing

The default coefficients are interim modelling coefficients. They are not asserted as measured real-world loss values. They are intended to visualise the economic principle of sustainability denial: metered cloud, serverless, and AI services can generate cost while a service remains available.

The coefficients are stored in `assets/simulator.js` under `FINANCIAL_MODEL` so they can be replaced later with empirical research data.

## Static-site compatibility

The extension is client-side only and does not require a server, backend, database, or network traffic generation.

Validated source files:

- `simulator.html`
- `assets/simulator.js`
- `assets/styles.css`

## Safety note

This remains a visual educational simulator. It does not generate packets, replay PCAP files, call cloud APIs, invoke serverless functions, or consume AI APIs.
