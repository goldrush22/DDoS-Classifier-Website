#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const DactCore = require('../assets/dact-core.js');

function readText(p) { return fs.readFileSync(p, 'utf8'); }
function readArrayBuffer(p) {
  const b = fs.readFileSync(p);
  return b.buffer.slice(b.byteOffset, b.byteOffset + b.byteLength);
}
function readRows(p) {
  const lower = p.toLowerCase();
  if (lower.endsWith('.json')) return DactCore.parseJsonTable(readText(p));
  if (lower.endsWith('.csv')) return DactCore.parseCsv(readText(p));
  return [];
}
function classifyFileKind(name) {
  const lower = name.toLowerCase();
  if (lower.endsWith('.pcap') || lower.endsWith('.cap')) return 'pcap';
  if (lower.includes('cloud') && (lower.endsWith('.csv') || lower.endsWith('.json'))) return 'cloud';
  if (lower.includes('serverless') && (lower.endsWith('.csv') || lower.endsWith('.json'))) return 'serverless';
  if (lower.includes('ai') && (lower.endsWith('.csv') || lower.endsWith('.json'))) return 'ai';
  if (lower.endsWith('.csv') || lower.endsWith('.json')) return 'other';
  return 'other';
}

const root = path.join(__dirname, '..');
const corpusRoot = path.join(root, 'examples', 'full_taxonomy_corpus');
const scenarios = fs.readdirSync(corpusRoot).filter(x => /^\d{2}_/.test(x)).sort();
const summary = [];
let ok = true;
for (const id of scenarios) {
  const scenarioDir = path.join(corpusRoot, id);
  const expected = JSON.parse(readText(path.join(scenarioDir, 'expected_classification.json')));
  const inputs = { pcapRecords: [], flowRows: [], cloudRows: [], serverlessRows: [], aiRows: [] };
  for (const file of fs.readdirSync(scenarioDir)) {
    const f = path.join(scenarioDir, file);
    if (!fs.statSync(f).isFile()) continue;
    const kind = classifyFileKind(file);
    if (kind === 'pcap') inputs.pcapRecords.push(...DactCore.parsePcap(readArrayBuffer(f)));
    else if (kind === 'cloud') inputs.cloudRows.push(...readRows(f));
    else if (kind === 'serverless') inputs.serverlessRows.push(...readRows(f));
    else if (kind === 'ai') inputs.aiRows.push(...readRows(f));
  }
  const result = DactCore.analyse(inputs);
  const pass = result.primary_classification === expected.primary_classification;
  if (!pass) ok = false;
  summary.push({
    scenario: id,
    expected: expected.primary_classification,
    actual: result.primary_classification,
    conditions: result.observed_conditions.join(';'),
    pass
  });
}
console.table(summary);
fs.writeFileSync(path.join(root, 'FULL_CORPUS_STATIC_VALIDATION_RESULTS.json'), JSON.stringify(summary, null, 2));
if (!ok) process.exit(1);
