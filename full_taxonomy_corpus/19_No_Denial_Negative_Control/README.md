# 19_No_Denial_Negative_Control

Synthetic offline D-ACT reproducibility artefact. This folder does not contain live attack traffic and is intended only to test the D-ACT classifier against controlled evidence files.

## Expected outcome

- Primary classification: `Unclassified`
- Expected conditions: ``

## Input files

- `no_denial_negative_control.pcap`

## D-ACT command

```bash
python tools/dact.py --pcap examples/full_taxonomy_corpus/19_No_Denial_Negative_Control/no_denial_negative_control.pcap --output examples/full_taxonomy_corpus/19_No_Denial_Negative_Control/result_19_no_denial_negative_control.json
```

## Scenario notes

Negative-control PCAP: fewer than 50 traffic events, five balanced sources, no dominant source, and no complete denial condition set.
