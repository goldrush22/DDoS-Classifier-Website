window.DACT_EXAMPLE_CORPUS = [
  {
    "id": "01_DoS_A",
    "label": "01 DoS A",
    "attackClass": "DoS",
    "expectedConditions": [
      "C0",
      "C1"
    ],
    "notes": "Single dominant source with high-rate irregular traffic. The irregular timing avoids low-rate/periodic C3 inference.",
    "plainEnglish": "Single dominant source with high-rate irregular traffic. The irregular timing avoids low-rate/periodic C3 inference.",
    "folder": "examples/full_taxonomy_corpus/01_DoS_A/",
    "files": [
      {
        "name": "README.md",
        "path": "examples/full_taxonomy_corpus/01_DoS_A/README.md",
        "kind": "readme",
        "role": "Scenario notes",
        "size": 677
      },
      {
        "name": "dos_a_single_source_high_rate.pcap",
        "path": "examples/full_taxonomy_corpus/01_DoS_A/dos_a_single_source_high_rate.pcap",
        "kind": "pcap",
        "role": "Packet capture",
        "size": 5624
      },
      {
        "name": "expected_classification.json",
        "path": "examples/full_taxonomy_corpus/01_DoS_A/expected_classification.json",
        "kind": "expected",
        "role": "Expected classification",
        "size": 232
      },
      {
        "name": "result_01_dos_a.json",
        "path": "examples/full_taxonomy_corpus/01_DoS_A/result_01_dos_a.json",
        "kind": "result",
        "role": "Precomputed D-ACT output",
        "size": 1267
      }
    ]
  },
  {
    "id": "02_DoS_B",
    "label": "02 DoS B",
    "attackClass": "DoS",
    "expectedConditions": [
      "C0",
      "C1"
    ],
    "notes": "Single dominant source with high-rate irregular traffic. The irregular timing avoids low-rate/periodic C3 inference.",
    "plainEnglish": "Single dominant source with high-rate irregular traffic. The irregular timing avoids low-rate/periodic C3 inference.",
    "folder": "examples/full_taxonomy_corpus/02_DoS_B/",
    "files": [
      {
        "name": "README.md",
        "path": "examples/full_taxonomy_corpus/02_DoS_B/README.md",
        "kind": "readme",
        "role": "Scenario notes",
        "size": 677
      },
      {
        "name": "dos_b_single_source_high_rate.pcap",
        "path": "examples/full_taxonomy_corpus/02_DoS_B/dos_b_single_source_high_rate.pcap",
        "kind": "pcap",
        "role": "Packet capture",
        "size": 6674
      },
      {
        "name": "expected_classification.json",
        "path": "examples/full_taxonomy_corpus/02_DoS_B/expected_classification.json",
        "kind": "expected",
        "role": "Expected classification",
        "size": 232
      },
      {
        "name": "result_02_dos_b.json",
        "path": "examples/full_taxonomy_corpus/02_DoS_B/result_02_dos_b.json",
        "kind": "result",
        "role": "Precomputed D-ACT output",
        "size": 1267
      }
    ]
  },
  {
    "id": "03_DDoS_A",
    "label": "03 DDoS A",
    "attackClass": "DDoS",
    "expectedConditions": [
      "C0",
      "C2"
    ],
    "notes": "Multiple documentation-range source IPs with high-rate irregular traffic. This supports C2 without C3.",
    "plainEnglish": "Multiple documentation-range source IPs with high-rate irregular traffic. This supports C2 without C3.",
    "folder": "examples/full_taxonomy_corpus/03_DDoS_A/",
    "files": [
      {
        "name": "README.md",
        "path": "examples/full_taxonomy_corpus/03_DDoS_A/README.md",
        "kind": "readme",
        "role": "Scenario notes",
        "size": 666
      },
      {
        "name": "ddos_a_distributed_high_rate.pcap",
        "path": "examples/full_taxonomy_corpus/03_DDoS_A/ddos_a_distributed_high_rate.pcap",
        "kind": "pcap",
        "role": "Packet capture",
        "size": 11224
      },
      {
        "name": "expected_classification.json",
        "path": "examples/full_taxonomy_corpus/03_DDoS_A/expected_classification.json",
        "kind": "expected",
        "role": "Expected classification",
        "size": 233
      },
      {
        "name": "result_03_ddos_a.json",
        "path": "examples/full_taxonomy_corpus/03_DDoS_A/result_03_ddos_a.json",
        "kind": "result",
        "role": "Precomputed D-ACT output",
        "size": 1254
      }
    ]
  },
  {
    "id": "04_DDoS_B",
    "label": "04 DDoS B",
    "attackClass": "DDoS",
    "expectedConditions": [
      "C0",
      "C2"
    ],
    "notes": "Multiple documentation-range source IPs with high-rate irregular traffic. This supports C2 without C3.",
    "plainEnglish": "Multiple documentation-range source IPs with high-rate irregular traffic. This supports C2 without C3.",
    "folder": "examples/full_taxonomy_corpus/04_DDoS_B/",
    "files": [
      {
        "name": "README.md",
        "path": "examples/full_taxonomy_corpus/04_DDoS_B/README.md",
        "kind": "readme",
        "role": "Scenario notes",
        "size": 666
      },
      {
        "name": "ddos_b_distributed_high_rate.pcap",
        "path": "examples/full_taxonomy_corpus/04_DDoS_B/ddos_b_distributed_high_rate.pcap",
        "kind": "pcap",
        "role": "Packet capture",
        "size": 12624
      },
      {
        "name": "expected_classification.json",
        "path": "examples/full_taxonomy_corpus/04_DDoS_B/expected_classification.json",
        "kind": "expected",
        "role": "Expected classification",
        "size": 233
      },
      {
        "name": "result_04_ddos_b.json",
        "path": "examples/full_taxonomy_corpus/04_DDoS_B/result_04_ddos_b.json",
        "kind": "result",
        "role": "Precomputed D-ACT output",
        "size": 1251
      }
    ]
  },
  {
    "id": "05_LDoS_A",
    "label": "05 LDoS A",
    "attackClass": "LDoS",
    "expectedConditions": [
      "C0",
      "C1",
      "C3"
    ],
    "notes": "Single dominant source with low-rate periodic packet timing. This is designed to satisfy C0, C1, and C3.",
    "plainEnglish": "Single dominant source with low-rate periodic packet timing. This is designed to satisfy C0, C1, and C3.",
    "folder": "examples/full_taxonomy_corpus/05_LDoS_A/",
    "files": [
      {
        "name": "README.md",
        "path": "examples/full_taxonomy_corpus/05_LDoS_A/README.md",
        "kind": "readme",
        "role": "Scenario notes",
        "size": 692
      },
      {
        "name": "expected_classification.json",
        "path": "examples/full_taxonomy_corpus/05_LDoS_A/expected_classification.json",
        "kind": "expected",
        "role": "Expected classification",
        "size": 253
      },
      {
        "name": "ldos_a_single_source_periodic_low_rate.pcap",
        "path": "examples/full_taxonomy_corpus/05_LDoS_A/ldos_a_single_source_periodic_low_rate.pcap",
        "kind": "pcap",
        "role": "Packet capture",
        "size": 5064
      },
      {
        "name": "result_05_ldos_a.json",
        "path": "examples/full_taxonomy_corpus/05_LDoS_A/result_05_ldos_a.json",
        "kind": "result",
        "role": "Precomputed D-ACT output",
        "size": 1423
      }
    ]
  },
  {
    "id": "06_LDoS_B",
    "label": "06 LDoS B",
    "attackClass": "LDoS",
    "expectedConditions": [
      "C0",
      "C1",
      "C3"
    ],
    "notes": "Single dominant source with low-rate periodic packet timing. This is designed to satisfy C0, C1, and C3.",
    "plainEnglish": "Single dominant source with low-rate periodic packet timing. This is designed to satisfy C0, C1, and C3.",
    "folder": "examples/full_taxonomy_corpus/06_LDoS_B/",
    "files": [
      {
        "name": "README.md",
        "path": "examples/full_taxonomy_corpus/06_LDoS_B/README.md",
        "kind": "readme",
        "role": "Scenario notes",
        "size": 692
      },
      {
        "name": "expected_classification.json",
        "path": "examples/full_taxonomy_corpus/06_LDoS_B/expected_classification.json",
        "kind": "expected",
        "role": "Expected classification",
        "size": 253
      },
      {
        "name": "ldos_b_single_source_periodic_low_rate.pcap",
        "path": "examples/full_taxonomy_corpus/06_LDoS_B/ldos_b_single_source_periodic_low_rate.pcap",
        "kind": "pcap",
        "role": "Packet capture",
        "size": 6324
      },
      {
        "name": "result_06_ldos_b.json",
        "path": "examples/full_taxonomy_corpus/06_LDoS_B/result_06_ldos_b.json",
        "kind": "result",
        "role": "Precomputed D-ACT output",
        "size": 1425
      }
    ]
  },
  {
    "id": "07_LDDoS_A",
    "label": "07 LDDoS A",
    "attackClass": "LDDoS",
    "expectedConditions": [
      "C0",
      "C2",
      "C3"
    ],
    "notes": "Multiple sources with low-rate periodic traffic. This supports distributed low-rate denial classification.",
    "plainEnglish": "Multiple sources with low-rate periodic traffic. This supports distributed low-rate denial classification.",
    "folder": "examples/full_taxonomy_corpus/07_LDDoS_A/",
    "files": [
      {
        "name": "README.md",
        "path": "examples/full_taxonomy_corpus/07_LDDoS_A/README.md",
        "kind": "readme",
        "role": "Scenario notes",
        "size": 697
      },
      {
        "name": "expected_classification.json",
        "path": "examples/full_taxonomy_corpus/07_LDDoS_A/expected_classification.json",
        "kind": "expected",
        "role": "Expected classification",
        "size": 254
      },
      {
        "name": "lddos_a_distributed_periodic_low_rate.pcap",
        "path": "examples/full_taxonomy_corpus/07_LDDoS_A/lddos_a_distributed_periodic_low_rate.pcap",
        "kind": "pcap",
        "role": "Packet capture",
        "size": 6744
      },
      {
        "name": "result_07_lddos_a.json",
        "path": "examples/full_taxonomy_corpus/07_LDDoS_A/result_07_lddos_a.json",
        "kind": "result",
        "role": "Precomputed D-ACT output",
        "size": 1442
      }
    ]
  },
  {
    "id": "08_LDDoS_B",
    "label": "08 LDDoS B",
    "attackClass": "LDDoS",
    "expectedConditions": [
      "C0",
      "C2",
      "C3"
    ],
    "notes": "Multiple sources with low-rate periodic traffic. This supports distributed low-rate denial classification.",
    "plainEnglish": "Multiple sources with low-rate periodic traffic. This supports distributed low-rate denial classification.",
    "folder": "examples/full_taxonomy_corpus/08_LDDoS_B/",
    "files": [
      {
        "name": "README.md",
        "path": "examples/full_taxonomy_corpus/08_LDDoS_B/README.md",
        "kind": "readme",
        "role": "Scenario notes",
        "size": 697
      },
      {
        "name": "expected_classification.json",
        "path": "examples/full_taxonomy_corpus/08_LDDoS_B/expected_classification.json",
        "kind": "expected",
        "role": "Expected classification",
        "size": 254
      },
      {
        "name": "lddos_b_distributed_periodic_low_rate.pcap",
        "path": "examples/full_taxonomy_corpus/08_LDDoS_B/lddos_b_distributed_periodic_low_rate.pcap",
        "kind": "pcap",
        "role": "Packet capture",
        "size": 7864
      },
      {
        "name": "result_08_lddos_b.json",
        "path": "examples/full_taxonomy_corpus/08_LDDoS_B/result_08_lddos_b.json",
        "kind": "result",
        "role": "Precomputed D-ACT output",
        "size": 1457
      }
    ]
  },
  {
    "id": "09_EDoS_S_A",
    "label": "09 EDoS S A",
    "attackClass": "EDoS_S",
    "expectedConditions": [
      "C0",
      "C1",
      "C4"
    ],
    "notes": "Single-source high-rate traffic combined with cloud autoscaling or chargeable cloud consumption. This tests the source-neutral EDoS_S branch.",
    "plainEnglish": "Single-source high-rate traffic combined with cloud autoscaling or chargeable cloud consumption. This tests the source-neutral EDoS_S branch.",
    "folder": "examples/full_taxonomy_corpus/09_EDoS_S_A/",
    "files": [
      {
        "name": "README.md",
        "path": "examples/full_taxonomy_corpus/09_EDoS_S_A/README.md",
        "kind": "readme",
        "role": "Scenario notes",
        "size": 827
      },
      {
        "name": "edos_s_a_cloud_billing.csv",
        "path": "examples/full_taxonomy_corpus/09_EDoS_S_A/edos_s_a_cloud_billing.csv",
        "kind": "cloud",
        "role": "Cloud billing/telemetry log",
        "size": 231
      },
      {
        "name": "edos_s_a_single_source_cloud.pcap",
        "path": "examples/full_taxonomy_corpus/09_EDoS_S_A/edos_s_a_single_source_cloud.pcap",
        "kind": "pcap",
        "role": "Packet capture",
        "size": 5764
      },
      {
        "name": "expected_classification.json",
        "path": "examples/full_taxonomy_corpus/09_EDoS_S_A/expected_classification.json",
        "kind": "expected",
        "role": "Expected classification",
        "size": 281
      },
      {
        "name": "result_09_edos_s_a.json",
        "path": "examples/full_taxonomy_corpus/09_EDoS_S_A/result_09_edos_s_a.json",
        "kind": "result",
        "role": "Precomputed D-ACT output",
        "size": 1475
      }
    ]
  },
  {
    "id": "10_EDoS_S_B",
    "label": "10 EDoS S B",
    "attackClass": "EDoS_S",
    "expectedConditions": [
      "C0",
      "C1",
      "C4"
    ],
    "notes": "Single-source high-rate traffic combined with cloud autoscaling or chargeable cloud consumption. This tests the source-neutral EDoS_S branch.",
    "plainEnglish": "Single-source high-rate traffic combined with cloud autoscaling or chargeable cloud consumption. This tests the source-neutral EDoS_S branch.",
    "folder": "examples/full_taxonomy_corpus/10_EDoS_S_B/",
    "files": [
      {
        "name": "README.md",
        "path": "examples/full_taxonomy_corpus/10_EDoS_S_B/README.md",
        "kind": "readme",
        "role": "Scenario notes",
        "size": 827
      },
      {
        "name": "edos_s_b_cloud_billing.csv",
        "path": "examples/full_taxonomy_corpus/10_EDoS_S_B/edos_s_b_cloud_billing.csv",
        "kind": "cloud",
        "role": "Cloud billing/telemetry log",
        "size": 151
      },
      {
        "name": "edos_s_b_single_source_cloud.pcap",
        "path": "examples/full_taxonomy_corpus/10_EDoS_S_B/edos_s_b_single_source_cloud.pcap",
        "kind": "pcap",
        "role": "Packet capture",
        "size": 6324
      },
      {
        "name": "expected_classification.json",
        "path": "examples/full_taxonomy_corpus/10_EDoS_S_B/expected_classification.json",
        "kind": "expected",
        "role": "Expected classification",
        "size": 281
      },
      {
        "name": "result_10_edos_s_b.json",
        "path": "examples/full_taxonomy_corpus/10_EDoS_S_B/result_10_edos_s_b.json",
        "kind": "result",
        "role": "Precomputed D-ACT output",
        "size": 1474
      }
    ]
  },
  {
    "id": "11_EDoS_D_A",
    "label": "11 EDoS D A",
    "attackClass": "EDoS_D",
    "expectedConditions": [
      "C0",
      "C2",
      "C4"
    ],
    "notes": "Distributed high-rate traffic combined with cloud autoscaling or chargeable cloud consumption. This tests EDoS_D.",
    "plainEnglish": "Distributed high-rate traffic combined with cloud autoscaling or chargeable cloud consumption. This tests EDoS_D.",
    "folder": "examples/full_taxonomy_corpus/11_EDoS_D_A/",
    "files": [
      {
        "name": "README.md",
        "path": "examples/full_taxonomy_corpus/11_EDoS_D_A/README.md",
        "kind": "readme",
        "role": "Scenario notes",
        "size": 795
      },
      {
        "name": "edos_d_a_cloud_billing.csv",
        "path": "examples/full_taxonomy_corpus/11_EDoS_D_A/edos_d_a_cloud_billing.csv",
        "kind": "cloud",
        "role": "Cloud billing/telemetry log",
        "size": 231
      },
      {
        "name": "edos_d_a_distributed_cloud.pcap",
        "path": "examples/full_taxonomy_corpus/11_EDoS_D_A/edos_d_a_distributed_cloud.pcap",
        "kind": "pcap",
        "role": "Packet capture",
        "size": 11224
      },
      {
        "name": "expected_classification.json",
        "path": "examples/full_taxonomy_corpus/11_EDoS_D_A/expected_classification.json",
        "kind": "expected",
        "role": "Expected classification",
        "size": 279
      },
      {
        "name": "result_11_edos_d_a.json",
        "path": "examples/full_taxonomy_corpus/11_EDoS_D_A/result_11_edos_d_a.json",
        "kind": "result",
        "role": "Precomputed D-ACT output",
        "size": 1461
      }
    ]
  },
  {
    "id": "12_EDoS_D_B",
    "label": "12 EDoS D B",
    "attackClass": "EDoS_D",
    "expectedConditions": [
      "C0",
      "C2",
      "C4"
    ],
    "notes": "Distributed high-rate traffic combined with cloud autoscaling or chargeable cloud consumption. This tests EDoS_D.",
    "plainEnglish": "Distributed high-rate traffic combined with cloud autoscaling or chargeable cloud consumption. This tests EDoS_D.",
    "folder": "examples/full_taxonomy_corpus/12_EDoS_D_B/",
    "files": [
      {
        "name": "README.md",
        "path": "examples/full_taxonomy_corpus/12_EDoS_D_B/README.md",
        "kind": "readme",
        "role": "Scenario notes",
        "size": 795
      },
      {
        "name": "edos_d_b_cloud_billing.csv",
        "path": "examples/full_taxonomy_corpus/12_EDoS_D_B/edos_d_b_cloud_billing.csv",
        "kind": "cloud",
        "role": "Cloud billing/telemetry log",
        "size": 311
      },
      {
        "name": "edos_d_b_distributed_cloud.pcap",
        "path": "examples/full_taxonomy_corpus/12_EDoS_D_B/edos_d_b_distributed_cloud.pcap",
        "kind": "pcap",
        "role": "Packet capture",
        "size": 12624
      },
      {
        "name": "expected_classification.json",
        "path": "examples/full_taxonomy_corpus/12_EDoS_D_B/expected_classification.json",
        "kind": "expected",
        "role": "Expected classification",
        "size": 279
      },
      {
        "name": "result_12_edos_d_b.json",
        "path": "examples/full_taxonomy_corpus/12_EDoS_D_B/result_12_edos_d_b.json",
        "kind": "result",
        "role": "Precomputed D-ACT output",
        "size": 1458
      }
    ]
  },
  {
    "id": "13_DoW_A",
    "label": "13 DoW A",
    "attackClass": "DoW",
    "expectedConditions": [
      "C0",
      "C1",
      "C4",
      "C5"
    ],
    "notes": "Single-source cloud and serverless billing evidence. This should be classified as DoW, inheriting DoS and EDoS_S.",
    "plainEnglish": "Single-source cloud and serverless billing evidence. This should be classified as DoW, inheriting DoS and EDoS_S.",
    "folder": "examples/full_taxonomy_corpus/13_DoW_A/",
    "files": [
      {
        "name": "README.md",
        "path": "examples/full_taxonomy_corpus/13_DoW_A/README.md",
        "kind": "readme",
        "role": "Scenario notes",
        "size": 905
      },
      {
        "name": "dow_a_cloud_billing.csv",
        "path": "examples/full_taxonomy_corpus/13_DoW_A/dow_a_cloud_billing.csv",
        "kind": "cloud",
        "role": "Cloud billing/telemetry log",
        "size": 148
      },
      {
        "name": "dow_a_serverless_invocations.csv",
        "path": "examples/full_taxonomy_corpus/13_DoW_A/dow_a_serverless_invocations.csv",
        "kind": "serverless",
        "role": "Serverless invocation log",
        "size": 159
      },
      {
        "name": "dow_a_single_source_serverless.pcap",
        "path": "examples/full_taxonomy_corpus/13_DoW_A/dow_a_single_source_serverless.pcap",
        "kind": "pcap",
        "role": "Packet capture",
        "size": 5904
      },
      {
        "name": "expected_classification.json",
        "path": "examples/full_taxonomy_corpus/13_DoW_A/expected_classification.json",
        "kind": "expected",
        "role": "Expected classification",
        "size": 324
      },
      {
        "name": "result_13_dow_a.json",
        "path": "examples/full_taxonomy_corpus/13_DoW_A/result_13_dow_a.json",
        "kind": "result",
        "role": "Precomputed D-ACT output",
        "size": 1668
      }
    ]
  },
  {
    "id": "14_DoW_B",
    "label": "14 DoW B",
    "attackClass": "DoW",
    "expectedConditions": [
      "C0",
      "C1",
      "C4",
      "C5"
    ],
    "notes": "Single-source cloud and serverless billing evidence. This should be classified as DoW, inheriting DoS and EDoS_S.",
    "plainEnglish": "Single-source cloud and serverless billing evidence. This should be classified as DoW, inheriting DoS and EDoS_S.",
    "folder": "examples/full_taxonomy_corpus/14_DoW_B/",
    "files": [
      {
        "name": "README.md",
        "path": "examples/full_taxonomy_corpus/14_DoW_B/README.md",
        "kind": "readme",
        "role": "Scenario notes",
        "size": 905
      },
      {
        "name": "dow_b_cloud_billing.csv",
        "path": "examples/full_taxonomy_corpus/14_DoW_B/dow_b_cloud_billing.csv",
        "kind": "cloud",
        "role": "Cloud billing/telemetry log",
        "size": 148
      },
      {
        "name": "dow_b_serverless_invocations.csv",
        "path": "examples/full_taxonomy_corpus/14_DoW_B/dow_b_serverless_invocations.csv",
        "kind": "serverless",
        "role": "Serverless invocation log",
        "size": 159
      },
      {
        "name": "dow_b_single_source_serverless.pcap",
        "path": "examples/full_taxonomy_corpus/14_DoW_B/dow_b_single_source_serverless.pcap",
        "kind": "pcap",
        "role": "Packet capture",
        "size": 6464
      },
      {
        "name": "expected_classification.json",
        "path": "examples/full_taxonomy_corpus/14_DoW_B/expected_classification.json",
        "kind": "expected",
        "role": "Expected classification",
        "size": 324
      },
      {
        "name": "result_14_dow_b.json",
        "path": "examples/full_taxonomy_corpus/14_DoW_B/result_14_dow_b.json",
        "kind": "result",
        "role": "Precomputed D-ACT output",
        "size": 1668
      }
    ]
  },
  {
    "id": "15_DDoW_A",
    "label": "15 DDoW A",
    "attackClass": "DDoW",
    "expectedConditions": [
      "C0",
      "C2",
      "C4",
      "C5"
    ],
    "notes": "Distributed cloud and serverless billing evidence. This should be classified as DDoW.",
    "plainEnglish": "Distributed cloud and serverless billing evidence. This should be classified as DDoW.",
    "folder": "examples/full_taxonomy_corpus/15_DDoW_A/",
    "files": [
      {
        "name": "README.md",
        "path": "examples/full_taxonomy_corpus/15_DDoW_A/README.md",
        "kind": "readme",
        "role": "Scenario notes",
        "size": 886
      },
      {
        "name": "ddow_a_cloud_billing.csv",
        "path": "examples/full_taxonomy_corpus/15_DDoW_A/ddow_a_cloud_billing.csv",
        "kind": "cloud",
        "role": "Cloud billing/telemetry log",
        "size": 227
      },
      {
        "name": "ddow_a_distributed_serverless.pcap",
        "path": "examples/full_taxonomy_corpus/15_DDoW_A/ddow_a_distributed_serverless.pcap",
        "kind": "pcap",
        "role": "Packet capture",
        "size": 11224
      },
      {
        "name": "ddow_a_serverless_invocations.csv",
        "path": "examples/full_taxonomy_corpus/15_DDoW_A/ddow_a_serverless_invocations.csv",
        "kind": "serverless",
        "role": "Serverless invocation log",
        "size": 160
      },
      {
        "name": "expected_classification.json",
        "path": "examples/full_taxonomy_corpus/15_DDoW_A/expected_classification.json",
        "kind": "expected",
        "role": "Expected classification",
        "size": 327
      },
      {
        "name": "result_15_ddow_a.json",
        "path": "examples/full_taxonomy_corpus/15_DDoW_A/result_15_ddow_a.json",
        "kind": "result",
        "role": "Precomputed D-ACT output",
        "size": 1670
      }
    ]
  },
  {
    "id": "16_DDoW_B",
    "label": "16 DDoW B",
    "attackClass": "DDoW",
    "expectedConditions": [
      "C0",
      "C2",
      "C4",
      "C5"
    ],
    "notes": "Distributed cloud and serverless billing evidence. This should be classified as DDoW.",
    "plainEnglish": "Distributed cloud and serverless billing evidence. This should be classified as DDoW.",
    "folder": "examples/full_taxonomy_corpus/16_DDoW_B/",
    "files": [
      {
        "name": "README.md",
        "path": "examples/full_taxonomy_corpus/16_DDoW_B/README.md",
        "kind": "readme",
        "role": "Scenario notes",
        "size": 886
      },
      {
        "name": "ddow_b_cloud_billing.csv",
        "path": "examples/full_taxonomy_corpus/16_DDoW_B/ddow_b_cloud_billing.csv",
        "kind": "cloud",
        "role": "Cloud billing/telemetry log",
        "size": 227
      },
      {
        "name": "ddow_b_distributed_serverless.pcap",
        "path": "examples/full_taxonomy_corpus/16_DDoW_B/ddow_b_distributed_serverless.pcap",
        "kind": "pcap",
        "role": "Packet capture",
        "size": 12974
      },
      {
        "name": "ddow_b_serverless_invocations.csv",
        "path": "examples/full_taxonomy_corpus/16_DDoW_B/ddow_b_serverless_invocations.csv",
        "kind": "serverless",
        "role": "Serverless invocation log",
        "size": 162
      },
      {
        "name": "expected_classification.json",
        "path": "examples/full_taxonomy_corpus/16_DDoW_B/expected_classification.json",
        "kind": "expected",
        "role": "Expected classification",
        "size": 327
      },
      {
        "name": "result_16_ddow_b.json",
        "path": "examples/full_taxonomy_corpus/16_DDoW_B/result_16_ddow_b.json",
        "kind": "result",
        "role": "Precomputed D-ACT output",
        "size": 1686
      }
    ]
  },
  {
    "id": "17_DoA_A",
    "label": "17 DoA A",
    "attackClass": "DoA",
    "expectedConditions": [
      "C0",
      "C6"
    ],
    "notes": "AI usage log only. No traffic source evidence is provided, so the expected parent-level classification is DoA rather than a source-specific DoA subclass.",
    "plainEnglish": "AI usage log only. No traffic source evidence is provided, so the expected parent-level classification is DoA rather than a source-specific DoA subclass.",
    "folder": "examples/full_taxonomy_corpus/17_DoA_A/",
    "files": [
      {
        "name": "README.md",
        "path": "examples/full_taxonomy_corpus/17_DoA_A/README.md",
        "kind": "readme",
        "role": "Scenario notes",
        "size": 680
      },
      {
        "name": "doa_a_ai_usage.csv",
        "path": "examples/full_taxonomy_corpus/17_DoA_A/doa_a_ai_usage.csv",
        "kind": "ai",
        "role": "AI usage log",
        "size": 220
      },
      {
        "name": "expected_classification.json",
        "path": "examples/full_taxonomy_corpus/17_DoA_A/expected_classification.json",
        "kind": "expected",
        "role": "Expected classification",
        "size": 216
      },
      {
        "name": "result_17_doa_a.json",
        "path": "examples/full_taxonomy_corpus/17_DoA_A/result_17_doa_a.json",
        "kind": "result",
        "role": "Precomputed D-ACT output",
        "size": 1268
      }
    ]
  },
  {
    "id": "18_DoA_B",
    "label": "18 DoA B",
    "attackClass": "DoA",
    "expectedConditions": [
      "C0",
      "C6"
    ],
    "notes": "AI usage log only. No traffic source evidence is provided, so the expected parent-level classification is DoA rather than a source-specific DoA subclass.",
    "plainEnglish": "AI usage log only. No traffic source evidence is provided, so the expected parent-level classification is DoA rather than a source-specific DoA subclass.",
    "folder": "examples/full_taxonomy_corpus/18_DoA_B/",
    "files": [
      {
        "name": "README.md",
        "path": "examples/full_taxonomy_corpus/18_DoA_B/README.md",
        "kind": "readme",
        "role": "Scenario notes",
        "size": 680
      },
      {
        "name": "doa_b_ai_usage.csv",
        "path": "examples/full_taxonomy_corpus/18_DoA_B/doa_b_ai_usage.csv",
        "kind": "ai",
        "role": "AI usage log",
        "size": 219
      },
      {
        "name": "expected_classification.json",
        "path": "examples/full_taxonomy_corpus/18_DoA_B/expected_classification.json",
        "kind": "expected",
        "role": "Expected classification",
        "size": 216
      },
      {
        "name": "result_18_doa_b.json",
        "path": "examples/full_taxonomy_corpus/18_DoA_B/result_18_doa_b.json",
        "kind": "result",
        "role": "Precomputed D-ACT output",
        "size": 1266
      }
    ]
  },
  {
    "id": "19_No_Denial_Negative_Control",
    "label": "19 No Denial Negative Control",
    "attackClass": "Unclassified",
    "expectedConditions": [],
    "notes": "Negative-control PCAP: fewer than 50 traffic events, five balanced sources, no dominant source, and no complete denial condition set.",
    "plainEnglish": "Shows that D-ACT does not force a denial classification when evidence is insufficient.",
    "folder": "examples/full_taxonomy_corpus/19_No_Denial_Negative_Control/",
    "files": [
      {
        "name": "README.md",
        "path": "examples/full_taxonomy_corpus/19_No_Denial_Negative_Control/README.md",
        "kind": "readme",
        "role": "Scenario notes",
        "size": 775
      },
      {
        "name": "expected_classification.json",
        "path": "examples/full_taxonomy_corpus/19_No_Denial_Negative_Control/expected_classification.json",
        "kind": "expected",
        "role": "Expected classification",
        "size": 294
      },
      {
        "name": "no_denial_negative_control.pcap",
        "path": "examples/full_taxonomy_corpus/19_No_Denial_Negative_Control/no_denial_negative_control.pcap",
        "kind": "pcap",
        "role": "Packet capture",
        "size": 1424
      },
      {
        "name": "result_19_no_denial_negative_control.json",
        "path": "examples/full_taxonomy_corpus/19_No_Denial_Negative_Control/result_19_no_denial_negative_control.json",
        "kind": "result",
        "role": "Precomputed D-ACT output",
        "size": 944
      }
    ]
  }
];
