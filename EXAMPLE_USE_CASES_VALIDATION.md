# D-ACT Example Use Cases Page Validation

The static website was updated with a dedicated `examples.html` page containing the full 19-scenario D-ACT taxonomy corpus.

## Implemented features

- Dedicated `Example Use Cases` navigation tab.
- Modern card-based example catalogue.
- Filter by expected attack class.
- Search across scenario names, notes and expected conditions.
- Download links for every input, expected-output and result file.
- In-browser preview for CSV, JSON, Markdown and PCAP files.
- PCAP preview displays parsed packet metadata rather than raw binary content.
- One-click `Run example in browser` execution for each scenario.
- Browser execution uses `assets/dact-core.js` against the bundled artefacts.
- Result panel displays D-ACT classification, expected classification, identified conditions, absent conditions, files used and raw JSON output.

## Static validation

The full corpus was validated using:

```bash
node tools/validate_full_corpus_static.js
```

Result: 19/19 scenarios passed.

The generated validation output is stored in:

```text
FULL_CORPUS_STATIC_VALIDATION_RESULTS.json
```
