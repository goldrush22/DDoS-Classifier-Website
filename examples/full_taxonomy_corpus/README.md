# Full Taxonomy Corpus for D-ACT Static Web Tool

This folder contains 19 synthetic offline examples for the D-ACT static web interface:

- two artefact sets for each of the nine core attack classes: DoS, DDoS, LDoS, LDDoS, EDoS_S, EDoS_D, DoW, DDoW, and DoA;
- one negative-control PCAP expected to return `Unclassified` with the explanation `Observed evidence did not satisfy a complete taxonomy rule.`

To use these examples in the static web interface, open `index.html`, select the files from one scenario folder, and click `Run D-ACT analysis`. The browser-side classifier should identify the same conditions and primary class shown in each scenario's `expected_classification.json` file.

These are synthetic reproducibility artefacts, not live attack traces.
