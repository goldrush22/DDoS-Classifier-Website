# 16_DDoW_B

Synthetic offline D-ACT reproducibility artefact. This folder does not contain live attack traffic and is intended only to test the D-ACT classifier against controlled evidence files.

## Expected outcome

- Primary classification: `DDoW`
- Expected conditions: `C0; C2; C4; C5`

## Input files

- `ddow_b_distributed_serverless.pcap`
- `ddow_b_cloud_billing.csv`
- `ddow_b_serverless_invocations.csv`

## D-ACT command

```bash
python tools/dact.py --pcap examples/full_taxonomy_corpus/16_DDoW_B/ddow_b_distributed_serverless.pcap --cloud examples/full_taxonomy_corpus/16_DDoW_B/ddow_b_cloud_billing.csv --serverless examples/full_taxonomy_corpus/16_DDoW_B/ddow_b_serverless_invocations.csv --output examples/full_taxonomy_corpus/16_DDoW_B/result_16_ddow_b.json
```

## Scenario notes

Distributed cloud and serverless billing evidence. This should be classified as DDoW.
