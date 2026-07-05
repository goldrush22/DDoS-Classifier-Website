# D-ACT Financial Control Simulator Validation

This validation note documents the simulator update that adds online-service revenue loss and mitigation-specific financial effects.

## Implemented changes

- Added victim profile input for estimated online-service profit per hour.
- Availability-denial classes now model lost online-service profit:
  - DoS
  - DDoS
  - LDoS
  - LDDoS
- Sustainability-denial classes now model metered resource cost plus optional service-impact loss:
  - EDoS_S
  - EDoS_D
  - DoW
  - DDoW
  - DoA
- Technical mitigation controls now display an explicit simulated financial effect.
- Clicking a mitigation control changes the remaining exposure multiplier for the selected attack.
- Running simulated exposure is displayed in the financial dashboard.
- Avoided exposure is displayed separately to show the simulated benefit of controls.
- Each animated packet/resource marker now displays its simulated event exposure value.

## Validation checks

- `assets/simulator.js` passes JavaScript syntax validation using `node --check`.
- `simulator.html` contains the `victimOnlineHourlyProfit` input.
- The simulator remains static and client-side only.
- The simulator does not generate packets, send requests, replay PCAP files, or interact with cloud/serverless/AI services.

## Financial model status

All rates and coefficients are interim educational modelling values. They are not empirical loss claims and should be replaced when validated research data becomes available.
