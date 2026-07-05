# D-ACT Denial Attack Simulator Validation

The static website was updated with a new `simulator.html` page and `assets/simulator.js` script.

## Implemented checks

- `simulator.html` exists.
- `assets/simulator.js` passes JavaScript syntax checking with `node --check`.
- The simulator defines all nine primary attack classes: DoS, DDoS, LDoS, LDDoS, EDoS_S, EDoS_D, DoW, DDoW and DoA.
- The simulator page contains the required attacker, victim, packet lane, condition strip, mitigation side panel and technical-control interaction elements.
- The existing navigation in `index.html`, `examples.html` and `mitigations.html` now links to `simulator.html`.
- The simulator loads the existing mitigation catalogue from `assets/mitigations.js`.
- Technical mitigation controls are clickable and visually alter the simulation state.

## Safety scope

The simulator is purely visual. It does not generate packets, replay PCAP files, execute network requests, or perform denial attacks. It is an educational visualisation of the D-ACT taxonomy and mitigation model.
