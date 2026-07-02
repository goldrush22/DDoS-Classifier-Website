# 09_EDoS_S_A

Synthetic offline D-ACT reproducibility artefact. This folder does not contain live attack traffic and is intended only to test the D-ACT classifier against controlled evidence files.

## Expected outcome

- Primary classification: `EDoS_S`
- Expected conditions: `C0; C1; C4`

## Input files

- `edos_s_a_single_source_cloud.pcap`
- `edos_s_a_cloud_billing.csv`

## D-ACT command

```bash
python tools/dact.py --pcap examples/full_taxonomy_corpus/09_EDoS_S_A/edos_s_a_single_source_cloud.pcap --cloud examples/full_taxonomy_corpus/09_EDoS_S_A/edos_s_a_cloud_billing.csv --output examples/full_taxonomy_corpus/09_EDoS_S_A/result_09_edos_s_a.json
```

## Scenario notes

Single-source high-rate traffic combined with cloud autoscaling or chargeable cloud consumption. This tests the source-neutral EDoS_S branch.
