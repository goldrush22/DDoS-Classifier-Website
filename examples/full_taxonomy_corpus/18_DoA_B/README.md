# 18_DoA_B

Synthetic offline D-ACT reproducibility artefact. This folder does not contain live attack traffic and is intended only to test the D-ACT classifier against controlled evidence files.

## Expected outcome

- Primary classification: `DoA`
- Expected conditions: `C0; C6`

## Input files

- `doa_b_ai_usage.csv`

## D-ACT command

```bash
python tools/dact.py --ai examples/full_taxonomy_corpus/18_DoA_B/doa_b_ai_usage.csv --output examples/full_taxonomy_corpus/18_DoA_B/result_18_doa_b.json
```

## Scenario notes

AI usage log only. No traffic source evidence is provided, so the expected parent-level classification is DoA rather than a source-specific DoA subclass.
