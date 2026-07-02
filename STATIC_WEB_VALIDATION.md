# D-ACT Static Web Validation Report

This report validates the browser-side D-ACT core classifier included in `assets/dact-core.js`.

## Validation method

The validation script `tools/validate_static_core.js` was executed with Node.js. It imports the same browser-core classifier used by `index.html`, parses the bundled synthetic artefacts, runs D-ACT, and compares the resulting primary classification against the expected scenario classification.

Command:

```bash
node tools/validate_static_core.js
```

## Validated scenarios

| Scenario | Inputs | Expected classification | Observed classification | Result |
|---|---|---|---|---|
| S2_DDoS | synthetic DDoS PCAP | DDoS | DDoS | Pass |
| S7_DoW | PCAP + cloud CSV + serverless CSV | DoW | DoW | Pass |
| S9_DoA | AI usage CSV | DoA | DoA | Pass |
| S12_Recursive_DoA | low-rate PCAP + AI agent-loop CSV | Recursive_DoA | Recursive_DoA | Pass |
| S13_Serverless_DoA | PCAP + cloud CSV + serverless CSV + AI CSV | Serverless_DoA | Serverless_DoA | Pass |

## Validation result

All bundled synthetic scenarios passed. The browser-side classifier reproduced the expected D-ACT classifications for DDoS, DoW, DoA, Recursive DoA, and Serverless DoA.

## Scope

This validation confirms that the static JavaScript implementation operationalises the same C0-C6 taxonomy logic as the D-ACT proof-of-concept. It does not claim production-grade detection performance. The supplied artefacts are synthetic offline evaluation artefacts for reproducibility and demonstration.
