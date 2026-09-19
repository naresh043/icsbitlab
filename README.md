# ICSGuard — Industrial Cybersecurity Platform

A polished React/Vite concept created for a Frontend + UX Design Challenge focused on an industrial / operational-technology cybersecurity platform.

## Included

- High-fidelity security dashboard
- Global search, site/time/severity filtering
- Security posture and severity visualizations
- Asset visibility and site risk
- Attack path preview
- Interactive Attack Path Map
- Investigation side panel
- Network/topology snapshot
- Platform/sensor health
- Recent changes timeline
- Normal, high-risk, degraded, unknown, empty and large-data states
- Keyboard-focus friendly controls and non-colour status cues
- Responsive desktop/tablet/mobile adaptation

## Run locally

```bash
npm install
npm run dev
```

Then open the local Vite URL shown in the terminal.

## Build

```bash
npm run build
```

## Design decisions

The experience uses an orange / black / white base palette, with restrained supporting status colors. Information is prioritized around posture, urgency, recent change, critical assets and attack-path exposure. The attack-path experience is treated as an investigation workspace rather than a decorative graph, with path selection, evidence, confidence, node context and risk.

The brief asks candidates to prioritize judgement over pixel volume and explicitly calls for handling uncertainty, partial/degraded data, large data volumes and accessibility. This implementation includes representative states and progressive-disclosure patterns for those requirements.

> Note: All product names, metrics, asset names and operational data in this concept are fictional and intended only for demonstration.
