# 02_DoS_B

Synthetic offline D-ACT reproducibility artefact. This folder does not contain live attack traffic and is intended only to test the D-ACT classifier against controlled evidence files.

## Expected outcome

- Primary classification: `DoS`
- Expected conditions: `C0; C1`

## Input files

- `dos_b_single_source_high_rate.pcap`

## D-ACT command

```bash
python tools/dact.py --pcap examples/full_taxonomy_corpus/02_DoS_B/dos_b_single_source_high_rate.pcap --output examples/full_taxonomy_corpus/02_DoS_B/result_02_dos_b.json
```

## Scenario notes

Single dominant source with high-rate irregular traffic. The irregular timing avoids low-rate/periodic C3 inference.
