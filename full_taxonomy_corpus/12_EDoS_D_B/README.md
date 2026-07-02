# 12_EDoS_D_B

Synthetic offline D-ACT reproducibility artefact. This folder does not contain live attack traffic and is intended only to test the D-ACT classifier against controlled evidence files.

## Expected outcome

- Primary classification: `EDoS_D`
- Expected conditions: `C0; C2; C4`

## Input files

- `edos_d_b_distributed_cloud.pcap`
- `edos_d_b_cloud_billing.csv`

## D-ACT command

```bash
python tools/dact.py --pcap examples/full_taxonomy_corpus/12_EDoS_D_B/edos_d_b_distributed_cloud.pcap --cloud examples/full_taxonomy_corpus/12_EDoS_D_B/edos_d_b_cloud_billing.csv --output examples/full_taxonomy_corpus/12_EDoS_D_B/result_12_edos_d_b.json
```

## Scenario notes

Distributed high-rate traffic combined with cloud autoscaling or chargeable cloud consumption. This tests EDoS_D.
