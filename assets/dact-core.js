/*
D-ACT Browser Core
Client-side JavaScript implementation of the C0-C6 Denial Attack Classification Tool.
This file is dependency-free for CSV, JSON and classic Ethernet/IPv4 PCAP inputs.
Excel parsing is handled in app.js via SheetJS when available.
*/
(function (root, factory) {
  if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.DactCore = factory();
  }
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  const DEFAULT_THRESHOLDS = {
    min_events_for_c0: 50,
    single_source_dominance: 0.85,
    multi_source_min: 10,
    low_rate_max_events_per_second: 2.0,
    periodicity_cv_threshold: 0.35,
    cloud_cost_increase_threshold: 1.50,
    cloud_scale_event_min: 1,
    serverless_invocation_min: 100,
    serverless_duration_ms_min: 10000,
    ai_token_min: 50000,
    ai_model_call_min: 100,
    ai_tool_call_min: 25,
    ai_agent_iteration_min: 20,
    ai_context_tokens_min: 25000
  };

  const TAXONOMY_RULES = {
    DoS: ['C0', 'C1'],
    DDoS: ['C0', 'C2'],
    LDoS: ['C0', 'C1', 'C3'],
    LDDoS: ['C0', 'C2', 'C3'],
    EDoS_S: ['C0', 'C1', 'C4'],
    EDoS_D: ['C0', 'C2', 'C4'],
    DoW: ['C0', 'C1', 'C4', 'C5'],
    DDoW: ['C0', 'C2', 'C4', 'C5'],
    DoA: ['C0', 'C6'],
    Internal_or_Single_Source_DoA: ['C0', 'C1', 'C6'],
    Distributed_DoA: ['C0', 'C2', 'C6'],
    Low_Rate_DoA: ['C0', 'C1', 'C3', 'C6'],
    Low_Rate_Distributed_DoA: ['C0', 'C2', 'C3', 'C6'],
    Cloud_Hosted_DoA: ['C0', 'C4', 'C6'],
    Serverless_DoA: ['C0', 'C1', 'C4', 'C5', 'C6'],
    Distributed_Serverless_DoA: ['C0', 'C2', 'C4', 'C5', 'C6'],
    Recursive_DoA: ['C0', 'C1', 'C3', 'C6']
  };

  const CONDITIONS = {
    C0: 'Malicious, abusive, anomalous, or uncontrolled denial-relevant activity exists.',
    C1: 'Activity originates from one dominant source, account, client, process, key, or origin.',
    C2: 'Activity originates from multiple sources, clients, accounts, bots, keys, or origins.',
    C3: 'Activity exhibits low-rate, periodic, stealthy, or low-visibility behaviour.',
    C4: 'Activity targets scalable cloud infrastructure or chargeable cloud-resource consumption.',
    C5: 'Activity triggers serverless invocation, FaaS execution, event chaining, or granular billing.',
    C6: 'Activity targets AI inference, model-serving, tokens, context, tools, multimodal generation, or agentic execution.'
  };

  function asFloat(value, fallback = 0.0) {
    if (value === null || value === undefined || value === '') return fallback;
    const n = Number(value);
    return Number.isFinite(n) ? n : fallback;
  }

  function asInt(value, fallback = 0) {
    const n = asFloat(value, NaN);
    return Number.isFinite(n) ? Math.trunc(n) : fallback;
  }

  function normaliseRow(row) {
    const out = {};
    for (const [k, v] of Object.entries(row || {})) {
      out[String(k).trim().toLowerCase()] = v;
    }
    return out;
  }

  function firstPresent(row, names, fallback = null) {
    const r = normaliseRow(row);
    for (const name of names) {
      const key = String(name).toLowerCase();
      if (Object.prototype.hasOwnProperty.call(r, key)) return r[key];
    }
    return fallback;
  }

  function parseCsv(text) {
    if (!text || !text.trim()) return [];
    const rows = [];
    let row = [];
    let field = '';
    let inQuotes = false;

    for (let i = 0; i < text.length; i++) {
      const ch = text[i];
      const next = text[i + 1];

      if (ch === '"') {
        if (inQuotes && next === '"') {
          field += '"';
          i++;
        } else {
          inQuotes = !inQuotes;
        }
      } else if (ch === ',' && !inQuotes) {
        row.push(field);
        field = '';
      } else if ((ch === '\n' || ch === '\r') && !inQuotes) {
        if (ch === '\r' && next === '\n') i++;
        row.push(field);
        field = '';
        if (row.some(cell => String(cell).trim() !== '')) rows.push(row);
        row = [];
      } else {
        field += ch;
      }
    }
    row.push(field);
    if (row.some(cell => String(cell).trim() !== '')) rows.push(row);

    if (rows.length === 0) return [];
    const headers = rows[0].map(h => String(h).replace(/^\uFEFF/, '').trim());
    return rows.slice(1).map(values => {
      const obj = {};
      headers.forEach((header, idx) => {
        obj[header] = values[idx] !== undefined ? values[idx] : '';
      });
      return obj;
    });
  }

  function parseJsonTable(text) {
    const data = JSON.parse(text);
    if (Array.isArray(data)) return data;
    if (data && typeof data === 'object') {
      for (const key of ['events', 'records', 'logs', 'data']) {
        if (Array.isArray(data[key])) return data[key];
      }
      return [data];
    }
    return [];
  }

  function ipFromBytes(bytes, offset) {
    return [bytes[offset], bytes[offset + 1], bytes[offset + 2], bytes[offset + 3]].join('.');
  }

  function parseIpv4FromEthernet(frame) {
    if (frame.length < 34) return null;
    const ethType = (frame[12] << 8) | frame[13];
    if (ethType !== 0x0800) return null;

    const ipOffset = 14;
    const versionIhl = frame[ipOffset];
    const version = versionIhl >> 4;
    const ihl = (versionIhl & 0x0f) * 4;
    if (version !== 4 || frame.length < ipOffset + ihl) return null;

    const proto = frame[ipOffset + 9];
    const src = ipFromBytes(frame, ipOffset + 12);
    const dst = ipFromBytes(frame, ipOffset + 16);
    let srcPort = null;
    let dstPort = null;
    if ((proto === 6 || proto === 17) && frame.length >= ipOffset + ihl + 4) {
      const p = ipOffset + ihl;
      srcPort = (frame[p] << 8) | frame[p + 1];
      dstPort = (frame[p + 2] << 8) | frame[p + 3];
    }
    return { src_ip: src, dst_ip: dst, protocol: proto, src_port: srcPort, dst_port: dstPort };
  }

  function parsePcap(arrayBuffer) {
    const bytes = new Uint8Array(arrayBuffer);
    if (bytes.length < 24) throw new Error('Unsupported or truncated PCAP file.');

    const b0 = bytes[0], b1 = bytes[1], b2 = bytes[2], b3 = bytes[3];
    let littleEndian;
    if (b0 === 0xd4 && b1 === 0xc3 && b2 === 0xb2 && b3 === 0xa1) littleEndian = true;
    else if (b0 === 0xa1 && b1 === 0xb2 && b2 === 0xc3 && b3 === 0xd4) littleEndian = false;
    else if (b0 === 0x4d && b1 === 0x3c && b2 === 0xb2 && b3 === 0xa1) littleEndian = true;
    else if (b0 === 0xa1 && b1 === 0xb2 && b2 === 0x3c && b3 === 0x4d) littleEndian = false;
    else throw new Error('Unsupported PCAP magic header. Convert PCAPNG to classic PCAP first.');

    const view = new DataView(arrayBuffer);
    let offset = 24;
    const records = [];

    while (offset + 16 <= bytes.length) {
      const tsSec = view.getUint32(offset, littleEndian);
      const tsUsec = view.getUint32(offset + 4, littleEndian);
      const inclLen = view.getUint32(offset + 8, littleEndian);
      const origLen = view.getUint32(offset + 12, littleEndian);
      offset += 16;
      if (offset + inclLen > bytes.length) break;
      const frame = bytes.slice(offset, offset + inclLen);
      offset += inclLen;

      const parsed = parseIpv4FromEthernet(frame);
      if (parsed) {
        parsed.timestamp = tsSec + (tsUsec / 1000000.0);
        parsed.length = origLen;
        records.push(parsed);
      }
    }
    return records;
  }

  function mean(arr) {
    if (!arr.length) return 0;
    return arr.reduce((a, b) => a + b, 0) / arr.length;
  }

  function pstdev(arr) {
    if (!arr.length) return 0;
    const m = mean(arr);
    return Math.sqrt(arr.reduce((acc, x) => acc + Math.pow(x - m, 2), 0) / arr.length);
  }

  function trafficFeatures(pcapRecords = [], flowRows = []) {
    const sources = [];
    const timestamps = [];
    let events = 0;

    for (const r of pcapRecords) {
      events += 1;
      if (r.src_ip) sources.push(String(r.src_ip));
      if (r.timestamp !== undefined) timestamps.push(asFloat(r.timestamp));
    }

    for (const row of flowRows) {
      events += 1;
      const src = firstPresent(row, ['src_ip', 'source_ip', 'client_ip', 'ip', 'source']);
      const ts = firstPresent(row, ['timestamp', 'time', 'ts']);
      if (src !== null && src !== undefined && src !== '') sources.push(String(src));
      if (ts !== null && ts !== undefined && ts !== '') timestamps.push(asFloat(ts));
    }

    const counts = new Map();
    for (const s of sources) counts.set(s, (counts.get(s) || 0) + 1);
    const uniqueSources = counts.size;
    let dominantRatio = 0.0;
    if (counts.size > 0) {
      const maxCount = Math.max(...Array.from(counts.values()));
      dominantRatio = maxCount / Math.max(1, sources.length);
    }

    let duration = 0.0;
    let eps = 0.0;
    let periodicityCv = null;
    if (timestamps.length >= 2) {
      timestamps.sort((a, b) => a - b);
      duration = Math.max(0, timestamps[timestamps.length - 1] - timestamps[0]);
      if (duration > 0) eps = timestamps.length / duration;
      const intervals = [];
      for (let i = 1; i < timestamps.length; i++) {
        const d = timestamps[i] - timestamps[i - 1];
        if (d >= 0) intervals.push(d);
      }
      if (intervals.length >= 2) {
        const mi = mean(intervals);
        if (mi > 0) periodicityCv = pstdev(intervals) / mi;
      }
    }

    return {
      traffic_events: events,
      unique_sources: uniqueSources,
      dominant_source_ratio: dominantRatio,
      duration_seconds: duration,
      events_per_second: eps,
      periodicity_cv: periodicityCv
    };
  }

  function cloudFeatures(rows = []) {
    let scaleEvents = 0;
    let maxCostRatio = 0.0;
    let chargeableEvents = 0;

    for (const row of rows) {
      const eventType = String(firstPresent(row, ['event_type', 'type', 'event'], '')).toLowerCase();
      if (eventType.includes('scale') || eventType.includes('autoscale')) scaleEvents += 1;

      const before = asFloat(firstPresent(row, ['cost_before', 'baseline_cost', 'previous_cost']));
      const after = asFloat(firstPresent(row, ['cost_after', 'current_cost', 'observed_cost', 'cost']));
      if (before > 0 && after > 0) maxCostRatio = Math.max(maxCostRatio, after / before);

      const charge = asFloat(firstPresent(row, ['cost', 'charge', 'amount', 'billable_amount']));
      if (charge > 0) chargeableEvents += 1;
    }

    return {
      cloud_scale_events: scaleEvents,
      cloud_max_cost_ratio: maxCostRatio,
      cloud_chargeable_events: chargeableEvents
    };
  }

  function serverlessFeatures(rows = []) {
    let invocations = 0;
    let totalDurationMs = 0.0;
    let maxMemoryMb = 0.0;
    let chainedEvents = 0;

    for (const row of rows) {
      invocations += asInt(firstPresent(row, ['invocations', 'invocation_count', 'count']), 1);
      totalDurationMs += asFloat(firstPresent(row, ['duration_ms', 'execution_ms', 'billed_duration_ms']));
      maxMemoryMb = Math.max(maxMemoryMb, asFloat(firstPresent(row, ['memory_mb', 'memory_size', 'allocated_memory_mb'])));
      chainedEvents += asInt(firstPresent(row, ['chained_events', 'downstream_calls', 'triggered_events']));
    }

    return {
      serverless_invocations: invocations,
      serverless_total_duration_ms: totalDurationMs,
      serverless_max_memory_mb: maxMemoryMb,
      serverless_chained_events: chainedEvents
    };
  }

  function aiFeatures(rows = []) {
    let inputTokens = 0;
    let outputTokens = 0;
    let modelCalls = 0;
    let toolCalls = 0;
    let agentIterations = 0;
    let maxContextTokens = 0;
    let multimodalEvents = 0;

    for (const row of rows) {
      inputTokens += asInt(firstPresent(row, ['input_tokens', 'prompt_tokens']));
      outputTokens += asInt(firstPresent(row, ['output_tokens', 'completion_tokens']));
      modelCalls += asInt(firstPresent(row, ['model_calls', 'model_call_count', 'calls']), 1);
      toolCalls += asInt(firstPresent(row, ['tool_calls', 'function_calls', 'plugin_calls']));
      agentIterations += asInt(firstPresent(row, ['agent_iterations', 'iterations', 'loop_count']));
      maxContextTokens = Math.max(maxContextTokens, asInt(firstPresent(row, ['context_tokens', 'context_window_tokens', 'max_context_tokens'])));
      const modality = String(firstPresent(row, ['modality', 'type', 'media_type'], '')).toLowerCase();
      if (['image', 'audio', 'video', 'multimodal'].some(x => modality.includes(x))) multimodalEvents += 1;
    }

    return {
      ai_input_tokens: inputTokens,
      ai_output_tokens: outputTokens,
      ai_total_tokens: inputTokens + outputTokens,
      ai_model_calls: modelCalls,
      ai_tool_calls: toolCalls,
      ai_agent_iterations: agentIterations,
      ai_max_context_tokens: maxContextTokens,
      ai_multimodal_events: multimodalEvents
    };
  }

  function inferConditions(features, thresholds = DEFAULT_THRESHOLDS) {
    const conditions = new Set();
    const evidence = {};

    const trafficEvents = features.traffic_events || 0;
    const aiCalls = features.ai_model_calls || 0;
    const serverlessInvocations = features.serverless_invocations || 0;
    const totalEvents = trafficEvents + aiCalls + serverlessInvocations;

    if (totalEvents >= thresholds.min_events_for_c0) {
      conditions.add('C0');
      evidence.C0 = 'Anomalous, repeated, or uncontrolled request/resource activity observed.';
    }

    const uniqueSources = features.unique_sources || 0;
    const dominantRatio = features.dominant_source_ratio || 0.0;
    if (uniqueSources === 1 || dominantRatio >= thresholds.single_source_dominance) {
      conditions.add('C1');
      evidence.C1 = 'One dominant source, account, client, process, or API key observed.';
    } else if (uniqueSources >= thresholds.multi_source_min) {
      conditions.add('C2');
      evidence.C2 = 'Multiple sources, clients, accounts, or origins observed.';
    }

    const eps = features.events_per_second || 0.0;
    const pcv = features.periodicity_cv;
    if (trafficEvents >= thresholds.min_events_for_c0) {
      const lowRate = eps > 0 && eps <= thresholds.low_rate_max_events_per_second;
      const periodic = pcv !== null && pcv !== undefined && pcv <= thresholds.periodicity_cv_threshold;
      if (lowRate || periodic) {
        conditions.add('C3');
        evidence.C3 = 'Low-rate, periodic, stealthy, or low-visibility activity observed.';
      }
    }

    if ((features.cloud_scale_events || 0) >= thresholds.cloud_scale_event_min ||
        (features.cloud_max_cost_ratio || 0.0) >= thresholds.cloud_cost_increase_threshold ||
        (features.cloud_chargeable_events || 0) > 0) {
      conditions.add('C4');
      evidence.C4 = 'Cloud scaling, elastic allocation, or chargeable cloud consumption observed.';
    }

    if ((features.serverless_invocations || 0) >= thresholds.serverless_invocation_min ||
        (features.serverless_total_duration_ms || 0.0) >= thresholds.serverless_duration_ms_min ||
        (features.serverless_chained_events || 0) > 0) {
      conditions.add('C5');
      evidence.C5 = 'Serverless invocation, execution duration, or event chaining observed.';
    }

    if ((features.ai_total_tokens || 0) >= thresholds.ai_token_min ||
        (features.ai_model_calls || 0) >= thresholds.ai_model_call_min ||
        (features.ai_tool_calls || 0) >= thresholds.ai_tool_call_min ||
        (features.ai_agent_iterations || 0) >= thresholds.ai_agent_iteration_min ||
        (features.ai_max_context_tokens || 0) >= thresholds.ai_context_tokens_min ||
        (features.ai_multimodal_events || 0) > 0) {
      conditions.add('C6');
      evidence.C6 = 'AI inference, token, context, tool, multimodal, or agentic consumption observed.';
    }

    return { conditions: Array.from(conditions).sort(), evidence };
  }

  function classify(conditions) {
    const observed = new Set(conditions);
    const matched = [];
    for (const [name, required] of Object.entries(TAXONOMY_RULES)) {
      if (required.every(c => observed.has(c))) matched.push(name);
    }
    if (matched.length === 0) return { primary: 'Unclassified', inherited: [] };
    matched.sort((a, b) => {
      const lenDiff = TAXONOMY_RULES[b].length - TAXONOMY_RULES[a].length;
      return lenDiff !== 0 ? lenDiff : b.localeCompare(a);
    });
    const primary = matched.includes('Recursive_DoA') ? 'Recursive_DoA' : matched[0];
    return { primary, inherited: matched.filter(x => x !== primary) };
  }

  function buildExplanation(primary, conditions, evidence) {
    if (primary === 'Unclassified') return 'Observed evidence did not satisfy a complete taxonomy rule.';
    const parts = conditions.map(c => `${c}: ${evidence[c] || 'condition inferred'}`);
    return `${primary} inferred from conditions [${conditions.join(', ')}]. Evidence: ${parts.join(' | ')}`;
  }

  function analyse(inputs = {}, thresholds = DEFAULT_THRESHOLDS) {
    const pcapRecords = inputs.pcapRecords || [];
    const flowRows = inputs.flowRows || [];
    const cloudRows = inputs.cloudRows || [];
    const serverlessRows = inputs.serverlessRows || [];
    const aiRows = inputs.aiRows || [];

    const features = Object.assign(
      {},
      trafficFeatures(pcapRecords, flowRows),
      cloudFeatures(cloudRows),
      serverlessFeatures(serverlessRows),
      aiFeatures(aiRows)
    );
    const inferred = inferConditions(features, thresholds);
    const classification = classify(inferred.conditions);
    const explanation = buildExplanation(classification.primary, inferred.conditions, inferred.evidence);
    const absentConditions = Object.keys(CONDITIONS).filter(c => !inferred.conditions.includes(c));

    return {
      tool: 'D-ACT Browser',
      observed_conditions: inferred.conditions,
      absent_conditions: absentConditions,
      primary_classification: classification.primary,
      inherited_or_secondary_classes: classification.inherited,
      features,
      condition_evidence: inferred.evidence,
      explanation
    };
  }

  return {
    DEFAULT_THRESHOLDS,
    TAXONOMY_RULES,
    CONDITIONS,
    parseCsv,
    parseJsonTable,
    parsePcap,
    trafficFeatures,
    cloudFeatures,
    serverlessFeatures,
    aiFeatures,
    inferConditions,
    classify,
    analyse
  };
});
