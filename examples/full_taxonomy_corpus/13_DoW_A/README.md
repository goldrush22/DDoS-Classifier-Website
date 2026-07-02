# 13_DoW_A

Synthetic offline D-ACT reproducibility artefact. This folder does not contain live attack traffic and is intended only to test the D-ACT classifier against controlled evidence files.

## Expected outcome

- Primary classification: `DoW`
- Expected conditions: `C0; C1; C4; C5`

## Input files

- `dow_a_single_source_serverless.pcap`
- `dow_a_cloud_billing.csv`
- `dow_a_serverless_invocations.csv`

## D-ACT command

```bash
python tools/dact.py --pcap examples/full_taxonomy_corpus/13_DoW_A/dow_a_single_source_serverless.pcap --cloud examples/full_taxonomy_corpus/13_DoW_A/dow_a_cloud_billing.csv --serverless examples/full_taxonomy_corpus/13_DoW_A/dow_a_serverless_invocations.csv --output examples/full_taxonomy_corpus/13_DoW_A/result_13_dow_a.json
```

## Scenario notes

Single-source cloud and serverless billing evidence. This should be classified as DoW, inheriting DoS and EDoS_S.
