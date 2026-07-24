---
status: accepted
---

# Trio app connections: independent apps, cross-promotion only

Context: with three separate apps (Clarity-in-Calm, Dreami, ClarityAI) sharing a visual
identity direction (ADR-0001), issue #29 asked how they're practically/logically connected as
a family — shared accounts, cross-app data, or just links. Resolved via `/grilling` on #29.

Decision:

1. **No shared identity/data.** Each app keeps its own independent Supabase project; no SSO, no
   cross-project data access is built. Unifying three already-shipped, working backends into
   shared identity would be a significant infra project (auth migration, cross-project RLS,
   data-sharing consent/privacy design) not justified without a concrete product reason (e.g. a
   unified subscription), which doesn't currently exist.
2. **ClarityAI's existing "Connect" screen** (two cards for "Clarity-in-Calm" and "Dreami" as
   data sources, found during the #26 audit) is left as-is for now — deliberately out of scope
   for this trio-wide spec. It conflicts with decision 1 as currently implemented, but resolving
   it is deferred to ClarityAI's own `/grill-with-docs` session.
3. **Connections are cross-promotion only** — e.g. a "More from us" section linking to the other
   two apps' store listings. Deep-linking (URL schemes so one app can open another directly) is
   explicitly out of scope.

**Scope/sequencing**: same as ADR-0001 — recorded here in `clarity-in-calm`, handed to Dreami
and ClarityAI as `/to-spec` input for their own `/to-tickets` → `/implement` cycles.

## Considered options

- **Shared identity/data across all three apps** — rejected; cost (rebuilding three working auth
  systems into one, designing cross-app data-sharing/consent) outweighs the benefit given no
  concrete product driver currently exists.
- **Cross-promotion + deep-linking** — rejected for now; deep-linking requires URL-scheme
  registration and handling in all three apps for a benefit (skip-the-store-listing) not judged
  worth the added surface area yet.

## Consequences

- ClarityAI's "Connect" screen UI currently implies data-sharing capability that this ADR
  explicitly decided not to build — that repo's own grilling session needs to resolve the
  mismatch (repurpose as cross-promotion, remove, or something else).
- Any future push toward shared accounts/data would need its own ADR superseding this one, since
  it reverses a real architectural boundary rather than just adding a feature.
