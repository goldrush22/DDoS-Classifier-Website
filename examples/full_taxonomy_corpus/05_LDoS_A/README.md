# 05_LDoS_A

Synthetic offline D-ACT reproducibility artefact. This folder does not contain live attack traffic and is intended only to test the D-ACT classifier against controlled evidence files.

## Expected outcome

- Primary classification: `LDoS`
- Expected conditions: `C0; C1; C3`

## Input files

- `ldos_a_single_source_periodic_low_rate.pcap`

## D-ACT command

```bash
python tools/dact.py --pcap examples/full_taxonomy_corpus/05_LDoS_A/ldos_a_single_source_periodic_low_rate.pcap --output examples/full_taxonomy_corpus/05_LDoS_A/result_05_ldos_a.json
```

## Scenario notes

Single dominant source with low-rate periodic packet timing. This is designed to satisfy C0, C1, and C3.
