---
status: accepted
---

# Trio shared visual identity: per-app color, shared structure

Context: Clarity-in-Calm, Dreami, and ClarityAI (three separate apps/repos) currently don't
read as siblings — a visual audit (issue #26) found each app doing color, iconography,
typography, and card surfaces differently, with no shared design language. Resolved via
`/grilling` on issue #28.

Decision, resolved as five sub-decisions:

1. **Color**: each app keeps its own base hue — no forced single palette across the trio.
2. **Elevation/hierarchy**: all three adopt Dreami's pattern (glow/halo on the primary CTA,
   tinted icon-chip rows, clear depth cues separating primary actions from ambient content) —
   chosen because Dreami is the only one of the three the audit found doing hierarchy well;
   Clarity-in-Calm and ClarityAI were both independently flagged for the same flat/monochrome
   problem, so it's cheaper to import a working pattern into two apps than to invent a new one.
3. **Iconography**: standardize on Ionicons across all three; eliminate emoji-as-UI; replace
   flag-emoji language switchers with text-based locale pills (e.g. "EN / KO / ES") — flags are
   a known-bad language-selection pattern (a flag represents a country, not a language) and this
   was the one finding identical across all three apps.
4. **Typography**: one shared custom display/heading typeface across all three apps (body text
   stays system font). The specific typeface is deliberately **not** chosen here — deferred to a
   future `/prototype` pass, since font choice needs a visual answer, not a conversational one.
5. **Surface/shape mechanic**: flat cards everywhere, carrying the glow/tint elevation cues from
   (2); ClarityAI's glassmorphism/frosted-glass surfaces are retired. Glass surfaces get their
   depth from blur/translucency, which conflicts mechanically with glow-and-chip elevation cues,
   and the audit already flagged ClarityAI's glass treatment as an inconsistent stray choice
   sitting on top of the same flat cream/sage palette Clarity-in-Calm uses.

**Scope/sequencing**: this ADR is written once, here in `clarity-in-calm` (the repo holding the
trio-wide tracking issues #25/#28/#29). It is then handed to Dreami and ClarityAI as `/to-spec`
input for their own independent `/to-tickets` → `/implement` cycles — this repo does not drive
implementation in the other two.

## Considered options

- **Dark (Dreami's palette) or light (cream/sage) as a single shared color for all three** —
  rejected in favor of per-app color, since forcing one palette wasn't necessary once the real
  complaint (lack of hierarchy, not color itself) was separated out as its own sub-decision.
- **Keep glassmorphism as the shared surface mechanic**, re-deriving elevation cues to work
  within glass — rejected because it would mean redesigning cues already proven to work on flat
  surfaces (Dreami's), for the benefit of the one app (ClarityAI) already flagged as
  inconsistent.

## Consequences

- Dreami's card/elevation implementation becomes the reference to port into Clarity-in-Calm and
  ClarityAI — not the reverse.
- ClarityAI's existing glassmorphism components will need to be replaced, not incrementally
  adapted.
- The heading typeface remains an open follow-up (`/prototype`) before full visual convergence
  is complete.
