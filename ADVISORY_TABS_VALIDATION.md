# D-ACT Advisory Tabs Validation

This validation note records the additional educational/advisory pages added to the D-ACT static website.

## New pages

- `readiness.html` — Denial Attack Readiness Assessment
- `playbook.html` — Incident Response Playbook Generator
- `evidence.html` — Evidence & Log Collection Guide

## New scripts

- `assets/readiness.js`
- `assets/playbook.js`

## Validation checks

- All existing primary pages were updated to include the new navigation tabs.
- The readiness page renders a questionnaire, calculates a readiness score, identifies highest exposure classes, recommends priority actions, and exports JSON.
- The playbook page generates a staged incident response plan for all nine primary denial classes.
- The evidence guide maps D-ACT evidence sources to the C0-C6 condition model.
- JavaScript syntax checks passed for the new scripts using `node --check`.
- The new pages are static and suitable for GitHub Pages deployment.

## Scope statement

These pages are educational and advisory artefacts. They do not scan, attack, probe, or generate traffic. They are intended to help small businesses understand denial attack readiness, response actions, and the evidence required for classification.
