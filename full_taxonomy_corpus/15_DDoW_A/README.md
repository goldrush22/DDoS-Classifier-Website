# 15_DDoW_A

Synthetic offline D-ACT reproducibility artefact. This folder does not contain live attack traffic and is intended only to test the D-ACT classifier against controlled evidence files.

## Expected outcome

- Primary classification: `DDoW`
- Expected conditions: `C0; C2; C4; C5`

## Input files

- `ddow_a_distributed_serverless.pcap`
- `ddow_a_cloud_billing.csv`
- `ddow_a_serverless_invocations.csv`

## D-ACT command

```bash
python tools/dact.py --pcap examples/full_taxonomy_corpus/15_DDoW_A/ddow_a_distributed_serverless.pcap --cloud examples/full_taxonomy_corpus/15_DDoW_A/ddow_a_cloud_billing.csv --serverless examples/full_taxonomy_corpus/15_DDoW_A/ddow_a_serverless_invocations.csv --output examples/full_taxonomy_corpus/15_DDoW_A/result_15_ddow_a.json
```

## Scenario notes

Distributed cloud and serverless billing evidence. This should be classified as DDoW.
