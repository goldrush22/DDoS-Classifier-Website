# Victim Profile Exposure Report Validation

This update adds a generated Victim Profile Exposure Report to the D-ACT Denial Attack Simulator.

## Implemented behaviour

- The victim profile now includes:
  - business/name input,
  - profit amount,
  - profit period restricted to Daily, Monthly, or Yearly,
  - estimated online-service profit per hour.
- The button label is now **Generate denial attack exposure**.
- When clicked, the simulator generates a report calculating simulated exposure across all nine attack classes:
  - DoS,
  - DDoS,
  - LDoS,
  - LDDoS,
  - EDoS_S,
  - EDoS_D,
  - DoW,
  - DDoW,
  - DoA.
- The report ranks attack classes by simulated hourly exposure.
- The report displays:
  - condition set,
  - financial mechanism,
  - simulated exposure per hour,
  - simulated exposure across an eight-hour scenario,
  - risk pressure relative to the victim's online-service profit per hour,
  - strongest listed mitigation effect based on the mitigation catalogue.
- The report can be downloaded as JSON.
- The report can be printed or saved through the browser print dialog.

## Validation performed

- `assets/simulator.js` passed JavaScript syntax validation with `node -c`.
- The report uses the same `FINANCIAL_MODEL` coefficients as the live simulator.
- The report uses the same mitigation catalogue and technical-control multiplier logic as the live simulator.
- No network traffic, packet replay, cloud invocation, serverless execution, or AI API call is performed.

## Academic framing

The report is an educational exposure simulator. It is designed to show that denial attacks can create financial harm through availability loss, degradation, autoscaling cost, serverless billing, or AI inference consumption. The coefficients are interim teaching values and should be replaced with empirical research values when available.
