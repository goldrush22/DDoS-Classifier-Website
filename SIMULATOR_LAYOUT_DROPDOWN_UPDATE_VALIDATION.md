# Simulator layout and inline attack selector update validation

Date: 2026-07-06

## Changes implemented

- Widened the Denial Attack Simulator visual section by increasing the simulator layout width and converting the simulator/mitigation layout to a single-column flow.
- Moved the mitigation side panel below the widened simulation visual instead of placing it beside the simulation.
- Added a second attack-type dropdown inside the simulation panel, labelled `Change attack type inside simulation`.
- Synced the top attack selector and the inline simulation attack selector so either control changes the same simulation state.
- Preserved mitigation interactivity, active condition highlighting, financial exposure calculations, packet/resource labels, and exposure report generation.

## Files changed

- `simulator.html`
- `assets/simulator.js`
- `assets/styles.css`
- `SIMULATOR_LAYOUT_DROPDOWN_UPDATE_VALIDATION.md`

## Validation checks

- JavaScript syntax check passed using `node --check assets/simulator.js`.
- `simulator.html` contains the new `attackSelectInline` selector.
- `assets/simulator.js` initialises and synchronises both `attackSelect` and `attackSelectInline`.
- `assets/styles.css` includes the widened simulator layout and inline dropdown styles.

## Expected user-facing behaviour

1. User selects an attack type at the top of the page or inside the simulation panel.
2. The simulation visual updates to that attack type.
3. The mitigation panel appears below the widened simulation visual.
4. The user can click technical controls in the mitigation panel to modify the simulation.
5. Financial exposure and packet/resource labels remain active.
