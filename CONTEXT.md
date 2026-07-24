# Context

## Glossary

### Shared visual identity (trio)

The umbrella goal (tracked as issue #28, part of the trio brand/identity map #25) of making
Clarity-in-Calm, Dreami, and ClarityAI read as sibling apps. Decomposed into five independent
sub-decisions, each resolved separately rather than as one verdict:

1. **Color/theme** — light (cream/sage, currently Clarity-in-Calm + ClarityAI) vs. dark
   (navy/indigo, currently Dreami) vs. per-app base color with a shared structural language.
2. **Iconography** — the icon set and language switcher pattern (currently fragmented: emoji +
   Ionicons + custom logos mixed within single screens across all three apps).
3. **Typography** — display/heading typeface (currently: system default sans in all three, no
   distinct face anywhere).
4. **Surface/elevation treatment** — how depth and hierarchy are communicated (flat outlined
   cards in Clarity-in-Calm/ClarityAI vs. Dreami's glow/tinted-icon-chip/elevation cues).
5. **Component shape language** — the rendering mechanism itself (flat cards vs. ClarityAI's
   glassmorphism/frosted-glass surfaces) — a different concern from elevation, since two apps
   could share an elevation *philosophy* while still rendering it through different surface
   mechanics.

Source: trio visual audit, issue #26 (closed 2026-07-24), comments from all three apps.
All five sub-decisions resolved via `/grilling` on issue #28 — see
[ADR-0001](docs/adr/0001-trio-shared-visual-identity.md).
