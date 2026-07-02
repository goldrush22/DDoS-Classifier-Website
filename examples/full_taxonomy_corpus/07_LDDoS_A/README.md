# 07_LDDoS_A

Synthetic offline D-ACT reproducibility artefact. This folder does not contain live attack traffic and is intended only to test the D-ACT classifier against controlled evidence files.

## Expected outcome

- Primary classification: `LDDoS`
- Expected conditions: `C0; C2; C3`

## Input files

- `lddos_a_distributed_periodic_low_rate.pcap`

## D-ACT command

```bash
python tools/dact.py --pcap examples/full_taxonomy_corpus/07_LDDoS_A/lddos_a_distributed_periodic_low_rate.pcap --output examples/full_taxonomy_corpus/07_LDDoS_A/result_07_lddos_a.json
```

## Scenario notes

Multiple sources with low-rate periodic traffic. This supports distributed low-rate denial classification.
