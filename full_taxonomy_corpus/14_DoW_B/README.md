# 14_DoW_B

Synthetic offline D-ACT reproducibility artefact. This folder does not contain live attack traffic and is intended only to test the D-ACT classifier against controlled evidence files.

## Expected outcome

- Primary classification: `DoW`
- Expected conditions: `C0; C1; C4; C5`

## Input files

- `dow_b_single_source_serverless.pcap`
- `dow_b_cloud_billing.csv`
- `dow_b_serverless_invocations.csv`

## D-ACT command

```bash
python tools/dact.py --pcap examples/full_taxonomy_corpus/14_DoW_B/dow_b_single_source_serverless.pcap --cloud examples/full_taxonomy_corpus/14_DoW_B/dow_b_cloud_billing.csv --serverless examples/full_taxonomy_corpus/14_DoW_B/dow_b_serverless_invocations.csv --output examples/full_taxonomy_corpus/14_DoW_B/result_14_dow_b.json
```

## Scenario notes

Single-source cloud and serverless billing evidence. This should be classified as DoW, inheriting DoS and EDoS_S.
