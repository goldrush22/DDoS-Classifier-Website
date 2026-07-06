# Build Your Own Attack validation

Implemented a new static `builder.html` page and `assets/builder.js` visual sandbox.

Validation performed:

- Added navigation link to all HTML pages.
- Added condition palette for C0-C6.
- Added nine attack templates: DoS, DDoS, LDoS, LDDoS, EDoS_S, EDoS_D, DoW, DDoW and DoA.
- Added concurrent attack lanes aimed at one victim.
- Added click/drag condition assignment to active lane.
- Added click/drag actor/infrastructure assignment.
- Added technical controls that visually reduce flow pressure.
- Added draggable victim node.
- Added scenario JSON export.
- Confirmed builder.js parses under Node.

Safety framing: the builder is purely visual and does not generate traffic, replay packets, invoke cloud/serverless services, or execute attacks.
