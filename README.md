# D-ACT Static Web Interface

This repository contains a static browser version of the D-ACT Denial Attack Classification Tool. It can be uploaded to a public web repository and hosted as a static website, including GitHub Pages, Netlify, Vercel static hosting, Cloudflare Pages, or an ordinary web server.

## What it does

The interface allows a reader or reviewer to upload evidence files and run the D-ACT C0-C6 taxonomy classifier in the browser.

Supported evidence inputs:

- classic Ethernet/IPv4 `.pcap` files
- flow or request logs as `.csv`, `.json`, `.xlsx`, or `.xls`
- cloud telemetry or billing logs as `.csv`, `.json`, `.xlsx`, or `.xls`
- serverless invocation logs as `.csv`, `.json`, `.xlsx`, or `.xls`
- AI usage logs as `.csv`, `.json`, `.xlsx`, or `.xls`

The interface displays:

- a visual taxonomy tree from `C0` to `C6`
- green condition nodes when D-ACT identifies a condition
- red condition nodes when a condition is absent
- the identified and absent conditions
- the inferred denial attack classification
- inherited or secondary classes
- extracted features
- raw JSON output for reproducibility

## Important scope statement

This is a client-side research artefact. It does not generate traffic, perform attacks, or upload files to a remote server. Files are processed in the user's browser by JavaScript. The bundled examples are synthetic offline evaluation artefacts intended for reproducibility.

## Quick start

Open `index.html` directly in a browser, or host the directory as a static site.

For local development with a simple static server:

```bash
python3 -m http.server 8000
```

Then open:

```text
http://127.0.0.1:8000
```

## Repository structure

```text
index.html
assets/
  app.js
  dact-core.js
  styles.css
examples/
  synthetic_artefacts/
    S2_DDoS/
    S7_DoW/
    S9_DoA/
    S12_Recursive_DoA/
    S13_Serverless_DoA/
  evaluation_summary.csv
tools/
  validate_static_core.js
appendix/
  appendix_static_web_interface.tex
STATIC_VALIDATION_RESULTS.json
```

## Using the website

1. Open the website.
2. Upload one or more evidence files in the relevant input boxes.
3. Click **Run D-ACT classifier**.
4. Inspect the taxonomy tree and output panels.
5. Use **Download JSON result** to save the classification output.

PCAP-only analysis can infer `C0`, `C1`, `C2`, and `C3`. Cloud logs are required for `C4`, serverless logs for `C5`, and AI usage logs for `C6`.

## PCAP format requirement

The browser PCAP parser expects classic Ethernet/IPv4 `.pcap` files. It does not parse `.pcapng`. Convert `.pcapng` files before use:

```bash
editcap -F pcap input_capture.pcapng output_capture.pcap
```

## Excel support

Excel support is provided through SheetJS loaded from a public CDN in `index.html`:

```html
<script src="https://cdn.jsdelivr.net/npm/xlsx@0.18.5/dist/xlsx.full.min.js" defer></script>
```

CSV, JSON, and PCAP parsing are dependency-free. If the website must operate without any external CDN, use CSV/JSON files or vendor the SheetJS file locally.

## Validation

The core browser classifier was tested against the bundled synthetic artefacts using Node.js:

```bash
node tools/validate_static_core.js
```

The validation produces `STATIC_VALIDATION_RESULTS.json`. The validated outputs are:

| Scenario | Expected | Actual |
|---|---|---|
| S2_DDoS | DDoS | DDoS |
| S7_DoW | DoW | DoW |
| S9_DoA | DoA | DoA |
| S12_Recursive_DoA | Recursive_DoA | Recursive_DoA |
| S13_Serverless_DoA | Serverless_DoA | Serverless_DoA |

## Deployment to GitHub Pages

1. Create a new GitHub repository.
2. Upload all files in this directory.
3. Go to **Settings → Pages**.
4. Select deployment from the `main` branch root.
5. Save and open the generated GitHub Pages URL.

## Recommended paper wording

The D-ACT static web interface is a client-side research artefact that operationalises the C0-C6 taxonomy in a browser. It accepts packet captures and structured logs as evidence, infers the relevant taxonomy conditions, visually marks identified and absent conditions, and returns an explainable denial attack classification. The artefact is suitable for supplementary material because it allows readers and reviewers to reproduce the classification workflow without installing a backend service.

## Example Use Cases page

This repository now includes a dedicated `examples.html` page for non-technical users and reviewers. The page lists 19 synthetic offline reproducibility examples covering the full D-ACT taxonomy corpus:

- DoS x 2
- DDoS x 2
- LDoS x 2
- LDDoS x 2
- EDoS_S x 2
- EDoS_D x 2
- DoW x 2
- DDoW x 2
- DoA x 2
- Unclassified / no-denial negative control x 1

Each example card includes:

- the expected D-ACT classification;
- the expected C0-C6 condition set;
- downloadable input files;
- downloadable expected and precomputed result files;
- an in-browser preview button for each file; and
- a one-click "Run example in browser" button.

PCAP previews show parsed packet metadata rather than raw binary content. CSV, JSON and Markdown files are previewed as text. The examples are stored in `examples/full_taxonomy_corpus/`.

To validate the full static corpus locally, run:

```bash
node tools/validate_full_corpus_static.js
```

The validator writes `FULL_CORPUS_STATIC_VALIDATION_RESULTS.json`.


## Mitigation strategies page

This repository includes `mitigations.html`, a static defensive guidance page for D-ACT classifications. The classifier page links to this page after producing a result and displays a class-specific mitigation summary alongside the output.

## Denial Attack Simulator page

This repository includes `simulator.html`, a purely visual educational simulator for the nine primary D-ACT denial taxonomy classes:

- DoS
- DDoS
- LDoS
- LDDoS
- EDoS_S
- EDoS_D
- DoW
- DDoW
- DoA

The simulator does not generate packets, replay packet captures, create requests, or interact with any network. It visually represents attacker-side sources, victim-side resources, condition sets C0-C6, packet/resource movement, cloud/serverless/AI resource domains, and mitigation controls.

Each selected attack class displays the corresponding mitigation strategy from `assets/mitigations.js`. Technical controls in the side panel are interactive: selecting a control changes the simulation state to show blocking, throttling, endpoint hardening, traffic scrubbing, cost guardrails, serverless invocation controls, AI-resource controls, or monitoring overlays.

The simulator page is intended as an educational and paper-supporting research artefact. It translates the taxonomy into a layperson-readable visual model and should not be described as an attack generator.

## Victim financial profile simulator

The Denial Attack Simulator now includes an optional victim financial profile module. Users can enter a business name, a profit amount, and a period limited to Daily, Monthly, or Yearly. Sustainability-oriented simulations (`EDoS_S`, `EDoS_D`, `DoW`, `DDoW`, and `DoA`) then display a running illustrative cost exposure and compare it with the victim's normalised profit per minute.

The default coefficients are interim modelling values stored in `assets/simulator.js` under `FINANCIAL_MODEL`. They are intended for educational visualisation and can be replaced later with empirical research values.
