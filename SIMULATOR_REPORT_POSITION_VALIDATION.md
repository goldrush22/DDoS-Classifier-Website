# Simulator report-position update validation

This update modifies `simulator.html`, `assets/simulator.js`, and `assets/styles.css`.

Validated changes:

- The `victimExposureReport` element now appears after the main simulation visual section, so generated reports are presented below the visual simulator.
- Clicking **Generate denial attack exposure** now renders the report and automatically scrolls to it using `scrollIntoView()`.
- The online-service example text now appears above the `Estimated online-service profit per hour` input field.
- The technical-controls panel now includes a prominent instruction explaining that each control can be clicked to modify the simulation.
- Technical-control buttons now include explicit microcopy: `Click to apply to simulation`, changing to `Applied to simulation` when selected.
- JavaScript syntax validation was performed using Node.
