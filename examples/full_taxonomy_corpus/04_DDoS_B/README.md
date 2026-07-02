# 04_DDoS_B

Synthetic offline D-ACT reproducibility artefact. This folder does not contain live attack traffic and is intended only to test the D-ACT classifier against controlled evidence files.

## Expected outcome

- Primary classification: `DDoS`
- Expected conditions: `C0; C2`

## Input files

- `ddos_b_distributed_high_rate.pcap`

## D-ACT command

```bash
python tools/dact.py --pcap examples/full_taxonomy_corpus/04_DDoS_B/ddos_b_distributed_high_rate.pcap --output examples/full_taxonomy_corpus/04_DDoS_B/result_04_ddos_b.json
```

## Scenario notes

Multiple documentation-range source IPs with high-rate irregular traffic. This supports C2 without C3.
