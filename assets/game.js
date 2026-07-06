
/* D-ACT Denial Attack Game
   Static educational game for GitHub Pages. No network traffic is generated.
   Public account/OTP/global leaderboard require a backend and are intentionally not implemented in static mode.
*/
(function () {
  'use strict';

  const CONDITIONS = {
  "C0": "Denial activity exists",
  "C1": "Single-source activity",
  "C2": "Multiple-source/distributed activity",
  "C3": "Low-rate or low-visibility behaviour",
  "C4": "Cloud-targeted sustainability exposure",
  "C5": "Serverless/FaaS exposure",
  "C6": "AI-targeted resource exposure"
};
  const ATTACK_CONDITIONS = {
  "DoS": [
    "C0",
    "C1"
  ],
  "DDoS": [
    "C0",
    "C2"
  ],
  "LDoS": [
    "C0",
    "C1",
    "C3"
  ],
  "LDDoS": [
    "C0",
    "C2",
    "C3"
  ],
  "EDoS_S": [
    "C0",
    "C1",
    "C4"
  ],
  "EDoS_D": [
    "C0",
    "C2",
    "C4"
  ],
  "DoW": [
    "C0",
    "C1",
    "C4",
    "C5"
  ],
  "DDoW": [
    "C0",
    "C2",
    "C4",
    "C5"
  ],
  "DoA": [
    "C0",
    "C6"
  ]
};
  const MITIGATIONS = {
  "DoS": "Apply per-source rate limits and harden endpoint timeouts.",
  "DDoS": "Use CDN/anycast protection, traffic scrubbing, and upstream filtering.",
  "LDoS": "Use behavioural thresholds for timing, periodicity, long requests, and low-volume degradation.",
  "LDDoS": "Correlate low-rate timing patterns across many sources and apply aggregate adaptive throttling.",
  "EDoS_S": "Set cloud budgets, spend alerts, service quotas, autoscaling ceilings, and per-tenant consumption limits.",
  "EDoS_D": "Combine DDoS filtering with cloud budgets, autoscaling ceilings, and origin shielding.",
  "DoW": "Set per-function concurrency limits, invocation quotas, timeout caps, and retry limits.",
  "DDoW": "Use edge filtering before function execution and configure concurrency, timeout, retry, and event-chain caps.",
  "DoA": "Set token budgets, model-call quotas, context limits, tool-call caps, and agent recursion limits."
};
  const QUESTION_BANK = [
  {
    "id": 1,
    "type": "multi",
    "prompt": "X wants to demonstrate DoS against Y. Click the conditions that make up DoS.",
    "answers": [
      {
        "id": "C0",
        "text": "C0 \u2014 Denial activity exists"
      },
      {
        "id": "C1",
        "text": "C1 \u2014 Single-source activity"
      },
      {
        "id": "C2",
        "text": "C2 \u2014 Multiple-source/distributed activity"
      },
      {
        "id": "C3",
        "text": "C3 \u2014 Low-rate or low-visibility behaviour"
      },
      {
        "id": "C4",
        "text": "C4 \u2014 Cloud-targeted sustainability exposure"
      },
      {
        "id": "C5",
        "text": "C5 \u2014 Serverless/FaaS exposure"
      },
      {
        "id": "C6",
        "text": "C6 \u2014 AI-targeted resource exposure"
      }
    ],
    "correct": [
      "C0",
      "C1"
    ],
    "explanation": "DoS is represented by C0, C1.",
    "learnMore": "index.html"
  },
  {
    "id": 2,
    "type": "multi",
    "prompt": "X wants to demonstrate DDoS against Y. Click the conditions that make up DDoS.",
    "answers": [
      {
        "id": "C0",
        "text": "C0 \u2014 Denial activity exists"
      },
      {
        "id": "C1",
        "text": "C1 \u2014 Single-source activity"
      },
      {
        "id": "C2",
        "text": "C2 \u2014 Multiple-source/distributed activity"
      },
      {
        "id": "C3",
        "text": "C3 \u2014 Low-rate or low-visibility behaviour"
      },
      {
        "id": "C4",
        "text": "C4 \u2014 Cloud-targeted sustainability exposure"
      },
      {
        "id": "C5",
        "text": "C5 \u2014 Serverless/FaaS exposure"
      },
      {
        "id": "C6",
        "text": "C6 \u2014 AI-targeted resource exposure"
      }
    ],
    "correct": [
      "C0",
      "C2"
    ],
    "explanation": "DDoS is represented by C0, C2.",
    "learnMore": "index.html"
  },
  {
    "id": 3,
    "type": "multi",
    "prompt": "X wants to demonstrate LDoS against Y. Click the conditions that make up LDoS.",
    "answers": [
      {
        "id": "C0",
        "text": "C0 \u2014 Denial activity exists"
      },
      {
        "id": "C1",
        "text": "C1 \u2014 Single-source activity"
      },
      {
        "id": "C2",
        "text": "C2 \u2014 Multiple-source/distributed activity"
      },
      {
        "id": "C3",
        "text": "C3 \u2014 Low-rate or low-visibility behaviour"
      },
      {
        "id": "C4",
        "text": "C4 \u2014 Cloud-targeted sustainability exposure"
      },
      {
        "id": "C5",
        "text": "C5 \u2014 Serverless/FaaS exposure"
      },
      {
        "id": "C6",
        "text": "C6 \u2014 AI-targeted resource exposure"
      }
    ],
    "correct": [
      "C0",
      "C1",
      "C3"
    ],
    "explanation": "LDoS is represented by C0, C1, C3.",
    "learnMore": "index.html"
  },
  {
    "id": 4,
    "type": "multi",
    "prompt": "X wants to demonstrate LDDoS against Y. Click the conditions that make up LDDoS.",
    "answers": [
      {
        "id": "C0",
        "text": "C0 \u2014 Denial activity exists"
      },
      {
        "id": "C1",
        "text": "C1 \u2014 Single-source activity"
      },
      {
        "id": "C2",
        "text": "C2 \u2014 Multiple-source/distributed activity"
      },
      {
        "id": "C3",
        "text": "C3 \u2014 Low-rate or low-visibility behaviour"
      },
      {
        "id": "C4",
        "text": "C4 \u2014 Cloud-targeted sustainability exposure"
      },
      {
        "id": "C5",
        "text": "C5 \u2014 Serverless/FaaS exposure"
      },
      {
        "id": "C6",
        "text": "C6 \u2014 AI-targeted resource exposure"
      }
    ],
    "correct": [
      "C0",
      "C2",
      "C3"
    ],
    "explanation": "LDDoS is represented by C0, C2, C3.",
    "learnMore": "index.html"
  },
  {
    "id": 5,
    "type": "multi",
    "prompt": "X wants to demonstrate EDoS_S against Y. Click the conditions that make up EDoS_S.",
    "answers": [
      {
        "id": "C0",
        "text": "C0 \u2014 Denial activity exists"
      },
      {
        "id": "C1",
        "text": "C1 \u2014 Single-source activity"
      },
      {
        "id": "C2",
        "text": "C2 \u2014 Multiple-source/distributed activity"
      },
      {
        "id": "C3",
        "text": "C3 \u2014 Low-rate or low-visibility behaviour"
      },
      {
        "id": "C4",
        "text": "C4 \u2014 Cloud-targeted sustainability exposure"
      },
      {
        "id": "C5",
        "text": "C5 \u2014 Serverless/FaaS exposure"
      },
      {
        "id": "C6",
        "text": "C6 \u2014 AI-targeted resource exposure"
      }
    ],
    "correct": [
      "C0",
      "C1",
      "C4"
    ],
    "explanation": "EDoS_S is represented by C0, C1, C4.",
    "learnMore": "index.html"
  },
  {
    "id": 6,
    "type": "multi",
    "prompt": "X wants to demonstrate EDoS_D against Y. Click the conditions that make up EDoS_D.",
    "answers": [
      {
        "id": "C0",
        "text": "C0 \u2014 Denial activity exists"
      },
      {
        "id": "C1",
        "text": "C1 \u2014 Single-source activity"
      },
      {
        "id": "C2",
        "text": "C2 \u2014 Multiple-source/distributed activity"
      },
      {
        "id": "C3",
        "text": "C3 \u2014 Low-rate or low-visibility behaviour"
      },
      {
        "id": "C4",
        "text": "C4 \u2014 Cloud-targeted sustainability exposure"
      },
      {
        "id": "C5",
        "text": "C5 \u2014 Serverless/FaaS exposure"
      },
      {
        "id": "C6",
        "text": "C6 \u2014 AI-targeted resource exposure"
      }
    ],
    "correct": [
      "C0",
      "C2",
      "C4"
    ],
    "explanation": "EDoS_D is represented by C0, C2, C4.",
    "learnMore": "index.html"
  },
  {
    "id": 7,
    "type": "multi",
    "prompt": "X wants to demonstrate DoW against Y. Click the conditions that make up DoW.",
    "answers": [
      {
        "id": "C0",
        "text": "C0 \u2014 Denial activity exists"
      },
      {
        "id": "C1",
        "text": "C1 \u2014 Single-source activity"
      },
      {
        "id": "C2",
        "text": "C2 \u2014 Multiple-source/distributed activity"
      },
      {
        "id": "C3",
        "text": "C3 \u2014 Low-rate or low-visibility behaviour"
      },
      {
        "id": "C4",
        "text": "C4 \u2014 Cloud-targeted sustainability exposure"
      },
      {
        "id": "C5",
        "text": "C5 \u2014 Serverless/FaaS exposure"
      },
      {
        "id": "C6",
        "text": "C6 \u2014 AI-targeted resource exposure"
      }
    ],
    "correct": [
      "C0",
      "C1",
      "C4",
      "C5"
    ],
    "explanation": "DoW is represented by C0, C1, C4, C5.",
    "learnMore": "index.html"
  },
  {
    "id": 8,
    "type": "multi",
    "prompt": "X wants to demonstrate DDoW against Y. Click the conditions that make up DDoW.",
    "answers": [
      {
        "id": "C0",
        "text": "C0 \u2014 Denial activity exists"
      },
      {
        "id": "C1",
        "text": "C1 \u2014 Single-source activity"
      },
      {
        "id": "C2",
        "text": "C2 \u2014 Multiple-source/distributed activity"
      },
      {
        "id": "C3",
        "text": "C3 \u2014 Low-rate or low-visibility behaviour"
      },
      {
        "id": "C4",
        "text": "C4 \u2014 Cloud-targeted sustainability exposure"
      },
      {
        "id": "C5",
        "text": "C5 \u2014 Serverless/FaaS exposure"
      },
      {
        "id": "C6",
        "text": "C6 \u2014 AI-targeted resource exposure"
      }
    ],
    "correct": [
      "C0",
      "C2",
      "C4",
      "C5"
    ],
    "explanation": "DDoW is represented by C0, C2, C4, C5.",
    "learnMore": "index.html"
  },
  {
    "id": 9,
    "type": "multi",
    "prompt": "X wants to demonstrate DoA against Y. Click the conditions that make up DoA.",
    "answers": [
      {
        "id": "C0",
        "text": "C0 \u2014 Denial activity exists"
      },
      {
        "id": "C1",
        "text": "C1 \u2014 Single-source activity"
      },
      {
        "id": "C2",
        "text": "C2 \u2014 Multiple-source/distributed activity"
      },
      {
        "id": "C3",
        "text": "C3 \u2014 Low-rate or low-visibility behaviour"
      },
      {
        "id": "C4",
        "text": "C4 \u2014 Cloud-targeted sustainability exposure"
      },
      {
        "id": "C5",
        "text": "C5 \u2014 Serverless/FaaS exposure"
      },
      {
        "id": "C6",
        "text": "C6 \u2014 AI-targeted resource exposure"
      }
    ],
    "correct": [
      "C0",
      "C6"
    ],
    "explanation": "DoA is represented by C0, C6.",
    "learnMore": "index.html"
  },
  {
    "id": 10,
    "type": "single",
    "prompt": "Which attack class is represented by {C0, C1}?",
    "answers": [
      {
        "id": "DoS",
        "text": "DoS \u2014 single-source availability denial"
      },
      {
        "id": "DDoS",
        "text": "DDoS \u2014 distributed availability denial"
      },
      {
        "id": "LDoS",
        "text": "LDoS \u2014 single-source low-rate denial"
      },
      {
        "id": "LDDoS",
        "text": "LDDoS \u2014 distributed low-rate denial"
      },
      {
        "id": "EDoS_S",
        "text": "EDoS_S \u2014 single-source cloud sustainability denial"
      },
      {
        "id": "EDoS_D",
        "text": "EDoS_D \u2014 distributed cloud sustainability denial"
      },
      {
        "id": "DoW",
        "text": "DoW \u2014 single-source serverless billing denial"
      },
      {
        "id": "DDoW",
        "text": "DDoW \u2014 distributed serverless billing denial"
      },
      {
        "id": "DoA",
        "text": "DoA \u2014 AI-targeted denial"
      }
    ],
    "correct": [
      "DoS"
    ],
    "explanation": "The condition set {C0, C1} maps to DoS.",
    "learnMore": "index.html"
  },
  {
    "id": 11,
    "type": "single",
    "prompt": "Which attack class is represented by {C0, C2}?",
    "answers": [
      {
        "id": "DoS",
        "text": "DoS \u2014 single-source availability denial"
      },
      {
        "id": "DDoS",
        "text": "DDoS \u2014 distributed availability denial"
      },
      {
        "id": "LDoS",
        "text": "LDoS \u2014 single-source low-rate denial"
      },
      {
        "id": "LDDoS",
        "text": "LDDoS \u2014 distributed low-rate denial"
      },
      {
        "id": "EDoS_S",
        "text": "EDoS_S \u2014 single-source cloud sustainability denial"
      },
      {
        "id": "EDoS_D",
        "text": "EDoS_D \u2014 distributed cloud sustainability denial"
      },
      {
        "id": "DoW",
        "text": "DoW \u2014 single-source serverless billing denial"
      },
      {
        "id": "DDoW",
        "text": "DDoW \u2014 distributed serverless billing denial"
      },
      {
        "id": "DoA",
        "text": "DoA \u2014 AI-targeted denial"
      }
    ],
    "correct": [
      "DDoS"
    ],
    "explanation": "The condition set {C0, C2} maps to DDoS.",
    "learnMore": "index.html"
  },
  {
    "id": 12,
    "type": "single",
    "prompt": "Which attack class is represented by {C0, C1, C3}?",
    "answers": [
      {
        "id": "DoS",
        "text": "DoS \u2014 single-source availability denial"
      },
      {
        "id": "DDoS",
        "text": "DDoS \u2014 distributed availability denial"
      },
      {
        "id": "LDoS",
        "text": "LDoS \u2014 single-source low-rate denial"
      },
      {
        "id": "LDDoS",
        "text": "LDDoS \u2014 distributed low-rate denial"
      },
      {
        "id": "EDoS_S",
        "text": "EDoS_S \u2014 single-source cloud sustainability denial"
      },
      {
        "id": "EDoS_D",
        "text": "EDoS_D \u2014 distributed cloud sustainability denial"
      },
      {
        "id": "DoW",
        "text": "DoW \u2014 single-source serverless billing denial"
      },
      {
        "id": "DDoW",
        "text": "DDoW \u2014 distributed serverless billing denial"
      },
      {
        "id": "DoA",
        "text": "DoA \u2014 AI-targeted denial"
      }
    ],
    "correct": [
      "LDoS"
    ],
    "explanation": "The condition set {C0, C1, C3} maps to LDoS.",
    "learnMore": "index.html"
  },
  {
    "id": 13,
    "type": "single",
    "prompt": "Which attack class is represented by {C0, C2, C3}?",
    "answers": [
      {
        "id": "DoS",
        "text": "DoS \u2014 single-source availability denial"
      },
      {
        "id": "DDoS",
        "text": "DDoS \u2014 distributed availability denial"
      },
      {
        "id": "LDoS",
        "text": "LDoS \u2014 single-source low-rate denial"
      },
      {
        "id": "LDDoS",
        "text": "LDDoS \u2014 distributed low-rate denial"
      },
      {
        "id": "EDoS_S",
        "text": "EDoS_S \u2014 single-source cloud sustainability denial"
      },
      {
        "id": "EDoS_D",
        "text": "EDoS_D \u2014 distributed cloud sustainability denial"
      },
      {
        "id": "DoW",
        "text": "DoW \u2014 single-source serverless billing denial"
      },
      {
        "id": "DDoW",
        "text": "DDoW \u2014 distributed serverless billing denial"
      },
      {
        "id": "DoA",
        "text": "DoA \u2014 AI-targeted denial"
      }
    ],
    "correct": [
      "LDDoS"
    ],
    "explanation": "The condition set {C0, C2, C3} maps to LDDoS.",
    "learnMore": "index.html"
  },
  {
    "id": 14,
    "type": "single",
    "prompt": "Which attack class is represented by {C0, C1, C4}?",
    "answers": [
      {
        "id": "DoS",
        "text": "DoS \u2014 single-source availability denial"
      },
      {
        "id": "DDoS",
        "text": "DDoS \u2014 distributed availability denial"
      },
      {
        "id": "LDoS",
        "text": "LDoS \u2014 single-source low-rate denial"
      },
      {
        "id": "LDDoS",
        "text": "LDDoS \u2014 distributed low-rate denial"
      },
      {
        "id": "EDoS_S",
        "text": "EDoS_S \u2014 single-source cloud sustainability denial"
      },
      {
        "id": "EDoS_D",
        "text": "EDoS_D \u2014 distributed cloud sustainability denial"
      },
      {
        "id": "DoW",
        "text": "DoW \u2014 single-source serverless billing denial"
      },
      {
        "id": "DDoW",
        "text": "DDoW \u2014 distributed serverless billing denial"
      },
      {
        "id": "DoA",
        "text": "DoA \u2014 AI-targeted denial"
      }
    ],
    "correct": [
      "EDoS_S"
    ],
    "explanation": "The condition set {C0, C1, C4} maps to EDoS_S.",
    "learnMore": "index.html"
  },
  {
    "id": 15,
    "type": "single",
    "prompt": "Which attack class is represented by {C0, C2, C4}?",
    "answers": [
      {
        "id": "DoS",
        "text": "DoS \u2014 single-source availability denial"
      },
      {
        "id": "DDoS",
        "text": "DDoS \u2014 distributed availability denial"
      },
      {
        "id": "LDoS",
        "text": "LDoS \u2014 single-source low-rate denial"
      },
      {
        "id": "LDDoS",
        "text": "LDDoS \u2014 distributed low-rate denial"
      },
      {
        "id": "EDoS_S",
        "text": "EDoS_S \u2014 single-source cloud sustainability denial"
      },
      {
        "id": "EDoS_D",
        "text": "EDoS_D \u2014 distributed cloud sustainability denial"
      },
      {
        "id": "DoW",
        "text": "DoW \u2014 single-source serverless billing denial"
      },
      {
        "id": "DDoW",
        "text": "DDoW \u2014 distributed serverless billing denial"
      },
      {
        "id": "DoA",
        "text": "DoA \u2014 AI-targeted denial"
      }
    ],
    "correct": [
      "EDoS_D"
    ],
    "explanation": "The condition set {C0, C2, C4} maps to EDoS_D.",
    "learnMore": "index.html"
  },
  {
    "id": 16,
    "type": "single",
    "prompt": "Which attack class is represented by {C0, C1, C4, C5}?",
    "answers": [
      {
        "id": "DoS",
        "text": "DoS \u2014 single-source availability denial"
      },
      {
        "id": "DDoS",
        "text": "DDoS \u2014 distributed availability denial"
      },
      {
        "id": "LDoS",
        "text": "LDoS \u2014 single-source low-rate denial"
      },
      {
        "id": "LDDoS",
        "text": "LDDoS \u2014 distributed low-rate denial"
      },
      {
        "id": "EDoS_S",
        "text": "EDoS_S \u2014 single-source cloud sustainability denial"
      },
      {
        "id": "EDoS_D",
        "text": "EDoS_D \u2014 distributed cloud sustainability denial"
      },
      {
        "id": "DoW",
        "text": "DoW \u2014 single-source serverless billing denial"
      },
      {
        "id": "DDoW",
        "text": "DDoW \u2014 distributed serverless billing denial"
      },
      {
        "id": "DoA",
        "text": "DoA \u2014 AI-targeted denial"
      }
    ],
    "correct": [
      "DoW"
    ],
    "explanation": "The condition set {C0, C1, C4, C5} maps to DoW.",
    "learnMore": "index.html"
  },
  {
    "id": 17,
    "type": "single",
    "prompt": "Which attack class is represented by {C0, C2, C4, C5}?",
    "answers": [
      {
        "id": "DoS",
        "text": "DoS \u2014 single-source availability denial"
      },
      {
        "id": "DDoS",
        "text": "DDoS \u2014 distributed availability denial"
      },
      {
        "id": "LDoS",
        "text": "LDoS \u2014 single-source low-rate denial"
      },
      {
        "id": "LDDoS",
        "text": "LDDoS \u2014 distributed low-rate denial"
      },
      {
        "id": "EDoS_S",
        "text": "EDoS_S \u2014 single-source cloud sustainability denial"
      },
      {
        "id": "EDoS_D",
        "text": "EDoS_D \u2014 distributed cloud sustainability denial"
      },
      {
        "id": "DoW",
        "text": "DoW \u2014 single-source serverless billing denial"
      },
      {
        "id": "DDoW",
        "text": "DDoW \u2014 distributed serverless billing denial"
      },
      {
        "id": "DoA",
        "text": "DoA \u2014 AI-targeted denial"
      }
    ],
    "correct": [
      "DDoW"
    ],
    "explanation": "The condition set {C0, C2, C4, C5} maps to DDoW.",
    "learnMore": "index.html"
  },
  {
    "id": 18,
    "type": "single",
    "prompt": "Which attack class is represented by {C0, C6}?",
    "answers": [
      {
        "id": "DoS",
        "text": "DoS \u2014 single-source availability denial"
      },
      {
        "id": "DDoS",
        "text": "DDoS \u2014 distributed availability denial"
      },
      {
        "id": "LDoS",
        "text": "LDoS \u2014 single-source low-rate denial"
      },
      {
        "id": "LDDoS",
        "text": "LDDoS \u2014 distributed low-rate denial"
      },
      {
        "id": "EDoS_S",
        "text": "EDoS_S \u2014 single-source cloud sustainability denial"
      },
      {
        "id": "EDoS_D",
        "text": "EDoS_D \u2014 distributed cloud sustainability denial"
      },
      {
        "id": "DoW",
        "text": "DoW \u2014 single-source serverless billing denial"
      },
      {
        "id": "DDoW",
        "text": "DDoW \u2014 distributed serverless billing denial"
      },
      {
        "id": "DoA",
        "text": "DoA \u2014 AI-targeted denial"
      }
    ],
    "correct": [
      "DoA"
    ],
    "explanation": "The condition set {C0, C6} maps to DoA.",
    "learnMore": "index.html"
  },
  {
    "id": 19,
    "type": "single",
    "prompt": "Y has identified a DoS scenario. Which technical control best fits this attack?",
    "answers": [
      {
        "id": "Apply per-source rate limits and harden endpoint timeouts.",
        "text": "Apply per-source rate limits and harden endpoint timeouts."
      },
      {
        "id": "Use CDN/anycast protection, traffic scrubbing, and upstream filtering.",
        "text": "Use CDN/anycast protection, traffic scrubbing, and upstream filtering."
      },
      {
        "id": "Use behavioural thresholds for timing, periodicity, long requests, and low-volume degradation.",
        "text": "Use behavioural thresholds for timing, periodicity, long requests, and low-volume degradation."
      },
      {
        "id": "Correlate low-rate timing patterns across many sources and apply aggregate adaptive throttling.",
        "text": "Correlate low-rate timing patterns across many sources and apply aggregate adaptive throttling."
      }
    ],
    "correct": [
      "Apply per-source rate limits and harden endpoint timeouts."
    ],
    "explanation": "Single-source containment, throttling, and endpoint hardening are appropriate for DoS.",
    "learnMore": "mitigations.html"
  },
  {
    "id": 20,
    "type": "single",
    "prompt": "Y has identified a DDoS scenario. Which technical control best fits this attack?",
    "answers": [
      {
        "id": "Use CDN/anycast protection, traffic scrubbing, and upstream filtering.",
        "text": "Use CDN/anycast protection, traffic scrubbing, and upstream filtering."
      },
      {
        "id": "Apply per-source rate limits and harden endpoint timeouts.",
        "text": "Apply per-source rate limits and harden endpoint timeouts."
      },
      {
        "id": "Use behavioural thresholds for timing, periodicity, long requests, and low-volume degradation.",
        "text": "Use behavioural thresholds for timing, periodicity, long requests, and low-volume degradation."
      },
      {
        "id": "Correlate low-rate timing patterns across many sources and apply aggregate adaptive throttling.",
        "text": "Correlate low-rate timing patterns across many sources and apply aggregate adaptive throttling."
      }
    ],
    "correct": [
      "Use CDN/anycast protection, traffic scrubbing, and upstream filtering."
    ],
    "explanation": "Distributed sources require upstream absorption and scrubbing.",
    "learnMore": "mitigations.html"
  },
  {
    "id": 21,
    "type": "single",
    "prompt": "Y has identified a LDoS scenario. Which technical control best fits this attack?",
    "answers": [
      {
        "id": "Use behavioural thresholds for timing, periodicity, long requests, and low-volume degradation.",
        "text": "Use behavioural thresholds for timing, periodicity, long requests, and low-volume degradation."
      },
      {
        "id": "Apply per-source rate limits and harden endpoint timeouts.",
        "text": "Apply per-source rate limits and harden endpoint timeouts."
      },
      {
        "id": "Use CDN/anycast protection, traffic scrubbing, and upstream filtering.",
        "text": "Use CDN/anycast protection, traffic scrubbing, and upstream filtering."
      },
      {
        "id": "Correlate low-rate timing patterns across many sources and apply aggregate adaptive throttling.",
        "text": "Correlate low-rate timing patterns across many sources and apply aggregate adaptive throttling."
      }
    ],
    "correct": [
      "Use behavioural thresholds for timing, periodicity, long requests, and low-volume degradation."
    ],
    "explanation": "LDoS is not necessarily high volume, so timing and slow-resource behaviour matter.",
    "learnMore": "mitigations.html"
  },
  {
    "id": 22,
    "type": "single",
    "prompt": "Y has identified a LDDoS scenario. Which technical control best fits this attack?",
    "answers": [
      {
        "id": "Correlate low-rate timing patterns across many sources and apply aggregate adaptive throttling.",
        "text": "Correlate low-rate timing patterns across many sources and apply aggregate adaptive throttling."
      },
      {
        "id": "Apply per-source rate limits and harden endpoint timeouts.",
        "text": "Apply per-source rate limits and harden endpoint timeouts."
      },
      {
        "id": "Use CDN/anycast protection, traffic scrubbing, and upstream filtering.",
        "text": "Use CDN/anycast protection, traffic scrubbing, and upstream filtering."
      },
      {
        "id": "Use behavioural thresholds for timing, periodicity, long requests, and low-volume degradation.",
        "text": "Use behavioural thresholds for timing, periodicity, long requests, and low-volume degradation."
      }
    ],
    "correct": [
      "Correlate low-rate timing patterns across many sources and apply aggregate adaptive throttling."
    ],
    "explanation": "LDDoS requires cross-source correlation because each source may appear harmless alone.",
    "learnMore": "mitigations.html"
  },
  {
    "id": 23,
    "type": "single",
    "prompt": "Y has identified a EDoS_S scenario. Which technical control best fits this attack?",
    "answers": [
      {
        "id": "Set cloud budgets, spend alerts, service quotas, autoscaling ceilings, and per-tenant consumption limits.",
        "text": "Set cloud budgets, spend alerts, service quotas, autoscaling ceilings, and per-tenant consumption limits."
      },
      {
        "id": "Apply per-source rate limits and harden endpoint timeouts.",
        "text": "Apply per-source rate limits and harden endpoint timeouts."
      },
      {
        "id": "Use CDN/anycast protection, traffic scrubbing, and upstream filtering.",
        "text": "Use CDN/anycast protection, traffic scrubbing, and upstream filtering."
      },
      {
        "id": "Use behavioural thresholds for timing, periodicity, long requests, and low-volume degradation.",
        "text": "Use behavioural thresholds for timing, periodicity, long requests, and low-volume degradation."
      }
    ],
    "correct": [
      "Set cloud budgets, spend alerts, service quotas, autoscaling ceilings, and per-tenant consumption limits."
    ],
    "explanation": "Single-source EDoS needs cost guardrails and cloud scaling limits.",
    "learnMore": "mitigations.html"
  },
  {
    "id": 24,
    "type": "single",
    "prompt": "Y has identified a EDoS_D scenario. Which technical control best fits this attack?",
    "answers": [
      {
        "id": "Combine DDoS filtering with cloud budgets, autoscaling ceilings, and origin shielding.",
        "text": "Combine DDoS filtering with cloud budgets, autoscaling ceilings, and origin shielding."
      },
      {
        "id": "Apply per-source rate limits and harden endpoint timeouts.",
        "text": "Apply per-source rate limits and harden endpoint timeouts."
      },
      {
        "id": "Use CDN/anycast protection, traffic scrubbing, and upstream filtering.",
        "text": "Use CDN/anycast protection, traffic scrubbing, and upstream filtering."
      },
      {
        "id": "Use behavioural thresholds for timing, periodicity, long requests, and low-volume degradation.",
        "text": "Use behavioural thresholds for timing, periodicity, long requests, and low-volume degradation."
      }
    ],
    "correct": [
      "Combine DDoS filtering with cloud budgets, autoscaling ceilings, and origin shielding."
    ],
    "explanation": "Distributed cloud sustainability attacks require both traffic and cost controls.",
    "learnMore": "mitigations.html"
  },
  {
    "id": 25,
    "type": "single",
    "prompt": "Y has identified a DoW scenario. Which technical control best fits this attack?",
    "answers": [
      {
        "id": "Set per-function concurrency limits, invocation quotas, timeout caps, and retry limits.",
        "text": "Set per-function concurrency limits, invocation quotas, timeout caps, and retry limits."
      },
      {
        "id": "Apply per-source rate limits and harden endpoint timeouts.",
        "text": "Apply per-source rate limits and harden endpoint timeouts."
      },
      {
        "id": "Use CDN/anycast protection, traffic scrubbing, and upstream filtering.",
        "text": "Use CDN/anycast protection, traffic scrubbing, and upstream filtering."
      },
      {
        "id": "Use behavioural thresholds for timing, periodicity, long requests, and low-volume degradation.",
        "text": "Use behavioural thresholds for timing, periodicity, long requests, and low-volume degradation."
      }
    ],
    "correct": [
      "Set per-function concurrency limits, invocation quotas, timeout caps, and retry limits."
    ],
    "explanation": "DoW targets serverless invocation and duration billing.",
    "learnMore": "mitigations.html"
  },
  {
    "id": 26,
    "type": "single",
    "prompt": "Y has identified a DDoW scenario. Which technical control best fits this attack?",
    "answers": [
      {
        "id": "Use edge filtering before function execution and configure concurrency, timeout, retry, and event-chain caps.",
        "text": "Use edge filtering before function execution and configure concurrency, timeout, retry, and event-chain caps."
      },
      {
        "id": "Apply per-source rate limits and harden endpoint timeouts.",
        "text": "Apply per-source rate limits and harden endpoint timeouts."
      },
      {
        "id": "Use CDN/anycast protection, traffic scrubbing, and upstream filtering.",
        "text": "Use CDN/anycast protection, traffic scrubbing, and upstream filtering."
      },
      {
        "id": "Use behavioural thresholds for timing, periodicity, long requests, and low-volume degradation.",
        "text": "Use behavioural thresholds for timing, periodicity, long requests, and low-volume degradation."
      }
    ],
    "correct": [
      "Use edge filtering before function execution and configure concurrency, timeout, retry, and event-chain caps."
    ],
    "explanation": "DDoW combines distributed ingress with serverless billing exposure.",
    "learnMore": "mitigations.html"
  },
  {
    "id": 27,
    "type": "single",
    "prompt": "Y has identified a DoA scenario. Which technical control best fits this attack?",
    "answers": [
      {
        "id": "Set token budgets, model-call quotas, context limits, tool-call caps, and agent recursion limits.",
        "text": "Set token budgets, model-call quotas, context limits, tool-call caps, and agent recursion limits."
      },
      {
        "id": "Apply per-source rate limits and harden endpoint timeouts.",
        "text": "Apply per-source rate limits and harden endpoint timeouts."
      },
      {
        "id": "Use CDN/anycast protection, traffic scrubbing, and upstream filtering.",
        "text": "Use CDN/anycast protection, traffic scrubbing, and upstream filtering."
      },
      {
        "id": "Use behavioural thresholds for timing, periodicity, long requests, and low-volume degradation.",
        "text": "Use behavioural thresholds for timing, periodicity, long requests, and low-volume degradation."
      }
    ],
    "correct": [
      "Set token budgets, model-call quotas, context limits, tool-call caps, and agent recursion limits."
    ],
    "explanation": "DoA targets AI inference and AI-platform consumption.",
    "learnMore": "mitigations.html"
  },
  {
    "id": 28,
    "type": "single",
    "prompt": "Which option correctly describes C0?",
    "answers": [
      {
        "id": "C0",
        "text": "C0 \u2014 Denial activity exists"
      },
      {
        "id": "C1",
        "text": "C1 \u2014 Single-source activity"
      },
      {
        "id": "C2",
        "text": "C2 \u2014 Multiple-source/distributed activity"
      },
      {
        "id": "C3",
        "text": "C3 \u2014 Low-rate or low-visibility behaviour"
      }
    ],
    "correct": [
      "C0"
    ],
    "explanation": "C0 means: Denial activity exists.",
    "learnMore": "evidence.html"
  },
  {
    "id": 29,
    "type": "single",
    "prompt": "Which option correctly describes C1?",
    "answers": [
      {
        "id": "C1",
        "text": "C1 \u2014 Single-source activity"
      },
      {
        "id": "C0",
        "text": "C0 \u2014 Denial activity exists"
      },
      {
        "id": "C2",
        "text": "C2 \u2014 Multiple-source/distributed activity"
      },
      {
        "id": "C3",
        "text": "C3 \u2014 Low-rate or low-visibility behaviour"
      }
    ],
    "correct": [
      "C1"
    ],
    "explanation": "C1 means: Single-source activity.",
    "learnMore": "evidence.html"
  },
  {
    "id": 30,
    "type": "single",
    "prompt": "Which option correctly describes C2?",
    "answers": [
      {
        "id": "C2",
        "text": "C2 \u2014 Multiple-source/distributed activity"
      },
      {
        "id": "C0",
        "text": "C0 \u2014 Denial activity exists"
      },
      {
        "id": "C1",
        "text": "C1 \u2014 Single-source activity"
      },
      {
        "id": "C3",
        "text": "C3 \u2014 Low-rate or low-visibility behaviour"
      }
    ],
    "correct": [
      "C2"
    ],
    "explanation": "C2 means: Multiple-source/distributed activity.",
    "learnMore": "evidence.html"
  },
  {
    "id": 31,
    "type": "single",
    "prompt": "Which option correctly describes C3?",
    "answers": [
      {
        "id": "C3",
        "text": "C3 \u2014 Low-rate or low-visibility behaviour"
      },
      {
        "id": "C0",
        "text": "C0 \u2014 Denial activity exists"
      },
      {
        "id": "C1",
        "text": "C1 \u2014 Single-source activity"
      },
      {
        "id": "C2",
        "text": "C2 \u2014 Multiple-source/distributed activity"
      }
    ],
    "correct": [
      "C3"
    ],
    "explanation": "C3 means: Low-rate or low-visibility behaviour.",
    "learnMore": "evidence.html"
  },
  {
    "id": 32,
    "type": "single",
    "prompt": "Which option correctly describes C4?",
    "answers": [
      {
        "id": "C4",
        "text": "C4 \u2014 Cloud-targeted sustainability exposure"
      },
      {
        "id": "C0",
        "text": "C0 \u2014 Denial activity exists"
      },
      {
        "id": "C1",
        "text": "C1 \u2014 Single-source activity"
      },
      {
        "id": "C2",
        "text": "C2 \u2014 Multiple-source/distributed activity"
      }
    ],
    "correct": [
      "C4"
    ],
    "explanation": "C4 means: Cloud-targeted sustainability exposure.",
    "learnMore": "evidence.html"
  },
  {
    "id": 33,
    "type": "single",
    "prompt": "Which option correctly describes C5?",
    "answers": [
      {
        "id": "C5",
        "text": "C5 \u2014 Serverless/FaaS exposure"
      },
      {
        "id": "C0",
        "text": "C0 \u2014 Denial activity exists"
      },
      {
        "id": "C1",
        "text": "C1 \u2014 Single-source activity"
      },
      {
        "id": "C2",
        "text": "C2 \u2014 Multiple-source/distributed activity"
      }
    ],
    "correct": [
      "C5"
    ],
    "explanation": "C5 means: Serverless/FaaS exposure.",
    "learnMore": "evidence.html"
  },
  {
    "id": 34,
    "type": "single",
    "prompt": "Which option correctly describes C6?",
    "answers": [
      {
        "id": "C6",
        "text": "C6 \u2014 AI-targeted resource exposure"
      },
      {
        "id": "C0",
        "text": "C0 \u2014 Denial activity exists"
      },
      {
        "id": "C1",
        "text": "C1 \u2014 Single-source activity"
      },
      {
        "id": "C2",
        "text": "C2 \u2014 Multiple-source/distributed activity"
      }
    ],
    "correct": [
      "C6"
    ],
    "explanation": "C6 means: AI-targeted resource exposure.",
    "learnMore": "evidence.html"
  },
  {
    "id": 35,
    "type": "single",
    "prompt": "Y wants to monitor input tokens, output tokens, context-window length, tool calls and model calls. Which attack is Y trying to prevent?",
    "answers": [
      {
        "id": "DoS",
        "text": "DoS \u2014 single-source availability denial"
      },
      {
        "id": "DDoS",
        "text": "DDoS \u2014 distributed availability denial"
      },
      {
        "id": "LDoS",
        "text": "LDoS \u2014 single-source low-rate denial"
      },
      {
        "id": "LDDoS",
        "text": "LDDoS \u2014 distributed low-rate denial"
      },
      {
        "id": "EDoS_S",
        "text": "EDoS_S \u2014 single-source cloud sustainability denial"
      },
      {
        "id": "EDoS_D",
        "text": "EDoS_D \u2014 distributed cloud sustainability denial"
      },
      {
        "id": "DoW",
        "text": "DoW \u2014 single-source serverless billing denial"
      },
      {
        "id": "DDoW",
        "text": "DDoW \u2014 distributed serverless billing denial"
      },
      {
        "id": "DoA",
        "text": "DoA \u2014 AI-targeted denial"
      }
    ],
    "correct": [
      "DoA"
    ],
    "explanation": "Those are AI-resource indicators, so the relevant class is DoA.",
    "learnMore": "evidence.html"
  },
  {
    "id": 36,
    "type": "single",
    "prompt": "Y wants to monitor function invocations, billed duration, retries and event-chain depth. Which attack class is most relevant?",
    "answers": [
      {
        "id": "DoS",
        "text": "DoS \u2014 single-source availability denial"
      },
      {
        "id": "DDoS",
        "text": "DDoS \u2014 distributed availability denial"
      },
      {
        "id": "LDoS",
        "text": "LDoS \u2014 single-source low-rate denial"
      },
      {
        "id": "LDDoS",
        "text": "LDDoS \u2014 distributed low-rate denial"
      },
      {
        "id": "EDoS_S",
        "text": "EDoS_S \u2014 single-source cloud sustainability denial"
      },
      {
        "id": "EDoS_D",
        "text": "EDoS_D \u2014 distributed cloud sustainability denial"
      },
      {
        "id": "DoW",
        "text": "DoW \u2014 single-source serverless billing denial"
      },
      {
        "id": "DDoW",
        "text": "DDoW \u2014 distributed serverless billing denial"
      },
      {
        "id": "DoA",
        "text": "DoA \u2014 AI-targeted denial"
      }
    ],
    "correct": [
      "DoW"
    ],
    "explanation": "These are serverless billing indicators, so DoW is the best match.",
    "learnMore": "evidence.html"
  },
  {
    "id": 37,
    "type": "single",
    "prompt": "Y sees many sources causing function invocations and downstream event chains. Which class is most precise?",
    "answers": [
      {
        "id": "DoS",
        "text": "DoS \u2014 single-source availability denial"
      },
      {
        "id": "DDoS",
        "text": "DDoS \u2014 distributed availability denial"
      },
      {
        "id": "LDoS",
        "text": "LDoS \u2014 single-source low-rate denial"
      },
      {
        "id": "LDDoS",
        "text": "LDDoS \u2014 distributed low-rate denial"
      },
      {
        "id": "EDoS_S",
        "text": "EDoS_S \u2014 single-source cloud sustainability denial"
      },
      {
        "id": "EDoS_D",
        "text": "EDoS_D \u2014 distributed cloud sustainability denial"
      },
      {
        "id": "DoW",
        "text": "DoW \u2014 single-source serverless billing denial"
      },
      {
        "id": "DDoW",
        "text": "DDoW \u2014 distributed serverless billing denial"
      },
      {
        "id": "DoA",
        "text": "DoA \u2014 AI-targeted denial"
      }
    ],
    "correct": [
      "DDoW"
    ],
    "explanation": "Multiple sources plus serverless exposure gives DDoW.",
    "learnMore": "evidence.html"
  },
  {
    "id": 38,
    "type": "single",
    "prompt": "Y sees one script forcing cloud autoscaling and rising cloud spend. Which class is most precise?",
    "answers": [
      {
        "id": "DoS",
        "text": "DoS \u2014 single-source availability denial"
      },
      {
        "id": "DDoS",
        "text": "DDoS \u2014 distributed availability denial"
      },
      {
        "id": "LDoS",
        "text": "LDoS \u2014 single-source low-rate denial"
      },
      {
        "id": "LDDoS",
        "text": "LDDoS \u2014 distributed low-rate denial"
      },
      {
        "id": "EDoS_S",
        "text": "EDoS_S \u2014 single-source cloud sustainability denial"
      },
      {
        "id": "EDoS_D",
        "text": "EDoS_D \u2014 distributed cloud sustainability denial"
      },
      {
        "id": "DoW",
        "text": "DoW \u2014 single-source serverless billing denial"
      },
      {
        "id": "DDoW",
        "text": "DDoW \u2014 distributed serverless billing denial"
      },
      {
        "id": "DoA",
        "text": "DoA \u2014 AI-targeted denial"
      }
    ],
    "correct": [
      "EDoS_S"
    ],
    "explanation": "Single-source plus cloud sustainability exposure gives EDoS_S.",
    "learnMore": "evidence.html"
  },
  {
    "id": 39,
    "type": "single",
    "prompt": "Y sees many bots forcing cloud autoscaling and rising cloud spend. Which class is most precise?",
    "answers": [
      {
        "id": "DoS",
        "text": "DoS \u2014 single-source availability denial"
      },
      {
        "id": "DDoS",
        "text": "DDoS \u2014 distributed availability denial"
      },
      {
        "id": "LDoS",
        "text": "LDoS \u2014 single-source low-rate denial"
      },
      {
        "id": "LDDoS",
        "text": "LDDoS \u2014 distributed low-rate denial"
      },
      {
        "id": "EDoS_S",
        "text": "EDoS_S \u2014 single-source cloud sustainability denial"
      },
      {
        "id": "EDoS_D",
        "text": "EDoS_D \u2014 distributed cloud sustainability denial"
      },
      {
        "id": "DoW",
        "text": "DoW \u2014 single-source serverless billing denial"
      },
      {
        "id": "DDoW",
        "text": "DDoW \u2014 distributed serverless billing denial"
      },
      {
        "id": "DoA",
        "text": "DoA \u2014 AI-targeted denial"
      }
    ],
    "correct": [
      "EDoS_D"
    ],
    "explanation": "Multiple sources plus cloud sustainability exposure gives EDoS_D.",
    "learnMore": "evidence.html"
  },
  {
    "id": 40,
    "type": "single",
    "prompt": "Y sees one source sending periodic low-volume traffic that still causes lag. Which class is most precise?",
    "answers": [
      {
        "id": "DoS",
        "text": "DoS \u2014 single-source availability denial"
      },
      {
        "id": "DDoS",
        "text": "DDoS \u2014 distributed availability denial"
      },
      {
        "id": "LDoS",
        "text": "LDoS \u2014 single-source low-rate denial"
      },
      {
        "id": "LDDoS",
        "text": "LDDoS \u2014 distributed low-rate denial"
      },
      {
        "id": "EDoS_S",
        "text": "EDoS_S \u2014 single-source cloud sustainability denial"
      },
      {
        "id": "EDoS_D",
        "text": "EDoS_D \u2014 distributed cloud sustainability denial"
      },
      {
        "id": "DoW",
        "text": "DoW \u2014 single-source serverless billing denial"
      },
      {
        "id": "DDoW",
        "text": "DDoW \u2014 distributed serverless billing denial"
      },
      {
        "id": "DoA",
        "text": "DoA \u2014 AI-targeted denial"
      }
    ],
    "correct": [
      "LDoS"
    ],
    "explanation": "Single source plus low-rate behaviour gives LDoS.",
    "learnMore": "evidence.html"
  },
  {
    "id": 41,
    "type": "single",
    "prompt": "Y sees many sources sending synchronised low-volume bursts. Which class is most precise?",
    "answers": [
      {
        "id": "DoS",
        "text": "DoS \u2014 single-source availability denial"
      },
      {
        "id": "DDoS",
        "text": "DDoS \u2014 distributed availability denial"
      },
      {
        "id": "LDoS",
        "text": "LDoS \u2014 single-source low-rate denial"
      },
      {
        "id": "LDDoS",
        "text": "LDDoS \u2014 distributed low-rate denial"
      },
      {
        "id": "EDoS_S",
        "text": "EDoS_S \u2014 single-source cloud sustainability denial"
      },
      {
        "id": "EDoS_D",
        "text": "EDoS_D \u2014 distributed cloud sustainability denial"
      },
      {
        "id": "DoW",
        "text": "DoW \u2014 single-source serverless billing denial"
      },
      {
        "id": "DDoW",
        "text": "DDoW \u2014 distributed serverless billing denial"
      },
      {
        "id": "DoA",
        "text": "DoA \u2014 AI-targeted denial"
      }
    ],
    "correct": [
      "LDDoS"
    ],
    "explanation": "Distributed sources plus low-rate behaviour gives LDDoS.",
    "learnMore": "evidence.html"
  },
  {
    "id": 42,
    "type": "single",
    "prompt": "Y sees one source flooding the service without cloud, serverless or AI evidence. Which class is most precise?",
    "answers": [
      {
        "id": "DoS",
        "text": "DoS \u2014 single-source availability denial"
      },
      {
        "id": "DDoS",
        "text": "DDoS \u2014 distributed availability denial"
      },
      {
        "id": "LDoS",
        "text": "LDoS \u2014 single-source low-rate denial"
      },
      {
        "id": "LDDoS",
        "text": "LDDoS \u2014 distributed low-rate denial"
      },
      {
        "id": "EDoS_S",
        "text": "EDoS_S \u2014 single-source cloud sustainability denial"
      },
      {
        "id": "EDoS_D",
        "text": "EDoS_D \u2014 distributed cloud sustainability denial"
      },
      {
        "id": "DoW",
        "text": "DoW \u2014 single-source serverless billing denial"
      },
      {
        "id": "DDoW",
        "text": "DDoW \u2014 distributed serverless billing denial"
      },
      {
        "id": "DoA",
        "text": "DoA \u2014 AI-targeted denial"
      }
    ],
    "correct": [
      "DoS"
    ],
    "explanation": "Single-source denial maps to DoS.",
    "learnMore": "evidence.html"
  },
  {
    "id": 43,
    "type": "single",
    "prompt": "Y sees multiple sources flooding the service without cloud, serverless or AI evidence. Which class is most precise?",
    "answers": [
      {
        "id": "DoS",
        "text": "DoS \u2014 single-source availability denial"
      },
      {
        "id": "DDoS",
        "text": "DDoS \u2014 distributed availability denial"
      },
      {
        "id": "LDoS",
        "text": "LDoS \u2014 single-source low-rate denial"
      },
      {
        "id": "LDDoS",
        "text": "LDDoS \u2014 distributed low-rate denial"
      },
      {
        "id": "EDoS_S",
        "text": "EDoS_S \u2014 single-source cloud sustainability denial"
      },
      {
        "id": "EDoS_D",
        "text": "EDoS_D \u2014 distributed cloud sustainability denial"
      },
      {
        "id": "DoW",
        "text": "DoW \u2014 single-source serverless billing denial"
      },
      {
        "id": "DDoW",
        "text": "DDoW \u2014 distributed serverless billing denial"
      },
      {
        "id": "DoA",
        "text": "DoA \u2014 AI-targeted denial"
      }
    ],
    "correct": [
      "DDoS"
    ],
    "explanation": "Multiple-source denial maps to DDoS.",
    "learnMore": "evidence.html"
  },
  {
    "id": 44,
    "type": "single",
    "prompt": "A small cafe earns $10,000/month and depends mainly on online ordering. It can mitigate one family first. Which should it prioritise if outages stop orders immediately?",
    "answers": [
      {
        "id": "Availability attacks",
        "text": "Availability attacks"
      },
      {
        "id": "Sustainability attacks",
        "text": "Sustainability attacks"
      },
      {
        "id": "Both families",
        "text": "Both families"
      },
      {
        "id": "Neither family",
        "text": "Neither family"
      }
    ],
    "correct": [
      "Availability attacks"
    ],
    "explanation": "If revenue depends on customers reaching the ordering service, availability attacks can immediately interrupt sales.",
    "learnMore": "simulator.html"
  },
  {
    "id": 45,
    "type": "single",
    "prompt": "A SaaS startup has uncapped cloud autoscaling and weak budget alerts. Which family should it prioritise first?",
    "answers": [
      {
        "id": "Availability attacks",
        "text": "Availability attacks"
      },
      {
        "id": "Sustainability attacks",
        "text": "Sustainability attacks"
      },
      {
        "id": "Both families",
        "text": "Both families"
      },
      {
        "id": "Neither family",
        "text": "Neither family"
      }
    ],
    "correct": [
      "Sustainability attacks"
    ],
    "explanation": "Uncapped cloud scaling creates economic exposure to EDoS and related sustainability attacks.",
    "learnMore": "simulator.html"
  },
  {
    "id": 46,
    "type": "single",
    "prompt": "A restaurant uses serverless functions for QR-code ordering and has no invocation limits. Which family should it prioritise?",
    "answers": [
      {
        "id": "Availability attacks",
        "text": "Availability attacks"
      },
      {
        "id": "Sustainability attacks",
        "text": "Sustainability attacks"
      },
      {
        "id": "Both families",
        "text": "Both families"
      },
      {
        "id": "Neither family",
        "text": "Neither family"
      }
    ],
    "correct": [
      "Sustainability attacks"
    ],
    "explanation": "Serverless invocation exposure makes DoW/DDoW risk especially relevant.",
    "learnMore": "simulator.html"
  },
  {
    "id": 47,
    "type": "single",
    "prompt": "A firm uses AI chatbots with paid API tokens and no token caps. Which family should it prioritise?",
    "answers": [
      {
        "id": "Availability attacks",
        "text": "Availability attacks"
      },
      {
        "id": "Sustainability attacks",
        "text": "Sustainability attacks"
      },
      {
        "id": "Both families",
        "text": "Both families"
      },
      {
        "id": "Neither family",
        "text": "Neither family"
      }
    ],
    "correct": [
      "Sustainability attacks"
    ],
    "explanation": "AI token/model-call exposure is a sustainability concern under DoA.",
    "learnMore": "simulator.html"
  },
  {
    "id": 48,
    "type": "single",
    "prompt": "A local business has no online revenue but relies on its website for emergency customer notices. Which family should it prioritise?",
    "answers": [
      {
        "id": "Availability attacks",
        "text": "Availability attacks"
      },
      {
        "id": "Sustainability attacks",
        "text": "Sustainability attacks"
      },
      {
        "id": "Both families",
        "text": "Both families"
      },
      {
        "id": "Neither family",
        "text": "Neither family"
      }
    ],
    "correct": [
      "Availability attacks"
    ],
    "explanation": "When reachability matters more than metered billing, availability attacks should be prioritised.",
    "learnMore": "simulator.html"
  },
  {
    "id": 49,
    "type": "single",
    "prompt": "A large business earns $60,000,000/year and uses uncapped cloud plus AI APIs. Which risk deserves special board-level attention?",
    "answers": [
      {
        "id": "Availability attacks",
        "text": "Availability attacks"
      },
      {
        "id": "Sustainability attacks",
        "text": "Sustainability attacks"
      },
      {
        "id": "Both families",
        "text": "Both families"
      },
      {
        "id": "Neither family",
        "text": "Neither family"
      }
    ],
    "correct": [
      "Both families"
    ],
    "explanation": "Large organisations can experience both outage loss and metered sustainability cost exposure.",
    "learnMore": "simulator.html"
  },
  {
    "id": 50,
    "type": "single",
    "prompt": "Which attack class is most directly addressed by this control: \"Apply per-source rate limits and harden endpoint timeouts.\"?",
    "answers": [
      {
        "id": "DoS",
        "text": "DoS"
      },
      {
        "id": "DDoS",
        "text": "DDoS"
      },
      {
        "id": "LDoS",
        "text": "LDoS"
      },
      {
        "id": "LDDoS",
        "text": "LDDoS"
      },
      {
        "id": "EDoS_S",
        "text": "EDoS_S"
      },
      {
        "id": "EDoS_D",
        "text": "EDoS_D"
      },
      {
        "id": "DoW",
        "text": "DoW"
      },
      {
        "id": "DDoW",
        "text": "DDoW"
      },
      {
        "id": "DoA",
        "text": "DoA"
      }
    ],
    "correct": [
      "DoS"
    ],
    "explanation": "Single-source containment, throttling, and endpoint hardening are appropriate for DoS.",
    "learnMore": "mitigations.html"
  },
  {
    "id": 51,
    "type": "single",
    "prompt": "Which attack class is most directly addressed by this control: \"Use CDN/anycast protection, traffic scrubbing, and upstream filtering.\"?",
    "answers": [
      {
        "id": "DoS",
        "text": "DoS"
      },
      {
        "id": "DDoS",
        "text": "DDoS"
      },
      {
        "id": "LDoS",
        "text": "LDoS"
      },
      {
        "id": "LDDoS",
        "text": "LDDoS"
      },
      {
        "id": "EDoS_S",
        "text": "EDoS_S"
      },
      {
        "id": "EDoS_D",
        "text": "EDoS_D"
      },
      {
        "id": "DoW",
        "text": "DoW"
      },
      {
        "id": "DDoW",
        "text": "DDoW"
      },
      {
        "id": "DoA",
        "text": "DoA"
      }
    ],
    "correct": [
      "DDoS"
    ],
    "explanation": "Distributed sources require upstream absorption and scrubbing.",
    "learnMore": "mitigations.html"
  },
  {
    "id": 52,
    "type": "single",
    "prompt": "Which attack class is most directly addressed by this control: \"Use behavioural thresholds for timing, periodicity, long requests, and low-volume degradation.\"?",
    "answers": [
      {
        "id": "DoS",
        "text": "DoS"
      },
      {
        "id": "DDoS",
        "text": "DDoS"
      },
      {
        "id": "LDoS",
        "text": "LDoS"
      },
      {
        "id": "LDDoS",
        "text": "LDDoS"
      },
      {
        "id": "EDoS_S",
        "text": "EDoS_S"
      },
      {
        "id": "EDoS_D",
        "text": "EDoS_D"
      },
      {
        "id": "DoW",
        "text": "DoW"
      },
      {
        "id": "DDoW",
        "text": "DDoW"
      },
      {
        "id": "DoA",
        "text": "DoA"
      }
    ],
    "correct": [
      "LDoS"
    ],
    "explanation": "LDoS is not necessarily high volume, so timing and slow-resource behaviour matter.",
    "learnMore": "mitigations.html"
  },
  {
    "id": 53,
    "type": "single",
    "prompt": "Which attack class is most directly addressed by this control: \"Correlate low-rate timing patterns across many sources and apply aggregate adaptive throttling.\"?",
    "answers": [
      {
        "id": "DoS",
        "text": "DoS"
      },
      {
        "id": "DDoS",
        "text": "DDoS"
      },
      {
        "id": "LDoS",
        "text": "LDoS"
      },
      {
        "id": "LDDoS",
        "text": "LDDoS"
      },
      {
        "id": "EDoS_S",
        "text": "EDoS_S"
      },
      {
        "id": "EDoS_D",
        "text": "EDoS_D"
      },
      {
        "id": "DoW",
        "text": "DoW"
      },
      {
        "id": "DDoW",
        "text": "DDoW"
      },
      {
        "id": "DoA",
        "text": "DoA"
      }
    ],
    "correct": [
      "LDDoS"
    ],
    "explanation": "LDDoS requires cross-source correlation because each source may appear harmless alone.",
    "learnMore": "mitigations.html"
  },
  {
    "id": 54,
    "type": "single",
    "prompt": "Which attack class is most directly addressed by this control: \"Set cloud budgets, spend alerts, service quotas, autoscaling ceilings, and per-tenant consumption limits.\"?",
    "answers": [
      {
        "id": "DoS",
        "text": "DoS"
      },
      {
        "id": "DDoS",
        "text": "DDoS"
      },
      {
        "id": "LDoS",
        "text": "LDoS"
      },
      {
        "id": "LDDoS",
        "text": "LDDoS"
      },
      {
        "id": "EDoS_S",
        "text": "EDoS_S"
      },
      {
        "id": "EDoS_D",
        "text": "EDoS_D"
      },
      {
        "id": "DoW",
        "text": "DoW"
      },
      {
        "id": "DDoW",
        "text": "DDoW"
      },
      {
        "id": "DoA",
        "text": "DoA"
      }
    ],
    "correct": [
      "EDoS_S"
    ],
    "explanation": "Single-source EDoS needs cost guardrails and cloud scaling limits.",
    "learnMore": "mitigations.html"
  },
  {
    "id": 55,
    "type": "single",
    "prompt": "Which attack class is most directly addressed by this control: \"Combine DDoS filtering with cloud budgets, autoscaling ceilings, and origin shielding.\"?",
    "answers": [
      {
        "id": "DoS",
        "text": "DoS"
      },
      {
        "id": "DDoS",
        "text": "DDoS"
      },
      {
        "id": "LDoS",
        "text": "LDoS"
      },
      {
        "id": "LDDoS",
        "text": "LDDoS"
      },
      {
        "id": "EDoS_S",
        "text": "EDoS_S"
      },
      {
        "id": "EDoS_D",
        "text": "EDoS_D"
      },
      {
        "id": "DoW",
        "text": "DoW"
      },
      {
        "id": "DDoW",
        "text": "DDoW"
      },
      {
        "id": "DoA",
        "text": "DoA"
      }
    ],
    "correct": [
      "EDoS_D"
    ],
    "explanation": "Distributed cloud sustainability attacks require both traffic and cost controls.",
    "learnMore": "mitigations.html"
  },
  {
    "id": 56,
    "type": "single",
    "prompt": "Which attack class is most directly addressed by this control: \"Set per-function concurrency limits, invocation quotas, timeout caps, and retry limits.\"?",
    "answers": [
      {
        "id": "DoS",
        "text": "DoS"
      },
      {
        "id": "DDoS",
        "text": "DDoS"
      },
      {
        "id": "LDoS",
        "text": "LDoS"
      },
      {
        "id": "LDDoS",
        "text": "LDDoS"
      },
      {
        "id": "EDoS_S",
        "text": "EDoS_S"
      },
      {
        "id": "EDoS_D",
        "text": "EDoS_D"
      },
      {
        "id": "DoW",
        "text": "DoW"
      },
      {
        "id": "DDoW",
        "text": "DDoW"
      },
      {
        "id": "DoA",
        "text": "DoA"
      }
    ],
    "correct": [
      "DoW"
    ],
    "explanation": "DoW targets serverless invocation and duration billing.",
    "learnMore": "mitigations.html"
  },
  {
    "id": 57,
    "type": "single",
    "prompt": "Which attack class is most directly addressed by this control: \"Use edge filtering before function execution and configure concurrency, timeout, retry, and event-chain caps.\"?",
    "answers": [
      {
        "id": "DoS",
        "text": "DoS"
      },
      {
        "id": "DDoS",
        "text": "DDoS"
      },
      {
        "id": "LDoS",
        "text": "LDoS"
      },
      {
        "id": "LDDoS",
        "text": "LDDoS"
      },
      {
        "id": "EDoS_S",
        "text": "EDoS_S"
      },
      {
        "id": "EDoS_D",
        "text": "EDoS_D"
      },
      {
        "id": "DoW",
        "text": "DoW"
      },
      {
        "id": "DDoW",
        "text": "DDoW"
      },
      {
        "id": "DoA",
        "text": "DoA"
      }
    ],
    "correct": [
      "DDoW"
    ],
    "explanation": "DDoW combines distributed ingress with serverless billing exposure.",
    "learnMore": "mitigations.html"
  },
  {
    "id": 58,
    "type": "single",
    "prompt": "Which attack class is most directly addressed by this control: \"Set token budgets, model-call quotas, context limits, tool-call caps, and agent recursion limits.\"?",
    "answers": [
      {
        "id": "DoS",
        "text": "DoS"
      },
      {
        "id": "DDoS",
        "text": "DDoS"
      },
      {
        "id": "LDoS",
        "text": "LDoS"
      },
      {
        "id": "LDDoS",
        "text": "LDDoS"
      },
      {
        "id": "EDoS_S",
        "text": "EDoS_S"
      },
      {
        "id": "EDoS_D",
        "text": "EDoS_D"
      },
      {
        "id": "DoW",
        "text": "DoW"
      },
      {
        "id": "DDoW",
        "text": "DDoW"
      },
      {
        "id": "DoA",
        "text": "DoA"
      }
    ],
    "correct": [
      "DoA"
    ],
    "explanation": "DoA targets AI inference and AI-platform consumption.",
    "learnMore": "mitigations.html"
  },
  {
    "id": 59,
    "type": "single",
    "prompt": "What condition turns an availability attack into a cloud sustainability attack?",
    "answers": [
      {
        "id": "C0",
        "text": "C0 \u2014 Denial activity exists"
      },
      {
        "id": "C1",
        "text": "C1 \u2014 Single-source activity"
      },
      {
        "id": "C2",
        "text": "C2 \u2014 Multiple-source/distributed activity"
      },
      {
        "id": "C3",
        "text": "C3 \u2014 Low-rate or low-visibility behaviour"
      },
      {
        "id": "C4",
        "text": "C4 \u2014 Cloud-targeted sustainability exposure"
      },
      {
        "id": "C5",
        "text": "C5 \u2014 Serverless/FaaS exposure"
      },
      {
        "id": "C6",
        "text": "C6 \u2014 AI-targeted resource exposure"
      }
    ],
    "correct": [
      "C4"
    ],
    "explanation": "C4 is the cloud-targeted condition that introduces elastic/cloud cost exposure.",
    "learnMore": "index.html"
  },
  {
    "id": 60,
    "type": "single",
    "prompt": "What condition turns EDoS into DoW or DDoW?",
    "answers": [
      {
        "id": "C0",
        "text": "C0 \u2014 Denial activity exists"
      },
      {
        "id": "C1",
        "text": "C1 \u2014 Single-source activity"
      },
      {
        "id": "C2",
        "text": "C2 \u2014 Multiple-source/distributed activity"
      },
      {
        "id": "C3",
        "text": "C3 \u2014 Low-rate or low-visibility behaviour"
      },
      {
        "id": "C4",
        "text": "C4 \u2014 Cloud-targeted sustainability exposure"
      },
      {
        "id": "C5",
        "text": "C5 \u2014 Serverless/FaaS exposure"
      },
      {
        "id": "C6",
        "text": "C6 \u2014 AI-targeted resource exposure"
      }
    ],
    "correct": [
      "C5"
    ],
    "explanation": "C5 adds serverless/FaaS exposure.",
    "learnMore": "index.html"
  },
  {
    "id": 61,
    "type": "single",
    "prompt": "What condition identifies AI-targeted denial?",
    "answers": [
      {
        "id": "C0",
        "text": "C0 \u2014 Denial activity exists"
      },
      {
        "id": "C1",
        "text": "C1 \u2014 Single-source activity"
      },
      {
        "id": "C2",
        "text": "C2 \u2014 Multiple-source/distributed activity"
      },
      {
        "id": "C3",
        "text": "C3 \u2014 Low-rate or low-visibility behaviour"
      },
      {
        "id": "C4",
        "text": "C4 \u2014 Cloud-targeted sustainability exposure"
      },
      {
        "id": "C5",
        "text": "C5 \u2014 Serverless/FaaS exposure"
      },
      {
        "id": "C6",
        "text": "C6 \u2014 AI-targeted resource exposure"
      }
    ],
    "correct": [
      "C6"
    ],
    "explanation": "C6 captures AI inference, token, tool-call, context, multimodal or agentic resource exposure.",
    "learnMore": "index.html"
  },
  {
    "id": 62,
    "type": "single",
    "prompt": "Which source condition is required for DDoS, LDDoS, EDoS_D and DDoW?",
    "answers": [
      {
        "id": "C0",
        "text": "C0 \u2014 Denial activity exists"
      },
      {
        "id": "C1",
        "text": "C1 \u2014 Single-source activity"
      },
      {
        "id": "C2",
        "text": "C2 \u2014 Multiple-source/distributed activity"
      },
      {
        "id": "C3",
        "text": "C3 \u2014 Low-rate or low-visibility behaviour"
      },
      {
        "id": "C4",
        "text": "C4 \u2014 Cloud-targeted sustainability exposure"
      },
      {
        "id": "C5",
        "text": "C5 \u2014 Serverless/FaaS exposure"
      },
      {
        "id": "C6",
        "text": "C6 \u2014 AI-targeted resource exposure"
      }
    ],
    "correct": [
      "C2"
    ],
    "explanation": "C2 identifies multiple-source or distributed activity.",
    "learnMore": "index.html"
  },
  {
    "id": 63,
    "type": "single",
    "prompt": "Which source condition is required for DoS, LDoS, EDoS_S and DoW?",
    "answers": [
      {
        "id": "C0",
        "text": "C0 \u2014 Denial activity exists"
      },
      {
        "id": "C1",
        "text": "C1 \u2014 Single-source activity"
      },
      {
        "id": "C2",
        "text": "C2 \u2014 Multiple-source/distributed activity"
      },
      {
        "id": "C3",
        "text": "C3 \u2014 Low-rate or low-visibility behaviour"
      },
      {
        "id": "C4",
        "text": "C4 \u2014 Cloud-targeted sustainability exposure"
      },
      {
        "id": "C5",
        "text": "C5 \u2014 Serverless/FaaS exposure"
      },
      {
        "id": "C6",
        "text": "C6 \u2014 AI-targeted resource exposure"
      }
    ],
    "correct": [
      "C1"
    ],
    "explanation": "C1 identifies single-source activity.",
    "learnMore": "index.html"
  },
  {
    "id": 64,
    "type": "single",
    "prompt": "Which condition identifies low-rate or low-visibility behaviour?",
    "answers": [
      {
        "id": "C0",
        "text": "C0 \u2014 Denial activity exists"
      },
      {
        "id": "C1",
        "text": "C1 \u2014 Single-source activity"
      },
      {
        "id": "C2",
        "text": "C2 \u2014 Multiple-source/distributed activity"
      },
      {
        "id": "C3",
        "text": "C3 \u2014 Low-rate or low-visibility behaviour"
      },
      {
        "id": "C4",
        "text": "C4 \u2014 Cloud-targeted sustainability exposure"
      },
      {
        "id": "C5",
        "text": "C5 \u2014 Serverless/FaaS exposure"
      },
      {
        "id": "C6",
        "text": "C6 \u2014 AI-targeted resource exposure"
      }
    ],
    "correct": [
      "C3"
    ],
    "explanation": "C3 captures low-rate, periodic or stealthy behaviour.",
    "learnMore": "index.html"
  },
  {
    "id": 65,
    "type": "single",
    "prompt": "Which condition is universal across every denial class in this taxonomy?",
    "answers": [
      {
        "id": "C0",
        "text": "C0 \u2014 Denial activity exists"
      },
      {
        "id": "C1",
        "text": "C1 \u2014 Single-source activity"
      },
      {
        "id": "C2",
        "text": "C2 \u2014 Multiple-source/distributed activity"
      },
      {
        "id": "C3",
        "text": "C3 \u2014 Low-rate or low-visibility behaviour"
      },
      {
        "id": "C4",
        "text": "C4 \u2014 Cloud-targeted sustainability exposure"
      },
      {
        "id": "C5",
        "text": "C5 \u2014 Serverless/FaaS exposure"
      },
      {
        "id": "C6",
        "text": "C6 \u2014 AI-targeted resource exposure"
      }
    ],
    "correct": [
      "C0"
    ],
    "explanation": "C0 is the base condition: denial activity exists.",
    "learnMore": "index.html"
  },
  {
    "id": 66,
    "type": "single",
    "prompt": "Y gets one defensive purchase for a suspected LDoS. Which option best aligns with the website mitigation page?",
    "answers": [
      {
        "id": "Use behavioural thresholds for timing, periodicity, long requests, and low-volume degradation.",
        "text": "Use behavioural thresholds for timing, periodicity, long requests, and low-volume degradation."
      },
      {
        "id": "Apply per-source rate limits and harden endpoint timeouts.",
        "text": "Apply per-source rate limits and harden endpoint timeouts."
      },
      {
        "id": "Use CDN/anycast protection, traffic scrubbing, and upstream filtering.",
        "text": "Use CDN/anycast protection, traffic scrubbing, and upstream filtering."
      },
      {
        "id": "Correlate low-rate timing patterns across many sources and apply aggregate adaptive throttling.",
        "text": "Correlate low-rate timing patterns across many sources and apply aggregate adaptive throttling."
      }
    ],
    "correct": [
      "Use behavioural thresholds for timing, periodicity, long requests, and low-volume degradation."
    ],
    "explanation": "LDoS is not necessarily high volume, so timing and slow-resource behaviour matter.",
    "learnMore": "mitigations.html"
  },
  {
    "id": 67,
    "type": "single",
    "prompt": "Y gets one defensive purchase for a suspected LDDoS. Which option best aligns with the website mitigation page?",
    "answers": [
      {
        "id": "Correlate low-rate timing patterns across many sources and apply aggregate adaptive throttling.",
        "text": "Correlate low-rate timing patterns across many sources and apply aggregate adaptive throttling."
      },
      {
        "id": "Apply per-source rate limits and harden endpoint timeouts.",
        "text": "Apply per-source rate limits and harden endpoint timeouts."
      },
      {
        "id": "Use CDN/anycast protection, traffic scrubbing, and upstream filtering.",
        "text": "Use CDN/anycast protection, traffic scrubbing, and upstream filtering."
      },
      {
        "id": "Use behavioural thresholds for timing, periodicity, long requests, and low-volume degradation.",
        "text": "Use behavioural thresholds for timing, periodicity, long requests, and low-volume degradation."
      }
    ],
    "correct": [
      "Correlate low-rate timing patterns across many sources and apply aggregate adaptive throttling."
    ],
    "explanation": "LDDoS requires cross-source correlation because each source may appear harmless alone.",
    "learnMore": "mitigations.html"
  },
  {
    "id": 68,
    "type": "single",
    "prompt": "Y gets one defensive purchase for a suspected EDoS_S. Which option best aligns with the website mitigation page?",
    "answers": [
      {
        "id": "Set cloud budgets, spend alerts, service quotas, autoscaling ceilings, and per-tenant consumption limits.",
        "text": "Set cloud budgets, spend alerts, service quotas, autoscaling ceilings, and per-tenant consumption limits."
      },
      {
        "id": "Apply per-source rate limits and harden endpoint timeouts.",
        "text": "Apply per-source rate limits and harden endpoint timeouts."
      },
      {
        "id": "Use CDN/anycast protection, traffic scrubbing, and upstream filtering.",
        "text": "Use CDN/anycast protection, traffic scrubbing, and upstream filtering."
      },
      {
        "id": "Use behavioural thresholds for timing, periodicity, long requests, and low-volume degradation.",
        "text": "Use behavioural thresholds for timing, periodicity, long requests, and low-volume degradation."
      }
    ],
    "correct": [
      "Set cloud budgets, spend alerts, service quotas, autoscaling ceilings, and per-tenant consumption limits."
    ],
    "explanation": "Single-source EDoS needs cost guardrails and cloud scaling limits.",
    "learnMore": "mitigations.html"
  },
  {
    "id": 69,
    "type": "single",
    "prompt": "Y gets one defensive purchase for a suspected EDoS_D. Which option best aligns with the website mitigation page?",
    "answers": [
      {
        "id": "Combine DDoS filtering with cloud budgets, autoscaling ceilings, and origin shielding.",
        "text": "Combine DDoS filtering with cloud budgets, autoscaling ceilings, and origin shielding."
      },
      {
        "id": "Apply per-source rate limits and harden endpoint timeouts.",
        "text": "Apply per-source rate limits and harden endpoint timeouts."
      },
      {
        "id": "Use CDN/anycast protection, traffic scrubbing, and upstream filtering.",
        "text": "Use CDN/anycast protection, traffic scrubbing, and upstream filtering."
      },
      {
        "id": "Use behavioural thresholds for timing, periodicity, long requests, and low-volume degradation.",
        "text": "Use behavioural thresholds for timing, periodicity, long requests, and low-volume degradation."
      }
    ],
    "correct": [
      "Combine DDoS filtering with cloud budgets, autoscaling ceilings, and origin shielding."
    ],
    "explanation": "Distributed cloud sustainability attacks require both traffic and cost controls.",
    "learnMore": "mitigations.html"
  },
  {
    "id": 70,
    "type": "single",
    "prompt": "Y gets one defensive purchase for a suspected DoW. Which option best aligns with the website mitigation page?",
    "answers": [
      {
        "id": "Set per-function concurrency limits, invocation quotas, timeout caps, and retry limits.",
        "text": "Set per-function concurrency limits, invocation quotas, timeout caps, and retry limits."
      },
      {
        "id": "Apply per-source rate limits and harden endpoint timeouts.",
        "text": "Apply per-source rate limits and harden endpoint timeouts."
      },
      {
        "id": "Use CDN/anycast protection, traffic scrubbing, and upstream filtering.",
        "text": "Use CDN/anycast protection, traffic scrubbing, and upstream filtering."
      },
      {
        "id": "Use behavioural thresholds for timing, periodicity, long requests, and low-volume degradation.",
        "text": "Use behavioural thresholds for timing, periodicity, long requests, and low-volume degradation."
      }
    ],
    "correct": [
      "Set per-function concurrency limits, invocation quotas, timeout caps, and retry limits."
    ],
    "explanation": "DoW targets serverless invocation and duration billing.",
    "learnMore": "mitigations.html"
  },
  {
    "id": 71,
    "type": "single",
    "prompt": "Y gets one defensive purchase for a suspected DDoW. Which option best aligns with the website mitigation page?",
    "answers": [
      {
        "id": "Use edge filtering before function execution and configure concurrency, timeout, retry, and event-chain caps.",
        "text": "Use edge filtering before function execution and configure concurrency, timeout, retry, and event-chain caps."
      },
      {
        "id": "Apply per-source rate limits and harden endpoint timeouts.",
        "text": "Apply per-source rate limits and harden endpoint timeouts."
      },
      {
        "id": "Use CDN/anycast protection, traffic scrubbing, and upstream filtering.",
        "text": "Use CDN/anycast protection, traffic scrubbing, and upstream filtering."
      },
      {
        "id": "Use behavioural thresholds for timing, periodicity, long requests, and low-volume degradation.",
        "text": "Use behavioural thresholds for timing, periodicity, long requests, and low-volume degradation."
      }
    ],
    "correct": [
      "Use edge filtering before function execution and configure concurrency, timeout, retry, and event-chain caps."
    ],
    "explanation": "DDoW combines distributed ingress with serverless billing exposure.",
    "learnMore": "mitigations.html"
  },
  {
    "id": 72,
    "type": "single",
    "prompt": "Y gets one defensive purchase for a suspected DoA. Which option best aligns with the website mitigation page?",
    "answers": [
      {
        "id": "Set token budgets, model-call quotas, context limits, tool-call caps, and agent recursion limits.",
        "text": "Set token budgets, model-call quotas, context limits, tool-call caps, and agent recursion limits."
      },
      {
        "id": "Apply per-source rate limits and harden endpoint timeouts.",
        "text": "Apply per-source rate limits and harden endpoint timeouts."
      },
      {
        "id": "Use CDN/anycast protection, traffic scrubbing, and upstream filtering.",
        "text": "Use CDN/anycast protection, traffic scrubbing, and upstream filtering."
      },
      {
        "id": "Use behavioural thresholds for timing, periodicity, long requests, and low-volume degradation.",
        "text": "Use behavioural thresholds for timing, periodicity, long requests, and low-volume degradation."
      }
    ],
    "correct": [
      "Set token budgets, model-call quotas, context limits, tool-call caps, and agent recursion limits."
    ],
    "explanation": "DoA targets AI inference and AI-platform consumption.",
    "learnMore": "mitigations.html"
  },
  {
    "id": 73,
    "type": "single",
    "prompt": "X wants DoS but wants it to stay within the D-ACT taxonomy. Which statement is correct?",
    "answers": [
      {
        "id": "DoS requires C0, C1",
        "text": "DoS requires C0, C1"
      },
      {
        "id": "DDoS requires C0, C2",
        "text": "DDoS requires C0, C2"
      },
      {
        "id": "LDoS requires C0, C1, C3",
        "text": "LDoS requires C0, C1, C3"
      },
      {
        "id": "LDDoS requires C0, C2, C3",
        "text": "LDDoS requires C0, C2, C3"
      }
    ],
    "correct": [
      "DoS requires C0, C1"
    ],
    "explanation": "DoS is defined by the condition set C0, C1.",
    "learnMore": "index.html"
  },
  {
    "id": 74,
    "type": "single",
    "prompt": "X wants DDoS but wants it to stay within the D-ACT taxonomy. Which statement is correct?",
    "answers": [
      {
        "id": "DDoS requires C0, C2",
        "text": "DDoS requires C0, C2"
      },
      {
        "id": "DoS requires C0, C1",
        "text": "DoS requires C0, C1"
      },
      {
        "id": "LDoS requires C0, C1, C3",
        "text": "LDoS requires C0, C1, C3"
      },
      {
        "id": "LDDoS requires C0, C2, C3",
        "text": "LDDoS requires C0, C2, C3"
      }
    ],
    "correct": [
      "DDoS requires C0, C2"
    ],
    "explanation": "DDoS is defined by the condition set C0, C2.",
    "learnMore": "index.html"
  },
  {
    "id": 75,
    "type": "single",
    "prompt": "X wants LDoS but wants it to stay within the D-ACT taxonomy. Which statement is correct?",
    "answers": [
      {
        "id": "LDoS requires C0, C1, C3",
        "text": "LDoS requires C0, C1, C3"
      },
      {
        "id": "DoS requires C0, C1",
        "text": "DoS requires C0, C1"
      },
      {
        "id": "DDoS requires C0, C2",
        "text": "DDoS requires C0, C2"
      },
      {
        "id": "LDDoS requires C0, C2, C3",
        "text": "LDDoS requires C0, C2, C3"
      }
    ],
    "correct": [
      "LDoS requires C0, C1, C3"
    ],
    "explanation": "LDoS is defined by the condition set C0, C1, C3.",
    "learnMore": "index.html"
  },
  {
    "id": 76,
    "type": "single",
    "prompt": "X wants LDDoS but wants it to stay within the D-ACT taxonomy. Which statement is correct?",
    "answers": [
      {
        "id": "LDDoS requires C0, C2, C3",
        "text": "LDDoS requires C0, C2, C3"
      },
      {
        "id": "DoS requires C0, C1",
        "text": "DoS requires C0, C1"
      },
      {
        "id": "DDoS requires C0, C2",
        "text": "DDoS requires C0, C2"
      },
      {
        "id": "LDoS requires C0, C1, C3",
        "text": "LDoS requires C0, C1, C3"
      }
    ],
    "correct": [
      "LDDoS requires C0, C2, C3"
    ],
    "explanation": "LDDoS is defined by the condition set C0, C2, C3.",
    "learnMore": "index.html"
  },
  {
    "id": 77,
    "type": "single",
    "prompt": "X wants EDoS_S but wants it to stay within the D-ACT taxonomy. Which statement is correct?",
    "answers": [
      {
        "id": "EDoS_S requires C0, C1, C4",
        "text": "EDoS_S requires C0, C1, C4"
      },
      {
        "id": "DoS requires C0, C1",
        "text": "DoS requires C0, C1"
      },
      {
        "id": "DDoS requires C0, C2",
        "text": "DDoS requires C0, C2"
      },
      {
        "id": "LDoS requires C0, C1, C3",
        "text": "LDoS requires C0, C1, C3"
      }
    ],
    "correct": [
      "EDoS_S requires C0, C1, C4"
    ],
    "explanation": "EDoS_S is defined by the condition set C0, C1, C4.",
    "learnMore": "index.html"
  },
  {
    "id": 78,
    "type": "single",
    "prompt": "X wants EDoS_D but wants it to stay within the D-ACT taxonomy. Which statement is correct?",
    "answers": [
      {
        "id": "EDoS_D requires C0, C2, C4",
        "text": "EDoS_D requires C0, C2, C4"
      },
      {
        "id": "DoS requires C0, C1",
        "text": "DoS requires C0, C1"
      },
      {
        "id": "DDoS requires C0, C2",
        "text": "DDoS requires C0, C2"
      },
      {
        "id": "LDoS requires C0, C1, C3",
        "text": "LDoS requires C0, C1, C3"
      }
    ],
    "correct": [
      "EDoS_D requires C0, C2, C4"
    ],
    "explanation": "EDoS_D is defined by the condition set C0, C2, C4.",
    "learnMore": "index.html"
  },
  {
    "id": 79,
    "type": "single",
    "prompt": "X wants DoW but wants it to stay within the D-ACT taxonomy. Which statement is correct?",
    "answers": [
      {
        "id": "DoW requires C0, C1, C4, C5",
        "text": "DoW requires C0, C1, C4, C5"
      },
      {
        "id": "DoS requires C0, C1",
        "text": "DoS requires C0, C1"
      },
      {
        "id": "DDoS requires C0, C2",
        "text": "DDoS requires C0, C2"
      },
      {
        "id": "LDoS requires C0, C1, C3",
        "text": "LDoS requires C0, C1, C3"
      }
    ],
    "correct": [
      "DoW requires C0, C1, C4, C5"
    ],
    "explanation": "DoW is defined by the condition set C0, C1, C4, C5.",
    "learnMore": "index.html"
  },
  {
    "id": 80,
    "type": "single",
    "prompt": "X wants DDoW but wants it to stay within the D-ACT taxonomy. Which statement is correct?",
    "answers": [
      {
        "id": "DDoW requires C0, C2, C4, C5",
        "text": "DDoW requires C0, C2, C4, C5"
      },
      {
        "id": "DoS requires C0, C1",
        "text": "DoS requires C0, C1"
      },
      {
        "id": "DDoS requires C0, C2",
        "text": "DDoS requires C0, C2"
      },
      {
        "id": "LDoS requires C0, C1, C3",
        "text": "LDoS requires C0, C1, C3"
      }
    ],
    "correct": [
      "DDoW requires C0, C2, C4, C5"
    ],
    "explanation": "DDoW is defined by the condition set C0, C2, C4, C5.",
    "learnMore": "index.html"
  },
  {
    "id": 81,
    "type": "single",
    "prompt": "X wants DoA but wants it to stay within the D-ACT taxonomy. Which statement is correct?",
    "answers": [
      {
        "id": "DoA requires C0, C6",
        "text": "DoA requires C0, C6"
      },
      {
        "id": "DoS requires C0, C1",
        "text": "DoS requires C0, C1"
      },
      {
        "id": "DDoS requires C0, C2",
        "text": "DDoS requires C0, C2"
      },
      {
        "id": "LDoS requires C0, C1, C3",
        "text": "LDoS requires C0, C1, C3"
      }
    ],
    "correct": [
      "DoA requires C0, C6"
    ],
    "explanation": "DoA is defined by the condition set C0, C6.",
    "learnMore": "index.html"
  },
  {
    "id": 82,
    "type": "single",
    "prompt": "Y gets one defensive purchase for a suspected DoS. Which option best aligns with the website mitigation page?",
    "answers": [
      {
        "id": "Apply per-source rate limits and harden endpoint timeouts.",
        "text": "Apply per-source rate limits and harden endpoint timeouts."
      },
      {
        "id": "Use CDN/anycast protection, traffic scrubbing, and upstream filtering.",
        "text": "Use CDN/anycast protection, traffic scrubbing, and upstream filtering."
      },
      {
        "id": "Use behavioural thresholds for timing, periodicity, long requests, and low-volume degradation.",
        "text": "Use behavioural thresholds for timing, periodicity, long requests, and low-volume degradation."
      },
      {
        "id": "Correlate low-rate timing patterns across many sources and apply aggregate adaptive throttling.",
        "text": "Correlate low-rate timing patterns across many sources and apply aggregate adaptive throttling."
      }
    ],
    "correct": [
      "Apply per-source rate limits and harden endpoint timeouts."
    ],
    "explanation": "Single-source containment, throttling, and endpoint hardening are appropriate for DoS.",
    "learnMore": "mitigations.html"
  },
  {
    "id": 83,
    "type": "single",
    "prompt": "Y gets one defensive purchase for a suspected DDoS. Which option best aligns with the website mitigation page?",
    "answers": [
      {
        "id": "Use CDN/anycast protection, traffic scrubbing, and upstream filtering.",
        "text": "Use CDN/anycast protection, traffic scrubbing, and upstream filtering."
      },
      {
        "id": "Apply per-source rate limits and harden endpoint timeouts.",
        "text": "Apply per-source rate limits and harden endpoint timeouts."
      },
      {
        "id": "Use behavioural thresholds for timing, periodicity, long requests, and low-volume degradation.",
        "text": "Use behavioural thresholds for timing, periodicity, long requests, and low-volume degradation."
      },
      {
        "id": "Correlate low-rate timing patterns across many sources and apply aggregate adaptive throttling.",
        "text": "Correlate low-rate timing patterns across many sources and apply aggregate adaptive throttling."
      }
    ],
    "correct": [
      "Use CDN/anycast protection, traffic scrubbing, and upstream filtering."
    ],
    "explanation": "Distributed sources require upstream absorption and scrubbing.",
    "learnMore": "mitigations.html"
  },
  {
    "id": 84,
    "type": "single",
    "prompt": "Y gets one defensive purchase for a suspected LDoS. Which option best aligns with the website mitigation page?",
    "answers": [
      {
        "id": "Use behavioural thresholds for timing, periodicity, long requests, and low-volume degradation.",
        "text": "Use behavioural thresholds for timing, periodicity, long requests, and low-volume degradation."
      },
      {
        "id": "Apply per-source rate limits and harden endpoint timeouts.",
        "text": "Apply per-source rate limits and harden endpoint timeouts."
      },
      {
        "id": "Use CDN/anycast protection, traffic scrubbing, and upstream filtering.",
        "text": "Use CDN/anycast protection, traffic scrubbing, and upstream filtering."
      },
      {
        "id": "Correlate low-rate timing patterns across many sources and apply aggregate adaptive throttling.",
        "text": "Correlate low-rate timing patterns across many sources and apply aggregate adaptive throttling."
      }
    ],
    "correct": [
      "Use behavioural thresholds for timing, periodicity, long requests, and low-volume degradation."
    ],
    "explanation": "LDoS is not necessarily high volume, so timing and slow-resource behaviour matter.",
    "learnMore": "mitigations.html"
  },
  {
    "id": 85,
    "type": "single",
    "prompt": "Y gets one defensive purchase for a suspected LDDoS. Which option best aligns with the website mitigation page?",
    "answers": [
      {
        "id": "Correlate low-rate timing patterns across many sources and apply aggregate adaptive throttling.",
        "text": "Correlate low-rate timing patterns across many sources and apply aggregate adaptive throttling."
      },
      {
        "id": "Apply per-source rate limits and harden endpoint timeouts.",
        "text": "Apply per-source rate limits and harden endpoint timeouts."
      },
      {
        "id": "Use CDN/anycast protection, traffic scrubbing, and upstream filtering.",
        "text": "Use CDN/anycast protection, traffic scrubbing, and upstream filtering."
      },
      {
        "id": "Use behavioural thresholds for timing, periodicity, long requests, and low-volume degradation.",
        "text": "Use behavioural thresholds for timing, periodicity, long requests, and low-volume degradation."
      }
    ],
    "correct": [
      "Correlate low-rate timing patterns across many sources and apply aggregate adaptive throttling."
    ],
    "explanation": "LDDoS requires cross-source correlation because each source may appear harmless alone.",
    "learnMore": "mitigations.html"
  },
  {
    "id": 86,
    "type": "single",
    "prompt": "Y gets one defensive purchase for a suspected EDoS_S. Which option best aligns with the website mitigation page?",
    "answers": [
      {
        "id": "Set cloud budgets, spend alerts, service quotas, autoscaling ceilings, and per-tenant consumption limits.",
        "text": "Set cloud budgets, spend alerts, service quotas, autoscaling ceilings, and per-tenant consumption limits."
      },
      {
        "id": "Apply per-source rate limits and harden endpoint timeouts.",
        "text": "Apply per-source rate limits and harden endpoint timeouts."
      },
      {
        "id": "Use CDN/anycast protection, traffic scrubbing, and upstream filtering.",
        "text": "Use CDN/anycast protection, traffic scrubbing, and upstream filtering."
      },
      {
        "id": "Use behavioural thresholds for timing, periodicity, long requests, and low-volume degradation.",
        "text": "Use behavioural thresholds for timing, periodicity, long requests, and low-volume degradation."
      }
    ],
    "correct": [
      "Set cloud budgets, spend alerts, service quotas, autoscaling ceilings, and per-tenant consumption limits."
    ],
    "explanation": "Single-source EDoS needs cost guardrails and cloud scaling limits.",
    "learnMore": "mitigations.html"
  },
  {
    "id": 87,
    "type": "single",
    "prompt": "Y gets one defensive purchase for a suspected EDoS_D. Which option best aligns with the website mitigation page?",
    "answers": [
      {
        "id": "Combine DDoS filtering with cloud budgets, autoscaling ceilings, and origin shielding.",
        "text": "Combine DDoS filtering with cloud budgets, autoscaling ceilings, and origin shielding."
      },
      {
        "id": "Apply per-source rate limits and harden endpoint timeouts.",
        "text": "Apply per-source rate limits and harden endpoint timeouts."
      },
      {
        "id": "Use CDN/anycast protection, traffic scrubbing, and upstream filtering.",
        "text": "Use CDN/anycast protection, traffic scrubbing, and upstream filtering."
      },
      {
        "id": "Use behavioural thresholds for timing, periodicity, long requests, and low-volume degradation.",
        "text": "Use behavioural thresholds for timing, periodicity, long requests, and low-volume degradation."
      }
    ],
    "correct": [
      "Combine DDoS filtering with cloud budgets, autoscaling ceilings, and origin shielding."
    ],
    "explanation": "Distributed cloud sustainability attacks require both traffic and cost controls.",
    "learnMore": "mitigations.html"
  },
  {
    "id": 88,
    "type": "single",
    "prompt": "Y gets one defensive purchase for a suspected DoW. Which option best aligns with the website mitigation page?",
    "answers": [
      {
        "id": "Set per-function concurrency limits, invocation quotas, timeout caps, and retry limits.",
        "text": "Set per-function concurrency limits, invocation quotas, timeout caps, and retry limits."
      },
      {
        "id": "Apply per-source rate limits and harden endpoint timeouts.",
        "text": "Apply per-source rate limits and harden endpoint timeouts."
      },
      {
        "id": "Use CDN/anycast protection, traffic scrubbing, and upstream filtering.",
        "text": "Use CDN/anycast protection, traffic scrubbing, and upstream filtering."
      },
      {
        "id": "Use behavioural thresholds for timing, periodicity, long requests, and low-volume degradation.",
        "text": "Use behavioural thresholds for timing, periodicity, long requests, and low-volume degradation."
      }
    ],
    "correct": [
      "Set per-function concurrency limits, invocation quotas, timeout caps, and retry limits."
    ],
    "explanation": "DoW targets serverless invocation and duration billing.",
    "learnMore": "mitigations.html"
  },
  {
    "id": 89,
    "type": "single",
    "prompt": "Y gets one defensive purchase for a suspected DDoW. Which option best aligns with the website mitigation page?",
    "answers": [
      {
        "id": "Use edge filtering before function execution and configure concurrency, timeout, retry, and event-chain caps.",
        "text": "Use edge filtering before function execution and configure concurrency, timeout, retry, and event-chain caps."
      },
      {
        "id": "Apply per-source rate limits and harden endpoint timeouts.",
        "text": "Apply per-source rate limits and harden endpoint timeouts."
      },
      {
        "id": "Use CDN/anycast protection, traffic scrubbing, and upstream filtering.",
        "text": "Use CDN/anycast protection, traffic scrubbing, and upstream filtering."
      },
      {
        "id": "Use behavioural thresholds for timing, periodicity, long requests, and low-volume degradation.",
        "text": "Use behavioural thresholds for timing, periodicity, long requests, and low-volume degradation."
      }
    ],
    "correct": [
      "Use edge filtering before function execution and configure concurrency, timeout, retry, and event-chain caps."
    ],
    "explanation": "DDoW combines distributed ingress with serverless billing exposure.",
    "learnMore": "mitigations.html"
  },
  {
    "id": 90,
    "type": "single",
    "prompt": "Y gets one defensive purchase for a suspected DoA. Which option best aligns with the website mitigation page?",
    "answers": [
      {
        "id": "Set token budgets, model-call quotas, context limits, tool-call caps, and agent recursion limits.",
        "text": "Set token budgets, model-call quotas, context limits, tool-call caps, and agent recursion limits."
      },
      {
        "id": "Apply per-source rate limits and harden endpoint timeouts.",
        "text": "Apply per-source rate limits and harden endpoint timeouts."
      },
      {
        "id": "Use CDN/anycast protection, traffic scrubbing, and upstream filtering.",
        "text": "Use CDN/anycast protection, traffic scrubbing, and upstream filtering."
      },
      {
        "id": "Use behavioural thresholds for timing, periodicity, long requests, and low-volume degradation.",
        "text": "Use behavioural thresholds for timing, periodicity, long requests, and low-volume degradation."
      }
    ],
    "correct": [
      "Set token budgets, model-call quotas, context limits, tool-call caps, and agent recursion limits."
    ],
    "explanation": "DoA targets AI inference and AI-platform consumption.",
    "learnMore": "mitigations.html"
  },
  {
    "id": 91,
    "type": "single",
    "prompt": "X wants DoS but wants it to stay within the D-ACT taxonomy. Which statement is correct?",
    "answers": [
      {
        "id": "DoS requires C0, C1",
        "text": "DoS requires C0, C1"
      },
      {
        "id": "DDoS requires C0, C2",
        "text": "DDoS requires C0, C2"
      },
      {
        "id": "LDoS requires C0, C1, C3",
        "text": "LDoS requires C0, C1, C3"
      },
      {
        "id": "LDDoS requires C0, C2, C3",
        "text": "LDDoS requires C0, C2, C3"
      }
    ],
    "correct": [
      "DoS requires C0, C1"
    ],
    "explanation": "DoS is defined by the condition set C0, C1.",
    "learnMore": "index.html"
  },
  {
    "id": 92,
    "type": "single",
    "prompt": "X wants DDoS but wants it to stay within the D-ACT taxonomy. Which statement is correct?",
    "answers": [
      {
        "id": "DDoS requires C0, C2",
        "text": "DDoS requires C0, C2"
      },
      {
        "id": "DoS requires C0, C1",
        "text": "DoS requires C0, C1"
      },
      {
        "id": "LDoS requires C0, C1, C3",
        "text": "LDoS requires C0, C1, C3"
      },
      {
        "id": "LDDoS requires C0, C2, C3",
        "text": "LDDoS requires C0, C2, C3"
      }
    ],
    "correct": [
      "DDoS requires C0, C2"
    ],
    "explanation": "DDoS is defined by the condition set C0, C2.",
    "learnMore": "index.html"
  },
  {
    "id": 93,
    "type": "single",
    "prompt": "X wants LDoS but wants it to stay within the D-ACT taxonomy. Which statement is correct?",
    "answers": [
      {
        "id": "LDoS requires C0, C1, C3",
        "text": "LDoS requires C0, C1, C3"
      },
      {
        "id": "DoS requires C0, C1",
        "text": "DoS requires C0, C1"
      },
      {
        "id": "DDoS requires C0, C2",
        "text": "DDoS requires C0, C2"
      },
      {
        "id": "LDDoS requires C0, C2, C3",
        "text": "LDDoS requires C0, C2, C3"
      }
    ],
    "correct": [
      "LDoS requires C0, C1, C3"
    ],
    "explanation": "LDoS is defined by the condition set C0, C1, C3.",
    "learnMore": "index.html"
  },
  {
    "id": 94,
    "type": "single",
    "prompt": "X wants LDDoS but wants it to stay within the D-ACT taxonomy. Which statement is correct?",
    "answers": [
      {
        "id": "LDDoS requires C0, C2, C3",
        "text": "LDDoS requires C0, C2, C3"
      },
      {
        "id": "DoS requires C0, C1",
        "text": "DoS requires C0, C1"
      },
      {
        "id": "DDoS requires C0, C2",
        "text": "DDoS requires C0, C2"
      },
      {
        "id": "LDoS requires C0, C1, C3",
        "text": "LDoS requires C0, C1, C3"
      }
    ],
    "correct": [
      "LDDoS requires C0, C2, C3"
    ],
    "explanation": "LDDoS is defined by the condition set C0, C2, C3.",
    "learnMore": "index.html"
  },
  {
    "id": 95,
    "type": "single",
    "prompt": "X wants EDoS_S but wants it to stay within the D-ACT taxonomy. Which statement is correct?",
    "answers": [
      {
        "id": "EDoS_S requires C0, C1, C4",
        "text": "EDoS_S requires C0, C1, C4"
      },
      {
        "id": "DoS requires C0, C1",
        "text": "DoS requires C0, C1"
      },
      {
        "id": "DDoS requires C0, C2",
        "text": "DDoS requires C0, C2"
      },
      {
        "id": "LDoS requires C0, C1, C3",
        "text": "LDoS requires C0, C1, C3"
      }
    ],
    "correct": [
      "EDoS_S requires C0, C1, C4"
    ],
    "explanation": "EDoS_S is defined by the condition set C0, C1, C4.",
    "learnMore": "index.html"
  },
  {
    "id": 96,
    "type": "single",
    "prompt": "X wants EDoS_D but wants it to stay within the D-ACT taxonomy. Which statement is correct?",
    "answers": [
      {
        "id": "EDoS_D requires C0, C2, C4",
        "text": "EDoS_D requires C0, C2, C4"
      },
      {
        "id": "DoS requires C0, C1",
        "text": "DoS requires C0, C1"
      },
      {
        "id": "DDoS requires C0, C2",
        "text": "DDoS requires C0, C2"
      },
      {
        "id": "LDoS requires C0, C1, C3",
        "text": "LDoS requires C0, C1, C3"
      }
    ],
    "correct": [
      "EDoS_D requires C0, C2, C4"
    ],
    "explanation": "EDoS_D is defined by the condition set C0, C2, C4.",
    "learnMore": "index.html"
  },
  {
    "id": 97,
    "type": "single",
    "prompt": "X wants DoW but wants it to stay within the D-ACT taxonomy. Which statement is correct?",
    "answers": [
      {
        "id": "DoW requires C0, C1, C4, C5",
        "text": "DoW requires C0, C1, C4, C5"
      },
      {
        "id": "DoS requires C0, C1",
        "text": "DoS requires C0, C1"
      },
      {
        "id": "DDoS requires C0, C2",
        "text": "DDoS requires C0, C2"
      },
      {
        "id": "LDoS requires C0, C1, C3",
        "text": "LDoS requires C0, C1, C3"
      }
    ],
    "correct": [
      "DoW requires C0, C1, C4, C5"
    ],
    "explanation": "DoW is defined by the condition set C0, C1, C4, C5.",
    "learnMore": "index.html"
  },
  {
    "id": 98,
    "type": "single",
    "prompt": "X wants DDoW but wants it to stay within the D-ACT taxonomy. Which statement is correct?",
    "answers": [
      {
        "id": "DDoW requires C0, C2, C4, C5",
        "text": "DDoW requires C0, C2, C4, C5"
      },
      {
        "id": "DoS requires C0, C1",
        "text": "DoS requires C0, C1"
      },
      {
        "id": "DDoS requires C0, C2",
        "text": "DDoS requires C0, C2"
      },
      {
        "id": "LDoS requires C0, C1, C3",
        "text": "LDoS requires C0, C1, C3"
      }
    ],
    "correct": [
      "DDoW requires C0, C2, C4, C5"
    ],
    "explanation": "DDoW is defined by the condition set C0, C2, C4, C5.",
    "learnMore": "index.html"
  },
  {
    "id": 99,
    "type": "single",
    "prompt": "X wants DoA but wants it to stay within the D-ACT taxonomy. Which statement is correct?",
    "answers": [
      {
        "id": "DoA requires C0, C6",
        "text": "DoA requires C0, C6"
      },
      {
        "id": "DoS requires C0, C1",
        "text": "DoS requires C0, C1"
      },
      {
        "id": "DDoS requires C0, C2",
        "text": "DDoS requires C0, C2"
      },
      {
        "id": "LDoS requires C0, C1, C3",
        "text": "LDoS requires C0, C1, C3"
      }
    ],
    "correct": [
      "DoA requires C0, C6"
    ],
    "explanation": "DoA is defined by the condition set C0, C6.",
    "learnMore": "index.html"
  },
  {
    "id": 100,
    "type": "single",
    "prompt": "Y gets one defensive purchase for a suspected DoS. Which option best aligns with the website mitigation page?",
    "answers": [
      {
        "id": "Apply per-source rate limits and harden endpoint timeouts.",
        "text": "Apply per-source rate limits and harden endpoint timeouts."
      },
      {
        "id": "Use CDN/anycast protection, traffic scrubbing, and upstream filtering.",
        "text": "Use CDN/anycast protection, traffic scrubbing, and upstream filtering."
      },
      {
        "id": "Use behavioural thresholds for timing, periodicity, long requests, and low-volume degradation.",
        "text": "Use behavioural thresholds for timing, periodicity, long requests, and low-volume degradation."
      },
      {
        "id": "Correlate low-rate timing patterns across many sources and apply aggregate adaptive throttling.",
        "text": "Correlate low-rate timing patterns across many sources and apply aggregate adaptive throttling."
      }
    ],
    "correct": [
      "Apply per-source rate limits and harden endpoint timeouts."
    ],
    "explanation": "Single-source containment, throttling, and endpoint hardening are appropriate for DoS.",
    "learnMore": "mitigations.html"
  }
];

  const STORAGE_BEST = 'dactGamePersonalBestV1';
  const STORAGE_PROFILE = 'dactGameProfileV1';
  const STORAGE_SCORES = 'dactGameLocalScoresV1';

  let state = {
    profile: null,
    questions: [],
    current: null,
    round: 0,
    score: 0,
    timeLeft: 30,
    timerMax: 30,
    timer: null,
    selected: new Set(),
    running: false,
    best: Number(localStorage.getItem(STORAGE_BEST) || '0'),
    audioCtx: null,
    musicNodes: null,
    musicEnabled: true
  };

  const $ = (id) => document.getElementById(id);

  function shuffle(arr) {
    const copy = arr.slice();
    for (let i = copy.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
  }

  function normaliseAnswers(values) {
    return values.slice().sort().join('|');
  }

  function roundSeconds(round) {
    // Reaches 10 seconds by round 10, then stays at 10.
    return Math.max(10, 30 - Math.ceil((round - 1) * (20 / 9)));
  }

  function loadProfile() {
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_PROFILE) || 'null');
      if (saved) {
        $('attackerName').value = saved.attackerName || '';
        $('victimName').value = saved.victimName || '';
        $('educationLevel').value = saved.educationLevel || 'Small business owner / non-technical';
        $('cyberProficiency').value = saved.cyberProficiency || 'Beginner';
      }
    } catch (e) {}
    $('personalBest').textContent = state.best;
    renderHighScores();
  }

  function saveProfile() {
    const profile = {
      attackerName: $('attackerName').value.trim() || 'Player',
      victimName: $('victimName').value.trim() || 'Victim Organisation',
      educationLevel: $('educationLevel').value,
      cyberProficiency: $('cyberProficiency').value
    };
    localStorage.setItem(STORAGE_PROFILE, JSON.stringify(profile));
    state.profile = profile;
    return profile;
  }

  function startMusic() {
    if (!$('musicToggle').checked) return;
    try {
      if (!state.audioCtx) state.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const ctx = state.audioCtx;
      if (state.musicNodes) return;
      const gain = ctx.createGain();
      gain.gain.value = 0.018;
      const osc = ctx.createOscillator();
      osc.type = 'triangle';
      osc.frequency.value = 164.81;
      const lfo = ctx.createOscillator();
      const lfoGain = ctx.createGain();
      lfo.frequency.value = 2.2;
      lfoGain.gain.value = 7;
      lfo.connect(lfoGain);
      lfoGain.connect(osc.frequency);
      osc.connect(gain).connect(ctx.destination);
      osc.start();
      lfo.start();
      state.musicNodes = { osc, lfo, gain };
    } catch (e) {}
  }

  function stopMusic() {
    if (state.musicNodes) {
      try { state.musicNodes.osc.stop(); state.musicNodes.lfo.stop(); } catch (e) {}
      state.musicNodes = null;
    }
  }

  function updateHud() {
    $('scoreNow').textContent = state.score;
    $('roundNow').textContent = state.round;
    $('personalBestGame').textContent = state.best;
    $('timerText').textContent = state.timeLeft;
    $('timerBar').style.width = `${Math.max(0, (state.timeLeft / state.timerMax) * 100)}%`;
    $('playerTag').textContent = state.profile ? state.profile.attackerName : 'Player';
    $('victimTag').textContent = state.profile ? state.profile.victimName : 'Victim';
    const half = state.timeLeft <= Math.ceil(state.timerMax / 2);
    document.body.classList.toggle('game-pressure', half && state.running);
  }

  function conditionChips(conditions) {
    return Object.keys(CONDITIONS).map(c => `<span class="game-condition-chip ${conditions.includes(c) ? 'active' : ''}">${c}</span>`).join('');
  }

  function injectNames(prompt) {
    const p = state.profile || {attackerName:'X', victimName:'Y'};
    return prompt.replaceAll('X', p.attackerName || 'X').replaceAll('Y', p.victimName || 'Y');
  }

  function renderQuestion() {
    const q = state.current;
    state.selected.clear();
    $('questionPrompt').textContent = injectNames(q.prompt);
    $('questionMeta').textContent = q.type === 'multi' ? 'Select all correct options, then press Submit.' : 'Choose one answer.';
    $('answerGrid').innerHTML = '';
    $('submitAnswer').hidden = q.type !== 'multi';
    const answers = shuffle(q.answers);
    answers.forEach(ans => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'answer-button';
      btn.dataset.answer = ans.id;
      btn.textContent = ans.text;
      btn.addEventListener('click', () => onAnswerClick(q, btn));
      $('answerGrid').appendChild(btn);
    });
    const attack = Object.keys(ATTACK_CONDITIONS).find(a => q.prompt.includes(a)) || '';
    $('conditionStrip').innerHTML = attack ? conditionChips(ATTACK_CONDITIONS[attack]) : conditionChips([]);
  }

  function onAnswerClick(q, btn) {
    const value = btn.dataset.answer;
    if (q.type === 'multi') {
      if (state.selected.has(value)) {
        state.selected.delete(value);
        btn.classList.remove('selected');
      } else {
        state.selected.add(value);
        btn.classList.add('selected');
      }
      return;
    }
    state.selected = new Set([value]);
    submitCurrentAnswer();
  }

  function submitCurrentAnswer() {
    const q = state.current;
    const selected = Array.from(state.selected);
    if (!selected.length) return;
    const ok = normaliseAnswers(selected) === normaliseAnswers(q.correct);
    if (ok) correctAnswer(); else wrongAnswer(q, selected);
  }

  function correctAnswer() {
    state.score += 1;
    if (state.score > state.best) {
      state.best = state.score;
      localStorage.setItem(STORAGE_BEST, String(state.best));
    }
    pulse('correct');
    nextRound();
  }

  function wrongAnswer(q, selected) {
    clearInterval(state.timer);
    state.running = false;
    stopMusic();
    document.body.classList.remove('game-pressure');
    saveScore();
    const correctText = q.correct.join(', ');
    $('feedbackTitle').textContent = 'Round failed. Score reset.';
    $('feedbackBody').innerHTML = `<p><strong>Correct answer:</strong> ${escapeHtml(correctText)}</p><p>${escapeHtml(q.explanation)}</p>`;
    $('feedbackLink').href = q.learnMore || 'index.html';
    $('feedbackLink').textContent = q.learnMore && q.learnMore.includes('mitigation') ? 'Read more about mitigation strategies' : 'Review the relevant D-ACT page';
    $('feedbackOverlay').hidden = false;
    state.score = 0;
    updateHud();
  }

  function timeoutFail() {
    wrongAnswer(state.current, []);
  }

  function pulse(kind) {
    const card = $('gameCard');
    card.classList.remove('pulse-correct');
    void card.offsetWidth;
    card.classList.add('pulse-correct');
  }

  function nextRound() {
    clearInterval(state.timer);
    if (!state.questions.length) state.questions = shuffle(QUESTION_BANK);
    state.round += 1;
    state.current = state.questions.pop();
    state.timerMax = roundSeconds(state.round);
    state.timeLeft = state.timerMax;
    renderQuestion();
    updateHud();
    state.running = true;
    state.timer = setInterval(() => {
      state.timeLeft -= 1;
      updateHud();
      if (state.timeLeft <= 0) timeoutFail();
    }, 1000);
  }

  function startGame() {
    saveProfile();
    state.questions = shuffle(QUESTION_BANK);
    state.round = 0;
    state.score = 0;
    $('onboardingPanel').hidden = true;
    $('gamePlayPanel').hidden = false;
    $('feedbackOverlay').hidden = true;
    startMusic();
    nextRound();
  }

  function restartGame() {
    $('feedbackOverlay').hidden = true;
    state.questions = shuffle(QUESTION_BANK);
    state.round = 0;
    state.score = 0;
    startMusic();
    nextRound();
  }

  function saveScore() {
    const profile = state.profile || saveProfile();
    const scores = getScores();
    if (state.score > 0) {
      scores.push({ name: profile.attackerName, victim: profile.victimName, score: state.score, at: new Date().toISOString() });
      scores.sort((a,b) => b.score - a.score);
      localStorage.setItem(STORAGE_SCORES, JSON.stringify(scores.slice(0,10)));
      renderHighScores();
    }
  }

  function getScores() {
    try { return JSON.parse(localStorage.getItem(STORAGE_SCORES) || '[]'); } catch (e) { return []; }
  }

  function renderHighScores() {
    const scores = getScores();
    const table = $('highScoreList');
    if (!table) return;
    if (!scores.length) {
      table.innerHTML = '<li>No local scores yet. Start a game to set the first score.</li>';
      return;
    }
    table.innerHTML = scores.map((s,i) => `<li><strong>#${i+1} ${escapeHtml(s.name)}</strong> — ${s.score} rounds <span>${new Date(s.at).toLocaleString()}</span></li>`).join('');
  }

  function escapeHtml(s) {
    return String(s).replace(/[&<>"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
  }

  function bindTabs() {
    document.querySelectorAll('.game-tab').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.game-tab').forEach(b => b.classList.remove('active'));
        document.querySelectorAll('.game-tab-panel').forEach(p => p.hidden = true);
        btn.classList.add('active');
        const target = $(btn.dataset.target);
        if (target) target.hidden = false;
      });
    });
  }

  function renderQuestionBankSummary() {
    const el = $('questionBankSummary');
    const counts = QUESTION_BANK.reduce((acc,q)=>{ acc[q.type]=(acc[q.type]||0)+1; return acc; },{});
    el.innerHTML = `<strong>${QUESTION_BANK.length}</strong> questions loaded. Condition questions: ${counts.multi || 0}. Single-choice scenario, mitigation, and mapping questions: ${counts.single || 0}.`;
  }

  document.addEventListener('DOMContentLoaded', () => {
    loadProfile();
    bindTabs();
    renderQuestionBankSummary();
    $('startGame').addEventListener('click', startGame);
    $('submitAnswer').addEventListener('click', submitCurrentAnswer);
    $('restartGame').addEventListener('click', restartGame);
    $('closeFeedback').addEventListener('click', restartGame);
    $('muteMusic').addEventListener('click', () => { stopMusic(); $('musicToggle').checked = false; });
    $('clearLocalScores').addEventListener('click', () => { localStorage.removeItem(STORAGE_SCORES); localStorage.removeItem(STORAGE_BEST); state.best = 0; renderHighScores(); updateHud(); });
  });
})();
