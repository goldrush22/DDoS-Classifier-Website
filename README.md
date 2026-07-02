# DDoS-Classifier-Website
# Denial Attack Classifier Tool (D-ACT) Static Web Interface

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
