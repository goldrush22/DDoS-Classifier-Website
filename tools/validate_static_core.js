#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const DactCore = require('../assets/dact-core.js');

function readText(p) { return fs.readFileSync(p, 'utf8'); }
function readBufferAsArrayBuffer(p) {
  const b = fs.readFileSync(p);
  return b.buffer.slice(b.byteOffset, b.byteOffset + b.byteLength);
}
function rowsCsv(p) { return DactCore.parseCsv(readText(p)); }
function pcap(p) { return DactCore.parsePcap(readBufferAsArrayBuffer(p)); }

const root = path.join(__dirname, '..', 'examples', 'synthetic_artefacts');
const scenarios = [
  {
    id: 'S2_DDoS',
    expected: 'DDoS',
    inputs: { pcapRecords: pcap(path.join(root, 'S2_DDoS', 's2_ddos_multi_source.pcap')) }
  },
  {
    id: 'S7_DoW',
    expected: 'DoW',
    inputs: {
      pcapRecords: pcap(path.join(root, 'S7_DoW', 's7_dow_single_source.pcap')),
      cloudRows: rowsCsv(path.join(root, 'S7_DoW', 's7_cloud_billing.csv')),
      serverlessRows: rowsCsv(path.join(root, 'S7_DoW', 's7_serverless_invocations.csv'))
    }
  },
  {
    id: 'S9_DoA',
    expected: 'DoA',
    inputs: { aiRows: rowsCsv(path.join(root, 'S9_DoA', 's9_ai_usage.csv')) }
  },
  {
    id: 'S12_Recursive_DoA',
    expected: 'Recursive_DoA',
    inputs: {
      pcapRecords: pcap(path.join(root, 'S12_Recursive_DoA', 's12_recursive_low_rate.pcap')),
      aiRows: rowsCsv(path.join(root, 'S12_Recursive_DoA', 's12_ai_agent_loop.csv'))
    }
  },
  {
    id: 'S13_Serverless_DoA',
    expected: 'Serverless_DoA',
    inputs: {
      pcapRecords: pcap(path.join(root, 'S13_Serverless_DoA', 's13_serverless_doa_single_source.pcap')),
      cloudRows: rowsCsv(path.join(root, 'S13_Serverless_DoA', 's13_cloud_billing.csv')),
      serverlessRows: rowsCsv(path.join(root, 'S13_Serverless_DoA', 's13_serverless_invocations.csv')),
      aiRows: rowsCsv(path.join(root, 'S13_Serverless_DoA', 's13_ai_usage.csv'))
    }
  }
];

const summary = [];
let ok = true;
for (const scenario of scenarios) {
  const result = DactCore.analyse(scenario.inputs);
  const pass = result.primary_classification === scenario.expected;
  if (!pass) ok = false;
  summary.push({
    scenario: scenario.id,
    expected: scenario.expected,
    actual: result.primary_classification,
    conditions: result.observed_conditions.join(';'),
    pass
  });
}

console.table(summary);
fs.writeFileSync(path.join(__dirname, '..', 'STATIC_VALIDATION_RESULTS.json'), JSON.stringify(summary, null, 2));
if (!ok) process.exit(1);
