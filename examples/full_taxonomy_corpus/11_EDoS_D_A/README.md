# 11_EDoS_D_A

Synthetic offline D-ACT reproducibility artefact. This folder does not contain live attack traffic and is intended only to test the D-ACT classifier against controlled evidence files.

## Expected outcome

- Primary classification: `EDoS_D`
- Expected conditions: `C0; C2; C4`

## Input files

- `edos_d_a_distributed_cloud.pcap`
- `edos_d_a_cloud_billing.csv`

## D-ACT command

```bash
python tools/dact.py --pcap examples/full_taxonomy_corpus/11_EDoS_D_A/edos_d_a_distributed_cloud.pcap --cloud examples/full_taxonomy_corpus/11_EDoS_D_A/edos_d_a_cloud_billing.csv --output examples/full_taxonomy_corpus/11_EDoS_D_A/result_11_edos_d_a.json
```

## Scenario notes

Distributed high-rate traffic combined with cloud autoscaling or chargeable cloud consumption. This tests EDoS_D.
