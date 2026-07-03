/* D-ACT mitigation strategy catalogue */
(function (root, factory) {
  if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.DactMitigations = factory();
  }
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  const MITIGATION_STRATEGIES = {
    DoS: {
      title: 'DoS mitigation',
      className: 'DoS',
      conditions: ['C0', 'C1'],
      summary: 'Single-source denial activity is best handled by rapid source containment, endpoint hardening, rate controls, and capacity protection.',
      immediate: [
        'Identify the dominant source, account, API key, client, or process responsible for the denial activity.',
        'Apply temporary blocking, throttling, CAPTCHA, authentication challenge, or access-control restriction to the offending origin.',
        'Confirm whether the targeted service is failing because of connection exhaustion, CPU pressure, memory pressure, application thread exhaustion, or queue saturation.'
      ],
      technical: [
        'Apply per-source rate limits and connection limits at the reverse proxy, web application firewall, load balancer, or API gateway.',
        'Harden timeout settings, request body limits, keep-alive settings, queue limits, and retry behaviour.',
        'Use circuit breakers and graceful degradation for expensive application endpoints.'
      ],
      monitoring: [
        'Monitor request rate, error rate, connection count, queue depth, latency, and resource saturation by source.',
        'Preserve logs and packet captures for post-incident validation and rule tuning.'
      ]
    },
    DDoS: {
      title: 'DDoS mitigation',
      className: 'DDoS',
      conditions: ['C0', 'C2'],
      summary: 'Distributed denial activity requires upstream filtering, traffic scrubbing, anycast/CDN protection, and coordinated network-layer response.',
      immediate: [
        'Confirm the distributed source pattern and identify the targeted IP, hostname, port, or application route.',
        'Engage upstream provider, CDN, DDoS protection service, or cloud provider mitigation controls.',
        'Apply emergency traffic filtering for obvious reflection, amplification, malformed, or protocol-specific patterns.'
      ],
      technical: [
        'Use CDN or anycast-based absorption for public web services.',
        'Deploy DDoS scrubbing, rate-based rules, SYN protection, connection limiting, and protocol anomaly filtering.',
        'Separate critical origin infrastructure from public exposure using private origins, allow-lists, and protected ingress.'
      ],
      monitoring: [
        'Track traffic by ASN, geography, protocol, source distribution, packet rate, request rate, and mitigation action.',
        'Record before-and-after metrics to support provider escalation and post-incident tuning.'
      ]
    },
    LDoS: {
      title: 'LDoS mitigation',
      className: 'LDoS',
      conditions: ['C0', 'C1', 'C3'],
      summary: 'Low-rate single-source denial requires detection of timing, periodicity, slow requests, and high-impact low-volume behaviour rather than volume alone.',
      immediate: [
        'Inspect request timing, inter-arrival patterns, connection duration, retry timing, and slow request behaviour from the dominant source.',
        'Apply temporary throttling or blocking to the source while preserving logs for timing analysis.',
        'Check whether the target is sensitive to periodic bursts, slow reads, slow writes, lock contention, or queue starvation.'
      ],
      technical: [
        'Use behavioural thresholds based on request duration, concurrency, periodicity, and endpoint cost, not only packets per second.',
        'Enforce minimum data rates, request timeouts, header/body completion limits, and concurrency caps.',
        'Introduce jitter-resistant anomaly detection for repeated low-volume degradation patterns.'
      ],
      monitoring: [
        'Monitor latency, queue occupancy, long-lived connections, periodic bursts, and per-source resource time.',
        'Tune alerts for degradation with low request volume.'
      ]
    },
    LDDoS: {
      title: 'LDDoS mitigation',
      className: 'LDDoS',
      conditions: ['C0', 'C2', 'C3'],
      summary: 'Low-rate distributed denial requires correlation across many sources because each source may appear individually low impact.',
      immediate: [
        'Correlate timing patterns across sources, accounts, clients, or API keys.',
        'Escalate to upstream or CDN protection if the distributed pattern affects public ingress.',
        'Apply aggregate rate limits, behavioural challenges, and endpoint-specific throttling.'
      ],
      technical: [
        'Use distributed low-rate detection based on synchronised bursts, periodicity, shared user agents, endpoint concentration, and aggregate resource impact.',
        'Deploy adaptive rate limits at API gateway, CDN, WAF, and load balancer layers.',
        'Protect expensive endpoints with queuing, caching, request shaping, and prioritisation for authenticated or trusted traffic.'
      ],
      monitoring: [
        'Monitor aggregate timing patterns, distributed source counts, low-rate bursts, and service-level degradation.',
        'Maintain source-cluster evidence for post-incident rule improvement.'
      ]
    },
    EDoS_S: {
      title: 'Single-source EDoS mitigation',
      className: 'EDoS_S',
      conditions: ['C0', 'C1', 'C4'],
      summary: 'Single-source cloud sustainability denial is mitigated by cloud cost guardrails, source throttling, autoscaling limits, and billing anomaly controls.',
      immediate: [
        'Identify the single source, account, token, client, workload, or automation responsible for cloud scaling or cost growth.',
        'Apply emergency rate limits, account suspension, key revocation, or endpoint throttling where appropriate.',
        'Inspect autoscaling, bandwidth, storage, managed-service, and database cost drivers.'
      ],
      technical: [
        'Set cloud budgets, spend alerts, service quotas, autoscaling ceilings, and per-tenant consumption limits.',
        'Use API gateway throttling and per-account metering for cost-sensitive endpoints.',
        'Add circuit breakers for endpoints that trigger expensive cloud-managed services.'
      ],
      monitoring: [
        'Monitor cost-per-source, cost-per-endpoint, scaling events, bandwidth spikes, and managed-service consumption.',
        'Alert on abnormal cost velocity, not only service outage.'
      ]
    },
    EDoS_D: {
      title: 'Distributed EDoS mitigation',
      className: 'EDoS_D',
      conditions: ['C0', 'C2', 'C4'],
      summary: 'Distributed cloud sustainability denial requires both DDoS-style traffic control and cloud cost-governance controls.',
      immediate: [
        'Confirm distributed source activity and identify the cloud resources being forced to scale or incur cost.',
        'Activate CDN, DDoS protection, WAF, and upstream filtering while also limiting cloud autoscaling exposure.',
        'Temporarily cap or isolate services that are generating abnormal cloud spend.'
      ],
      technical: [
        'Combine DDoS mitigation with cloud budgets, autoscaling ceilings, resource quotas, and workload isolation.',
        'Use caching, static offload, queue protection, and origin shielding to reduce elastic backend consumption.',
        'Apply tenant-aware or endpoint-aware throttling for costly routes and managed-service calls.'
      ],
      monitoring: [
        'Monitor traffic distribution and cloud cost velocity together.',
        'Alert on correlated increases in source count, request volume, autoscaling events, and spend.'
      ]
    },
    DoW: {
      title: 'DoW mitigation',
      className: 'DoW',
      conditions: ['C0', 'C1', 'C4', 'C5'],
      summary: 'Denial of Wallet mitigation focuses on controlling serverless invocation cost, execution duration, event chaining, and downstream billable services.',
      immediate: [
        'Identify the function, trigger, route, API key, or source generating abnormal invocation cost.',
        'Throttle, disable, or isolate the affected function or event source if cost is escalating rapidly.',
        'Inspect downstream calls, retries, queues, and event chains that may multiply billing impact.'
      ],
      technical: [
        'Set per-function concurrency limits, invocation quotas, timeout caps, memory limits, and maximum retry policies.',
        'Use API gateway authentication, request validation, and per-key rate limiting before function invocation.',
        'Add idempotency, deduplication, dead-letter queues, and event-chain depth limits.'
      ],
      monitoring: [
        'Monitor invocation count, duration, memory, cold starts, downstream calls, and cost per function.',
        'Alert on abnormal invocation velocity and abnormal cost per route or tenant.'
      ]
    },
    DDoW: {
      title: 'DDoW mitigation',
      className: 'DDoW',
      conditions: ['C0', 'C2', 'C4', 'C5'],
      summary: 'Distributed Denial of Wallet requires distributed ingress protection plus serverless cost controls and event-chain containment.',
      immediate: [
        'Confirm the distributed source pattern and the serverless functions being invoked.',
        'Activate CDN/WAF/API gateway rules before requests reach the serverless platform.',
        'Apply emergency function concurrency caps, route throttles, or temporary disablement for high-cost triggers.'
      ],
      technical: [
        'Use edge filtering, bot controls, authentication challenges, and per-ASN/per-region throttling before function execution.',
        'Configure function concurrency, timeouts, retry limits, queue limits, and event-chain controls.',
        'Separate public triggers from expensive downstream workflows using queues, validation layers, and asynchronous approval gates.'
      ],
      monitoring: [
        'Correlate source distribution with function invocation cost and downstream service usage.',
        'Alert on distributed invocation spikes, retry storms, and serverless cost velocity.'
      ]
    },
    DoA: {
      title: 'DoA mitigation',
      className: 'DoA',
      conditions: ['C0', 'C6'],
      summary: 'Denial of Artificial Intelligence mitigation requires AI-specific limits for tokens, model calls, context size, tool invocation, multimodal generation, and agentic recursion.',
      immediate: [
        'Identify the account, key, user, workflow, model, prompt pattern, tool, or agent generating abnormal AI consumption.',
        'Apply temporary token, request, model-call, tool-call, or account-level throttling.',
        'Check whether the harm is quota exhaustion, financial cost amplification, latency degradation, GPU queue pressure, or recursive execution.'
      ],
      technical: [
        'Set per-user, per-key, per-tenant, and per-workflow token budgets and model-call quotas.',
        'Limit maximum input length, output length, context-window size, tool calls, retrieval operations, multimodal generation, and agent iterations.',
        'Use budget-aware agents, recursion-depth limits, retry caps, spend ceilings, and independent watchdogs outside the agent loop.',
        'Route high-cost models behind stricter authorisation, approval, or anomaly controls.'
      ],
      monitoring: [
        'Monitor input tokens, output tokens, model calls, context size, tool calls, agent iterations, quota burn rate, and cost per key/account.',
        'Alert on abnormal token velocity, tool-call amplification, recursive loop indicators, and sudden cost escalation.'
      ]
    },
    Unclassified: {
      title: 'No complete denial class identified',
      className: 'Unclassified',
      conditions: [],
      summary: 'D-ACT did not identify a complete C0-C6 condition set. Review file quality, telemetry completeness, thresholds, and whether the evidence actually represents denial activity.',
      immediate: [
        'Confirm that the uploaded files are the correct artefacts and are not empty, corrupted, or in an unsupported format.',
        'Check whether the evidence contains enough volume, source, cloud, serverless, or AI telemetry to satisfy a complete rule.',
        'If the event is still suspicious, collect additional logs before concluding that no denial activity exists.'
      ],
      technical: [
        'Add missing evidence sources such as flow logs, cloud billing records, serverless invocation records, or AI usage logs.',
        'Review threshold settings and compare them against the expected baseline of the target environment.',
        'Use the result as a triage outcome, not proof that no attack exists.'
      ],
      monitoring: [
        'Continue monitoring if operational symptoms remain unexplained.',
        'Preserve artefacts for later analysis and repeat classification when additional logs are available.'
      ]
    }
  };

  const ALIASES = {
    Internal_or_Single_Source_DoA: 'DoA',
    Distributed_DoA: 'DoA',
    Low_Rate_DoA: 'DoA',
    Low_Rate_Distributed_DoA: 'DoA',
    Cloud_Hosted_DoA: 'DoA',
    Serverless_DoA: 'DoA',
    Distributed_Serverless_DoA: 'DoA',
    Recursive_DoA: 'DoA'
  };

  function baseClass(classification) {
    return ALIASES[classification] || classification || 'Unclassified';
  }

  function getStrategy(classification) {
    const key = baseClass(classification);
    return MITIGATION_STRATEGIES[key] || MITIGATION_STRATEGIES.Unclassified;
  }

  return {
    MITIGATION_STRATEGIES,
    ALIASES,
    baseClass,
    getStrategy
  };
});
