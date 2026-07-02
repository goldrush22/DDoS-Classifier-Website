# 03_DDoS_A

Synthetic offline D-ACT reproducibility artefact. This folder does not contain live attack traffic and is intended only to test the D-ACT classifier against controlled evidence files.

## Expected outcome

- Primary classification: `DDoS`
- Expected conditions: `C0; C2`

## Input files

- `ddos_a_distributed_high_rate.pcap`

## D-ACT command

```bash
python tools/dact.py --pcap examples/full_taxonomy_corpus/03_DDoS_A/ddos_a_distributed_high_rate.pcap --output examples/full_taxonomy_corpus/03_DDoS_A/result_03_ddos_a.json
```

## Scenario notes

Multiple documentation-range source IPs with high-rate irregular traffic. This supports C2 without C3.
