# Specification Quality Checklist: Replacements & Rotations

**Created**: 2026-09-10 · **Feature**: [spec.md](../spec.md)

## Content Quality
- [X] No implementation details (languages, frameworks, APIs)
- [X] Focused on user value and business needs
- [X] Written for non-technical stakeholders
- [X] All mandatory sections completed

## Requirement Completeness
- [X] No [NEEDS CLARIFICATION] markers remain
- [X] Requirements are testable and unambiguous
- [X] Success criteria are measurable
- [X] Success criteria are technology-agnostic
- [X] All acceptance scenarios are defined
- [X] Edge cases are identified
- [X] Scope is clearly bounded
- [X] Dependencies and assumptions identified

## Feature Readiness
- [X] All functional requirements have clear acceptance criteria
- [X] User scenarios cover primary flows
- [X] Feature meets measurable outcomes defined in Success Criteria
- [X] No implementation details leak into specification

## Notes

- **FR-004 and SC-002 close a standing constitutional gap.** Principle V has
  required the guarantee's exclusions to appear in the customer's contract view
  since 001, and no feature had met it. This one does.
- **The two kinds are opposite promises and the spec keeps them apart.**
  Replacement is free and unlimited because it is the product's central claim;
  rotation is counted because the research shows unlimited seasonal swapping is
  uneconomic. FR-007 states explicitly that exhausting rotations must not block
  a replacement — the failure mode that would quietly meter the guarantee.
- **SC-003 forces the derived-count design.** A stored counter would satisfy the
  requirement on the happy path and lie after the first declined request.
- **Scope**: quantity changes, adding or removing plants, and re-pricing a live
  subscription are named as out.
